import Link from "next/link";
import { Pause, Play, Plus, Wallet } from "lucide-react";
import { resumePackageFormAction } from "@/lib/actions/packages";
import { formatCalendarDate, todayInSingapore } from "@/lib/datetime";
import {
  PACKAGE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  canPausePackage,
  canResumePackage,
  formatAmountSgd,
  formatPackageExpiry,
  isCustomisedPackage,
  packageCreditBreakdown,
  packageLabel,
} from "@/lib/package-utils";
import type { Package, PackageStatus } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type StudentPackagesProps = {
  studentId: string;
  packages: Package[];
};

const STATUS_CLASS: Record<PackageStatus, string> = {
  unpaid: "bg-warning/15 text-warning",
  active: "bg-primary/15 text-primary",
  paused: "bg-secondary text-secondary-foreground",
  expired: "bg-destructive/10 text-destructive",
  exhausted: "border border-border text-foreground",
};

export function StudentPackages({ studentId, packages }: StudentPackagesProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Credits, payment, expiry, and pause history for this skater.
        </p>
        <Link
          href={`/admin/packages/assign?studentId=${studentId}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Plus className="size-4" />
          Assign New Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-6 text-center">
          <p className="font-medium">No packages yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Assign a lesson package after payment to track credits.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {packages.map((pkg) => (
            <li key={pkg.id}>
              <PackageCard pkg={pkg} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: PackageStatus }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium",
        STATUS_CLASS[status]
      )}
    >
      {PACKAGE_STATUS_LABELS[status]}
    </span>
  );
}

function PackageCard({ pkg }: { pkg: Package }) {
  const assignedDate = pkg.created_at?.slice(0, 10);
  const defaultResumeDate =
    pkg.pause_ends_at && pkg.pause_ends_at <= todayInSingapore()
      ? pkg.pause_ends_at
      : todayInSingapore();
  const creditBreakdown = packageCreditBreakdown(pkg, pkg.package_products);

  return (
    <div className="rounded-xl border border-border/70 bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold text-primary">
              {packageLabel(pkg, pkg.package_products)}
            </h4>
            <StatusPill status={pkg.status} />
            {isCustomisedPackage(pkg, pkg.package_products) ? (
              <span className="inline-flex h-5 items-center rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground">
                Custom
              </span>
            ) : null}
          </div>
          {creditBreakdown ? (
            <p className="text-xs text-muted-foreground">{creditBreakdown}</p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            {assignedDate
              ? `Assigned ${formatCalendarDate(assignedDate)}`
              : "Assigned"}
            {pkg.first_lesson_date
              ? ` · First lesson ${formatCalendarDate(pkg.first_lesson_date)}`
              : " · Not started"}
          </p>
        </div>

        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-3xl font-semibold">{pkg.remaining_credits}</p>
            <p className="text-xs tracking-wider text-muted-foreground uppercase">
              Credits Left
            </p>
          </div>
          <div className="text-center">
            <p className="mt-2 text-lg font-semibold">
              {pkg.expires_at
                ? formatCalendarDate(pkg.expires_at).replace(/^[A-Za-z]+,\s*/, "")
                : "—"}
            </p>
            <p className="text-xs tracking-wider text-muted-foreground uppercase">
              Expiry
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {pkg.is_paid ? (
            <span className="inline-flex rounded-md border border-dashed border-border px-2 py-0.5 text-xs">
              Paid in Full
              {pkg.payment_method
                ? ` · ${PAYMENT_METHOD_LABELS[pkg.payment_method]}`
                : ""}
              {pkg.amount_sgd != null
                ? ` · ${formatAmountSgd(pkg.amount_sgd)} SGD`
                : ""}
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
              Unpaid
            </span>
          )}
          {pkg.status === "expired" && pkg.forfeited_credits != null ? (
            <span className="inline-flex rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
              {pkg.forfeited_credits} forfeited
              {pkg.forfeited_at
                ? ` · ${formatCalendarDate(pkg.forfeited_at.slice(0, 10))}`
                : ""}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {!pkg.is_paid ? (
            <Link
              href={`/admin/packages/${pkg.id}/pay`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Wallet className="size-3.5" />
              Mark as Paid
            </Link>
          ) : null}
          {canPausePackage(pkg) ? (
            <Link
              href={`/admin/packages/${pkg.id}/pause`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Pause className="size-3.5" />
              Pause
            </Link>
          ) : null}
          {canResumePackage(pkg) ? (
            <form action={resumePackageFormAction} className="inline-flex">
              <input type="hidden" name="package_id" value={pkg.id} />
              <input type="hidden" name="resumed_at" value={defaultResumeDate} />
              <button
                type="submit"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                <Play className="size-3.5" />
                Resume
              </button>
            </form>
          ) : null}
        </div>
      </div>

      {pkg.customisation_notes ? (
        <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Customisation notes
          </p>
          <p className="mt-1 text-foreground">{pkg.customisation_notes}</p>
        </div>
      ) : null}

      {pkg.paused_at ? (
        <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          <p>
            Pause: {formatCalendarDate(pkg.paused_at)}
            {pkg.pause_ends_at
              ? ` → ${formatCalendarDate(pkg.pause_ends_at)} (planned)`
              : ""}
            {pkg.resumed_at
              ? ` · resumed ${formatCalendarDate(pkg.resumed_at)}`
              : " · open"}
          </p>
          {pkg.paused_reason ? (
            <p className="mt-1">{pkg.paused_reason}</p>
          ) : null}
          {pkg.expires_at ? (
            <p className="mt-1">
              Current expiry: {formatPackageExpiry(pkg.expires_at)}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
