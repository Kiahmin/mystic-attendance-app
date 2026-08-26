import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import {
  getPackageWithStudent,
  countUnchargedAttendanceForPackage,
} from "@/lib/queries/packages";
import { listPayers } from "@/lib/queries/payers";
import {
  PAYMENT_METHOD_LABELS,
  defaultAmountForProduct,
  packageLabel,
  unchargedClassesNote,
} from "@/lib/package-utils";
import { formatInvoiceNumber } from "@/lib/invoice-utils";
import { payerLabel } from "@/lib/payer-utils";
import { PageHeader } from "@/components/layout/page-header";
import { MarkPackagePaidForm } from "@/components/admin/mark-package-paid-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Package } from "@/lib/types";

function defaultAmount(pkg: Package): string {
  if (pkg.amount_sgd != null && !Number.isNaN(pkg.amount_sgd)) {
    return String(pkg.amount_sgd);
  }
  if (pkg.package_products) {
    return String(defaultAmountForProduct(pkg.package_products));
  }
  return "";
}

export default async function MarkPackagePaidPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;
  const [pkg, payers] = await Promise.all([
    getPackageWithStudent(id),
    listPayers(),
  ]);

  if (!pkg) notFound();

  const unchargedCount = await countUnchargedAttendanceForPackage(pkg);
  const backfillNote = unchargedClassesNote(
    unchargedCount,
    pkg.remaining_credits,
    pkg.session_id ? "event" : "class"
  );

  const backHref = `/admin/students/${pkg.student_id}`;
  const label = packageLabel(pkg, pkg.package_products);
  const defaultPayerId = pkg.payer_id ?? pkg.students.payer_id ?? "";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <Link
          href={backHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 mb-2 w-fit"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Profile
        </Link>
        <PageHeader
          title="Mark Package as Paid"
          description={`Log payment for ${pkg.students.full_name}'s ${label}.`}
        />
      </div>

      {pkg.is_paid ? (
        <Alert>
          <AlertTitle>Already paid</AlertTitle>
          <AlertDescription>
            This package is already marked as paid
            {pkg.payment_method
              ? ` via ${PAYMENT_METHOD_LABELS[pkg.payment_method]}`
              : ""}
            {pkg.payer ? ` · ${payerLabel(pkg.payer)}` : ""}
            .
            {pkg.invoice ? (
              <>
                {" "}
                <Link
                  href={`/admin/invoices/${pkg.invoice.id}`}
                  className="underline underline-offset-2"
                >
                  {formatInvoiceNumber(pkg.invoice.invoice_number)}
                </Link>
              </>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Details</CardTitle>
            <CardDescription>
              Unpaid packages cannot be used at check-in until payment is
              logged.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <MarkPackagePaidForm
              packageId={pkg.id}
              studentId={pkg.student_id}
              defaultPayerId={defaultPayerId}
              defaultAmount={defaultAmount(pkg)}
              payers={payers}
              backfillNote={backfillNote}
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
