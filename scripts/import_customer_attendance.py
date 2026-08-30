#!/usr/bin/env python3
"""Parse the live Customer Attendance workbook into production SQL.

Reads venue sheets (Stadium, Khatib, Bukit Batok, Boon Keng) and
the Completed sheet (past finished packs).
"""

from __future__ import annotations

import argparse
import re
import uuid
from collections import defaultdict
from datetime import datetime, date, timedelta
from pathlib import Path

from openpyxl import load_workbook

NS = uuid.UUID("a1b2c3d4-e5f6-7890-abcd-ef1234567890")
VENUES = ["Stadium", "Khatib", "Boon Keng", "Bukit Batok"]
SKIP_NAMES = {
    "name",
    "package completed",
    "informed",
    "paid",
    "overshot",
    "package",
}
STATUS_RGB = {
    "FFFFFF00": "completed",
    "FF00B0F0": "informed",
    "FFE58EF5": "paid_next",
    "FFFF0000": "overshot",
}
LIST_PRICE = {
    ("group", 4): 130,
    ("group", 8): 250,
    ("group", 12): 350,
    ("freestyle", 4): 150,
    ("freestyle", 8): 290,
    ("freestyle", 12): 400,
    ("private", 4): 320,
    ("private", 8): 580,
    ("private", 12): 840,
    ("trial_group", 1): 25,
    ("trial_private", 1): 50,
}
VENUE_CLASS = {
    "Stadium": ("saturday", "10:00", "11:00", "Stadium Saturday 10AM"),
    "Khatib": ("sunday", "10:00", "11:00", "Khatib Sunday 10AM"),
    "Bukit Batok": ("sunday", "10:00", "11:00", "Bukit Batok Sunday 10AM"),
    "Boon Keng": ("sunday", "10:00", "11:00", "Boon Keng Sunday 10AM"),
}


def sql_str(value: str | None) -> str:
    if value is None:
        return "null"
    return "'" + value.replace("'", "''") + "'"


def sql_date(d: date | None) -> str:
    if d is None:
        return "null"
    return f"'{d.isoformat()}'"


def fill_status(cell) -> str | None:
    fill = cell.fill
    if not fill or fill.fgColor is None or fill.fgColor.type != "rgb":
        return None
    rgb = str(fill.fgColor.rgb).upper()
    if len(rgb) == 8:
        rgb = rgb[-8:]
    return STATUS_RGB.get(rgb)


def split_student_names(raw: str) -> list[str]:
    text = re.sub(r"\s+", " ", raw).strip()
    parts = re.split(r"\s*(?:,|/|\+)\s*", text)
    names = [p.strip(" .") for p in parts if p.strip(" .")]
    return names or [text]


def normalize_phone(raw: str) -> str | None:
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 8:
        return f"+65 {digits[:4]} {digits[4:]}"
    if len(digits) == 10 and digits.startswith("65"):
        return f"+65 {digits[2:6]} {digits[6:]}"
    return None


def parse_payer(raw) -> tuple[str | None, str | None, str]:
    if raw is None or str(raw).strip() == "":
        return None, None, "person"
    text = str(raw).strip()
    phone = normalize_phone(text)
    if phone and re.fullmatch(r"[\d\s+\-()]+", text):
        return None, phone, "person"
    kind = "company" if re.search(r"\b(pte|ltd|llc|inc)\b", text, re.I) else "person"
    return text, None, kind


def map_product(
    pkg_raw, session, used: int, remarks: str | None
) -> tuple[str, int, float | None, int, str | None]:
    label = (str(pkg_raw).strip() if pkg_raw else "").lower().replace(" ", "")
    notes = []
    if remarks:
        notes.append(remarks.strip())

    if label in ("560/24", "650/24"):
        amount = 560 if label.startswith("560") else 650
        notes.append(f"Imported custom {label} pack")
        return "group", 24, amount, 24, "; ".join(n for n in notes if n) or None

    if label in ("??", "?", ""):
        total = max(int(session) if isinstance(session, (int, float)) else 1, used or 1)
        catalog = total if total in (1, 4, 8, 12, 24) else 12
        notes.append("Imported with unknown package type")
        return "group", total, None, catalog, "; ".join(n for n in notes if n) or None

    if label.startswith("slalom"):
        ptype = "freestyle"
    elif label.startswith("private"):
        ptype = "private"
    else:
        ptype = "group"

    if isinstance(session, (int, float)) and int(session) > 0:
        total = int(session)
    else:
        total = used or 1

    if total == 1 and used > 1:
        total = used
        notes.append("Session size was 1; credits set from attendance dates")

    if total == 1:
        ptype = "trial_group" if ptype == "group" else "trial_private"
    catalog_credits = total if total in (1, 4, 8, 12, 24) else 12
    if ptype.startswith("trial") and catalog_credits != 1:
        ptype = "group" if ptype == "trial_group" else "private"
        catalog_credits = 4 if catalog_credits not in (4, 8, 12, 24) else catalog_credits
    amount = LIST_PRICE.get((ptype, catalog_credits if catalog_credits != 24 else 12))
    if total == 24:
        amount = None
    return ptype, total, amount, catalog_credits, "; ".join(n for n in notes if n) or None


