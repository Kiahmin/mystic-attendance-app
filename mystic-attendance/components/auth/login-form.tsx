"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isStaffRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const STAFF_ONLY_ERROR = "Only staff accounts can sign in.";

type LoginFormProps = {
  initialError?: string | null;
};

export function LoginForm({ initialError = null }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Email and password are required.");
      setPending(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setPending(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sign in failed. Please try again.");
      setPending(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!isStaffRole(profile?.role)) {
      await supabase.auth.signOut();
      setError(STAFF_ONLY_ERROR);
      setPending(false);
      return;
    }

    router.refresh();
    router.push("/");
  }

  return (
    <Card className="w-full max-w-md border-border/60 shadow-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Mystic Skates</CardTitle>
        <CardDescription>Sign in to take attendance</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="coach@mystic.local"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
