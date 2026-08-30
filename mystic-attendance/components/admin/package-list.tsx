"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { PackageStatusBadge } from "@/components/admin/package-status-badge";
import {
  ColumnFilter,
  FilterCheckbox,
  SortHeader,
  cycleColumnSort,
  type TableSort,
} from "@/components/admin/table-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
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
  isCustomisedPackage,
  packageLabel,
  packageStudentNames,
  PACKAGE_PRODUCT_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
} from "@/lib/package-utils";
import type { PackageListFilter } from "@/lib/queries/packages";
import type {
  PackageProductType,
  PackageWithStudent,
  PaymentMethod,
} from "@/lib/types";
import { payerLabel } from "@/lib/payer-utils";

type FilterValue = PackageListFilter;
type SortColumn = "credits" | "expiry";
type PackageSort = TableSort<SortColumn>;

type PackageListProps = {
  packages: PackageWithStudent[];
  initialFilter?: FilterValue[];
  initialSearch?: string;
};

const PAGE_SIZE = 25;

const DEFAULT_SORT: PackageSort = { column: "expiry", dir: "asc" };

const PACKAGE_GRID =
  "lg:grid-cols-[1.6fr_1.2fr_0.7fr_1fr_1.1fr_auto] lg:items-center lg:gap-4";

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "finishing", label: "Finishing" },
  { value: "active", label: "Active" },
  { value: "unpaid", label: "Unpaid" },
  { value: "paused", label: "Paused" },
  { value: "expired", label: "Expired" },
  { value: "finished", label: "Finished" },
  { value: "overshot", label: "Overshot" },
];

const PRODUCT_FILTER_OPTIONS: { value: PackageProductType; label: string }[] = (
  Object.keys(PACKAGE_PRODUCT_TYPE_LABELS) as PackageProductType[]
).map((value) => ({ value, label: PACKAGE_PRODUCT_TYPE_LABELS[value] }));

const PAYMENT_FILTER_OPTIONS: { value: PaymentMethod; label: string }[] =
  PAYMENT_METHODS.map((value) => ({
    value,
    label: PAYMENT_METHOD_LABELS[value],
  }));

function orderedFilters(filters: FilterValue[]): FilterValue[] {
  return FILTER_OPTIONS.map((option) => option.value).filter((value) =>
    filters.includes(value)
  );
}

function selectedFilterOptions(filters: FilterValue[]) {
  return FILTER_OPTIONS.filter((option) => filters.includes(option.value));
}

function remainingSortValue(pkg: PackageWithStudent): number {
  if (pkg.status === "overshot") {
    return pkg.total_credits - pkg.used_credits;
  }
  return pkg.remaining_credits;
}

function comparePackages(
  a: PackageWithStudent,
  b: PackageWithStudent,
  sort: PackageSort
): number {
  const result =
    sort.column === "credits"
      ? remainingSortValue(a) - remainingSortValue(b)
      : (a.expires_at ?? "9999-12-31").localeCompare(
          b.expires_at ?? "9999-12-31"
        );

  const named =
    result !== 0
      ? result
      : packageStudentNames(a, a.students.full_name).localeCompare(
          packageStudentNames(b, b.students.full_name),
          undefined,
          { sensitivity: "base" }
        );

  return sort.dir === "asc" ? named : -named;
}

