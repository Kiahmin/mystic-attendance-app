"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createStudent,
  updateStudent,
  type StudentInput,
} from "@/lib/actions/students";
import {
  isMinorDob,
  SKILL_LEVEL_LABELS,
  SKILL_LEVELS,
} from "@/lib/admin-utils";
import type { SkillLevel, Student } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type StudentFormProps = {
  student?: Student;
  onSuccess?: (id: string) => void;
  submitLabel?: string;
};

export function StudentForm({
  student,
  onSuccess,
  submitLabel,
}: StudentFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(student?.full_name ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    student?.date_of_birth ?? ""
  );
  const [contactPhone, setContactPhone] = useState(
    student?.contact_phone ?? ""
  );
  const [guardianName, setGuardianName] = useState(
    student?.guardian_name ?? ""
  );
  const [guardianPhone, setGuardianPhone] = useState(
    student?.guardian_phone ?? ""
  );
  const [skillLevel, setSkillLevel] = useState<SkillLevel | "">(
    student?.skill_level ?? ""
  );
  const [notes, setNotes] = useState(student?.notes ?? "");

  const isMinor = useMemo(
    () => isMinorDob(dateOfBirth || null),
    [dateOfBirth]
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const input: StudentInput = {
      full_name: fullName,
      date_of_birth: dateOfBirth || null,
      contact_phone: contactPhone || null,
      guardian_name: guardianName || null,
      guardian_phone: guardianPhone || null,
      skill_level: skillLevel || null,
      notes: notes || null,
    };

    startTransition(async () => {
      if (student) {
        const result = await updateStudent(student.id, input);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.refresh();
        onSuccess?.(student.id);
        return;
      }

      const result = await createStudent(input);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.id) {
        onSuccess?.(result.id);
        router.push(`/admin/students/${result.id}`);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isMinor ? (
        <Badge
          variant="outline"
          className="border-amber-500 text-amber-700"
        >
          Guardian consent required
        </Badge>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact number</Label>
          <Input
            id="contact_phone"
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            autoComplete="tel"
          />
        </div>
      </div>

      {isMinor ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="guardian_name">Parent / guardian name</Label>
            <Input
              id="guardian_name"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardian_phone">Guardian phone</Label>
            <Input
              id="guardian_phone"
              type="tel"
              value={guardianPhone}
              onChange={(e) => setGuardianPhone(e.target.value)}
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="skill_level">Skill level</Label>
        <Select
          value={skillLevel || undefined}
          onValueChange={(value) =>
            setSkillLevel((value as SkillLevel) || "")
          }
        >
          <SelectTrigger id="skill_level" className="w-full">
            <SelectValue placeholder="Select skill level" />
          </SelectTrigger>
          <SelectContent>
            {SKILL_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {SKILL_LEVEL_LABELS[level]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending
          ? "Saving…"
          : (submitLabel ?? (student ? "Save changes" : "Create student"))}
      </Button>
    </form>
  );
}
