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
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <div className="space-y-5">
      <Link
        href="/coach"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 w-fit"
        )}
      >
        <ArrowLeft className="size-4" />
        Sessions
      </Link>

      <Card className="rounded-xl">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <CardTitle className="font-heading text-2xl leading-tight">
              {classGroup.name}
            </CardTitle>
            <Badge variant="default">Coach session</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(session.session_date)} ·{" "}
            {formatSessionTime(classGroup.start_time)} –{" "}
            {formatSessionTime(classGroup.end_time)}
          </p>
        </CardHeader>
        {session.cancelled ? (
          <CardContent>
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
          </CardContent>
        ) : null}
      </Card>

      <AttendancePanel
        sessionId={session.id}
        cancelled={session.cancelled}
        enrolledStudents={students}
        walkIns={walkIns}
      />
    </div>
  );
}
