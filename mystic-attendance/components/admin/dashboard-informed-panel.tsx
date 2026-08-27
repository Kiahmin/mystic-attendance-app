import { formatSingaporeDateTime } from "@/lib/datetime";
import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { DashboardQueuePanel } from "@/components/admin/dashboard-queue-panel";
import {
  AssignPackageLink,
  DashboardQueueRow,
} from "@/components/admin/dashboard-queue-row";

type DashboardInformedPanelProps = {
  items: DashboardQueueItem[];
};

function informedWhy(item: DashboardQueueItem): string {
  return item.informedAt
    ? `Informed ${formatSingaporeDateTime(item.informedAt)}`
    : "Informed — awaiting renewal";
}

export function DashboardInformedPanel({ items }: DashboardInformedPanelProps) {
  return (
    <DashboardQueuePanel
      title="Informed"
      description="Waiting for a renewal package to be assigned."
      count={items.length}
      listLabel="Informed students"
      emptyTitle="No informed students"
      emptyDescription="Use Inform on a due-soon student to place them here."
      footerHref="/admin/packages?filter=finishing"
      footerLabel="View finishing →"
    >
      {items.map((item) => (
        <DashboardQueueRow
          key={item.packageId}
          studentName={item.studentName}
          studentHref={`/admin/students/${item.studentId}`}
          why={informedWhy(item)}
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
