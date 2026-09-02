import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { COACH_UNAVAILABLE_PATH, requireProfile } from "@/lib/auth/profile";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  if (profile.role === "coach") {
    redirect(COACH_UNAVAILABLE_PATH);
  }

  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <AppShell profile={profile}>{children}</AppShell>
    </>
  );
}
