"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { transferPackageCredits } from "@/lib/actions/packages";
import type { Student } from "@/lib/types";
import { StudentSharePicker } from "@/components/admin/student-share-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type TransferCreditsFormProps = {
  packageId: string;
  fromStudentId: string;
  remainingCredits: number;
  students: Pick<Student, "id" | "full_name" | "payer_id">[];
  preferredPayerId: string | null;
};

export function TransferCreditsForm({
  packageId,
  fromStudentId,
  remainingCredits,
  students,
  preferredPayerId,
}: TransferCreditsFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [toStudentId, setToStudentId] = useState<string[]>([]);
  const [credits, setCredits] = useState(String(remainingCredits));
  const [note, setNote] = useState("");

  const preferredIds = useMemo(
    () =>
      preferredPayerId
        ? students
            .filter(
              (student) =>
                student.payer_id === preferredPayerId &&
                student.id !== fromStudentId
            )
            .map((student) => student.id)
        : [],
    [students, preferredPayerId, fromStudentId]
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const dest = toStudentId[0];
    if (!dest) {
      setError("Choose a student to receive the credits.");
      return;
    }
    startTransition(async () => {
      const result = await transferPackageCredits({
        packageId,
        toStudentId: dest,
        credits: Number.parseInt(credits, 10),
        note,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/admin/students/${dest}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="transfer_to">Transfer to</Label>
        <StudentSharePicker
          id="transfer_to"
          students={students}
          excludeIds={[fromStudentId]}
          value={toStudentId}
          onChange={setToStudentId}
          preferredIds={preferredIds}
          single
          placeholder="Choose a student…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="transfer_credits">Credits</Label>
        <Input
          id="transfer_credits"
          type="number"
          min={1}
          max={remainingCredits}
          step={1}
          required
          value={credits}
          onChange={(event) => setCredits(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {remainingCredits} remaining on this package.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="transfer_note">Note (optional)</Label>
        <Textarea
          id="transfer_note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
        />
      </div>

      <Button
        type="submit"
        disabled={pending || toStudentId.length === 0}
        className="h-11 w-full"
      >
        {pending ? "Transferring…" : "Transfer credits"}
      </Button>
    </form>
  );
}
