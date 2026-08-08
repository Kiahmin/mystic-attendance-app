"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus, Search } from "lucide-react";
import { StudentForm } from "@/components/admin/student-form";
import { SKILL_LEVEL_LABELS } from "@/lib/admin-utils";
import type { SkillLevel, StudentListItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
            placeholder="Search students…"
            className="pl-9"
            aria-label="Search students"
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              Add student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg" showCloseButton>
            <DialogHeader>
              <DialogTitle>Add student</DialogTitle>
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
        <div className="rounded-xl border border-dashed p-8 text-center">
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
        <ul className="space-y-2">
          {filtered.map((student) => (
            <li key={student.id}>
              <Link href={`/admin/students/${student.id}`} className="block">
                <Card className="transition-colors hover:border-primary/30 hover:bg-muted/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-base">
                          {student.full_name}
                        </CardTitle>
                        <CardDescription>
                          {student.enrolment_count} class
                          {student.enrolment_count === 1 ? "" : "es"}
                        </CardDescription>
                      </div>
                      <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {student.skill_level ? (
                      <Badge variant="secondary">
                        {
                          SKILL_LEVEL_LABELS[
                            student.skill_level as SkillLevel
                          ]
                        }
                      </Badge>
                    ) : null}
                    {student.is_minor ? (
                      <Badge
                        variant="outline"
                        className="border-amber-500 text-amber-700"
                      >
                        Minor
                      </Badge>
                    ) : null}
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
