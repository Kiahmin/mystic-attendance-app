"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import type { Profile } from "@/lib/types";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

interface AdminMobileNavProps {
  profile: Profile;
}

export function AdminMobileNav({ profile }: AdminMobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <div className="flex h-14 items-center gap-3 border-b border-border/60 bg-background/95 px-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg text-foreground hover:bg-muted"
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu className="size-5" />
        </button>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Mystic Skates</p>
          <p className="text-xs text-muted-foreground">Admin Portal</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-label="Close menu"
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(100%,18rem)] border-r border-sidebar-border bg-sidebar shadow-lg transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar profile={profile} onNavigate={() => setOpen(false)} />
      </div>
    </div>
  );
}
