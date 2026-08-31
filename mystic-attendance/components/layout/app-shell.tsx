"use client";

import { usePathname } from "next/navigation";
import type { Profile } from "@/lib/types";
import { AdminShell } from "@/components/layout/admin-shell";
import { CoachShell } from "@/components/layout/coach-shell";

export function AppShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const onCoachFloor = pathname === "/coach" || pathname.startsWith("/coach/");

  if (onCoachFloor) {
    return <CoachShell profile={profile}>{children}</CoachShell>;
  }

  if (profile.role === "admin") {
    return <AdminShell profile={profile}>{children}</AdminShell>;
  }

  return <CoachShell profile={profile}>{children}</CoachShell>;
}
