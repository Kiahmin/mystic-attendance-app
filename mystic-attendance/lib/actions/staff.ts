"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/profile";
import { isInviteableRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function inviteRedirectTo(origin: string) {
  return `${origin}/auth/callback`;
}

async function requestOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;
  return "http://127.0.0.1:3001";
}

async function insertStaffProfile(
  admin: ReturnType<typeof createAdminClient>,
  row: { id: string; full_name: string; role: string }
) {
  const supabase = await createClient();
  const asStaff = await supabase.from("profiles").insert(row);
  if (!asStaff.error) return asStaff;

  return admin.from("profiles").insert(row);
}

export async function inviteStaff(
  _prev: { error?: string; success?: string; inviteUrl?: string | null } | null,
  formData: FormData
): Promise<{ error?: string; success?: string; inviteUrl?: string | null }> {
  await requireRole(["super_admin"]);

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");

  if (!fullName) return { error: "Full name is required." };
  if (!email) return { error: "Email is required." };
  if (!isInviteableRole(role)) {
    return { error: "Invite as a coach or admin." };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { error: "Staff invites are not configured (missing SUPABASE_SECRET_API_KEY)." };
  }

  const origin = await requestOrigin();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      data: { full_name: fullName },
      redirectTo: inviteRedirectTo(origin),
    },
  });

  if (error || !data.user) {
    const message = error?.message ?? "Could not send invite.";
    if (/already been registered|already exists/i.test(message)) {
      return { error: "A user with that email already exists." };
    }
    return { error: message };
  }

  const { error: profileError } = await insertStaffProfile(admin, {
    id: data.user.id,
    full_name: fullName,
    role,
  });

  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: profileError.message };
  }

  const tokenHash = data.properties.hashed_token;
  const inviteUrl = tokenHash
    ? `${origin}/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=invite`
    : null;

  revalidatePath("/admin/staff");
  return {
    success: `Invite created for ${email}. Open the setup link below (the email button may fail on localhost).`,
    inviteUrl,
  };
}
