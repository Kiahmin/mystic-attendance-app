"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  loadPackageChargedAttendance,
  markPackageInformed,
} from "@/lib/actions/packages";
import {
  ATTENDANCE_STATUS_LABELS,
  formatSessionTime,
} from "@/lib/attendance-utils";
import { formatCalendarDate } from "@/lib/datetime";
import { remainingCreditsLabel } from "@/lib/package-utils";
import type { PackageChargedVisit } from "@/lib/queries/attendance";
import type { DashboardQueueItem } from "@/lib/queries/dashboard";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type InformPackageDialogProps = {
  packageId: string;
  studentName: string;
  packageLabel: string;
  remainingCredits: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InformPackageDialog({
  packageId,
  studentName,
  packageLabel,
  remainingCredits,
  open,
  onOpenChange,
}: InformPackageDialogProps) {
  const router = useRouter();
  const [, startLoad] = useTransition();
  const [confirmPending, startConfirm] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [visits, setVisits] = useState<PackageChargedVisit[] | null>(null);
  const remainingLabel = remainingCreditsLabel(remainingCredits);

  function handleOpenChange(next: boolean) {
    if (!next) {
      setError(null);
      setVisits(null);
    }
    onOpenChange(next);
  }

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setError(null);
    setVisits(null);
    startLoad(async () => {
      const result = await loadPackageChargedAttendance(packageId);
      if (cancelled) return;
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      if ("visits" in result && result.visits) setVisits(result.visits);
    });

    return () => {
      cancelled = true;
    };
  }, [open, packageId]);

  function handleConfirm() {
    if (visits === null) return;
    setError(null);
    startConfirm(async () => {
      const result = await markPackageInformed(packageId);
      if (result.error) {
        setError(result.error);
        return;
      }
      handleOpenChange(false);
      router.refresh();
    });
  }

  const showStudentNames =
    new Set(visits?.map((visit) => visit.studentName).filter(Boolean)).size > 1;

  function visitWhen(visit: PackageChargedVisit) {
    const date = formatCalendarDate(visit.sessionDate);
    return visit.startTime
      ? `${date} ${formatSessionTime(visit.startTime)}`
      : date;
  }

  function visitStatus(visit: PackageChargedVisit) {
    return visit.status ? ATTENDANCE_STATUS_LABELS[visit.status] : "—";
  }

  const rowClassName = cn(
    "grid min-h-0 min-w-0 items-center gap-x-2 overflow-hidden px-3",
    showStudentNames
      ? "grid-cols-[minmax(0,1.3fr)_minmax(0,1.4fr)_auto_minmax(0,1fr)]"
      : "grid-cols-[minmax(0,1.3fr)_minmax(0,1.4fr)_auto]"
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="flex max-h-dvh flex-col overflow-hidden sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>Inform {studentName}</DialogTitle>
          <DialogDescription>
            Classes charged to {packageLabel} ({remainingLabel}).
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive" className="shrink-0">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {visits === null && !error ? (
          <div
            className="shrink-0 rounded-lg border border-border"
            aria-busy="true"
            aria-live="polite"
          >
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Loading classes…
            </p>
          </div>
        ) : visits && visits.length === 0 ? (
          <div
            className="shrink-0 rounded-lg border border-border"
            aria-live="polite"
          >
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No classes have been charged to this package yet.
            </p>
          </div>
        ) : visits ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border">
            <div
              className={cn(
                rowClassName,
                "shrink-0 border-b border-border bg-muted/50 py-1.5 text-xs font-medium text-muted-foreground"
              )}
              role="row"
            >
              <span className="truncate">Date</span>
              <span className="truncate">Class</span>
              <span className="shrink-0">Status</span>
              {showStudentNames ? (
                <span className="truncate">Student</span>
              ) : null}
            </div>
            <ul
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
              aria-label="Classes charged to this finishing package"
            >
              {visits.map((visit) => {
                const when = visitWhen(visit);
                const status = visitStatus(visit);
                const student = visit.studentName ?? "—";
                return (
                  <li
                    key={visit.id}
                    className={cn(
                      rowClassName,
                      "flex-1 border-b border-border py-0.5 text-sm last:border-b-0"
                    )}
                  >
                    <span className="truncate text-muted-foreground" title={when}>
                      {when}
                    </span>
                    <span
                      className="truncate font-medium"
                      title={visit.sessionName}
                    >
                      {visit.sessionName}
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {status}
                    </span>
                    {showStudentNames ? (
                      <span className="truncate text-muted-foreground" title={student}>
                        {student}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <DialogFooter className="shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={confirmPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={confirmPending || visits === null}
            aria-busy={confirmPending}
          >
            {confirmPending ? "Saving…" : "Confirm inform"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function InformButton({ item }: { item: DashboardQueueItem }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        Inform
      </Button>
      <InformPackageDialog
        packageId={item.packageId}
        studentName={item.studentName}
        packageLabel={item.packageLabel}
        remainingCredits={item.remainingCredits}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
