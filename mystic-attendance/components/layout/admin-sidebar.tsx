"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { isNavActive } from "@/lib/navigation";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  profile: Profile;
  className?: string;
  onNavigate?: () => void;
}

const LINKS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/schedule",
    label: "Schedule",
    icon: CalendarDays,
    exact: false,
  },
  { href: "/admin/students", label: "Students", icon: Users, exact: false },
  {
    href: "/admin/classes",
    label: "Classes",
    icon: GraduationCap,
    exact: false,
  },
  {
    href: "/admin/packages",
    label: "Packages",
    icon: Package,
    exact: false,
  },
  {
    href: "/coach",
    label: "Today's sessions",
    icon: ClipboardList,
    exact: false,
  },
] as const;

export function AdminSidebar({
  profile,
  className,
  onNavigate,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          MS
        </div>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold">Mystic Skates</p>
          <p className="truncate text-xs text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {LINKS.map((link) => {
          const { href, label, icon: Icon, exact } = link;
          const active = isNavActive(pathname, href, exact);
          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              onClick={onNavigate}
              className={cn(
                "inline-flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <p className="mb-2 truncate px-3 text-xs text-muted-foreground">
          {profile.full_name}
        </p>
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex h-9 w-full items-center justify-start gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-destructive"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
