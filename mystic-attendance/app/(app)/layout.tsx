import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { requireProfile } from "@/lib/auth/profile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <>
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <AppShell profile={profile}>{children}</AppShell>
    </>
  );
}
