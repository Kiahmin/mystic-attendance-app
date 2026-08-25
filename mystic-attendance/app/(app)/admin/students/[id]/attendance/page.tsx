import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { attendanceCreditState } from "@/lib/attendance-utils";
import { listAttendanceForStudent } from "@/lib/queries/attendance";
import { getStudentById } from "@/lib/queries/students";
import { StudentAttendanceHistory } from "@/components/admin/student-attendance-history";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StudentAttendanceEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

function summarise(entries: StudentAttendanceEntry[]) {
  let attended = 0;
  let missed = 0;
  let creditsUsed = 0;
  let awaitingPayment = 0;

  for (const entry of entries) {
    switch (entry.status) {
      case "present":
        attended += 1;
        break;
      case "absent":
      case "no_show":
        missed += 1;
        break;
      default:
        break;
    }

    const credit = attendanceCreditState(entry);
    if (credit === "charged") creditsUsed += 1;
    if (credit === "uncharged") awaitingPayment += 1;
  }

  return {
    total: entries.length,
    attended,
    missed,
    creditsUsed,
    awaitingPayment,
  };
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card px-4 py-3">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

export default async function AdminStudentAttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;

  const [student, entries] = await Promise.all([
    getStudentById(id),
    listAttendanceForStudent(id),
  ]);

  if (!student) notFound();

  const summary = summarise(entries);

  return (
    <div className="space-y-6">
      <Link
        href={`/admin/students/${student.id}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 w-fit"
        )}
      >
        <ArrowLeft className="size-4" />
        Back to {student.full_name}
      </Link>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl">Attendance History</h1>
          {student.archived_at ? (
            <Badge variant="secondary">Archived</Badge>
          ) : null}
          {student.is_trial ? <Badge variant="warning">Trial</Badge> : null}
        </div>
        <p className="text-sm text-muted-foreground">
          Every record marked for {student.full_name}, newest first.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <SummaryStat label="Records" value={summary.total} />
        <SummaryStat label="Attended" value={summary.attended} />
        <SummaryStat label="Missed" value={summary.missed} />
        <SummaryStat label="Credits Used" value={summary.creditsUsed} />
        <SummaryStat label="Awaiting Payment" value={summary.awaitingPayment} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Records</CardTitle>
          <CardDescription>
            Filter by status, sort by date, and hide columns you do not need.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentAttendanceHistory
            entries={entries}
            isTrial={student.is_trial}
          />
        </CardContent>
      </Card>
    </div>
  );
}
