import {
  addCalendarDays,
  addCalendarMonths,
  APP_TIMEZONE,
  datesInclusive,
  endOfMonth,
  formatCalendarDateLong,
  formatMonthYear,
  isValidCalendarDate,
  startOfMonth,
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

export const CALENDAR_VIEWS = ["day", "week", "month"] as const;

export type CalendarView = (typeof CALENDAR_VIEWS)[number];

export type CalendarRange = {
  view: CalendarView;
  date: string;
  start: string;
  end: string;
  dates: string[];
  monthStart: string;
  monday: string;
  label: string;
};

export function parseCalendarView(value?: string | null): CalendarView {
  if (value === "day" || value === "week" || value === "month") return value;
  return "week";
}

export function resolveCalendarDate(
  dateParam?: string | null,
  weekParam?: string | null
): string {
  if (dateParam && isValidCalendarDate(dateParam)) return dateParam;
  if (weekParam && isValidCalendarDate(weekParam)) return weekParam;
  return todayInSingapore();
}

/** Monday–Sunday grid covering the month that contains `date`. */
export function monthGridDates(date: string): {
  monthStart: string;
  start: string;
  end: string;
  dates: string[];
} {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const start = weekDatesContaining(monthStart).monday;
  const end = weekDatesContaining(monthEnd).sunday;
  return { monthStart, start, end, dates: datesInclusive(start, end) };
}

export function calendarRangeLabel(
  view: CalendarView,
  date: string,
  start: string,
  end: string
): string {
  if (view === "day") return formatCalendarDateLong(date);
  if (view === "month") return formatMonthYear(date);
  if (start.slice(0, 7) === end.slice(0, 7)) {
    const startDay = formatCalendarDateLong(start).replace(/\s\d{4}$/, "");
    return `${startDay} – ${formatCalendarDateLong(end)}`;
  }
  return `${formatCalendarDateLong(start)} – ${formatCalendarDateLong(end)}`;
}

export function resolveCalendarRange(params: {
  view?: string | null;
  date?: string | null;
  week?: string | null;
  weekend?: string | null;
}): CalendarRange {
  const view = parseCalendarView(params.view);
  const date = resolveCalendarDate(params.date, params.week ?? params.weekend);
  const week = weekDatesContaining(date);
  const month = monthGridDates(date);

  if (view === "day") {
    return {
      view,
      date,
      start: date,
      end: date,
      dates: [date],
      monthStart: startOfMonth(date),
      monday: week.monday,
      label: calendarRangeLabel(view, date, date, date),
    };
  }

  if (view === "month") {
    return {
      view,
      date,
      start: month.start,
      end: month.end,
      dates: month.dates,
      monthStart: month.monthStart,
      monday: week.monday,
      label: calendarRangeLabel(view, date, month.start, month.end),
    };
  }

  return {
    view,
    date,
    start: week.monday,
    end: week.sunday,
    dates: week.dates,
    monthStart: startOfMonth(date),
    monday: week.monday,
    label: calendarRangeLabel(view, date, week.monday, week.sunday),
  };
}

export function shiftCalendarDate(
  date: string,
  view: CalendarView,
  direction: -1 | 1
): string {
  if (view === "day") return addCalendarDays(date, direction);
  if (view === "week") return addCalendarDays(date, direction * 7);
  return addCalendarMonths(date, direction);
}

export function adminCalendarHref(options?: {
  view?: CalendarView;
  date?: string | null;
}): string {
  const view = options?.view ?? "week";
  const today = todayInSingapore();
  const resolvedDate =
    options?.date && isValidCalendarDate(options.date) ? options.date : today;
  const params = new URLSearchParams();

  if (view !== "week") params.set("view", view);

  if (view === "week") {
    const currentMonday = weekDatesContaining(today).monday;
    const monday = weekDatesContaining(resolvedDate).monday;
    if (monday !== currentMonday) params.set("date", monday);
  } else if (view === "month") {
    if (startOfMonth(resolvedDate) !== startOfMonth(today)) {
      params.set("date", startOfMonth(resolvedDate));
    }
  } else if (resolvedDate !== today) {
    params.set("date", resolvedDate);
  }

  const query = params.toString();
  return query ? `/admin?${query}` : "/admin";
}

export function adminWeekHref(monday: string): string {
  return adminCalendarHref({ view: "week", date: monday });
}

export function adminSessionHref(
  sessionId: string,
  options?: { view?: CalendarView; date?: string | null }
): string {
  const params = new URLSearchParams();
  const view = options?.view ?? "week";
  const date = options?.date;
  if (view !== "week") params.set("view", view);
  if (date && isValidCalendarDate(date)) params.set("date", date);
  const query = params.toString();
  return query
    ? `/admin/sessions/${sessionId}?${query}`
    : `/admin/sessions/${sessionId}`;
}

export function sessionDisplayName(
  session: Pick<SessionWithClass, "name" | "classes">
): string {
  return session.name ?? session.classes?.name ?? "Untitled";
}

export function sessionDisplayStart(
  session: Pick<SessionWithClass, "start_time" | "classes">
): string {
  return session.start_time ?? session.classes?.start_time ?? "00:00:00";
}

export function sessionDisplayEnd(
  session: Pick<SessionWithClass, "end_time" | "classes">
): string {
  return session.end_time ?? session.classes?.end_time ?? "00:00:00";
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
