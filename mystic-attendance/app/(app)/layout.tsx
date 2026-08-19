import { Suspense } from "react";
import { AdminShell } from "@/components/layout/admin-shell";
import { CoachShell } from "@/components/layout/coach-shell";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { requireProfile } from "@/lib/auth/profile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  const shell =
    profile.role === "admin" ? (
      <AdminShell profile={profile}>{children}</AdminShell>
    ) : (
      <CoachShell profile={profile}>{children}</CoachShell>
    );

  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      {shell}
    </>
  );
}
