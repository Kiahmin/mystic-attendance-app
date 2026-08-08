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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            <Button>
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
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="font-medium">No classes yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a class group to enrol students.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {classes.map((cls) => (
            <li key={cls.id}>
              <Link href={`/admin/classes/${cls.id}`} className="block">
                <Card
                  className={
                    cls.is_active
                      ? "transition-colors hover:border-primary/30 hover:bg-muted/30"
                      : "opacity-70 transition-colors hover:border-primary/30 hover:bg-muted/30"
                  }
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">{cls.name}</CardTitle>
                        <CardDescription>
                          {DAY_OF_WEEK_LABELS[cls.day_of_week]} ·{" "}
                          {formatSessionTime(cls.start_time)} –{" "}
                          {formatSessionTime(cls.end_time)}
                        </CardDescription>
                      </div>
                      <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {cls.coach ? (
                      <Badge variant="secondary">{cls.coach.full_name}</Badge>
                    ) : (
                      <Badge variant="outline">No coach</Badge>
                    )}
                    {!cls.is_active ? (
                      <Badge variant="secondary">Inactive</Badge>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
