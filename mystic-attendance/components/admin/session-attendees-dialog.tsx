"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, UserMinus, UserPlus, X } from "lucide-react";
import {
  excludeStudentFromSession,
  getSessionAttendeesForEditor,
  includeStudentInSession,
  searchStudentsForSessionAttendees,
} from "@/lib/actions/session-attendees";
import type { SessionRosterStudent } from "@/lib/session-roster";
import type { StudentSearchHit } from "@/lib/types";
import { EventFeeFields, type EventFeeValues } from "@/components/sessions/event-fee-fields";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SessionAttendeesDialogProps = {
  sessionId: string;
  className: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requiresEventPackage?: boolean;
};

export function SessionAttendeesDialog({
  sessionId,
  className,
  open,
  onOpenChange,
  requiresEventPackage = false,
}: SessionAttendeesDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<SessionRosterStudent[]>([]);
  const [cancelled, setCancelled] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StudentSearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [pendingStudent, setPendingStudent] = useState<StudentSearchHit | null>(
    null
  );
  const searchSeq = useRef(0);
  const trimmedQuery = query.trim();

  useEffect(() => {
    if (!open) return;

    let cancelledFetch = false;
    setLoading(true);
    setError(null);
    searchSeq.current += 1;
    setQuery("");
    setResults([]);
    setSearching(false);
    setPendingStudent(null);

    void (async () => {
      const result = await getSessionAttendeesForEditor(sessionId);
      if (cancelledFetch) return;
      setLoading(false);
      if ("error" in result) {
        setError(result.error);
        setAttendees([]);
        return;
      }
      setAttendees(result.attendees);
      setCancelled(result.cancelled);
    })();

    return () => {
      cancelledFetch = true;
    };
  }, [open, sessionId]);

  useEffect(() => {
    if (!open) return;

    if (!trimmedQuery) {
      setResults([]);
      setSearching(false);
      return;
    }

    const seq = ++searchSeq.current;
    setSearching(true);
    const onRoster = new Set(attendees.map((a) => a.student.id));
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const students = await searchStudentsForSessionAttendees(trimmedQuery);
          if (seq !== searchSeq.current) return;
          setResults(students.filter((s) => !onRoster.has(s.id)));
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
  }, [trimmedQuery, open, attendees]);

  async function refreshList() {
    const result = await getSessionAttendeesForEditor(sessionId);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setAttendees(result.attendees);
    setCancelled(result.cancelled);
  }

  function handleAdd(student: StudentSearchHit) {
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
      setQuery("");
      setResults([]);
      setPendingStudent(null);
      await refreshList();
      router.refresh();
    });
  }

  function handleRemove(studentId: string) {
    setError(null);
    startTransition(async () => {
      const result = await excludeStudentFromSession(sessionId, studentId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      await refreshList();
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={pendingStudent ? "sm:max-w-[500px]" : "sm:max-w-lg"}
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>
            {pendingStudent ? "Add to this session" : "Edit attendees"}
          </DialogTitle>
          {pendingStudent ? null : (
            <DialogDescription>
              One-off changes for {className}. Class enrolments are unchanged.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {cancelled ? (
            <Alert>
              <AlertDescription>
                This session is cancelled. Attendee edits are disabled.
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            {pendingStudent ? null : (
              <Label htmlFor="session-attendee-search">Add student</Label>
            )}
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
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="session-attendee-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type to search students…"
                className="pl-9"
                disabled={pending || cancelled}
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
                      variant="outline"
                      disabled={pending || cancelled}
                      onClick={() => handleAdd(student)}
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

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Expected this session ({attendees.length})
            </p>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : attendees.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No expected attendees for this session.
              </p>
            ) : (
              <ul className="max-h-64 space-y-2 overflow-auto">
                {attendees.map((entry) => (
                  <li
                    key={entry.student.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-medium">
                          {entry.student.full_name}
                        </p>
                        {entry.student.is_trial ? (
                          <Badge variant="warning">Trial</Badge>
                        ) : null}
                      </div>
                      {entry.source === "include" && !entry.student.is_trial ? (
                        <Badge variant="warning" className="mt-1">
                          One-off
                        </Badge>
                      ) : entry.source !== "include" ? (
                        <Badge variant="secondary" className="mt-1">
                          Class
                        </Badge>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      title={
                        entry.source === "include"
                          ? "Remove one-off attendee"
                          : "Exclude from this session"
                      }
                      disabled={pending || cancelled}
                      onClick={() => handleRemove(entry.student.id)}
                    >
                      {entry.source === "include" ? (
                        <X className="size-4" />
                      ) : (
                        <UserMinus className="size-4" />
                      )}
                      <span className="sr-only">Remove from session</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
