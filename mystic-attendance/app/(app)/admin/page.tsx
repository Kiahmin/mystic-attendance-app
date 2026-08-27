import {
  CheckCircle2,
  Package,
  UserMinus,
  Users,
} from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { isValidYearMonth, todayInSingapore } from "@/lib/datetime";
import { listClasses } from "@/lib/queries/classes";
import { getDashboardOperations } from "@/lib/queries/dashboard";
import {
  getSessionsForDashboardRange,
  getTodaySessionsForDashboard,
} from "@/lib/queries/sessions";
import { countInactiveStudents } from "@/lib/queries/students";
import { weekDatesContaining } from "@/lib/session-utils";
import { DashboardDueSoonPanel } from "@/components/admin/dashboard-due-soon-panel";
import { DashboardInformedPanel } from "@/components/admin/dashboard-informed-panel";
import { DashboardOvershotPanel } from "@/components/admin/dashboard-overshot-panel";
import { DashboardMonthlyAttendance } from "@/components/admin/dashboard-monthly-attendance";
import { MetricCard } from "@/components/layout/metric-card";
import { PageHeader } from "@/components/layout/page-header";

function parseReportMonth(value: string | undefined, today: string): string {
  if (value && isValidYearMonth(value)) return value;
  return today.slice(0, 7);
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    reportMonth?: string;
  }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const today = todayInSingapore();
  const reportMonth = parseReportMonth(params.reportMonth, today);
  const thisWeek = weekDatesContaining(today);

  const [todaySessions, weekSessions, inactiveCount, operations, classes] =
    await Promise.all([
      getTodaySessionsForDashboard(),
      getSessionsForDashboardRange(thisWeek.monday, thisWeek.sunday),
      countInactiveStudents(),
      getDashboardOperations(reportMonth),
      listClasses({ activeOnly: true }),
    ]);

  const totalExpectedToday = todaySessions.reduce(
    (sum, item) => sum + item.expectedCount,
    0
  );
  const totalExpectedWeek = weekSessions.reduce(
    (sum, item) => sum + item.expectedCount,
    0
  );
  const totalCheckedIn = todaySessions.reduce(
    (sum, item) => sum + item.checkedInCount,
    0
  );
  const noSessionsToday = todaySessions.length === 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Today's metrics and packages that need attention."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Expected this week"
          value={totalExpectedWeek}
          detail="This week"
          icon={<Users />}
          href="/admin/schedule"
        />
        <MetricCard
          label="Checked in today"
          value={
            noSessionsToday ? (
              totalCheckedIn
            ) : (
              <span>
                {totalCheckedIn}
                <span className="text-lg font-medium text-muted-foreground">
                  {" "}
                  / {totalExpectedToday}
                </span>
              </span>
            )
          }
          valueText={
            noSessionsToday
              ? String(totalCheckedIn)
              : `${totalCheckedIn} of ${totalExpectedToday}`
          }
          detail={noSessionsToday ? "No sessions today" : "Today"}
          icon={<CheckCircle2 />}
          href={`/admin/schedule?view=day&date=${today}`}
        />
        <MetricCard
          label="Inactive students"
          value={inactiveCount}
          detail="No class in 6 months"
          icon={<UserMinus />}
          href="/admin/students?inactive=1"
        />
        <MetricCard
          label="Active packages"
          value={operations.activePackageCount}
          detail="Still taking lessons"
          icon={<Package />}
          href="/admin/packages?filter=active"
        />
      </div>

      <section className="space-y-4" aria-labelledby="dashboard-queues">
        <h2
          id="dashboard-queues"
          className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
        >
          Queues
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <DashboardDueSoonPanel
            items={operations.dueSoon}
            classes={classes.map((cls) => ({ id: cls.id, name: cls.name }))}
          />
          <DashboardInformedPanel items={operations.informed} />
          <DashboardOvershotPanel items={operations.overshot} />
        </div>
      </section>

      <section aria-labelledby="dashboard-reporting">
        <DashboardMonthlyAttendance
          reportMonth={reportMonth}
          monthCheckInCount={operations.monthCheckInCount}
          byVenue={operations.monthlyByVenue}
          byDay={operations.monthlyByDay}
        />
      </section>
    </div>
  );
}
