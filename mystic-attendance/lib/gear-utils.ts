import type { GearOrderStatus, Student, StudentGearOrder } from "@/lib/types";

export const GEAR_ORDER_STATUSES: GearOrderStatus[] = [
  "to_order",
  "ordered",
  "ready",
  "given",
];

export const GEAR_ORDER_STATUS_LABELS: Record<GearOrderStatus, string> = {
  to_order: "To order",
  ordered: "Ordered",
  ready: "Ready to bring",
  given: "Given",
};

export const GEAR_ITEM_PRESETS = ["Skates", "Gear", "Helmet"] as const;

export function isGearOrderStatus(value: string): value is GearOrderStatus {
  return (GEAR_ORDER_STATUSES as string[]).includes(value);
}

export function studentNeedsRental(
  student: Pick<Student, "needs_rental_skates" | "needs_rental_gear">
): boolean {
  return Boolean(student.needs_rental_skates || student.needs_rental_gear);
}

/** "Rental skates and gear · EU 36, helmet S" */
export function rentalSummary(
  student: Pick<
    Student,
    "needs_rental_skates" | "needs_rental_gear" | "rental_note"
  >
): string | null {
  const parts: string[] = [];
  if (student.needs_rental_skates) parts.push("skates");
  if (student.needs_rental_gear) parts.push("gear");
  if (parts.length === 0) return null;
  const label = `Rental ${parts.join(" and ")}`;
  const note = student.rental_note?.trim();
  return note ? `${label} · ${note}` : label;
}

export function gearOrderItemLabel(
  order: Pick<StudentGearOrder, "item_name" | "size">
): string {
  const size = order.size?.trim();
  return size ? `${order.item_name} ${size}` : order.item_name;
}

export function gearOrderCheckInLine(order: StudentGearOrder): string {
  return `${gearOrderItemLabel(order)} — ${GEAR_ORDER_STATUS_LABELS[order.status]}`;
}
