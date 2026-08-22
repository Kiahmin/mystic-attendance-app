"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Minus,
  Plus,
  Search,
} from "lucide-react";
import { ArchiveStudentButton } from "@/components/admin/archive-student-button";
import { PackageStatusBadge } from "@/components/admin/package-status-badge";
import { StudentForm } from "@/components/admin/student-form";
import {
  ageFromDob,
  isInactiveForSixMonths,
  SKILL_LEVEL_LABELS,
  SKILL_LEVELS,
} from "@/lib/admin-utils";
import { formatCalendarDateLong } from "@/lib/datetime";
import { PACKAGE_STATUS_LABELS } from "@/lib/package-utils";
import type {
  PackageProduct,
  PackageStatus,
  SkillLevel,
  StudentListItem,
  StudentRosterPackage,
} from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;

type StudentListProps = {
  students: StudentListItem[];
  classes: { id: string; name: string }[];
  initialSearch?: string;
  initialInactive?: boolean;
};

type RosterTab = "active" | "archived";
type SortColumn = "name" | "age";
type SortDir = "asc" | "desc";
type TableSort = { column: SortColumn; dir: SortDir };

type SkillFilter = SkillLevel | "unset";
type PackageFilter = PackageStatus | "none";

const SKILL_FILTER_OPTIONS: { value: SkillFilter; label: string }[] = [
  ...SKILL_LEVELS.map((level) => ({
    value: level,
    label: SKILL_LEVEL_LABELS[level],
  })),
  { value: "unset", label: "Not set" },
];

const PACKAGE_FILTER_OPTIONS: { value: PackageFilter; label: string }[] = [
  ...(Object.keys(PACKAGE_STATUS_LABELS) as PackageStatus[]).map((status) => ({
    value: status,
    label: PACKAGE_STATUS_LABELS[status],
  })),
  { value: "none", label: "No package" },
];

const DEFAULT_SORT: TableSort = { column: "name", dir: "asc" };

const ROSTER_GRID =
  "lg:grid-cols-[minmax(0,1.8fr)_6.5rem_minmax(0,1.15fr)_minmax(0,1.15fr)_4.75rem] lg:gap-4";

function cycleColumnSort(current: TableSort, column: SortColumn): TableSort {
  if (current.column !== column) return { column, dir: "asc" };
  return { column, dir: current.dir === "asc" ? "desc" : "asc" };
}

function compareName(
  a: StudentListItem,
  b: StudentListItem,
  direction: SortDir
) {
  const result = a.full_name.localeCompare(b.full_name, undefined, {
    sensitivity: "base",
  });
  return direction === "asc" ? result : -result;
}

function compareAge(
  a: StudentListItem,
  b: StudentListItem,
  direction: SortDir
) {
  const ageA = ageFromDob(a.date_of_birth);
  const ageB = ageFromDob(b.date_of_birth);
  if (ageA == null && ageB == null) return 0;
  if (ageA == null) return 1;
  if (ageB == null) return -1;
  return direction === "asc" ? ageA - ageB : ageB - ageA;
}

function SortHeader({
  label,
  column,
  sort,
  onCycle,
  unsortedLabel,
  ascLabel,
  descLabel,
}: {
  label: string;
  column: SortColumn;
  sort: TableSort;
  onCycle: () => void;
  unsortedLabel: string;
  ascLabel: string;
  descLabel: string;
}) {
  const active = sort.column === column ? sort.dir : null;
  const Icon =
    active === "asc" ? ArrowUp : active === "desc" ? ArrowDown : ArrowUpDown;
  const ariaSort =
    active === "asc" ? "ascending" : active === "desc" ? "descending" : "none";

  return (
    <span role="columnheader" aria-sort={ariaSort} className="inline-flex">
      <button
        type="button"
        onClick={onCycle}
        aria-label={
          active == null ? unsortedLabel : active === "asc" ? ascLabel : descLabel
        }
        className={cn(
          "inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
        <Icon className="size-3.5" />
      </button>
    </span>
  );
}

function FilterCheckbox({
  checked,
  label,
  onToggle,
}: {
  checked: boolean | "indeterminate";
  label: string;
  onToggle: () => void;
}) {
  const isOn = checked === true;
  const isIndeterminate = checked === "indeterminate";

  return (
    <DropdownMenuCheckboxItem
      checked={checked}
      onCheckedChange={onToggle}
      onSelect={(event) => event.preventDefault()}
      className="pr-2 pl-2 [&_[data-slot=dropdown-menu-checkbox-item-indicator]]:hidden"
    >
      <span
        aria-hidden
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-[4px] border",
          isOn || isIndeterminate
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 bg-background"
        )}
      >
        {isOn ? <Check className="size-3" /> : null}
        {isIndeterminate ? <Minus className="size-3" /> : null}
      </span>
      {label}
    </DropdownMenuCheckboxItem>
  );
}

