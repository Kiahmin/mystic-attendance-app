import type { Profile } from "@/lib/types";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminMobileNav } from "@/components/layout/admin-mobile-nav";

interface AdminShellProps {
  profile: Profile;
  children: React.ReactNode;
}

export function AdminShell({ profile, children }: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-60 shrink-0 border-r border-sidebar-border md:block">
        <div className="sticky top-0 h-screen">
          <AdminSidebar profile={profile} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminMobileNav profile={profile} />
        <main className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
