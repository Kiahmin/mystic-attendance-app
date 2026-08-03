"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, LayoutDashboard, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  profile: Profile;
}

export function AppHeader({ profile }: AppHeaderProps) {
  const pathname = usePathname();
  const isAdmin = profile.role === "admin";

  const links = isAdmin
    ? [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/coach", label: "Sessions", icon: ClipboardList },
      ]
    : [{ href: "/coach", label: "Sessions", icon: ClipboardList }];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            M
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Mystic Skates</p>
            <p className="text-xs text-muted-foreground capitalize">
              {profile.role}
            </p>
          </div>
        </div>

        <form action={signOut}>
          <Button type="submit" variant="ghost" size="icon-sm" aria-label="Sign out">
            <LogOut className="size-4" />
          </Button>
        </form>
      </div>

      <nav className="mx-auto flex max-w-3xl gap-1 px-4 pb-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
