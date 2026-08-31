import type { Profile } from "@/lib/types";

export const STAFF_ROLES = ["admin", "coach"] as const;

export function isStaffRole(
  role: string | null | undefined
): role is Profile["role"] {
  return role === "admin" || role === "coach";
}

export function isCoachAssignable(
  role: string | null | undefined
): boolean {
  return role === "admin" || role === "coach";
}

export function homePathForRole(role: Profile["role"]): string {
  return role === "admin" ? "/admin" : "/coach";
}
