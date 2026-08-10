"use client";

import { useOptimistic, useTransition } from "react";
import { Check, UserRound, UserX, X } from "lucide-react";
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
  inactiveClass: string;
  activeClass: string;
}[] = [
  {
    status: "present",
    label: "Present",
    icon: Check,
    inactiveClass: "bg-muted text-muted-foreground hover:bg-muted/80",
    activeClass: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  {
    status: "absent",
    label: "Absent",
    icon: UserX,
    inactiveClass: "bg-muted text-muted-foreground hover:bg-muted/80",
    activeClass: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  },
  {
    status: "no_show",
    label: "No-show",
    icon: X,
    inactiveClass: "bg-muted text-destructive hover:bg-muted/80",
    activeClass: "bg-destructive text-white hover:bg-destructive/90",
  },
];

export function StudentCheckInRow({
  sessionId,
  entry,
  disabled,
}: StudentCheckInRowProps) {
  const [pending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    entry.attendance?.status
  );
  const warning = packageWarning(entry.package);

  function handleMark(status: AttendanceStatus) {
    startTransition(async () => {
      setOptimisticStatus(status);
      await markAttendance(sessionId, entry.student.id, status);
    });
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(26,27,34,0.04)]",
        entry.isWalkIn && "border-dashed border-warning/50 bg-warning/5",
        warning === "expired" && "border-destructive/40",
        warning === "low" && "border-warning/40"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <UserRound className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-heading font-semibold">
                {entry.student.full_name}
              </p>
              {entry.isWalkIn ? (
                <Badge variant="warning">Walk-in</Badge>
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
        </div>

        {optimisticStatus ? (
          <Badge
            variant={
              optimisticStatus === "present"
                ? "success"
                : optimisticStatus === "no_show"
                  ? "destructive"
                  : "secondary"
            }
          >
            {ATTENDANCE_STATUS_LABELS[optimisticStatus]}
          </Badge>
        ) : null}
      </div>

      {warning !== "none" ? (
        <p
          className={cn(
            "mb-3 text-sm font-medium",
            warning === "expired" || warning === "unpaid"
              ? "text-destructive"
              : "text-warning"
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
          {STATUS_BUTTONS.map(
            ({ status, label, icon: Icon, inactiveClass, activeClass }) => {
              const active = optimisticStatus === status;
              return (
                <Button
                  key={status}
                  type="button"
                  disabled={disabled || pending}
                  onClick={() => handleMark(status)}
                  variant="ghost"
                  className={cn(
                    "h-12 flex-col gap-1 rounded-lg text-xs font-medium",
                    active ? activeClass : inactiveClass
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Button>
              );
            }
          )}
        </div>
      ) : null}
    </div>
  );
}
