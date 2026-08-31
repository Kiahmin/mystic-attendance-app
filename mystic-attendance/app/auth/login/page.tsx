import { LoginForm } from "@/components/auth/login-form";
import { getProfile, getSessionUser, homePathForRole } from "@/lib/auth/profile";
import { redirect } from "next/navigation";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const user = await getSessionUser();
  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <LoginForm
          initialError={
            error === "staff_only"
              ? "Only staff accounts can sign in."
              : error === "invite"
                ? "That invite link is invalid or expired. Ask a super-admin to invite you again."
                : null
          }
        />
        <p className="mt-6 max-w-md text-center text-xs text-muted-foreground">
          Install this app on your phone from the browser menu for quick access
          at class time.
        </p>
      </main>
    );
  }

  const profile = await getProfile();
  if (profile) {
    redirect(homePathForRole(profile.role));
  }

  redirect("/");
}
