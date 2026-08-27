import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { DashboardQueueList } from "@/components/admin/dashboard-queue-row";

type DashboardQueuePanelProps = {
  title: string;
  description: string;
  count: number;
  listLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  footerHref: string;
  footerLabel: string;
  filter?: React.ReactNode;
  children?: React.ReactNode;
};

export function DashboardQueuePanel({
  title,
  description,
  count,
  listLabel,
  emptyTitle,
  emptyDescription,
  footerHref,
  footerLabel,
  filter,
  children,
}: DashboardQueuePanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="space-y-1">
          <h3 className="font-heading text-base leading-snug font-medium">
            {title}
          </h3>
          <CardDescription className="line-clamp-2 min-h-10">
            {description}
          </CardDescription>
        </div>
        <CardAction>
          <span
            className="rounded-md bg-muted px-2 py-1 text-sm font-medium tabular-nums"
            aria-label={`${count} in ${title}`}
          >
            {count}
          </span>
        </CardAction>
      </CardHeader>
      {filter ? <div className="px-4">{filter}</div> : null}
      <CardContent className="flex min-h-0 flex-1 flex-col">
        {count === 0 ? (
          <div
            role="status"
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 text-center"
          >
            <div>
              <p className="font-medium">{emptyTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {emptyDescription}
              </p>
            </div>
          </div>
        ) : (
          <DashboardQueueList label={listLabel}>
            {children}
          </DashboardQueueList>
        )}
      </CardContent>
      <CardFooter
        className={
          count === 0
            ? "mt-auto justify-end gap-3"
            : "mt-auto justify-between gap-3"
        }
      >
        {count > 0 ? (
          <span className="min-w-0 truncate text-sm text-muted-foreground">
            {count} shown
          </span>
        ) : null}
        <Link
          href={footerHref}
          className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          {footerLabel}
        </Link>
      </CardFooter>
    </Card>
  );
}
