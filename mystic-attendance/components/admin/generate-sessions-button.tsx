"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { generateSessionsForDates } from "@/lib/actions/sessions";
import { formatCalendarDate } from "@/lib/datetime";
import type { CalendarView } from "@/lib/session-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type GenerateSessionsButtonProps = {
  dates: string[];
  view: CalendarView;
  isToday?: boolean;
};

function buttonLabel(view: CalendarView, isToday: boolean) {
  if (view === "day") {
    return isToday
      ? "Generate today's sessions"
      : "Generate this day's sessions";
  }
  if (view === "month") return "Generate this month's sessions";
  return "Generate this week's sessions";
}

export function GenerateSessionsButton({
  dates,
  view,
  isToday = false,
}: GenerateSessionsButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await generateSessionsForDates(dates);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }

      const created = result.created ?? 0;
      const skipped = result.skipped ?? 0;
      const range =
        result.start && result.end
          ? result.start === result.end
            ? ` (${formatCalendarDate(result.start)})`
            : ` (${formatCalendarDate(result.start)} – ${formatCalendarDate(result.end)})`
          : "";

      if (created === 0 && skipped === 0) {
        setMessage(`No active classes to schedule${range}.`);
      } else if (created === 0) {
        setMessage(
          `All ${skipped} session${skipped === 1 ? "" : "s"} already exist${range}.`
        );
      } else {
        setMessage(
          `Created ${created} session${created === 1 ? "" : "s"}${
            skipped > 0 ? ` (${skipped} already existed)` : ""
          }${range}.`
        );
      }
      router.refresh();
    });
  }

  return (
    <div className="flex min-w-0 flex-col items-start gap-2 sm:ml-auto sm:items-end">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8"
        onClick={handleClick}
        disabled={pending || dates.length === 0}
      >
        <CalendarPlus className="size-4" />
        {pending ? "Generating…" : buttonLabel(view, isToday)}
      </Button>
      {error ? (
        <Alert variant="destructive" className="max-w-sm">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      {message ? (
        <p className="max-w-sm text-right text-xs text-muted-foreground">
          {message}
        </p>
      ) : null}
    </div>
  );
}
