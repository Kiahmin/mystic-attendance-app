"use server";

import { emptyToNull } from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import { isGearOrderStatus } from "@/lib/gear-utils";
import { createClient } from "@/lib/supabase/server";
import type { GearOrderStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

function revalidateGear(studentId: string, sessionId?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/coach");
  revalidatePath("/coach/sessions/[sessionId]", "page");
  revalidatePath("/admin/sessions/[id]", "page");
  if (sessionId) {
    revalidatePath(`/coach/sessions/${sessionId}`);
    revalidatePath(`/admin/sessions/${sessionId}`);
  }
}

export async function updateStudentRentals(
  studentId: string,
  input: {
    needs_rental_skates: boolean;
    needs_rental_gear: boolean;
    rental_note?: string | null;
  }
) {
  await requireRole(["admin"]);
  if (!studentId) return { error: "Student id is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("students")
    .update({
      needs_rental_skates: input.needs_rental_skates,
      needs_rental_gear: input.needs_rental_gear,
      rental_note: emptyToNull(input.rental_note),
    })
    .eq("id", studentId);

  if (error) return { error: error.message };

  revalidateGear(studentId);
  return { success: true as const };
}

export async function createStudentGearOrder(
  studentId: string,
  input: {
    item_name: string;
    size?: string | null;
    notes?: string | null;
  }
) {
  await requireRole(["admin"]);
  if (!studentId) return { error: "Student id is required." };

  const itemName = input.item_name?.trim() ?? "";
  if (!itemName) return { error: "Item name is required." };
  if (itemName.length > 80) return { error: "Item name is too long." };

  const supabase = await createClient();
  const { error } = await supabase.from("student_gear_orders").insert({
    student_id: studentId,
    item_name: itemName,
    size: emptyToNull(input.size),
    notes: emptyToNull(input.notes),
    status: "to_order",
  });

  if (error) return { error: error.message };

  revalidateGear(studentId);
  return { success: true as const };
}

export async function setStudentGearOrderStatus(
  orderId: string,
  status: GearOrderStatus
) {
  await requireRole(["admin"]);
  if (!orderId) return { error: "Order id is required." };
  if (!isGearOrderStatus(status)) return { error: "Invalid status." };

  const supabase = await createClient();
  const { data, error: lookupError } = await supabase
    .from("student_gear_orders")
    .select("id, student_id")
    .eq("id", orderId)
    .maybeSingle();

  if (lookupError) return { error: lookupError.message };
  if (!data) return { error: "Order not found." };

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("student_gear_orders")
    .update({
      status,
      given_at: status === "given" ? now : null,
      updated_at: now,
    })
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidateGear(data.student_id as string);
  return { success: true as const };
}

/** Coaches and admins can hand over an item that is already ready to bring. */
export async function markStudentGearOrderGiven(
  orderId: string,
  sessionId?: string
) {
  await requireRole(["admin", "coach"]);
  if (!orderId) return { error: "Order id is required." };

  const supabase = await createClient();
  const { data, error: lookupError } = await supabase
    .from("student_gear_orders")
    .select("id, student_id, status")
    .eq("id", orderId)
    .maybeSingle();

  if (lookupError) return { error: lookupError.message };
  if (!data) return { error: "Order not found." };
  if (data.status !== "ready") {
    return { error: "Only items ready to bring can be marked given." };
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("student_gear_orders")
    .update({
      status: "given",
      given_at: now,
      updated_at: now,
    })
    .eq("id", orderId)
    .eq("status", "ready");

  if (error) return { error: error.message };

  revalidateGear(data.student_id as string, sessionId);
  return { success: true as const };
}

export async function deleteStudentGearOrder(orderId: string) {
  await requireRole(["admin"]);
  if (!orderId) return { error: "Order id is required." };

  const supabase = await createClient();
  const { data, error: lookupError } = await supabase
    .from("student_gear_orders")
    .select("id, student_id, status")
    .eq("id", orderId)
    .maybeSingle();

  if (lookupError) return { error: lookupError.message };
  if (!data) return { error: "Order not found." };
  if (data.status === "given") {
    return { error: "Given items stay on the student record." };
  }

  const { error } = await supabase
    .from("student_gear_orders")
    .delete()
    .eq("id", orderId);

  if (error) return { error: error.message };

  revalidateGear(data.student_id as string);
  return { success: true as const };
}
