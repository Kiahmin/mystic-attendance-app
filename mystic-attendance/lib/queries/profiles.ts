import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export async function listCoaches(): Promise<
  Pick<Profile, "id" | "full_name">[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "coach")
    .order("full_name");

  if (error) throw error;
  return data ?? [];
}
