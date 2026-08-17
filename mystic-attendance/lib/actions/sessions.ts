"use server";

import { requireRole } from "@/lib/auth/profile";
import { loadEffectiveSessionRoster } from "@/lib/session-roster";
import {
  CANCELLATION_REASONS,
  dayOfWeekForDate,
  resolveWeekDates,
  type CancellationReason,
} from "@/lib/session-utils";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { revalidateSessionAttendance } from "@/lib/revalidate-session";

function revalidateSessionPaths(sessionId?: string) {
  if (sessionId) {
    revalidateSessionAttendance(sessionId);
    return;
  }
  revalidatePath("/admin");
  revalidatePath("/coach");
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
    .select("id, coach_id, start_time, end_time")
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
  const toCreate = classes.filter(
    (cls) => !existingClassIds.has(cls.id as string)
  );

  if (toCreate.length === 0) {
    return { created: 0, skipped: classIds.length };
  }

  const { error: insertError } = await supabase.from("sessions").insert(
    toCreate.map((cls) => ({
      class_id: cls.id,
      session_date: sessionDate,
      coach_id: cls.coach_id,
      start_time: cls.start_time,
      end_time: cls.end_time,
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

export async function generateSessionsForWeek(weekMonday?: string | null) {
  await requireRole(["admin"]);

  const { monday, sunday, dates } = resolveWeekDates(weekMonday);
  let created = 0;
  let skipped = 0;

  for (const date of dates) {
    const result = await generateSessionsForDate(date);
    if ("error" in result) {
      return { error: result.error };
    }
    created += result.created;
    skipped += result.skipped;
  }

  revalidateSessionPaths();
  return { created, skipped, monday, sunday };
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

  let roster;
  try {
    roster = await loadEffectiveSessionRoster(
      supabase,
      sessionId,
      session.class_id as string
    );
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to load roster.",
    };
  }

  if (roster.length) {
    const rows = roster.map((entry) => ({
      session_id: sessionId,
      student_id: entry.studentId,
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

export async function updateSessionCoach(
  sessionId: string,
  coachId: string | null
) {
  await requireRole(["admin"]);

  const supabase = await createClient();

  if (coachId) {
    const { data: coach, error: coachError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", coachId)
      .eq("role", "coach")
      .maybeSingle();

    if (coachError) {
      return { error: coachError.message };
    }
    if (!coach) {
      return { error: "Select a valid coach." };
    }
  }

  const { error } = await supabase
    .from("sessions")
    .update({ coach_id: coachId })
    .eq("id", sessionId);

  if (error) {
    return { error: error.message };
  }

  revalidateSessionPaths(sessionId);
  return { success: true as const };
}
