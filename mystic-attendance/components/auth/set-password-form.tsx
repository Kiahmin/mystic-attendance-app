"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setPending(false);
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setPending(false);
      return;
    }

    router.refresh();
    router.push("/");
  }

  return (
    <Card className="w-full max-w-md rounded-xl border-border/60 shadow-[0_8px_30px_rgba(26,27,34,0.06)]">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          MS
        </div>
        <CardTitle className="font-heading text-2xl text-primary">
          Set your password
        </CardTitle>
        <CardDescription>
          Choose a password to finish setting up your staff account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="h-11"
            />
          </div>

          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending ? "Saving…" : "Save password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
