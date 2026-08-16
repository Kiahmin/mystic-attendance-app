import {
  AlertTriangle,
  CheckCircle2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/profile";
import { formatCalendarDate } from "@/lib/datetime";
import {
  getTodaySessionsForDashboard,
  getWeekSessionsForDashboard,
} from "@/lib/queries/sessions";
import { weekendDatesInCurrentWeek } from "@/lib/session-utils";
import { DashboardSessionRow } from "@/components/admin/dashboard-session-row";
import { GenerateSessionsButton } from "@/components/admin/generate-sessions-button";
import { MetricCard } from "@/components/layout/metric-card";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);

  const [todaySessions, weekSessions] = await Promise.all([
    getTodaySessionsForDashboard(),
    getWeekSessionsForDashboard(),
  ]);

  const { saturday, sunday } = weekendDatesInCurrentWeek();
  const weekRangeLabel = `${formatCalendarDate(saturday)} – ${formatCalendarDate(sunday)}`;

  const totalExpected = todaySessions.reduce(
    (sum, item) => sum + item.expectedCount,
    0
  );
  const totalCheckedIn = todaySessions.reduce(
    (sum, item) => sum + item.checkedInCount,
    0
  );
  const totalAlerts = todaySessions.reduce(
    (sum, item) => sum + item.packageAlerts,
    0
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Today's metrics and this week's schedule."
      />

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
          href="/admin/packages?filter=at_risk"
        />
      </div>

      {totalAlerts > 0 ? (
        <p className="-mt-4 text-sm">
          <Link
            href="/admin/packages?filter=at_risk"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Review packages needing attention
          </Link>
        </p>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold">
              This week&apos;s schedule
            </h2>
            <p className="text-sm text-muted-foreground">
              Saturday–Sunday sessions for {weekRangeLabel}. Generate, monitor,
              and cancel.
            </p>
          </div>
          <GenerateSessionsButton />
        </div>

        {weekSessions.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-8 text-center">
            <p className="font-medium">No sessions this weekend</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate this week&apos;s sessions from active Saturday and Sunday
              classes.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
            <div className="hidden grid-cols-[1.2fr_0.7fr_0.8fr_0.8fr_0.8fr_0.9fr_auto] gap-4 border-b border-border/60 bg-muted/50 px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:grid">
              <span>Class Name</span>
              <span>Date</span>
              <span>Time</span>
              <span>Coach</span>
              <span>Headcount</span>
              <span>Status</span>
              <span className="sr-only">Actions</span>
            </div>
            <ul className="divide-y divide-border/60">
              {weekSessions.map((item) => (
                <li key={item.session.id}>
                  <DashboardSessionRow item={item} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
