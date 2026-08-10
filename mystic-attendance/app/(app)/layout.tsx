import { AdminShell } from "@/components/layout/admin-shell";
import { CoachShell } from "@/components/layout/coach-shell";
import { requireProfile } from "@/lib/auth/profile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  if (profile.role === "admin") {
    return <AdminShell profile={profile}>{children}</AdminShell>;
  }

  return <CoachShell profile={profile}>{children}</CoachShell>;
}
