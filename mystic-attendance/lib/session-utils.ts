import {
  addCalendarDays,
  APP_TIMEZONE,
  isValidCalendarDate,
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
  Monday: "monday",
  Tuesday: "tuesday",
  Wednesday: "wednesday",
  Thursday: "thursday",
  Friday: "friday",
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

/** Map a YYYY-MM-DD calendar date to class `day_of_week`. */
export function dayOfWeekForDate(date: string): DayOfWeek | null {
  return WEEKDAY_TO_DAY_OF_WEEK[weekdayNameInSingapore(date)] ?? null;
}

export type WeekDates = {
  monday: string;
  sunday: string;
  dates: string[];
};

/**
 * Monday–Sunday of the Singapore week containing `date`.
 */
export function weekDatesContaining(date = todayInSingapore()): WeekDates {
  const weekday = weekdayNameInSingapore(date);
  const index = WEEKDAY_INDEX[weekday] ?? 1;
  const daysToMonday = index === 0 ? -6 : 1 - index;
  const monday = addCalendarDays(date, daysToMonday);
  const dates = Array.from({ length: 7 }, (_, offset) =>
    addCalendarDays(monday, offset)
  );
  return { monday, sunday: dates[6] ?? monday, dates };
}

/**
 * Resolve a `?week=` (or legacy `?weekend=`) calendar date to that week's
 * Monday–Sunday. Invalid or missing values fall back to the current week.
 */
export function resolveWeekDates(weekParam?: string | null): WeekDates {
  const date =
    weekParam && isValidCalendarDate(weekParam)
      ? weekParam
      : todayInSingapore();
  return weekDatesContaining(date);
}

export function adminWeekHref(monday: string): string {
  const current = weekDatesContaining().monday;
  return monday === current ? "/admin" : `/admin?week=${monday}`;
}

export function sessionDisplayStart(
  session: Pick<SessionWithClass, "start_time" | "classes">
): string {
  return session.start_time ?? session.classes.start_time;
}

export function sessionDisplayEnd(
  session: Pick<SessionWithClass, "end_time" | "classes">
): string {
  return session.end_time ?? session.classes.end_time;
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
  session: Pick<
    SessionWithClass,
    "cancelled" | "session_date" | "start_time" | "end_time" | "classes"
  >,
  today = todayInSingapore(),
  nowTime = nowTimeInSingapore()
): SessionScheduleStatus {
  if (session.cancelled) return "cancelled";

  const { session_date: date } = session;
  if (date < today) return "completed";
  if (date > today) return "upcoming";

  const start = normalizeTime(sessionDisplayStart(session));
  const end = normalizeTime(sessionDisplayEnd(session));
  const now = normalizeTime(nowTime);

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "in_progress";
}