def upsert_student(students: dict, full_name: str, skill: str | None, notes: str | None, is_trial: bool) -> str:
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


def add_months(d: date, months: int) -> date:
    month = d.month - 1 + months
    year = d.year + month // 12
    month = month % 12 + 1
    day = min(d.day, [31, 29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1])
    return date(year, month, day)


def parse_workbook(path: Path):
    values = load_workbook(path, data_only=True)
    styles = load_workbook(path, data_only=False)

    students: dict[str, dict] = {}
    payers: dict[str, dict] = {}
    packages: list[dict] = []
    memberships: list[tuple[str, str]] = []
    enrolments: set[tuple[str, str]] = set()

    for venue in VENUES:
        ws = values[venue]
        sw = styles[venue]
        day, start, end, class_name = VENUE_CLASS[venue]
        class_id = str(uuid.uuid5(NS, f"class:{venue}:{day}:{start}"))

        for row in range(1, ws.max_row + 1):
            name_raw = ws.cell(row, 4).value
            if name_raw is None:
                continue
            name_text = str(name_raw).strip()
            if not name_text or name_text.lower() in SKIP_NAMES:
                continue

            payer_name, payer_phone, payer_kind = parse_payer(ws.cell(row, 2).value)
            session = ws.cell(row, 3).value
            pkg_raw = ws.cell(row, 5).value
            remarks = ws.cell(row, 19).value
            remarks = str(remarks).strip() if remarks not in (None, "") else None
            status = fill_status(sw.cell(row, 4))

            dates: list[date] = []
            extra_notes = []
            for col in range(6, 18):
                cell = ws.cell(row, col).value
                if isinstance(cell, datetime):
                    dates.append(cell.date())
                elif isinstance(cell, date):
                    dates.append(cell)
                elif cell not in (None, ""):
                    extra_notes.append(str(cell).strip())

            used = len(dates)
            ptype, total, amount, catalog_credits, custom_notes = map_product(
                pkg_raw, session, used, remarks
            )
            note_bits = [n for n in (custom_notes, *extra_notes) if n]
            if status == "paid_next":
                note_bits.append("Spreadsheet marked Paid (likely next pack)")
            custom_notes = "; ".join(note_bits) or None

            names = split_student_names(name_text)
            student_ids = []
            skill = "freestyle" if ptype == "freestyle" else None
            for full_name in names:
                sid = upsert_student(
                    students, full_name, skill, remarks, ptype.startswith("trial")
                )
                student_ids.append(sid)
                enrolments.add((sid, class_id))

            payer_id = None
            if payer_name or payer_phone:
                pkey = (payer_name or "") + "|" + (payer_phone or "")
                payer_id = str(uuid.uuid5(NS, f"payer:{pkey.casefold()}"))
                payers[payer_id] = {
                    "id": payer_id,
                    "kind": payer_kind,
                    "display_name": payer_name,
                    "phone": payer_phone,
                }
                for sid in student_ids:
                    students[sid]["payer_id"] = payer_id

            first = min(dates) if dates else None
            expires = add_months(first, 6) if first else None
            package_id = str(uuid.uuid5(NS, f"package:{venue}:{row}:{name_text}"))
            informed_at = (
                "now()" if status == "informed" else "null"
            )
            packages.append(
                {
                    "id": package_id,
                    "student_id": student_ids[0],
                    "payer_id": payer_id,
                    "product_type": ptype,
                    "total_credits": total,
                    "used_credits": used,
                    "amount_sgd": amount,
                    "first_lesson_date": first,
                    "expires_at": expires,
                    "informed_at": informed_at,
                    "customisation_notes": custom_notes,
                    "is_trial_product": ptype.startswith("trial"),
                    "catalog_credits": catalog_credits,
                    "source": "current",
                }
            )
            for sid in student_ids:
                memberships.append((package_id, sid))

    completed_ids = parse_completed_sheet(values["Completed"], students, packages, memberships)

    classes = []
    for venue, (day, start, end, class_name) in VENUE_CLASS.items():
        classes.append(
            {
                "id": str(uuid.uuid5(NS, f"class:{venue}:{day}:{start}")),
                "name": class_name,
                "venue": venue,
                "day_of_week": day,
                "start_time": start,
                "end_time": end,
            }
        )

    return {
        "students": students,
        "payers": payers,
        "packages": packages,
        "memberships": memberships,
        "enrolments": enrolments,
        "classes": classes,
        "completed_ids": completed_ids,
    }


