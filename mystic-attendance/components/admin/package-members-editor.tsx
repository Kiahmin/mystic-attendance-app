"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import {
  addPackageStudent,
  removePackageStudent,
} from "@/lib/actions/packages";
import { extraPackageMembers } from "@/lib/package-utils";
import type { Package, PackageMember, Student } from "@/lib/types";
import { StudentSharePicker } from "@/components/admin/student-share-picker";
import { Label } from "@/components/ui/label";

type PackageMembersEditorProps = {
  pkg: Package;
  students: Pick<Student, "id" | "full_name">[];
};

export function PackageMembersEditor({
  pkg,
  students,
}: PackageMembersEditorProps) {
  const extras = extraPackageMembers(pkg);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (pkg.session_id) return null;

  function handleAdd(studentIds: string[]) {
    const nextId = studentIds.find(
      (id) => !pkg.members.some((member) => member.id === id)
    );
    if (!nextId) return;
    setError(null);
    startTransition(async () => {
      const result = await addPackageStudent(pkg.id, nextId);
      if (result.error) setError(result.error);
    });
  }

  function handleRemove(member: PackageMember) {
    setError(null);
    startTransition(async () => {
      const result = await removePackageStudent(pkg.id, member.id);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="mt-3 space-y-2">
      <Label className="text-xs tracking-wider text-muted-foreground uppercase">
        Shared with
      </Label>
      {extras.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {extras.map((member) => (
            <li
              key={member.id}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm"
            >
              {member.full_name}
              <button
                type="button"
                onClick={() => handleRemove(member)}
                disabled={pending}
                className="rounded-full p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-50"
                aria-label={`Remove ${member.full_name}`}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <StudentSharePicker
        students={students}
        excludeIds={[pkg.student_id, ...extras.map((member) => member.id)]}
        value={[]}
        onChange={handleAdd}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
