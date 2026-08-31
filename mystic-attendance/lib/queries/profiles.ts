import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function listCoaches(): Promise<
  Pick<Profile, "id" | "full_name">[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("role", ["coach", "admin", "super_admin"])
    .order("full_name");

  if (error) throw error;
  return data ?? [];
}

export type StaffListItem = Pick<
  Profile,
  "id" | "full_name" | "role" | "created_at"
> & {
  email: string | null;
};

export async function listStaff(): Promise<StaffListItem[]> {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("full_name");

  if (error) throw error;

  const emailById = new Map<string, string>();
  try {
    const admin = createAdminClient();
    const { data, error: listError } = await admin.auth.admin.listUsers({
      perPage: 1000,
    });
    if (!listError) {
      for (const user of data.users) {
        if (user.email) emailById.set(user.id, user.email);
      }
    }
  } catch {
    // Emails are optional if SUPABASE_SECRET_API_KEY is not configured.
  }

  return (profiles ?? []).map((profile) => ({
    ...profile,
    email: emailById.get(profile.id) ?? null,
  }));
}
