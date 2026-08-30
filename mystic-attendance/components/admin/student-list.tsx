"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ListFilter,
  Plus,
  Search,
} from "lucide-react";
import { ArchiveStudentButton } from "@/components/admin/archive-student-button";
import { PackageStatusBadge } from "@/components/admin/package-status-badge";
import {
  ColumnFilter,
  FilterCheckbox,
  SortHeader,
  cycleColumnSort,
  type TableSort,
} from "@/components/admin/table-controls";
import { StudentForm } from "@/components/admin/student-form";
import {
  ageFromDob,
  DAY_OF_WEEK_SHORT_LABELS,
  DAYS_OF_WEEK,
  isInactiveForSixMonths,
  SKILL_LEVEL_LABELS,
  SKILL_LEVELS,
} from "@/lib/admin-utils";
import { formatSessionTime } from "@/lib/attendance-utils";
import { formatCalendarDate, formatCalendarDateLong } from "@/lib/datetime";
import {
  formatPackageExpiry,
  PACKAGE_PRODUCT_TYPE_LABELS,
  PACKAGE_STATUS_LABELS,
  packageLabel,
} from "@/lib/package-utils";
import type {
  DayOfWeek,
  PackageProduct,
  PackageProductType,
  PackageStatus,
  Payer,
  SkillLevel,
  StudentListItem,
  StudentRosterClass,
  StudentRosterPackage,
  VenueRef,
} from "@/lib/types";
import { payerShortLabel } from "@/lib/payer-utils";
import { venueName } from "@/lib/venue-utils";
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
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;

type StudentListClass = {
  id: string;
  venue: VenueRef | null;
  day_of_week: DayOfWeek;
  start_time: string;
};

type StudentListProps = {
  students: StudentListItem[];
  classes: StudentListClass[];
  initialSearch?: string;
  initialInactive?: boolean;
};

type RosterTab = "active" | "archived";
type SortColumn = "name" | "validity";
type StudentSort = TableSort<SortColumn>;
type ClassFilter = string | "none";
type SkillFilter = SkillLevel | "unset";
type ProductFilter = PackageProductType | "none";
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

const PRODUCT_FILTER_OPTIONS: { value: ProductFilter; label: string }[] = [
  ...(Object.keys(PACKAGE_PRODUCT_TYPE_LABELS) as PackageProductType[]).map(
    (value) => ({ value, label: PACKAGE_PRODUCT_TYPE_LABELS[value] })
  ),
  { value: "none", label: "No package" },
];

const DEFAULT_SORT: StudentSort = { column: "name", dir: "asc" };

const ROSTER_GRID =
  "lg:grid-cols-[minmax(11rem,1.4fr)_minmax(8.5rem,1fr)_minmax(10rem,1.15fr)_minmax(9.5rem,1.1fr)_minmax(7.5rem,0.9fr)_minmax(5.5rem,0.7fr)_4.75rem] lg:gap-4";

function compareName(a: StudentListItem, b: StudentListItem) {
  return a.full_name.localeCompare(b.full_name, undefined, {
    sensitivity: "base",
  });
}

function validityRank(student: StudentListItem) {
  if (!student.roster_package) return 2;
  if (!student.roster_package.first_lesson_date) return 1;
  return 0;
}

function compareStudents(
  a: StudentListItem,
  b: StudentListItem,
  sort: StudentSort
) {
  if (sort.column === "validity") {
    const rank = validityRank(a) - validityRank(b);
    if (rank !== 0) return rank;
    const byExpiry = (a.roster_package?.expires_at ?? "9999-12-31").localeCompare(
      b.roster_package?.expires_at ?? "9999-12-31"
    );
    if (byExpiry !== 0) {
      return sort.dir === "asc" ? byExpiry : -byExpiry;
    }
  }
  const byName = compareName(a, b);
  return sort.dir === "asc" ? byName : -byName;
}

function matchesSearch(student: StudentListItem, query: string) {
  if (!query) return true;
  const haystacks = [
    student.full_name,
    student.guardian_name,
    student.guardian_phone,
    student.contact_phone,
    student.payer?.display_name,
    student.payer?.phone,
  ];
  return haystacks.some((value) => value?.toLowerCase().includes(query));
}

