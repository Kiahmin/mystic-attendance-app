"use client";

import { useState, useOptimistic, useTransition } from "react";
import { Check, UserMinus, UserRound, UserX, X } from "lucide-react";
import { markStudentGearOrderGiven } from "@/lib/actions/student-gear";
import { gearOrderCheckInLine, rentalSummary } from "@/lib/gear-utils";
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
  onRemoveFromSession?: (studentId: string) => void;
  removePending?: boolean;
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
  onRemoveFromSession,
  removePending,
}: StudentCheckInRowProps) {
  const [pending, startTransition] = useTransition();
  const [gearPending, startGearTransition] = useTransition();
  const [givenOrderIds, setGivenOrderIds] = useState<string[]>([]);
  const [gearError, setGearError] = useState<string | null>(null);
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    entry.attendance?.status
  );
  const warning = packageWarning(entry.package);
  const rentalLine = rentalSummary(entry.student);
  const openOrders = (entry.gearOrders ?? []).filter(
    (order) => !givenOrderIds.includes(order.id)
  );

  function handleGiven(orderId: string) {
    setGearError(null);
    setGivenOrderIds((ids) => [...ids, orderId]);
    startGearTransition(async () => {
      try {
        const result = await markStudentGearOrderGiven(orderId, sessionId);
        if (result.error) {
          setGivenOrderIds((ids) => ids.filter((id) => id !== orderId));
          setGearError(result.error);
        }
      } catch {
        setGivenOrderIds((ids) => ids.filter((id) => id !== orderId));
        setGearError("Could not mark this item given.");
      }
    });
  }

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
        warning === "overshot" && "border-destructive/40",
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
              {entry.student.is_trial ? (
                <Badge variant="warning">Trial</Badge>
              ) : null}
              {!entry.student.is_trial && entry.rosterSource === "include" ? (
                <Badge variant="warning">One-off</Badge>
              ) : null}
              {entry.rosterSource === "former" ? (
                <Badge variant="secondary">Unenrolled</Badge>
              ) : null}
              {entry.isWalkIn ? (
                <Badge variant="warning">Walk-in</Badge>
              ) : null}
              {rentalLine ? <Badge variant="warning">Rental</Badge> : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {entry.package ? (
                <>
                  {entry.package.remaining_credits < 0
                    ? `${Math.abs(entry.package.remaining_credits)} extra lesson${
                        entry.package.remaining_credits === -1 ? "" : "s"
                      }`
                    : `${entry.package.remaining_credits} credit${
                        entry.package.remaining_credits === 1 ? "" : "s"
                      } left`}
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

        <div className="flex shrink-0 items-start gap-2">
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
          {onRemoveFromSession &&
          !entry.isWalkIn &&
          entry.rosterSource !== "former" ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              title={
                entry.rosterSource === "include"
                  ? "Remove one-off attendee"
                  : "Exclude from this session"
              }
              disabled={disabled || removePending}
              onClick={() => onRemoveFromSession(entry.student.id)}
            >
              <UserMinus className="size-4" />
              <span className="sr-only">Remove from session</span>
            </Button>
          ) : null}
        </div>
      </div>

      {rentalLine || openOrders.length > 0 ? (
        <div className="mb-3 space-y-1.5">
          {rentalLine ? (
            <p className="text-sm text-muted-foreground">{rentalLine}</p>
          ) : null}
          {openOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-2"
            >
              <p className="min-w-0 text-sm">{gearOrderCheckInLine(order)}</p>
              {order.status === "ready" ? (
                <Button
                  type="button"
                  size="xs"
                  disabled={disabled || gearPending}
                  aria-label={`Mark ${order.item_name} given for ${entry.student.full_name}`}
                  onClick={() => handleGiven(order.id)}
                >
                  Mark given
                </Button>
              ) : null}
            </div>
          ))}
          {gearError ? (
            <p className="text-xs text-destructive" role="alert">
              {gearError}
            </p>
          ) : null}
        </div>
      ) : null}

      {warning !== "none" ? (
        <p
          className={cn(
            "mb-3 text-sm font-medium",
            warning === "expired" ||
            warning === "unpaid" ||
            warning === "overshot"
              ? "text-destructive"
              : "text-warning"
          )}
        >
          {warning === "expired"
            ? "Package expired — flag to admin"
            : warning === "unpaid"
              ? "Package unpaid — cannot deduct credits"
              : warning === "overshot"
                ? "Overshot — extra lesson"
                : "Low credits or expiring soon"}
        </p>
      ) : null}

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
    </div>
  );
}
