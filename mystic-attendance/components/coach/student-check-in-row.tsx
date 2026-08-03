"use client";

import { useTransition } from "react";
import { Check, UserX, X } from "lucide-react";
import type { AttendanceStatus, CheckInStudent } from "@/lib/types";
import {
  ATTENDANCE_STATUS_LABELS,
  formatDate,
  packageWarning,
} from "@/lib/attendance-utils";
import { markAttendance } from "@/lib/actions/attendance";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudentCheckInRowProps {
  sessionId: string;
  entry: CheckInStudent;
  disabled?: boolean;
}

const STATUS_BUTTONS: {
  status: AttendanceStatus;
  label: string;
  icon: typeof Check;
  tone: string;
}[] = [
  {
    status: "present",
    label: "Present",
    icon: Check,
    tone: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  {
    status: "absent",
    label: "Absent",
    icon: UserX,
    tone: "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
  },
  {
    status: "no_show",
    label: "No-show",
    icon: X,
    tone: "bg-destructive hover:bg-destructive/90 text-white",
  },
];

export function StudentCheckInRow({
  sessionId,
  entry,
  disabled,
}: StudentCheckInRowProps) {
  const [pending, startTransition] = useTransition();
  const warning = packageWarning(entry.package);
  const currentStatus = entry.attendance?.status;

  function handleMark(status: AttendanceStatus) {
    startTransition(async () => {
      await markAttendance(sessionId, entry.student.id, status);
    });
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        entry.isWalkIn && "border-dashed border-amber-500/50 bg-amber-50/40 dark:bg-amber-950/20",
        warning === "expired" && "border-destructive/40",
        warning === "low" && "border-amber-500/40"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{entry.student.full_name}</p>
            {entry.isWalkIn ? (
              <Badge variant="outline" className="border-amber-500 text-amber-700">
                Walk-in
              </Badge>
            ) : null}
            {entry.student.skill_level ? (
              <Badge variant="secondary" className="capitalize">
                {entry.student.skill_level}
              </Badge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {entry.package ? (
              <>
                {entry.package.remaining_credits} credit
                {entry.package.remaining_credits === 1 ? "" : "s"} left
                {entry.package.expires_at
                  ? ` · expires ${formatDate(entry.package.expires_at)}`
                  : " · not yet activated"}
              </>
            ) : (
              "No chargeable package"
            )}
          </p>
        </div>

        {currentStatus ? (
          <Badge
            variant={
              currentStatus === "present"
                ? "default"
                : currentStatus === "walk_in"
                  ? "outline"
                  : "secondary"
            }
          >
            {ATTENDANCE_STATUS_LABELS[currentStatus]}
          </Badge>
        ) : null}
      </div>

      {warning !== "none" ? (
        <p
          className={cn(
            "mb-3 text-sm font-medium",
            warning === "expired" || warning === "unpaid"
              ? "text-destructive"
              : "text-amber-700 dark:text-amber-400"
          )}
        >
          {warning === "expired"
            ? "Package expired or no credits — flag to admin"
            : warning === "unpaid"
              ? "Package unpaid — cannot deduct credits"
              : "Low credits or expiring soon"}
        </p>
      ) : null}

      {!entry.isWalkIn ? (
        <div className="grid grid-cols-3 gap-2">
          {STATUS_BUTTONS.map(({ status, label, icon: Icon, tone }) => {
            const active = currentStatus === status;
            return (
              <Button
                key={status}
                type="button"
                disabled={disabled || pending}
                onClick={() => handleMark(status)}
                variant={active ? "default" : "outline"}
                className={cn("h-11 flex-col gap-1 text-xs", active && tone)}
              >
                <Icon className="size-4" />
                {label}
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
