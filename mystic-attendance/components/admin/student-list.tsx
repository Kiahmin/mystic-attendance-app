"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronRight,
  ListFilter,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import { StudentForm } from "@/components/admin/student-form";
import {
  ageFromDob,
  SKILL_LEVEL_LABELS,
  SKILL_LEVELS,
} from "@/lib/admin-utils";
import type { PackageProduct, SkillLevel, StudentListItem } from "@/lib/types";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StudentListProps = {
  students: StudentListItem[];
  trialProducts: PackageProduct[];
  initialSearch?: string;
};

type AgeSort = "unsorted" | "asc" | "desc";
type SkillFilterValue = SkillLevel | "unset";

const SKILL_BAR: Partial<Record<SkillLevel, number>> = {
  beginner: 33,
  intermediate: 66,
  advanced: 85,
  freestyle: 100,
};

const SKILL_FILTER_OPTIONS: { value: SkillFilterValue; label: string }[] = [
  ...SKILL_LEVELS.map((level) => ({
    value: level,
    label: SKILL_LEVEL_LABELS[level],
  })),
  { value: "unset", label: "Not set" },
];

function FilterCheckbox({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
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
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 bg-background"
        )}
      >
        {checked ? <Check className="size-3" /> : null}
      </span>
      {label}
    </DropdownMenuCheckboxItem>
  );
}

