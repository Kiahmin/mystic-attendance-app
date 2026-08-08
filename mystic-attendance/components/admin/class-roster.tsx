"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { unenrolStudent } from "@/lib/actions/enrolments";
import type { EnrolmentWithStudent } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
