"use server";

import { requireRole } from "@/lib/auth/profile";
import {
  CANCELLATION_REASONS,
  dayOfWeekForDate,
  weekendDatesInCurrentWeek,
  type CancellationReason,
} from "@/lib/session-utils";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function revalidateSessionPaths(sessionId?: string) {
  revalidatePath("/admin");
  revalidatePath("/coach");
  if (sessionId) {
    revalidatePath(`/coach/sessions/${sessionId}`);
  }
}

async function generateSessionsForDate(
  sessionDate: string
): Promise<{ created: number; skipped: number } | { error: string }> {
  const dayOfWeek = dayOfWeekForDate(sessionDate);
  if (!dayOfWeek) {
    return { created: 0, skipped: 0 };
  }

  const supabase = await createClient();

  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("id")
    .eq("is_active", true)
    .eq("day_of_week", dayOfWeek);

  if (classesError) {
    return { error: classesError.message };
  }

  if (!classes?.length) {
    return { created: 0, skipped: 0 };
  }

  const classIds = classes.map((cls) => cls.id as string);

  const { data: existing, error: existingError } = await supabase
    .from("sessions")
    .select("class_id")
    .eq("session_date", sessionDate)
    .in("class_id", classIds);

  if (existingError) {
    return { error: existingError.message };
  }

  const existingClassIds = new Set(
    (existing ?? []).map((row) => row.class_id as string)
  );
  const toCreate = classIds.filter((id) => !existingClassIds.has(id));

  if (toCreate.length === 0) {
    return { created: 0, skipped: classIds.length };
  }

  const { error: insertError } = await supabase.from("sessions").insert(
    toCreate.map((class_id) => ({
      class_id,
      session_date: sessionDate,
    }))
  );

  if (insertError) {
    return { error: insertError.message };
  }

  return {
    created: toCreate.length,
    skipped: classIds.length - toCreate.length,
  };
}

export async function generateSessionsForWeek() {
  await requireRole(["admin"]);

  const { saturday, sunday } = weekendDatesInCurrentWeek();
  let created = 0;
  let skipped = 0;

  for (const date of [saturday, sunday]) {
    const result = await generateSessionsForDate(date);
    if ("error" in result) {
      return { error: result.error };
    }
    created += result.created;
    skipped += result.skipped;
  }

  revalidateSessionPaths();
  return { created, skipped, saturday, sunday };
}

export async function cancelSession(
  sessionId: string,
  reason: CancellationReason,
  note?: string | null
) {
  const profile = await requireRole(["admin"]);

  if (!(CANCELLATION_REASONS as readonly string[]).includes(reason)) {
    return { error: "Select a valid cancellation reason." };
  }

  const trimmedNote = note?.trim() || null;
  if (reason === "other" && !trimmedNote) {
    return { error: "A note is required when the reason is Other." };
  }

  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, class_id, cancelled")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Session not found." };
  }

  if (session.cancelled) {
    return { error: "This session is already cancelled." };
  }

  const { error: updateError } = await supabase
    .from("sessions")
    .update({
      cancelled: true,
      cancellation_reason: reason,
      cancellation_note: trimmedNote,
      cancelled_by: profile.id,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (updateError) {
    return { error: updateError.message };
  }

  const { data: enrolments, error: enrolmentError } = await supabase
    .from("enrolments")
    .select("student_id")
    .eq("class_id", session.class_id);

  if (enrolmentError) {
    return { error: enrolmentError.message };
  }

  if (enrolments?.length) {
    const rows = enrolments.map((row) => ({
      session_id: sessionId,
      student_id: row.student_id as string,
      status: "session_cancelled" as const,
      deduct_credit: false,
      marked_by: profile.id,
      marked_at: new Date().toISOString(),
      walk_in_status: null,
      decline_reason: null,
      package_id: null,
    }));

    const { error: attendanceError } = await supabase
      .from("attendance")
      .upsert(rows, { onConflict: "session_id,student_id" });

    if (attendanceError) {
      return { error: attendanceError.message };
    }
  }

  revalidateSessionPaths(sessionId);
  return { success: true as const };
}
