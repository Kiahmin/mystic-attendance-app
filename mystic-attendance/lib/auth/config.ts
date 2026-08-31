import type { Profile } from "@/lib/types";

export function isLoginEnabled(): boolean {
  return process.env.LOGIN !== "false";
}

/** Seed admin profile used when LOGIN=false */
export const bypassProfile: Profile = {
  id: "11111111-1111-1111-1111-111111111111",
  full_name: "Admin User",
  role: "super_admin",
  phone: null,
  created_at: "2026-01-01T00:00:00.000Z",
};
