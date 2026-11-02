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
import { DialogFooter } from "@/components/ui/dialog";
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
  defaultName?: string;
  defaultVenueId?: string;
  defaultDaysOfWeek?: DayOfWeek[];
  defaultStartTime?: string;
  defaultEndTime?: string;
  defaultCoachId?: string;
  /** When false, stay on the current page after creating a class. */
  redirectOnCreate?: boolean;
  /** Dialog actions with Cancel, used when this form is embedded in another dialog. */
  dialogActions?: boolean;
  onCancel?: () => void;
  onSharedChange?: (fields: {
    name: string;
    venueId: string;
    startTime: string;
    endTime: string;
    coachId: string;
  }) => void;
  onDaysOfWeekChange?: (days: DayOfWeek[]) => void;
  onVenueCreated?: (venue: Venue) => void;
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
  defaultName = "",
  defaultVenueId = "",
  defaultDaysOfWeek,
  defaultStartTime,
  defaultEndTime,
  defaultCoachId = "",
  redirectOnCreate = true,
  dialogActions = false,
  onCancel,
  onSharedChange,
  onDaysOfWeekChange,
  onVenueCreated,
}: ClassFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [venues, setVenues] = useState(initialVenues);

  const initialStart =
    toTimeInputValue(classGroup?.start_time) ||
    defaultStartTime ||
    DEFAULT_START_TIME;
  const [name, setName] = useState(classGroup?.name ?? defaultName);
  const [venueId, setVenueId] = useState(
    classGroup?.venue_id ?? defaultVenueId
  );
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(
    classGroup?.day_of_week
      ? [classGroup.day_of_week]
      : (defaultDaysOfWeek ?? ["saturday"])
  );
  const [startTime, setStartTime] = useState(initialStart);
  const [endTime, setEndTime] = useState(
    toTimeInputValue(classGroup?.end_time) ||
      defaultEndTime ||
      addHoursToTime(initialStart, 1)
  );
  const [coachId, setCoachId] = useState(
    classGroup?.coach_id ?? defaultCoachId
  );
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

  function emitShared(next: {
    name?: string;
    venueId?: string;
    startTime?: string;
    endTime?: string;
    coachId?: string;
  }) {
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
        if (redirectOnCreate && (result.ids?.length ?? 1) === 1) {
          router.push(`/admin/classes/${result.id}`);
        }
        router.refresh();
      }
    });
  }

  const submitText = pending
    ? isEditing
      ? "Saving…"
      : "Creating…"
    : (submitLabel ??
      (isEditing
        ? "Save changes"
        : daysOfWeek.length > 1
          ? `Create ${daysOfWeek.length} classes`
          : "Create class"));

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
          onChange={(e) => {
            setName(e.target.value);
            emitShared({ name: e.target.value });
          }}
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
        <Label htmlFor="day_of_week">Day</Label>
        <DayPicker
          id="day_of_week"
          value={daysOfWeek}
          onChange={(days) => {
            setDaysOfWeek(days);
            onDaysOfWeekChange?.(days);
          }}
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
        <Label htmlFor="coach_id">Coach</Label>
        <Select
          value={coachId || "__none__"}
          onValueChange={(value) => {
            const next = value === "__none__" ? "" : value;
            setCoachId(next);
            emitShared({ coachId: next });
          }}
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

      {dialogActions ? (
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              pending ||
              daysOfWeek.length === 0 ||
              !venueId ||
              (isEditing && !hasChanges)
            }
          >
            {submitText}
          </Button>
        </DialogFooter>
      ) : (
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
            {submitText}
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
      )}
    </form>
  );
}
