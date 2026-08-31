#!/usr/bin/env python3
"""Parse weekly roster + UPCOMING TRIALS into production SQL.

Attendance Master.xlsx is the current weekly class list (Tue/Fri/Sat/Sun
slots × class-type columns). UPCOMING TRIALS (from Attendance_Master_List.xlsx)
are venue trial bookings; attended rows get an event session and present
attendance against a 1-credit trial pack.
"""

from __future__ import annotations

import argparse
import re
import uuid
from datetime import datetime, date
from pathlib import Path

from openpyxl import load_workbook

NS = uuid.UUID("a1b2c3d4-e5f6-7890-abcd-ef1234567890")


def sql_str(value: str | None) -> str:
    if value is None:
        return "null"
    return "'" + value.replace("'", "''") + "'"


def sql_date(d: date | None) -> str:
    if d is None:
        return "null"
    return f"'{d.isoformat()}'"


def add_months(d: date, months: int) -> date:
    month = d.month - 1 + months
    year = d.year + month // 12
    month = month % 12 + 1
    day = min(
        d.day,
        [
            31,
            29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31,
        ][month - 1],
    )
    return date(year, month, day)


def upsert_student(
    students: dict, full_name: str, skill: str | None, notes: str | None, is_trial: bool
) -> str:
    sid = str(uuid.uuid5(NS, f"student:{full_name.casefold()}"))
    existing = students.get(sid)
    if existing:
        if notes and (not existing["notes"] or notes not in existing["notes"]):
            existing["notes"] = "; ".join(x for x in (existing["notes"], notes) if x)
        if skill and not existing["skill_level"]:
            existing["skill_level"] = skill
        existing["is_trial"] = existing["is_trial"] or is_trial
    else:
        students[sid] = {
            "id": sid,
            "full_name": full_name,
            "skill_level": skill,
            "is_trial": is_trial,
            "notes": notes,
            "payer_id": None,
        }
    return sid

SKIP_STUDENT_NAMES = {
    "name",
    "usual",
    "coach",
    "training",
    "legends",
    "rentals",
}
TIME_RE = re.compile(r"^(\d{1,2})\s*(am|pm)$", re.I)
NUMBERED_RE = re.compile(r"^\d+\.?$")
DAY_RE = re.compile(
    r"\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b", re.I
)
VENUE_NAMES = ("Bukit Batok", "Boon Keng", "Khatib", "Stadium")
TRIALS_SHEET = "UPCOMING TRIALS"
DEFAULT_VENUE = "Stadium"


def parse_clock(raw: str) -> tuple[str, str] | None:
    m = TIME_RE.match(raw.strip())
    if not m:
        return None
    hour = int(m.group(1))
    mer = m.group(2).lower()
    if hour == 12:
        hour24 = 0 if mer == "am" else 12
    else:
        hour24 = hour + 12 if mer == "pm" else hour
    start = f"{hour24:02d}:00"
    end_h = (hour24 + 1) % 24
    end = f"{end_h:02d}:00"
    return start, end


def clean_student_name(raw: str) -> tuple[str, list[str]]:
    text = re.sub(r"\s+", " ", str(raw)).strip(" .")
    notes: list[str] = []
    if re.search(r"\(P\)", text, re.I):
        notes.append("Private (master list)")
        text = re.sub(r"\s*\(P\)", "", text, flags=re.I).strip()
    if re.search(r"\(T\)", text, re.I):
        notes.append("Trial (master list)")
        text = re.sub(r"\s*\(T\)", "", text, flags=re.I).strip()
    return text, notes


def is_skip_name(name: str) -> bool:
    key = name.casefold().strip()
    return not key or key in SKIP_STUDENT_NAMES


def parse_venue_and_label(raw: str) -> tuple[str, str]:
    text = re.sub(r"\s+", " ", raw).strip()
    venue = DEFAULT_VENUE
    for name in VENUE_NAMES:
        if re.search(re.escape(name), text, re.I):
            venue = name
            text = re.sub(re.escape(name), "", text, flags=re.I)
            text = re.sub(r"\s+", " ", text).strip(" -")
            break
    return venue, text or "Class"


