"use server";

import {
  emptyToNull,
  isMinorDob,
  SKILL_LEVELS,
} from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import type { SkillLevel } from "@/lib/types";
import { revalidatePath } from "next/cache";

export type StudentInput = {
  full_name: string;
  date_of_birth?: string | null;
  contact_phone?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  skill_level?: SkillLevel | null;
  notes?: string | null;
};

function validateStudentInput(input: StudentInput): string | null {
  const fullName = input.full_name?.trim() ?? "";
  if (!fullName) return "Student name is required.";

  const dob = emptyToNull(input.date_of_birth);
  if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return "Date of birth must be YYYY-MM-DD.";
  }

  if (dob && isMinorDob(dob) && !emptyToNull(input.guardian_name)) {
    return "Guardian name is required for students under 18.";
  }

  const skill = input.skill_level ?? null;
  if (skill && !SKILL_LEVELS.includes(skill)) {
    return "Invalid skill level.";
  }

  return null;
}

function toStudentRow(input: StudentInput) {
  return {
    full_name: input.full_name.trim(),
    date_of_birth: emptyToNull(input.date_of_birth),
    contact_phone: emptyToNull(input.contact_phone),
    guardian_name: emptyToNull(input.guardian_name),
    guardian_phone: emptyToNull(input.guardian_phone),
    skill_level: input.skill_level ?? null,
    notes: emptyToNull(input.notes),
  };
}

export async function createStudent(input: StudentInput) {
  await requireRole(["admin"]);

  const validationError = validateStudentInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .insert(toStudentRow(input))
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/students");
  return { success: true as const, id: data.id as string };
}

export async function updateStudent(id: string, input: StudentInput) {
  await requireRole(["admin"]);

  if (!id) return { error: "Student id is required." };

  const validationError = validateStudentInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update(toStudentRow(input))
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${id}`);
  return { success: true as const };
}
