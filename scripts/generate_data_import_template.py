#!/usr/bin/env python3
"""Generate the Mystic Skates Excel data-import template."""

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.workbook.defined_name import DefinedName

OUT = "docs/Mystic_data_import_template.xlsx"

NAVY = "1B3A4B"
TEAL = "2A6F7F"
GOLD = "C4A35A"
HEADER_FONT = Font(name="Calibri", bold=True, color="FFFFFF", size=11)
TITLE_FONT = Font(name="Calibri", bold=True, color=NAVY, size=18)
SECTION_FONT = Font(name="Calibri", bold=True, color=NAVY, size=13)
BODY_FONT = Font(name="Calibri", size=11)
HINT_FONT = Font(name="Calibri", italic=True, color="666666", size=10)
HEADER_FILL = PatternFill("solid", fgColor=NAVY)
REQUIRED_FILL = PatternFill("solid", fgColor="8B2942")
OPTIONAL_FILL = PatternFill("solid", fgColor=TEAL)
SAMPLE_FILL = PatternFill("solid", fgColor="FFF4D6")
INSTR_FILL = PatternFill("solid", fgColor="F4F7F8")
WARN_FILL = PatternFill("solid", fgColor="FDECEC")
OK_FILL = PatternFill("solid", fgColor="E8F5E9")
THIN = Border(
    left=Side(style="thin", color="D0D5D8"),
    right=Side(style="thin", color="D0D5D8"),
    top=Side(style="thin", color="D0D5D8"),
    bottom=Side(style="thin", color="D0D5D8"),
)
WRAP = Alignment(wrap_text=True, vertical="center")
LEFT = Alignment(vertical="center", wrap_text=True)

MAX_ROW = 500


def style_header(ws, row, fills):
    for col, fill in enumerate(fills, 1):
        cell = ws.cell(row, col)
        cell.font = HEADER_FONT
        cell.fill = fill
        cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
        cell.border = THIN
    ws.row_dimensions[row].height = 42


def autosize(ws, widths):
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w


def comment(cell, text):
    cell.comment = Comment(text, "Mystic")
    cell.comment.width = 280
    cell.comment.height = 80


def add_table(ws, name, ref):
    table = Table(displayName=name, ref=ref)
    table.tableStyleInfo = TableStyleInfo(
        name="TableStyleMedium2", showRowStripes=True, showColumnStripes=False
    )
    ws.add_table(table)


def data_val(type_, formula, prompt_title, prompt):
    dv = DataValidation(
        type=type_,
        formula1=formula,
        allow_blank=True,
        showDropDown=False,
        showErrorMessage=True,
        errorTitle="Invalid value",
        error="Pick a value from the list, or leave blank if allowed.",
        promptTitle=prompt_title,
        prompt=prompt,
        showInputMessage=True,
    )
    return dv


def yes_no_dv():
    return data_val("list", '"YES,NO"', "YES or NO", "Type YES or NO")