def parse_attendance_master(
    ws,
) -> tuple[list[dict], dict[str, dict], set[tuple[str, str]]]:
    classes: dict[str, dict] = {}
    students: dict[str, dict] = {}
    enrolments: set[tuple[str, str]] = set()
    day: str | None = None
    current_slots: dict[int, str] = {}

    for row in range(1, (ws.max_row or 1) + 1):
        b = ws.cell(row, 2).value
        title_bits = " ".join(str(ws.cell(row, c).value or "") for c in range(1, 8))
        if re.search(r"legend", title_bits, re.I):
            break
        day_match = DAY_RE.search(title_bits)
        if day_match and re.search(r"at+endance", title_bits, re.I):
            day = day_match.group(1).lower()
            current_slots = {}
            continue

        if not day:
            continue

        b_text = str(b).strip() if b not in (None, "") else ""
        clock = parse_clock(b_text) if b_text else None
        first_name_col = str(ws.cell(row, 3).value or "").strip()

        if clock and not NUMBERED_RE.match(first_name_col):
            start, end = clock
            current_slots = {}
            slot_counts: dict[tuple[str, str], int] = {}
            for col in range(3, (ws.max_column or 3) + 1):
                type_raw = ws.cell(row, col).value
                if type_raw in (None, ""):
                    continue
                label_raw = re.sub(r"\s+", " ", str(type_raw)).strip()
                if not label_raw or NUMBERED_RE.match(label_raw):
                    continue
                venue, label = parse_venue_and_label(label_raw)
                key = (venue.casefold(), label.casefold())
                slot_counts[key] = slot_counts.get(key, 0) + 1
                n = slot_counts[key]
                suffix = f" ({n})" if n > 1 else ""
                display = f"{label}{suffix}"
                class_id = str(
                    uuid.uuid5(
                        NS, f"class:{venue}:{day}:{start}:{display.casefold()}"
                    )
                )
                name = display
                classes[class_id] = {
                    "id": class_id,
                    "name": name,
                    "venue": venue,
                    "day_of_week": day,
                    "start_time": start,
                    "end_time": end,
                }
                current_slots[col] = class_id
            continue

        if not NUMBERED_RE.match(b_text):
            continue

        for col, class_id in current_slots.items():
            raw = ws.cell(row, col).value
            if raw in (None, ""):
                continue
            full_name, extra_notes = clean_student_name(str(raw))
            if is_skip_name(full_name) or NUMBERED_RE.match(full_name):
                continue
            notes = "; ".join(extra_notes) or None
            is_trial = any("Trial" in n for n in extra_notes)
            sid = upsert_student(students, full_name, None, notes, is_trial)
            enrolments.add((sid, class_id))

    enrolled_ids = {cid for _sid, cid in enrolments}
    class_list = [c for c in classes.values() if c["id"] in enrolled_ids]
    return class_list, students, enrolments


def split_trial_names(raw: str) -> list[str]:
    text = re.sub(r"\s+", " ", raw).strip()
    parts = re.split(r"\s*(?:&|\+|/|,)\s*", text)
    names = [p.strip(" .") for p in parts if p.strip(" .")]
    return names or [text]


def parse_trial_ages(raw) -> list[str]:
    if raw in (None, ""):
        return []
    if isinstance(raw, (int, float)):
        n = int(raw) if float(raw).is_integer() else raw
        return [str(n)]
    return [p.strip() for p in re.split(r"\s*,\s*", str(raw).strip()) if p.strip()]


