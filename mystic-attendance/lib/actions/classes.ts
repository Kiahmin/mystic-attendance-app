"use server";

import {
  DAYS_OF_WEEK,
  emptyToNull,
  normalizeTime,
  timeToMinutes,
} from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import type { DayOfWeek } from "@/lib/types";
import { revalidatePath } from "next/cache";

export type ClassInput = {
  name: string;
  venue_id: string;
  day_of_week?: DayOfWeek;
  days_of_week?: DayOfWeek[];
  start_time: string;
  end_time: string;
  coach_id?: string | null;
  is_active?: boolean;
};

function resolveDays(input: ClassInput): DayOfWeek[] {
  const raw = input.days_of_week?.length
    ? input.days_of_week
    : input.day_of_week
      ? [input.day_of_week]
      : [];
  return [...new Set(raw)].filter((day) => DAYS_OF_WEEK.includes(day));
}

function validateClassInput(input: ClassInput): string | null {
  const name = input.name?.trim() ?? "";
  if (!name) return "Class name is required.";

  if (!input.venue_id) {
    return "Select a venue.";
  }

  if (resolveDays(input).length === 0) {
    return "Select at least one day of the week.";
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

function toClassRow(input: ClassInput, dayOfWeek: DayOfWeek) {
  return {
    name: input.name.trim(),
    venue_id: input.venue_id,
    day_of_week: dayOfWeek,
    start_time: normalizeTime(input.start_time),
    end_time: normalizeTime(input.end_time),
    coach_id: emptyToNull(input.coach_id),
    is_active: input.is_active ?? true,
  };
}

export async function createClass(input: ClassInput) {
  await requireRole(["admin"]);

  const validationError = validateClassInput(input);
  if (validationError) return { error: validationError };

  const days = resolveDays(input);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .insert(days.map((day) => toClassRow(input, day)))
    .select("id");

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/classes");
  revalidatePath("/admin");
  revalidatePath("/admin/schedule");
  const ids = (data ?? []).map((row) => row.id as string);
  return { success: true as const, id: ids[0], ids };
}

export async function updateClass(id: string, input: ClassInput) {
  await requireRole(["admin"]);

  if (!id) return { error: "Class id is required." };

  const validationError = validateClassInput(input);
  if (validationError) return { error: validationError };

  const day = resolveDays(input)[0];
  if (!day) return { error: "Select a valid day of the week." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("classes")
    .update(toClassRow(input, day))
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/classes");
  revalidatePath("/admin");
  revalidatePath("/admin/schedule");
  revalidatePath(`/admin/classes/${id}`);
  return { success: true as const };
}

export async function setClassActive(id: string, isActive: boolean) {
  await requireRole(["admin"]);

  if (!id) return { error: "Class id is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("classes")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/classes");
  revalidatePath("/admin");
  revalidatePath("/admin/schedule");
  revalidatePath(`/admin/classes/${id}`);
  return { success: true as const };
}
