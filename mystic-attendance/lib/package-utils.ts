import {
  formatCalendarDate,
  isOnOrBeforeDaysFromToday,
  todayInSingapore,
} from "@/lib/datetime";
import type {
  Package,
  PackageProduct,
  PackageProductType,
  PackageStatus,
  PaymentMethod,
} from "@/lib/types";

export const PACKAGE_SIZES = [1, 4, 8, 12] as const;
export type PackageSize = (typeof PACKAGE_SIZES)[number];

export const PACKAGE_PRODUCT_TYPES: PackageProductType[] = [
  "group",
  "freestyle",
  "private",
  "trial_group",
  "trial_private",
];

export const PACKAGE_PRODUCT_TYPE_LABELS: Record<PackageProductType, string> = {
  group: "Group",
  freestyle: "Freestyle",
  private: "Private",
  trial_group: "Trial (Group)",
  trial_private: "Trial (Private)",
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  "paynow",
  "bank_transfer",
  "cash",
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  paynow: "PayNow",
  bank_transfer: "Bank Transfer",
  cash: "Cash",
};

export const PACKAGE_STATUS_LABELS: Record<PackageStatus, string> = {
  unpaid: "Unpaid",
  active: "Active",
  paused: "Paused",
  expired: "Expired",
  exhausted: "Finished",
};

export const PAUSE_REASONS = [
  { value: "injury", label: "Injury / Medical" },
  { value: "travel", label: "Travel / Relocation" },
  { value: "school", label: "Academic Conflict" },
  { value: "other", label: "Other" },
] as const;

export type PauseReasonValue = (typeof PAUSE_REASONS)[number]["value"];

export const LOW_CREDIT_THRESHOLD = 2;
export const EXPIRING_WITHIN_DAYS = 14;

export function isTrialProductType(productType: PackageProductType): boolean {
  return productType === "trial_group" || productType === "trial_private";
}

export function defaultAmountForProduct(product: PackageProduct): number {
  return Number(product.amount_sgd);
}

export type PackageLabelSource = {
  total_credits: number;
  bonus_credits?: number | null;
};

export type PackageCustomisationSource = PackageLabelSource & {
  customisation_notes?: string | null;
};

export function packageBaseCredits(pkg: PackageLabelSource): number {
  return pkg.total_credits - (pkg.bonus_credits ?? 0);
}

export function isCustomPackageCount(
  pkg: PackageLabelSource,
  product?: Pick<PackageProduct, "total_credits"> | null
): boolean {
  if (!product) return false;
  return packageBaseCredits(pkg) !== product.total_credits;
}

export function isCustomisedPackage(
  pkg: PackageCustomisationSource,
  product?: Pick<PackageProduct, "total_credits"> | null
): boolean {
  return (
    (pkg.bonus_credits ?? 0) > 0 ||
    Boolean(pkg.customisation_notes?.trim()) ||
    isCustomPackageCount(pkg, product)
  );
}

export function packageCreditBreakdown(
  pkg: PackageLabelSource,
  product?: Pick<PackageProduct, "total_credits"> | null
): string | null {
  const bonus = pkg.bonus_credits ?? 0;
  const base = packageBaseCredits(pkg);
  const custom = isCustomPackageCount(pkg, product);
  if (!custom && bonus === 0) return null;

  const lessonWord = base === 1 ? "lesson" : "lessons";
  const basePart = custom
    ? `${base} ${lessonWord} (custom)`
    : `${base} ${lessonWord}`;
  if (bonus > 0) {
    return `${basePart} + ${bonus} complimentary`;
  }
  return basePart;
}

export function packageLabel(
  pkg: PackageLabelSource,
  product?: Pick<PackageProduct, "product_type" | "label" | "total_credits"> | null
): string {
  const bonus = pkg.bonus_credits ?? 0;
  const base = packageBaseCredits(pkg);
  const bonusSuffix = bonus > 0 ? ` + ${bonus} complimentary` : "";

  if (product) {
    if (
      isTrialProductType(product.product_type) &&
      base === product.total_credits
    ) {
      return `${product.label}${bonusSuffix}`;
    }
    return `${product.label} · ${base}-Lesson Pack${bonusSuffix}`;
  }
  return `${base}-Lesson Pack${bonusSuffix}`;
}

export function formatAmountSgd(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return `$${Number(amount).toFixed(amount % 1 === 0 ? 0 : 2)}`;
}

export function formatPackageExpiry(expiresAt: string | null): string {
  if (!expiresAt) return "Starts on first lesson";
  return formatCalendarDate(expiresAt);
}

