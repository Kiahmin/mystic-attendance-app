"use client";

import { useState, useTransition } from "react";
import { Search, UserPlus } from "lucide-react";
import type { CheckInStudent } from "@/lib/types";
import { markWalkIn, searchStudentsForWalkIn } from "@/lib/actions/walk-in";
import { StudentCheckInRow } from "@/components/coach/student-check-in-row";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AttendancePanelProps {
  sessionId: string;
  cancelled: boolean;
  enrolledStudents: CheckInStudent[];
  walkIns: CheckInStudent[];
}

export function AttendancePanel({
  sessionId,
  cancelled,
  enrolledStudents,
  walkIns,
}: AttendancePanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    { id: string; full_name: string; skill_level: string | null }[]
  >([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [declineReason, setDeclineReason] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const checkedInCount = enrolledStudents.filter(
    (entry) =>
      entry.attendance?.status === "present" ||
      entry.attendance?.status === "walk_in"
  ).length;

  async function handleSearch(value: string) {
    setQuery(value);
    setSelectedStudentId(null);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    const students = await searchStudentsForWalkIn(value);
    setResults(students);
  }

  function resetDialog() {
    setQuery("");
    setResults([]);
    setSelectedStudentId(null);
    setDeclineReason("");
    setError(null);
  }

  function handleWalkIn(walkInStatus: "admitted" | "declined") {
    if (!selectedStudentId) {
      setError("Select a student first.");
      return;
    }

    startTransition(async () => {
      const result = await markWalkIn(
        sessionId,
        selectedStudentId,
        walkInStatus,
        declineReason
      );
      if (result?.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      resetDialog();
    });
  }

  return (
    <div className="space-y-6">
      {cancelled ? (
        <Alert variant="destructive">
          <AlertDescription>
            This session has been cancelled. Attendance check-in is disabled.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted px-4 py-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Enrolled
          </p>
          <p className="font-heading text-2xl font-semibold">
            {enrolledStudents.length}
          </p>
        </div>
        <div className="rounded-xl bg-muted px-4 py-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Checked In
          </p>
          <p className="font-heading text-2xl font-semibold">{checkedInCount}</p>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold">Roster</h2>
          <Dialog
            open={open}
            onOpenChange={(next) => {
              setOpen(next);
              if (!next) resetDialog();
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={cancelled}>
                <UserPlus className="size-4" />
                Walk-in
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record walk-in</DialogTitle>
                <DialogDescription>
                  Search for an existing student profile, then admit or decline
                  them.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="walk-in-search">Student name</Label>
                  <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="walk-in-search"
                      value={query}
                      onChange={(event) => handleSearch(event.target.value)}
                      placeholder="Search & add walk-in…"
                      className="pl-9"
                    />
                  </div>
                </div>

                {results.length > 0 ? (
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-2">
                    {results.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => setSelectedStudentId(student.id)}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                          selectedStudentId === student.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span>{student.full_name}</span>
                        {student.skill_level ? (
                          <span className="text-xs capitalize opacity-80">
                            {student.skill_level}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="decline-reason">
                    Decline reason (required if declining)
                  </Label>
                  <Textarea
                    id="decline-reason"
                    value={declineReason}
                    onChange={(event) => setDeclineReason(event.target.value)}
                    placeholder="e.g. Class at safety ratio limit"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => handleWalkIn("declined")}
                >
                  Decline
                </Button>
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => handleWalkIn("admitted")}
                >
                  Admit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {enrolledStudents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No students enrolled in this class.
          </p>
        ) : (
          enrolledStudents.map((entry) => (
            <StudentCheckInRow
              key={entry.student.id}
              sessionId={sessionId}
              entry={entry}
              disabled={cancelled}
            />
          ))
        )}
      </section>

      {walkIns.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-heading text-lg font-semibold">Walk-ins</h2>
          {walkIns.map((entry) => (
            <StudentCheckInRow
              key={entry.student.id}
              sessionId={sessionId}
              entry={entry}
              disabled={cancelled}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}
