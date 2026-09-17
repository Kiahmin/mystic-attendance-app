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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[90dvh] overflow-hidden sm:max-w-lg"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle>Inform {studentName}</DialogTitle>
          <DialogDescription>
            Classes charged to {packageLabel} ({remainingLabel}).
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {visits === null && !error ? (
          <div
            className="rounded-lg border border-border"
            aria-busy="true"
            aria-live="polite"
          >
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Loading classes…
            </p>
          </div>
        ) : visits && visits.length === 0 ? (
          <div className="rounded-lg border border-border" aria-live="polite">
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No classes have been charged to this package yet.
            </p>
          </div>
        ) : visits ? (
          <div className="max-h-[min(50vh,20rem)] overflow-y-auto rounded-lg border border-border">
            <ul
              className="sm:hidden"
              aria-label="Classes charged to this finishing package"
            >
              {visits.map((visit) => (
                <li
                  key={visit.id}
                  className="border-b border-border px-3 py-2 last:border-b-0"
                >
                  <p className="min-w-0 break-words font-medium">
                    {visit.sessionName}
                  </p>
                  <p className="mt-0.5 min-w-0 break-words text-xs text-muted-foreground">
                    {visitWhen(visit)}
                    {" · "}
                    {visitStatus(visit)}
                    {showStudentNames
                      ? ` · ${visit.studentName ?? "—"}`
                      : null}
                  </p>
                </li>
              ))}
            </ul>
            <table className="hidden w-full text-left text-sm sm:table">
              <caption className="sr-only">
                Classes charged to this finishing package
              </caption>
              <thead className="border-b border-border bg-muted/50 text-xs font-medium text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-1.5 font-medium">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-1.5 font-medium">
                    Class
                  </th>
                  <th scope="col" className="px-3 py-1.5 font-medium">
                    Status
                  </th>
                  {showStudentNames ? (
                    <th scope="col" className="px-3 py-1.5 font-medium">
                      Student
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr
                    key={visit.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-3 py-1 text-muted-foreground">
                      {visitWhen(visit)}
                    </td>
                    <td className="min-w-0 break-words px-3 py-1">
                      {visit.sessionName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-1 text-muted-foreground">
                      {visitStatus(visit)}
                    </td>
                    {showStudentNames ? (
                      <td className="whitespace-nowrap px-3 py-1 text-muted-foreground">
                        {visit.studentName ?? "—"}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <DialogFooter>
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