export function isFinishingPackage(pkg: Package): boolean {
  if (pkg.status !== "active") return false;
  if (pkg.remaining_credits <= LOW_CREDIT_THRESHOLD) return true;
  return (
    pkg.expires_at != null &&
    isOnOrBeforeDaysFromToday(pkg.expires_at, EXPIRING_WITHIN_DAYS)
  );
}

export function atRiskReason(pkg: Package): string | null {
  if (pkg.status === "unpaid") return "Unpaid — blocked at check-in";
  if (pkg.status === "expired") {
    if (pkg.forfeited_credits != null) {
      return `${pkg.forfeited_credits} credit${pkg.forfeited_credits === 1 ? "" : "s"} forfeited`;
    }
    return "Expired";
  }
  if (pkg.status === "exhausted") return "No credits remaining";
  if (pkg.remaining_credits <= LOW_CREDIT_THRESHOLD) {
    return `${pkg.remaining_credits} credit${pkg.remaining_credits === 1 ? "" : "s"} left`;
  }
  if (
    pkg.expires_at &&
    isOnOrBeforeDaysFromToday(pkg.expires_at, EXPIRING_WITHIN_DAYS)
  ) {
    return `Expires ${formatCalendarDate(pkg.expires_at)}`;
  }
  return null;
}

export function canPausePackage(pkg: Package): boolean {
  return !pkg.pause_used && pkg.is_paid && pkg.status === "active";
}

/** Fields needed to match `resolve_chargeable_package` in SQL. */
export type ChargeablePackageFields = {
  id: string;
  student_id: string;
  is_paid: boolean;
  paused_at: string | null;
  resumed_at: string | null;
  expires_at: string | null;
  used_credits: number;
  total_credits: number;
  remaining_credits: number;
  first_lesson_date: string | null;
  created_at: string;
};

/**
 * Live status used by `resolve_chargeable_package` (recomputed from today,
 * not the stored `packages.status` column).
 */
function livePackageStatus(
  pkg: ChargeablePackageFields,
  today: string
): PackageStatus {
  if (!pkg.is_paid) return "unpaid";
  if (pkg.paused_at != null && pkg.resumed_at == null && today >= pkg.paused_at) {
    return "paused";
  }
  if (pkg.expires_at != null && pkg.expires_at < today) return "expired";
  if (pkg.used_credits >= pkg.total_credits) return "exhausted";
  return "active";
}

function chargeableSortKey(pkg: ChargeablePackageFields): string {
  const firstLesson = pkg.first_lesson_date ?? pkg.created_at.slice(0, 10);
  return `${firstLesson}\t${pkg.created_at}`;
}

/** Same selection as `resolve_chargeable_package(student, session_date)`. */
export function pickChargeablePackage<T extends ChargeablePackageFields>(
  packages: T[],
  sessionDate: string,
  today: string = todayInSingapore()
): T | null {
  const eligible = packages.filter(
    (pkg) =>
      pkg.is_paid &&
      livePackageStatus(pkg, today) === "active" &&
      pkg.remaining_credits > 0 &&
      (pkg.expires_at == null || pkg.expires_at >= sessionDate)
  );
  if (eligible.length === 0) return null;
  eligible.sort((a, b) =>
    chargeableSortKey(a).localeCompare(chargeableSortKey(b))
  );
  return eligible[0];
}

/** True when a pause is recorded and not yet resumed (scheduled or in progress). */
export function hasOpenPause(pkg: Package): boolean {
  return pkg.paused_at != null && pkg.resumed_at == null;
}

export function canResumePackage(pkg: Package): boolean {
  return hasOpenPause(pkg);
}

export function buildPauseReason(
  reason: PauseReasonValue,
  note?: string | null
): string {
  const label =
    PAUSE_REASONS.find((item) => item.value === reason)?.label ?? reason;
  const trimmed = note?.trim();
  return trimmed ? `${label}: ${trimmed}` : label;
}

export function unchargedClassesNote(
  uncharged: number,
  remainingCredits: number
): string | null {
  if (uncharged <= 0) return null;
  const classWord = uncharged === 1 ? "class" : "classes";
  const applied = Math.min(uncharged, Math.max(remainingCredits, 0));
  const leftover = uncharged - applied;
  if (applied <= 0) {
    return `${uncharged} uncharged ${classWord} found; none can be applied (no credits remaining).`;
  }
  if (leftover <= 0) {
    return `${uncharged} uncharged ${classWord} will be applied (oldest first).`;
  }
  return `${uncharged} uncharged ${classWord} found; the oldest ${applied} will be applied (${leftover} left uncharged).`;
}
