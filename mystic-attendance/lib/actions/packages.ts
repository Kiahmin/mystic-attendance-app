"use server";

import { emptyToNull } from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import {
  addCalendarDays,
  calendarDaysBetween,
  todayInSingapore,
} from "@/lib/datetime";
import {
  PAYMENT_METHODS,
  buildPauseReason,
  type PauseReasonValue,
} from "@/lib/package-utils";
import { getPackageProductById } from "@/lib/queries/packages";
import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type AssignPackageInput = {
  student_id: string;
  package_product_id: string;
  is_paid: boolean;
  payment_method?: PaymentMethod | null;
  amount_sgd?: number | null;
  custom_total_credits?: number | null;
  bonus_credits?: number;
  customisation_notes?: string | null;
};

export type PausePackageInput = {
  paused_at: string;
  pause_ends_at: string;
  reason: PauseReasonValue;
  note?: string | null;
};

export type ResumePackageInput = {
  resumed_at?: string | null;
};

function revalidatePackagePaths(studentId: string, packageId?: string) {
  revalidatePath("/admin/packages");
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/admin");
  revalidatePath("/coach");
  if (packageId) {
    revalidatePath(`/admin/packages/${packageId}/pause`);
  }
}

function isPositiveInt(value: number): boolean {
  return Number.isInteger(value) && value >= 1;
}

