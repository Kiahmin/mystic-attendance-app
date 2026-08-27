import Link from "next/link";
import { formatSingaporeDateTime } from "@/lib/datetime";
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

type DashboardInformedPanelProps = {
  items: DashboardQueueItem[];
};

export function DashboardInformedPanel({ items }: DashboardInformedPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Follow-up queue
          </p>
          <CardTitle>Informed</CardTitle>
          <CardDescription>
            Waiting for a renewal package to be assigned.
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
            <p className="font-medium">No follow-ups yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use Inform on a due-soon student to place them here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
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
                  <p className="mt-1 text-xs text-muted-foreground">
                    Informed{" "}
                    {item.informedAt
                      ? formatSingaporeDateTime(item.informedAt)
                      : "—"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Link
                    href={`/admin/packages/assign?studentId=${item.studentId}`}
                    className={buttonVariants({ size: "sm" })}
                  >
                    Paid
                  </Link>
                  <Link
                    href={`/admin/students/${item.studentId}`}
                    className={buttonVariants({ size: "sm", variant: "ghost" })}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <span className="text-sm text-muted-foreground">
          Payment is recorded when a new package is assigned
        </span>
        <Link
          href="/admin/packages?filter=finishing"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          View finishing packages →
        </Link>
      </CardFooter>
    </Card>
  );
}
