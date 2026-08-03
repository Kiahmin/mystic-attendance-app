"use server";

import { createClient } from "@/lib/supabase/server";
import { defaultDeductCredit } from "@/lib/attendance-utils";
import { requireProfile } from "@/lib/auth/profile";
import type { AttendanceStatus, WalkInStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

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

export async function markAttendance(
  sessionId: string,
  studentId: string,
  status: AttendanceStatus
) {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("session_date, cancelled")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Session not found." };
  }

  if (session.cancelled) {
    return { error: "This session has been cancelled." };
  }

  const deduct_credit = defaultDeductCredit(status);
  const package_id = deduct_credit
    ? await resolveChargeablePackage(studentId, session.session_date)
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

  revalidatePath(`/coach/sessions/${sessionId}`);
  revalidatePath("/coach");
  revalidatePath("/admin");
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
    .select("session_date, cancelled, class_id")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Session not found." };
  }

  if (session.cancelled) {
    return { error: "This session has been cancelled." };
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

  revalidatePath(`/coach/sessions/${sessionId}`);
  revalidatePath("/coach");
  return { success: true };
}

export async function clearAttendance(sessionId: string, studentId: string) {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("attendance")
    .delete()
    .eq("session_id", sessionId)
    .eq("student_id", studentId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/coach/sessions/${sessionId}`);
  revalidatePath("/coach");
  return { success: true };
}
