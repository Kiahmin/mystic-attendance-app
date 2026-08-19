import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SessionWithClass } from "@/lib/types";
import {
  sessionDisplayEnd,
  sessionDisplayStart,
} from "@/lib/session-utils";
import {
  formatDate,
  formatSessionTime,
  CANCELLATION_REASON_LABELS,
} from "@/lib/attendance-utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  session: SessionWithClass;
  href: string;
  expectedCount?: number;
  checkedInCount?: number;
  packageAlerts?: number;
  variant?: "card" | "row";
}

export function SessionCard({
  session,
  href,
  expectedCount,
  checkedInCount,
  packageAlerts,
  variant = "card",
}: SessionCardProps) {
  const { classes: classGroup } = session;
  const startTime = sessionDisplayStart(session);
  const endTime = sessionDisplayEnd(session);
  const expected = expectedCount ?? 0;
  const checkedIn = checkedInCount ?? 0;
  const progress =
    expected > 0 ? Math.min(100, Math.round((checkedIn / expected) * 100)) : 0;

  if (variant === "row") {
    return (
      <Link
        href={href}
        className={cn(
          "grid gap-3 px-4 py-4 transition-colors hover:bg-muted/40 md:grid-cols-[1.4fr_1fr_0.8fr_1fr] md:items-center md:gap-4",
          session.cancelled && "bg-destructive/5"
        )}
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{classGroup.name}</p>
          <p className="text-xs text-muted-foreground md:hidden">
            {formatSessionTime(startTime)} –{" "}
            {formatSessionTime(endTime)}
          </p>
        </div>
        <p className="hidden text-sm text-muted-foreground md:block">
          {formatSessionTime(startTime)} –{" "}
          {formatSessionTime(endTime)}
        </p>
        <div className="space-y-1.5">
          {expectedCount !== undefined ? (
            <>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {checkedIn}/{expected}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {session.cancelled ? (
            <Badge variant="destructive">
              Cancelled
              {session.cancellation_reason
                ? ` · ${CANCELLATION_REASON_LABELS[session.cancellation_reason] ?? session.cancellation_reason}`
                : ""}
            </Badge>
          ) : (
            <Badge variant="success">Upcoming</Badge>
          )}
          {packageAlerts ? (
            <Badge variant="warning">
              {packageAlerts} alert{packageAlerts === 1 ? "" : "s"}
            </Badge>
          ) : null}
          <ChevronRight className="ml-auto hidden size-4 text-muted-foreground md:block" />
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="block">
      <Card
        className={
          session.cancelled
            ? "border-destructive/30 bg-destructive/5"
            : "transition-colors hover:border-primary/30 hover:bg-muted/30"
        }
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{classGroup.name}</CardTitle>
              <CardDescription>
                {formatDate(session.session_date)} ·{" "}
                {formatSessionTime(startTime)} –{" "}
                {formatSessionTime(endTime)}
              </CardDescription>
            </div>
            <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2">
          {session.cancelled ? (
            <Badge variant="destructive">
              Cancelled
              {session.cancellation_reason
                ? ` · ${CANCELLATION_REASON_LABELS[session.cancellation_reason] ?? session.cancellation_reason}`
                : ""}
            </Badge>
          ) : (
            <>
              {expectedCount !== undefined ? (
                <Badge variant="secondary">
                  {checkedInCount ?? 0}/{expectedCount} checked in
                </Badge>
              ) : null}
              {packageAlerts ? (
                <Badge variant="warning">
                  {packageAlerts} package alert
                  {packageAlerts === 1 ? "" : "s"}
                </Badge>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
