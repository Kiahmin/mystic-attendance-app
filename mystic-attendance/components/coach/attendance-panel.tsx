"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, UserPlus, Users } from "lucide-react";
import type { CheckInStudent, StudentSearchHit } from "@/lib/types";
import {
  excludeStudentFromSession,
  includeStudentInSession,
  searchStudentsForSessionAttendees,
} from "@/lib/actions/session-attendees";
import { markWalkIn, searchStudentsForWalkIn } from "@/lib/actions/walk-in";
import { StudentCheckInRow } from "@/components/coach/student-check-in-row";
import { EventFeeFields, type EventFeeValues } from "@/components/sessions/event-fee-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  emptyRosterMessage?: string;
  requiresEventPackage?: boolean;
}

export function AttendancePanel({
  sessionId,
  cancelled,
  enrolledStudents,
  walkIns,
  emptyRosterMessage = "No expected students for this session.",
  requiresEventPackage = false,
}: AttendancePanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [walkInOpen, setWalkInOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [walkInQuery, setWalkInQuery] = useState("");
  const [walkInResults, setWalkInResults] = useState<StudentSearchHit[]>([]);
  const [selectedWalkInId, setSelectedWalkInId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const [addQuery, setAddQuery] = useState("");
  const [addResults, setAddResults] = useState<StudentSearchHit[]>([]);
  const [addSearching, setAddSearching] = useState(false);
  const [pendingStudent, setPendingStudent] = useState<StudentSearchHit | null>(
    null
  );
  const addSearchSeq = useRef(0);

  const checkedInCount = enrolledStudents.filter(
    (entry) => entry.attendance?.status === "present"
  ).length;

  const trimmedAddQuery = addQuery.trim();

  useEffect(() => {
    if (!addOpen) return;

    if (!trimmedAddQuery) {
      setAddResults([]);
      setAddSearching(false);
      return;
    }

    const onRosterIds = new Set(enrolledStudents.map((e) => e.student.id));
    const seq = ++addSearchSeq.current;
    setAddSearching(true);
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const students = await searchStudentsForSessionAttendees(
            trimmedAddQuery
          );
          if (seq !== addSearchSeq.current) return;
          setAddResults(students.filter((s) => !onRosterIds.has(s.id)));
        } catch {
          if (seq !== addSearchSeq.current) return;
          setAddResults([]);
        } finally {
          if (seq === addSearchSeq.current) setAddSearching(false);
        }
      })();
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [trimmedAddQuery, addOpen, enrolledStudents]);

  function resetWalkInDialog() {
    setWalkInQuery("");
    setWalkInResults([]);
    setSelectedWalkInId(null);
    setDeclineReason("");
    setError(null);
  }

  function resetAddDialog() {
    addSearchSeq.current += 1;
    setAddQuery("");
    setAddResults([]);
    setAddSearching(false);
    setPendingStudent(null);
    setError(null);
  }

  async function handleWalkInSearch(value: string) {
    setWalkInQuery(value);
    setSelectedWalkInId(null);
    if (value.trim().length < 2) {
      setWalkInResults([]);
      return;
    }
    setWalkInResults(await searchStudentsForWalkIn(value));
  }

  function handleWalkIn(walkInStatus: "admitted" | "declined") {
    if (!selectedWalkInId) {
      setError("Select a student first.");
      return;
    }

    startTransition(async () => {
      const result = await markWalkIn(
        sessionId,
        selectedWalkInId,
        walkInStatus,
        declineReason
      );
      if (result?.error) {
        setError(result.error);
        return;
      }
      setWalkInOpen(false);
      resetWalkInDialog();
      router.refresh();
    });
  }

  function handleAddToRoster(student: StudentSearchHit) {
    setError(null);
    if (requiresEventPackage) {
      setPendingStudent(student);
      return;
    }
    void confirmAdd(student.id);
  }

  function confirmAdd(studentId: string, eventPackage?: EventFeeValues) {
    startTransition(async () => {
      const result = await includeStudentInSession(
        sessionId,
        studentId,
        eventPackage
          ? {
              amountSgd: eventPackage.amountSgd,
              isPaid: eventPackage.isPaid,
              paymentMethod: eventPackage.paymentMethod,
              notes: eventPackage.notes,
            }
          : undefined
      );
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setAddOpen(false);
      resetAddDialog();
      router.refresh();
    });
  }

  function handleRemoveFromRoster(studentId: string) {
    setError(null);
    startTransition(async () => {
      const result = await excludeStudentFromSession(sessionId, studentId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      router.refresh();
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

      {error && !walkInOpen && !addOpen ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted px-4 py-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Expected
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold">Roster</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog
              open={addOpen}
              onOpenChange={(next) => {
                setAddOpen(next);
                if (!next) resetAddDialog();
              }}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={cancelled}>
                  <Users className="size-4" />
                  Add student
                </Button>
              </DialogTrigger>
              <DialogContent
                className={
                  pendingStudent ? "sm:max-w-[500px]" : undefined
                }
              >
                <DialogHeader>
                  <DialogTitle>Add to this session</DialogTitle>
                  {pendingStudent ? null : (
                    <DialogDescription>
                      One-off for this session only. Class enrolments are
                      unchanged.
                    </DialogDescription>
                  )}
                </DialogHeader>

                <div className="space-y-4">
                  {error ? (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  ) : null}

                  {pendingStudent ? (
                    <EventFeeFields
                      key={pendingStudent.id}
                      studentName={pendingStudent.full_name}
                      onBack={() => {
                        setPendingStudent(null);
                        setError(null);
                      }}
                      onConfirm={(values) => {
                        setError(null);
                        confirmAdd(pendingStudent.id, values);
                      }}
                      pending={pending}
                    />
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="add-roster-search">Student name</Label>
                        <div className="relative">
                          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="add-roster-search"
                            value={addQuery}
                            onChange={(event) => setAddQuery(event.target.value)}
                            placeholder="Type to search students…"
                            className="pl-9"
                            disabled={pending}
                            autoFocus
                          />
                        </div>
                      </div>

                      {addSearching ? (
                        <p className="text-sm text-muted-foreground">Searching…</p>
                      ) : trimmedAddQuery && addResults.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No matching students.
                        </p>
                      ) : addResults.length > 0 ? (
                        <ul className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-2">
                          {addResults.map((student) => (
                            <li
                              key={student.id}
                              className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5"
                            >
                              <div className="min-w-0">
                                <div className="flex min-w-0 items-center gap-2">
                                  <p className="truncate text-sm font-medium">
                                    {student.full_name}
                                  </p>
                                  {student.is_trial ? (
                                    <Badge variant="warning">Trial</Badge>
                                  ) : null}
                                </div>
                                {student.skill_level ? (
                                  <p className="text-xs text-muted-foreground capitalize">
                                    {student.skill_level}
                                  </p>
                                ) : null}
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                disabled={pending}
                                onClick={() => handleAddToRoster(student)}
                              >
                                <UserPlus className="size-4" />
                                Add
                              </Button>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={walkInOpen}
              onOpenChange={(next) => {
                setWalkInOpen(next);
                if (!next) resetWalkInDialog();
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
                    Search for an existing student profile, then admit or
                    decline them.
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
                        value={walkInQuery}
                        onChange={(event) =>
                          void handleWalkInSearch(event.target.value)
                        }
                        placeholder="Search & add walk-in…"
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {walkInResults.length > 0 ? (
                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-2">
                      {walkInResults.map((student) => (
                        <button
                          key={student.id}
                          type="button"
                          onClick={() => setSelectedWalkInId(student.id)}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                            selectedWalkInId === student.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="truncate">{student.full_name}</span>
                            {student.is_trial ? (
                              <Badge
                                variant={
                                  selectedWalkInId === student.id
                                    ? "secondary"
                                    : "warning"
                                }
                              >
                                Trial
                              </Badge>
                            ) : null}
                          </span>
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
        </div>

        {enrolledStudents.length === 0 ? (
          <p className="text-sm text-muted-foreground">{emptyRosterMessage}</p>
        ) : (
          enrolledStudents.map((entry) => (
            <StudentCheckInRow
              key={entry.student.id}
              sessionId={sessionId}
              entry={entry}
              disabled={cancelled}
              onRemoveFromSession={
                cancelled ? undefined : handleRemoveFromRoster
              }
              removePending={pending}
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