function AgeSortButton({
  sort,
  onCycle,
}: {
  sort: AgeSort;
  onCycle: () => void;
}) {
  const Icon =
    sort === "asc" ? ArrowUp : sort === "desc" ? ArrowDown : ArrowUpDown;
  const ariaSort =
    sort === "asc" ? "ascending" : sort === "desc" ? "descending" : "none";

  return (
    <span role="columnheader" aria-sort={ariaSort} className="inline-flex">
      <button
        type="button"
        onClick={onCycle}
        aria-label={
          sort === "unsorted"
            ? "Sort by age"
            : sort === "asc"
              ? "Sorted by age, youngest first. Click to reverse."
              : "Sorted by age, oldest first. Click to clear."
        }
        className={cn(
          "inline-flex items-center gap-1 rounded-md text-xs font-semibold tracking-wide uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
          sort !== "unsorted" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Age
        <Icon className="size-3.5" />
      </button>
    </span>
  );
}

function SkillLevelFilter({
  filters,
  onToggle,
  align = "start",
}: {
  filters: SkillFilterValue[];
  onToggle: (value: SkillFilterValue) => void;
  align?: "start" | "end";
}) {
  const isFiltered = filters.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={
          isFiltered
            ? `Filter skill level, ${filters.length} selected`
            : "Filter skill level"
        }
        className={cn(
          "inline-flex items-center gap-1 rounded-md text-xs font-semibold tracking-wide uppercase outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
          isFiltered ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Skill Level
        {isFiltered ? (
          <ListFilter className="size-3.5" />
        ) : (
          <ChevronDown className="size-3.5" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-auto min-w-44">
        {SKILL_FILTER_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={filters.includes(option.value)}
            label={option.label}
            onToggle={() => onToggle(option.value)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function cycleAgeSort(current: AgeSort): AgeSort {
  if (current === "unsorted") return "asc";
  if (current === "asc") return "desc";
  return "unsorted";
}

function compareAge(
  a: StudentListItem,
  b: StudentListItem,
  direction: "asc" | "desc"
) {
  const ageA = ageFromDob(a.date_of_birth);
  const ageB = ageFromDob(b.date_of_birth);
  if (ageA == null && ageB == null) return 0;
  if (ageA == null) return 1;
  if (ageB == null) return -1;
  return direction === "asc" ? ageA - ageB : ageB - ageA;
}

export function StudentList({
  students,
  trialProducts,
  initialSearch = "",
}: StudentListProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(initialSearch);
  const [trialsOnly, setTrialsOnly] = useState(false);
  const [ageSort, setAgeSort] = useState<AgeSort>("unsorted");
  const [skillFilters, setSkillFilters] = useState<SkillFilterValue[]>([]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = students.filter((s) => {
      if (trialsOnly && !s.is_trial) return false;
      if (q && !s.full_name.toLowerCase().includes(q)) return false;
      if (skillFilters.length > 0) {
        if (!s.skill_level) return skillFilters.includes("unset");
        return skillFilters.includes(s.skill_level);
      }
      return true;
    });

    if (ageSort === "unsorted") return rows;
    return [...rows].sort((a, b) => compareAge(a, b, ageSort));
  }, [students, search, trialsOnly, skillFilters, ageSort]);

  const hasQuery = Boolean(search.trim() || trialsOnly || skillFilters.length);

  function toggleSkillFilter(value: SkillFilterValue) {
    setSkillFilters((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="h-11 rounded-lg border-border/80 bg-card pl-9"
            aria-label="Search students"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="button"
            variant={trialsOnly ? "default" : "outline"}
            className="h-11"
            onClick={() => setTrialsOnly((value) => !value)}
            aria-pressed={trialsOnly}
          >
            Trials
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-11">
              <Plus className="size-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl" showCloseButton>
            <DialogHeader>
              <DialogTitle>Create New Student</DialogTitle>
              <DialogDescription>
                Create a student profile. Enrol them in classes on the next
                screen.
              </DialogDescription>
            </DialogHeader>
            <StudentForm
              trialProducts={trialProducts}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">No students yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add a student to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
          <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-muted/50 px-4 py-2.5 lg:hidden">
            <AgeSortButton
              sort={ageSort}
              onCycle={() => setAgeSort(cycleAgeSort)}
            />
            <SkillLevelFilter
              filters={skillFilters}
              onToggle={toggleSkillFilter}
              align="end"
            />
          </div>
          <div className="hidden grid-cols-[2fr_0.6fr_1.2fr_1fr_auto] gap-4 border-b border-border/60 bg-muted/50 px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase lg:grid">
            <span>Skater</span>
            <AgeSortButton
              sort={ageSort}
              onCycle={() => setAgeSort(cycleAgeSort)}
            />
            <SkillLevelFilter
              filters={skillFilters}
              onToggle={toggleSkillFilter}
            />
            <span>Classes</span>
            <span className="sr-only">Action</span>
          </div>
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-medium">No matching students</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {hasQuery
                  ? "Try a different search or filter."
                  : "Add a student to get started."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {filtered.map((student) => {
                const age = ageFromDob(student.date_of_birth);
                const skill = student.skill_level as SkillLevel | null;
                const bar = skill ? SKILL_BAR[skill] ?? 40 : 0;

                return (
                  <li key={student.id}>
                    <Link
                      href={`/admin/students/${student.id}`}
                      className="grid gap-3 px-4 py-4 transition-colors hover:bg-muted/40 lg:grid-cols-[2fr_0.6fr_1.2fr_1fr_auto] lg:items-center lg:gap-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <UserRound className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <p className="truncate font-medium">
                              {student.full_name}
                            </p>
                            {student.is_trial ? (
                              <Badge variant="warning">Trial</Badge>
                            ) : null}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {student.contact_phone ?? "No contact on file"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="lg:hidden text-muted-foreground">
                          Age:
                        </span>
                        <span>{age ?? "—"}</span>
                        {student.is_minor ? (
                          <Badge variant="guardian">Guardian req.</Badge>
                        ) : null}
                      </div>

                      <div className="space-y-1.5">
                        {skill ? (
                          <>
                            <p className="text-sm">
                              {SKILL_LEVEL_LABELS[skill]}
                            </p>
                            <div className="h-1.5 max-w-[10rem] overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${bar}%` }}
                              />
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not set
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {student.enrolment_count} class
                        {student.enrolment_count === 1 ? "" : "es"}
                      </p>

                      <ChevronRight className="hidden size-4 text-muted-foreground lg:block" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {students.length} skaters
          </div>
        </div>
      )}
    </div>
  );
}
