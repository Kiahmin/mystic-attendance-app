"use client";

import { useState } from "react";
import Link from "next/link";
import { Ban, ClipboardCheck, UserRound, Users } from "lucide-react";
import type { DashboardSession, Profile } from "@/lib/types";
import {
  CANCELLATION_REASON_LABELS,
  formatDate,
  formatSessionTime,
} from "@/lib/attendance-utils";
import {
  adminSessionHref,
  getSessionScheduleStatus,
  sessionDisplayEnd,
  sessionDisplayStart,
  SESSION_SCHEDULE_STATUS_LABELS,
  type CalendarView,
  type SessionScheduleStatus,
} from "@/lib/session-utils";
import { CancelSessionDialog } from "@/components/admin/cancel-session-dialog";
import { EditSessionCoachDialog } from "@/components/admin/edit-session-coach-dialog";
import { SessionAttendeesDialog } from "@/components/admin/session-attendees-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ScheduleEventProps = {
  item: DashboardSession;
  coaches: Pick<Profile, "id" | "full_name">[];
  view: CalendarView;
  date: string;
  variant: "block" | "chip";
  style?: React.CSSProperties;
  className?: string;
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

function eventTone(status: SessionScheduleStatus) {
  switch (status) {
    case "cancelled":
      return "border-l-destructive bg-destructive/10 text-destructive hover:bg-destructive/15";
    case "in_progress":
      return "border-l-warning bg-warning/15 text-warning hover:bg-warning/20";
    case "upcoming":
      return "border-l-primary bg-primary/15 text-primary hover:bg-primary/20";
    case "completed":
      return "border-l-muted-foreground/50 bg-muted text-muted-foreground hover:bg-muted/80";
  }
}

export function ScheduleEvent({
  item,
  coaches,
  view,
  date,
  variant,
  style,
  className,
}: ScheduleEventProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [attendeesOpen, setAttendeesOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const { session, expectedCount, checkedInCount, coachName } = item;
  const classGroup = session.classes;
  const startTime = sessionDisplayStart(session);
  const endTime = sessionDisplayEnd(session);
  const status = getSessionScheduleStatus(session);
  const href = adminSessionHref(session.id, { view, date });
  const timeLabel = `${formatSessionTime(startTime)} – ${formatSessionTime(endTime)}`;

  function openDialog(setter: (open: boolean) => void) {
    setPopoverOpen(false);
    setter(true);
  }

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            style={style}
            title={`${classGroup.name} · ${timeLabel}`}
            className={cn(
              "overflow-hidden border-l-4 text-left shadow-sm transition-colors",
              eventTone(status),
              session.cancelled && "line-through",
              variant === "block" &&
                "absolute rounded-md px-1.5 py-0.5 text-[11px] leading-tight",
              variant === "chip" &&
                "flex w-full items-center gap-1 rounded px-1 py-0.5 text-[11px] leading-tight",
              className
            )}
          >
            {variant === "chip" ? (
              <>
                <span className="shrink-0 font-medium">
                  {formatSessionTime(startTime)}
                </span>
                <span className="min-w-0 truncate font-semibold">
                  {classGroup.name}
                </span>
              </>
            ) : (
              <>
                <p className="truncate font-semibold">{classGroup.name}</p>
                <p className="truncate opacity-80">{timeLabel}</p>
                {coachName ? (
                  <p className="truncate opacity-80">{coachName}</p>
                ) : null}
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-4">
          <div className="space-y-3">
            <div>
              <p
                className={cn(
                  "font-heading text-base font-semibold",
                  session.cancelled && "text-muted-foreground line-through"
                )}
              >
                {classGroup.name}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(session.session_date)}
                <br />
                {timeLabel}
              </p>
              <p className="text-sm text-muted-foreground">
                {coachName ?? "Unassigned"}
              </p>
            </div>

            {session.cancelled && session.cancellation_reason ? (
              <p className="text-xs text-destructive">
                {CANCELLATION_REASON_LABELS[session.cancellation_reason] ??
                  session.cancellation_reason}
                {session.cancellation_note
                  ? ` · ${session.cancellation_note}`
                  : ""}
              </p>
            ) : null}

            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-muted-foreground">
                {checkedInCount}/{expectedCount} checked in
              </p>
              <Badge variant={statusBadgeVariant(status)}>
                {SESSION_SCHEDULE_STATUS_LABELS[status]}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-1 border-t border-border/60 pt-3">
              <Button variant="ghost" size="sm" asChild title="Attendance">
                <Link href={href}>
                  <ClipboardCheck className="size-4" />
                  Attendance
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                title="Change coach"
                onClick={() => openDialog(setCoachOpen)}
              >
                <UserRound className="size-4" />
                <span className="sr-only">Change coach</span>
              </Button>
              {!session.cancelled ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title="Edit attendees"
                  onClick={() => openDialog(setAttendeesOpen)}
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
                  onClick={() => openDialog(setCancelOpen)}
                >
                  <Ban className="size-4" />
                  <span className="sr-only">Cancel session</span>
                </Button>
              ) : null}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <EditSessionCoachDialog
        sessionId={session.id}
        className={classGroup.name}
        coachId={session.coach_id}
        coaches={coaches}
        open={coachOpen}
        onOpenChange={setCoachOpen}
      />
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
