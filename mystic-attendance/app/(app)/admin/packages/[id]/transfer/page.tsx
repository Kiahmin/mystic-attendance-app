import Link from "next/link";
import { notFound } from "next/navigation";
import { BackButton } from "@/components/layout/back-button";
import { requireRole } from "@/lib/auth/profile";
import { getPackageWithStudent } from "@/lib/queries/packages";
import { listStudentDirectory } from "@/lib/queries/students";
import {
  canTransferPackageCredits,
  packageLabel,
  packageStudentNames,
} from "@/lib/package-utils";
import { TransferCreditsForm } from "@/components/admin/transfer-credits-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function TransferPackageCreditsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;
  const [pkg, students] = await Promise.all([
    getPackageWithStudent(id),
    listStudentDirectory(),
  ]);

  if (!pkg) notFound();

  const backHref = `/admin/students/${pkg.student_id}`;
  const label = packageLabel(pkg, pkg.package_products);
  const names = packageStudentNames(pkg, pkg.students.full_name);
  const canTransfer = canTransferPackageCredits(pkg);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <BackButton fallbackHref={backHref} className="mb-2" />
        <PageHeader
          title="Transfer credits"
          description={`Move leftover lessons from ${names}'s ${label} to another student.`}
        />
      </div>

      {!canTransfer ? (
        <Alert>
          <AlertTitle>Cannot transfer</AlertTitle>
          <AlertDescription>
            Only paid class packages with remaining credits can transfer leftover
            lessons.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Leftover lessons</CardTitle>
            <CardDescription>
              The destination student gets a new paid package with the same
              product and expiry. These credits leave this pack.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <TransferCreditsForm
              packageId={pkg.id}
              fromStudentId={pkg.student_id}
              remainingCredits={pkg.remaining_credits}
              students={students
                .filter((student) => !student.archived_at)
                .map((student) => ({
                  id: student.id,
                  full_name: student.full_name,
                  payer_id: student.payer_id,
                }))}
              preferredPayerId={pkg.payer_id ?? pkg.students.payer_id ?? null}
            />
            <Link
              href={backHref}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className: "h-11 w-full",
                })
              )}
            >
              Cancel
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
