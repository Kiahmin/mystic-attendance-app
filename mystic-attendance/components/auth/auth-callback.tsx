"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { SetPasswordForm } from "@/components/auth/set-password-form";
import { createClient } from "@/lib/supabase/client";

const OTP_TYPES = new Set<EmailOtpType>([
  "invite",
  "signup",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]);

function otpType(value: string | null): EmailOtpType {
  if (value && OTP_TYPES.has(value as EmailOtpType)) {
    return value as EmailOtpType;
  }
  return "invite";
}

export function AuthCallback() {
  const router = useRouter();
  const [message, setMessage] = useState("Opening your invite…");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function completeInvite() {
      const supabase = createClient();
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );

      const errorParam =
        params.get("error_description") ||
        params.get("error") ||
        hashParams.get("error_description") ||
        hashParams.get("error");

      if (errorParam) {
        router.replace("/auth/login?error=invite");
        return;
      }

      const code = params.get("code");
      const tokenHash =
        params.get("token_hash") ||
        params.get("token") ||
        hashParams.get("token_hash");
      const type = otpType(params.get("type") || hashParams.get("type"));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      let errorMessage: string | undefined;

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        errorMessage = error?.message;
      } else if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        });
        errorMessage = error?.message;
      } else if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        errorMessage = error?.message;
      } else {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          errorMessage = "missing session";
        }
      }

      if (cancelled) return;

      if (errorMessage) {
        router.replace("/auth/login?error=invite");
        return;
      }

      window.history.replaceState(null, "", "/auth/callback");
      setReady(true);
    }

    void completeInvite();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      {ready ? (
        <SetPasswordForm />
      ) : (
        <p className="text-sm text-muted-foreground">{message}</p>
      )}
    </main>
  );
}
