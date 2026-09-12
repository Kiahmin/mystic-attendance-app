import { formatSingaporeDateTime } from "@/lib/datetime";
import { remainingCreditsLabel } from "@/lib/package-utils";
import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { Badge } from "@/components/ui/badge";
import { DashboardQueuePanel } from "@/components/admin/dashboard-queue-panel";
import {
  AssignPackageLink,
  DashboardQueueRow,
} from "@/components/admin/dashboard-queue-row";

type DashboardInformedPanelProps = {
  items: DashboardQueueItem[];
};

function informedWhy(item: DashboardQueueItem): string {
  const informed = item.informedAt
    ? `Informed ${formatSingaporeDateTime(item.informedAt)}`
    : "Informed — awaiting renewal";
  if (item.status !== "overshot") return informed;
  return `${informed} · ${remainingCreditsLabel(item.remainingCredits)}`;
}

export function DashboardInformedPanel({ items }: DashboardInformedPanelProps) {
  return (
    <DashboardQueuePanel
      title="Informed"
      description="Waiting for a renewal package to be assigned."
      count={items.length}
      listLabel="Informed students"
      emptyTitle="No informed students"
      emptyDescription="Students told about a finishing pack will appear here until a renewal is assigned."
      footerHref="/admin/packages/assign"
      footerLabel="Assign a package →"
    >
      {items.map((item) => (
        <DashboardQueueRow
          key={item.packageId}
          studentName={item.studentName}
          studentHref={`/admin/students/${item.studentId}`}
          why={informedWhy(item)}
          whyClassName={item.status === "overshot" ? "text-destructive" : undefined}
          badge={
            item.status === "overshot" ? (
              <Badge variant="destructive">Overshot</Badge>
            ) : null
          }
          actions={
            <AssignPackageLink
              studentId={item.studentId}
              studentName={item.studentName}
            />
          }
        />
      ))}
    </DashboardQueuePanel>
  );
}
