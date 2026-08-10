"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createStudent,
  updateStudent,
  type StudentInput,
} from "@/lib/actions/students";
import {
  ageFromDob,
  isMinorDob,
  SKILL_LEVEL_LABELS,
  SKILL_LEVELS,
} from "@/lib/admin-utils";
import type { SkillLevel, Student } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type StudentFormProps = {
  student?: Student;
  onSuccess?: (id: string) => void;
  submitLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
};

export function StudentForm({
  student,
  onSuccess,
  submitLabel,
  showCancel,
  onCancel,
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
  const age = useMemo(() => ageFromDob(dateOfBirth || null), [dateOfBirth]);

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
          Personal Information
        </h3>
        <div className="space-y-2">
          <Label htmlFor="full_name">
            Full name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Jane Doe"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">
              Date of birth <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date_of_birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required={!student}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              value={age != null ? String(age) : ""}
              readOnly
              placeholder="Auto-calculated"
              className="bg-muted"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact number</Label>
          <Input
            id="contact_phone"
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            autoComplete="tel"
            placeholder="+65 …"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
          Skating Profile
        </h3>
        <div className="space-y-2">
          <Label>Skill level</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SKILL_LEVELS.map((level) => {
              const selected = skillLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSkillLevel(level)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {SKILL_LEVEL_LABELS[level]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className={cn(
          "space-y-4 rounded-xl p-4",
          isMinor ? "bg-muted" : "border border-border/70"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
            Guardian &amp; Medical Details
          </h3>
          {isMinor ? <Badge variant="guardian">Guardian required</Badge> : null}
        </div>

        {isMinor ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guardian_name">
                Parent / guardian name{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="guardian_name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                required
                placeholder="John Doe"
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
        ) : (
          <p className="text-sm text-muted-foreground">
            Guardian fields appear when the student is under 18.
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Medical notes / allergies</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="List conditions, allergies, or medications…"
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {showCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={pending} className="sm:min-w-36">
          {pending
            ? "Saving…"
            : (submitLabel ?? (student ? "Save Changes" : "Save Student"))}
        </Button>
      </div>
    </form>
  );
}
