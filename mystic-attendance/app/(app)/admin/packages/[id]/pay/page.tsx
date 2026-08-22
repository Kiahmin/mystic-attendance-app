import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { markPackagePaidFormAction } from "@/lib/actions/packages";
import {
  getPackageWithStudent,
  countUnchargedAttendanceForPackage,
} from "@/lib/queries/packages";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  defaultAmountForProduct,
  packageLabel,
  unchargedClassesNote,
} from "@/lib/package-utils";
import { PageHeader } from "@/components/layout/page-header";
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
  const pkg = await getPackageWithStudent(id);

  if (!pkg) notFound();

  const unchargedCount = await countUnchargedAttendanceForPackage(pkg);
  const backfillNote = unchargedClassesNote(
    unchargedCount,
    pkg.remaining_credits,
    pkg.session_id ? "event" : "class"
  );

  const backHref = `/admin/students/${pkg.student_id}`;
  const label = packageLabel(pkg, pkg.package_products);

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
            .
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
          <CardContent>
            <form action={markPackagePaidFormAction} className="space-y-5">
              <input type="hidden" name="package_id" value={pkg.id} />

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">Method</legend>
                <div className="grid gap-2">
                  {PAYMENT_METHODS.map((method, index) => (
                    <label
                      key={method}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/80 px-3 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method}
                        defaultChecked={index === 0}
                        className="size-4 accent-primary"
                        required
                      />
                      <span className="text-sm">
                        {PAYMENT_METHOD_LABELS[method]}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="space-y-2">
                <label htmlFor="amount_sgd" className="text-sm font-medium">
                  Amount
                </label>
                <input
                  id="amount_sgd"
                  name="amount_sgd"
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  defaultValue={defaultAmount(pkg)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </div>

              {backfillNote ? (
                <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                  {backfillNote}
                </p>
              ) : null}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  className={cn(buttonVariants({ className: "h-11 w-full" }))}
                >
                  Confirm Payment
                </button>
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
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
