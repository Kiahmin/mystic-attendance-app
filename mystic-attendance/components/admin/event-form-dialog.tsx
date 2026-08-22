"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createEvent,
  updateEvent,
  type EventInput,
} from "@/lib/actions/sessions";
import type { Profile } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
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
  coach_id: string | null;
  requires_attendance: boolean;
};

type EventFormDialogProps = {
  coaches: Pick<Profile, "id" | "full_name">[];
  defaultDate: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
  event?: EventFormValues | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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

export function EventFormDialog({
  coaches,
  defaultDate,
  defaultStartTime,
  defaultEndTime,
  event,
  open: openProp,
  onOpenChange,
}: EventFormDialogProps) {
  const router = useRouter();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;
  const isEditing = Boolean(event);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [sessionDate, setSessionDate] = useState(defaultDate);
  const initialStart =
    toTimeInputValue(defaultStartTime) || DEFAULT_START_TIME;
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(
    toTimeInputValue(defaultEndTime) || addHoursToTime(initialStart, 1)
  );
  const [coachId, setCoachId] = useState("");
  const [requiresAttendance, setRequiresAttendance] = useState(true);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setName(event?.name ?? "");
    setSessionDate(event?.session_date ?? defaultDate);
    const start =
      toTimeInputValue(event?.start_time) ||
      toTimeInputValue(defaultStartTime) ||
      DEFAULT_START_TIME;
    setStartTime(start);
    setEndTime(
      toTimeInputValue(event?.end_time) ||
        toTimeInputValue(defaultEndTime) ||
        addHoursToTime(start, 1)
    );
    setCoachId(event?.coach_id ?? "");
    setRequiresAttendance(event?.requires_attendance ?? true);
  }, [
    open,
    defaultDate,
    defaultStartTime,
    defaultEndTime,
    event?.id,
    event?.name,
    event?.session_date,
    event?.start_time,
    event?.end_time,
    event?.coach_id,
    event?.requires_attendance,
  ]);

  function handleOpenChange(next: boolean) {
    if (!next) setError(null);
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  function handleStartTimeChange(value: string) {
    setStartTime(value);
    if (!isEditing) {
      setEndTime(addHoursToTime(value, 1));
    }
  }

  function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setError(null);

    const input: EventInput = {
      name,
      session_date: sessionDate,
      start_time: startTime,
      end_time: endTime,
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
      handleOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg" showCloseButton>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit event" : "Add event"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this one-off plan on the schedule."
              : "Add a one-off plan such as an event. It appears on the schedule immediately."}
          </DialogDescription>
        </DialogHeader>
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
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Date</Label>
            <Input
              id="event_date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
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
                onChange={setEndTime}
                required
                aria-label="End time"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_coach_id">Coach</Label>
            <Select
              value={coachId || "__none__"}
              onValueChange={(value) =>
                setCoachId(value === "__none__" ? "" : value)
              }
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
              onCheckedChange={setRequiresAttendance}
            />
          </Label>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
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
      </DialogContent>
    </Dialog>
  );
}
