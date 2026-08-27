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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Today's metrics and packages that need attention."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Expected Students This Week"
          value={totalExpectedWeek}
          icon={<Users />}
        />
        <MetricCard
          label="Checked-in Count"
          value={
            <span>
              {totalCheckedIn}
              <span className="text-lg font-medium text-muted-foreground">
                {" "}
                / {totalExpectedToday}
              </span>
            </span>
          }
          icon={<CheckCircle2 />}
        />
        <MetricCard
          label="Inactive Students"
          value={inactiveCount}
          icon={<UserMinus />}
          href="/admin/students?inactive=1"
        />
        <MetricCard
          label="Active packages"
          value={operations.activePackageCount}
          detail="Students still taking lessons"
          icon={<Package />}
          href="/admin/packages?filter=active"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <DashboardDueSoonPanel
          items={operations.dueSoon}
          classes={classes.map((cls) => ({ id: cls.id, name: cls.name }))}
        />
        <DashboardInformedPanel items={operations.informed} />
        <DashboardOvershotPanel items={operations.overshot} />
      </div>

      <DashboardMonthlyAttendance
        reportMonth={reportMonth}
        monthCheckInCount={operations.monthCheckInCount}
        byVenue={operations.monthlyByVenue}
        byDay={operations.monthlyByDay}
      />
    </div>
  );
}
