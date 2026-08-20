import { todayInSingapore } from "@/lib/datetime";
import { createClient } from "@/lib/supabase/server";
import { packageWarning } from "@/lib/attendance-utils";
import {
  pickChargeablePackage,
  type ChargeablePackageFields,
} from "@/lib/package-utils";
import {
  loadEffectiveSessionRoster,
  loadEffectiveSessionRosters,
} from "@/lib/session-roster";
import { sessionDisplayStart } from "@/lib/session-utils";
import type {
  CheckInStudent,
  DashboardSession,
  Package,
  Profile,
  SessionWithClass,
  Student,
  StudentSearchHit,
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

type SessionCoachRow = {
  profiles?:
    | Pick<Profile, "id" | "full_name">
    | Pick<Profile, "id" | "full_name">[]
    | null;
};

function mapSessionWithClass(
  row: SessionWithClass & { classes: SessionClassRow } & SessionCoachRow
): { session: SessionWithClass; coachName: string | null } {
  const coach =
    asSingle(row.profiles) ?? asSingle(row.classes.profiles);
  return {
    session: {
      ...row,
      coach,
      classes: {
        id: row.classes.id,
        name: row.classes.name,
        day_of_week: row.classes.day_of_week,
        start_time: row.classes.start_time,
        end_time: row.classes.end_time,
        coach_id: row.classes.coach_id,
        is_active: row.classes.is_active,
        coach: asSingle(row.classes.profiles),
      },
    },
    coachName: coach?.full_name ?? null,
  };
}

const DASHBOARD_PACKAGE_SELECT = `
  id,
  student_id,
  is_paid,
  paused_at,
  resumed_at,
  expires_at,
  used_credits,
  total_credits,
  remaining_credits,
  first_lesson_date,
  created_at,
  status
`;

const CHECKIN_PACKAGE_SELECT = `
  id,
  student_id,
  package_product_id,
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
`;

type DashboardPackageRow = ChargeablePackageFields & {
  status: Package["status"];
};

function groupByStudentId<T extends { student_id: string }>(
  rows: T[]
): Map<string, T[]> {
  const byStudent = new Map<string, T[]>();
  for (const row of rows) {
    const list = byStudent.get(row.student_id);
    if (list) list.push(row);
    else byStudent.set(row.student_id, [row]);
  }
  return byStudent;
}

function mapPackageRow(data: Record<string, unknown>): Package {
  return {
    ...(data as unknown as Package),
    package_product_id:
      (data.package_product_id as string | null | undefined) ?? null,
    bonus_credits: Number(data.bonus_credits ?? 0),
    customisation_notes:
      (data.customisation_notes as string | null | undefined) ?? null,
    amount_sgd: data.amount_sgd == null ? null : Number(data.amount_sgd),
  };
}

async function enrichDashboardSessions(
  supabase: SupabaseClient,
  rows: Array<
    SessionWithClass & { classes: SessionClassRow } & SessionCoachRow
  >
): Promise<DashboardSession[]> {
  const mapped = rows.map((row) => mapSessionWithClass(row));
  const rosters = await loadEffectiveSessionRosters(
    supabase,
    mapped.map(({ session }) => ({
      sessionId: session.id,
      classId: session.class_id,
    }))
  );

  const sessionIds = mapped.map(({ session }) => session.id);
  const studentIds = [
    ...new Set(
      [...rosters.values()].flatMap((roster) =>
        roster.map((entry) => entry.studentId)
      )
    ),
  ];

  const [attendanceResult, packagesResult] = await Promise.all([
    sessionIds.length === 0
      ? Promise.resolve({ data: [] as { session_id: string }[], error: null })
      : supabase
          .from("attendance")
          .select("session_id")
          .in("session_id", sessionIds)
          .in("status", ["present", "walk_in"]),
    studentIds.length === 0
      ? Promise.resolve({ data: [] as DashboardPackageRow[], error: null })
      : supabase
          .from("packages")
          .select(DASHBOARD_PACKAGE_SELECT)
          .in("student_id", studentIds)
          .eq("is_paid", true)
          .gt("remaining_credits", 0),
  ]);

  if (attendanceResult.error) throw attendanceResult.error;
  if (packagesResult.error) throw packagesResult.error;

  const checkedInBySession = new Map<string, number>();
  for (const row of attendanceResult.data ?? []) {
    const sessionId = row.session_id as string;
    checkedInBySession.set(
      sessionId,
      (checkedInBySession.get(sessionId) ?? 0) + 1
    );
  }

  const packagesByStudent = groupByStudentId(
    (packagesResult.data ?? []) as DashboardPackageRow[]
  );
  const today = todayInSingapore();

  return mapped.map(({ session, coachName }) => {
    const roster = rosters.get(session.id) ?? [];
    let packageAlerts = 0;
    for (const entry of roster) {
      const pkg = pickChargeablePackage(
        packagesByStudent.get(entry.studentId) ?? [],
        session.session_date,
        today
      );
      if (!pkg || packageWarning(pkg) !== "none") {
        packageAlerts += 1;
      }
    }

    return {
      session,
      expectedCount: roster.length,
      checkedInCount: checkedInBySession.get(session.id) ?? 0,
      packageAlerts,
      coachName,
    };
  });
}

const DASHBOARD_SESSION_SELECT = `
  *,
  profiles!sessions_coach_id_fkey (
    id,
    full_name
  ),
  classes (
    id,
    name,
    day_of_week,
    start_time,
    end_time,
    coach_id,
    is_active
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
    .eq("coach_id", coachId)
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
    query = query.eq("coach_id", coachId);
  }

  const { data: sessions, error } = await query;
  if (error) throw error;

  const results = await enrichDashboardSessions(
    supabase,
    (sessions ?? []) as Array<
      SessionWithClass & { classes: SessionClassRow } & SessionCoachRow
    >
  );

  return results.sort((a, b) =>
    sessionDisplayStart(a.session).localeCompare(sessionDisplayStart(b.session))
  );
}

export async function getWeekSessionsForDashboard(
  monday: string,
  sunday: string
) {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select(DASHBOARD_SESSION_SELECT)
    .gte("session_date", monday)
    .lte("session_date", sunday);

  if (error) throw error;

  const results = await enrichDashboardSessions(
    supabase,
    (sessions ?? []) as Array<
      SessionWithClass & { classes: SessionClassRow } & SessionCoachRow
    >
  );

  return results.sort((a, b) => {
    const byDate = a.session.session_date.localeCompare(b.session.session_date);
    if (byDate !== 0) return byDate;
    return sessionDisplayStart(a.session).localeCompare(
      sessionDisplayStart(b.session)
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
        profiles!sessions_coach_id_fkey (
          id,
          full_name
        ),
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

  const { session: sessionWithClass } = mapSessionWithClass(
    session as SessionWithClass & { classes: SessionClassRow } & SessionCoachRow
  );

  const [roster, attendanceResult] = await Promise.all([
    loadEffectiveSessionRoster(
      supabase,
      sessionId,
      sessionWithClass.class_id
    ),
    supabase.from("attendance").select("*").eq("session_id", sessionId),
  ]);

  if (attendanceResult.error) throw attendanceResult.error;
  const attendanceRows = attendanceResult.data ?? [];
  const expectedStudentIds = new Set(roster.map((entry) => entry.studentId));

  const attendanceByStudent = new Map(
    attendanceRows.map((row) => [row.student_id as string, row])
  );

  const walkInStudentIds = attendanceRows
    .filter(
      (row) =>
        row.status === "walk_in" &&
        !expectedStudentIds.has(row.student_id as string)
    )
    .map((row) => row.student_id as string);

  const studentIds = [
    ...new Set([
      ...roster.map((entry) => entry.studentId),
      ...walkInStudentIds,
    ]),
  ];

  const [studentsResult, packagesResult] = await Promise.all([
    studentIds.length === 0
      ? Promise.resolve({ data: [] as Student[], error: null })
      : supabase.from("students").select("*").in("id", studentIds),
    studentIds.length === 0
      ? Promise.resolve({ data: [] as Package[], error: null })
      : supabase
          .from("packages")
          .select(CHECKIN_PACKAGE_SELECT)
          .in("student_id", studentIds)
          .eq("is_paid", true)
          .gt("remaining_credits", 0),
  ]);

  if (studentsResult.error) throw studentsResult.error;
  if (packagesResult.error) throw packagesResult.error;

  const studentsById = new Map(
    (studentsResult.data ?? []).map((row) => [row.id as string, row as Student])
  );
  const packagesByStudent = groupByStudentId(
    (packagesResult.data ?? []).map((row) =>
      mapPackageRow(row as unknown as Record<string, unknown>)
    )
  );
  const today = todayInSingapore();

  function buildCheckIn(
    student: Student,
    isWalkIn: boolean,
    rosterSource: CheckInStudent["rosterSource"] = null
  ): CheckInStudent {
    const pkg = pickChargeablePackage(
      packagesByStudent.get(student.id) ?? [],
      sessionWithClass.session_date,
      today
    );

    return {
      student,
      attendance:
        (attendanceByStudent.get(student.id) as CheckInStudent["attendance"]) ??
        null,
      package: pkg,
      chargeablePackageId: pkg?.id ?? null,
      isWalkIn,
      rosterSource,
    };
  }

  const expectedStudents: CheckInStudent[] = [];
  for (const entry of roster) {
    const student = studentsById.get(entry.studentId);
    if (!student) continue;
    expectedStudents.push(buildCheckIn(student, false, entry.source));
  }
  expectedStudents.sort((a, b) =>
    a.student.full_name.localeCompare(b.student.full_name)
  );

  const walkIns: CheckInStudent[] = [];
  for (const studentId of walkInStudentIds) {
    const student = studentsById.get(studentId);
    if (!student) continue;
    walkIns.push(buildCheckIn(student, true, null));
  }

  return {
    session: sessionWithClass,
    students: expectedStudents,
    walkIns,
  };
}

export async function searchStudents(
  query: string,
  limit = 8
): Promise<StudentSearchHit[]> {
  const supabase = await createClient();
  const trimmed = query.trim();
  if (!trimmed) return [];

  const { data, error } = await supabase
    .from("students")
    .select("id, full_name, skill_level, is_trial")
    .ilike("full_name", `%${trimmed}%`)
    .order("full_name")
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as StudentSearchHit[];
}
