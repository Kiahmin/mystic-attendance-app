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
  SortHeader,
  cycleColumnSort,
  type TableSort,
} from "@/components/admin/table-controls";
import { StudentForm } from "@/components/admin/student-form";
import {
  ageFromDob,
  DAY_OF_WEEK_SHORT_LABELS,
  isInactiveForSixMonths,
  SKILL_LEVEL_LABELS,
  SKILL_LEVELS,
} from "@/lib/admin-utils";
import { formatSessionTime } from "@/lib/attendance-utils";
import { formatCalendarDate, formatCalendarDateLong } from "@/lib/datetime";
import {
  formatPackageExpiry,
  PACKAGE_STATUS_LABELS,
  packageLabel,
} from "@/lib/package-utils";
import type {
  PackageProduct,
  PackageStatus,
  SkillLevel,
  StudentListItem,
  StudentRosterClass,
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
  classes: { id: string; name: string; venue: string | null }[];
  initialSearch?: string;
  initialInactive?: boolean;
};

type RosterTab = "active" | "archived";
type SortColumn = "name";
type SortDir = "asc" | "desc";
type StudentSort = TableSort<SortColumn>;

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

const DEFAULT_SORT: StudentSort = { column: "name", dir: "asc" };

const ROSTER_GRID =
  "lg:grid-cols-[minmax(12rem,1.6fr)_minmax(10rem,1.2fr)_minmax(10rem,1.2fr)_minmax(8rem,1fr)_minmax(5.5rem,0.7fr)_4.75rem] lg:gap-4";

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

function matchesSearch(student: StudentListItem, query: string) {
  if (!query) return true;
  const haystacks = [
    student.full_name,
    student.guardian_name,
    student.guardian_phone,
    student.contact_phone,
  ];
  return haystacks.some((value) => value?.toLowerCase().includes(query));
}

function contactSubline(student: StudentListItem) {
  const name = student.guardian_name?.trim() || null;
  const phone =
    student.contact_phone?.trim() || student.guardian_phone?.trim() || null;
  if (!name && !phone) return null;
  if (name && phone) return `${name} · ${phone}`;
  return name ?? phone;
}

function RosterVenueCell({ classes }: { classes: StudentRosterClass[] }) {
  if (classes.length === 0) {
    return <span className="text-sm text-muted-foreground">No class</span>;
  }

  return (
    <div className="space-y-1.5">
      {classes.map((cls) => (
        <div key={cls.id} className="min-w-0">
          <p className="truncate text-sm">{cls.venue || cls.name}</p>
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

  return (
    <div className="min-w-0">
      <p className="text-sm">{formatPackageExpiry(pkg.expires_at)}</p>
      <p className="text-xs text-muted-foreground">
        {pkg.first_lesson_date
          ? `First lesson ${formatCalendarDate(pkg.first_lesson_date)}`
          : "Not started"}
      </p>
    </div>
  );
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
  const [venueFilter, setVenueFilter] = useState<string>("all");
  const [sort, setSort] = useState<StudentSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);

  function resetPage() {
    setPage(1);
  }

  const venues = useMemo(() => {
    const unique = new Set<string>();
    for (const cls of classes) {
      const venue = cls.venue?.trim();
      if (venue) unique.add(venue);
    }
    return [...unique].sort((a, b) => a.localeCompare(b));
  }, [classes]);

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
      if (packageFilters.length > 0) {
        const packageValue: PackageFilter = s.roster_package?.status ?? "none";
        if (!packageFilters.includes(packageValue)) return false;
      }
      if (classFilter !== "all" && !s.class_ids.includes(classFilter)) {
        return false;
      }
      if (
        venueFilter !== "all" &&
        !s.classes.some((cls) => cls.venue === venueFilter)
      ) {
        return false;
      }
      return true;
    });

    return [...rows].sort((a, b) => compareName(a, b, sort.dir));
  }, [
    students,
    search,
    tab,
    trialsOnly,
    inactiveOnly,
    skillFilters,
    packageFilters,
    classFilter,
    venueFilter,
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

  function toggleSkillFilter(value: SkillFilter, checked: boolean) {
    setSkillFilters((current) => {
      if (checked) {
        return current.includes(value) ? current : [...current, value];
      }
      return current.filter((item) => item !== value);
    });
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
              placeholder="Search by name or contact…"
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
          <Select
            value={venueFilter}
            onValueChange={(value) => {
              setVenueFilter(value);
              resetPage();
            }}
          >
            <SelectTrigger
              className="h-11 w-full min-w-[10.5rem] border-border/80 bg-card sm:w-auto"
              aria-label="Filter venue"
            >
              <SelectValue placeholder="All venues" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All venues</SelectItem>
              {venues.map((venue) => (
                <SelectItem key={venue} value={venue}>
                  {venue}
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
                  <Badge variant="secondary">{moreCount}</Badge>
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
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Skill level</DropdownMenuLabel>
              {SKILL_FILTER_OPTIONS.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={skillFilters.includes(option.value)}
                  onCheckedChange={(checked) =>
                    toggleSkillFilter(option.value, Boolean(checked))
                  }
                  onSelect={(event) => event.preventDefault()}
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
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
                <span className="hidden lg:block">Venue & schedule</span>
                <ColumnFilter
                  label="Package"
                  options={PACKAGE_FILTER_OPTIONS}
                  selected={packageFilters}
                  onChange={(next) => {
                    setPackageFilters(next);
                    resetPage();
                  }}
                />
                <span className="hidden lg:block">Validity</span>
                <span className="hidden lg:block">Status</span>
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
