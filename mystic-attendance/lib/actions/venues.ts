"use server";

import { emptyToNull } from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import { createClient } from "@/lib/supabase/server";
import type { Venue } from "@/lib/types";
import { revalidatePath } from "next/cache";

function revalidateVenuePaths() {
  revalidatePath("/admin/classes");
  revalidatePath("/admin/schedule");
  revalidatePath("/admin/students");
  revalidatePath("/admin");
}

export async function createVenue(name: string) {
  await requireRole(["admin"]);

  const trimmed = emptyToNull(name);
  if (!trimmed) return { error: "Venue name is required." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("venues")
    .select("id, name, is_active, sort_order")
    .ilike("name", trimmed)
    .maybeSingle();

  if (existing) {
    return { success: true as const, venue: existing as Venue, existing: true };
  }

  const { data: last } = await supabase
    .from("venues")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from("venues")
    .insert({
      name: trimmed,
      sort_order: Number(last?.sort_order ?? 0) + 1,
    })
    .select("id, name, is_active, sort_order")
    .single();

  if (error) return { error: error.message };

  revalidateVenuePaths();
  return { success: true as const, venue: data as Venue, existing: false };
}
