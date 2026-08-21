import type { Student } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type SessionRosterSource = "enrolled" | "include";

export type SessionRosterEntry = {
  studentId: string;
  source: SessionRosterSource;
};

export type SessionRosterStudent = {
  student: Pick<Student, "id" | "full_name" | "skill_level" | "is_trial">;
  source: SessionRosterSource;
};

type OverrideRow = {
  student_id: string;
  kind: "include" | "exclude";
};

/**
 * Effective expected roster for a session:
 * (class enrolments − excludes) ∪ includes
 */
export function computeEffectiveRoster(
  enrolledStudentIds: string[],
  overrides: OverrideRow[]
): SessionRosterEntry[] {
  const excludeIds = new Set(
    overrides.filter((o) => o.kind === "exclude").map((o) => o.student_id)
  );
  const includeIds = overrides
    .filter((o) => o.kind === "include")
    .map((o) => o.student_id);

  const enrolledSet = new Set(enrolledStudentIds);
  const entries: SessionRosterEntry[] = [];

  for (const studentId of enrolledStudentIds) {
    if (excludeIds.has(studentId)) continue;
    entries.push({ studentId, source: "enrolled" });
  }

  for (const studentId of includeIds) {
    if (enrolledSet.has(studentId)) continue;
    entries.push({ studentId, source: "include" });
  }

  return entries;
}

export async function loadEffectiveSessionRoster(
  supabase: SupabaseClient,
  sessionId: string,
  classId: string
): Promise<SessionRosterEntry[]> {
  const rosters = await loadEffectiveSessionRosters(supabase, [
    { sessionId, classId },
  ]);
  return rosters.get(sessionId) ?? [];
}

/** Load expected rosters for many sessions, excluding archived students. */
export async function loadEffectiveSessionRosters(
  supabase: SupabaseClient,
  sessions: { sessionId: string; classId: string }[]
): Promise<Map<string, SessionRosterEntry[]>> {
  const result = new Map<string, SessionRosterEntry[]>();
  if (sessions.length === 0) return result;

  const classIds = [...new Set(sessions.map((session) => session.classId))];
  const sessionIds = [...new Set(sessions.map((session) => session.sessionId))];

  const [
    { data: enrolments, error: enrolmentError },
    { data: overrides, error: overrideError },
  ] = await Promise.all([
    supabase
      .from("enrolments")
      .select("student_id, class_id")
      .in("class_id", classIds),
    supabase
      .from("session_attendee_overrides")
      .select("student_id, kind, session_id")
      .in("session_id", sessionIds),
  ]);

  if (enrolmentError) throw enrolmentError;
  if (overrideError) throw overrideError;

  const candidateIds = [
    ...new Set([
      ...(enrolments ?? []).map((row) => row.student_id as string),
      ...(overrides ?? []).map((row) => row.student_id as string),
    ]),
  ];

  const archivedResult =
    candidateIds.length === 0
      ? { data: [] as { id: string }[], error: null }
      : await supabase
          .from("students")
          .select("id")
          .in("id", candidateIds)
          .not("archived_at", "is", null);

  if (archivedResult.error) throw archivedResult.error;

  const archivedIds = new Set(
    (archivedResult.data ?? []).map((row) => row.id as string)
  );

  const enrolmentsByClass = new Map<string, string[]>();
  for (const row of enrolments ?? []) {
    const classId = row.class_id as string;
    const studentId = row.student_id as string;
    if (archivedIds.has(studentId)) continue;
    const list = enrolmentsByClass.get(classId);
    if (list) list.push(studentId);
    else enrolmentsByClass.set(classId, [studentId]);
  }

  const overridesBySession = new Map<string, OverrideRow[]>();
  for (const row of overrides ?? []) {
    const studentId = row.student_id as string;
    const kind = row.kind as OverrideRow["kind"];
    if (kind === "include" && archivedIds.has(studentId)) continue;
    const sessionId = row.session_id as string;
    const entry: OverrideRow = { student_id: studentId, kind };
    const list = overridesBySession.get(sessionId);
    if (list) list.push(entry);
    else overridesBySession.set(sessionId, [entry]);
  }

  for (const session of sessions) {
    result.set(
      session.sessionId,
      computeEffectiveRoster(
        enrolmentsByClass.get(session.classId) ?? [],
        overridesBySession.get(session.sessionId) ?? []
      )
    );
  }

  return result;
}

export async function loadEffectiveSessionRosterStudents(
  supabase: SupabaseClient,
  sessionId: string,
  classId: string
): Promise<SessionRosterStudent[]> {
  const roster = await loadEffectiveSessionRoster(supabase, sessionId, classId);
  if (roster.length === 0) return [];

  const { data: students, error } = await supabase
    .from("students")
    .select("id, full_name, skill_level, is_trial")
    .in(
      "id",
      roster.map((entry) => entry.studentId)
    );

  if (error) throw error;

  const byId = new Map(
    (students ?? []).map((s) => [
      s.id as string,
      s as Pick<Student, "id" | "full_name" | "skill_level" | "is_trial">,
    ])
  );

  const result: SessionRosterStudent[] = [];
  for (const entry of roster) {
    const student = byId.get(entry.studentId);
    if (!student) continue;
    result.push({ student, source: entry.source });
  }

  result.sort((a, b) =>
    a.student.full_name.localeCompare(b.student.full_name)
  );
  return result;
}
