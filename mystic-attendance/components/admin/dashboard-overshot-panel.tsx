import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { InformButton } from "@/components/admin/inform-package-dialog";
import { DashboardQueuePanel } from "@/components/admin/dashboard-queue-panel";
import {
  AssignPackageLink,
  DashboardQueueRow,
} from "@/components/admin/dashboard-queue-row";

type DashboardOvershotPanelProps = {
  items: DashboardQueueItem[];
};

function overshotWhy(item: DashboardQueueItem): string {
  const extra = Math.max(0, -item.remainingCredits);
  return extra === 1 ? "1 extra lesson" : `${extra} extra lessons`;
}

export function DashboardOvershotPanel({ items }: DashboardOvershotPanelProps) {
  return (
    <DashboardQueuePanel
      title="Overshot"
      description="More lessons attended than purchased. Inform them or assign a renewal."
      count={items.length}
      listLabel="Overshot students"
      emptyTitle="No overshot students"
      emptyDescription="Extra lessons after a pack is finished will appear here."
      footerHref="/admin/packages?filter=overshot"
      footerLabel="View overshot →"
    >
      {items.map((item) => (
        <DashboardQueueRow
          key={item.packageId}
          studentName={item.studentName}
          studentHref={`/admin/students/${item.studentId}`}
          why={overshotWhy(item)}
          whyClassName="text-destructive"
          actions={
            <div className="flex items-center justify-end gap-1.5">
              <InformButton item={item} />
              <AssignPackageLink
                studentId={item.studentId}
                studentName={item.studentName}
              />
            </div>
          }
        />
      ))}
    </DashboardQueuePanel>
  );
}
