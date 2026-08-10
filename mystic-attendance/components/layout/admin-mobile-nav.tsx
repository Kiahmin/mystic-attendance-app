import { Menu } from "lucide-react";
import type { Profile } from "@/lib/types";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

interface AdminMobileNavProps {
  profile: Profile;
  pathname: string;
}

/** Checkbox-driven drawer — no client JS required. */
export function AdminMobileNav({ profile, pathname }: AdminMobileNavProps) {
  return (
    <div className="relative md:hidden">
      <input
        id="admin-mobile-nav"
        type="checkbox"
        className="peer sr-only"
      />

      <div className="flex h-14 items-center gap-3 border-b border-border/60 bg-background/95 px-4">
        <label
          htmlFor="admin-mobile-nav"
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-foreground hover:bg-muted"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </label>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Mystic Skates</p>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      <label
        htmlFor="admin-mobile-nav"
        className="pointer-events-none fixed inset-0 z-40 bg-black/30 opacity-0 transition-opacity peer-checked:pointer-events-auto peer-checked:opacity-100"
        aria-label="Close menu"
      />

      <div className="fixed inset-y-0 left-0 z-50 w-[min(100%,18rem)] -translate-x-full border-r border-sidebar-border bg-sidebar shadow-lg transition-transform peer-checked:translate-x-0">
        <AdminSidebar profile={profile} pathname={pathname} />
      </div>
    </div>
  );
}
