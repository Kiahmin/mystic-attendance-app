export function inviteCallbackPath(): string {
  if (typeof window === "undefined") return "/auth/callback";

  const search = window.location.search;
  const hash = window.location.hash;
  const params = new URLSearchParams(search);
  const hashParams = new URLSearchParams(hash.replace(/^#/, ""));

  if (
    params.get("error") ||
    params.get("error_code") ||
    hashParams.get("error") ||
    hashParams.get("error_code")
  ) {
    return "";
  }

  const hasCode = Boolean(params.get("code"));
  const hasTokenHash = Boolean(
    params.get("token_hash") || params.get("token")
  );
  const hasHashSession = Boolean(
    hashParams.get("access_token") && hashParams.get("refresh_token")
  );

  if (!hasCode && !hasTokenHash && !hasHashSession) return "";
  return `/auth/callback${search}${hash}`;
}

export function inviteLinkErrorMessage(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(
    window.location.hash.replace(/^#/, "")
  );
  const code =
    params.get("error_code") || hashParams.get("error_code") || "";
  const description = (
    params.get("error_description") ||
    hashParams.get("error_description") ||
    ""
  ).replace(/\+/g, " ");

  if (
    code === "otp_expired" ||
    /invalid or has expired/i.test(description)
  ) {
    return "That invite link is invalid or expired. Ask a super-admin to invite you again, then open the setup link from the Staff page.";
  }

  if (params.get("error") || hashParams.get("error")) {
    return description || "That invite link could not be used.";
  }

  return null;
}
