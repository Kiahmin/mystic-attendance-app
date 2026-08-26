import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { getClassById } from "@/lib/queries/classes";
import { listCoaches } from "@/lib/queries/profiles";
import { listVenues } from "@/lib/queries/venues";
import { ClassForm } from "@/components/admin/class-form";
import { ClassRoster } from "@/components/admin/class-roster";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function AdminClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;

  const [classDetail, coaches, venues] = await Promise.all([
    getClassById(id),
    listCoaches(),
    listVenues(),
  ]);

  if (!classDetail) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/classes"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 w-fit"
        )}
      >
        <ArrowLeft className="size-4" />
        Back to Classes
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          {classDetail.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Edit schedule and manage the class roster.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassForm
              classGroup={classDetail}
              coaches={coaches}
              venues={venues}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>
              {classDetail.enrolments.length} enrolled student
              {classDetail.enrolments.length === 1 ? "" : "s"}.
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
    </div>
  );
}
