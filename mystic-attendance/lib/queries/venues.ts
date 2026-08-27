import { createClient } from "@/lib/supabase/server";
import type { Venue } from "@/lib/types";

const VENUE_COLUMNS = "id, name, is_active, sort_order";

function mapVenue(row: Venue): Venue {
  return {
    id: row.id,
    name: row.name,
    is_active: row.is_active,
    sort_order: Number(row.sort_order),
  };
}

export async function listVenues(options?: {
  activeOnly?: boolean;
}): Promise<Venue[]> {
  const supabase = await createClient();
  let query = supabase
    .from("venues")
    .select(VENUE_COLUMNS)
    .order("sort_order")
    .order("name");

  if (options?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => mapVenue(row as Venue));
}
