"use server";

import { createClient } from "@/lib/supabase/server";
import { homePathForRole, isStaffRole } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export async function signIn(
  _prev: { error?: string } | null,
  formData: FormData
) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in failed. Please try again." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!isStaffRole(profile?.role)) {
    await supabase.auth.signOut();
    return { error: "Only staff accounts can sign in." };
  }

  redirect(homePathForRole(profile.role));
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