function contactSubline(student: StudentListItem) {
  const payer = payerShortLabel(student.payer);
  const guardian = student.guardian_name?.trim() || null;
  if (guardian && guardian !== payer) {
    return `Guardian: ${guardian}`;
  }
  return null;
}

function classVenueLabel(cls: {
  venue: VenueRef | null;
}) {
  return venueName(cls.venue) ?? "No venue";
}

function classScheduleLabel(cls: {
  venue: VenueRef | null;
  day_of_week: DayOfWeek;
  start_time: string;
}) {
  return `${classVenueLabel(cls)} · ${DAY_OF_WEEK_SHORT_LABELS[cls.day_of_week]} · ${formatSessionTime(cls.start_time)}`;
}

function compareClassSchedule(a: StudentListClass, b: StudentListClass) {
  const venue = classVenueLabel(a).localeCompare(classVenueLabel(b), undefined, {
    sensitivity: "base",
  });
  if (venue !== 0) return venue;
  const day =
    DAYS_OF_WEEK.indexOf(a.day_of_week) - DAYS_OF_WEEK.indexOf(b.day_of_week);
  if (day !== 0) return day;
  return a.start_time.localeCompare(b.start_time);
}

function RosterVenueCell({ classes }: { classes: StudentRosterClass[] }) {
  if (classes.length === 0) {
    return <span className="text-sm text-muted-foreground">No class</span>;
  }

  return (
    <div className="space-y-1.5">
      {classes.map((cls) => (
        <div key={cls.id} className="min-w-0">
          <p className="truncate text-sm">{classVenueLabel(cls)}</p>
          <p className="text-xs text-muted-foreground">
            {DAY_OF_WEEK_SHORT_LABELS[cls.day_of_week]} ·{" "}
            {formatSessionTime(cls.start_time)}
          </p>
        </div>
      ))}
    </div>
  );
}

function RosterPackageCell({ pkg }: { pkg: StudentRosterPackage | null }) {
  if (!pkg) {
    return <span className="text-sm text-muted-foreground">No package</span>;
  }

  return (
    <div className="min-w-0">
      <p className="truncate text-sm">
        {packageLabel(pkg, pkg.package_products)}
      </p>
      <p className="text-xs text-muted-foreground">
        {pkg.used_credits}/{pkg.total_credits} sessions
      </p>
    </div>
  );
}

function RosterValidityCell({ pkg }: { pkg: StudentRosterPackage | null }) {
  if (!pkg) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  if (!pkg.first_lesson_date) {
    return <span className="text-sm text-muted-foreground">Not started</span>;
  }

  return (
    <div className="min-w-0">
      <p className="text-sm">{formatPackageExpiry(pkg.expires_at)}</p>
      <p className="text-xs text-muted-foreground">
        First lesson {formatCalendarDate(pkg.first_lesson_date)}
      </p>
    </div>
  );
}

