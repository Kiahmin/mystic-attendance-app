"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Wallet,
} from "lucide-react";
import { resumePackageFormAction } from "@/lib/actions/packages";
import { formatCalendarDate, todayInSingapore } from "@/lib/datetime";
import { payerLabel } from "@/lib/payer-utils";
import {
  PACKAGE_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  canPausePackage,
  canResumePackage,
  canTransferPackageCredits,
  formatAmountSgd,
  formatPackageExpiry,
  isCustomisedPackage,
  isPastPackage,
  packageCreditBreakdown,
  packageLabel,
} from "@/lib/package-utils";
import type {
  Package,
  PackageCreditTransfer,
  PackageStatus,
  Student,
} from "@/lib/types";
import { PackageMembersEditor } from "@/components/admin/package-members-editor";
import { PackageTabs } from "@/components/admin/package-tabs";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type StudentPackagesProps = {
  packages: Package[];
  transfers?: PackageCreditTransfer[];
  students: Pick<Student, "id" | "full_name">[];
  studentId: string;
};

const STATUS_CLASS: Record<PackageStatus, string> = {
  unpaid: "bg-warning/15 text-warning",
  active: "bg-primary/15 text-primary",
  paused: "bg-secondary text-secondary-foreground",
  expired: "bg-destructive/10 text-destructive",
  exhausted: "border border-border text-foreground",
  overshot: "bg-destructive/10 text-destructive",
};

const PAGE_SIZE = 5;

export function StudentPackages({
  packages,
  transfers = [],
  students,
  studentId,
}: StudentPackagesProps) {
  if (packages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-6 text-center">
        <p className="font-medium">No packages yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Assign a lesson package after payment to track credits.
        </p>
      </div>
    );
  }

  const today = todayInSingapore();
  const current: Package[] = [];
  const past: Package[] = [];
  for (const pkg of packages) {
    if (isPastPackage(pkg, today)) past.push(pkg);
    else current.push(pkg);
  }

  return (
    <PackageTabs
      currentCount={current.length}
      pastCount={past.length}
      pastUnpaidCount={past.filter((pkg) => !pkg.is_paid).length}
      current={
        <PackageCardList
          packages={current}
          transfers={transfers}
          students={students}
          studentId={studentId}
          emptyMessage="No current packages"
          emptyHint="Finished and expired packages are under Past."
        />
      }
      past={
        <PackageCardList
          packages={past}
          transfers={transfers}
          students={students}
          studentId={studentId}
          emptyMessage="No past packages yet"
          emptyHint="Packages move here once they are finished or expired."
        />
      }
    />
  );
}

