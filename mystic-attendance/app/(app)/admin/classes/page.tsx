import { requireRole } from "@/lib/auth/profile";
import { listClasses } from "@/lib/queries/classes";
import { listCoaches } from "@/lib/queries/profiles";
import { ClassList } from "@/components/admin/class-list";

export default async function AdminClassesPage() {
  await requireRole(["admin"]);

  const [classes, coaches] = await Promise.all([
    listClasses(),
    listCoaches(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Classes</h1>
        <p className="text-sm text-muted-foreground">
          Configure class groups, schedule, and coaches.
        </p>
      </div>

      <ClassList classes={classes} coaches={coaches} />
    </div>
  );
}
