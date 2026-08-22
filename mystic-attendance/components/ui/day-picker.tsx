"use client";

import {
  DAY_OF_WEEK_LABELS,
  DAY_OF_WEEK_LETTER_LABELS,
  DAYS_SUNDAY_FIRST,
} from "@/lib/admin-utils";
import type { DayOfWeek } from "@/lib/types";
import { cn } from "@/lib/utils";

type DayPickerProps = {
  id?: string;
  value: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
  multiple?: boolean;
  disabled?: boolean;
};

export function DayPicker({
  id,
  value,
  onChange,
  multiple = false,
  disabled,
}: DayPickerProps) {
  function toggle(day: DayOfWeek) {
    if (disabled) return;

    if (!multiple) {
      onChange([day]);
      return;
    }

    if (value.includes(day)) {
      onChange(value.filter((item) => item !== day));
      return;
    }

    onChange([...value, day]);
  }

  return (
    <div id={id} role="group" className="flex flex-wrap gap-2">
      {DAYS_SUNDAY_FIRST.map((day) => {
        const selected = value.includes(day);
        return (
          <button
            key={day}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            aria-label={DAY_OF_WEEK_LABELS[day]}
            onClick={() => toggle(day)}
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold outline-none transition-colors",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "disabled:pointer-events-none disabled:opacity-50",
              selected
                ? "bg-primary text-primary-foreground"
                : "border border-input bg-transparent text-foreground hover:bg-muted"
            )}
          >
            {DAY_OF_WEEK_LETTER_LABELS[day]}
          </button>
        );
      })}
    </div>
  );
}
