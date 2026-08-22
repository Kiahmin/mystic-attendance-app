import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/profile";
import { getCoachSessionsForToday } from "@/lib/queries/sessions";
import { SessionCard } from "@/components/coach/session-card";
import { PageHeader } from "@/components/layout/page-header";

export default async function CoachHomePage() {
  const profile = await requireRole(["coach", "admin"]);

  if (profile.role === "admin") {
    redirect("/admin");
  }

  const sessions = await getCoachSessionsForToday(profile.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Today's sessions"
        description="Tap a class to take attendance on the floor."
      />

      {sessions.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">No sessions scheduled today</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sessions appear here on the day they run.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              href={
                session.requires_attendance !== false
                  ? `/coach/sessions/${session.id}`
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
