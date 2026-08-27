"use client";

import Link from "next/link";
import { DAYS_OF_WEEK, DAY_OF_WEEK_LETTER_LABELS, DAY_OF_WEEK_SHORT_LABELS } from "@/lib/admin-utils";
import { calendarDayNumber, todayInSingapore } from "@/lib/datetime";
import { adminCalendarHref, type CalendarView } from "@/lib/session-utils";
import type { DashboardSession, Profile, Venue } from "@/lib/types";
import { ScheduleEvent } from "@/components/admin/schedule-event";
import { cn } from "@/lib/utils";

const MAX_CHIPS = 3;

type CreateEventDraft = {
  date: string;
  startTime?: string;
  endTime?: string;
};

type ScheduleMonthGridProps = {
  dates: string[];
  monthStart: string;
  sessions: DashboardSession[];
  coaches: Pick<Profile, "id" | "full_name">[];
  venues: Venue[];
  view: CalendarView;
  date: string;
  onCreateEvent?: (draft: CreateEventDraft) => void;
};

export function ScheduleMonthGrid({
  dates,
  monthStart,
  sessions,
  coaches,
  venues,
  view,
  date,
  onCreateEvent,
}: ScheduleMonthGridProps) {
  const today = todayInSingapore();
  const monthKey = monthStart.slice(0, 7);
  const sessionsByDate = new Map<string, DashboardSession[]>();
  for (const item of sessions) {
    const key = item.session.session_date;
    const list = sessionsByDate.get(key);
    if (list) list.push(item);
    else sessionsByDate.set(key, [item]);
  }

  const weekCount = Math.max(1, Math.ceil(dates.length / 7));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="grid shrink-0 grid-cols-7 border-b border-border/60">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="min-w-0 px-0.5 py-1.5 text-center text-[10px] font-semibold tracking-wide text-muted-foreground uppercase sm:px-1 sm:py-2 sm:text-[11px]"
          >
            <span className="sm:hidden">{DAY_OF_WEEK_LETTER_LABELS[day]}</span>
            <span className="hidden sm:inline">
              {DAY_OF_WEEK_SHORT_LABELS[day]}
            </span>
          </div>
        ))}
      </div>
      <div
        className="grid min-h-0 flex-1 grid-cols-7 overflow-auto"
        style={{
          gridTemplateRows: `repeat(${weekCount}, minmax(4.5rem, 1fr))`,
        }}
      >
        {dates.map((day) => {
          const inMonth = day.startsWith(monthKey);
          const isToday = day === today;
          const daySessions = sessionsByDate.get(day) ?? [];
          const visible = daySessions.slice(0, MAX_CHIPS);
          const hidden = daySessions.length - visible.length;
          const dayHref = adminCalendarHref({ view: "day", date: day });

          return (
            <div
              key={day}
              className={cn(
                "flex min-h-0 min-w-0 flex-col border-t border-l border-border/50 p-0.5 sm:p-1",
                onCreateEvent && "cursor-pointer hover:bg-muted/40",
                !inMonth && "bg-muted/30"
              )}
              onClick={(event) => {
                if (!onCreateEvent) return;
                const target = event.target as HTMLElement;
                if (target.closest("[data-schedule-event], a")) return;
                onCreateEvent({ date: day });
              }}
            >
              <div className="mb-0.5 flex justify-end sm:mb-1">
                <Link
                  href={dayHref}
                  className={cn(
                    "flex size-6 items-center justify-center text-[11px] font-semibold sm:size-7 sm:text-xs",
                    isToday
                      ? "rounded-full bg-primary text-primary-foreground"
                      : inMonth
                        ? "text-foreground hover:bg-muted"
                        : "text-muted-foreground hover:bg-muted",
                    !isToday && "rounded-full"
                  )}
                >
                  {calendarDayNumber(day)}
                </Link>
              </div>
              <div className="min-h-0 flex-1 space-y-0.5 overflow-hidden">
                {visible.map((item, index) => (
                  <ScheduleEvent
                    key={item.session.id}
                    item={item}
                    coaches={coaches}
                    venues={venues}
                    view={view}
                    date={date}
                    variant="chip"
                    className={index >= 2 ? "hidden sm:flex" : undefined}
                  />
                ))}
                {hidden > 0 ? (
                  <Link
                    href={dayHref}
                    className="block px-1 text-[10px] font-medium text-muted-foreground hover:text-foreground sm:text-[11px]"
                  >
                    +{hidden} more
                  </Link>
                ) : visible.length > 2 ? (
                  <Link
                    href={dayHref}
                    className="block px-1 text-[10px] font-medium text-muted-foreground hover:text-foreground sm:hidden"
                  >
                    +{visible.length - 2} more
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
