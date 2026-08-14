import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/profile";
import { getSessionCheckInList } from "@/lib/queries/sessions";
import { SessionAttendanceView } from "@/components/sessions/session-attendance-view";

interface SessionPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function CoachSessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;
  const profile = await requireRole(["coach", "admin"]);

  if (profile.role === "admin") {
    redirect(`/admin/sessions/${sessionId}`);
  }

  let data;
  try {
    data = await getSessionCheckInList(sessionId);
  } catch {
    notFound();
  }

  const { session, students, walkIns } = data;
  const { classes: classGroup } = session;

  if (classGroup.coach_id && classGroup.coach_id !== profile.id) {
    notFound();
  }

  return (
    <SessionAttendanceView
      session={session}
      students={students}
      walkIns={walkIns}
      backHref="/coach"
      backLabel="Sessions"
      badgeLabel="Coach session"
    />
  );
}
