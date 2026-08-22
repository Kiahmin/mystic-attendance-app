"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DAY_OF_WEEK_SHORT_LABELS,
  minutesToTime,
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
const SNAP_MINUTES = 30;
const CLICK_DURATION_MINUTES = 60;

type CreateEventDraft = {
  date: string;
  startTime?: string;
  endTime?: string;
};

type ScheduleTimeGridProps = {
  dates: string[];
  sessions: DashboardSession[];
  coaches: Pick<Profile, "id" | "full_name">[];
  view: CalendarView;
  date: string;
  onCreateEvent?: (draft: CreateEventDraft) => void;
};

type DragSelect = {
  day: string;
  originMin: number;
  currentMin: number;
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

function snapMinutes(value: number, start: number, end: number) {
  const snapped = Math.round(value / SNAP_MINUTES) * SNAP_MINUTES;
  return Math.min(end, Math.max(start, snapped));
}

function minutesFromClientY(
  clientY: number,
  column: HTMLElement,
  gridStartMin: number,
  gridEndMin: number
) {
  const rect = column.getBoundingClientRect();
  const ratio = (clientY - rect.top) / Math.max(rect.height, 1);
  const raw = gridStartMin + ratio * (gridEndMin - gridStartMin);
  return snapMinutes(raw, gridStartMin, gridEndMin);
}

export function ScheduleTimeGrid({
  dates,
  sessions,
  coaches,
  view,
  date,
  onCreateEvent,
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
  const [drag, setDrag] = useState<DragSelect | null>(null);
  const dragRef = useRef<DragSelect | null>(null);

  function setDragSelect(next: DragSelect | null) {
    dragRef.current = next;
    setDrag(next);
  }

  function beginSelect(
    event: React.PointerEvent<HTMLDivElement>,
    day: string
  ) {
    if (!onCreateEvent) return;
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-schedule-event]")) return;

    const column = event.currentTarget;
    const minutes = minutesFromClientY(
      event.clientY,
      column,
      gridStartMin,
      gridEndMin
    );
    setDragSelect({ day, originMin: minutes, currentMin: minutes });
    column.setPointerCapture(event.pointerId);
  }

  function moveSelect(event: React.PointerEvent<HTMLDivElement>, day: string) {
    const current = dragRef.current;
    if (!current || current.day !== day) return;
    const minutes = minutesFromClientY(
      event.clientY,
      event.currentTarget,
      gridStartMin,
      gridEndMin
    );
    setDragSelect({ ...current, currentMin: minutes });
  }

  function endSelect(event: React.PointerEvent<HTMLDivElement>, day: string) {
    const current = dragRef.current;
    setDragSelect(null);
    if (!current || current.day !== day || !onCreateEvent) return;

    const minutes = minutesFromClientY(
      event.clientY,
      event.currentTarget,
      gridStartMin,
      gridEndMin
    );
    const startMin = Math.min(current.originMin, minutes);
    const endMin = Math.max(current.originMin, minutes);
    const duration =
      endMin - startMin >= SNAP_MINUTES
        ? endMin - startMin
        : CLICK_DURATION_MINUTES;
    const clampedEnd = Math.min(gridEndMin, startMin + duration);
    const finalStart =
      clampedEnd - startMin < SNAP_MINUTES
        ? Math.max(gridStartMin, clampedEnd - SNAP_MINUTES)
        : startMin;

    onCreateEvent({
      date: day,
      startTime: minutesToTime(finalStart),
      endTime: minutesToTime(Math.max(finalStart + SNAP_MINUTES, clampedEnd)),
    });
  }

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
                  <div
                    className="absolute inset-0 z-0 cursor-pointer select-none"
                    onPointerDown={(event) => beginSelect(event, day)}
                    onPointerMove={(event) => moveSelect(event, day)}
                    onPointerUp={(event) => endSelect(event, day)}
                    onPointerCancel={() => setDragSelect(null)}
                  />
                  {hours.map((hour, index) => (
                    <div
                      key={hour}
                      className="pointer-events-none absolute inset-x-0 border-t border-border/50"
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

                  {drag && drag.day === day ? (
                    <div
                      className="pointer-events-none absolute inset-x-1 z-[2] rounded-md border border-chart-3/40 bg-chart-3/20"
                      style={{
                        top:
                          ((Math.min(drag.originMin, drag.currentMin) -
                            gridStartMin) /
                            60) *
                          HOUR_HEIGHT,
                        height: Math.max(
                          (Math.max(
                            SNAP_MINUTES,
                            Math.abs(drag.currentMin - drag.originMin)
                          ) /
                            60) *
                            HOUR_HEIGHT,
                          MIN_EVENT_HEIGHT
                        ),
                      }}
                    />
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
                        className="z-[1] pointer-events-auto"
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
