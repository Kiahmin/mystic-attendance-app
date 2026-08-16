import { packageWarning } from "@/lib/attendance-utils";
import { formatCalendarDate, isOnOrBeforeDaysFromToday } from "@/lib/datetime";
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

export function packageLabel(
  totalCredits: number,
  product?: Pick<PackageProduct, "product_type" | "label" | "total_credits"> | null
): string {
  if (product) {
    if (isTrialProductType(product.product_type)) {
      return product.label;
    }
    return `${product.label} · ${product.total_credits}-Lesson Pack`;
  }
  return `${totalCredits}-Lesson Pack`;
}

export function formatAmountSgd(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return `$${Number(amount).toFixed(amount % 1 === 0 ? 0 : 2)}`;
}

export function formatPackageExpiry(expiresAt: string | null): string {
  if (!expiresAt) return "Starts on first lesson";
  return formatCalendarDate(expiresAt);
}

export function isAtRiskPackage(pkg: Package): boolean {
  const warning = packageWarning(pkg);
  if (warning !== "none") return true;
  return (
    pkg.status === "expired" ||
    pkg.status === "unpaid" ||
    (pkg.status === "active" &&
      pkg.remaining_credits <= LOW_CREDIT_THRESHOLD) ||
    (pkg.expires_at != null &&
      isOnOrBeforeDaysFromToday(pkg.expires_at, EXPIRING_WITHIN_DAYS) &&
      pkg.status === "active")
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
