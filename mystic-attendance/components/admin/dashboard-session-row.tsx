"use client";

import { useState } from "react";
import Link from "next/link";
import { Ban, ChevronRight, ClipboardCheck, Users } from "lucide-react";
import type { DashboardSession } from "@/lib/types";
import {
  CANCELLATION_REASON_LABELS,
  formatDate,
  formatSessionTime,
} from "@/lib/attendance-utils";
import {
  getSessionScheduleStatus,
  SESSION_SCHEDULE_STATUS_LABELS,
  type SessionScheduleStatus,
} from "@/lib/session-utils";
import { CancelSessionDialog } from "@/components/admin/cancel-session-dialog";
import { SessionAttendeesDialog } from "@/components/admin/session-attendees-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardSessionRowProps = {
  item: DashboardSession;
};

function statusBadgeVariant(
  status: SessionScheduleStatus
): "destructive" | "warning" | "success" | "secondary" {
  switch (status) {
    case "cancelled":
      return "destructive";
    case "in_progress":
      return "warning";
    case "upcoming":
      return "success";
    case "completed":
      return "secondary";
  }
}

export function DashboardSessionRow({ item }: DashboardSessionRowProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const { session, expectedCount, checkedInCount, packageAlerts, coachName } =
    item;
  const classGroup = session.classes;
  const href = `/admin/sessions/${session.id}`;
  const status = getSessionScheduleStatus(session);
  const expected = expectedCount;
  const checkedIn = checkedInCount;
  const progress =
    expected > 0 ? Math.min(100, Math.round((checkedIn / expected) * 100)) : 0;

  return (
    <>
      <div
        className={cn(
          "grid gap-3 px-4 py-4 md:grid-cols-[1.2fr_0.7fr_0.8fr_0.8fr_0.8fr_0.9fr_auto] md:items-center md:gap-4",
          session.cancelled && "bg-destructive/5"
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "truncate font-medium",
              session.cancelled && "text-muted-foreground line-through"
            )}
          >
            {classGroup.name}
          </p>
          {session.cancelled && session.cancellation_reason ? (
            <p className="mt-0.5 text-xs text-destructive">
              {CANCELLATION_REASON_LABELS[session.cancellation_reason] ??
                session.cancellation_reason}
              {session.cancellation_note
                ? ` · ${session.cancellation_note}`
                : ""}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground md:hidden">
              {formatDate(session.session_date)} ·{" "}
              {formatSessionTime(classGroup.start_time)} –{" "}
              {formatSessionTime(classGroup.end_time)}
              {coachName ? ` · ${coachName}` : ""}
            </p>
          )}
        </div>

        <p
          className={cn(
            "hidden text-sm text-muted-foreground md:block",
            session.cancelled && "line-through"
          )}
        >
          {formatDate(session.session_date)}
        </p>

        <p
          className={cn(
            "hidden text-sm text-muted-foreground md:block",
            session.cancelled && "line-through"
          )}
        >
          {formatSessionTime(classGroup.start_time)} –{" "}
          {formatSessionTime(classGroup.end_time)}
        </p>

        <p className="hidden truncate text-sm text-muted-foreground md:block">
          {coachName ?? "Unassigned"}
        </p>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              {checkedIn}/{expected}
            </span>
            {expected > 0 ? <span>{progress}%</span> : null}
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                session.cancelled ? "bg-muted-foreground/40" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={statusBadgeVariant(status)}>
            {SESSION_SCHEDULE_STATUS_LABELS[status]}
          </Badge>
          {packageAlerts > 0 && !session.cancelled ? (
            <Badge variant="warning">
              {packageAlerts} alert{packageAlerts === 1 ? "" : "s"}
            </Badge>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" asChild title="Attendance">
            <Link href={href}>
              <ClipboardCheck className="size-4" />
              <span className="sr-only">Open attendance</span>
            </Link>
          </Button>
          {!session.cancelled ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title="Edit attendees"
              onClick={() => setAttendeesOpen(true)}
            >
              <Users className="size-4" />
              <span className="sr-only">Edit attendees</span>
            </Button>
          ) : null}
          {!session.cancelled ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title="Cancel session"
              onClick={() => setCancelOpen(true)}
            >
              <Ban className="size-4" />
              <span className="sr-only">Cancel session</span>
            </Button>
          ) : null}
          <Link
            href={href}
            className="hidden text-muted-foreground md:inline-flex"
            aria-hidden
            tabIndex={-1}
          >
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>

      <SessionAttendeesDialog
        sessionId={session.id}
        className={classGroup.name}
        open={attendeesOpen}
        onOpenChange={setAttendeesOpen}
      />

      <CancelSessionDialog
        sessionId={session.id}
        className={classGroup.name}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
    </>
  );
}
