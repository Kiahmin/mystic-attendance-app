import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/profile";
import { getSessionCheckInList } from "@/lib/queries/sessions";
import {
  formatDate,
  formatSessionTime,
  CANCELLATION_REASON_LABELS,
} from "@/lib/attendance-utils";
import { AttendancePanel } from "@/components/coach/attendance-panel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SessionPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function CoachSessionPage({ params }: SessionPageProps) {
  const { sessionId } = await params;
  const profile = await requireRole(["coach", "admin"]);

  let data;
  try {
    data = await getSessionCheckInList(sessionId);
  } catch {
    notFound();
  }

  const { session, students, walkIns } = data;
  const { classes: classGroup } = session;

  if (
    profile.role === "coach" &&
    classGroup.coach_id &&
    classGroup.coach_id !== profile.id
  ) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <Button asChild variant="ghost" size="icon-sm" className="mt-0.5 shrink-0">
          <Link href="/coach" aria-label="Back to sessions">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {classGroup.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {formatDate(session.session_date)} ·{" "}
            {formatSessionTime(classGroup.start_time)} –{" "}
            {formatSessionTime(classGroup.end_time)}
          </p>
        </div>
      </div>

      {session.cancelled ? (
        <Alert variant="destructive">
          <AlertTitle>Session cancelled</AlertTitle>
          <AlertDescription>
            {session.cancellation_reason
              ? CANCELLATION_REASON_LABELS[session.cancellation_reason] ??
                session.cancellation_reason
              : "No credits will be deducted for this session."}
            {session.cancellation_note
              ? ` — ${session.cancellation_note}`
              : ""}
          </AlertDescription>
        </Alert>
      ) : null}

      <AttendancePanel
        sessionId={session.id}
        cancelled={session.cancelled}
        enrolledStudents={students}
        walkIns={walkIns}
      />
    </div>
  );
}
