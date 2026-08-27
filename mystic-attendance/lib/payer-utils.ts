import type { PayerKind, PayerRef } from "@/lib/types";

export const PAYER_KINDS: PayerKind[] = ["person", "company"];

export const PAYER_KIND_LABELS: Record<PayerKind, string> = {
  person: "Person",
  company: "Company",
};

export function payerLabel(
  payer: Pick<PayerRef, "display_name" | "phone"> | null | undefined
): string {
  const name = payer?.display_name?.trim() || null;
  const phone = payer?.phone?.trim() || null;
  if (name && phone) return `${name} · ${phone}`;
  return name ?? phone ?? "No payer";
}

export function payerShortLabel(
  payer: Pick<PayerRef, "display_name" | "phone"> | null | undefined
): string | null {
  const name = payer?.display_name?.trim() || null;
  const phone = payer?.phone?.trim() || null;
  return name ?? phone;
}
