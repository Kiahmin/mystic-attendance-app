import { requireRole } from "@/lib/auth/profile";
import { listStudents } from "@/lib/queries/students";
import { StudentList } from "@/components/admin/student-list";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const students = await listStudents(params.q);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage student profiles.
        </p>
      </div>

      <StudentList students={students} initialSearch={params.q ?? ""} />
    </div>
  );
}
