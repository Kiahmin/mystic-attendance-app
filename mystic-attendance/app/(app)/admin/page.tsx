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
import { listCoaches } from "@/lib/queries/profiles";
import {
  getSessionsForDashboardRange,
  getTodaySessionsForDashboard,
} from "@/lib/queries/sessions";
import { countInactiveStudents } from "@/lib/queries/students";
import { resolveCalendarRange, weekDatesContaining } from "@/lib/session-utils";
import { DashboardCalendar } from "@/components/admin/dashboard-calendar";
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
    view?: string;
    date?: string;
    week?: string;
    weekend?: string;
    reportMonth?: string;
  }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const range = resolveCalendarRange(params);
  const today = todayInSingapore();
  const reportMonth = parseReportMonth(params.reportMonth, today);
  const thisWeek = weekDatesContaining(today);
  const sessionStart = range.view === "month" ? range.start : range.monday;
  const sessionEnd =
    range.view === "month"
      ? range.end
      : weekDatesContaining(range.date).sunday;
  const todayInRange = today >= sessionStart && today <= sessionEnd;
  const weekInRange =
    thisWeek.monday >= sessionStart && thisWeek.sunday <= sessionEnd;

  const [
    todayOnly,
    weekOnly,
    rangeSessions,
    coaches,
    inactiveCount,
    operations,
    classes,
  ] = await Promise.all([
    todayInRange ? Promise.resolve(null) : getTodaySessionsForDashboard(),
    weekInRange
      ? Promise.resolve(null)
      : getSessionsForDashboardRange(thisWeek.monday, thisWeek.sunday),
    getSessionsForDashboardRange(sessionStart, sessionEnd),
    listCoaches(),
    countInactiveStudents(),
    getDashboardOperations(reportMonth),
    listClasses({ activeOnly: true }),
  ]);
  const todaySessions =
    todayOnly ??
    rangeSessions.filter((item) => item.session.session_date === today);
  const weekSessions =
    weekOnly ??
    rangeSessions.filter(
      (item) =>
        item.session.session_date >= thisWeek.monday &&
        item.session.session_date <= thisWeek.sunday
    );

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
        description="Today's metrics and class schedule."
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

      <DashboardCalendar
        range={range}
        sessions={rangeSessions}
        coaches={coaches}
      />
    </div>
  );
}
