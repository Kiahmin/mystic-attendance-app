import type { VenueRef } from "@/lib/types";

export function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export function mapVenueRef(
  value:
    | Pick<VenueRef, "id" | "name">
    | Pick<VenueRef, "id" | "name">[]
    | null
    | undefined
): VenueRef | null {
  const row = asSingle(value);
  if (!row?.id) return null;
  const name = row.name?.trim() || "";
  return { id: row.id, name };
}

export function venueName(venue: VenueRef | null | undefined): string | null {
  const name = venue?.name?.trim();
  return name ? name : null;
}
