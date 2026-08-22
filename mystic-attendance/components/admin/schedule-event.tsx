"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, ClipboardCheck, Pencil, Trash2, UserRound, Users } from "lucide-react";
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
  sessionDisplayName,
  sessionDisplayStart,
  SESSION_SCHEDULE_STATUS_LABELS,
  type CalendarView,
  type SessionScheduleStatus,
} from "@/lib/session-utils";
import { CancelSessionDialog } from "@/components/admin/cancel-session-dialog";
import { DeleteEventDialog } from "@/components/admin/delete-event-dialog";
import { EditSessionCoachDialog } from "@/components/admin/edit-session-coach-dialog";
import { EventFormDialog } from "@/components/admin/event-form-dialog";
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

function eventTone(status: SessionScheduleStatus, isEvent: boolean) {
  if (isEvent && status !== "cancelled") {
    if (status === "in_progress") {
      return "border-l-warning bg-warning/15 text-warning hover:bg-warning/20";
    }
    if (status === "completed") {
      return "border-l-chart-3/70 bg-chart-3/10 text-muted-foreground hover:bg-chart-3/15";
    }
    return "border-l-chart-3 bg-chart-3/20 text-foreground hover:bg-chart-3/25";
  }

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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const router = useRouter();
  const { session, expectedCount, checkedInCount, coachName } = item;
  const displayName = sessionDisplayName(session);
  const isEvent = session.kind === "event";
  const takesAttendance = session.requires_attendance !== false;
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
            data-schedule-event
            style={style}
            title={`${displayName} · ${timeLabel}`}
            className={cn(
              "overflow-hidden border-l-4 text-left shadow-sm transition-colors",
              eventTone(status, isEvent),
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
                  {displayName}
                </span>
              </>
            ) : (
              <>
                <p className="truncate font-semibold">{displayName}</p>
                <p className="truncate opacity-80">{timeLabel}</p>
                {coachName ? (
                  <p className="truncate opacity-80">{coachName}</p>
                ) : null}
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-80 p-4"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
        >
          <div className="space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <p
                  className={cn(
                    "font-heading text-base font-semibold",
                    session.cancelled && "text-muted-foreground line-through"
                  )}
                >
                  {displayName}
                </p>
                {isEvent ? <Badge variant="outline">Event</Badge> : null}
              </div>
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
              {takesAttendance ? (
                <p className="text-sm text-muted-foreground">
                  {checkedInCount}/{expectedCount} checked in
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No attendance
                </p>
              )}
              <Badge variant={statusBadgeVariant(status)}>
                {SESSION_SCHEDULE_STATUS_LABELS[status]}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-1 border-t border-border/60 pt-3">
              {isEvent ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title="Edit event"
                  onClick={() => openDialog(setEditOpen)}
                >
                  <Pencil className="size-4" />
                  <span className="sr-only">Edit event</span>
                </Button>
              ) : null}
              {takesAttendance ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  title="Attendance"
                  onClick={() => {
                    setPopoverOpen(false);
                    router.push(href);
                  }}
                >
                  <ClipboardCheck className="size-4" />
                  Attendance
                </Button>
              ) : null}
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
              {takesAttendance && !session.cancelled ? (
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
                  title="Cancel"
                  onClick={() => openDialog(setCancelOpen)}
                >
                  <Ban className="size-4" />
                  <span className="sr-only">Cancel</span>
                </Button>
              ) : null}
              {isEvent && !takesAttendance ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  title="Delete event"
                  onClick={() => openDialog(setDeleteOpen)}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete event</span>
                </Button>
              ) : null}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <EditSessionCoachDialog
        sessionId={session.id}
        className={displayName}
        coachId={session.coach_id}
        coaches={coaches}
        open={coachOpen}
        onOpenChange={setCoachOpen}
      />
      {takesAttendance ? (
        <SessionAttendeesDialog
          sessionId={session.id}
          className={displayName}
          open={attendeesOpen}
          onOpenChange={setAttendeesOpen}
        />
      ) : null}
      <CancelSessionDialog
        sessionId={session.id}
        className={displayName}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
      {isEvent ? (
        <>
          <EventFormDialog
            coaches={coaches}
            defaultDate={session.session_date}
            event={{
              id: session.id,
              name: displayName,
              session_date: session.session_date,
              start_time: session.start_time,
              end_time: session.end_time,
              coach_id: session.coach_id,
              requires_attendance: takesAttendance,
            }}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          {!takesAttendance ? (
            <DeleteEventDialog
              sessionId={session.id}
              name={displayName}
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
            />
          ) : null}
        </>
      ) : null}
    </>
  );
}
