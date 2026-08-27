"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DAY_OF_WEEK_LETTER_LABELS,
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
import type { DashboardSession, Profile, Venue } from "@/lib/types";
import { ScheduleEvent } from "@/components/admin/schedule-event";
import { cn } from "@/lib/utils";

const MIN_HOUR_HEIGHT_PX = 48;
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
  venues: Venue[];
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

function offsetPct(minutes: number, gridStartMin: number, spanMin: number) {
  return ((minutes - gridStartMin) / spanMin) * 100;
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
  venues,
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
  const spanMin = Math.max(gridEndMin - gridStartMin, 60);
  const gridTemplateColumns = `minmax(2.5rem, 3.5rem) repeat(${dates.length}, minmax(0, 1fr))`;
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
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/70 bg-card">
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex min-h-full min-w-0 flex-col">
          <div
            className="sticky top-0 z-20 grid shrink-0 border-b border-border/60 bg-card"
            style={{ gridTemplateColumns }}
          >
            <div />
            {dates.map((day) => {
              const weekday = dayOfWeekForDate(day);
              const isToday = day === today;
              return (
                <div
                  key={day}
                  className={cn(
                    "min-w-0 px-0.5 py-1.5 text-center sm:px-1 sm:py-2",
                    isToday && "bg-primary/5"
                  )}
                >
                  <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase sm:text-[11px]">
                    {weekday ? (
                      <>
                        <span className="sm:hidden">
                          {DAY_OF_WEEK_LETTER_LABELS[weekday]}
                        </span>
                        <span className="hidden sm:inline">
                          {DAY_OF_WEEK_SHORT_LABELS[weekday]}
                        </span>
                      </>
                    ) : null}
                  </p>
                  <p
                    className={cn(
                      "mx-auto mt-0.5 flex size-7 items-center justify-center text-xs font-semibold sm:mt-1 sm:size-8 sm:text-sm",
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
            className="relative grid min-h-0 min-w-0 flex-1"
            style={{
              gridTemplateColumns,
              minHeight: hours.length * MIN_HOUR_HEIGHT_PX,
            }}
          >
            <div className="relative">
              {hours.map((hour, index) => (
                <div
                  key={hour}
                  className={cn(
                    "absolute right-1 text-[10px] text-muted-foreground sm:right-2 sm:text-[11px]",
                    index > 0 && "-translate-y-1/2"
                  )}
                  style={{
                    top: `${hours.length ? (index / hours.length) * 100 : 0}%`,
                  }}
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
                    "relative min-w-0 border-l border-border/60",
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
                      style={{
                        top: `${hours.length ? (index / hours.length) * 100 : 0}%`,
                      }}
                    />
                  ))}

                  {showNow ? (
                    <div
                      className="pointer-events-none absolute inset-x-0 z-10"
                      style={{
                        top: `${offsetPct(nowMinutes, gridStartMin, spanMin)}%`,
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
                        top: `${offsetPct(
                          Math.min(drag.originMin, drag.currentMin),
                          gridStartMin,
                          spanMin
                        )}%`,
                        height: `${Math.max(
                          (Math.max(
                            SNAP_MINUTES,
                            Math.abs(drag.currentMin - drag.originMin)
                          ) /
                            spanMin) *
                            100,
                          0
                        )}%`,
                        minHeight: MIN_EVENT_HEIGHT,
                      }}
                    />
                  ) : null}

                  {laidOut.map((entry) => {
                    const widthPct = 100 / entry.colCount;
                    return (
                      <ScheduleEvent
                        key={entry.item.session.id}
                        item={entry.item}
                        coaches={coaches}
                        venues={venues}
                        view={view}
                        date={date}
                        variant="block"
                        className="z-[1] pointer-events-auto min-h-[1.375rem]"
                        style={{
                          top: `${offsetPct(entry.startMin, gridStartMin, spanMin)}%`,
                          height: `${((entry.endMin - entry.startMin) / spanMin) * 100}%`,
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
