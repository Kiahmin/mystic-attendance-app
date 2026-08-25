import { requireRole } from "@/lib/auth/profile";
import { listCoaches } from "@/lib/queries/profiles";
import { getSessionsForDashboardRange } from "@/lib/queries/sessions";
import { resolveCalendarRange, weekDatesContaining } from "@/lib/session-utils";
import { DashboardCalendar } from "@/components/admin/dashboard-calendar";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminSchedulePage({
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
  const sessionStart = range.view === "month" ? range.start : range.monday;
  const sessionEnd =
    range.view === "month"
      ? range.end
      : weekDatesContaining(range.date).sunday;

  const [sessions, coaches] = await Promise.all([
    getSessionsForDashboardRange(sessionStart, sessionEnd),
    listCoaches(),
  ]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 md:gap-6">
      <PageHeader
        className="shrink-0"
        title="Schedule"
        description="Class timetable, events, and session generation."
        className="shrink-0"
      />
      <DashboardCalendar range={range} sessions={sessions} coaches={coaches} />
    </div>
  );
}