function PackageCardList({
  packages,
  transfers,
  students,
  studentId,
  emptyMessage,
  emptyHint,
}: {
  packages: Package[];
  transfers: PackageCreditTransfer[];
  students: Pick<Student, "id" | "full_name">[];
  studentId: string;
  emptyMessage: string;
  emptyHint: string;
}) {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(
    packages.length === 1 ? packages[0].id : null
  );

  if (packages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-6 text-center">
        <p className="font-medium">{emptyMessage}</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyHint}</p>
      </div>
    );
  }

  const pageCount = Math.ceil(packages.length / PAGE_SIZE);
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageItems = packages.slice(pageStart, pageStart + PAGE_SIZE);
  const pageEnd = pageStart + pageItems.length;

  function goToPage(next: number) {
    setPage(next);
    setExpandedId(null);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
      <ul>
        {pageItems.map((pkg) => {
          const expanded = expandedId === pkg.id;
          return (
            <li
              key={pkg.id}
              className="border-b border-border/60 last:border-b-0"
            >
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() =>
                  setExpandedId((current) =>
                    current === pkg.id ? null : pkg.id
                  )
                }
                className="flex w-full items-start gap-3 px-4 py-3 text-left outline-none hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
              >
                <PackageSummary pkg={pkg} />
                <ChevronDown
                  className={cn(
                    "mt-1 size-4 shrink-0 text-muted-foreground transition-transform",
                    expanded && "rotate-180"
                  )}
                />
              </button>
              {expanded ? (
                <div className="border-t border-border/60 px-4 pt-4 pb-5">
                  <PackageCard
                    pkg={pkg}
                    transfers={transfers.filter(
                      (transfer) =>
                        transfer.from_package_id === pkg.id ||
                        transfer.to_package_id === pkg.id
                    )}
                    students={students}
                    studentId={studentId}
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
      {pageCount > 1 ? (
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
          <span>
            {`Showing ${pageStart + 1}–${pageEnd} of ${packages.length} packages`}
          </span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={currentPage <= 1}
              aria-label="Previous page"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="size-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={currentPage >= pageCount}
              aria-label="Next page"
              onClick={() => goToPage(Math.min(pageCount, currentPage + 1))}
            >
              <ChevronRight className="size-5" />
            </Button>
          </div>
        </div>
      ) : null}
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

function PackageSummary({ pkg }: { pkg: Package }) {
  const expiry = pkg.expires_at
    ? formatCalendarDate(pkg.expires_at).replace(/^[A-Za-z]+,\s*/, "")
    : "—";

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-primary">
            {packageLabel(pkg, pkg.package_products)}
          </span>
          <StatusPill status={pkg.status} />
          {isCustomisedPackage(pkg, pkg.package_products) ? (
            <span className="inline-flex h-5 items-center rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground">
              Custom
            </span>
          ) : null}
          {!pkg.is_paid ? (
            <span className="inline-flex h-5 items-center rounded-full bg-warning/15 px-2 text-xs font-medium text-warning">
              Unpaid
            </span>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {pkg.first_lesson_date
            ? `First lesson ${formatCalendarDate(pkg.first_lesson_date)}`
            : "Not started"}
        </p>
      </div>
      <div className="flex shrink-0 gap-6 sm:text-right">
        <div>
          <p className="text-lg font-semibold">
            {pkg.status === "overshot"
              ? `+${pkg.used_credits - pkg.total_credits}`
              : pkg.remaining_credits}
          </p>
          <p className="text-xs tracking-wider text-muted-foreground uppercase">
            {pkg.status === "overshot" ? "Extra" : "Credits"}
          </p>
        </div>
        <div>
          <p className="text-lg font-semibold">{expiry}</p>
          <p className="text-xs tracking-wider text-muted-foreground uppercase">
            Expiry
          </p>
        </div>
      </div>
    </div>
  );
}

function PackageCard({
  pkg,
  transfers,
  students,
  studentId,
}: {
  pkg: Package;
  transfers: PackageCreditTransfer[];
  students: Pick<Student, "id" | "full_name">[];
  studentId: string;
}) {
  const assignedDate = pkg.created_at?.slice(0, 10);
  const sharedWith = (pkg.members ?? []).filter(
    (member) => member.id !== studentId
  );
  const defaultResumeDate =
    pkg.pause_ends_at && pkg.pause_ends_at <= todayInSingapore()
      ? pkg.pause_ends_at
      : todayInSingapore();
  const creditBreakdown = packageCreditBreakdown(pkg, pkg.package_products);

  return (
    <div>
      <div className="space-y-1.5">
        {creditBreakdown ? (
          <p className="text-xs text-muted-foreground">{creditBreakdown}</p>
        ) : null}
        {pkg.payer ? (
          <p className="text-xs text-muted-foreground">
            Payer: {payerLabel(pkg.payer)}
          </p>
        ) : null}
        {sharedWith.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            Shared with {sharedWith.map((member) => member.full_name).join(", ")}
          </p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {assignedDate
            ? `Assigned ${formatCalendarDate(assignedDate)}`
            : "Assigned"}
        </p>
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
              {pkg.amount_sgd != null
                ? ` · ${formatAmountSgd(pkg.amount_sgd)} SGD`
                : ""}
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
          {canTransferPackageCredits(pkg) ? (
            <Link
              href={`/admin/packages/${pkg.id}/transfer`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <ArrowLeftRight className="size-3.5" />
              Transfer credits
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

      <PackageMembersEditor pkg={pkg} students={students} />

      {transfers.length > 0 ? (
        <div className="mt-3 rounded-lg bg-muted/50 p-3 text-sm">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Credit transfers
          </p>
          <ul className="mt-2 space-y-1.5">
            {transfers.map((transfer) => (
              <li key={transfer.id} className="text-foreground">
                {transfer.from_package_id === pkg.id
                  ? `Transferred ${transfer.credits} credit${
                      transfer.credits === 1 ? "" : "s"
                    } to ${transfer.to_student_name}`
                  : `Received ${transfer.credits} credit${
                      transfer.credits === 1 ? "" : "s"
                    } from ${transfer.from_student_name}`}
                <span className="text-muted-foreground">
                  {" · "}
                  {formatCalendarDate(transfer.created_at.slice(0, 10))}
                </span>
                {transfer.note ? (
                  <span className="text-muted-foreground">
                    {" — "}
                    {transfer.note}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

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
