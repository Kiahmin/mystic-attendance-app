import {
  addCalendarMonths,
  instantToSingaporeDate,
  todayInSingapore,
} from "@/lib/datetime";
import type { DayOfWeek, SkillLevel } from "@/lib/types";

export const SKILL_LEVELS: SkillLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "freestyle",
];

export const SKILL_LEVEL_LABELS: Record<SkillLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  freestyle: "Freestyle",
};

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const DAY_OF_WEEK_SHORT_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export const DAYS_SUNDAY_FIRST: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const DAY_OF_WEEK_LETTER_LABELS: Record<DayOfWeek, string> = {
  sunday: "S",
  monday: "M",
  tuesday: "T",
  wednesday: "W",
  thursday: "T",
  friday: "F",
  saturday: "S",
};

/** Whether a YYYY-MM-DD date of birth is under 18 as of today (Singapore). */
export function isMinorDob(dateOfBirth: string | null | undefined): boolean {
  if (!dateOfBirth) return false;
  const today = todayInSingapore();
  const [y, m, d] = dateOfBirth.split("-").map(Number);
  const cutoff = new Date(Date.UTC(y + 18, m - 1, d));
  const [ty, tm, td] = today.split("-").map(Number);
  const todayUtc = new Date(Date.UTC(ty, tm - 1, td));
  return todayUtc < cutoff;
}

/** Age in whole years from YYYY-MM-DD DOB as of today (Singapore), or null. */
export function ageFromDob(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null;
  const today = todayInSingapore();
  const [y, m, d] = dateOfBirth.split("-").map(Number);
  const [ty, tm, td] = today.split("-").map(Number);
  let age = ty - y;
  if (tm < m || (tm === m && td < d)) age -= 1;
  return age >= 0 ? age : null;
}

export function normalizeTime(value: string): string {
  const trimmed = value.trim();
  // Accept HH:MM or HH:MM:SS
  if (/^\d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  return trimmed;
}

export function timeToMinutes(value: string): number | null {
  const normalized = normalizeTime(value);
  const match = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(normalized);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function minutesToTime(totalMinutes: number): string {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, Math.round(totalMinutes)));
  const hours = Math.floor(clamped / 60);
  const minutes = clamped % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function emptyToNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

/** True when last attendance (or created_at if never attended) is over 6 months ago. */
export function isInactiveForSixMonths(
  lastAttendedOn: string | null,
  createdAt: string,
  today = todayInSingapore()
): boolean {
  const cutoff = addCalendarMonths(today, -6);
  const activityDate = lastAttendedOn ?? instantToSingaporeDate(createdAt);
  return activityDate < cutoff;
}
