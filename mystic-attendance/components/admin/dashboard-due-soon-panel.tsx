"use client";

import { useState } from "react";
import { formatCalendarDate } from "@/lib/datetime";
import { remainingCreditsLabel } from "@/lib/package-utils";
import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { InformButton } from "@/components/admin/inform-package-dialog";
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
  const last = item.lastAttendedOn
    ? `last ${formatCalendarDate(item.lastAttendedOn)}`
    : "no attendance yet";
  return `${remainingCreditsLabel(item.remainingCredits)} · ${last}`;
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
      title="Needs renewal"
      description="Finished, or two or fewer lessons left."
      count={filtered.length}
      listLabel="Students who need renewal"
      emptyTitle={
        classFiltered
          ? "No students need renewal at this class"
          : "No students need renewal"
      }
      emptyDescription={
        classFiltered
          ? "Try another class, or choose All classes."
          : "Finished packages, or packages with two or fewer lessons remaining, will appear here."
      }
      footerHref="/admin/packages?filter=finishing,finished"
      footerLabel="View finishing and finished packages →"
      filter={
        <Select value={classId} onValueChange={setClassId}>
          <SelectTrigger
            size="sm"
            className="w-full"
            aria-label="Filter needs renewal by class"
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
