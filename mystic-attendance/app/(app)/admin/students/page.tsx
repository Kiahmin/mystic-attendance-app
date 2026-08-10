import { requireRole } from "@/lib/auth/profile";
import { listStudents } from "@/lib/queries/students";
import { StudentList } from "@/components/admin/student-list";
import { PageHeader } from "@/components/layout/page-header";

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
      <PageHeader
        title="Student Roster"
        description="Manage skater profiles, skill levels, and enrolments."
      />
      <StudentList students={students} initialSearch={params.q ?? ""} />
    </div>
  );
}
