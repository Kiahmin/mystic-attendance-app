import { redirect } from "next/navigation";
import { SetPasswordForm } from "@/components/auth/set-password-form";
import { getSessionUser } from "@/lib/auth/profile";

export default async function SetPasswordPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <SetPasswordForm />
    </main>
  );
}
