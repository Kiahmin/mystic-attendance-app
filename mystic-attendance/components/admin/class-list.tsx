"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Plus, User } from "lucide-react";
import { ClassForm } from "@/components/admin/class-form";
import { PageHeader } from "@/components/layout/page-header";
import { DAYS_OF_WEEK, DAY_OF_WEEK_SHORT_LABELS } from "@/lib/admin-utils";
import { formatSessionTime } from "@/lib/attendance-utils";
import type { ClassWithCoach, DayOfWeek, Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ClassListProps = {
  classes: ClassWithCoach[];
  coaches: Pick<Profile, "id" | "full_name">[];
};

function classesForDay(classes: ClassWithCoach[], day: DayOfWeek) {
  return classes.filter((cls) => cls.day_of_week === day);
}

function slotKey(cls: ClassWithCoach) {
  return `${cls.start_time}-${cls.end_time}`;
}

function groupByTimeSlot(classes: ClassWithCoach[]) {
  const groups: ClassWithCoach[][] = [];

  for (const cls of classes) {
    const last = groups.at(-1);
    if (last && slotKey(last[0]) === slotKey(cls)) {
      last.push(cls);
    } else {
      groups.push([cls]);
    }
  }

  return groups;
}

function formatClassTime(cls: ClassWithCoach) {
  return `${formatSessionTime(cls.start_time)} – ${formatSessionTime(cls.end_time)}`;
}

function ClassWeekCard({
  cls,
  showTime = true,
}: {
  cls: ClassWithCoach;
  showTime?: boolean;
}) {
  return (
    <Link
      href={`/admin/classes/${cls.id}`}
      className={cn(
        "block min-w-0 rounded-lg border border-border border-l-4 border-l-primary bg-card p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-colors hover:border-primary",
        !cls.is_active && "opacity-70"
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-1.5">
        <h3 className="min-w-0 truncate text-xs font-semibold tracking-wide text-foreground">
          {cls.name}
        </h3>
        <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {cls.enrolment_count}
        </span>
      </div>
      <div className="space-y-1">
        {showTime ? (
          <div className="flex items-start text-xs leading-snug text-muted-foreground">
            <Clock className="mt-0.5 mr-1 size-3.5 shrink-0" aria-hidden />
            <span>{formatClassTime(cls)}</span>
          </div>
        ) : null}
        <div className="flex items-center text-xs text-muted-foreground">
          <User className="mr-1 size-3.5 shrink-0" aria-hidden />
          <span className="truncate">
            {cls.coach ? cls.coach.full_name : "No coach"}
          </span>
        </div>
        {!cls.is_active ? (
          <p className="text-[11px] font-medium text-muted-foreground">
            Inactive
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function ClassList({ classes, coaches }: ClassListProps) {
  const [open, setOpen] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const visibleClasses = showInactive
    ? classes
    : classes.filter((cls) => cls.is_active);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Manage recurring class times and assignments."
      >
        <Label
          htmlFor="show-inactive"
          className="mr-2 cursor-pointer text-muted-foreground"
        >
          <Switch
            id="show-inactive"
            checked={showInactive}
            onCheckedChange={setShowInactive}
          />
          Show inactive
        </Label>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-11">
              <Plus className="size-4" />
              Add class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg" showCloseButton>
            <DialogHeader>
              <DialogTitle>Add class</DialogTitle>
              <DialogDescription>
                Configure name, schedule, and assigned coach.
              </DialogDescription>
            </DialogHeader>
            <ClassForm coaches={coaches} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div>
        <div className="mb-3 grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="min-w-0 border-b border-border pb-2 text-center text-xs font-semibold tracking-wider text-muted-foreground uppercase"
            >
              {DAY_OF_WEEK_SHORT_LABELS[day]}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {DAYS_OF_WEEK.map((day) => {
            const dayClasses = classesForDay(visibleClasses, day);

            return (
              <div key={day} className="min-w-0 space-y-2">
                {dayClasses.length === 0 ? (
                  <div className="flex min-h-[100px] items-center justify-center rounded-lg border-2 border-dashed border-border px-1 text-center text-[11px] font-medium tracking-wide text-muted-foreground uppercase opacity-50">
                    No classes
                  </div>
                ) : (
                  groupByTimeSlot(dayClasses).map((group) => {
                    const first = group[0];

                    if (group.length === 1) {
                      return <ClassWeekCard key={first.id} cls={first} />;
                    }

                    return (
                      <div
                        key={slotKey(first)}
                        className="space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-1.5"
                      >
                        <div className="flex items-center px-1 pt-0.5 text-xs text-muted-foreground">
                          <Clock
                            className="mr-1 size-3.5 shrink-0"
                            aria-hidden
                          />
                          <span>{formatClassTime(first)}</span>
                        </div>
                        {group.map((cls) => (
                          <ClassWeekCard
                            key={cls.id}
                            cls={cls}
                            showTime={false}
                          />
                        ))}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
