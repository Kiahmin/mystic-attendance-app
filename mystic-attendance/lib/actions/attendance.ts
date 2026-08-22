"use server";

import { createClient } from "@/lib/supabase/server";
import { defaultDeductCredit } from "@/lib/attendance-utils";
import { requireProfile } from "@/lib/auth/profile";
import type { AttendanceStatus, WalkInStatus } from "@/lib/types";
import { revalidateSessionAttendance } from "@/lib/revalidate-session";

async function resolveChargeablePackage(
  studentId: string,
  sessionDate: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("resolve_chargeable_package", {
    p_student_id: studentId,
    p_session_date: sessionDate,
  });

  if (error) {
    console.error("resolve_chargeable_package:", error.message);
    return null;
  }

  return data as string | null;
}

async function resolveEventPackage(
  studentId: string,
  sessionId: string,
  sessionDate: string
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      "id, is_paid, paused_at, resumed_at, expires_at, used_credits, remaining_credits"
    )
    .eq("student_id", studentId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) {
    console.error("resolve_event_package:", error.message);
    return null;
  }
  if (!data?.is_paid) return null;
  if (Number(data.remaining_credits) <= 0) return null;
  if (
    data.paused_at != null &&
    data.resumed_at == null &&
    data.paused_at <= sessionDate
  ) {
    return null;
  }
  if (data.expires_at != null && data.expires_at < sessionDate) return null;

  return data.id as string;
}

export async function markAttendance(
  sessionId: string,
  studentId: string,
  status: AttendanceStatus
) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("session_date, cancelled, requires_attendance, kind")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Session not found." };
  }

  if (session.cancelled) {
    return { error: "This session has been cancelled." };
  }

  if (session.requires_attendance === false) {
    return { error: "Attendance is not taken for this event." };
  }

  const deduct_credit = defaultDeductCredit(status);
  const package_id = deduct_credit
    ? session.kind === "event"
      ? await resolveEventPackage(studentId, sessionId, session.session_date)
      : await resolveChargeablePackage(studentId, session.session_date)
    : null;

  const { error } = await supabase.from("attendance").upsert(
    {
      session_id: sessionId,
      student_id: studentId,
      status,
      deduct_credit,
      package_id,
      marked_by: profile.id,
      marked_at: new Date().toISOString(),
      walk_in_status: null,
      decline_reason: null,
    },
    { onConflict: "session_id,student_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidateSessionAttendance(sessionId);
  return { success: true };
}

export async function markWalkIn(
  sessionId: string,
  studentId: string,
  walkInStatus: WalkInStatus,
  declineReason?: string
) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("session_date, cancelled, class_id, requires_attendance")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Session not found." };
  }

  if (session.cancelled) {
    return { error: "This session has been cancelled." };
  }

  if (session.requires_attendance === false) {
    return { error: "Attendance is not taken for this event." };
  }

  if (walkInStatus === "declined" && !declineReason?.trim()) {
    return { error: "A reason is required when declining a walk-in." };
  }

  const { error } = await supabase.from("attendance").upsert(
    {
      session_id: sessionId,
      student_id: studentId,
      status: "walk_in",
      walk_in_status: walkInStatus,
      decline_reason:
        walkInStatus === "declined" ? declineReason?.trim() ?? null : null,
      deduct_credit: false,
      package_id: null,
      marked_by: profile.id,
      marked_at: new Date().toISOString(),
    },
    { onConflict: "session_id,student_id" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidateSessionAttendance(sessionId);
  return { success: true };
}

export async function clearAttendance(sessionId: string, studentId: string) {
  await requireProfile();
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("requires_attendance")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Session not found." };
  }

  if (session.requires_attendance === false) {
    return { error: "Attendance is not taken for this event." };
  }

  const { error } = await supabase
    .from("attendance")
    .delete()
    .eq("session_id", sessionId)
    .eq("student_id", studentId);

  if (error) {
    return { error: error.message };
  }

  revalidateSessionAttendance(sessionId);
  return { success: true };
}