function ColumnFilter<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (next: T[]) => void;
}) {
  const selectedSet = new Set(selected);
  const allSelected = selected.length === options.length;
  const someSelected = selected.length > 0 && !allSelected;
  const filtered = someSelected;

  function toggle(value: T) {
    onChange(
      selectedSet.has(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  }

  function toggleSelectAll() {
    onChange(allSelected ? [] : options.map((option) => option.value));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
            filtered ? "text-foreground" : "text-muted-foreground"
          )}
          aria-label={`Filter ${label}`}
        >
          {label}
          {filtered ? (
            <Badge variant="secondary" className="h-4 min-w-4 px-1 text-[10px]">
              {selected.length}
            </Badge>
          ) : (
            <ChevronDown className="size-3.5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Select one or more</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <FilterCheckbox
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          label="Select all"
          onToggle={toggleSelectAll}
        />
        <DropdownMenuSeparator />
        {options.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={selectedSet.has(option.value)}
            label={option.label}
            onToggle={() => toggle(option.value)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RosterPackageCell({ pkg }: { pkg: StudentRosterPackage | null }) {
  if (!pkg) {
    return <span className="text-sm text-muted-foreground">No package</span>;
  }

  return <PackageStatusBadge status={pkg.status} />;
}

export function AddStudentButton({
  trialProducts,
}: {
  trialProducts: PackageProduct[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex h-11 min-h-11 items-center px-6">
          <Plus className="size-4" />
          Add Skater
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
          <DialogDescription>
            Create a student profile. Enrol them in classes on the next screen.
          </DialogDescription>
        </DialogHeader>
        <StudentForm
          trialProducts={trialProducts}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export function StudentList({
  students,
  classes,
  initialSearch = "",
  initialInactive = false,
}: StudentListProps) {
  const [search, setSearch] = useState(initialSearch);
  const [tab, setTab] = useState<RosterTab>("active");
  const [trialsOnly, setTrialsOnly] = useState(false);
  const [inactiveOnly, setInactiveOnly] = useState(initialInactive);
  const [skillFilters, setSkillFilters] = useState<SkillFilter[]>([]);
  const [packageFilters, setPackageFilters] = useState<PackageFilter[]>([]);
  const [classFilter, setClassFilter] = useState<string>("all");
  const [sort, setSort] = useState<TableSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  function resetPage() {
    setPage(1);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = students.filter((s) => {
      const isArchived = Boolean(s.archived_at);
      if (tab === "archived" ? !isArchived : isArchived) return false;
      if (
        inactiveOnly &&
        !isInactiveForSixMonths(s.last_attended_on, s.created_at)
      ) {
        return false;
      }
      if (trialsOnly && !s.is_trial) return false;
      if (q && !s.full_name.toLowerCase().includes(q)) return false;
      if (skillFilters.length > 0) {
        const skillValue: SkillFilter = s.skill_level ?? "unset";
        if (!skillFilters.includes(skillValue)) return false;
      }
      if (packageFilters.length > 0) {
        const packageValue: PackageFilter = s.roster_package?.status ?? "none";
        if (!packageFilters.includes(packageValue)) return false;
      }
      if (classFilter !== "all" && !s.class_ids.includes(classFilter)) {
        return false;
      }
      return true;
    });

    return [...rows].sort((a, b) =>
      sort.column === "name"
        ? compareName(a, b, sort.dir)
        : compareAge(a, b, sort.dir)
    );
  }, [
    students,
    search,
    tab,
    trialsOnly,
    inactiveOnly,
    skillFilters,
    packageFilters,
    classFilter,
    sort,
  ]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const pageEnd = pageStart + pageRows.length;
  const moreActive = trialsOnly || inactiveOnly;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Search by name…"
              className="h-11 rounded-lg border-border/80 bg-card pl-9"
              aria-label="Search students"
            />
          </div>
          <Select
            value={classFilter}
            onValueChange={(value) => {
              setClassFilter(value);
              resetPage();
            }}
          >
            <SelectTrigger
              className="h-11 w-full min-w-[10.5rem] border-border/80 bg-card sm:w-auto"
              aria-label="Filter class"
            >
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full justify-between gap-2 px-4 sm:w-auto"
                aria-pressed={moreActive}
              >
                <ListFilter className="size-4 shrink-0 text-muted-foreground" />
                More
                {moreActive ? (
                  <Badge variant="secondary">
                    {(trialsOnly ? 1 : 0) + (inactiveOnly ? 1 : 0)}
                  </Badge>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuCheckboxItem
                checked={inactiveOnly}
                onCheckedChange={(checked) => {
                  setInactiveOnly(Boolean(checked));
                  resetPage();
                }}
                onSelect={(event) => event.preventDefault()}
              >
                Inactive
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={trialsOnly}
                onCheckedChange={(checked) => {
                  setTrialsOnly(Boolean(checked));
                  resetPage();
                }}
                onSelect={(event) => event.preventDefault()}
              >
                Trials
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-8 flex gap-8 border-b border-border">
        <button
          type="button"
          className={cn(
            "border-b-2 px-1 pb-3 text-xs font-semibold tracking-wide uppercase transition-colors",
            tab === "active"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => {
            setTab("active");
            resetPage();
          }}
        >
          Active
        </button>
        <button
          type="button"
          className={cn(
            "border-b-2 px-1 pb-3 text-xs font-semibold tracking-wide uppercase transition-colors",
            tab === "archived"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
          onClick={() => {
            setTab("archived");
            resetPage();
          }}
        >
          Archived
        </button>
      </div>

      {students.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">No students yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a student to get started.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-border/70 bg-card">
          <div
            className={cn(
              "flex gap-6 border-b border-border/60 bg-muted/50 px-5 py-3.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase lg:grid",
              ROSTER_GRID
            )}
          >
            <span className="hidden lg:inline-flex">
              <SortHeader
                label="Student"
                column="name"
                sort={sort}
                onCycle={() =>
                  setSort((current) => cycleColumnSort(current, "name"))
                }
                unsortedLabel="Sort by name"
                ascLabel="Sorted by name, A to Z. Click to reverse."
                descLabel="Sorted by name, Z to A. Click to reverse."
              />
            </span>
            <span className="-ml-1 hidden lg:inline-flex">
              <SortHeader
                label="Age"
                column="age"
                sort={sort}
                onCycle={() =>
                  setSort((current) => cycleColumnSort(current, "age"))
                }
                unsortedLabel="Sort by age"
                ascLabel="Sorted by age, youngest first. Click to reverse."
                descLabel="Sorted by age, oldest first. Click to reverse."
              />
            </span>
            <ColumnFilter
              label="Skill Level"
              options={SKILL_FILTER_OPTIONS}
              selected={skillFilters}
              onChange={(next) => {
                setSkillFilters(next);
                resetPage();
              }}
            />
            <ColumnFilter
              label="Package"
              options={PACKAGE_FILTER_OPTIONS}
              selected={packageFilters}
              onChange={(next) => {
                setPackageFilters(next);
                resetPage();
              }}
            />
            <span className="hidden w-full lg:block" aria-hidden />
          </div>
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium">No matching students</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search or filter.
              </p>
            </div>
          ) : (
            <div>
              <ul className="divide-y divide-border/60">
            {pageRows.map((student) => {
              const age = ageFromDob(student.date_of_birth);
              const skill = student.skill_level;
              const inactive = isInactiveForSixMonths(
                student.last_attended_on,
                student.created_at
              );
              const archived = Boolean(student.archived_at);

              return (
                <li key={student.id}>
                  <Link
                    href={`/admin/students/${student.id}`}
                    className={cn(
                      "grid gap-3 px-5 py-4 transition-colors hover:bg-muted/40 lg:items-center",
                      ROSTER_GRID,
                      archived && "opacity-70 hover:opacity-100"
                    )}
                  >
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "truncate",
                          archived &&
                            "line-through decoration-muted-foreground"
                        )}
                      >
                        {student.full_name}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        {student.is_trial ? (
                          <Badge variant="warning">Trial</Badge>
                        ) : null}
                        {inactive ? (
                          <Badge variant="outline">
                            Inactive
                            {student.last_attended_on
                              ? ` · ${formatCalendarDateLong(student.last_attended_on)}`
                              : ""}
                          </Badge>
                        ) : null}
                        {student.is_minor ? (
                          <Badge variant="guardian">Guardian req</Badge>
                        ) : null}
                      </div>
                    </div>

                    <p className="text-sm">
                      <span className="lg:hidden text-muted-foreground">
                        Age:{" "}
                      </span>
                      {age ?? "—"}
                    </p>

                    <p className="text-sm">
                      <span className="lg:hidden text-muted-foreground">
                        Skill:{" "}
                      </span>
                      {skill ? (
                        SKILL_LEVEL_LABELS[skill]
                      ) : (
                        <span className="text-muted-foreground">Not set</span>
                      )}
                    </p>

                    <RosterPackageCell pkg={student.roster_package} />

                    <span className="flex items-center justify-end gap-1">
                      <ArchiveStudentButton
                        studentId={student.id}
                        studentName={student.full_name}
                        archived={archived}
                        variant="icon"
                      />
                      <ChevronRight className="hidden size-4 text-muted-foreground lg:block" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-between border-t border-border/60 px-5 py-3 text-xs text-muted-foreground">
            <span>
              {`Showing ${pageStart + 1}–${pageEnd} of ${filtered.length} skaters`}
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
      )}
    </div>
  );
}
