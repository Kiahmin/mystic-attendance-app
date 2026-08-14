import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/profile";
import { getSessionCheckInList } from "@/lib/queries/sessions";
import { SessionAttendanceView } from "@/components/sessions/session-attendance-view";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSessionPage({ params }: SessionPageProps) {
  const { id } = await params;
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

  return (
    <SessionAttendanceView
      session={session}
      students={students}
      walkIns={walkIns}
      backHref="/admin"
      backLabel="Dashboard"
    />
  );
}
