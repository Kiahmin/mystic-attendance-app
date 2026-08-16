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
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  coach_id?: string | null;
  is_active?: boolean;
};

function validateClassInput(input: ClassInput): string | null {
  const name = input.name?.trim() ?? "";
  if (!name) return "Class name is required.";

  if (!DAYS_OF_WEEK.includes(input.day_of_week)) {
    return "Select a valid day of the week.";
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

function toClassRow(input: ClassInput) {
  return {
    name: input.name.trim(),
    day_of_week: input.day_of_week,
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

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("classes")
    .insert(toClassRow(input))
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/classes");
  return { success: true as const, id: data.id as string };
}

export async function updateClass(id: string, input: ClassInput) {
  await requireRole(["admin"]);

  if (!id) return { error: "Class id is required." };

  const validationError = validateClassInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("classes")
    .update(toClassRow(input))
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/classes");
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
  revalidatePath(`/admin/classes/${id}`);
  return { success: true as const };
}
