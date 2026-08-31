import { createClient } from "@supabase/supabase-js";

/**
 * Auth admin API only. Requires SUPABASE_SECRET_API_KEY on the server.
 * Hosted: add this app's /auth/callback URL under Auth → Redirect URLs, and SMTP.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretApiKey = process.env.SUPABASE_SECRET_API_KEY;

  if (!url || !secretApiKey) {
    throw new Error("Missing SUPABASE_SECRET_API_KEY.");
  }

  return createClient(url, secretApiKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
