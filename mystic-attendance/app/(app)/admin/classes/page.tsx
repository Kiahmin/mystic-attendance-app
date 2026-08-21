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

  return <ClassList classes={classes} coaches={coaches} />;
}
