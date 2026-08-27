import type { AttendanceStatus, AttendeeSource } from "@/lib/types";
import {
  formatCalendarDate,
  isOnOrBeforeDaysFromToday,
} from "@/lib/datetime";

export function defaultDeductCredit(status: AttendanceStatus): boolean {
  switch (status) {
    case "present":
    case "no_show":
      return true;
    default:
      return false;
  }
}

export type AttendanceCreditState = "charged" | "uncharged" | "free";

/**
 * Mirrors the `attendance_is_charged` SQL predicate: a credit only moves once a
 * package is attached, so rows awaiting payment backfill are "uncharged".
 */
export function attendanceCreditState(row: {
  deduct_credit: boolean;
  package_id: string | null;
}): AttendanceCreditState {
  if (!row.deduct_credit) return "free";
  return row.package_id ? "charged" : "uncharged";
}

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  no_show: "No-show",
};

export const ATTENDEE_SOURCE_LABELS: Record<AttendeeSource, string> = {
  enrolled: "Enrolled",
  one_off: "One-off",
  walk_in: "Walk-in",
};

export const CANCELLATION_REASON_LABELS: Record<string, string> = {
  weather: "Weather",
  facility: "Facility / venue",
  coach_unavailable: "Coach unavailable",
  public_holiday: "Public holiday",
  other: "Other",
};

export function formatSessionTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = Number.parseInt(hours, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
}

export function formatDate(date: string): string {
  return formatCalendarDate(date);
}

export function packageWarning(pkg: {
  status: string;
  remaining_credits: number;
  expires_at: string | null;
  session_id?: string | null;
} | null): "none" | "low" | "expired" | "unpaid" | "overshot" {
  if (!pkg) return "none";
  if (pkg.status === "unpaid") return "unpaid";
  // 1-credit event packs finishing after this session is expected.
  if (pkg.session_id) return "none";
  if (pkg.status === "expired") return "expired";
  if (pkg.status === "overshot" || pkg.remaining_credits <= 0) return "overshot";
  if (pkg.remaining_credits <= 2) return "low";
  if (pkg.expires_at && isOnOrBeforeDaysFromToday(pkg.expires_at, 14)) {
    return "low";
  }
  return "none";
}
