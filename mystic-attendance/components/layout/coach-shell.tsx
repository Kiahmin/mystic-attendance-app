import { ClipboardList, LogOut, UserRound } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { isNavActive } from "@/lib/navigation";
import { getPathname } from "@/lib/navigation-server";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CoachShellProps {
  profile: Profile;
  children: React.ReactNode;
}

export async function CoachShell({ profile, children }: CoachShellProps) {
  const pathname = await getPathname();
  const sessionsActive = isNavActive(pathname, "/coach");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <p className="font-heading text-base font-semibold tracking-tight text-primary">
            Mystic Skates
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-5 pb-24">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-muted/95 backdrop-blur supports-[backdrop-filter]:bg-muted/90">
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1">
          <a
            href="/coach"
            className={cn(
              "flex min-w-[4.5rem] flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              sessionsActive
                ? "bg-secondary/80 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ClipboardList className="size-5" />
            Sessions
          </a>
          <form action={signOut} className="flex">
            <button
              type="submit"
              className="flex min-w-[4.5rem] flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              aria-label={`Sign out ${profile.full_name}`}
              title={profile.full_name}
            >
              <UserRound className="size-5" />
              Profile
            </button>
          </form>
        </div>
      </nav>
    </div>
  );
}
