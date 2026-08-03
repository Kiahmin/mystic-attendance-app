import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { SessionWithClass } from "@/lib/types";
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

interface SessionCardProps {
  session: SessionWithClass;
  href: string;
  expectedCount?: number;
  checkedInCount?: number;
  packageAlerts?: number;
}

export function SessionCard({
  session,
  href,
  expectedCount,
  checkedInCount,
  packageAlerts,
}: SessionCardProps) {
  const { classes: classGroup } = session;

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
                {formatSessionTime(classGroup.start_time)} –{" "}
                {formatSessionTime(classGroup.end_time)}
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
                <Badge variant="outline" className="border-amber-500 text-amber-700">
                  {packageAlerts} package alert{packageAlerts === 1 ? "" : "s"}
                </Badge>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
