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
  isTrialProductType,
  LOW_CREDIT_THRESHOLD,
  type PauseReasonValue,
} from "@/lib/package-utils";
import { listAttendanceChargedToPackage } from "@/lib/queries/attendance";
import { getPackageProductById } from "@/lib/queries/packages";
import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

async function backfillUnchargedAttendance(
  supabase: SupabaseClient,
  packageId: string
): Promise<{ backfillError?: string }> {
  const { error } = await supabase.rpc("backfill_uncharged_attendance", {
    p_package_id: packageId,
  });

  if (error) {
    return {
      backfillError: `The package was saved, but uncharged classes could not be applied: ${error.message}`,
    };
  }

  return {};
}

export type AssignPackageInput = {
  student_id: string;
  shared_student_ids?: string[];
  payer_id?: string | null;
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

function revalidatePackagePaths(studentIds: string[], packageId?: string) {
  const unique = [...new Set(studentIds.filter(Boolean))];
  revalidatePath("/admin/packages");
  revalidatePath("/admin/students");
  for (const studentId of unique) {
    revalidatePath(`/admin/students/${studentId}`);
  }
  revalidatePath("/admin");
  revalidatePath("/coach");
  if (packageId) {
    revalidatePath(`/admin/packages/${packageId}/pause`);
    revalidatePath(`/admin/packages/${packageId}/pay`);
    revalidatePath(`/admin/packages/${packageId}/transfer`);
  }
}

async function loadPackageMemberIds(
  supabase: SupabaseClient,
  packageId: string,
  fallbackStudentId?: string | null
): Promise<string[]> {
  const { data } = await supabase
    .from("package_students")
    .select("student_id")
    .eq("package_id", packageId);
  const ids = (data ?? []).map((row) => row.student_id as string);
  if (fallbackStudentId && !ids.includes(fallbackStudentId)) {
    ids.push(fallbackStudentId);
  }
  return ids;
}

function uniqueStudentIds(ids: Array<string | null | undefined>): string[] {
  return [...new Set(ids.filter((id): id is string => Boolean(id)))];
}

async function resolvePackagePayerId(
  supabase: SupabaseClient,
  studentId: string,
  payerId?: string | null
): Promise<{ payerId: string | null; error?: string }> {
  const explicit = emptyToNull(payerId);
  if (explicit) {
    const { data, error } = await supabase
      .from("payers")
      .select("id")
      .eq("id", explicit)
      .maybeSingle();
    if (error) return { payerId: null, error: error.message };
    if (!data) return { payerId: null, error: "Select a valid payer." };
    return { payerId: explicit };
  }

  const { data: student, error } = await supabase
    .from("students")
    .select("payer_id")
    .eq("id", studentId)
    .maybeSingle();

  if (error) return { payerId: null, error: error.message };
  return { payerId: (student?.payer_id as string | null) ?? null };
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
  const payer = await resolvePackagePayerId(
    supabase,
    input.student_id,
    input.payer_id
  );
  if (payer.error) return { error: payer.error };
  if (input.is_paid && !payer.payerId) {
    return { error: "Select a payer before recording payment." };
  }

  const sharedStudentIds = uniqueStudentIds(
    (input.shared_student_ids ?? []).filter((id) => id !== input.student_id)
  );

  const { data, error } = await supabase
    .from("packages")
    .insert({
      student_id: input.student_id,
      payer_id: payer.payerId,
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

  const packageId = data.id as string;

  if (sharedStudentIds.length > 0) {
    if (product.product_type === "event") {
      return { error: "Event packages cannot be shared.", id: packageId };
    }
    const { error: shareError } = await supabase.from("package_students").insert(
      sharedStudentIds.map((studentId) => ({
        package_id: packageId,
        student_id: studentId,
      }))
    );
    if (shareError) {
      revalidatePackagePaths(
        [input.student_id, ...sharedStudentIds],
        packageId
      );
      return { error: shareError.message, id: packageId };
    }
  }

  const memberIds = [input.student_id, ...sharedStudentIds];

  if (input.is_paid) {
    const backfill = await backfillUnchargedAttendance(supabase, packageId);
    if (backfill.backfillError) {
      revalidatePackagePaths(memberIds, packageId);
      return { error: backfill.backfillError, id: packageId };
    }
  }

  if (isTrialProductType(product.product_type)) {
    const { error: trialError } = await supabase
      .from("students")
      .update({ is_trial: true })
      .in("id", memberIds);
    if (trialError) {
      revalidatePackagePaths(memberIds, packageId);
      return {
        error: `The package was saved, but the student could not be marked as trial: ${trialError.message}`,
        id: packageId,
      };
    }
  }

  revalidatePackagePaths(memberIds, packageId);
  return { success: true as const, id: packageId };
}

export async function markPackagePaidFormAction(formData: FormData) {
  const packageId = String(formData.get("package_id") ?? "");
  const paymentMethod = String(
    formData.get("payment_method") ?? ""
  ) as PaymentMethod;
  const amountRaw = String(formData.get("amount_sgd") ?? "");
  const amountSgd = Number(amountRaw);
  const payerId = String(formData.get("payer_id") ?? "") || null;

  const result = await markPackagePaid(packageId, {
    payment_method: paymentMethod,
    amount_sgd: amountSgd,
    payer_id: payerId,
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
    payer_id?: string | null;
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
    .select("id, student_id, payer_id, is_paid")
    .eq("id", packageId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!existing) return { error: "Package not found." };
  if (existing.is_paid) {
    return { error: "This package is already marked as paid." };
  }

  const payer = await resolvePackagePayerId(
    supabase,
    existing.student_id as string,
    input.payer_id ?? (existing.payer_id as string | null)
  );
  if (payer.error) return { error: payer.error };
  if (!payer.payerId) {
    return { error: "Select a payer before recording payment." };
  }

  const { error } = await supabase
    .from("packages")
    .update({
      is_paid: true,
      payer_id: payer.payerId,
      payment_method: input.payment_method,
      amount_sgd: input.amount_sgd,
    })
    .eq("id", packageId);

  if (error) return { error: error.message };

  const backfill = await backfillUnchargedAttendance(supabase, packageId);
  const memberIds = await loadPackageMemberIds(
    supabase,
    packageId,
    existing.student_id as string
  );
  revalidatePackagePaths(memberIds, packageId);
  if (backfill.backfillError) {
    return { error: backfill.backfillError };
  }
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

  revalidatePackagePaths(
    await loadPackageMemberIds(supabase, packageId, existing.student_id as string),
    packageId
  );
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

  revalidatePackagePaths(
    await loadPackageMemberIds(supabase, packageId, existing.student_id as string),
    packageId
  );
  return { success: true as const };
}

export async function markPackageInformed(packageId: string) {
  await requireRole(["admin"]);

  if (!packageId) return { error: "Package id is required." };

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("packages")
    .select(
      "id, student_id, session_id, status, remaining_credits, informed_at"
    )
    .eq("id", packageId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!existing) return { error: "Package not found." };
  if (existing.session_id) {
    return { error: "Event packages cannot be marked as informed." };
  }
  if (existing.status !== "active") {
    return { error: "Only active packages can be marked as informed." };
  }
  if (Number(existing.remaining_credits) > LOW_CREDIT_THRESHOLD) {
    return { error: "Only packages with two or fewer lessons remaining can be informed." };
  }
  if (existing.informed_at) {
    return { error: "This package is already on the informed list." };
  }

  const { error } = await supabase
    .from("packages")
    .update({ informed_at: new Date().toISOString() })
    .eq("id", packageId);

  if (error) return { error: error.message };

  revalidatePackagePaths(
    await loadPackageMemberIds(supabase, packageId, existing.student_id as string),
    packageId
  );
  return { success: true as const };
}

export async function loadPackageChargedAttendance(packageId: string) {
  await requireRole(["admin"]);

  if (!packageId) return { error: "Package id is required." };

  try {
    const visits = await listAttendanceChargedToPackage(packageId);
    return { visits };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Could not load classes for this package.",
    };
  }
}

export async function addPackageStudent(packageId: string, studentId: string) {
  await requireRole(["admin"]);

  if (!packageId) return { error: "Package id is required." };
  if (!studentId) return { error: "Select a student to share with." };

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("packages")
    .select("id, student_id, session_id")
    .eq("id", packageId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!existing) return { error: "Package not found." };
  if (existing.session_id) {
    return { error: "Event packages cannot be shared." };
  }
  if (studentId === existing.student_id) {
    return { error: "That student already owns this package." };
  }

  const { error } = await supabase.from("package_students").insert({
    package_id: packageId,
    student_id: studentId,
  });
  if (error) {
    if (error.code === "23505") {
      return { error: "That student already shares this package." };
    }
    return { error: error.message };
  }

  const memberIds = await loadPackageMemberIds(
    supabase,
    packageId,
    existing.student_id as string
  );
  revalidatePackagePaths(memberIds, packageId);
  return { success: true as const };
}

export async function removePackageStudent(
  packageId: string,
  studentId: string
) {
  await requireRole(["admin"]);

  if (!packageId) return { error: "Package id is required." };
  if (!studentId) return { error: "Student is required." };

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("packages")
    .select("id, student_id, session_id")
    .eq("id", packageId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!existing) return { error: "Package not found." };
  if (studentId === existing.student_id) {
    return { error: "The primary student cannot be removed." };
  }

  const { error } = await supabase
    .from("package_students")
    .delete()
    .eq("package_id", packageId)
    .eq("student_id", studentId);

  if (error) return { error: error.message };

  revalidatePackagePaths(
    [existing.student_id as string, studentId],
    packageId
  );
  return { success: true as const };
}

export async function transferPackageCredits(input: {
  packageId: string;
  toStudentId: string;
  credits: number;
  note?: string | null;
}) {
  await requireRole(["admin"]);

  if (!input.packageId) return { error: "Package id is required." };
  if (!input.toStudentId) return { error: "Choose a student to receive the credits." };
  if (!Number.isInteger(input.credits) || input.credits < 1) {
    return { error: "Transfer at least 1 credit." };
  }

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("packages")
    .select("id, student_id, session_id, is_paid, remaining_credits")
    .eq("id", input.packageId)
    .maybeSingle();

  if (fetchError) return { error: fetchError.message };
  if (!existing) return { error: "Package not found." };
  if (existing.session_id) {
    return { error: "Event packages cannot transfer credits." };
  }
  if (!existing.is_paid) {
    return { error: "Only paid packages can transfer credits." };
  }
  if (Number(existing.remaining_credits) < input.credits) {
    return { error: "Not enough remaining credits to transfer." };
  }

  const { data: destId, error } = await supabase.rpc("transfer_package_credits", {
    p_from_package_id: input.packageId,
    p_to_student_id: input.toStudentId,
    p_credits: input.credits,
    p_note: emptyToNull(input.note),
  });

  if (error) return { error: error.message };

  revalidatePackagePaths(
    [existing.student_id as string, input.toStudentId],
    input.packageId
  );
  if (typeof destId === "string") {
    revalidatePath(`/admin/packages/${destId}/pay`);
  }
  return { success: true as const, id: destId as string };
}
