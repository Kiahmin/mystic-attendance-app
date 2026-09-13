"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Archive, ArchiveRestore } from "lucide-react";
import { setStudentArchived } from "@/lib/actions/students";
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

type ArchiveStudentButtonProps = {
  studentId: string;
  studentName: string;
  archived: boolean;
  variant?: "label" | "icon";
  returnHref?: string;
};

export function ArchiveStudentButton({
  studentId,
  studentName,
  archived,
  variant = "label",
  returnHref,
}: ArchiveStudentButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(next: boolean) {
    if (!next) setError(null);
    setOpen(next);
  }

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await setStudentArchived(studentId, !archived);
      if (result.error) {
        setError(result.error);
        return;
      }
      handleOpenChange(false);
      if (returnHref && !archived) {
        router.replace(returnHref);
        router.refresh();
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      {variant === "icon" ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          title={archived ? "Unarchive student" : "Archive student"}
          aria-label={archived ? "Unarchive student" : "Archive student"}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleOpenChange(true);
          }}
        >
          {archived ? (
            <ArchiveRestore className="size-4" />
          ) : (
            <Archive className="size-4" />
          )}
        </Button>
      ) : (
        <Button
          type="button"
          variant={archived ? "outline" : "destructive"}
          className="shrink-0"
          onClick={() => handleOpenChange(true)}
        >
          {archived ? (
            <ArchiveRestore className="size-4" />
          ) : (
            <Archive className="size-4" />
          )}
          {archived ? "Unarchive" : "Archive"}
        </Button>
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="gap-0 overflow-hidden p-0 sm:max-w-lg"
          showCloseButton
          onClick={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <DialogHeader className="flex-row items-center gap-3 space-y-0 border-b px-5 py-4">
            <span
              aria-hidden
              className={
                archived
                  ? "flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10"
                  : "flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10"
              }
            >
              {archived ? (
                <ArchiveRestore className="size-5 text-primary" />
              ) : (
                <AlertTriangle className="size-5 text-destructive" />
              )}
            </span>
            <DialogTitle className="font-heading text-lg font-semibold">
              {archived ? "Unarchive Student?" : "Archive Student?"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 px-5 py-5 text-sm leading-relaxed text-muted-foreground">
            {archived ? (
              <>
                <p>
                  Are you sure you want to unarchive{" "}
                  <span className="font-semibold text-foreground">
                    {studentName}
                  </span>
                  ? They will appear again on active rosters, session lists,
                  and current reports.
                </p>
                <p>
                  Their profile, class enrolments, and historical records are
                  unchanged.
                </p>
              </>
            ) : (
              <>
                <p>
                  Are you sure you want to archive{" "}
                  <span className="font-semibold text-foreground">
                    {studentName}
                  </span>
                  ? Archiving will hide the student from active rosters,
                  session lists, and current reports.
                </p>
                <p>
                  Their historical data, payment records, and past attendance
                  will be kept safely in the system archives and can be
                  restored at any time.
                </p>
              </>
            )}
            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <DialogDescription className="sr-only">
              {archived
                ? `Unarchive ${studentName}`
                : `Archive ${studentName}`}
            </DialogDescription>
          </div>

          <DialogFooter className="m-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={archived ? "default" : "destructive"}
              onClick={handleConfirm}
              disabled={pending}
            >
              {pending
                ? archived
                  ? "Unarchiving…"
                  : "Archiving…"
                : archived
                  ? "Unarchive Student"
                  : "Archive"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
