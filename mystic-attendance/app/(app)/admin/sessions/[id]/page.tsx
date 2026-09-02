import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/profile";
import { getSessionCheckInList } from "@/lib/queries/sessions";
import { adminCalendarHref, parseCalendarView } from "@/lib/session-utils";
import { SessionAttendanceView } from "@/components/sessions/session-attendance-view";

interface SessionPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    week?: string;
    weekend?: string;
    view?: string;
    date?: string;
  }>;
}

export default async function AdminSessionPage({
  params,
  searchParams,
}: SessionPageProps) {
  const { id } = await params;
  const { week, weekend, view, date } = await searchParams;
  await requireRole(["admin"]);

  let data;
  try {
    data = await getSessionCheckInList(id);
  } catch (error) {
    if (error instanceof Error && error.message === "Session not found") {
      notFound();
    }
    throw error;
  }

  const { session, students, walkIns } = data;
  const backDate = date ?? week ?? weekend ?? session.session_date;

  return (
    <SessionAttendanceView
      session={session}
      students={students}
      walkIns={walkIns}
      backHref={adminCalendarHref({
        view: parseCalendarView(view),
        date: backDate,
      })}
      backLabel="Back"
    />
  );
}
