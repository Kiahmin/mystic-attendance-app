"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DAY_OF_WEEK_SHORT_LABELS } from "@/lib/admin-utils";
import type {
  MonthlyDayCheckIns,
  MonthlyVenueCheckIns,
} from "@/lib/queries/dashboard";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DashboardMonthlyAttendanceProps = {
  reportMonth: string;
  monthCheckInCount: number;
  byVenue: MonthlyVenueCheckIns[];
  byDay: MonthlyDayCheckIns[];
};

export function DashboardMonthlyAttendance({
  reportMonth,
  monthCheckInCount,
  byVenue,
  byDay,
}: DashboardMonthlyAttendanceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const maxVenueTotal = Math.max(1, ...byVenue.map((item) => item.total));

  function onMonthChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete("reportMonth");
    } else {
      params.set("reportMonth", value);
    }
    const query = params.toString();
    router.push(query ? `/admin?${query}` : "/admin");
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <h2
            id="dashboard-reporting"
            className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            Reporting
          </h2>
          <CardTitle>Monthly attendance</CardTitle>
          <CardDescription>
            Present check-ins by venue and weekday in Singapore time.
          </CardDescription>
        </div>
        <CardAction>
          <div className="space-y-1">
            <Label htmlFor="report-month" className="text-xs">
              Month
            </Label>
            <Input
              id="report-month"
              type="month"
              value={reportMonth}
              onChange={(event) => onMonthChange(event.target.value)}
              className="w-44"
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-sm font-medium">By venue</h3>
            <span className="text-xs text-muted-foreground">
              {monthCheckInCount} check-ins
            </span>
          </div>
          {byVenue.length === 0 ? (
            <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
              No present check-ins in this month.
            </p>
          ) : (
            <div className="space-y-3">
              {byVenue.map((item) => (
                <div key={item.venue} className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="truncate">{item.venue}</span>
                    <strong className="tabular-nums">{item.total}</strong>
                  </div>
                  <div
                    role="meter"
                    aria-label={`${item.venue} check-ins`}
                    aria-valuemin={0}
                    aria-valuemax={maxVenueTotal}
                    aria-valuenow={item.total}
                    aria-valuetext={`${item.total} of ${maxVenueTotal}`}
                    className="h-2 overflow-hidden rounded-full bg-muted"
                  >
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{
                        width: `${(item.total / maxVenueTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-medium">By class day</h3>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {byDay.map((item) => (
              <div
                key={item.day}
                className="rounded-lg border border-border/70 bg-muted/30 px-2 py-3 text-center"
              >
                <span className="text-xs text-muted-foreground">
                  {DAY_OF_WEEK_SHORT_LABELS[item.day]}
                </span>
                <p className="font-heading text-xl font-semibold tabular-nums">
                  {item.total}
                </p>
                <span className="text-[11px] text-muted-foreground">
                  check-ins
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
