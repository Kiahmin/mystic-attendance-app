"use client";

import Link from "next/link";
import { DAYS_OF_WEEK, DAY_OF_WEEK_SHORT_LABELS } from "@/lib/admin-utils";
import { calendarDayNumber, todayInSingapore } from "@/lib/datetime";
import { adminCalendarHref, type CalendarView } from "@/lib/session-utils";
import type { DashboardSession, Profile } from "@/lib/types";
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
  view: CalendarView;
  date: string;
  onCreateEvent?: (draft: CreateEventDraft) => void;
};

export function ScheduleMonthGrid({
  dates,
  monthStart,
  sessions,
  coaches,
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

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-7 border-b border-border/60">
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day}
                className="px-1 py-2 text-center text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
              >
                {DAY_OF_WEEK_SHORT_LABELS[day]}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
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
                    "min-h-[110px] border-t border-l border-border/50 p-1 sm:min-h-[128px]",
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
                  <div className="mb-1 flex justify-end">
                    <Link
                      href={dayHref}
                      className={cn(
                        "flex size-7 items-center justify-center text-xs font-semibold",
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
                  <div className="space-y-0.5">
                    {visible.map((item) => (
                      <ScheduleEvent
                        key={item.session.id}
                        item={item}
                        coaches={coaches}
                        view={view}
                        date={date}
                        variant="chip"
                      />
                    ))}
                    {hidden > 0 ? (
                      <Link
                        href={dayHref}
                        className="block px-1 text-[11px] font-medium text-muted-foreground hover:text-foreground"
                      >
                        +{hidden} more
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
