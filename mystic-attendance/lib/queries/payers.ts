import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Payer } from "@/lib/types";

const PAYER_COLUMNS = "id, kind, display_name, phone, notes, created_at";

type PayerStudentRow = {
  id: string;
  full_name: string;
  archived_at: string | null;
};

export function mapPayer(
  row: Payer & { students?: PayerStudentRow[] | PayerStudentRow | null }
): Payer {
  const students = row.students
    ? Array.isArray(row.students)
      ? row.students
      : [row.students]
    : [];
  return {
    id: row.id,
    kind: row.kind,
    display_name: row.display_name?.trim() || null,
    phone: row.phone?.trim() || null,
    notes: row.notes?.trim() || null,
    created_at: row.created_at,
    used_by: students
      .filter((student) => student.id && !student.archived_at)
      .map((student) => ({
        id: student.id,
        full_name: student.full_name,
      }))
      .sort((a, b) => a.full_name.localeCompare(b.full_name)),
  };
}

export const listPayers = cache(async function listPayers(): Promise<Payer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payers")
    .select(`${PAYER_COLUMNS}, students ( id, full_name, archived_at )`)
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
