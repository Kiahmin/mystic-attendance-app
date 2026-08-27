"use client";

import { useMemo, useState } from "react";
import { ChevronsUpDown, X } from "lucide-react";
import type { Student } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type StudentOption = Pick<Student, "id" | "full_name">;

type StudentSharePickerProps = {
  id?: string;
  students: StudentOption[];
  excludeIds: string[];
  value: string[];
  onChange: (studentIds: string[]) => void;
  preferredIds?: string[];
  single?: boolean;
  placeholder?: string;
};

export function StudentSharePicker({
  id,
  students,
  excludeIds,
  value,
  onChange,
  preferredIds = [],
  single = false,
  placeholder,
}: StudentSharePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const excluded = new Set(excludeIds);

  const selected = students.filter((student) => value.includes(student.id));
  const preferred = new Set(preferredIds);
  const available = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = students.filter((student) => {
      if (excluded.has(student.id) || value.includes(student.id)) return false;
      if (!q) return true;
      return student.full_name.toLowerCase().includes(q);
    });
    return matches.sort((a, b) => {
      const aPref = preferred.has(a.id) ? 0 : 1;
      const bPref = preferred.has(b.id) ? 0 : 1;
      if (aPref !== bPref) return aPref - bPref;
      return a.full_name.localeCompare(b.full_name);
    });
  }, [students, excluded, value, query, preferredIds]);

  function addStudent(studentId: string) {
    if (excluded.has(studentId) || value.includes(studentId)) return;
    onChange(single ? [studentId] : [...value, studentId]);
    setQuery("");
    setOpen(false);
  }

  function removeStudent(studentId: string) {
    onChange(value.filter((id) => id !== studentId));
  }

  return (
    <div className="space-y-2">
      {selected.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {selected.map((student) => (
            <li
              key={student.id}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-sm"
            >
              {student.full_name}
              <button
                type="button"
                onClick={() => removeStudent(student.id)}
                className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${student.full_name}`}
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-9 w-full justify-between font-normal"
          >
            <span className="truncate text-muted-foreground">
              {placeholder
                ? placeholder
                : selected.length > 0
                  ? "Add another sibling…"
                  : "Share credits with siblings…"}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-2"
          align="start"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students…"
            className="mb-2 h-8"
          />
          <div className="max-h-56 overflow-y-auto">
            {available.map((student) => (
              <button
                key={student.id}
                type="button"
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                onClick={() => addStudent(student.id)}
              >
                <span className="min-w-0 truncate">{student.full_name}</span>
                {preferred.has(student.id) ? (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    Same payer
                  </span>
                ) : null}
              </button>
            ))}
            {available.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                No matching students.
              </p>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
