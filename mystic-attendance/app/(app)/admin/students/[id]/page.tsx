import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck, Plus, UserRound } from "lucide-react";
import { ageFromDob, SKILL_LEVEL_LABELS } from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import { payerLabel } from "@/lib/payer-utils";
import { listClasses } from "@/lib/queries/classes";
import { listPackagesForStudent, listPackageCreditTransfers } from "@/lib/queries/packages";
import { getStudentById, listStudents } from "@/lib/queries/students";
import { listPayers } from "@/lib/queries/payers";
import { ArchiveStudentButton } from "@/components/admin/archive-student-button";
import { EnrolmentManager } from "@/components/admin/enrolment-manager";
import { StudentForm } from "@/components/admin/student-form";
import { StudentPackages } from "@/components/admin/student-packages";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;

  const [student, classes, packages, payers, students] = await Promise.all([
    getStudentById(id),
    listClasses({ activeOnly: true }),
    listPackagesForStudent(id),
    listPayers(),
    listStudents(),
  ]);

  if (!student) notFound();

  const transfers = await listPackageCreditTransfers(
    packages.map((pkg) => pkg.id)
  );

  const age = ageFromDob(student.date_of_birth);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/admin/students"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 w-fit"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Students
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/students/${student.id}/attendance`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <CalendarCheck className="size-4" />
            Attendance History
          </Link>
          <ArchiveStudentButton
            studentId={student.id}
            studentName={student.full_name}
            archived={Boolean(student.archived_at)}
          />
        </div>
      </div>

      {student.archived_at ? (
        <Alert>
          <AlertTitle>Archived</AlertTitle>
          <AlertDescription>
            This student is hidden from the roster, class lists, and check-in.
            Unarchive them to restore those views. Enrolments are kept.
          </AlertDescription>
        </Alert>
      ) : null}

      {student.is_minor ? (
        <Alert className="border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTitle>Guardian Consent Required</AlertTitle>
          <AlertDescription className="text-destructive/90">
            This student is under 18
            {student.guardian_name
              ? ` · Guardian on file: ${student.guardian_name}`
              : " and needs a guardian on file"}
            .
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="xl:col-span-1">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <UserRound className="size-8" />
              </div>
              <div className="min-w-0 space-y-2">
                <CardTitle className="font-heading text-xl">
                  {student.full_name}
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  {student.archived_at ? (
                    <Badge variant="secondary">Archived</Badge>
                  ) : null}
                  {student.is_trial ? (
                    <Badge variant="warning">Trial</Badge>
                  ) : null}
                  {student.skill_level ? (
                    <Badge variant="secondary">
                      {SKILL_LEVEL_LABELS[student.skill_level]}
                    </Badge>
                  ) : null}
                  {age != null ? (
                    <Badge variant="outline">Age {age}</Badge>
                  ) : null}
                </div>
                <CardDescription>
                  {student.payer
                    ? `Payer: ${payerLabel(student.payer)}`
                    : "No payer on file"}
                  {student.contact_phone
                    ? ` · ${student.contact_phone}`
                    : ""}
                  {student.date_of_birth
                    ? ` · DOB ${student.date_of_birth}`
                    : ""}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Current Enrolments</CardTitle>
            <CardDescription>
              A student can be enrolled in multiple classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EnrolmentManager
              studentId={student.id}
              enrolments={student.enrolments}
              availableClasses={classes}
            />
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Packages</CardTitle>
            <div className="flex items-center justify-between gap-3">
              <CardDescription>
                Lesson credits, payment status, expiry, and pauses.
              </CardDescription>
              <Link
                href={`/admin/packages/assign?studentId=${student.id}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                <Plus className="size-4" />
                Assign New Package
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <StudentPackages
              packages={packages}
              transfers={transfers}
              studentId={student.id}
              students={students.map((item) => ({
                id: item.id,
                full_name: item.full_name,
              }))}
            />
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>
              Name, contact, skill, and guardian details for this student.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentForm student={student} payers={payers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
