"use server";

import { requireRole } from "@/lib/auth/profile";
import { loadEffectiveSessionRosterStudents } from "@/lib/session-roster";
import type { SessionRosterStudent } from "@/lib/session-roster";
import { searchStudents } from "@/lib/queries/sessions";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidateSessionAttendance } from "@/lib/revalidate-session";

function revalidateAttendeePaths(sessionId: string) {
  revalidateSessionAttendance(sessionId);
}

type SessionRow = {
  id: string;
  class_id: string;
  cancelled: boolean;
};

async function loadSessionOrError(
  sessionId: string
): Promise<
  | { ok: true; session: SessionRow; supabase: SupabaseClient }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const { data: session, error } = await supabase
    .from("sessions")
    .select("id, class_id, cancelled")
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    return { ok: false, error: "Session not found." };
  }

  return {
    ok: true,
    session: session as SessionRow,
    supabase,
  };
}

export async function getSessionAttendeesForEditor(
  sessionId: string
): Promise<
  | { attendees: SessionRosterStudent[]; cancelled: boolean }
  | { error: string }
> {
  await requireRole(["admin", "coach"]);
  const loaded = await loadSessionOrError(sessionId);
  if (!loaded.ok) return { error: loaded.error };

  const { session, supabase } = loaded;
  try {
    const attendees = await loadEffectiveSessionRosterStudents(
      supabase,
      session.id,
      session.class_id
    );
    return { attendees, cancelled: session.cancelled };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to load attendees.",
    };
  }
}

export async function searchStudentsForSessionAttendees(query: string) {
  await requireRole(["admin", "coach"]);
  return searchStudents(query);
}

/**
 * Add a non-enrolled student for this session only.
 * If they were previously excluded (enrolled), clearing the exclude restores them.
 */
export async function includeStudentInSession(
  sessionId: string,
  studentId: string
): Promise<{ success: true } | { error: string }> {
  const profile = await requireRole(["admin", "coach"]);

  if (!sessionId || !studentId) {
    return { error: "Session and student are required." };
  }

  const loaded = await loadSessionOrError(sessionId);
  if (!loaded.ok) return { error: loaded.error };
  const { session, supabase } = loaded;

  if (session.cancelled) {
    return { error: "Cannot edit attendees on a cancelled session." };
  }

  const { data: enrolment } = await supabase
    .from("enrolments")
    .select("id")
    .eq("class_id", session.class_id)
    .eq("student_id", studentId)
    .maybeSingle();

  const { data: existing } = await supabase
    .from("session_attendee_overrides")
    .select("id, kind")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (enrolment) {
    if (existing?.kind === "exclude") {
      const { error } = await supabase
        .from("session_attendee_overrides")
        .delete()
        .eq("id", existing.id);
      if (error) return { error: error.message };
      revalidateAttendeePaths(sessionId);
      return { success: true };
    }
    return { error: "Student is already on the class roster for this session." };
  }

  if (existing?.kind === "include") {
    return { error: "Student is already added to this session." };
  }

  if (existing) {
    const { error } = await supabase
      .from("session_attendee_overrides")
      .update({ kind: "include", created_by: profile.id })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("session_attendee_overrides").insert({
      session_id: sessionId,
      student_id: studentId,
      kind: "include",
      created_by: profile.id,
    });
    if (error) return { error: error.message };
  }

  revalidateAttendeePaths(sessionId);
  return { success: true };
}

/**
 * Remove from this session only:
 * - enrolled → write exclude
 * - one-off include → delete include
 */
export async function excludeStudentFromSession(
  sessionId: string,
  studentId: string
): Promise<{ success: true } | { error: string }> {
  const profile = await requireRole(["admin", "coach"]);

  if (!sessionId || !studentId) {
    return { error: "Session and student are required." };
  }

  const loaded = await loadSessionOrError(sessionId);
  if (!loaded.ok) return { error: loaded.error };
  const { session, supabase } = loaded;

  if (session.cancelled) {
    return { error: "Cannot edit attendees on a cancelled session." };
  }

  const { data: enrolment } = await supabase
    .from("enrolments")
    .select("id")
    .eq("class_id", session.class_id)
    .eq("student_id", studentId)
    .maybeSingle();

  const { data: existing } = await supabase
    .from("session_attendee_overrides")
    .select("id, kind")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (existing?.kind === "include") {
    const { error } = await supabase
      .from("session_attendee_overrides")
      .delete()
      .eq("id", existing.id);
    if (error) return { error: error.message };
    revalidateAttendeePaths(sessionId);
    return { success: true };
  }

  if (!enrolment) {
    return { error: "Student is not on this session’s expected roster." };
  }

  if (existing?.kind === "exclude") {
    return { error: "Student is already excluded from this session." };
  }

  if (existing) {
    const { error } = await supabase
      .from("session_attendee_overrides")
      .update({ kind: "exclude", created_by: profile.id })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("session_attendee_overrides").insert({
      session_id: sessionId,
      student_id: studentId,
      kind: "exclude",
      created_by: profile.id,
    });
    if (error) return { error: error.message };
  }

  revalidateAttendeePaths(sessionId);
  return { success: true };
}

/** Restore class default for this student on this session (delete override). */
export async function clearSessionAttendeeOverride(
  sessionId: string,
  studentId: string
): Promise<{ success: true } | { error: string }> {
  await requireRole(["admin", "coach"]);

  if (!sessionId || !studentId) {
    return { error: "Session and student are required." };
  }

  const loaded = await loadSessionOrError(sessionId);
  if (!loaded.ok) return { error: loaded.error };
  const { session, supabase } = loaded;

  if (session.cancelled) {
    return { error: "Cannot edit attendees on a cancelled session." };
  }

  const { error } = await supabase
    .from("session_attendee_overrides")
    .delete()
    .eq("session_id", sessionId)
    .eq("student_id", studentId);

  if (error) return { error: error.message };

  revalidateAttendeePaths(sessionId);
  return { success: true };
}
