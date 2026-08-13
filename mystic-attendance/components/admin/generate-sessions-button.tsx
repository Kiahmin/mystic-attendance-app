"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { generateSessionsForWeek } from "@/lib/actions/sessions";
import { formatCalendarDate } from "@/lib/datetime";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function GenerateSessionsButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setMessage(null);
    setError(null);

    startTransition(async () => {
      const result = await generateSessionsForWeek();
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }

      const created = result.created ?? 0;
      const skipped = result.skipped ?? 0;
      const range =
        result.saturday && result.sunday
          ? ` (${formatCalendarDate(result.saturday)} – ${formatCalendarDate(result.sunday)})`
          : "";

      if (created === 0 && skipped === 0) {
        setMessage(`No active weekend classes to schedule${range}.`);
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
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-9"
        onClick={handleClick}
        disabled={pending}
      >
        <CalendarPlus className="size-4" />
        {pending ? "Generating…" : "Generate this week’s sessions"}
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
