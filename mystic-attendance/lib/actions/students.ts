"use server";

import {
  emptyToNull,
  isMinorDob,
  SKILL_LEVELS,
} from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import { assignPackage } from "@/lib/actions/packages";
import {
  PAYMENT_METHODS,
  isTrialProductType,
} from "@/lib/package-utils";
import {
  getPackageProductById,
  studentHasTrialProductPackage,
} from "@/lib/queries/packages";
import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod, SkillLevel } from "@/lib/types";
import { revalidatePath } from "next/cache";

export type TrialPackageInput = {
  package_product_id: string;
  is_paid: boolean;
  payment_method?: PaymentMethod | null;
  amount_sgd?: number | null;
};

export type StudentInput = {
  full_name: string;
  date_of_birth?: string | null;
  contact_phone?: string | null;
  guardian_name?: string | null;
  guardian_phone?: string | null;
  skill_level?: SkillLevel | null;
  notes?: string | null;
  is_trial: boolean;
  trial?: TrialPackageInput | null;
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

function validateTrialPackageInput(
  trial: TrialPackageInput | null | undefined
): string | null {
  if (!trial?.package_product_id) return "Choose a trial package.";

  if (trial.is_paid) {
    if (!trial.payment_method || !PAYMENT_METHODS.includes(trial.payment_method)) {
      return "Payment method is required for paid packages.";
    }
    if (trial.amount_sgd == null || Number.isNaN(trial.amount_sgd)) {
      return "Amount in SGD is required for paid packages.";
    }
    if (trial.amount_sgd < 0) {
      return "Amount cannot be negative.";
    }
  }

  return null;
}

async function resolveTrialProduct(productId: string) {
  const product = await getPackageProductById(productId);
  if (!product || !product.is_active || !isTrialProductType(product.product_type)) {
    return { error: "Selected trial package is not available." } as const;
  }
  return { product } as const;
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
    is_trial: input.is_trial,
  };
}

function revalidateStudentPaths(studentId?: string) {
  revalidatePath("/admin/students");
  revalidatePath("/admin");
  revalidatePath("/coach");
  if (studentId) {
    revalidatePath(`/admin/students/${studentId}`);
  }
}

export async function createStudent(input: StudentInput) {
  await requireRole(["admin"]);

  const validationError = validateStudentInput(input);
  if (validationError) return { error: validationError };

  if (input.is_trial) {
    const trialError = validateTrialPackageInput(input.trial);
    if (trialError) return { error: trialError };
    const trial = input.trial;
    if (!trial) return { error: "Choose a trial package." };
    const resolved = await resolveTrialProduct(trial.package_product_id);
    if ("error" in resolved) return { error: resolved.error };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .insert(toStudentRow(input))
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  const studentId = data.id as string;

  if (input.is_trial && input.trial) {
    const assigned = await assignPackage({
      student_id: studentId,
      package_product_id: input.trial.package_product_id,
      is_paid: input.trial.is_paid,
      payment_method: input.trial.is_paid ? input.trial.payment_method : null,
      amount_sgd: input.trial.amount_sgd ?? null,
    });

    if (assigned.error) {
      await supabase.from("students").delete().eq("id", studentId);
      return { error: assigned.error };
    }
  }

  revalidateStudentPaths(studentId);
  return { success: true as const, id: studentId };
}

export async function updateStudent(id: string, input: StudentInput) {
  await requireRole(["admin"]);

  if (!id) return { error: "Student id is required." };

  const validationError = validateStudentInput(input);
  if (validationError) return { error: validationError };

  const needsTrialPackage =
    input.is_trial && !(await studentHasTrialProductPackage(id));

  if (needsTrialPackage) {
    const trialError = validateTrialPackageInput(input.trial);
    if (trialError) return { error: trialError };
    const trial = input.trial;
    if (!trial) return { error: "Choose a trial package." };
    const resolved = await resolveTrialProduct(trial.package_product_id);
    if ("error" in resolved) return { error: resolved.error };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update(toStudentRow(input))
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  if (needsTrialPackage && input.trial) {
    const assigned = await assignPackage({
      student_id: id,
      package_product_id: input.trial.package_product_id,
      is_paid: input.trial.is_paid,
      payment_method: input.trial.is_paid ? input.trial.payment_method : null,
      amount_sgd: input.trial.amount_sgd ?? null,
    });

    if (assigned.error) {
      await supabase.from("students").update({ is_trial: false }).eq("id", id);
      return { error: assigned.error };
    }
  }

  revalidateStudentPaths(id);
  return { success: true as const };
}
