import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Payer } from "@/lib/types";

const PAYER_COLUMNS = "id, kind, display_name, phone, notes, created_at";

export function mapPayer(row: Payer): Payer {
  return {
    id: row.id,
    kind: row.kind,
    display_name: row.display_name?.trim() || null,
    phone: row.phone?.trim() || null,
    notes: row.notes?.trim() || null,
    created_at: row.created_at,
  };
}

export const listPayers = cache(async function listPayers(): Promise<Payer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payers")
    .select(PAYER_COLUMNS)
    .order("display_name", { ascending: true, nullsFirst: false })
    .order("phone");

  if (error) throw error;
  return (data ?? []).map((row) => mapPayer(row as Payer));
});

export async function getPayerById(id: string): Promise<Payer | null> {
  if (!id) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payers")
    .select(PAYER_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? mapPayer(data as Payer) : null;
}
