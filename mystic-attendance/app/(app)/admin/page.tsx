import {
  AlertTriangle,
  CheckCircle2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/profile";
import { todayInSingapore } from "@/lib/datetime";
import { listCoaches } from "@/lib/queries/profiles";
import {
  getTodaySessionsForDashboard,
  getWeekSessionsForDashboard,
} from "@/lib/queries/sessions";
import {
  resolveWeekDates,
  weekDatesContaining,
} from "@/lib/session-utils";
import { DashboardSessionRow } from "@/components/admin/dashboard-session-row";
import { GenerateSessionsButton } from "@/components/admin/generate-sessions-button";
import { WeekNav } from "@/components/admin/week-nav";
import { MetricCard } from "@/components/layout/metric-card";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; weekend?: string }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const { monday, sunday } = resolveWeekDates(params.week ?? params.weekend);
  const currentWeek = weekDatesContaining();
  const isCurrentWeek = monday === currentWeek.monday;

  const [todayOnly, weekSessions, coaches] = await Promise.all([
    isCurrentWeek ? Promise.resolve(null) : getTodaySessionsForDashboard(),
    getWeekSessionsForDashboard(monday, sunday),
    listCoaches(),
  ]);
  const today = todayInSingapore();
  const todaySessions =
    todayOnly ??
    weekSessions.filter((item) => item.session.session_date === today);

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
        description="Today's metrics and weekly schedule history."
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
          href="/admin/packages?filter=finishing,unpaid,expired,finished"
        />
      </div>

      {totalAlerts > 0 ? (
        <p className="-mt-4 text-sm">
          <Link
            href="/admin/packages?filter=finishing,unpaid,expired,finished"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Review packages that need attention
          </Link>
        </p>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-heading text-lg font-semibold">
                {isCurrentWeek ? "This week's schedule" : "Week schedule"}
              </h2>
              <WeekNav
                monday={monday}
                sunday={sunday}
                isCurrentWeek={isCurrentWeek}
              />
            </div>
          <GenerateSessionsButton weekMonday={monday} />
        </div>

        {weekSessions.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card p-8 text-center">
            <p className="font-medium">No sessions this week</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate this week&apos;s sessions from active classes.
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
                  <DashboardSessionRow
                    item={item}
                    weekMonday={monday}
                    coaches={coaches}
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
