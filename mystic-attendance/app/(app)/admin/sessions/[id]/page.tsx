import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/profile";
import { getSessionCheckInList } from "@/lib/queries/sessions";
import { adminWeekHref, resolveWeekDates } from "@/lib/session-utils";
import { SessionAttendanceView } from "@/components/sessions/session-attendance-view";

interface SessionPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ week?: string; weekend?: string }>;
}

export default async function AdminSessionPage({
  params,
  searchParams,
}: SessionPageProps) {
  const { id } = await params;
  const { week, weekend } = await searchParams;
  const profile = await requireRole(["admin", "coach"]);

  if (profile.role === "coach") {
    redirect(`/coach/sessions/${id}`);
  }

  let data;
  try {
    data = await getSessionCheckInList(id);
  } catch {
    notFound();
  }

  const { session, students, walkIns } = data;
  const { monday } = resolveWeekDates(
    week ?? weekend ?? session.session_date
  );

  return (
    <SessionAttendanceView
      session={session}
      students={students}
      walkIns={walkIns}
      backHref={adminWeekHref(monday)}
      backLabel="Dashboard"
    />
  );
}
