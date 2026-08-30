import { requireRole } from "@/lib/auth/profile";
import { listClasses } from "@/lib/queries/classes";
import { listTrialPackageProducts } from "@/lib/queries/packages";
import { listStudents } from "@/lib/queries/students";
import { listPayers } from "@/lib/queries/payers";
import { AddStudentButton, StudentList } from "@/components/admin/student-list";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; inactive?: string }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const [students, trialProducts, classes, payers] = await Promise.all([
    listStudents(params.q),
    listTrialPackageProducts(),
    listClasses({ activeOnly: true }),
    listPayers(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        className="sm:items-end"
        title="Students"
        description="Manage student profiles, skill levels, and package statuses."
      >
        <AddStudentButton trialProducts={trialProducts} payers={payers} />
      </PageHeader>
      <StudentList
        students={students}
        classes={classes.map((cls) => ({
          id: cls.id,
          venue: cls.venue,
          day_of_week: cls.day_of_week,
          start_time: cls.start_time,
        }))}
        initialSearch={params.q ?? ""}
      />
    </div>
  );
}
