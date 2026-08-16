"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronRight, ListFilter, Plus, Search } from "lucide-react";
import { PackageStatusBadge } from "@/components/admin/package-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  atRiskReason,
  formatAmountSgd,
  formatPackageExpiry,
  packageLabel,
  PAYMENT_METHOD_LABELS,
} from "@/lib/package-utils";
import type { PackageStatus, PackageWithStudent } from "@/lib/types";

type FilterValue = "at_risk" | PackageStatus;

type PackageListProps = {
  packages: PackageWithStudent[];
  initialFilter?: FilterValue[];
  initialSearch?: string;
};

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "at_risk", label: "Finishing" },
  { value: "active", label: "Active" },
  { value: "unpaid", label: "Unpaid" },
  { value: "paused", label: "Paused" },
  { value: "expired", label: "Expired" },
  { value: "exhausted", label: "Finished" },
];

function orderedFilters(filters: FilterValue[]): FilterValue[] {
  return FILTER_OPTIONS.map((option) => option.value).filter((value) =>
    filters.includes(value)
  );
}

function selectedFilterOptions(filters: FilterValue[]) {
  return FILTER_OPTIONS.filter((option) => filters.includes(option.value));
}

export function PackageList({
  packages,
  initialFilter = ["at_risk"],
  initialSearch = "",
}: PackageListProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<FilterValue[]>(
    orderedFilters(initialFilter)
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return packages;
    return packages.filter((pkg) =>
      pkg.students.full_name.toLowerCase().includes(q)
    );
  }, [packages, search]);

  const isFinishingOnly =
    filter.length === 1 && filter[0] === "at_risk";
  const selectedOptions = selectedFilterOptions(filter);

  function updateFilter(next: FilterValue[]) {
    const ordered = orderedFilters(next);
    setFilter(ordered);
    const params = new URLSearchParams();
    const isDefault = ordered.length === 1 && ordered[0] === "at_risk";
    if (!isDefault) params.set("filter", ordered.join(","));
    if (search.trim()) params.set("q", search.trim());
    const qs = params.toString();
    router.push(qs ? `/admin/packages?${qs}` : "/admin/packages");
  }

  function toggleFilter(value: FilterValue) {
    const next = filter.includes(value)
      ? filter.filter((item) => item !== value)
      : [...filter, value];
    updateFilter(next);
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full justify-between gap-2 px-4 sm:w-auto"
                aria-label="Filter packages, select one or more"
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  <ListFilter className="size-4 shrink-0 text-muted-foreground" />
                  {selectedOptions.length === 0 ? (
                    <span className="truncate text-muted-foreground">
                      All packages
                    </span>
                  ) : (
                    <span className="flex min-w-0 items-center gap-1">
                      <Badge
                        variant="secondary"
                        className="max-w-[7rem] truncate"
                      >
                        {selectedOptions[0].label}
                      </Badge>
                      {selectedOptions.length > 1 ? (
                        <Badge variant="outline">
                          +{selectedOptions.length - 1}
                        </Badge>
                      ) : null}
                    </span>
                  )}
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Select one or more</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {FILTER_OPTIONS.map((option) => {
                const checked = filter.includes(option.value);
                return (
                  <DropdownMenuCheckboxItem
                    key={option.value}
                    checked={checked}
                    onCheckedChange={() => toggleFilter(option.value)}
                    onSelect={(event) => event.preventDefault()}
                    className="pr-2 pl-2 [&_[data-slot=dropdown-menu-checkbox-item-indicator]]:hidden"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
                        checked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/40 bg-background"
                      )}
                    >
                      {checked ? <Check className="size-3" /> : null}
                    </span>
                    {option.label}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
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
            {isFinishingOnly
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
