"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { markPackageInformed } from "@/lib/actions/packages";
import { formatCalendarDate } from "@/lib/datetime";
import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const GRID =
  "grid-cols-[minmax(8rem,1.4fr)_minmax(7rem,1fr)_minmax(6rem,0.8fr)_auto]";

type DashboardDueSoonPanelProps = {
  items: DashboardQueueItem[];
  classes: { id: string; name: string }[];
};

function InformButton({ packageId }: { packageId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <Button
        type="button"
        size="sm"
        variant="outline"
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
        <span className="max-w-40 text-xs text-destructive">{error}</span>
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
  const filterLabel =
    classId === "all"
      ? "across all classes"
      : `in ${classes.find((cls) => cls.id === classId)?.name ?? "this class"}`;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Action needed
          </p>
          <CardTitle>Student due soon</CardTitle>
          <CardDescription>
            Packages with two or fewer lessons remaining. Inform or assign a renewal.
          </CardDescription>
        </div>
        <CardAction>
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger
              size="sm"
              className="w-44"
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
        </CardAction>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="font-medium">No students due at this class</p>
            <p className="mt-1 text-sm text-muted-foreground">
              As packages reach two or fewer lessons remaining, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[36rem]">
              <div
                className={cn(
                  "mb-2 grid gap-3 border-b border-border/60 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                  GRID
                )}
              >
                <span>Student</span>
                <span>Package</span>
                <span>Last attended</span>
                <span className="text-right">Action</span>
              </div>
              <div className="space-y-3">
                {filtered.map((item) => (
                  <div
                    key={item.packageId}
                    className={cn("grid items-center gap-3", GRID)}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.studentName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.classNames.join(" · ") || "No class enrolled"}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm">{item.packageLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.totalCredits - item.remainingCredits}/
                        {item.totalCredits}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.lastAttendedOn
                        ? formatCalendarDate(item.lastAttendedOn)
                        : "—"}
                    </p>
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <InformButton packageId={item.packageId} />
                      <Link
                        href={`/admin/packages/assign?studentId=${item.studentId}`}
                        className={buttonVariants({ size: "sm" })}
                      >
                        Paid
                      </Link>
                      <Link
                        href={`/admin/students/${item.studentId}`}
                        className={buttonVariants({
                          size: "sm",
                          variant: "ghost",
                        })}
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {filtered.length} shown {filterLabel}
        </span>
        <Link
          href="/admin/students"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View all students →
        </Link>
      </CardFooter>
    </Card>
  );
}
