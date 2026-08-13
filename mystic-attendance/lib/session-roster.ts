import type { Student } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type SessionRosterSource = "enrolled" | "include";

export type SessionRosterEntry = {
  studentId: string;
  source: SessionRosterSource;
};

export type SessionRosterStudent = {
  student: Pick<Student, "id" | "full_name" | "skill_level">;
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
  const [
    { data: enrolments, error: enrolmentError },
    { data: overrides, error: overrideError },
  ] = await Promise.all([
    supabase.from("enrolments").select("student_id").eq("class_id", classId),
    supabase
      .from("session_attendee_overrides")
      .select("student_id, kind")
      .eq("session_id", sessionId),
  ]);

  if (enrolmentError) throw enrolmentError;
  if (overrideError) throw overrideError;

  return computeEffectiveRoster(
    (enrolments ?? []).map((row) => row.student_id as string),
    (overrides ?? []) as OverrideRow[]
  );
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
    .select("id, full_name, skill_level")
    .in(
      "id",
      roster.map((entry) => entry.studentId)
    );

  if (error) throw error;

  const byId = new Map(
    (students ?? []).map((s) => [
      s.id as string,
      s as Pick<Student, "id" | "full_name" | "skill_level">,
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
