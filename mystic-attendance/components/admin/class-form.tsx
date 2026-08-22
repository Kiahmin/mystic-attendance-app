"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createClass,
  setClassActive,
  updateClass,
  type ClassInput,
} from "@/lib/actions/classes";
import {
  DAY_OF_WEEK_LABELS,
  DAYS_OF_WEEK,
} from "@/lib/admin-utils";
import type { ClassGroup, DayOfWeek, Profile } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  onSuccess,
  submitLabel,
}: ClassFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(classGroup?.name ?? "");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(
    classGroup?.day_of_week ?? "saturday"
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
    dayOfWeek !== classGroup.day_of_week ||
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

    const input: ClassInput = {
      name,
      day_of_week: dayOfWeek,
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
        router.refresh();
        onSuccess?.(classGroup.id);
        return;
      }

      const result = await createClass(input);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.id) {
        onSuccess?.(result.id);
        router.push(`/admin/classes/${result.id}`);
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="day_of_week">Day</Label>
          <Select
            value={dayOfWeek}
            onValueChange={(value) => setDayOfWeek(value as DayOfWeek)}
          >
            <SelectTrigger id="day_of_week" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DAYS_OF_WEEK.map((day) => (
                <SelectItem key={day} value={day}>
                  {DAY_OF_WEEK_LABELS[day]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_time">Start</Label>
          <Input
            id="start_time"
            type="time"
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">End</Label>
          <Input
            id="end_time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
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
        <Button type="submit" disabled={pending || (isEditing && !hasChanges)}>
          {pending
            ? "Saving…"
            : (submitLabel ??
              (classGroup ? "Save changes" : "Create class"))}
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