export function AddStudentButton({
  trialProducts,
  payers = [],
}: {
  trialProducts: PackageProduct[];
  payers?: Payer[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="inline-flex h-11 min-h-11 items-center px-6">
          <Plus className="size-4" />
          Add Student
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
          payers={payers}
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
  const [statusFilters, setStatusFilters] = useState<PackageFilter[]>([]);
  const [classFilters, setClassFilters] = useState<ClassFilter[]>([]);
  const [productFilters, setProductFilters] = useState<ProductFilter[]>([]);
  const [sort, setSort] = useState<StudentSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  function resetPage() {
    setPage(1);
  }

  const classFilterOptions = useMemo(
    () => [
      ...[...classes]
        .sort(compareClassSchedule)
        .map((cls) => ({
          value: cls.id as ClassFilter,
          label: classScheduleLabel(cls),
        })),
      { value: "none" as const, label: "No class" },
    ],
    [classes]
  );

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
      if (!matchesSearch(s, q)) return false;
      if (skillFilters.length > 0) {
        const skillValue: SkillFilter = s.skill_level ?? "unset";
        if (!skillFilters.includes(skillValue)) return false;
      }
      if (statusFilters.length > 0) {
        const packageValue: PackageFilter = s.roster_package?.status ?? "none";
        if (!statusFilters.includes(packageValue)) return false;
      }
      if (classFilters.length > 0) {
        const wantsNone = classFilters.includes("none");
        const classIds = classFilters.filter((id) => id !== "none");
        const matchesClass = classIds.some((id) => s.class_ids.includes(id));
        const matchesNone = wantsNone && s.class_ids.length === 0;
        if (!matchesClass && !matchesNone) return false;
      }
      if (productFilters.length > 0) {
        const type: ProductFilter =
          s.roster_package?.package_products?.product_type ?? "none";
        if (!productFilters.includes(type)) return false;
      }
      return true;
    });

    return [...rows].sort((a, b) => compareStudents(a, b, sort));
  }, [
    students,
    search,
    tab,
    trialsOnly,
    inactiveOnly,
    skillFilters,
    statusFilters,
    classFilters,
    productFilters,
    sort,
  ]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const pageEnd = pageStart + pageRows.length;
  const moreCount =
    (trialsOnly ? 1 : 0) +
    (inactiveOnly ? 1 : 0) +
    (skillFilters.length > 0 ? 1 : 0);
  const moreActive = moreCount > 0;

  function toggleSkillFilter(value: SkillFilter) {
    setSkillFilters((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
    resetPage();
  }

  function clearMoreFilters() {
    setInactiveOnly(false);
    setTrialsOnly(false);
    setSkillFilters([]);
    resetPage();
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                resetPage();
              }}
              placeholder="Search by name, payer, or contact…"
              className="h-11 rounded-lg border-border/80 bg-card pl-9"
              aria-label="Search students"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-11 w-full justify-between gap-2 px-4 sm:w-auto sm:justify-center",
                  moreActive && "border-primary/40 bg-primary/5"
                )}
                aria-label="More filters"
              >
                <ListFilter className="size-4 shrink-0 text-muted-foreground" />
                More
                {moreActive ? (
                  <Badge variant="secondary">{moreCount}</Badge>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-56 min-w-56"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 pt-1.5 pb-1 text-[11px] font-semibold tracking-wide uppercase">
                  Status
                </DropdownMenuLabel>
                <FilterCheckbox
                  className="py-1.5"
                  checked={inactiveOnly}
                  label="Inactive"
                  onToggle={() => {
                    setInactiveOnly((current) => !current);
                    resetPage();
                  }}
                />
                <FilterCheckbox
                  className="py-1.5"
                  checked={trialsOnly}
                  label="Trials"
                  onToggle={() => {
                    setTrialsOnly((current) => !current);
                    resetPage();
                  }}
                />
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 pt-1.5 pb-1 text-[11px] font-semibold tracking-wide uppercase">
                  Skill level
                </DropdownMenuLabel>
                {SKILL_FILTER_OPTIONS.map((option) => (
                  <FilterCheckbox
                    key={option.value}
                    className="py-1.5"
                    checked={skillFilters.includes(option.value)}
                    label={option.label}
                    onToggle={() => toggleSkillFilter(option.value)}
                  />
                ))}
              </DropdownMenuGroup>
              {moreActive ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      clearMoreFilters();
                    }}
                  >
                    Clear filters
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-8 flex gap-8 border-b border-border">
        <button
          type="button"
          className={cn(
            "-mb-px border-b-2 px-1 pb-3 text-xs font-semibold tracking-wide uppercase transition-colors",
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
            "-mb-px border-b-2 px-1 pb-3 text-xs font-semibold tracking-wide uppercase transition-colors",
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
          <div className="overflow-x-auto">
            <div className="lg:min-w-[56rem]">
              <div
                className={cn(
                  "hidden gap-6 border-b border-border/60 bg-muted/50 px-5 py-3.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase lg:grid",
                  ROSTER_GRID
                )}
              >
                <span className="hidden lg:inline-flex">
                  <SortHeader
                    label="Student"
                    column="name"
                    sort={sort}
                    onCycle={() => {
                      setSort((current) => cycleColumnSort(current, "name"));
                      resetPage();
                    }}
                    unsortedLabel="Sort by name"
                    ascLabel="Sorted by name, A to Z. Click to reverse."
                    descLabel="Sorted by name, Z to A. Click to reverse."
                  />
                </span>
                <span className="hidden lg:block">Payer</span>
                <span className="hidden lg:inline-flex">
                  <ColumnFilter
                    label="Venue & schedule"
                    options={classFilterOptions}
                    selected={classFilters}
                    onChange={(next) => {
                      setClassFilters(next);
                      resetPage();
                    }}
                  />
                </span>
                <span className="hidden lg:inline-flex">
                  <ColumnFilter
                    label="Package"
                    options={PRODUCT_FILTER_OPTIONS}
                    selected={productFilters}
                    onChange={(next) => {
                      setProductFilters(next);
                      resetPage();
                    }}
                  />
                </span>
                <span className="hidden lg:inline-flex">
                  <SortHeader
                    label="Validity"
                    column="validity"
                    sort={sort}
                    onCycle={() => {
                      setSort((current) =>
                        cycleColumnSort(current, "validity")
                      );
                      resetPage();
                    }}
                    unsortedLabel="Sort by expiry"
                    ascLabel="Sorted by expiry, soonest first. Click to reverse."
                    descLabel="Sorted by expiry, latest first. Click to reverse."
                  />
                </span>
                <span className="hidden lg:inline-flex">
                  <ColumnFilter
                    label="Status"
                    options={PACKAGE_FILTER_OPTIONS}
                    selected={statusFilters}
                    onChange={(next) => {
                      setStatusFilters(next);
                      resetPage();
                    }}
                  />
                </span>
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
                <ul className="divide-y divide-border/60">
                  {pageRows.map((student) => {
                    const age = ageFromDob(student.date_of_birth);
                    const inactive = isInactiveForSixMonths(
                      student.last_attended_on,
                      student.created_at
                    );
                    const archived = Boolean(student.archived_at);
                    const contact = contactSubline(student);

                    return (
                      <li key={student.id}>
                        <Link
                          href={`/admin/students/${student.id}`}
                          className={cn(
                            "grid gap-3 px-5 py-4 transition-colors hover:bg-muted/40 lg:items-start",
                            ROSTER_GRID,
                            archived && "opacity-70 hover:opacity-100"
                          )}
                        >
                          <div className="min-w-0">
                            <p className="truncate">{student.full_name}</p>
                            {age != null ? (
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                Age {age}
                              </p>
                            ) : null}
                            {contact ? (
                              <p className="truncate text-xs text-muted-foreground">
                                {contact}
                              </p>
                            ) : null}
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

                          <div>
                            <span className="lg:hidden text-xs text-muted-foreground">
                              Payer:{" "}
                            </span>
                            <p className="truncate text-sm">
                              {payerShortLabel(student.payer) ?? (
                                <span className="text-muted-foreground">
                                  No payer
                                </span>
                              )}
                            </p>
                          </div>

                          <div>
                            <span className="lg:hidden text-xs text-muted-foreground">
                              Venue:{" "}
                            </span>
                            <RosterVenueCell classes={student.classes} />
                          </div>

                          <div>
                            <span className="lg:hidden text-xs text-muted-foreground">
                              Package:{" "}
                            </span>
                            <RosterPackageCell pkg={student.roster_package} />
                          </div>

                          <div>
                            <span className="lg:hidden text-xs text-muted-foreground">
                              Validity:{" "}
                            </span>
                            <RosterValidityCell pkg={student.roster_package} />
                          </div>

                          <div>
                            <span className="lg:hidden text-xs text-muted-foreground">
                              Status:{" "}
                            </span>
                            {student.roster_package ? (
                              <PackageStatusBadge
                                status={student.roster_package.status}
                              />
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                —
                              </span>
                            )}
                          </div>

                          <span className="flex items-center justify-end gap-1 lg:pt-0.5">
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
              )}
            </div>
          </div>
          {filtered.length > 0 ? (
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
          ) : null}
        </div>
      )}
    </div>
  );
}
