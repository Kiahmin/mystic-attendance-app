import { todayInSingapore } from "@/lib/datetime";
import { createClient } from "@/lib/supabase/server";
import { packageWarning } from "@/lib/attendance-utils";
import { loadEffectiveSessionRoster } from "@/lib/session-roster";
import { weekendDatesInCurrentWeek } from "@/lib/session-utils";
import type {
  CheckInStudent,
  DashboardSession,
  Package,
  Profile,
  SessionWithClass,
  Student,
} from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

type SessionClassRow = SessionWithClass["classes"] & {
  profiles?:
    | Pick<Profile, "id" | "full_name">
    | Pick<Profile, "id" | "full_name">[]
    | null;
};

function mapSessionWithClass(
  row: SessionWithClass & { classes: SessionClassRow }
): { session: SessionWithClass; coachName: string | null } {
  const coach = asSingle(row.classes.profiles);
  return {
    session: {
      ...row,
      classes: {
        id: row.classes.id,
        name: row.classes.name,
        day_of_week: row.classes.day_of_week,
        start_time: row.classes.start_time,
        end_time: row.classes.end_time,
        coach_id: row.classes.coach_id,
        is_active: row.classes.is_active,
        coach,
      },
    },
    coachName: coach?.full_name ?? null,
  };
}

async function enrichDashboardSession(
  supabase: SupabaseClient,
  sessionWithClass: SessionWithClass,
  coachName: string | null
): Promise<DashboardSession> {
  const roster = await loadEffectiveSessionRoster(
    supabase,
    sessionWithClass.id,
    sessionWithClass.class_id
  );

  const { count: checkedInCount } = await supabase
    .from("attendance")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionWithClass.id)
    .in("status", ["present", "walk_in"]);

  let packageAlerts = 0;
  for (const entry of roster) {
    const { data: packageId } = await supabase.rpc(
      "resolve_chargeable_package",
      {
        p_student_id: entry.studentId,
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

  return {
    session: sessionWithClass,
    expectedCount: roster.length,
    checkedInCount: checkedInCount ?? 0,
    packageAlerts,
    coachName,
  };
}

const DASHBOARD_SESSION_SELECT = `
  *,
  classes (
    id,
    name,
    day_of_week,
    start_time,
    end_time,
    coach_id,
    is_active,
    profiles!coach_id (
      id,
      full_name
    )
  )
`;

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
    .select(DASHBOARD_SESSION_SELECT)
    .eq("session_date", today);

  if (coachId) {
    query = query.eq("classes.coach_id", coachId);
  }

  const { data: sessions, error } = await query;
  if (error) throw error;

  const results: DashboardSession[] = [];
  for (const session of sessions ?? []) {
    const { session: sessionWithClass, coachName } = mapSessionWithClass(
      session as SessionWithClass & { classes: SessionClassRow }
    );
    results.push(
      await enrichDashboardSession(supabase, sessionWithClass, coachName)
    );
  }

  return results.sort((a, b) =>
    a.session.classes.start_time.localeCompare(b.session.classes.start_time)
  );
}

export async function getWeekSessionsForDashboard() {
  const supabase = await createClient();
  const { saturday, sunday } = weekendDatesInCurrentWeek();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select(DASHBOARD_SESSION_SELECT)
    .in("session_date", [saturday, sunday]);

  if (error) throw error;

  const results: DashboardSession[] = [];
  for (const session of sessions ?? []) {
    const { session: sessionWithClass, coachName } = mapSessionWithClass(
      session as SessionWithClass & { classes: SessionClassRow }
    );
    results.push(
      await enrichDashboardSession(supabase, sessionWithClass, coachName)
    );
  }

  return results.sort((a, b) => {
    const byDate = a.session.session_date.localeCompare(b.session.session_date);
    if (byDate !== 0) return byDate;
    return a.session.classes.start_time.localeCompare(
      b.session.classes.start_time
    );
  });
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

  const roster = await loadEffectiveSessionRoster(
    supabase,
    sessionId,
    sessionWithClass.class_id
  );
  const expectedStudentIds = new Set(roster.map((entry) => entry.studentId));

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
    isWalkIn: boolean,
    rosterSource: CheckInStudent["rosterSource"] = null
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
          `
          id,
          student_id,
          total_credits,
          used_credits,
          remaining_credits,
          forfeited_credits,
          forfeited_at,
          payment_method,
          amount_sgd,
          is_paid,
          first_lesson_date,
          expires_at,
          paused_at,
          pause_ends_at,
          paused_reason,
          resumed_at,
          pause_used,
          status,
          created_at
        `
        )
        .eq("id", chargeablePackageId)
        .single();
      pkg = data
        ? ({
            ...(data as Package),
            amount_sgd:
              data.amount_sgd == null ? null : Number(data.amount_sgd),
          } as Package)
        : null;
    }

    return {
      student,
      attendance: (attendanceByStudent.get(student.id) as CheckInStudent["attendance"]) ?? null,
      package: pkg,
      chargeablePackageId: (chargeablePackageId as string | null) ?? null,
      isWalkIn,
      rosterSource,
    };
  }

  const expectedStudents: CheckInStudent[] = [];
  if (roster.length > 0) {
    const { data: students, error: studentsError } = await supabase
      .from("students")
      .select("*")
      .in(
        "id",
        roster.map((entry) => entry.studentId)
      );

    if (studentsError) throw studentsError;

    const byId = new Map(
      (students ?? []).map((row) => [row.id as string, row as Student])
    );

    for (const entry of roster) {
      const student = byId.get(entry.studentId);
      if (!student) continue;
      expectedStudents.push(
        await buildCheckIn(student, false, entry.source)
      );
    }

    expectedStudents.sort((a, b) =>
      a.student.full_name.localeCompare(b.student.full_name)
    );
  }

  const walkIns: CheckInStudent[] = [];
  for (const row of attendanceRows ?? []) {
    if (row.status !== "walk_in") continue;
    if (expectedStudentIds.has(row.student_id as string)) continue;

    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("id", row.student_id)
      .single();

    if (student) {
      walkIns.push(await buildCheckIn(student as Student, true, null));
    }
  }

  return {
    session: sessionWithClass,
    students: expectedStudents,
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
