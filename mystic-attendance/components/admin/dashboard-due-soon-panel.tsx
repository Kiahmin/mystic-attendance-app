"use client";

import { useState } from "react";
import { formatCalendarDate } from "@/lib/datetime";
import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { InformPackageDialog } from "@/components/admin/inform-package-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardQueuePanel } from "@/components/admin/dashboard-queue-panel";
import {
  AssignPackageLink,
  DashboardQueueRow,
} from "@/components/admin/dashboard-queue-row";

type DashboardDueSoonPanelProps = {
  items: DashboardQueueItem[];
  classes: { id: string; name: string }[];
};

function dueSoonWhy(item: DashboardQueueItem): string {
  const remaining = Math.max(0, item.remainingCredits);
  const lessons =
    remaining === 1 ? "1 lesson left" : `${remaining} lessons left`;
  const last = item.lastAttendedOn
    ? `last ${formatCalendarDate(item.lastAttendedOn)}`
    : "no attendance yet";
  return `${lessons} · ${last}`;
}

function InformButton({ item }: { item: DashboardQueueItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Inform
      </Button>
      <InformPackageDialog
        packageId={item.packageId}
        studentName={item.studentName}
        packageLabel={item.packageLabel}
        remainingCredits={item.remainingCredits}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

export function DashboardDueSoonPanel({
  items,
  classes,
}: DashboardDueSoonPanelProps) {
  const [classId, setClassId] = useState("all");
  const filtered =
    classId === "all"
      ? items
      : items.filter((item) => item.classIds.includes(classId));
  const classFiltered = classId !== "all";

  return (
    <DashboardQueuePanel
      title="Due soon"
      description="Two or fewer lessons left."
      count={filtered.length}
      listLabel="Students due soon"
      emptyTitle={
        classFiltered ? "No students due at this class" : "No students due soon"
      }
      emptyDescription={
        classFiltered
          ? "Try another class, or choose All classes."
          : "Packages with two or fewer lessons remaining will appear here."
      }
      footerHref="/admin/packages?filter=finishing"
      footerLabel="View finishing packages →"
      filter={
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger
            size="sm"
            className="w-full"
            aria-label="Filter due soon by class"
          >
            <SelectValue placeholder="All classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      }
    >
      {filtered.map((item) => (
        <DashboardQueueRow
          key={item.packageId}
          studentName={item.studentName}
          studentHref={`/admin/students/${item.studentId}`}
          why={dueSoonWhy(item)}
          actions={
            <div className="flex items-center justify-end gap-1.5">
              <InformButton item={item} />
              <AssignPackageLink
                studentId={item.studentId}
                studentName={item.studentName}
              />
            </div>
          }
        />
      ))}
    </DashboardQueuePanel>
  );
}