function isNonNegativeInt(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

function validateAssignInput(input: AssignPackageInput): string | null {
  if (!input.student_id) return "Student is required.";
  if (!input.package_product_id) return "Choose a package product.";

  if (input.custom_total_credits != null) {
    if (
      Number.isNaN(input.custom_total_credits) ||
      !isPositiveInt(input.custom_total_credits)
    ) {
      return "Custom lesson count must be a whole number of at least 1.";
    }
  }

  if (input.bonus_credits != null) {
    if (Number.isNaN(input.bonus_credits) || !isNonNegativeInt(input.bonus_credits)) {
      return "Complimentary credits must be a whole number of 0 or more.";
    }
  }

  if (input.is_paid) {
    if (!input.payment_method || !PAYMENT_METHODS.includes(input.payment_method)) {
      return "Payment method is required for paid packages.";
    }
    if (input.amount_sgd == null || Number.isNaN(input.amount_sgd)) {
      return "Amount in SGD is required for paid packages.";
    }
    if (input.amount_sgd < 0) {
      return "Amount cannot be negative.";
    }
  }

  return null;
}

export async function assignPackage(input: AssignPackageInput) {
  await requireRole(["admin"]);

  const validationError = validateAssignInput(input);
  if (validationError) return { error: validationError };

  const product = await getPackageProductById(input.package_product_id);
  if (!product || !product.is_active) {
    return { error: "Selected package product is not available." };
  }

  const bonusCredits = input.bonus_credits ?? 0;
  const baseCredits = input.custom_total_credits ?? product.total_credits;
  const totalCredits = baseCredits + bonusCredits;

  if (totalCredits < 1) {
    return { error: "Package must have at least 1 credit." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .insert({
      student_id: input.student_id,
      package_product_id: product.id,
      total_credits: totalCredits,
      bonus_credits: bonusCredits,
      customisation_notes: emptyToNull(input.customisation_notes),
      is_paid: input.is_paid,
      payment_method: input.is_paid ? input.payment_method : null,
      amount_sgd: input.is_paid ? input.amount_sgd : input.amount_sgd ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePackagePaths(input.student_id, data.id as string);
  return { success: true as const, id: data.id as string };
}

export async function markPackagePaidFormAction(formData: FormData) {
  const packageId = String(formData.get("package_id") ?? "");
  const paymentMethod = String(
    formData.get("payment_method") ?? ""
  ) as PaymentMethod;
  const amountRaw = String(formData.get("amount_sgd") ?? "");
  const amountSgd = Number(amountRaw);

  const result = await markPackagePaid(packageId, {
    payment_method: paymentMethod,
    amount_sgd: amountSgd,
  });

  if (result.error) {
    throw new Error(result.error);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("packages")
    .select("student_id")
    .eq("id", packageId)
    .maybeSingle();

  if (data?.student_id) {
    redirect(`/admin/students/${data.student_id}`);
  }
  redirect("/admin/packages");
}

export async function markPackagePaid(
  packageId: string,
  input: {
    payment_method: PaymentMethod;
    amount_sgd: number;
  }
) {
  await requireRole(["admin"]);

  if (!packageId) return { error: "Package id is required." };
  if (!PAYMENT_METHODS.includes(input.payment_method)) {
    return { error: "Invalid payment method." };
  }
  if (input.amount_sgd == null || Number.isNaN(input.amount_sgd) || input.amount_sgd < 0) {
    return { error: "Amount in SGD is required." };
  }

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("packages")
    .select("id, student_id, is_paid")
    .eq("id", packageId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!existing) return { error: "Package not found." };
  if (existing.is_paid) {
    return { error: "This package is already marked as paid." };
  }

  const { error } = await supabase
    .from("packages")
    .update({
      is_paid: true,
      payment_method: input.payment_method,
      amount_sgd: input.amount_sgd,
    })
    .eq("id", packageId);

  if (error) return { error: error.message };

  revalidatePackagePaths(existing.student_id as string, packageId);
  return { success: true as const };
}

export async function pausePackage(
  packageId: string,
  input: PausePackageInput
) {
  await requireRole(["admin"]);

  if (!packageId) return { error: "Package id is required." };

  const pausedAt = emptyToNull(input.paused_at);
  const pauseEndsAt = emptyToNull(input.pause_ends_at);

  if (!pausedAt || !/^\d{4}-\d{2}-\d{2}$/.test(pausedAt)) {
    return { error: "Start date is required (YYYY-MM-DD)." };
  }
  if (!pauseEndsAt || !/^\d{4}-\d{2}-\d{2}$/.test(pauseEndsAt)) {
    return { error: "End date is required (YYYY-MM-DD)." };
  }
  if (pauseEndsAt < pausedAt) {
    return { error: "End date must be on or after the start date." };
  }
  if (!input.reason) {
    return { error: "Reason for pause is required." };
  }

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("packages")
    .select(
      "id, student_id, is_paid, pause_used, status, paused_at, resumed_at"
    )
    .eq("id", packageId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!existing) return { error: "Package not found." };
  if (!existing.is_paid) {
    return { error: "Only paid packages can be paused." };
  }
  if (existing.pause_used) {
    return { error: "Only one pause is allowed per package." };
  }

  const { error } = await supabase
    .from("packages")
    .update({
      paused_at: pausedAt,
      pause_ends_at: pauseEndsAt,
      paused_reason: buildPauseReason(input.reason, input.note),
      pause_used: true,
      resumed_at: null,
    })
    .eq("id", packageId);

  if (error) return { error: error.message };

  revalidatePackagePaths(existing.student_id as string, packageId);
  return { success: true as const };
}

export async function resumePackageFormAction(formData: FormData) {
  const packageId = String(formData.get("package_id") ?? "");
  const resumedAt = String(formData.get("resumed_at") ?? "") || null;
  const result = await resumePackage(packageId, { resumed_at: resumedAt });
  if (result.error) {
    throw new Error(result.error);
  }
}

export async function resumePackage(
  packageId: string,
  input: ResumePackageInput = {}
) {
  await requireRole(["admin"]);

  if (!packageId) return { error: "Package id is required." };

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("packages")
    .select(
      `
      id,
      student_id,
      paused_at,
      pause_ends_at,
      resumed_at,
      expires_at,
      pause_used
    `
    )
    .eq("id", packageId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!existing) return { error: "Package not found." };
  if (!existing.pause_used || !existing.paused_at) {
    return { error: "This package has no pause to resume." };
  }
  if (existing.resumed_at) {
    return { error: "This package pause has already ended." };
  }

  const resumedAt =
    emptyToNull(input.resumed_at) ??
    (existing.pause_ends_at as string) ??
    todayInSingapore();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(resumedAt)) {
    return { error: "Resume date must be YYYY-MM-DD." };
  }
  if (resumedAt < (existing.paused_at as string)) {
    return { error: "Resume date must be on or after the pause start." };
  }

  const pauseDays = calendarDaysBetween(
    existing.paused_at as string,
    resumedAt
  );

  const updates: {
    resumed_at: string;
    expires_at?: string;
  } = { resumed_at: resumedAt };

  if (existing.expires_at && pauseDays > 0) {
    updates.expires_at = addCalendarDays(
      existing.expires_at as string,
      pauseDays
    );
  }

  const { error } = await supabase
    .from("packages")
    .update(updates)
    .eq("id", packageId);

  if (error) return { error: error.message };

  revalidatePackagePaths(existing.student_id as string, packageId);
  return { success: true as const };
}
