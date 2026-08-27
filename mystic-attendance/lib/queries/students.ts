import { createClient } from "@/lib/supabase/server";
import { DAYS_OF_WEEK, isInactiveForSixMonths } from "@/lib/admin-utils";
import type {
  ClassGroup,
  DayOfWeek,
  EnrolmentWithClass,
  PackageProduct,
  PackageStatus,
  PayerRef,
  Student,
  StudentListItem,
  StudentRosterClass,
  StudentRosterPackage,
  StudentWithEnrolments,
  VenueRef,
} from "@/lib/types";
import { mapVenueRef } from "@/lib/venue-utils";

const STUDENT_COLUMNS = `
  id,
  full_name,
  date_of_birth,
  is_minor,
  guardian_name,
  guardian_phone,
  contact_phone,
  payer_id,
  skill_level,
  notes,
  is_trial,
  archived_at
`;

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

type RosterPackageRow = {
  student_id: string;
  remaining_credits: number;
  total_credits: number;
  used_credits: number;
  bonus_credits?: number | null;
  status: PackageStatus;
  expires_at: string | null;
  first_lesson_date: string | null;
  package_products?:
    | Pick<PackageProduct, "product_type" | "label" | "total_credits">
    | Pick<PackageProduct, "product_type" | "label" | "total_credits">[]
    | null;
  sessions?:
    | { name: string | null; session_date: string }
    | { name: string | null; session_date: string }[]
    | null;
};

type RosterEnrolmentRow = {
  class_id: string;
  classes?:
    | {
        id: string;
        name: string;
        venue_id?: string | null;
        venues?: VenueRef | VenueRef[] | null;
        day_of_week: DayOfWeek;
        start_time: string;
        is_active?: boolean;
      }
    | {
        id: string;
        name: string;
        venue_id?: string | null;
        venues?: VenueRef | VenueRef[] | null;
        day_of_week: DayOfWeek;
        start_time: string;
        is_active?: boolean;
      }[]
    | null;
};

const DAY_RANK = new Map(DAYS_OF_WEEK.map((day, index) => [day, index]));

function mapRosterPackage(row: RosterPackageRow): StudentRosterPackage {
  const product = asSingle(row.package_products);
  const session = asSingle(row.sessions);
  return {
    remaining_credits: Number(row.remaining_credits),
    total_credits: Number(row.total_credits),
    used_credits: Number(row.used_credits),
    bonus_credits: Number(row.bonus_credits ?? 0),
    status: row.status,
    expires_at: row.expires_at ?? null,
    first_lesson_date: row.first_lesson_date ?? null,
    package_products: product
      ? {
          product_type: product.product_type,
          label: product.label,
          total_credits: Number(product.total_credits),
        }
      : null,
    sessions: session
      ? { name: session.name, session_date: session.session_date }
      : null,
  };
}

function mapRosterClasses(
  enrolments: RosterEnrolmentRow[] | null | undefined
): StudentRosterClass[] {
  const classes = (enrolments ?? [])
    .map((enrolment) => {
      const classGroup = asSingle(enrolment.classes);
      if (!classGroup) return null;
      const venue = mapVenueRef(classGroup.venues);
      return {
        id: classGroup.id,
        name: classGroup.name,
        venue_id: classGroup.venue_id ?? venue?.id ?? null,
        venue,
        day_of_week: classGroup.day_of_week,
        start_time: classGroup.start_time,
      } satisfies StudentRosterClass;
    })
    .filter((item): item is StudentRosterClass => item !== null);

  return classes.sort((a, b) => {
    const byDay =
      (DAY_RANK.get(a.day_of_week) ?? 99) - (DAY_RANK.get(b.day_of_week) ?? 99);
    if (byDay !== 0) return byDay;
    return a.start_time.localeCompare(b.start_time);
  });
}

