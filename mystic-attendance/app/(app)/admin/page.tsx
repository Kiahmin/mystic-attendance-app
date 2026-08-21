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
  getSessionsForDashboardRange,
  getTodaySessionsForDashboard,
} from "@/lib/queries/sessions";
import { resolveCalendarRange, weekDatesContaining } from "@/lib/session-utils";
import { DashboardCalendar } from "@/components/admin/dashboard-calendar";
import { MetricCard } from "@/components/layout/metric-card";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    date?: string;
    week?: string;
    weekend?: string;
  }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const range = resolveCalendarRange(params);
  const today = todayInSingapore();
  const sessionStart = range.view === "month" ? range.start : range.monday;
  const sessionEnd =
    range.view === "month"
      ? range.end
      : weekDatesContaining(range.date).sunday;
  const todayInRange = today >= sessionStart && today <= sessionEnd;

  const [todayOnly, rangeSessions, coaches] = await Promise.all([
    todayInRange ? Promise.resolve(null) : getTodaySessionsForDashboard(),
    getSessionsForDashboardRange(sessionStart, sessionEnd),
    listCoaches(),
  ]);
  const todaySessions =
    todayOnly ??
    rangeSessions.filter((item) => item.session.session_date === today);

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
        description="Today's metrics and class schedule."
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

      <DashboardCalendar
        range={range}
        sessions={rangeSessions}
        coaches={coaches}
      />
    </div>
  );
}
