import type { Profile, UserRole } from "@/lib/types";

export const STAFF_ROLES = ["admin", "coach", "super_admin"] as const;

export const INVITEABLE_ROLES = ["admin", "coach"] as const;

export type InviteableRole = (typeof INVITEABLE_ROLES)[number];

export function isStaffRole(
  role: string | null | undefined
): role is Profile["role"] {
  return role === "admin" || role === "coach" || role === "super_admin";
}

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "admin" || role === "super_admin";
}

export function isSuperAdminRole(role: string | null | undefined): boolean {
  return role === "super_admin";
}

export function isInviteableRole(
  role: string | null | undefined
): role is InviteableRole {
  return role === "admin" || role === "coach";
}

export function isCoachAssignable(role: string | null | undefined): boolean {
  return isStaffRole(role);
}

export function homePathForRole(role: Profile["role"]): string {
  return isAdminRole(role) ? "/admin" : "/coach";
}

export function roleSatisfies(
  allowed: UserRole[],
  actual: UserRole
): boolean {
  if (allowed.includes(actual)) return true;
  return actual === "super_admin" && allowed.includes("admin");
}
