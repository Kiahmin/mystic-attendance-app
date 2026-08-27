import Link from "next/link";
import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { buttonVariants } from "@/components/ui/button-variants";
import { DashboardQueuePanel } from "@/components/admin/dashboard-queue-panel";
import { DashboardQueueRow } from "@/components/admin/dashboard-queue-row";

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
      description="More lessons attended than purchased. Assign a renewal."
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
            <Link
              href={`/admin/packages/assign?studentId=${item.studentId}`}
              className={buttonVariants({ size: "sm" })}
            >
              Renew
            </Link>
          }
        />
      ))}
    </DashboardQueuePanel>
  );
}
