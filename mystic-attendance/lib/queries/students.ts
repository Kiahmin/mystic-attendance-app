import { createClient } from "@/lib/supabase/server";
import { isInactiveForSixMonths } from "@/lib/admin-utils";
import type {
  ClassGroup,
  EnrolmentWithClass,
  PackageStatus,
  Student,
  StudentListItem,
  StudentRosterPackage,
  StudentWithEnrolments,
} from "@/lib/types";

const STUDENT_COLUMNS = `
  id,
  full_name,
  date_of_birth,
  is_minor,
  guardian_name,
  guardian_phone,
  contact_phone,
  skill_level,
  notes,
  is_trial,
  archived_at
`;

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
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
        enrolments (id, class_id)
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
          data: [] as {
            student_id: string;
            remaining_credits: number;
            total_credits: number;
            status: PackageStatus;
            expires_at: string | null;
          }[],
          error: null,
        })
      : supabase
          .from("packages")
          .select(
            "student_id, remaining_credits, total_credits, status, expires_at, created_at, session_id"
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
    const studentId = row.student_id as string;
    const pkg: StudentRosterPackage = {
      remaining_credits: Number(row.remaining_credits),
      total_credits: Number(row.total_credits),
      status: row.status as PackageStatus,
      expires_at: (row.expires_at as string | null) ?? null,
    };
    const list = packagesByStudent.get(studentId);
    if (list) list.push(pkg);
    else packagesByStudent.set(studentId, [pkg]);
  }

  return rows.map((row) => {
    const { enrolments, ...student } = row;
    const classIds = Array.isArray(enrolments)
      ? enrolments.map((enrolment) => enrolment.class_id as string)
      : [];
    return {
      ...(student as Student & { created_at: string }),
      last_attended_on: lastAttendedByStudent.get(student.id as string) ?? null,
      enrolment_count: classIds.length,
      class_ids: classIds,
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
        enrolments (
          id,
          student_id,
          class_id,
          enrolled_at,
          classes (
            id,
            name,
            venue,
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

  const { enrolments, ...student } = data as Student & {
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
      return {
        id: enrolment.id,
        student_id: enrolment.student_id,
        class_id: enrolment.class_id,
        enrolled_at: enrolment.enrolled_at,
        classes: classGroup,
      };
    })
    .filter((item): item is EnrolmentWithClass => item !== null);

  typedEnrolments.sort((a, b) =>
    a.classes.name.localeCompare(b.classes.name)
  );

  return {
    ...student,
    enrolments: typedEnrolments,
  };
}
