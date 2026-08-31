import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/profile";
import { isAdminRole } from "@/lib/auth/roles";
import { getSessionCheckInList } from "@/lib/queries/sessions";
import { adminCalendarHref } from "@/lib/session-utils";
import { SessionAttendanceView } from "@/components/sessions/session-attendance-view";

interface SessionPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function CoachSessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;
  const profile = await requireRole(["coach", "admin"]);

  let data;
  try {
    data = await getSessionCheckInList(sessionId);
  } catch (error) {
    if (error instanceof Error && error.message === "Session not found") {
      notFound();
    }
    throw error;
  }

  const { session, students, walkIns } = data;

  if (session.coach_id && session.coach_id !== profile.id) {
    notFound();
  }

  return (
    <SessionAttendanceView
      session={session}
      students={students}
      walkIns={walkIns}
      backHref={
        isAdminRole(profile.role)
          ? adminCalendarHref({
              view: "day",
              date: session.session_date,
            })
          : "/coach"
      }
      backLabel="Back"
      badgeLabel="Coach session"
    />
  );
}
