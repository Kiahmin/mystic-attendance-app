export function inviteCallbackPath(): string {
  if (typeof window === "undefined") return "/auth/callback";

  const search = window.location.search;
  const hash = window.location.hash;
  const params = new URLSearchParams(search);
  const hashParams = new URLSearchParams(hash.replace(/^#/, ""));

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