def parse_upcoming_trials(
    ws, students: dict[str, dict]
) -> tuple[list[dict], dict[str, dict], list[dict], list[tuple[str, str]]]:
    packages: list[dict] = []
    sessions: dict[str, dict] = {}
    attendance: list[dict] = []
    includes: list[tuple[str, str]] = []
    venue = None

    for row in range(1, (ws.max_row or 1) + 1):
        c = ws.cell(row, 3).value
        d = ws.cell(row, 4).value
        c_text = str(c).strip() if c not in (None, "") else ""
        if c_text and str(d).strip().lower() == "date":
            venue = c_text
            continue
        if not venue or not c_text:
            continue
        if c_text.lower() in ("stadium", "khatib", "boon keng", "bukit batok"):
            continue

        lesson_date = None
        if isinstance(d, datetime):
            lesson_date = d.date()
        elif isinstance(d, date):
            lesson_date = d
        time_raw = ws.cell(row, 5).value
        clock = parse_clock(str(time_raw)) if time_raw not in (None, "") else None
        if lesson_date is None or clock is None:
            continue
        start, end = clock
        rentals = ws.cell(row, 6).value
        ages = parse_trial_ages(ws.cell(row, 7).value)
        status = ws.cell(row, 9).value
        attended = str(status).strip().lower() == "attended" if status else False

        names = split_trial_names(c_text)
        session_id = str(
            uuid.uuid5(
                NS,
                f"session:trial:{venue}:{lesson_date.isoformat()}:{start}:{c_text.casefold()}",
            )
        )
        sessions[session_id] = {
            "id": session_id,
            "name": f"Trial — {c_text} ({venue})",
            "session_date": lesson_date,
            "venue": venue,
            "start_time": start,
            "end_time": end,
        }

        for i, full_name in enumerate(names):
            note_bits = ["Imported from UPCOMING TRIALS"]
            if rentals not in (None, "") and str(rentals).strip().upper() != "NIL":
                note_bits.append(f"Rentals: {str(rentals).strip()}")
            if i < len(ages) and ages[i] not in ("?",):
                note_bits.append(f"Age (approx): {ages[i]}")
            elif len(ages) == 1 and len(names) == 1 and ages[0] not in ("?",):
                note_bits.append(f"Age (approx): {ages[0]}")
            notes = "; ".join(note_bits)
            sid = upsert_student(students, full_name, "beginner", notes, True)
            package_id = str(
                uuid.uuid5(NS, f"package:trial:{venue}:{row}:{full_name.casefold()}")
            )
            first = lesson_date if attended else None
            expires = add_months(first, 6) if first else None
            packages.append(
                {
                    "id": package_id,
                    "student_id": sid,
                    "payer_id": None,
                    "product_type": "trial_group",
                    "total_credits": 1,
                    "used_credits": 1 if attended else 0,
                    "amount_sgd": 25,
                    "first_lesson_date": first,
                    "expires_at": expires,
                    "informed_at": "null",
                    "customisation_notes": notes,
                    "catalog_credits": 1,
                    "is_paid": attended,
                }
            )
            includes.append((session_id, sid))
            if attended:
                attendance.append(
                    {
                        "id": str(
                            uuid.uuid5(
                                NS,
                                f"attendance:{package_id}:{sid}:{lesson_date.isoformat()}",
                            )
                        ),
                        "session_id": session_id,
                        "student_id": sid,
                        "package_id": package_id,
                        "marked_at": f"{lesson_date.isoformat()} {start}:00+08",
                    }
                )

    return packages, sessions, attendance, includes


