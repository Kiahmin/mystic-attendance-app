import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Package,
  UserMinus,
  Users,
} from "lucide-react";
import Link from "next/link";
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
import { DashboardMonthlyAttendance } from "@/components/admin/dashboard-monthly-attendance";
import { MetricCard } from "@/components/layout/metric-card";
import { PageHeader } from "@/components/layout/page-header";

const PACKAGE_ATTENTION_HREF =
  "/admin/packages?filter=finishing,unpaid,expired,finished";

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
          label="Student due soon"
          value={operations.dueSoonCount}
          detail="Two or fewer lessons remaining"
          icon={<Clock />}
          href={PACKAGE_ATTENTION_HREF}
        />
      </div>

      {operations.dueSoonCount > 0 ? (
        <p className="-mt-4 text-sm">
          <Link
            href={PACKAGE_ATTENTION_HREF}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Review packages that need attention
          </Link>
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Active packages"
          value={operations.activePackageCount}
          detail="Students still taking lessons"
          icon={<Package />}
          href="/admin/packages?filter=active"
        />
        <MetricCard
          label="Informed"
          value={operations.informedCount}
          detail="Waiting for renewal"
          icon={<Bell />}
        />
        <MetricCard
          label="This month"
          value={operations.monthCheckInCount}
          detail={`${operations.exhaustedPackageCount} packages finished overall`}
          icon={<CalendarDays />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardDueSoonPanel
          items={operations.dueSoon}
          classes={classes.map((cls) => ({ id: cls.id, name: cls.name }))}
        />
        <DashboardInformedPanel items={operations.informed} />
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
