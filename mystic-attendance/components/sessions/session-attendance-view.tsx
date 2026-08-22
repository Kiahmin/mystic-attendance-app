import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  formatDate,
  formatSessionTime,
  CANCELLATION_REASON_LABELS,
} from "@/lib/attendance-utils";
import type { CheckInStudent, SessionWithClass } from "@/lib/types";
import {
  sessionDisplayEnd,
  sessionDisplayName,
  sessionDisplayStart,
} from "@/lib/session-utils";
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

interface SessionAttendanceViewProps {
  session: SessionWithClass;
  students: CheckInStudent[];
  walkIns: CheckInStudent[];
  backHref: string;
  backLabel: string;
  badgeLabel?: string;
}

export function SessionAttendanceView({
  session,
  students,
  walkIns,
  backHref,
  backLabel,
  badgeLabel,
}: SessionAttendanceViewProps) {
  const displayName = sessionDisplayName(session);
  const takesAttendance = session.requires_attendance !== false;
  const eventBadge = session.kind === "event" ? "Event" : badgeLabel;

  return (
    <div className="space-y-5">
      <Link
        href={backHref}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 w-fit"
        )}
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </Link>

      <Card className="rounded-xl">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <CardTitle className="font-heading text-2xl leading-tight">
              {displayName}
            </CardTitle>
            {eventBadge ? <Badge variant="default">{eventBadge}</Badge> : null}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(session.session_date)} ·{" "}
            {formatSessionTime(sessionDisplayStart(session))} –{" "}
            {formatSessionTime(sessionDisplayEnd(session))}
            {session.coach?.full_name
              ? ` · ${session.coach.full_name}`
              : ""}
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
        ) : !takesAttendance ? (
          <CardContent>
            <Alert>
              <AlertTitle>Attendance is not taken</AlertTitle>
              <AlertDescription>
                This event does not require check-in.
              </AlertDescription>
            </Alert>
          </CardContent>
        ) : null}
      </Card>

      {takesAttendance ? (
        <AttendancePanel
          sessionId={session.id}
          cancelled={session.cancelled}
          enrolledStudents={students}
          walkIns={walkIns}
          emptyRosterMessage={
            session.kind === "event"
              ? "This event has no students yet. Use Add student to build the roster, then mark attendance."
              : undefined
          }
        />
      ) : null}
    </div>
  );
}