def parse_completed_sheet(ws, students, packages, memberships) -> set[str]:
    completed_ids: set[str] = set()
    for row in range(2, (ws.max_row or 1) + 1):
        name_raw = ws.cell(row, 2).value
        if name_raw is None:
            continue
        name_text = str(name_raw).strip()
        if not name_text or name_text.lower() in SKIP_NAMES:
            continue

        pkg_raw = ws.cell(row, 3).value
        if str(pkg_raw).strip().lower() == "no":
            pkg_raw = "Group"

        dates: list[date] = []
        for col in range(4, (ws.max_column or 4) + 1):
            cell = ws.cell(row, col).value
            if isinstance(cell, datetime):
                dates.append(cell.date())
            elif isinstance(cell, date):
                dates.append(cell)

        used = len(dates)
        if used == 0:
            continue

        ptype, total, amount, catalog_credits, custom_notes = map_product(
            pkg_raw, used, used, "Imported from Completed sheet"
        )
        total = used
        names = split_student_names(name_text)
        skill = "freestyle" if ptype == "freestyle" else None
        student_ids = [
            upsert_student(students, full_name, skill, None, False) for full_name in names
        ]
        first = min(dates)
        expires = add_months(first, 6)
        package_id = str(uuid.uuid5(NS, f"package:completed:{row}:{name_text}"))
        packages.append(
            {
                "id": package_id,
                "student_id": student_ids[0],
                "payer_id": None,
                "product_type": ptype,
                "total_credits": total,
                "used_credits": used,
                "amount_sgd": amount,
                "first_lesson_date": first,
                "expires_at": expires,
                "informed_at": "null",
                "customisation_notes": custom_notes,
                "is_trial_product": ptype.startswith("trial"),
                "catalog_credits": catalog_credits,
                "source": "completed",
            }
        )
        completed_ids.add(package_id)
        for sid in student_ids:
            memberships.append((package_id, sid))
    return completed_ids