def emit_sql(data) -> str:
    lines = [
        "-- Generated from Attendance Master.xlsx + UPCOMING TRIALS.",
        "-- Replaces every class. Event sessions (including trials) are kept.",
        "begin;",
        "",
        "-- Drop existing classes (and their sessions / attendance / enrolments)",
        "delete from attendance a",
        "using sessions s",
        "where a.session_id = s.id",
        "  and s.class_id is not null;",
        "",
        "delete from sessions",
        "where class_id is not null;",
        "",
        "delete from classes;",
        "",
        "-- Classes (weekly roster from Attendance Master.xlsx)",
    ]
    for c in data["classes"]:
        lines.append(
            "insert into classes (id, name, day_of_week, start_time, end_time, is_active, venue_id, coach_id)\n"
            f"select {sql_str(c['id'])}, {sql_str(c['name'])}, {sql_str(c['day_of_week'])}, "
            f"{sql_str(c['start_time'])}::time, {sql_str(c['end_time'])}::time, true, v.id, null\n"
            f"from venues v where v.name = {sql_str(c['venue'])}\n"
            "on conflict (id) do update set name = excluded.name, venue_id = excluded.venue_id, "
            "coach_id = excluded.coach_id;"
        )
    lines.append("")

    lines.append("-- Students")
    for s in data["students"].values():
        skill = sql_str(s["skill_level"]) if s["skill_level"] else "null"
        payer = sql_str(s["payer_id"]) if s["payer_id"] else "null"
        trial = "true" if s["is_trial"] else "false"
        lines.append(
            "insert into students (id, full_name, skill_level, is_trial, notes, payer_id)\n"
            f"values ({sql_str(s['id'])}, {sql_str(s['full_name'])}, {skill}, {trial}, {sql_str(s['notes'])}, {payer})\n"
            "on conflict (id) do update set full_name = excluded.full_name, "
            "skill_level = coalesce(excluded.skill_level, students.skill_level), "
            "is_trial = students.is_trial or excluded.is_trial, "
            "notes = coalesce(excluded.notes, students.notes), "
            "payer_id = coalesce(excluded.payer_id, students.payer_id);"
        )
    lines.append("")

    lines.append("-- Enrolments")
    for sid, cid in sorted(data["enrolments"]):
        lines.append(
            "insert into enrolments (student_id, class_id)\n"
            f"values ({sql_str(sid)}, {sql_str(cid)})\n"
            "on conflict (student_id, class_id) do nothing;"
        )
    lines.append("")

    lines.append("-- Trial packages")
    for p in data["packages"]:
        amount = "null" if p["amount_sgd"] is None else str(p["amount_sgd"])
        paid = "true" if p["is_paid"] else "false"
        method = "'paynow'" if p["is_paid"] else "null"
        lines.append(
            "insert into packages (\n"
            "  id, student_id, payer_id, package_product_id, total_credits, used_credits,\n"
            "  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,\n"
            "  informed_at, customisation_notes\n"
            ")\n"
            "select\n"
            f"  {sql_str(p['id'])},\n"
            f"  {sql_str(p['student_id'])},\n"
            "  null,\n"
            "  pp.id,\n"
            f"  {p['total_credits']},\n"
            f"  {p['used_credits']},\n"
            f"  {paid},\n"
            f"  {method},\n"
            f"  coalesce({amount}::numeric, pp.amount_sgd),\n"
            f"  {sql_date(p['first_lesson_date'])},\n"
            f"  {sql_date(p['expires_at'])},\n"
            f"  {p['informed_at']},\n"
            f"  {sql_str(p['customisation_notes'])}\n"
            "from package_products pp\n"
            f"where pp.product_type = {sql_str(p['product_type'])}\n"
            f"  and pp.total_credits = {p['catalog_credits']}\n"
            "order by pp.sort_order\n"
            "limit 1\n"
            "on conflict (id) do update set\n"
            "  used_credits = excluded.used_credits,\n"
            "  total_credits = excluded.total_credits,\n"
            "  first_lesson_date = excluded.first_lesson_date,\n"
            "  expires_at = excluded.expires_at,\n"
            "  customisation_notes = excluded.customisation_notes;"
        )
    lines.append("")

    lines.append("-- Trial event sessions")
    for s in data["sessions"].values():
        venue = sql_str(s["venue"])
        lines.append(
            "insert into sessions (\n"
            "  id, class_id, kind, name, requires_attendance,\n"
            "  session_date, venue_id, start_time, end_time, cancelled\n"
            ")\n"
            "select\n"
            f"  {sql_str(s['id'])},\n"
            "  null,\n"
            "  'event',\n"
            f"  {sql_str(s['name'])},\n"
            "  true,\n"
            f"  {sql_date(s['session_date'])},\n"
            "  v.id,\n"
            f"  {sql_str(s['start_time'])}::time,\n"
            f"  {sql_str(s['end_time'])}::time,\n"
            "  false\n"
            f"from venues v where v.name = {venue}\n"
            "on conflict (id) do update set\n"
            "  name = excluded.name,\n"
            "  session_date = excluded.session_date,\n"
            "  venue_id = excluded.venue_id,\n"
            "  start_time = excluded.start_time,\n"
            "  end_time = excluded.end_time;"
        )
    lines.append("")

    lines.append("-- Trial walk-in roster (include overrides)")
    for session_id, sid in data["includes"]:
        oid = str(uuid.uuid5(NS, f"override:{session_id}:{sid}"))
        lines.append(
            "insert into session_attendee_overrides (id, session_id, student_id, kind)\n"
            f"values ({sql_str(oid)}, {sql_str(session_id)}, {sql_str(sid)}, 'include')\n"
            "on conflict (session_id, student_id) do update set kind = 'include';"
        )
    lines.append("")

    lines.append("-- Attended trials")
    for a in data["attendance"]:
        lines.append(
            "insert into attendance (\n"
            "  id, session_id, student_id, status, attendee_source,\n"
            "  deduct_credit, package_id, marked_at\n"
            ")\n"
            f"values (\n"
            f"  {sql_str(a['id'])},\n"
            f"  {sql_str(a['session_id'])},\n"
            f"  {sql_str(a['student_id'])},\n"
            "  'present',\n"
            "  'one_off',\n"
            "  true,\n"
            f"  {sql_str(a['package_id'])},\n"
            f"  {sql_str(a['marked_at'])}::timestamptz\n"
            ")\n"
            "on conflict (session_id, student_id) do update set\n"
            "  status = 'present',\n"
            "  deduct_credit = true,\n"
            "  package_id = excluded.package_id,\n"
            "  marked_at = excluded.marked_at;"
        )
    lines.append("")

    lines.append("-- Restore trial credit counts (undo attendance triggers)")
    for p in data["packages"]:
        lines.append(
            "update packages\n"
            f"set used_credits = {p['used_credits']},\n"
            f"    first_lesson_date = {sql_date(p['first_lesson_date'])},\n"
            f"    expires_at = {sql_date(p['expires_at'])}\n"
            f"where id = {sql_str(p['id'])};"
        )
    lines += ["", "commit;"]
    return "\n".join(lines) + "\n"