export async function listStudents(
  search?: string
): Promise<StudentListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("students")
    .select(
      `
        ${STUDENT_COLUMNS},
        created_at,
        payers (
          id,
          kind,
          display_name,
          phone
        ),
        enrolments (
          class_id,
          classes (
            id,
            name,
            venue_id,
            venues (id, name),
            day_of_week,
            start_time,
            end_time,
            is_active
          )
        )
      `
    )
    .order("full_name");

  const trimmed = search?.trim();
  if (trimmed) {
    query = query.ilike("full_name", `%${trimmed}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = data ?? [];
  const studentIds = rows.map((row) => row.id as string);

  const [lastAttendanceResult, packagesResult] = await Promise.all([
    studentIds.length === 0
      ? Promise.resolve({
          data: [] as { student_id: string; last_attended_on: string }[],
          error: null,
        })
      : supabase
          .from("student_last_attendance")
          .select("student_id, last_attended_on")
          .in("student_id", studentIds),
    studentIds.length === 0
      ? Promise.resolve({
          data: [] as RosterPackageRow[],
          error: null,
        })
      : supabase
          .from("packages")
          .select(
            `
              student_id,
              remaining_credits,
              total_credits,
              used_credits,
              bonus_credits,
              status,
              expires_at,
              first_lesson_date,
              created_at,
              session_id,
              package_products (
                product_type,
                label,
                total_credits
              ),
              sessions (
                name,
                session_date
              )
            `
          )
          .in("student_id", studentIds)
          .is("session_id", null)
          .order("created_at", { ascending: false }),
  ]);

  if (lastAttendanceResult.error) throw lastAttendanceResult.error;
  if (packagesResult.error) throw packagesResult.error;

  const lastAttendedByStudent = new Map(
    (lastAttendanceResult.data ?? []).map((row) => [
      row.student_id as string,
      row.last_attended_on as string,
    ])
  );

  const packagesByStudent = new Map<string, StudentRosterPackage[]>();
  for (const row of packagesResult.data ?? []) {
    const pkg = mapRosterPackage(row as RosterPackageRow);
    const studentId = row.student_id as string;
    const list = packagesByStudent.get(studentId);
    if (list) list.push(pkg);
    else packagesByStudent.set(studentId, [pkg]);
  }

  return rows.map((row) => {
    const { enrolments, payers, ...student } = row as typeof row & {
      payers?: PayerRef | PayerRef[] | null;
    };
    const enrolmentRows = (enrolments ?? []) as RosterEnrolmentRow[];
    const classIds = enrolmentRows.map((enrolment) => enrolment.class_id);
    const payer = asSingle(payers);
    return {
      ...(student as Student & { created_at: string }),
      payer_id: (student as Student).payer_id ?? payer?.id ?? null,
      payer,
      last_attended_on: lastAttendedByStudent.get(student.id as string) ?? null,
      enrolment_count: classIds.length,
      class_ids: classIds,
      classes: mapRosterClasses(enrolmentRows),
      roster_package: pickRosterPackage(
        packagesByStudent.get(student.id as string) ?? []
      ),
    };
  });
}

export async function countInactiveStudents(): Promise<number> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("id, created_at")
    .is("archived_at", null);

  if (error) throw error;

  const rows = data ?? [];
  if (rows.length === 0) return 0;

  const { data: attendance, error: attendanceError } = await supabase
    .from("student_last_attendance")
    .select("student_id, last_attended_on")
    .in(
      "student_id",
      rows.map((row) => row.id as string)
    );

  if (attendanceError) throw attendanceError;

  const lastAttendedByStudent = new Map(
    (attendance ?? []).map((row) => [
      row.student_id as string,
      row.last_attended_on as string,
    ])
  );

  return rows.filter((row) =>
    isInactiveForSixMonths(
      lastAttendedByStudent.get(row.id as string) ?? null,
      row.created_at as string
    )
  ).length;
}

function pickRosterPackage(
  packages: StudentRosterPackage[]
): StudentRosterPackage | null {
  if (packages.length === 0) return null;
  return (
    packages.find(
      (pkg) => pkg.status === "active" && pkg.remaining_credits > 0
    ) ?? packages[0]
  );
}

export async function getStudentById(
  id: string
): Promise<StudentWithEnrolments | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select(
      `
        ${STUDENT_COLUMNS},
        payers (
          id,
          kind,
          display_name,
          phone
        ),
        enrolments (
          id,
          student_id,
          class_id,
          enrolled_at,
          classes (
            id,
            name,
            venue_id,
            venues (id, name),
            day_of_week,
            start_time,
            end_time,
            coach_id,
            is_active
          )
        )
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { enrolments, payers, ...student } = data as Student & {
    payers?: PayerRef | PayerRef[] | null;
    enrolments: Array<{
      id: string;
      student_id: string;
      class_id: string;
      enrolled_at: string;
      classes: ClassGroup | ClassGroup[];
    }> | null;
  };

  const typedEnrolments: EnrolmentWithClass[] = (enrolments ?? [])
    .map((enrolment) => {
      const classGroup = asSingle(enrolment.classes);
      if (!classGroup) return null;
      const venue = mapVenueRef(
        (classGroup as ClassGroup & { venues?: VenueRef | VenueRef[] | null })
          .venues
      );
      return {
        id: enrolment.id,
        student_id: enrolment.student_id,
        class_id: enrolment.class_id,
        enrolled_at: enrolment.enrolled_at,
        classes: {
          ...classGroup,
          venue_id: classGroup.venue_id ?? venue?.id ?? null,
          venue,
        },
      };
    })
    .filter((item): item is EnrolmentWithClass => item !== null);

  typedEnrolments.sort((a, b) =>
    a.classes.name.localeCompare(b.classes.name)
  );

  return {
    ...student,
    payer_id: student.payer_id ?? asSingle(payers)?.id ?? null,
    payer: asSingle(payers),
    enrolments: typedEnrolments,
  };
}
