"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Search, UserRound } from "lucide-react";
import { StudentForm } from "@/components/admin/student-form";
import { ageFromDob, SKILL_LEVEL_LABELS } from "@/lib/admin-utils";
import type { SkillLevel, StudentListItem } from "@/lib/types";
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
import { Input } from "@/components/ui/input";

type StudentListProps = {
  students: StudentListItem[];
  initialSearch?: string;
};

const SKILL_BAR: Partial<Record<SkillLevel, number>> = {
  beginner: 33,
  intermediate: 66,
  advanced: 85,
  freestyle: 100,
};

export function StudentList({ students, initialSearch = "" }: StudentListProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(initialSearch);

  const filtered = search.trim()
    ? students.filter((s) =>
        s.full_name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : students;

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
            <StudentForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">
            {search.trim() ? "No matching students" : "No students yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {search.trim()
              ? "Try a different search."
              : "Add a student to get started."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
          <div className="hidden grid-cols-[2fr_0.6fr_1.2fr_1fr_auto] gap-4 border-b border-border/60 bg-muted/50 px-4 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase lg:grid">
            <span>Skater</span>
            <span>Age</span>
            <span>Skill Level</span>
            <span>Classes</span>
            <span className="sr-only">Action</span>
          </div>
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
                        <p className="truncate font-medium">
                          {student.full_name}
                        </p>
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
          <div className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {students.length} skaters
          </div>
        </div>
      )}
    </div>
  );
}
