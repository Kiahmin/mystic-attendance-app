"use server";

import { emptyToNull } from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import { PAYER_KINDS } from "@/lib/payer-utils";
import { createClient } from "@/lib/supabase/server";
import type { Payer, PayerKind } from "@/lib/types";
import { revalidatePath } from "next/cache";

export type PayerInput = {
  kind: PayerKind;
  display_name?: string | null;
  phone?: string | null;
  notes?: string | null;
};

function revalidatePayerPaths() {
  revalidatePath("/admin/students");
  revalidatePath("/admin/packages");
}

function validatePayerInput(input: PayerInput): string | null {
  if (!PAYER_KINDS.includes(input.kind)) {
    return "Select person or company.";
  }
  const name = emptyToNull(input.display_name);
  const phone = emptyToNull(input.phone);
  if (!name && !phone) {
    return "Enter a name or a phone number.";
  }
  return null;
}

function toPayerRow(input: PayerInput) {
  return {
    kind: input.kind,
    display_name: emptyToNull(input.display_name),
    phone: emptyToNull(input.phone),
    notes: emptyToNull(input.notes),
  };
}

export async function createPayer(input: PayerInput) {
  await requireRole(["admin"]);

  const validationError = validatePayerInput(input);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payers")
    .insert(toPayerRow(input))
    .select("id, kind, display_name, phone, notes, created_at")
    .single();

  if (error) return { error: error.message };

  revalidatePayerPaths();
  return { success: true as const, payer: data as Payer };
}
