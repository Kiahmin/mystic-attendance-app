"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { ClassForm } from "@/components/admin/class-form";
import { DAY_OF_WEEK_LABELS } from "@/lib/admin-utils";
import { formatSessionTime } from "@/lib/attendance-utils";
import type { ClassWithCoach, Profile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ClassListProps = {
  classes: ClassWithCoach[];
  coaches: Pick<Profile, "id" | "full_name">[];
};

export function ClassList({ classes, coaches }: ClassListProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
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
      </div>

      {classes.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">No classes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a class group to enrol students.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
          <div className="hidden grid-cols-[1.5fr_1.2fr_1fr_auto] gap-4 border-b border-border/60 bg-muted/50 px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:grid">
            <span>Class</span>
            <span>Schedule</span>
            <span>Coach</span>
            <span className="sr-only">Action</span>
          </div>
          <ul className="divide-y divide-border/60">
            {classes.map((cls) => (
              <li key={cls.id}>
                <Link
                  href={`/admin/classes/${cls.id}`}
                  className={`grid gap-2 px-4 py-4 transition-colors hover:bg-muted/40 md:grid-cols-[1.5fr_1.2fr_1fr_auto] md:items-center md:gap-4 ${
                    cls.is_active ? "" : "opacity-70"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{cls.name}</p>
                    {!cls.is_active ? (
                      <Badge variant="secondary" className="mt-1">
                        Inactive
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {DAY_OF_WEEK_LABELS[cls.day_of_week]} ·{" "}
                    {formatSessionTime(cls.start_time)} –{" "}
                    {formatSessionTime(cls.end_time)}
                  </p>
                  <div>
                    {cls.coach ? (
                      <Badge variant="secondary">{cls.coach.full_name}</Badge>
                    ) : (
                      <Badge variant="outline">No coach</Badge>
                    )}
                  </div>
                  <ChevronRight className="hidden size-4 text-muted-foreground md:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
