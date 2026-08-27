import Link from "next/link";
import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardOvershotPanelProps = {
  items: DashboardQueueItem[];
};

export function DashboardOvershotPanel({ items }: DashboardOvershotPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Follow-up queue
          </p>
          <CardTitle>Overshot</CardTitle>
          <CardDescription>
            Attended more lessons than purchased. Assign a renewal to apply extras.
          </CardDescription>
        </div>
        <CardAction>
          <span className="rounded-md bg-muted px-2 py-1 text-sm font-medium tabular-nums">
            {items.length}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="font-medium">No overshot packages</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Extra lessons after a pack is finished will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const extra = Math.max(0, -item.remainingCredits);
              return (
                <div
                  key={item.packageId}
                  className="flex flex-col gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.studentName}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {(item.classNames.join(" · ") || "No class enrolled") +
                        " · " +
                        item.packageLabel}
                    </p>
                    <p className="mt-1 text-xs text-destructive">
                      {extra} extra lesson{extra === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                      href={`/admin/packages/assign?studentId=${item.studentId}`}
                      className={buttonVariants({ size: "sm" })}
                    >
                      Renew
                    </Link>
                    <Link
                      href={`/admin/students/${item.studentId}`}
                      className={buttonVariants({ size: "sm", variant: "ghost" })}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          {items.length} shown
        </span>
        <Link
          href="/admin/packages?filter=overshot"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View overshot packages →
        </Link>
      </CardFooter>
    </Card>
  );
}
