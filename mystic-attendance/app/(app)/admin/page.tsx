import {
  AlertTriangle,
  CheckCircle2,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { getTodaySessionsForDashboard } from "@/lib/queries/sessions";
import { SessionCard } from "@/components/coach/session-card";
import { MetricCard } from "@/components/layout/metric-card";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button-variants";

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
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Today's metrics and upcoming sessions."
      >
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Expected Students Today"
          value={totalExpected}
          icon={<Users />}
        />
        <MetricCard
          label="Checked-in Count"
          value={
            <span>
              {totalCheckedIn}
              <span className="text-lg font-medium text-muted-foreground">
                {" "}
                / {totalExpected}
              </span>
            </span>
          }
          icon={<CheckCircle2 />}
        />
        <MetricCard
          label="Package Alerts"
          value={totalAlerts}
          accent={totalAlerts > 0 ? "warning" : "default"}
          icon={<AlertTriangle />}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-heading text-lg font-semibold">
            Today&apos;s Sessions
          </h2>
          <a
            href="/coach"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            View full schedule
          </a>
        </div>

        {sessions.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-8 text-center">
            <p className="font-medium">No sessions today</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Sessions appear here on the day they run.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_1fr] gap-4 border-b border-border/60 bg-muted/50 px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:grid">
              <span>Class Name</span>
              <span>Time</span>
              <span>Headcount</span>
              <span>Status</span>
            </div>
            <ul className="divide-y divide-border/60">
              {sessions.map((item) => (
                <li key={item.session.id}>
                  <SessionCard
                    session={item.session}
                    href={`/coach/sessions/${item.session.id}`}
                    expectedCount={item.expectedCount}
                    checkedInCount={item.checkedInCount}
                    packageAlerts={item.packageAlerts}
                    variant="row"
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
