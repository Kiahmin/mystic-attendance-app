/** Mystic Skates operates in Singapore — all calendar dates use this zone. */
export const APP_TIMEZONE = "Asia/Singapore";

/** Calendar date in Singapore as `YYYY-MM-DD` for an instant. */
export function instantToSingaporeDate(instant: Date | string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof instant === "string" ? new Date(instant) : instant);
}

/** Today's calendar date in Singapore as `YYYY-MM-DD`. */
export function todayInSingapore(): string {
  return instantToSingaporeDate(new Date());
}

/** True when `date` is a real calendar day in `YYYY-MM-DD` form. */
export function isValidCalendarDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const [year, month, day] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day, 12));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

/** Parse a date-only string (`YYYY-MM-DD`) for display (avoids UTC midnight shifts). */
export function parseCalendarDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

/** Format a calendar date for en-SG display. */
export function formatCalendarDate(date: string): string {
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: APP_TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(parseCalendarDate(date));
}

/** Add days to a `YYYY-MM-DD` string (calendar arithmetic). */
export function addCalendarDays(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

/** First day of the month containing `date` (`YYYY-MM-DD`). */
export function startOfMonth(date: string): string {
  return `${date.slice(0, 7)}-01`;
}

/** Last day of the month containing `date` (`YYYY-MM-DD`). */
export function endOfMonth(date: string): string {
  const [year, month] = date.split("-").map(Number);
  const last = new Date(Date.UTC(year, month, 0, 12));
  return last.toISOString().slice(0, 10);
}

/** Add months to a `YYYY-MM-DD` string, clamping the day if needed. */
export function addCalendarMonths(date: string, months: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1 + months, 1, 12));
  const lastDay = new Date(
    Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0, 12)
  ).getUTCDate();
  next.setUTCDate(Math.min(day, lastDay));
  return next.toISOString().slice(0, 10);
}

/** Inclusive list of `YYYY-MM-DD` dates from `start` through `end`. */
export function datesInclusive(start: string, end: string): string[] {
  const days = calendarDaysBetween(start, end);
  if (days < 0) return [];
  return Array.from({ length: days + 1 }, (_, offset) =>
    addCalendarDays(start, offset)
  );
}

/** Month + year for en-SG display, e.g. `August 2026`. */
export function formatMonthYear(date: string): string {
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: APP_TIMEZONE,
    month: "long",
    year: "numeric",
  }).format(parseCalendarDate(date));
}

/** Compact calendar date without weekday, e.g. `22 Aug 2026`. */
export function formatCalendarDateLong(date: string): string {
  return new Intl.DateTimeFormat("en-SG", {
    timeZone: APP_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parseCalendarDate(date));
}

/** Day-of-month number for calendar headers. */
export function calendarDayNumber(date: string): number {
  return Number.parseInt(date.slice(8, 10), 10);
}

/** True when `date` falls on or before `today + days` (Singapore calendar). */
export function isOnOrBeforeDaysFromToday(date: string, days: number): boolean {
  return date <= addCalendarDays(todayInSingapore(), days);
}

/** Whole calendar days from `start` to `end` (`YYYY-MM-DD`). */
export function calendarDaysBetween(start: string, end: string): number {
  const [ys, ms, ds] = start.split("-").map(Number);
  const [ye, me, de] = end.split("-").map(Number);
  const a = Date.UTC(ys, ms - 1, ds);
  const b = Date.UTC(ye, me - 1, de);
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}
