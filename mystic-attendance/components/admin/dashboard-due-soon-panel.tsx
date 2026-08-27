"use client";

import { useState, useTransition } from "react";
import { markPackageInformed } from "@/lib/actions/packages";
import { formatCalendarDate } from "@/lib/datetime";
import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardQueuePanel } from "@/components/admin/dashboard-queue-panel";
import { DashboardQueueRow } from "@/components/admin/dashboard-queue-row";

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

function InformButton({ packageId }: { packageId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await markPackageInformed(packageId);
            if (result.error) setError(result.error);
          });
        }}
      >
        {pending ? "Saving…" : "Inform"}
      </Button>
      {error ? (
        <span className="max-w-40 text-right text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </span>
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
      description="Two or fewer lessons left. Inform the student."
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
      footerHref="/admin/students"
      footerLabel="View students →"
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
          actions={<InformButton packageId={item.packageId} />}
        />
      ))}
    </DashboardQueuePanel>
  );
}
