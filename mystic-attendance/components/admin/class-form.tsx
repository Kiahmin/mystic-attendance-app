"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createClass,
  setClassActive,
  updateClass,
  type ClassInput,
} from "@/lib/actions/classes";
import type { ClassGroup, DayOfWeek, Profile, Venue } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DayPicker } from "@/components/ui/day-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import { VenueSelect } from "@/components/admin/venue-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ClassFormProps = {
  classGroup?: ClassGroup;
  coaches: Pick<Profile, "id" | "full_name">[];
  venues: Venue[];
  onSuccess?: (id: string) => void;
  submitLabel?: string;
};

const DEFAULT_START_TIME = "10:00";

function toTimeInputValue(time: string | undefined): string {
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

export function ClassForm({
  classGroup,
  coaches,
  venues: initialVenues,
  onSuccess,
  submitLabel,
}: ClassFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [venues, setVenues] = useState(initialVenues);

  const [name, setName] = useState(classGroup?.name ?? "");
  const [venueId, setVenueId] = useState(classGroup?.venue_id ?? "");
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(
    classGroup?.day_of_week ? [classGroup.day_of_week] : ["saturday"]
  );
  const [startTime, setStartTime] = useState(
    toTimeInputValue(classGroup?.start_time) || DEFAULT_START_TIME
  );
  const [endTime, setEndTime] = useState(
    toTimeInputValue(classGroup?.end_time) ||
      addHoursToTime(DEFAULT_START_TIME, 1)
  );
  const [coachId, setCoachId] = useState(classGroup?.coach_id ?? "");
  const [isActive, setIsActive] = useState(classGroup?.is_active ?? true);
  const isEditing = Boolean(classGroup);

  const hasChanges =
    !classGroup ||
    name !== classGroup.name ||
    venueId !== (classGroup.venue_id ?? "") ||
    daysOfWeek.length !== 1 ||
    daysOfWeek[0] !== classGroup.day_of_week ||
    startTime !== toTimeInputValue(classGroup.start_time) ||
    endTime !== toTimeInputValue(classGroup.end_time) ||
    (coachId || null) !== (classGroup.coach_id ?? null);

  function handleStartTimeChange(value: string) {
    setStartTime(value);
    if (!isEditing) {
      setEndTime(addHoursToTime(value, 1));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!venueId) {
      setError("Select a venue.");
      return;
    }

    const input: ClassInput = {
      name,
      venue_id: venueId,
      days_of_week: daysOfWeek,
      start_time: startTime,
      end_time: endTime,
      coach_id: coachId || null,
      is_active: isActive,
    };

    startTransition(async () => {
      if (classGroup) {
        const result = await updateClass(classGroup.id, input);
        if (result.error) {
          setError(result.error);
          return;
        }
        onSuccess?.(classGroup.id);
        router.push("/admin/classes");
        router.refresh();
        return;
      }

      const result = await createClass(input);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.id) {
        onSuccess?.(result.id);
        if ((result.ids?.length ?? 1) === 1) {
          router.push(`/admin/classes/${result.id}`);
        }
        router.refresh();
      }
    });
  }

  function handleToggleActive() {
    if (!classGroup) return;
    setError(null);
    const next = !isActive;
    startTransition(async () => {
      const result = await setClassActive(classGroup.id, next);
      if (result.error) {
        setError(result.error);
        return;
      }
      setIsActive(next);
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
        <Label htmlFor="class_name">Class name</Label>
        <Input
          id="class_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="class_venue">
          Venue <span className="text-destructive">*</span>
        </Label>
        <VenueSelect
          id="class_venue"
          venues={venues}
          value={venueId}
          onChange={setVenueId}
          onCreated={(venue) =>
            setVenues((current) =>
              current.some((item) => item.id === venue.id)
                ? current
                : [...current, venue]
            )
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="day_of_week">Day</Label>
        <DayPicker
          id="day_of_week"
          value={daysOfWeek}
          onChange={setDaysOfWeek}
          multiple={!isEditing}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_time">Start</Label>
          <TimePicker
            id="start_time"
            value={startTime}
            onChange={handleStartTimeChange}
            required
            aria-label="Start time"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">End</Label>
          <TimePicker
            id="end_time"
            value={endTime}
            onChange={setEndTime}
            required
            aria-label="End time"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coach_id">Coach</Label>
        <Select
          value={coachId || "__none__"}
          onValueChange={(value) =>
            setCoachId(value === "__none__" ? "" : value)
          }
        >
          <SelectTrigger id="coach_id" className="w-full">
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

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="submit"
          disabled={
            pending ||
            daysOfWeek.length === 0 ||
            !venueId ||
            (isEditing && !hasChanges)
          }
        >
          {pending
            ? isEditing
              ? "Saving…"
              : "Creating…"
            : (submitLabel ??
              (isEditing
                ? "Save changes"
                : daysOfWeek.length > 1
                  ? `Create ${daysOfWeek.length} classes`
                  : "Create class"))}
        </Button>
        {classGroup ? (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={handleToggleActive}
          >
            {isActive ? "Deactivate" : "Reactivate"}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
