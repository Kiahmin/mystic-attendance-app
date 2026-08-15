"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus, Search } from "lucide-react";
import { PackageStatusBadge } from "@/components/admin/package-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  atRiskReason,
  formatAmountSgd,
  formatPackageExpiry,
  packageLabel,
  PAYMENT_METHOD_LABELS,
} from "@/lib/package-utils";
import type { PackageStatus, PackageWithStudent } from "@/lib/types";

type FilterValue = "at_risk" | "all" | PackageStatus;

type PackageListProps = {
  packages: PackageWithStudent[];
  initialFilter?: FilterValue;
  initialSearch?: string;
};

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "at_risk", label: "Needs attention" },
  { value: "all", label: "All packages" },
  { value: "active", label: "Active" },
  { value: "unpaid", label: "Unpaid" },
  { value: "paused", label: "Paused" },
  { value: "expired", label: "Expired" },
  { value: "exhausted", label: "Exhausted" },
];

export function PackageList({
  packages,
  initialFilter = "at_risk",
  initialSearch = "",
}: PackageListProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<FilterValue>(initialFilter);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return packages;
    return packages.filter((pkg) =>
      pkg.students.full_name.toLowerCase().includes(q)
    );
  }, [packages, search]);

  function updateFilter(next: FilterValue) {
    setFilter(next);
    const params = new URLSearchParams();
    if (next !== "at_risk") params.set("filter", next);
    if (search.trim()) params.set("q", search.trim());
    const qs = params.toString();
    router.push(qs ? `/admin/packages?${qs}` : "/admin/packages");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name…"
              className="h-11 rounded-lg border-border/80 bg-card pl-9"
              aria-label="Search packages"
            />
          </div>
          <Select
            value={filter}
            onValueChange={(value) => updateFilter(value as FilterValue)}
          >
            <SelectTrigger className="h-11 w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button asChild className="h-11 px-4">
          <Link href="/admin/packages/assign">
            <Plus className="size-4" />
            Assign Package
          </Link>
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">
            {search.trim() ? "No matching packages" : "No packages in this view"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filter === "at_risk"
              ? "Low-credit, expiring, expired, and unpaid packages will appear here."
              : "Assign a package to a student to get started."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
          <div className="hidden grid-cols-[1.6fr_1fr_0.7fr_1fr_1fr_auto] gap-4 border-b border-border/60 bg-muted/50 px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase lg:grid">
            <span>Student</span>
            <span>Package</span>
            <span>Credits</span>
            <span>Expiry</span>
            <span>Payment</span>
            <span className="sr-only">Action</span>
          </div>
          <ul className="divide-y divide-border/60">
            {filtered.map((pkg) => {
              const reason = atRiskReason(pkg);
              return (
                <li key={pkg.id}>
                  <Link
                    href={`/admin/students/${pkg.student_id}`}
                    className="grid gap-3 px-4 py-4 transition-colors hover:bg-muted/40 lg:grid-cols-[1.6fr_1fr_0.7fr_1fr_1fr_auto] lg:items-center lg:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {pkg.students.full_name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <PackageStatusBadge status={pkg.status} />
                        {reason ? (
                          <span className="text-xs text-muted-foreground">
                            {reason}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <p className="text-sm">
                      {packageLabel(pkg.total_credits, pkg.package_products)}
                    </p>

                    <p className="text-sm">
                      <span className="lg:hidden text-muted-foreground">
                        Credits:{" "}
                      </span>
                      {pkg.remaining_credits}/{pkg.total_credits}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {formatPackageExpiry(pkg.expires_at)}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {pkg.is_paid
                        ? `${pkg.payment_method ? PAYMENT_METHOD_LABELS[pkg.payment_method] : "Paid"}${
                            pkg.amount_sgd != null
                              ? ` · ${formatAmountSgd(pkg.amount_sgd)}`
                              : ""
                          }`
                        : "Unpaid"}
                    </p>

                    <ChevronRight className="hidden size-4 text-muted-foreground lg:block" />
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} package
            {filtered.length === 1 ? "" : "s"}
          </div>
        </div>
      )}
    </div>
  );
}
