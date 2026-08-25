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

type SessionClassFields = NonNullable<SessionWithClass["classes"]>;

type SessionClassRow = SessionClassFields & {
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
  row: SessionWithClass & {
    classes: SessionClassRow | SessionClassRow[] | null;
  } & SessionCoachRow
): { session: SessionWithClass; coachName: string | null } {
  const classRow = asSingle(row.classes);
  const coach =
    asSingle(row.profiles) ?? (classRow ? asSingle(classRow.profiles) : null);
  return {
    session: {
      ...row,
      kind: row.kind ?? "class",
      name: row.name ?? null,
      requires_attendance: row.requires_attendance ?? true,
      class_id: row.class_id ?? null,
      coach,
      classes: classRow
        ? {
            id: classRow.id,
            name: classRow.name,
            venue: classRow.venue ?? null,
            day_of_week: classRow.day_of_week,
            start_time: classRow.start_time,
            end_time: classRow.end_time,
            coach_id: classRow.coach_id,
            is_active: classRow.is_active,
            coach: asSingle(classRow.profiles),
          }
        : null,
    },
    coachName: coach?.full_name ?? null,
  };
}

const DASHBOARD_PACKAGE_SELECT = `
  id,
  student_id,
  session_id,
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
  session_id,
  package_product_id,
  total_credits,
  used_credits,
  remaining_credits,
  bonus_credits,
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
    session_id: (data.session_id as string | null | undefined) ?? null,
    bonus_credits: Number(data.bonus_credits ?? 0),
    customisation_notes:
      (data.customisation_notes as string | null | undefined) ?? null,
    amount_sgd: data.amount_sgd == null ? null : Number(data.amount_sgd),
  };
}

async function enrichDashboardSessions(
  supabase: SupabaseClient,
  rows: Array<
    SessionWithClass & {
      classes: SessionClassRow | SessionClassRow[] | null;
    } & SessionCoachRow
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

  const eventSessionIds = mapped
    .filter(({ session }) => session.kind === "event")
    .map(({ session }) => session.id);

  const [attendanceResult, classPackagesResult, eventPackagesResult] =
    await Promise.all([
      sessionIds.length === 0
        ? Promise.resolve({
            data: [] as {
              session_id: string;
              student_id: string;
              status: string | null;
              attendee_source: string | null;
            }[],
            error: null,
          })
        : supabase
            .from("attendance")
            .select("session_id, student_id, status, attendee_source")
            .in("session_id", sessionIds),
      studentIds.length === 0
        ? Promise.resolve({ data: [] as DashboardPackageRow[], error: null })
        : supabase
            .from("packages")
            .select(DASHBOARD_PACKAGE_SELECT)
            .in("student_id", studentIds)
            .is("session_id", null)
            .eq("is_paid", true)
            .gt("remaining_credits", 0),
      studentIds.length === 0 || eventSessionIds.length === 0
        ? Promise.resolve({ data: [] as DashboardPackageRow[], error: null })
        : supabase
            .from("packages")
            .select(DASHBOARD_PACKAGE_SELECT)
            .in("student_id", studentIds)
            .in("session_id", eventSessionIds),
    ]);

  if (attendanceResult.error) throw attendanceResult.error;
  if (classPackagesResult.error) throw classPackagesResult.error;
  if (eventPackagesResult.error) throw eventPackagesResult.error;

  const checkedInBySession = new Map<string, number>();
  const recordedExpectedBySession = new Map<string, Set<string>>();
  for (const row of attendanceResult.data ?? []) {
    const sessionId = row.session_id as string;
    const studentId = row.student_id as string;
    const status = row.status;
    const attendeeSource = row.attendee_source as string | null;
    if (status === "present") {
      checkedInBySession.set(
        sessionId,
        (checkedInBySession.get(sessionId) ?? 0) + 1
      );
    }
    if (attendeeSource !== "walk_in") {
      const recorded = recordedExpectedBySession.get(sessionId) ?? new Set();
      recorded.add(studentId);
      recordedExpectedBySession.set(sessionId, recorded);
    }
  }

  const packagesByStudent = groupByStudentId(
    (classPackagesResult.data ?? []) as DashboardPackageRow[]
  );
  const eventPackageByStudentSession = new Map<string, DashboardPackageRow>();
  for (const row of (eventPackagesResult.data ?? []) as DashboardPackageRow[]) {
    if (!row.session_id) continue;
    eventPackageByStudentSession.set(`${row.student_id}:${row.session_id}`, row);
  }
  const today = todayInSingapore();

  return mapped.map(({ session, coachName }) => {
    const roster = rosters.get(session.id) ?? [];
    let packageAlerts = 0;
    for (const entry of roster) {
      const pkg =
        session.kind === "event"
          ? (eventPackageByStudentSession.get(
              `${entry.studentId}:${session.id}`
            ) ?? null)
          : pickChargeablePackage(
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
      expectedCount: new Set([
        ...roster.map((entry) => entry.studentId),
        ...(recordedExpectedBySession.get(session.id) ?? []),
      ]).size,
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
    venue,
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
      `
    )
    .eq("session_date", today)
    .eq("coach_id", coachId)
    .order("session_date", { ascending: true });

  if (error) throw error;
  return (data ?? [])
    .map((row) =>
      mapSessionWithClass(
        row as SessionWithClass & {
          classes: SessionClassRow | SessionClassRow[] | null;
        } & SessionCoachRow
      ).session
    )
    .sort((a, b) =>
      sessionDisplayStart(a).localeCompare(sessionDisplayStart(b))
    );
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
      SessionWithClass & {
      classes: SessionClassRow | SessionClassRow[] | null;
    } & SessionCoachRow
    >
  );

  return results.sort((a, b) =>
    sessionDisplayStart(a.session).localeCompare(sessionDisplayStart(b.session))
  );
}

