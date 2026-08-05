import { todayInSingapore } from "@/lib/datetime";
import { createClient } from "@/lib/supabase/server";
import { packageWarning } from "@/lib/attendance-utils";
import type {
  CheckInStudent,
  DashboardSession,
  Package,
  SessionWithClass,
  Student,
} from "@/lib/types";

export async function getCoachSessionsForToday(coachId: string) {
  const supabase = await createClient();
  const today = todayInSingapore();

  const { data, error } = await supabase
    .from("sessions")
    .select(
      `
        *,
        classes!inner (
          id,
          name,
          day_of_week,
          start_time,
          end_time,
          coach_id,
          is_active
        )
      `
    )
    .eq("session_date", today)
    .eq("classes.coach_id", coachId)
    .order("session_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as SessionWithClass[];
}

export async function getTodaySessionsForDashboard(coachId?: string) {
  const supabase = await createClient();
  const today = todayInSingapore();

  let query = supabase
    .from("sessions")
    .select(
      `
        *,
        classes (
          id,
          name,
          day_of_week,
          start_time,
          end_time,
          coach_id,
          is_active
        )
      `
    )
    .eq("session_date", today);

  if (coachId) {
    query = query.eq("classes.coach_id", coachId);
  }

  const { data: sessions, error } = await query;
  if (error) throw error;

  const results: DashboardSession[] = [];

  for (const session of sessions ?? []) {
    const sessionWithClass = session as SessionWithClass;

    const { count: expectedCount } = await supabase
      .from("enrolments")
      .select("*", { count: "exact", head: true })
      .eq("class_id", sessionWithClass.class_id);

    const { count: checkedInCount } = await supabase
      .from("attendance")
      .select("*", { count: "exact", head: true })
      .eq("session_id", sessionWithClass.id)
      .in("status", ["present", "walk_in"]);

    const { data: enrolments } = await supabase
      .from("enrolments")
      .select("student_id")
      .eq("class_id", sessionWithClass.class_id);

    let packageAlerts = 0;
    for (const enrolment of enrolments ?? []) {
      const { data: packageId } = await supabase.rpc(
        "resolve_chargeable_package",
        {
          p_student_id: enrolment.student_id,
          p_session_date: sessionWithClass.session_date,
        }
      );

      if (!packageId) {
        packageAlerts += 1;
        continue;
      }

      const { data: pkg } = await supabase
        .from("packages")
        .select("status, remaining_credits, expires_at")
        .eq("id", packageId)
        .single();

      if (pkg && packageWarning(pkg as Package) !== "none") {
        packageAlerts += 1;
      }
    }

    results.push({
      session: sessionWithClass,
      expectedCount: expectedCount ?? 0,
      checkedInCount: checkedInCount ?? 0,
      packageAlerts,
    });
  }

  return results.sort((a, b) =>
    a.session.classes.start_time.localeCompare(b.session.classes.start_time)
  );
}

export async function getSessionCheckInList(
  sessionId: string
): Promise<{
  session: SessionWithClass;
  students: CheckInStudent[];
  walkIns: CheckInStudent[];
}> {
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select(
      `
        *,
        classes (
          id,
          name,
          day_of_week,
          start_time,
          end_time,
          coach_id,
          is_active
        )
      `
    )
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    throw new Error("Session not found");
  }

  const sessionWithClass = session as SessionWithClass;

  const { data: enrolments, error: enrolmentError } = await supabase
    .from("enrolments")
    .select(
      `
        student_id,
        students (*)
      `
    )
    .eq("class_id", sessionWithClass.class_id);

  if (enrolmentError) throw enrolmentError;

  const enrolledStudentIds = new Set(
    (enrolments ?? []).map((row) => row.student_id as string)
  );

  const { data: attendanceRows, error: attendanceError } = await supabase
    .from("attendance")
    .select("*")
    .eq("session_id", sessionId);

  if (attendanceError) throw attendanceError;

  const attendanceByStudent = new Map(
    (attendanceRows ?? []).map((row) => [row.student_id as string, row])
  );

  async function buildCheckIn(
    student: Student,
    isWalkIn: boolean
  ): Promise<CheckInStudent> {
    const { data: chargeablePackageId } = await supabase.rpc(
      "resolve_chargeable_package",
      {
        p_student_id: student.id,
        p_session_date: sessionWithClass.session_date,
      }
    );

    let pkg: Package | null = null;
    if (chargeablePackageId) {
      const { data } = await supabase
        .from("packages")
        .select(
          "id, student_id, total_credits, used_credits, remaining_credits, is_paid, first_lesson_date, expires_at, status"
        )
        .eq("id", chargeablePackageId)
        .single();
      pkg = (data as Package) ?? null;
    }

    return {
      student,
      attendance: (attendanceByStudent.get(student.id) as CheckInStudent["attendance"]) ?? null,
      package: pkg,
      chargeablePackageId: (chargeablePackageId as string | null) ?? null,
      isWalkIn,
    };
  }

  const enrolledStudents: CheckInStudent[] = [];
  for (const row of enrolments ?? []) {
    const student = row.students as unknown as Student;
    enrolledStudents.push(await buildCheckIn(student, false));
  }

  enrolledStudents.sort((a, b) =>
    a.student.full_name.localeCompare(b.student.full_name)
  );

  const walkIns: CheckInStudent[] = [];
  for (const row of attendanceRows ?? []) {
    if (row.status !== "walk_in") continue;
    if (enrolledStudentIds.has(row.student_id as string)) continue;

    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", row.student_id)
      .single();

    if (student) {
      walkIns.push(await buildCheckIn(student as Student, true));
    }
  }

  return {
    session: sessionWithClass,
    students: enrolledStudents,
    walkIns,
  };
}

export async function searchStudents(query: string, limit = 8) {
  const supabase = await createClient();
  const trimmed = query.trim();
  if (!trimmed) return [];

  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, skill_level")
    .ilike("full_name", `%${trimmed}%`)
    .order("full_name")
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
