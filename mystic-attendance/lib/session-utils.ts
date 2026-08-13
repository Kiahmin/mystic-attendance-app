import {
  addCalendarDays,
  APP_TIMEZONE,
  todayInSingapore,
} from "@/lib/datetime";
import type { DayOfWeek, SessionWithClass } from "@/lib/types";

export const CANCELLATION_REASONS = [
  "weather",
  "facility",
  "coach_unavailable",
  "public_holiday",
  "other",
] as const;

export type CancellationReason = (typeof CANCELLATION_REASONS)[number];

export type SessionScheduleStatus =
  | "cancelled"
  | "completed"
  | "in_progress"
  | "upcoming";

export const SESSION_SCHEDULE_STATUS_LABELS: Record<
  SessionScheduleStatus,
  string
> = {
  cancelled: "Cancelled",
  completed: "Completed",
  in_progress: "In Progress",
  upcoming: "Upcoming",
};

const WEEKDAY_TO_DAY_OF_WEEK: Record<string, DayOfWeek | undefined> = {
  Saturday: "saturday",
  Sunday: "sunday",
};

const WEEKDAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

function weekdayNameInSingapore(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    weekday: "long",
  }).format(new Date(`${date}T12:00:00+08:00`));
}

/** Map a YYYY-MM-DD calendar date to class `day_of_week` (Sat/Sun only). */
export function dayOfWeekForDate(date: string): DayOfWeek | null {
  return WEEKDAY_TO_DAY_OF_WEEK[weekdayNameInSingapore(date)] ?? null;
}

/**
 * Saturday and Sunday of the Singapore week containing `date`
 * (Mon–Fri → upcoming weekend; Sat/Sun → weekend in progress).
 */
export function weekendDatesInCurrentWeek(date = todayInSingapore()): {
  saturday: string;
  sunday: string;
} {
  const weekday = weekdayNameInSingapore(date);
  const index = WEEKDAY_INDEX[weekday] ?? 0;
  // Days from Sunday=0: Sat is 6, Sun is 0.
  // Offset to this week's Saturday: Mon(1)->5, ..., Fri(5)->1, Sat(6)->0, Sun(0)->-1
  const daysToSaturday = index === 0 ? -1 : 6 - index;
  const saturday = addCalendarDays(date, daysToSaturday);
  const sunday = addCalendarDays(saturday, 1);
  return { saturday, sunday };
}

/** Current HH:MM:SS in Singapore. */
export function nowTimeInSingapore(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function normalizeTime(time: string): string {
  const parts = time.split(":");
  const h = parts[0]?.padStart(2, "0") ?? "00";
  const m = parts[1]?.padStart(2, "0") ?? "00";
  const s = (parts[2] ?? "00").padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function getSessionScheduleStatus(
  session: Pick<SessionWithClass, "cancelled" | "session_date" | "classes">,
  today = todayInSingapore(),
  nowTime = nowTimeInSingapore()
): SessionScheduleStatus {
  if (session.cancelled) return "cancelled";

  const { session_date: date, classes: classGroup } = session;
  if (date < today) return "completed";
  if (date > today) return "upcoming";

  const start = normalizeTime(classGroup.start_time);
  const end = normalizeTime(classGroup.end_time);
  const now = normalizeTime(nowTime);

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "in_progress";
}
