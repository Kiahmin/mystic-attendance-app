"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const PERIODS = ["AM", "PM"] as const;

const ITEM_HEIGHT = 36;
const VISIBLE_COUNT = 5;
const CENTER_OFFSET = Math.floor(VISIBLE_COUNT / 2);
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;

type Period = (typeof PERIODS)[number];

type ParsedTime = {
  hour12: number;
  minute: number;
  period: Period;
};

function parseTime(value: string): ParsedTime {
  const [hourPart, minutePart] = value.split(":");
  const hour24 = Number(hourPart);
  const minute = Number(minutePart);
  if (Number.isNaN(hour24) || Number.isNaN(minute)) {
    return { hour12: 10, minute: 0, period: "AM" };
  }

  return {
    hour12: hour24 % 12 || 12,
    minute,
    period: hour24 >= 12 ? "PM" : "AM",
  };
}

function to24Hour(hour12: number, minute: number, period: Period): string {
  let hour24 = hour12 % 12;
  if (period === "PM") hour24 += 12;
  return `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function formatDisplay(value: string): string {
  const { hour12, minute, period } = parseTime(value);
  return `${String(hour12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

type TimePickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  "aria-label"?: string;
};

export function TimePicker({
  id,
  value,
  onChange,
  disabled,
  required,
  "aria-label": ariaLabel,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const parsed = parseTime(value);

  function update(next: Partial<ParsedTime>) {
    const merged = { ...parsed, ...next };
    onChange(to24Hour(merged.hour12, merged.minute, merged.period));
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-label={ariaLabel}
          aria-required={required}
          className={cn(
            "flex h-8 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 text-left text-sm outline-none transition-colors",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <span>{value ? formatDisplay(value) : ""}</span>
          <Clock className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        id={listId}
        align="start"
        side="bottom"
        sideOffset={4}
        collisionPadding={12}
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="z-[60] w-[var(--radix-popover-trigger-width)] overflow-hidden p-2"
      >
        <div className="relative" style={{ height: PICKER_HEIGHT }}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-1.5 top-1/2 z-10 h-9 -translate-y-1/2 rounded-lg border border-border"
          />
          <div
            className="grid h-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] px-1"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)",
            }}
          >
            <WheelColumn
              items={HOURS}
              selected={parsed.hour12}
              onSelect={(hour12) => update({ hour12 })}
              format={pad2}
              ariaLabel="Hour"
            />
            <div
              aria-hidden
              className="relative z-20 flex items-center justify-center px-0.5 text-base font-medium text-foreground"
            >
              :
            </div>
            <WheelColumn
              items={MINUTES}
              selected={parsed.minute}
              onSelect={(minute) => update({ minute })}
              format={pad2}
              ariaLabel="Minute"
            />
            <WheelColumn
              items={PERIODS}
              selected={parsed.period}
              onSelect={(period) => update({ period })}
              ariaLabel="AM or PM"
              className="px-1.5"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function WheelColumn<T extends string | number>({
  items,
  selected,
  onSelect,
  format = (item) => String(item),
  ariaLabel,
  className,
}: {
  items: readonly T[];
  selected: T;
  onSelect: (item: T) => void;
  format?: (item: T) => string;
  ariaLabel: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ignoreScroll = useRef(false);
  const settleTimer = useRef<number | null>(null);
  const [scrollTop, setScrollTop] = useState(0);

  function scrollToIndex(index: number, behavior: ScrollBehavior = "auto") {
    const container = containerRef.current;
    if (!container) return;
    ignoreScroll.current = true;
    container.scrollTo({ top: index * ITEM_HEIGHT, behavior });
    setScrollTop(index * ITEM_HEIGHT);
    window.requestAnimationFrame(() => {
      ignoreScroll.current = false;
    });
  }

  useLayoutEffect(() => {
    const index = Math.max(0, items.indexOf(selected));
    scrollToIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-center when the selected value changes
  }, [selected, items]);

  function commitFromScroll() {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.min(
      items.length - 1,
      Math.max(0, Math.round(container.scrollTop / ITEM_HEIGHT))
    );
    const next = items[index];
    if (next !== undefined && next !== selected) {
      onSelect(next);
    }
    scrollToIndex(index, "smooth");
  }

  function handleScroll() {
    const container = containerRef.current;
    if (!container) return;
    setScrollTop(container.scrollTop);
    if (ignoreScroll.current) return;

    if (settleTimer.current !== null) {
      window.clearTimeout(settleTimer.current);
    }
    settleTimer.current = window.setTimeout(commitFromScroll, 80);
  }

  useEffect(() => {
    return () => {
      if (settleTimer.current !== null) {
        window.clearTimeout(settleTimer.current);
      }
    };
  }, []);

  const centerIndex = scrollTop / ITEM_HEIGHT;

  return (
    <div
      ref={containerRef}
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={0}
      onScroll={handleScroll}
      onKeyDown={(event) => {
        const index = Math.max(0, items.indexOf(selected));
        if (event.key === "ArrowDown" && index < items.length - 1) {
          event.preventDefault();
          onSelect(items[index + 1] as T);
        }
        if (event.key === "ArrowUp" && index > 0) {
          event.preventDefault();
          onSelect(items[index - 1] as T);
        }
      }}
      className={cn(
        "h-full overflow-y-auto overscroll-contain outline-none",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      <div style={{ height: CENTER_OFFSET * ITEM_HEIGHT }} />
      {items.map((item, index) => {
        const distance = Math.abs(index - centerIndex);
        const isSelected = distance < 0.5;
        const opacity = Math.max(0.12, 1 - distance * 0.38);

        return (
          <button
            key={String(item)}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(item)}
            className={cn(
              "flex w-full items-center justify-center text-sm tabular-nums",
              isSelected
                ? "font-medium text-foreground"
                : "font-normal text-muted-foreground"
            )}
            style={{ height: ITEM_HEIGHT, opacity }}
          >
            {format(item)}
          </button>
        );
      })}
      <div style={{ height: CENTER_OFFSET * ITEM_HEIGHT }} />
    </div>
  );
}
