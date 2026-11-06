"use client";

import { useState, useTransition } from "react";
import {
  markStudentGearOrderGiven,
  setStudentGearOrderStatus,
} from "@/lib/actions/student-gear";
import { GEAR_ORDER_STATUSES } from "@/lib/gear-utils";
import type { GearOrderStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";

const SHORT_STATUS_LABELS: Record<GearOrderStatus, string> = {
  to_order: "To order",
  ordered: "Ordered",
  ready: "Ready",
  given: "Given",
};

export function GearOrderStatusButtons({
  orderId,
  status,
  itemLabel,
}: {
  orderId: string;
  status: GearOrderStatus;
  itemLabel: string;
}) {
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(status);
  const [error, setError] = useState<string | null>(null);

  function choose(next: GearOrderStatus) {
    if (next === current || pending) return;
    const previous = current;
    setError(null);
    setCurrent(next);
    startTransition(async () => {
      const result = await setStudentGearOrderStatus(orderId, next);
      if (result.error) {
        setCurrent(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-1">
      <div
        role="group"
        aria-label={`Status for ${itemLabel}`}
        className="flex flex-wrap gap-1"
      >
        {GEAR_ORDER_STATUSES.map((value) => (
          <Button
            key={value}
            type="button"
            size="xs"
            variant={current === value ? "default" : "outline"}
            disabled={pending}
            aria-pressed={current === value}
            onClick={() => choose(value)}
          >
            {SHORT_STATUS_LABELS[value]}
          </Button>
        ))}
      </div>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function MarkGearGivenButton({
  orderId,
  itemLabel,
  studentName,
  sessionId,
}: {
  orderId: string;
  itemLabel: string;
  studentName: string;
  sessionId?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="xs"
        disabled={pending}
        aria-label={`Mark ${itemLabel} given for ${studentName}`}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await markStudentGearOrderGiven(orderId, sessionId);
            if (result.error) setError(result.error);
          });
        }}
      >
        {pending ? "Saving…" : "Mark given"}
      </Button>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
