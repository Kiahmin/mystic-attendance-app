/** Mystic Skates operates in Singapore — all calendar dates use this zone. */
export const APP_TIMEZONE = "Asia/Singapore";

/** Today's calendar date in Singapore as `YYYY-MM-DD`. */
export function todayInSingapore(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
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
