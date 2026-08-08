import { cache } from "react";
import { bypassProfile, isLoginEnabled } from "@/lib/auth/config";
import { homePathForRole, isStaffRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { redirect } from "next/navigation";

export { homePathForRole, isStaffRole, STAFF_ROLES } from "@/lib/auth/roles";

export const getSessionUser = cache(async (): Promise<{ id: string } | null> => {
  if (!isLoginEnabled()) {
    return { id: bypassProfile.id };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const sub = data?.claims?.sub;
  return sub ? { id: sub } : null;
});

export const getProfile = cache(async (): Promise<Profile | null> => {
  if (!isLoginEnabled()) return bypassProfile;

  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, phone, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("profiles lookup failed:", error.message, "user:", user.id);
  }

  return profile;
});

export const getProfileLookupError = cache(async (): Promise<string | null> => {
  if (!isLoginEnabled()) return null;

  const user = await getSessionUser();
  if (!user) return null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  return error?.message ?? null;
});

export async function requireProfile(): Promise<Profile> {
  const profile = await getProfile();
  if (profile && isStaffRole(profile.role)) return profile;

  if (isLoginEnabled()) {
    const user = await getSessionUser();
    if (user) {
      const supabase = await createClient();
      await supabase.auth.signOut();
      redirect("/auth/login?error=staff_only");
    }
  }

  redirect("/auth/login");
}

export async function requireRole(roles: Profile["role"][]): Promise<Profile> {
  const profile = await requireProfile();
  if (!roles.includes(profile.role)) {
    redirect(profile.role === "admin" ? "/admin" : "/coach");
  }
  return profile;
}
