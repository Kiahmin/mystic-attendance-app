"use server";

import {
  emptyToNull,
  normalizeTime,
  timeToMinutes,
} from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import { isValidCalendarDate } from "@/lib/datetime";
import {
  CANCELLATION_REASONS,
  dayOfWeekForDate,
  resolveWeekDates,
  type CancellationReason,
} from "@/lib/session-utils";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { revalidateSessionAttendance } from "@/lib/revalidate-session";

export type EventInput = {
  name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  coach_id?: string | null;
  requires_attendance?: boolean;
};

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

export async function generateSessionsForDates(dates: string[]) {
  await requireRole(["admin"]);

  const uniqueDates = [
    ...new Set(dates.filter((date) => isValidCalendarDate(date))),
  ].sort();

  let created = 0;
  let skipped = 0;

  for (const date of uniqueDates) {
    const result = await generateSessionsForDate(date);
    if ("error" in result) {
      return { error: result.error };
    }
    created += result.created;
    skipped += result.skipped;
  }

  revalidateSessionPaths();
  return {
    created,
    skipped,
    start: uniqueDates[0] ?? null,
    end: uniqueDates.at(-1) ?? null,
  };
}

export async function generateSessionsForWeek(weekMonday?: string | null) {
  const { monday, sunday, dates } = resolveWeekDates(weekMonday);
  const result = await generateSessionsForDates(dates);
  if ("error" in result) return result;
  return { ...result, monday, sunday };
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
    .select("id, cancelled")
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

  const { error: attendanceError } = await supabase
    .from("attendance")
    .delete()
    .eq("session_id", sessionId);

  if (attendanceError) {
    return { error: attendanceError.message };
  }

  revalidateSessionPaths(sessionId);
  return { success: true as const };
}

function validateEventInput(input: EventInput): string | null {
  const name = input.name?.trim() ?? "";
  if (!name) return "Event name is required.";
  if (!isValidCalendarDate(input.session_date ?? "")) {
    return "Select a valid date.";
  }

  const start = normalizeTime(input.start_time ?? "");
  const end = normalizeTime(input.end_time ?? "");
  const startMins = timeToMinutes(start);
  const endMins = timeToMinutes(end);

  if (startMins === null || endMins === null) {
    return "Start and end times must be valid (HH:MM).";
  }
  if (startMins >= endMins) {
    return "Start time must be before end time.";
  }

  return null;
}

async function assertValidCoach(
  supabase: SupabaseClient,
  coachId: string | null
): Promise<string | null> {
  if (!coachId) return null;

  const { data: coach, error: coachError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", coachId)
    .eq("role", "coach")
    .maybeSingle();

  if (coachError) return coachError.message;
  if (!coach) return "Select a valid coach.";
  return null;
}

function toEventRow(input: EventInput) {
  return {
    kind: "event" as const,
    class_id: null,
    name: input.name.trim(),
    session_date: input.session_date,
    start_time: normalizeTime(input.start_time),
    end_time: normalizeTime(input.end_time),
    coach_id: emptyToNull(input.coach_id),
    requires_attendance: input.requires_attendance ?? true,
  };
}

export async function updateSessionCoach(
  sessionId: string,
  coachId: string | null
) {
  await requireRole(["admin"]);

  const supabase = await createClient();
  const coachError = await assertValidCoach(supabase, coachId);
  if (coachError) return { error: coachError };

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

export async function createEvent(input: EventInput) {
  await requireRole(["admin"]);

  const validationError = validateEventInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const coachError = await assertValidCoach(
    supabase,
    emptyToNull(input.coach_id)
  );
  if (coachError) return { error: coachError };

  const { data, error } = await supabase
    .from("sessions")
    .insert(toEventRow(input))
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidateSessionPaths();
  return { success: true as const, id: data.id as string };
}

export async function updateEvent(sessionId: string, input: EventInput) {
  await requireRole(["admin"]);

  if (!sessionId) return { error: "Session is required." };

  const validationError = validateEventInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, kind")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Event not found." };
  }
  if (session.kind !== "event") {
    return { error: "Only ad-hoc events can be edited this way." };
  }

  const coachError = await assertValidCoach(
    supabase,
    emptyToNull(input.coach_id)
  );
  if (coachError) return { error: coachError };

  const { error } = await supabase
    .from("sessions")
    .update(toEventRow(input))
    .eq("id", sessionId);

  if (error) return { error: error.message };

  revalidateSessionPaths(sessionId);
  return { success: true as const };
}

export async function deleteEvent(sessionId: string) {
  await requireRole(["admin"]);

  if (!sessionId) return { error: "Session is required." };

  const supabase = await createClient();
  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, kind")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session) {
    return { error: "Event not found." };
  }
  if (session.kind !== "event") {
    return { error: "Only ad-hoc events can be deleted." };
  }

  const { error: attendanceError } = await supabase
    .from("attendance")
    .delete()
    .eq("session_id", sessionId);

  if (attendanceError) return { error: attendanceError.message };

  const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
  if (error) return { error: error.message };

  revalidateSessionPaths();
  return { success: true as const };
}
