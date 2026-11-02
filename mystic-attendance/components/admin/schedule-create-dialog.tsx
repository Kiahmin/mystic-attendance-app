"use client";

import { useState } from "react";
import { ClassForm } from "@/components/admin/class-form";
import { EventForm } from "@/components/admin/event-form-dialog";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dayOfWeekForDate } from "@/lib/session-utils";
import type { DayOfWeek, Profile, Venue } from "@/lib/types";
import { cn } from "@/lib/utils";

const KINDS = ["class", "event"] as const;

type ScheduleKind = (typeof KINDS)[number];

const KIND_LABELS: Record<ScheduleKind, string> = {
  class: "Class",
  event: "Event",
};

export type ScheduleCreateDraft = {
  date: string;
  startTime: string;
  endTime: string;
  venueId: string;
};

type SharedFields = {
  name: string;
  venueId: string;
  startTime: string;
  endTime: string;
  coachId: string;
};

type ScheduleCreateDialogProps = {
  coaches: Pick<Profile, "id" | "full_name">[];
  venues: Venue[];
  draft: ScheduleCreateDraft | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function mergeVenues(base: Venue[], extra: Venue[]): Venue[] {
  const seen = new Set(base.map((venue) => venue.id));
  return [...base, ...extra.filter((venue) => !seen.has(venue.id))];
}

function sharedFromDraft(draft: ScheduleCreateDraft): SharedFields {
  return {
    name: "",
    venueId: draft.venueId,
    startTime: draft.startTime,
    endTime: draft.endTime,
    coachId: "",
  };
}

function daysFromDate(date: string): DayOfWeek[] {
  const weekday = dayOfWeekForDate(date);
  return weekday ? [weekday] : ["saturday"];
}

export function ScheduleCreateDialog({
  coaches,
  venues,
  draft,
  open,
  onOpenChange,
}: ScheduleCreateDialogProps) {
  const [kind, setKind] = useState<ScheduleKind>("event");
  const [sessionKey, setSessionKey] = useState(0);
  const [prevOpen, setPrevOpen] = useState(open);
  const [shared, setShared] = useState<SharedFields | null>(null);
  const [sessionDate, setSessionDate] = useState(draft?.date ?? "");
  const [requiresAttendance, setRequiresAttendance] = useState(true);
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(
    draft ? daysFromDate(draft.date) : ["saturday"]
  );
  const [createdVenues, setCreatedVenues] = useState<Venue[]>([]);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open && draft) {
      setSessionKey((current) => current + 1);
      setKind("event");
      setShared(sharedFromDraft(draft));
      setSessionDate(draft.date);
      setRequiresAttendance(true);
      setDaysOfWeek(daysFromDate(draft.date));
    }
  }

  const fields = shared ?? (draft ? sharedFromDraft(draft) : null);
  const venueOptions = mergeVenues(venues, createdVenues);

  function addVenue(venue: Venue) {
    setCreatedVenues((current) =>
      current.some((item) => item.id === venue.id) ? current : [...current, venue]
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>Add to schedule</DialogTitle>
          <div
            role="group"
            aria-label="What to add"
            className="inline-flex h-8 w-fit items-stretch rounded-lg bg-muted p-[3px]"
          >
            {KINDS.map((nextKind) => (
              <button
                key={nextKind}
                type="button"
                aria-pressed={kind === nextKind}
                onClick={() => setKind(nextKind)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-full px-2.5",
                  kind === nextKind &&
                    "bg-background text-foreground shadow-sm hover:bg-background"
                )}
              >
                {KIND_LABELS[nextKind]}
              </button>
            ))}
          </div>
          <DialogDescription>
            {kind === "event"
              ? "Add a one-off plan such as an event."
              : "Select multiple days to create a class for each day."}
          </DialogDescription>
        </DialogHeader>
        {open && fields ? (
          kind === "event" ? (
            <EventForm
              key={`${sessionKey}-event`}
              coaches={coaches}
              venues={venueOptions}
              defaultDate={sessionDate}
              defaultStartTime={fields.startTime}
              defaultEndTime={fields.endTime}
              defaultName={fields.name}
              defaultVenueId={fields.venueId}
              defaultCoachId={fields.coachId}
              defaultRequiresAttendance={requiresAttendance}
              onSharedChange={setShared}
              onDateChange={setSessionDate}
              onRequiresAttendanceChange={setRequiresAttendance}
              onVenueCreated={addVenue}
              onCancel={() => onOpenChange(false)}
              onSuccess={() => onOpenChange(false)}
            />
          ) : (
            <ClassForm
              key={`${sessionKey}-class`}
              coaches={coaches}
              venues={venueOptions}
              defaultName={fields.name}
              defaultVenueId={fields.venueId}
              defaultDaysOfWeek={daysOfWeek}
              defaultStartTime={fields.startTime}
              defaultEndTime={fields.endTime}
              defaultCoachId={fields.coachId}
              redirectOnCreate={false}
              dialogActions
              onCancel={() => onOpenChange(false)}
              onSharedChange={setShared}
              onDaysOfWeekChange={setDaysOfWeek}
              onVenueCreated={addVenue}
              onSuccess={() => onOpenChange(false)}
            />
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
