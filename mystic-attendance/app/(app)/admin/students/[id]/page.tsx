import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { ageFromDob, SKILL_LEVEL_LABELS } from "@/lib/admin-utils";
import { packageIsTrialProduct } from "@/lib/package-utils";
import { listClasses } from "@/lib/queries/classes";
import {
  listPackagesForStudent,
  listTrialPackageProducts,
} from "@/lib/queries/packages";
import { getStudentById } from "@/lib/queries/students";
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

  const [student, classes, packages, trialProducts] = await Promise.all([
    getStudentById(id),
    listClasses({ activeOnly: true }),
    listPackagesForStudent(id),
    listTrialPackageProducts(),
  ]);

  if (!student) notFound();

  const age = ageFromDob(student.date_of_birth);
  const hasTrialPackage = packages.some(packageIsTrialProduct);

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
      </div>

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
                  {student.contact_phone ?? "No contact on file"}
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
            <CardDescription>
              Lesson credits, payment status, expiry, and pauses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentPackages studentId={student.id} packages={packages} />
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
            <StudentForm
              student={student}
              trialProducts={trialProducts}
              hasTrialPackage={hasTrialPackage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
