"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createEvent,
  updateEvent,
  type EventInput,
} from "@/lib/actions/sessions";
import type { Profile, Venue } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import { VenueSelect } from "@/components/admin/venue-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_START_TIME = "10:00";

export type EventFormValues = {
  id: string;
  name: string;
  session_date: string;
  start_time: string | null;
  end_time: string | null;
  venue_id: string | null;
  coach_id: string | null;
  requires_attendance: boolean;
};

type EventFormDialogProps = {
  coaches: Pick<Profile, "id" | "full_name">[];
  venues: Venue[];
  defaultDate: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  event?: EventFormValues | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type ScheduleSharedFields = {
  name: string;
  venueId: string;
  startTime: string;
  endTime: string;
  coachId: string;
};

type EventFormProps = {
  coaches: Pick<Profile, "id" | "full_name">[];
  venues: Venue[];
  defaultDate: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  defaultName?: string;
  defaultVenueId?: string;
  defaultCoachId?: string;
  defaultRequiresAttendance?: boolean;
  event?: EventFormValues | null;
  onCancel: () => void;
  onSuccess?: () => void;
  onSharedChange?: (fields: ScheduleSharedFields) => void;
  onDateChange?: (date: string) => void;
  onRequiresAttendanceChange?: (required: boolean) => void;
  onVenueCreated?: (venue: Venue) => void;
};

function toTimeInputValue(time: string | null | undefined): string {
  if (!time) return "";
  return time.slice(0, 5);
}

function addHoursToTime(time: string, hours: number): string {
  const [hourPart, minutePart] = time.split(":");
  const hoursNum = Number(hourPart);
  const minutesNum = Number(minutePart);
  if (
    hourPart === undefined ||
    minutePart === undefined ||
    Number.isNaN(hoursNum) ||
    Number.isNaN(minutesNum)
  ) {
    return "";
  }

  const totalMinutes = Math.min(
    hoursNum * 60 + minutesNum + hours * 60,
    23 * 60 + 59
  );
  const nextHours = Math.floor(totalMinutes / 60);
  const nextMinutes = totalMinutes % 60;
  return `${String(nextHours).padStart(2, "0")}:${String(nextMinutes).padStart(2, "0")}`;
}

export function EventForm({
  coaches,
  venues: initialVenues,
  defaultDate,
  defaultStartTime,
  defaultEndTime,
  defaultName = "",
  defaultVenueId = "",
  defaultCoachId = "",
  defaultRequiresAttendance = true,
  event,
  onCancel,
  onSuccess,
  onSharedChange,
  onDateChange,
  onRequiresAttendanceChange,
  onVenueCreated,
}: EventFormProps) {
  const router = useRouter();
  const isEditing = Boolean(event);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(event?.name ?? defaultName);
  const [sessionDate, setSessionDate] = useState(
    event?.session_date ?? defaultDate
  );
  const initialStart =
    toTimeInputValue(event?.start_time) ||
    toTimeInputValue(defaultStartTime) ||
    DEFAULT_START_TIME;
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(
    toTimeInputValue(event?.end_time) ||
      toTimeInputValue(defaultEndTime) ||
      addHoursToTime(initialStart, 1)
  );
  const [coachId, setCoachId] = useState(event?.coach_id ?? defaultCoachId);
  const [venueId, setVenueId] = useState(event?.venue_id ?? defaultVenueId);
  const [venues, setVenues] = useState(initialVenues);
  const [requiresAttendance, setRequiresAttendance] = useState(
    event?.requires_attendance ?? defaultRequiresAttendance
  );

  function emitShared(next: Partial<ScheduleSharedFields>) {
    onSharedChange?.({
      name,
      venueId,
      startTime,
      endTime,
      coachId,
      ...next,
    });
  }

  function handleStartTimeChange(value: string) {
    const nextEnd = isEditing ? endTime : addHoursToTime(value, 1);
    setStartTime(value);
    if (!isEditing) setEndTime(nextEnd);
    emitShared({ startTime: value, endTime: nextEnd });
  }

  function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setError(null);
    if (!venueId) {
      setError("Select a venue.");
      return;
    }

    const input: EventInput = {
      name,
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
      venue_id: venueId,
      coach_id: coachId || null,
      requires_attendance: requiresAttendance,
    };

    startTransition(async () => {
      const result = event
        ? await updateEvent(event.id, input)
        : await createEvent(input);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      onSuccess?.();
      router.refresh();
    });
  }

  return (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="event_name">Name</Label>
            <Input
              id="event_name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                emitShared({ name: e.target.value });
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Date</Label>
            <Input
              id="event_date"
              type="date"
              value={sessionDate}
              onChange={(e) => {
                setSessionDate(e.target.value);
                onDateChange?.(e.target.value);
              }}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event_start_time">Start</Label>
              <TimePicker
                id="event_start_time"
                value={startTime}
                onChange={handleStartTimeChange}
                required
                aria-label="Start time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_end_time">End</Label>
              <TimePicker
                id="event_end_time"
              value={endTime}
              onChange={(value) => {
                setEndTime(value);
                emitShared({ endTime: value });
              }}
                required
                aria-label="End time"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_venue">
              Venue <span className="text-destructive">*</span>
            </Label>
            <VenueSelect
              id="event_venue"
              venues={venues}
              value={venueId}
              onChange={(value) => {
                setVenueId(value);
                emitShared({ venueId: value });
              }}
              onCreated={(venue) => {
                setVenues((current) =>
                  current.some((item) => item.id === venue.id)
                    ? current
                    : [...current, venue]
                );
                onVenueCreated?.(venue);
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_coach_id">Coach</Label>
            <Select
              value={coachId || "__none__"}
              onValueChange={(value) => {
                const next = value === "__none__" ? "" : value;
                setCoachId(next);
                emitShared({ coachId: next });
              }}
            >
              <SelectTrigger id="event_coach_id" className="w-full">
                <SelectValue placeholder="Assign a coach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No coach</SelectItem>
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Label
            htmlFor="event_requires_attendance"
            className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
          >
            <span className="text-sm font-medium">Take attendance</span>
            <Switch
              id="event_requires_attendance"
              checked={requiresAttendance}
              onCheckedChange={(checked) => {
                setRequiresAttendance(checked);
                onRequiresAttendanceChange?.(checked);
              }}
            />
          </Label>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={pending}
            >
              Cancel
            </Button>
              <Button type="submit" disabled={pending || !venueId}>
              {pending
                ? isEditing
                  ? "Saving…"
                  : "Adding…"
                : isEditing
                  ? "Save event"
                  : "Add event"}
            </Button>
          </DialogFooter>
        </form>
  );
}

export function EventFormDialog({
  coaches,
  venues,
  defaultDate,
  defaultStartTime,
  defaultEndTime,
  event,
  open: openProp,
  onOpenChange,
}: EventFormDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const isEditing = Boolean(event);

  function handleOpenChange(next: boolean) {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit event" : "Add event"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this one-off plan on the schedule."
              : "Add a one-off plan such as an event."}
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <EventForm
            key={event?.id ?? `${defaultDate}-${defaultStartTime ?? ""}-${defaultEndTime ?? ""}`}
            coaches={coaches}
            venues={venues}
            defaultDate={defaultDate}
            defaultStartTime={defaultStartTime}
            defaultEndTime={defaultEndTime}
            event={event}
            onCancel={() => handleOpenChange(false)}
            onSuccess={() => handleOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
