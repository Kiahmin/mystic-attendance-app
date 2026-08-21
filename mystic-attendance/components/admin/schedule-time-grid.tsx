"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DAY_OF_WEEK_SHORT_LABELS,
  timeToMinutes,
} from "@/lib/admin-utils";
import { calendarDayNumber, todayInSingapore } from "@/lib/datetime";
import {
  dayOfWeekForDate,
  nowTimeInSingapore,
  sessionDisplayEnd,
  sessionDisplayStart,
  type CalendarView,
} from "@/lib/session-utils";
import type { DashboardSession, Profile } from "@/lib/types";
import { ScheduleEvent } from "@/components/admin/schedule-event";
import { cn } from "@/lib/utils";

const HOUR_HEIGHT = 56;
const DEFAULT_START_HOUR = 8;
const DEFAULT_END_HOUR = 21;
const MIN_EVENT_HEIGHT = 22;

type ScheduleTimeGridProps = {
  dates: string[];
  sessions: DashboardSession[];
  coaches: Pick<Profile, "id" | "full_name">[];
  view: CalendarView;
  date: string;
};

type PositionedSession = {
  item: DashboardSession;
  startMin: number;
  endMin: number;
  col: number;
  colCount: number;
};

function formatHourLabel(hour: number) {
  const suffix = hour >= 12 && hour < 24 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour} ${suffix}`;
}

function layoutDaySessions(sessions: DashboardSession[]): PositionedSession[] {
  const timed = sessions
    .map((item) => {
      const startMin = timeToMinutes(sessionDisplayStart(item.session)) ?? 0;
      let endMin = timeToMinutes(sessionDisplayEnd(item.session)) ?? startMin + 60;
      if (endMin <= startMin) endMin = startMin + 30;
      return { item, startMin, endMin };
    })
    .sort(
      (a, b) =>
        a.startMin - b.startMin ||
        a.endMin - b.endMin ||
        a.item.session.id.localeCompare(b.item.session.id)
    );

  type ClusterItem = (typeof timed)[number] & { col: number };
  const result: PositionedSession[] = [];
  let cluster: ClusterItem[] = [];
  let clusterEnd = -1;

  function flush() {
    if (cluster.length === 0) return;
    const colCount = Math.max(...cluster.map((entry) => entry.col)) + 1;
    for (const entry of cluster) {
      result.push({
        item: entry.item,
        startMin: entry.startMin,
        endMin: entry.endMin,
        col: entry.col,
        colCount,
      });
    }
    cluster = [];
    clusterEnd = -1;
  }

  for (const event of timed) {
    if (cluster.length > 0 && event.startMin >= clusterEnd) flush();
    const used = new Set(
      cluster
        .filter((entry) => entry.endMin > event.startMin)
        .map((entry) => entry.col)
    );
    let col = 0;
    while (used.has(col)) col += 1;
    cluster.push({ ...event, col });
    clusterEnd = Math.max(clusterEnd, event.endMin);
  }
  flush();
  return result;
}

function gridHours(sessions: DashboardSession[]) {
  if (sessions.length === 0) {
    return { startHour: DEFAULT_START_HOUR, endHour: DEFAULT_END_HOUR };
  }

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const item of sessions) {
    const start = timeToMinutes(sessionDisplayStart(item.session)) ?? DEFAULT_START_HOUR * 60;
    const end = timeToMinutes(sessionDisplayEnd(item.session)) ?? DEFAULT_END_HOUR * 60;
    min = Math.min(min, start);
    max = Math.max(max, end);
  }

  return {
    startHour: Math.max(0, Math.floor(min / 60) - 1),
    endHour: Math.min(24, Math.ceil(max / 60) + 1),
  };
}

function useNowMinutes() {
  const [minutes, setMinutes] = useState(
    () => timeToMinutes(nowTimeInSingapore()) ?? 0
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setMinutes(timeToMinutes(nowTimeInSingapore()) ?? 0);
    }, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return minutes;
}

export function ScheduleTimeGrid({
  dates,
  sessions,
  coaches,
  view,
  date,
}: ScheduleTimeGridProps) {
  const today = todayInSingapore();
  const nowMinutes = useNowMinutes();
  const { startHour, endHour } = useMemo(() => gridHours(sessions), [sessions]);
  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, index) => startHour + index),
    [startHour, endHour]
  );
  const gridStartMin = startHour * 60;
  const gridEndMin = endHour * 60;
  const height = hours.length * HOUR_HEIGHT;
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, DashboardSession[]>();
    for (const item of sessions) {
      const key = item.session.session_date;
      const list = map.get(key);
      if (list) list.push(item);
      else map.set(key, [item]);
    }
    return map;
  }, [sessions]);

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="max-h-[min(72vh,840px)] overflow-auto">
        <div className={cn(dates.length > 1 && "min-w-[720px]")}>
          <div
            className="sticky top-0 z-20 grid border-b border-border/60 bg-card"
            style={{
              gridTemplateColumns: `3.5rem repeat(${dates.length}, minmax(0, 1fr))`,
            }}
          >
            <div />
            {dates.map((day) => {
              const weekday = dayOfWeekForDate(day);
              const isToday = day === today;
              return (
                <div
                  key={day}
                  className={cn(
                    "px-1 py-2 text-center",
                    isToday && "bg-primary/5"
                  )}
                >
                  <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {weekday ? DAY_OF_WEEK_SHORT_LABELS[weekday] : ""}
                  </p>
                  <p
                    className={cn(
                      "mx-auto mt-1 flex size-8 items-center justify-center text-sm font-semibold",
                      isToday
                        ? "rounded-full bg-primary text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {calendarDayNumber(day)}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className="relative grid"
            style={{
              gridTemplateColumns: `3.5rem repeat(${dates.length}, minmax(0, 1fr))`,
              height,
            }}
          >
            <div className="relative">
              {hours.map((hour, index) => (
                <div
                  key={hour}
                  className={cn(
                    "absolute right-2 text-[11px] text-muted-foreground",
                    index > 0 && "-translate-y-1/2"
                  )}
                  style={{ top: index * HOUR_HEIGHT }}
                >
                  {formatHourLabel(hour)}
                </div>
              ))}
            </div>

            {dates.map((day) => {
              const isToday = day === today;
              const laidOut = layoutDaySessions(sessionsByDate.get(day) ?? []);
              const showNow =
                isToday &&
                nowMinutes >= gridStartMin &&
                nowMinutes <= gridEndMin;

              return (
                <div
                  key={day}
                  className={cn(
                    "relative border-l border-border/60",
                    isToday && "bg-primary/5"
                  )}
                >
                  {hours.map((hour, index) => (
                    <div
                      key={hour}
                      className="absolute inset-x-0 border-t border-border/50"
                      style={{ top: index * HOUR_HEIGHT }}
                    />
                  ))}

                  {showNow ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 z-10"
                      style={{
                        top: ((nowMinutes - gridStartMin) / 60) * HOUR_HEIGHT,
                      }}
                    >
                      <div className="relative border-t-2 border-red-500">
                        <span className="absolute -top-1.5 -left-1.5 size-3 rounded-full bg-red-500" />
                      </div>
                    </div>
                  ) : null}

                  {laidOut.map((entry) => {
                    const top =
                      ((entry.startMin - gridStartMin) / 60) * HOUR_HEIGHT;
                    const heightPx = Math.max(
                      ((entry.endMin - entry.startMin) / 60) * HOUR_HEIGHT,
                      MIN_EVENT_HEIGHT
                    );
                    const widthPct = 100 / entry.colCount;
                    return (
                      <ScheduleEvent
                        key={entry.item.session.id}
                        item={entry.item}
                        coaches={coaches}
                        view={view}
                        date={date}
                        variant="block"
                        className="z-[1]"
                        style={{
                          top,
                          height: heightPx,
                          left: `calc(${entry.col * widthPct}% + 2px)`,
                          width: `calc(${widthPct}% - 4px)`,
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