def build():
    wb = Workbook()

    # ----- Reference (hidden lists for dropdowns) -----
    ref = wb.active
    ref.title = "Reference"
    lists = {
        "A": (
            "skill_level",
            ["beginner", "intermediate", "advanced", "freestyle"],
        ),
        "B": (
            "yes_no",
            ["YES", "NO"],
        ),
        "C": (
            "day_of_week",
            [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
            ],
        ),
        "D": (
            "package_product",
            [
                "Group 4",
                "Group 8",
                "Group 12",
                "Freestyle 4",
                "Freestyle 8",
                "Freestyle 12",
                "Private 4",
                "Private 8",
                "Private 12",
                "Trial (Group) 1",
                "Trial (Private) 1",
            ],
        ),
        "E": (
            "payment_method",
            ["paynow", "bank_transfer", "cash"],
        ),
        "F": (
            "pause_reason",
            ["injury", "travel", "school", "other"],
        ),
        "G": (
            "student_status",
            ["active", "quit"],
        ),
    }
    for col, (name, values) in lists.items():
        ref[f"{col}1"] = name
        for i, v in enumerate(values, 2):
            ref[f"{col}{i}"] = v
        last = 1 + len(values)
        wb.defined_names.add(
            DefinedName(name, attr_text=f"Reference!${col}$2:${col}${last}")
        )

    # Catalog prices for the Read me sheet
    catalog = [
        ("Group 4", 4, 130),
        ("Group 8", 8, 250),
        ("Group 12", 12, 350),
        ("Freestyle 4", 4, 150),
        ("Freestyle 8", 8, 290),
        ("Freestyle 12", 12, 400),
        ("Private 4", 4, 320),
        ("Private 8", 8, 580),
        ("Private 12", 12, 840),
        ("Trial (Group) 1", 1, 25),
        ("Trial (Private) 1", 1, 50),
    ]
    ref["I1"] = "product"
    ref["J1"] = "credits"
    ref["K1"] = "list_price_sgd"
    for i, (label, credits, price) in enumerate(catalog, 2):
        ref[f"I{i}"] = label
        ref[f"J{i}"] = credits
        ref[f"K{i}"] = price
    wb.defined_names.add(DefinedName("catalog_product", attr_text="Reference!$I$2:$I$12"))

    ref.sheet_state = "hidden"

    # ----- Instructions -----
    ins = wb.create_sheet("How to fill this in", 0)
    ins.sheet_properties.tabColor = GOLD
    ins.merge_cells("A1:B1")
    ins["A1"] = "Mystic Skates — data import template"
    ins["A1"].font = TITLE_FONT
    ins.row_dimensions[1].height = 28

    ins.merge_cells("A2:B2")
    ins["A2"] = (
        "Use this workbook to collect current students, classes, enrolments, and "
        "credit packages so they can be loaded into the production app. "
        "Do not add extra columns. Yellow rows are examples — delete them before sending."
    )
    ins["A2"].font = BODY_FONT
    ins["A2"].alignment = WRAP
    ins.row_dimensions[2].height = 48

    steps = [
        ("1. Classes", "Fill the Classes sheet first. Give every class a short Class key (e.g. SAT-BEG-0900). Keys must be unique."),
        ("2. Students", "One row per skater. Student key must be unique (e.g. STU-001). Guardian name is required if date of birth is under 18."),
        ("3. Enrolments", "Match Student key + Class key. A student can be in more than one class — use one row per class."),
        ("4. Packages", "Current credit packs only (not old finished history, unless you still need the remaining lessons). One row per package. Copy Student key exactly."),
        ("5. Do not fill", "Past attendance, session dates, and staff logins. Classes generate future sessions in the app. Coaches are set up separately."),
        ("Dates", "Use YYYY-MM-DD (example: 2015-03-12). Excel date cells are fine if they display as a real date."),
        ("Times", "Use HH:MM 24-hour (example: 09:00 or 14:30)."),
        ("YES / NO", "Use the dropdown. Blank is treated as NO where a yes/no field is optional."),
        ("Keys", "Keys are only for this spreadsheet. They will not appear in the app. Never change a key after other sheets already use it."),
    ]
    ins["A4"] = "Topic"
    ins["B4"] = "Instruction"
    style_header(ins, 4, [HEADER_FILL, HEADER_FILL])
    for i, (topic, text) in enumerate(steps, 5):
        ins[f"A{i}"] = topic
        ins[f"B{i}"] = text
        ins[f"A{i}"].font = Font(name="Calibri", bold=True, size=11)
        ins[f"B{i}"].font = BODY_FONT
        ins[f"A{i}"].alignment = LEFT
        ins[f"B{i}"].alignment = WRAP
        ins[f"A{i}"].fill = INSTR_FILL
        ins[f"B{i}"].fill = INSTR_FILL
        ins.row_dimensions[i].height = 36

    ins["A15"] = "Package catalog (list prices)"
    ins["A15"].font = SECTION_FONT
    ins.merge_cells("A15:D15")
    ins["A16"] = "Choose this on Packages sheet"
    ins["B16"] = "Credits"
    ins["C16"] = "List price (SGD)"
    ins["D16"] = "Notes"
    style_header(ins, 16, [HEADER_FILL] * 4)
    notes_by_product = {
        "Trial (Group) 1": "Set student Trial? = YES",
        "Trial (Private) 1": "Set student Trial? = YES",
    }
    for i, (label, credits, price) in enumerate(catalog, 17):
        ins[f"A{i}"] = label
        ins[f"B{i}"] = credits
        ins[f"C{i}"] = price
        ins[f"D{i}"] = notes_by_product.get(label, "Amount paid can differ from list price")
        for col in range(1, 5):
            ins.cell(i, col).font = BODY_FONT
            ins.cell(i, col).border = THIN

    ins["A29"] = "If a package was customised (extra lessons, discount, bonus classes), keep the catalog product and record the actual credits / amount / notes on that row."
    ins.merge_cells("A29:D29")
    ins["A29"].font = HINT_FONT
    ins["A29"].alignment = WRAP
    ins.row_dimensions[29].height = 32

    autosize(ins, [36, 88, 18, 42])
    ins.freeze_panes = "A5"
    ins.page_setup.fitToPage = True
    ins.page_setup.fitToWidth = 1
    ins.print_title_rows = "1:4"

    # ----- Classes -----
    cls = wb.create_sheet("Classes")
    cls.sheet_properties.tabColor = TEAL
    cls_headers = [
        ("class_key", True, "Short unique code. Used on Enrolments. Example: SAT-BEG-0900"),
        ("name", True, "Name shown in the app. Example: Saturday Beginners"),
        ("day_of_week", True, "monday … sunday (dropdown)"),
        ("start_time", True, "HH:MM 24-hour. Example: 09:00"),
        ("end_time", True, "HH:MM 24-hour. Must be after start. Example: 10:00"),
        ("coach_name", False, "Coach display name if known. Leave blank if unassigned."),
        ("is_active", True, "YES = currently running. NO = hidden / not generating sessions."),
        ("notes", False, "Anything useful for setup (venue, level mix). Not stored as a class field — for the importer."),
    ]
    fills = [REQUIRED_FILL if h[1] else OPTIONAL_FILL for h in cls_headers]
    for col, (name, _, tip) in enumerate(cls_headers, 1):
        cell = cls.cell(1, col, name)
        comment(cell, ("Required. " if _ else "Optional. ") + tip)
    style_header(cls, 1, fills)

    cls_sample = [
        "SAT-BEG-0900",
        "Saturday Beginners",
        "saturday",
        "09:00",
        "10:00",
        "Kim",
        "YES",
        "Example row — delete before sending",
    ]
    for col, val in enumerate(cls_sample, 1):
        cell = cls.cell(2, col, val)
        cell.fill = SAMPLE_FILL
        cell.font = BODY_FONT
        cell.border = THIN

    for r in range(3, MAX_ROW + 1):
        for c in range(1, len(cls_headers) + 1):
            cls.cell(r, c).border = THIN
            cls.cell(r, c).font = BODY_FONT

    dv_day = data_val("list", "day_of_week", "Day", "Pick the weekday this class runs")
    dv_day.add(f"C2:C{MAX_ROW}")
    cls.add_data_validation(dv_day)
    dv_yn = yes_no_dv()
    dv_yn.add(f"G2:G{MAX_ROW}")
    cls.add_data_validation(dv_yn)

    autosize(cls, [16, 28, 16, 12, 12, 18, 12, 40])
    cls.freeze_panes = "A2"
    cls.auto_filter.ref = f"A1:H{MAX_ROW}"
    cls.sheet_view.showGridLines = False

    # ----- Students -----
    stu = wb.create_sheet("Students")
    stu.sheet_properties.tabColor = "8B2942"
    stu_headers = [
        ("student_key", True, "Unique code. Used on Enrolments and Packages. Example: STU-001"),
        ("full_name", True, "Legal / usual name as you want it in the app"),
        ("date_of_birth", False, "YYYY-MM-DD. Needed to flag under-18 and require guardian."),
        ("contact_phone", False, "Student’s own phone (adults). Include country code if possible, e.g. +65 9123 4567"),
        ("guardian_name", False, "Required when DOB is under 18."),
        ("guardian_phone", False, "Parent / guardian phone"),
        ("skill_level", False, "beginner / intermediate / advanced / freestyle"),
        ("is_trial", True, "YES if they are still on a trial (not a regular package student)."),
        ("status", True, "active = current. quit = left; will be archived, not shown on check-in."),
        ("notes", False, "Medical, billing, or coaching notes"),
    ]
    fills = [REQUIRED_FILL if h[1] else OPTIONAL_FILL for h in stu_headers]
    for col, (name, req, tip) in enumerate(stu_headers, 1):
        cell = stu.cell(1, col, name)
        comment(cell, ("Required. " if req else "Optional. ") + tip)
    style_header(stu, 1, fills)

    samples = [
        [
            "STU-001",
            "Alex Tan",
            "2015-03-12",
            "",
            "Parent Tan",
            "+65 9111 1111",
            "beginner",
            "NO",
            "active",
            "Example minor — delete this row",
        ],
        [
            "STU-002",
            "Jordan Lee",
            "1998-07-22",
            "+65 9222 2222",
            "",
            "",
            "intermediate",
            "NO",
            "active",
            "Example adult — delete this row",
        ],
        [
            "STU-003",
            "Sam Wong",
            "2012-11-05",
            "",
            "Parent Wong",
            "+65 9333 3333",
            "beginner",
            "YES",
            "active",
            "Example trial student — delete this row",
        ],
    ]
    for r, row in enumerate(samples, 2):
        for c, val in enumerate(row, 1):
            cell = stu.cell(r, c, val)
            cell.fill = SAMPLE_FILL
            cell.font = BODY_FONT
            cell.border = THIN

    for r in range(5, MAX_ROW + 1):
        for c in range(1, len(stu_headers) + 1):
            stu.cell(r, c).border = THIN
            stu.cell(r, c).font = BODY_FONT

    dv_skill = data_val("list", "skill_level", "Skill", "Pick a skill level")
    dv_skill.add(f"G2:G{MAX_ROW}")
    stu.add_data_validation(dv_skill)
    dv_trial = yes_no_dv()
    dv_trial.add(f"H2:H{MAX_ROW}")
    stu.add_data_validation(dv_trial)
    dv_status = data_val("list", "student_status", "Status", "active or quit")
    dv_status.add(f"I2:I{MAX_ROW}")
    stu.add_data_validation(dv_status)

    # Highlight missing guardian for likely minors (DOB year > today-18 roughly via formula on year)
    # Soft hint: if guardian blank and DOB present — not perfect age calc
    stu.conditional_formatting.add(
        f"E2:E{MAX_ROW}",
        FormulaRule(
            formula=['AND($E2="",$C2<>"",IF(ISNUMBER($C2),YEAR(TODAY())-YEAR($C2)<18,FALSE))'],
            fill=WARN_FILL,
        ),
    )

    autosize(stu, [14, 22, 16, 18, 18, 18, 16, 12, 12, 36])
    stu.freeze_panes = "A2"
    stu.auto_filter.ref = f"A1:J{MAX_ROW}"
    stu.sheet_view.showGridLines = False

    # ----- Enrolments -----
    enr = wb.create_sheet("Enrolments")
    enr.sheet_properties.tabColor = "4A7C59"
    enr_headers = [
        ("student_key", True, "Must match Students.student_key exactly"),
        ("class_key", True, "Must match Classes.class_key exactly"),
        ("notes", False, "Optional. e.g. starts next month"),
    ]
    fills = [REQUIRED_FILL if h[1] else OPTIONAL_FILL for h in enr_headers]
    for col, (name, req, tip) in enumerate(enr_headers, 1):
        cell = enr.cell(1, col, name)
        comment(cell, ("Required. " if req else "Optional. ") + tip)
    style_header(enr, 1, fills)

    for c, val in enumerate(["STU-001", "SAT-BEG-0900", "Example — delete this row"], 1):
        cell = enr.cell(2, c, val)
        cell.fill = SAMPLE_FILL
        cell.font = BODY_FONT
        cell.border = THIN
    for r in range(3, MAX_ROW + 1):
        for c in range(1, 4):
            enr.cell(r, c).border = THIN
            enr.cell(r, c).font = BODY_FONT

    autosize(enr, [16, 16, 40])
    enr.freeze_panes = "A2"
    enr.auto_filter.ref = f"A1:C{MAX_ROW}"
    enr.sheet_view.showGridLines = False
    enr["E1"] = "Tip: copy keys from the Students and Classes sheets. Duplicate student+class pairs are not allowed."
    enr["E1"].font = HINT_FONT
    enr.merge_cells("E1:H1")

    # ----- Packages -----
    pkg = wb.create_sheet("Packages")
    pkg.sheet_properties.tabColor = GOLD
    pkg_headers = [
        ("package_key", True, "Unique code for this pack. Example: PKG-001"),
        ("student_key", True, "Must match Students.student_key"),
        ("product", True, "Catalog product (dropdown). Keep this even if credits were customised."),
        ("total_credits", False, "Leave blank to use catalog size. Fill only if they bought a custom lesson count."),
        ("bonus_credits", False, "Complimentary lessons included in total. Default 0."),
        ("used_credits", True, "How many lessons already used. Remaining = total − used."),
        ("is_paid", True, "YES if money received. NO = unpaid (cannot be used for check-in)."),
        ("payment_method", False, "Required if paid: paynow, bank_transfer, cash"),
        ("amount_sgd", False, "Amount actually charged. Can differ from list price. Required if paid."),
        ("first_lesson_date", False, "YYYY-MM-DD of first charged lesson, if the pack has already started. Leave blank if not started."),
        ("expires_at", False, "YYYY-MM-DD. If first lesson is set and this is blank, expiry will be first lesson + 3 months."),
        ("paused", False, "YES if currently on pause."),
        ("paused_at", False, "Pause start date. Required if paused = YES."),
        ("pause_ends_at", False, "Planned pause end date. Required if paused = YES."),
        ("pause_reason", False, "injury / travel / school / other. Required if paused = YES."),
        ("pause_note", False, "Extra detail for pause reason."),
        ("already_used_pause", False, "YES if this pack already used its one pause (even if resumed)."),
        ("customisation_notes", False, "Discount, extra lessons, special arrangement."),
    ]
    fills = [REQUIRED_FILL if h[1] else OPTIONAL_FILL for h in pkg_headers]
    for col, (name, req, tip) in enumerate(pkg_headers, 1):
        cell = pkg.cell(1, col, name)
        comment(cell, ("Required. " if req else "Optional. ") + tip)
    style_header(pkg, 1, fills)

    pkg_sample = [
        "PKG-001",
        "STU-001",
        "Group 8",
        "",
        0,
        3,
        "YES",
        "paynow",
        250,
        "2026-06-07",
        "2026-09-07",
        "NO",
        "",
        "",
        "",
        "",
        "NO",
        "Example — delete this row",
    ]
    for c, val in enumerate(pkg_sample, 1):
        cell = pkg.cell(2, c, val)
        cell.fill = SAMPLE_FILL
        cell.font = BODY_FONT
        cell.border = THIN
        cell.alignment = Alignment(vertical="center")

    for r in range(3, MAX_ROW + 1):
        for c in range(1, len(pkg_headers) + 1):
            pkg.cell(r, c).border = THIN
            pkg.cell(r, c).font = BODY_FONT

    dv_prod = data_val("list", "catalog_product", "Product", "Pick a catalog package")
    dv_prod.add(f"C2:C{MAX_ROW}")
    pkg.add_data_validation(dv_prod)
    for col, dv in [
        ("G", yes_no_dv()),
        ("L", yes_no_dv()),
        ("Q", yes_no_dv()),
    ]:
        dv.add(f"{col}2:{col}{MAX_ROW}")
        pkg.add_data_validation(dv)
    dv_pay = data_val("list", "payment_method", "Payment", "How they paid")
    dv_pay.add(f"H2:H{MAX_ROW}")
    pkg.add_data_validation(dv_pay)
    dv_pause = data_val("list", "pause_reason", "Pause reason", "Required if currently paused")
    dv_pause.add(f"O2:O{MAX_ROW}")
    pkg.add_data_validation(dv_pause)

    autosize(
        pkg,
        [14, 14, 18, 14, 14, 14, 10, 16, 12, 18, 14, 10, 12, 14, 14, 16, 18, 28],
    )
    pkg.freeze_panes = "A2"
    pkg.auto_filter.ref = f"A1:R{MAX_ROW}"
    pkg.sheet_view.showGridLines = False
    pkg.row_dimensions[1].height = 48

    # ----- Legend -----
    leg = wb.create_sheet("Colour key")
    leg["A1"] = "Colour key"
    leg["A1"].font = TITLE_FONT
    leg["A3"] = "Maroon header"
    leg["B3"] = "Required column"
    leg["A3"].fill = REQUIRED_FILL
    leg["A3"].font = HEADER_FONT
    leg["A4"] = "Teal header"
    leg["B4"] = "Optional column"
    leg["A4"].fill = OPTIONAL_FILL
    leg["A4"].font = HEADER_FONT
    leg["A5"] = "Yellow row"
    leg["B5"] = "Example data — delete these rows before returning the file"
    leg["A5"].fill = SAMPLE_FILL
    leg["A6"] = "Pink guardian cell"
    leg["B6"] = "On Students: date of birth looks under 18 but guardian_name is empty"
    leg["A6"].fill = WARN_FILL
    for r in range(3, 7):
        leg[f"B{r}"].font = BODY_FONT
        leg[f"B{r}"].alignment = WRAP
        leg.row_dimensions[r].height = 28
    autosize(leg, [22, 70])

    # print settings
    for ws in (cls, stu, enr, pkg):
        ws.page_setup.orientation = "landscape"
        ws.page_setup.fitToPage = True
        ws.page_setup.fitToWidth = 1
        ws.page_setup.fitToHeight = 0
        ws.sheet_properties.pageSetUpPr.fitToPage = True
        ws.print_title_rows = "1:1"

    wb.save(OUT)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