def parse_workbooks(roster_path: Path, trials_path: Path):
    roster_wb = load_workbook(roster_path, data_only=True)
    roster_ws = roster_wb[roster_wb.sheetnames[0]]
    classes, students, enrolments = parse_attendance_master(roster_ws)

    trials_wb = load_workbook(trials_path, data_only=True)
    if TRIALS_SHEET not in trials_wb.sheetnames:
        raise SystemExit(
            f"Missing sheet {TRIALS_SHEET!r}. Found: {trials_wb.sheetnames}"
        )
    packages, sessions, attendance, includes = parse_upcoming_trials(
        trials_wb[TRIALS_SHEET], students
    )
    return {
        "classes": classes,
        "students": students,
        "enrolments": enrolments,
        "packages": packages,
        "sessions": sessions,
        "attendance": attendance,
        "includes": includes,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--roster",
        default="docs/Attendance Master.xlsx",
        help="Weekly class workbook (Attendance Master.xlsx)",
    )
    parser.add_argument(
        "--trials",
        default="docs/Attendance_Master_List.xlsx",
        help="Workbook that contains the UPCOMING TRIALS sheet",
    )
    parser.add_argument("-o", "--output", required=True)
    args = parser.parse_args()
    data = parse_workbooks(Path(args.roster), Path(args.trials))
    Path(args.output).write_text(emit_sql(data))
    print(
        f"Wrote {args.output}: "
        f"{len(data['students'])} students, {len(data['classes'])} classes, "
        f"{len(data['enrolments'])} enrolments, {len(data['packages'])} trial packages, "
        f"{len(data['sessions'])} trial sessions, {len(data['attendance'])} attended"
    )


if __name__ == "__main__":
    main()
