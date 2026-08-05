import type { AttendanceStatus } from "@/lib/types";
import {
  formatCalendarDate,
  isOnOrBeforeDaysFromToday,
} from "@/lib/datetime";

export function defaultDeductCredit(status: AttendanceStatus): boolean {
  switch (status) {
    case "present":
    case "no_show":
    case "cancelled_late":
      return true;
    default:
      return false;
  }
}

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  absent: "Absent",
  no_show: "No-show",
  cancelled_valid: "Cancelled (in time)",
  cancelled_late: "Cancelled (late)",
  session_cancelled: "Session cancelled",
  complimentary: "Complimentary",
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
} | null): "none" | "low" | "expired" | "unpaid" {
  if (!pkg) return "none";
  if (pkg.status === "unpaid") return "unpaid";
  if (pkg.status === "expired" || pkg.remaining_credits <= 0) return "expired";
  if (pkg.remaining_credits <= 2) return "low";
  if (pkg.expires_at && isOnOrBeforeDaysFromToday(pkg.expires_at, 14)) {
    return "low";
  }
  return "none";
}