def emit_sql(data, completed_only: bool = False) -> str:
    packages = data["packages"]
    memberships = data["memberships"]
    if completed_only:
        keep = data["completed_ids"]
        packages = [p for p in packages if p["id"] in keep]
        member_students = {sid for pid, sid in memberships if pid in keep}
        memberships = [(pid, sid) for pid, sid in memberships if pid in keep]
        students = {sid: data["students"][sid] for sid in member_students}
        header = (
            "-- Completed-sheet packs only. Idempotent. Safe to run after the current-roster seed."
        )
        lines = [header, "begin;", ""]
        lines.append("-- Students referenced by completed packs")
        for s in students.values():
            skill = sql_str(s["skill_level"]) if s["skill_level"] else "null"
            payer = sql_str(s["payer_id"]) if s["payer_id"] else "null"
            trial = "true" if s["is_trial"] else "false"
            lines.append(
                "insert into students (id, full_name, skill_level, is_trial, notes, payer_id)\n"
                f"values ({sql_str(s['id'])}, {sql_str(s['full_name'])}, {skill}, {trial}, {sql_str(s['notes'])}, {payer})\n"
                "on conflict (id) do update set full_name = excluded.full_name, "
                "skill_level = coalesce(students.skill_level, excluded.skill_level), "
                "payer_id = coalesce(students.payer_id, excluded.payer_id);"
            )
        lines.append("")
        data = {
            **data,
            "packages": packages,
            "memberships": memberships,
            "payers": {},
            "classes": [],
            "enrolments": set(),
            "students": {},
        }
        # Continue from packages section below by falling through with emptied prefixes
        prefix_done = True
    else:
        prefix_done = False

    if prefix_done:
        lines.append("-- Completed packages")
    else:
        lines = [
        "-- Generated from Customer Attendance workbook. Idempotent via fixed UUIDs.",
        "-- Includes current venue sheets and Completed history.",
        "begin;",
        "",
        "insert into package_products (product_type, label, total_credits, amount_sgd, sort_order, is_active)",
        "values ('group', 'Group', 24, 650, 13, true)",
        "on conflict (product_type, total_credits) do nothing;",
        "",
    ]

    lines.append("-- Classes")
    for c in data["classes"]:
        lines.append(
            "insert into classes (id, name, day_of_week, start_time, end_time, is_active, venue_id)\n"
            f"select {sql_str(c['id'])}, {sql_str(c['name'])}, {sql_str(c['day_of_week'])}, "
            f"{sql_str(c['start_time'])}::time, {sql_str(c['end_time'])}::time, true, v.id\n"
            f"from venues v where v.name = {sql_str(c['venue'])}\n"
            "on conflict (id) do update set name = excluded.name, venue_id = excluded.venue_id;"
        )
    lines.append("")

    lines.append("-- Payers")
    for p in data["payers"].values():
        lines.append(
            "insert into payers (id, kind, display_name, phone)\n"
            f"values ({sql_str(p['id'])}, {sql_str(p['kind'])}, {sql_str(p['display_name'])}, {sql_str(p['phone'])})\n"
            "on conflict (id) do update set kind = excluded.kind, display_name = excluded.display_name, phone = excluded.phone;"
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

    lines.append("-- Packages")
    for p in data["packages"]:
        amount = "null" if p["amount_sgd"] is None else str(p["amount_sgd"])
        payer = sql_str(p["payer_id"]) if p["payer_id"] else "null"
        informed = p["informed_at"]
        lines.append(
            "insert into packages (\n"
            "  id, student_id, payer_id, package_product_id, total_credits, used_credits,\n"
            "  is_paid, payment_method, amount_sgd, first_lesson_date, expires_at,\n"
            "  informed_at, customisation_notes\n"
            ")\n"
            "select\n"
            f"  {sql_str(p['id'])},\n"
            f"  {sql_str(p['student_id'])},\n"
            f"  {payer},\n"
            "  pp.id,\n"
            f"  {p['total_credits']},\n"
            f"  {p['used_credits']},\n"
            "  true,\n"
            "  'paynow',\n"
            f"  coalesce({amount}::numeric, pp.amount_sgd),\n"
            f"  {sql_date(p['first_lesson_date'])},\n"
            f"  {sql_date(p['expires_at'])},\n"
            f"  {informed},\n"
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
            "  informed_at = coalesce(packages.informed_at, excluded.informed_at),\n"
            "  customisation_notes = excluded.customisation_notes,\n"
            "  payer_id = coalesce(excluded.payer_id, packages.payer_id);"
        )
    lines.append("")

    lines.append("-- Shared package members")
    for pid, sid in data["memberships"]:
        lines.append(
            "insert into package_students (package_id, student_id)\n"
            f"values ({sql_str(pid)}, {sql_str(sid)})\n"
            "on conflict do nothing;"
        )

    lines += ["", "commit;"]
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("xlsx")
    parser.add_argument("-o", "--output", required=True)
    parser.add_argument(
        "--completed-only",
        action="store_true",
        help="Only emit Completed-sheet packs (for a follow-up seed).",
    )
    args = parser.parse_args()
    data = parse_workbook(Path(args.xlsx))
    sql = emit_sql(data, completed_only=args.completed_only)
    Path(args.output).write_text(sql)
    completed = len(data["completed_ids"])
    current = len(data["packages"]) - completed
    print(
        f"Wrote {args.output}: "
        f"{len(data['students'])} students, {len(data['payers'])} payers, "
        f"{current} current + {completed} completed packages, "
        f"{len(data['classes'])} classes, {len(data['enrolments'])} enrolments"
        + (" (completed-only file)" if args.completed_only else "")
    )


if __name__ == "__main__":
    main()
