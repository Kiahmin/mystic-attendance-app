import { requireRole } from "@/lib/auth/profile";
import { getTodaySessionsForDashboard } from "@/lib/queries/sessions";
import { SessionCard } from "@/components/coach/session-card";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);
  const sessions = await getTodaySessionsForDashboard();

  const totalExpected = sessions.reduce(
    (sum, item) => sum + item.expectedCount,
    0
  );
  const totalCheckedIn = sessions.reduce(
    (sum, item) => sum + item.checkedInCount,
    0
  );
  const totalAlerts = sessions.reduce(
    (sum, item) => sum + item.packageAlerts,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Today&apos;s sessions, check-in progress, and package alerts.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{sessions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Checked in
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {totalCheckedIn}/{totalExpected}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Package alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalAlerts}</p>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Today&apos;s sessions</h2>
        {sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <p className="font-medium">No sessions today</p>
          </div>
        ) : (
          sessions.map((item) => (
            <SessionCard
              key={item.session.id}
              session={item.session}
              href={`/coach/sessions/${item.session.id}`}
              expectedCount={item.expectedCount}
              checkedInCount={item.checkedInCount}
              packageAlerts={item.packageAlerts}
            />
          ))
        )}
      </section>
    </div>
  );
}
