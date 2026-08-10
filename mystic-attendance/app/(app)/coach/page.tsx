import { requireRole } from "@/lib/auth/profile";
import {
  getCoachSessionsForToday,
  getTodaySessionsForDashboard,
} from "@/lib/queries/sessions";
import { SessionCard } from "@/components/coach/session-card";
import { PageHeader } from "@/components/layout/page-header";

export default async function CoachHomePage() {
  const profile = await requireRole(["coach", "admin"]);

  if (profile.role === "coach") {
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
                href={`/coach/sessions/${session.id}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const dashboard = await getTodaySessionsForDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Today's sessions"
        description="Tap a class to take attendance on the floor."
      />

      {dashboard.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">No sessions scheduled today</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sessions appear here on the day they run.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dashboard.map((item) => (
            <SessionCard
              key={item.session.id}
              session={item.session}
              href={`/coach/sessions/${item.session.id}`}
              expectedCount={item.expectedCount}
              checkedInCount={item.checkedInCount}
              packageAlerts={item.packageAlerts}
            />
          ))}
        </div>
      )}
    </div>
  );
}
