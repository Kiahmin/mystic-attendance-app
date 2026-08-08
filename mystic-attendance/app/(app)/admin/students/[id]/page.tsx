import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { listClasses } from "@/lib/queries/classes";
import { getStudentById } from "@/lib/queries/students";
import { EnrolmentManager } from "@/components/admin/enrolment-manager";
import { StudentForm } from "@/components/admin/student-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;

  const [student, classes] = await Promise.all([
    getStudentById(id),
    listClasses({ activeOnly: true }),
  ]);

  if (!student) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/students">
            <ArrowLeft className="size-4" />
            Students
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {student.full_name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Edit profile and class enrolments.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Name, contact, and skill details for this student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentForm student={student} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class enrolments</CardTitle>
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
    </div>
  );
}
