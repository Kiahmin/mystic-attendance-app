import { requireRole } from "@/lib/auth/profile";
import { listClasses } from "@/lib/queries/classes";
import { listCoaches } from "@/lib/queries/profiles";
import { listVenues } from "@/lib/queries/venues";
import { ClassList } from "@/components/admin/class-list";

export default async function AdminClassesPage() {
  await requireRole(["admin"]);

  const [classes, coaches, venues] = await Promise.all([
    listClasses(),
    listCoaches(),
    listVenues(),
  ]);

  return <ClassList classes={classes} coaches={coaches} venues={venues} />;
}
