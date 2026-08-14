"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, X } from "lucide-react";
import {
  enrolStudent,
  searchStudentsForEnrolment,
  unenrolStudent,
} from "@/lib/actions/enrolments";
import type { EnrolmentWithStudent } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SKILL_LEVEL_LABELS } from "@/lib/admin-utils";
import type { SkillLevel } from "@/lib/types";
import Link from "next/link";

type ClassRosterProps = {
  classId: string;
  enrolments: EnrolmentWithStudent[];
};

export function ClassRoster({ classId, enrolments }: ClassRosterProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; full_name: string; skill_level: string | null }[]
  >([]);
  const [searching, setSearching] = useState(false);
  const searchSeq = useRef(0);
  const trimmedQuery = query.trim();

  useEffect(() => {
    if (!trimmedQuery) {
      setResults([]);
      setSearching(false);
      return;
    }

    const seq = ++searchSeq.current;
    setSearching(true);
    const enrolledIds = new Set(enrolments.map((e) => e.student_id));
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const students = await searchStudentsForEnrolment(trimmedQuery);
          if (seq !== searchSeq.current) return;
          setResults(students.filter((s) => !enrolledIds.has(s.id)));
        } catch {
          if (seq !== searchSeq.current) return;
          setResults([]);
        } finally {
          if (seq === searchSeq.current) setSearching(false);
        }
      })();
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [trimmedQuery, enrolments]);

  function handleEnrol(studentId: string) {
    setError(null);
    startTransition(async () => {
      const result = await enrolStudent(studentId, classId);
      if (result.error) {
        setError(result.error);
        return;
      }
      setQuery("");
      setResults([]);
      router.refresh();
    });
  }

  function handleUnenrol(studentId: string) {
    setError(null);
    startTransition(async () => {
      const result = await unenrolStudent(studentId, classId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="class-roster-search">Add student</Label>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="class-roster-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type to search students…"
            className="pl-9"
            disabled={pending}
          />
        </div>
        {searching ? (
          <p className="text-sm text-muted-foreground">Searching…</p>
        ) : trimmedQuery && results.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No matching students.
          </p>
        ) : results.length > 0 ? (
          <ul className="max-h-40 overflow-auto rounded-lg border border-border/70">
            {results.map((student) => (
              <li
                key={student.id}
                className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {student.full_name}
                  </p>
                  {student.skill_level ? (
                    <p className="text-xs text-muted-foreground capitalize">
                      {student.skill_level}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => handleEnrol(student.id)}
                >
                  <Plus className="size-4" />
                  Enrol
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {enrolments.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No students enrolled in this class.
        </p>
      ) : (
        <ul className="space-y-2">
          {enrolments.map((enrolment) => {
            const student = enrolment.students;
            return (
              <li
                key={enrolment.id}
                className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/students/${student.id}`}
                    className="truncate font-medium hover:underline"
                  >
                    {student.full_name}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-1.5">
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
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={pending}
                  aria-label={`Unenrol ${student.full_name}`}
                  onClick={() => handleUnenrol(student.id)}
                >
                  <X className="size-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
