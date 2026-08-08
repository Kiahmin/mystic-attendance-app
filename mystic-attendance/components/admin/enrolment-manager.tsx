"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { enrolStudent, unenrolStudent } from "@/lib/actions/enrolments";
import {
  DAY_OF_WEEK_LABELS,
} from "@/lib/admin-utils";
import { formatSessionTime } from "@/lib/attendance-utils";
import type {
  ClassWithCoach,
  EnrolmentWithClass,
} from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EnrolmentManagerProps = {
  studentId: string;
  enrolments: EnrolmentWithClass[];
  availableClasses: ClassWithCoach[];
};

export function EnrolmentManager({
  studentId,
  enrolments,
  availableClasses,
}: EnrolmentManagerProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const enrolledClassIds = useMemo(
    () => new Set(enrolments.map((e) => e.class_id)),
    [enrolments]
  );

  const options = availableClasses.filter(
    (c) => c.is_active && !enrolledClassIds.has(c.id)
  );

  function handleEnrol() {
    if (!selectedClassId) return;
    setError(null);
    startTransition(async () => {
      const result = await enrolStudent(studentId, selectedClassId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setSelectedClassId("");
      router.refresh();
    });
  }

  function handleUnenrol(classId: string) {
    setError(null);
    startTransition(async () => {
      const result = await unenrolStudent(studentId, classId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {enrolments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Not enrolled in any classes yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {enrolments.map((enrolment) => {
            const cls = enrolment.classes;
            return (
              <li
                key={enrolment.id}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{cls.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {DAY_OF_WEEK_LABELS[cls.day_of_week]} ·{" "}
                    {formatSessionTime(cls.start_time)} –{" "}
                    {formatSessionTime(cls.end_time)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!cls.is_active ? (
                    <Badge variant="secondary">Inactive</Badge>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={pending}
                    aria-label={`Remove ${cls.name}`}
                    onClick={() => handleUnenrol(cls.id)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Select
          value={selectedClassId || undefined}
          onValueChange={setSelectedClassId}
          disabled={options.length === 0 || pending}
        >
          <SelectTrigger className="w-full flex-1">
            <SelectValue
              placeholder={
                options.length === 0
                  ? "No more active classes"
                  : "Add to a class…"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {options.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name} · {DAY_OF_WEEK_LABELS[cls.day_of_week]}{" "}
                {formatSessionTime(cls.start_time)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          onClick={handleEnrol}
          disabled={!selectedClassId || pending}
        >
          <Plus className="size-4" />
          Enrol
        </Button>
      </div>
    </div>
  );
}
