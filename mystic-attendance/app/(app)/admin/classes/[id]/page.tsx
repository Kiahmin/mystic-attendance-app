import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { getClassById } from "@/lib/queries/classes";
import { listCoaches } from "@/lib/queries/profiles";
import { ClassForm } from "@/components/admin/class-form";
import { ClassRoster } from "@/components/admin/class-roster";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function AdminClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;

  const [classDetail, coaches] = await Promise.all([
    getClassById(id),
    listCoaches(),
  ]);

  if (!classDetail) notFound();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/admin/classes">
            <ArrowLeft className="size-4" />
            Classes
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {classDetail.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Edit schedule and manage the class roster.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class details</CardTitle>
          <CardDescription>
            Name, day, time, and assigned coach.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClassForm classGroup={classDetail} coaches={coaches} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roster</CardTitle>
          <CardDescription>
            {classDetail.enrolments.length} enrolled student
            {classDetail.enrolments.length === 1 ? "" : "s"}. Enrol more from
            a student&apos;s profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClassRoster
            classId={classDetail.id}
            enrolments={classDetail.enrolments}
          />
        </CardContent>
      </Card>
    </div>
  );
}