export function PackageList({
  packages,
  initialFilter = ["finishing"],
  initialSearch = "",
}: PackageListProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState<FilterValue[]>(
    orderedFilters(initialFilter)
  );
  const [productFilters, setProductFilters] = useState<PackageProductType[]>(
    []
  );
  const [paymentFilters, setPaymentFilters] = useState<PaymentMethod[]>([]);
  const [sort, setSort] = useState<PackageSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = packages.filter((pkg) => {
      if (productFilters.length > 0) {
        const type = pkg.package_products?.product_type;
        if (!type || !productFilters.includes(type)) return false;
      }
      if (paymentFilters.length > 0) {
        if (!pkg.is_paid || !pkg.payment_method) return false;
        if (!paymentFilters.includes(pkg.payment_method)) return false;
      }
      if (!q) return true;
      const haystacks = [
        pkg.students.full_name,
        pkg.payer?.display_name,
        pkg.payer?.phone,
        packageLabel(pkg, pkg.package_products),
        ...pkg.members.map((member) => member.full_name),
      ];
      return haystacks.some((value) => value?.toLowerCase().includes(q));
    });

    return [...rows].sort((a, b) => comparePackages(a, b, sort));
  }, [packages, search, productFilters, paymentFilters, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const pageEnd = pageStart + pageRows.length;

  const isFinishingOnly = filter.length === 1 && filter[0] === "finishing";
  const selectedOptions = selectedFilterOptions(filter);
  const allSelected = selectedOptions.length === FILTER_OPTIONS.length;
  const showingAll = selectedOptions.length === 0 || allSelected;

  function resetPage() {
    setPage(1);
  }

  function updateFilter(next: FilterValue[]) {
    const ordered = orderedFilters(next);
    setFilter(ordered);
    resetPage();
    const params = new URLSearchParams();
    const isDefault = ordered.length === 1 && ordered[0] === "finishing";
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

  function toggleSelectAll() {
    updateFilter(
      allSelected ? [] : FILTER_OPTIONS.map((option) => option.value)
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-5 sm:items-center sm:gap-3">
        <div className="relative min-w-0 sm:col-span-4">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Search by student name…"
            className="h-11 rounded-lg border-border/80 bg-card pl-9"
            aria-label="Search packages"
          />
        </div>
        <div className="min-w-0 sm:col-span-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 w-full justify-between gap-2 rounded-lg border-border/80 bg-card px-4"
                aria-label="Filter packages, select one or more"
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  {showingAll ? (
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select one or more</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <FilterCheckbox
                checked={
                  allSelected
                    ? true
                    : selectedOptions.length > 0
                      ? "indeterminate"
                      : false
                }
                label="Select all"
                onToggle={toggleSelectAll}
              />
              <DropdownMenuSeparator />
              {FILTER_OPTIONS.map((option) => (
                <FilterCheckbox
                  key={option.value}
                  checked={filter.includes(option.value)}
                  label={option.label}
                  onToggle={() => toggleFilter(option.value)}
                />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">
            {search.trim() ||
            productFilters.length > 0 ||
            paymentFilters.length > 0
              ? "No matching packages"
              : "No packages in this view"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {isFinishingOnly &&
            !search.trim() &&
            productFilters.length === 0 &&
            paymentFilters.length === 0
              ? "Active packages with 2 or fewer credits, or expiring within 14 days, will appear here."
              : "Try a different search or filter."}
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-border/70 bg-card">
          <div
            className={cn(
              "hidden gap-4 border-b border-border/60 bg-muted/50 px-5 py-3.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase lg:grid",
              PACKAGE_GRID
            )}
          >
            <span>Student</span>
            <ColumnFilter
              label="Package"
              options={PRODUCT_FILTER_OPTIONS}
              selected={productFilters}
              onChange={(next) => {
                setProductFilters(next);
                resetPage();
              }}
            />
            <SortHeader
              label="Credits"
              column="credits"
              sort={sort}
              onCycle={() => {
                setSort((current) => cycleColumnSort(current, "credits"));
                resetPage();
              }}
              unsortedLabel="Sort by credits remaining"
              ascLabel="Sorted by fewest credits first. Click to reverse."
              descLabel="Sorted by most credits first. Click to reverse."
            />
            <SortHeader
              label="Expiry"
              column="expiry"
              sort={sort}
              onCycle={() => {
                setSort((current) => cycleColumnSort(current, "expiry"));
                resetPage();
              }}
              unsortedLabel="Sort by expiry"
              ascLabel="Sorted by expiry, soonest first. Click to reverse."
              descLabel="Sorted by expiry, latest first. Click to reverse."
            />
            <ColumnFilter
              label="Payment"
              options={PAYMENT_FILTER_OPTIONS}
              selected={paymentFilters}
              onChange={(next) => {
                setPaymentFilters(next);
                resetPage();
              }}
            />
            <span className="sr-only">Action</span>
          </div>
          <ul className="divide-y divide-border/60">
            {pageRows.map((pkg) => {
              const reason = atRiskReason(pkg);
              return (
                <li key={pkg.id}>
                  <Link
                    href={`/admin/students/${pkg.student_id}`}
                    className={cn(
                      "grid gap-3 px-5 py-4 transition-colors hover:bg-muted/40",
                      PACKAGE_GRID
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {packageStudentNames(pkg, pkg.students.full_name)}
                      </p>
                      {pkg.payer ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {payerLabel(pkg.payer)}
                        </p>
                      ) : null}
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <PackageStatusBadge status={pkg.status} />
                        {reason ? (
                          <span className="text-xs text-muted-foreground">
                            {reason}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <p className="text-sm">
                      <span className="lg:hidden text-muted-foreground">
                        Package:{" "}
                      </span>
                      {packageLabel(pkg, pkg.package_products)}
                      {isCustomisedPackage(pkg, pkg.package_products) ? (
                        <span className="ml-2 inline-flex h-5 items-center rounded-full bg-muted px-2 text-xs font-medium text-muted-foreground align-middle">
                          Custom
                        </span>
                      ) : null}
                    </p>

                    <p className="text-sm font-medium">
                      <span className="lg:hidden font-normal text-muted-foreground">
                        Credits:{" "}
                      </span>
                      {pkg.status === "overshot"
                        ? `+${pkg.used_credits - pkg.total_credits}/${pkg.total_credits}`
                        : `${pkg.remaining_credits}/${pkg.total_credits}`}
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
          <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
            <span>
              {`Showing ${pageStart + 1}–${pageEnd} of ${filtered.length} packages`}
            </span>
            <div className="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={currentPage <= 1}
                aria-label="Previous page"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={currentPage >= pageCount}
                aria-label="Next page"
                onClick={() =>
                  setPage((value) => Math.min(pageCount, value + 1))
                }
              >
                <ChevronRight className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