export async function getSessionsForDashboardRange(
  start: string,
  end: string
) {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select(DASHBOARD_SESSION_SELECT)
    .gte("session_date", start)
    .lte("session_date", end);

  if (error) throw error;

  const results = await enrichDashboardSessions(
    supabase,
    (sessions ?? []) as Array<
      SessionWithClass & {
      classes: SessionClassRow | SessionClassRow[] | null;
    } & SessionCoachRow
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

export async function getWeekSessionsForDashboard(
  monday: string,
  sunday: string
) {
  return getSessionsForDashboardRange(monday, sunday);
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
    .select(DASHBOARD_SESSION_SELECT)
    .eq("id", sessionId)
    .maybeSingle();

  if (sessionError) {
    throw sessionError;
  }
  if (!session) {
    throw new Error("Session not found");
  }

  const { session: sessionWithClass } = mapSessionWithClass(
    session as SessionWithClass & {
      classes: SessionClassRow | SessionClassRow[] | null;
    } & SessionCoachRow
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
        row.attendee_source === "walk_in" &&
        !expectedStudentIds.has(row.student_id as string)
    )
    .map((row) => row.student_id as string);

  const formerStudentIds = attendanceRows
    .filter(
      (row) =>
        row.attendee_source !== "walk_in" &&
        !expectedStudentIds.has(row.student_id as string)
    )
    .map((row) => row.student_id as string);

  const studentIds = [
    ...new Set([
      ...roster.map((entry) => entry.studentId),
      ...formerStudentIds,
      ...walkInStudentIds,
    ]),
  ];

  const isEvent = sessionWithClass.kind === "event";

  const [studentsResult, packagesResult] = await Promise.all([
    studentIds.length === 0
      ? Promise.resolve({ data: [] as Student[], error: null })
      : supabase.from("students").select("*").in("id", studentIds),
    studentIds.length === 0
      ? Promise.resolve({ data: [] as Package[], error: null })
      : isEvent
        ? supabase
            .from("packages")
            .select(CHECKIN_PACKAGE_SELECT)
            .in("student_id", studentIds)
            .eq("session_id", sessionId)
        : supabase
            .from("packages")
            .select(CHECKIN_PACKAGE_SELECT)
            .in("student_id", studentIds)
            .is("session_id", null)
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
    const pkg = isEvent
      ? (packagesByStudent.get(student.id)?.[0] ?? null)
      : pickChargeablePackage(
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
      chargeablePackageId:
        pkg && pkg.is_paid && pkg.remaining_credits > 0 ? pkg.id : null,
      isWalkIn:
        isWalkIn ||
        (attendanceByStudent.get(student.id) as CheckInStudent["attendance"])
          ?.attendee_source === "walk_in",
      rosterSource,
    };
  }

  const expectedStudents: CheckInStudent[] = [];
  for (const entry of roster) {
    const student = studentsById.get(entry.studentId);
    if (!student || student.archived_at) continue;
    expectedStudents.push(buildCheckIn(student, false, entry.source));
  }
  for (const studentId of formerStudentIds) {
    const student = studentsById.get(studentId);
    if (!student) continue;
    expectedStudents.push(buildCheckIn(student, false, "former"));
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
    .is("archived_at", null)
    .ilike("full_name", `%${trimmed}%`)
    .order("full_name")
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as StudentSearchHit[];
}
