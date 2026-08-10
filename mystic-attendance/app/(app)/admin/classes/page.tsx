import { requireRole } from "@/lib/auth/profile";
import { listClasses } from "@/lib/queries/classes";
import { listCoaches } from "@/lib/queries/profiles";
import { ClassList } from "@/components/admin/class-list";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminClassesPage() {
  await requireRole(["admin"]);

  const [classes, coaches] = await Promise.all([
    listClasses(),
    listCoaches(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes"
        description="Configure class groups, schedule, and coaches."
      />
      <ClassList classes={classes} coaches={coaches} />
    </div>
  );
}
