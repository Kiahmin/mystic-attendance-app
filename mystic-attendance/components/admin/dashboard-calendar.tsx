"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GenerateSessionsButton } from "@/components/admin/generate-sessions-button";
import { EventFormDialog } from "@/components/admin/event-form-dialog";
import { ScheduleMonthGrid } from "@/components/admin/schedule-month-grid";
import { ScheduleTimeGrid } from "@/components/admin/schedule-time-grid";
import { NavigationProgressBar } from "@/components/layout/navigation-progress";
import { buttonVariants } from "@/components/ui/button-variants";
import { datesInclusive, endOfMonth, todayInSingapore } from "@/lib/datetime";
import { minutesToTime, timeToMinutes } from "@/lib/admin-utils";
import {
  adminCalendarHref,
  CALENDAR_VIEWS,
  resolveCalendarRange,
  shiftCalendarDate,
  type CalendarRange,
  type CalendarView,
} from "@/lib/session-utils";
import type { DashboardSession, Profile, Venue } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VIEW_LABELS = {
  day: "Day",
  week: "Week",
  month: "Month",
} as const;

function addOneHour(time: string): string {
  const minutes = timeToMinutes(time);
  if (minutes === null) return "11:00";
  return minutesToTime(Math.min(23 * 60 + 59, minutes + 60));
}

type DashboardCalendarProps = {
  range: CalendarRange;
  sessions: DashboardSession[];
  coaches: Pick<Profile, "id" | "full_name">[];
  venues: Venue[];
};

export function DashboardCalendar({
  range,
  sessions,
  coaches,
  venues,
}: DashboardCalendarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState(range.view);
  const [date, setDate] = useState(range.date);
  const [showProgress, setShowProgress] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [venueFilter, setVenueFilter] = useState("all");
  const [draft, setDraft] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);
  const requested = useRef({ view: range.view, date: range.date });
  const today = todayInSingapore();
  const display = resolveCalendarRange({ view, date });
  const prevDate = shiftCalendarDate(date, view, -1);
  const nextDate = shiftCalendarDate(date, view, 1);
  const generateDates =
    display.view === "month"
      ? datesInclusive(display.monthStart, endOfMonth(display.monthStart))
      : display.dates;

  useEffect(() => {
    const expected = resolveCalendarRange(requested.current);
    if (
      range.view === expected.view &&
      range.start === expected.start &&
      range.end === expected.end
    ) {
      setView(range.view);
      setDate(range.date);
    }
  }, [range]);

  useEffect(() => {
    if (!isPending) {
      setShowProgress(false);
      return;
    }
    const timer = window.setTimeout(() => setShowProgress(true), 50);
    return () => window.clearTimeout(timer);
  }, [isPending]);

  function navigateTo(nextView: CalendarView, nextDate: string) {
    if (nextView === view && nextDate === date) return;
    requested.current = { view: nextView, date: nextDate };
    setView(nextView);
    setDate(nextDate);
    startTransition(() => {
      router.replace(adminCalendarHref({ view: nextView, date: nextDate }), {
        scroll: false,
      });
    });
  }

  function openCreateEvent(next: {
    date: string;
    startTime?: string;
    endTime?: string;
  }) {
    const startTime = next.startTime ?? "10:00";
    setDraft({
      date: next.date,
      startTime,
      endTime: next.endTime ?? addOneHour(startTime),
    });
    setCreateOpen(true);
  }

  const visibleSessions =
    venueFilter === "all"
      ? sessions
      : sessions.filter((item) => item.session.venue_id === venueFilter);

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3" aria-busy={isPending}>
      {showProgress ? <NavigationProgressBar /> : null}
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onMouseEnter={() =>
              router.prefetch(adminCalendarHref({ view, date: today }))
            }
            onClick={() => navigateTo(view, today)}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            Today
          </button>
          <div className="flex items-center">
            <button
              type="button"
              aria-label={`Previous ${view}`}
              onMouseEnter={() =>
                router.prefetch(adminCalendarHref({ view, date: prevDate }))
              }
              onClick={() => navigateTo(view, prevDate)}
              className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }))}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label={`Next ${view}`}
              onMouseEnter={() =>
                router.prefetch(adminCalendarHref({ view, date: nextDate }))
              }
              onClick={() => navigateTo(view, nextDate)}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon-sm" }),
                "ml-1"
              )}
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
          <p className="min-w-0 px-1 text-sm font-medium">{display.label}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={venueFilter} onValueChange={setVenueFilter}>
            <SelectTrigger
              className="h-8 w-[10.5rem]"
              aria-label="Filter venue"
            >
              <SelectValue placeholder="All venues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All venues</SelectItem>
              {venues
                .filter((venue) => venue.is_active)
                .map((venue) => (
                  <SelectItem key={venue.id} value={venue.id}>
                    {venue.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <div className="inline-flex h-8 items-stretch rounded-lg bg-muted p-[3px]">
            {CALENDAR_VIEWS.map((nextView) => (
              <button
                key={nextView}
                type="button"
                aria-current={view === nextView ? "page" : undefined}
                onMouseEnter={() =>
                  router.prefetch(adminCalendarHref({ view: nextView, date }))
                }
                onClick={() => navigateTo(nextView, date)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-full px-2.5",
                  view === nextView &&
                    "bg-background text-foreground shadow-sm hover:bg-background"
                )}
              >
                {VIEW_LABELS[nextView]}
              </button>
            ))}
          </div>
          <GenerateSessionsButton
            dates={generateDates}
            view={view}
            isToday={date === today}
          />
        </div>
      </div>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col transition-opacity",
          isPending && "opacity-60"
        )}
      >
      {view === "month" ? (
        <ScheduleMonthGrid
          dates={display.dates}
          monthStart={display.monthStart}
          sessions={visibleSessions}
          coaches={coaches}
          venues={venues}
          view={view}
          date={date}
          onCreateEvent={openCreateEvent}
        />
      ) : (
        <ScheduleTimeGrid
          dates={display.dates}
          sessions={visibleSessions}
          coaches={coaches}
          venues={venues}
          view={view}
          date={date}
          onCreateEvent={openCreateEvent}
        />
      )}
      </div>
      <EventFormDialog
        coaches={coaches}
        venues={venues}
        defaultDate={draft?.date ?? display.date}
        defaultStartTime={draft?.startTime}
        defaultEndTime={draft?.endTime}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </section>
  );
}
