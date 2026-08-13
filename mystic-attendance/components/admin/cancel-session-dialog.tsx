"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelSession } from "@/lib/actions/sessions";
import { CANCELLATION_REASON_LABELS } from "@/lib/attendance-utils";
import {
  CANCELLATION_REASONS,
  type CancellationReason,
} from "@/lib/session-utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CancelSessionDialogProps = {
  sessionId: string;
  className: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CancelSessionDialog({
  sessionId,
  className,
  open,
  onOpenChange,
}: CancelSessionDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<CancellationReason | "">("");
  const [note, setNote] = useState("");

  function handleOpenChange(next: boolean) {
    if (!next) {
      setError(null);
      setReason("");
      setNote("");
    }
    onOpenChange(next);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!reason) {
      setError("Select a cancellation reason.");
      return;
    }

    startTransition(async () => {
      const result = await cancelSession(sessionId, reason, note);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      handleOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>Cancel session</DialogTitle>
          <DialogDescription>
            Cancel {className}. Enrolled students keep their credits; attendance
            is marked as session cancelled.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="cancel-reason">Reason</Label>
            <Select
              value={reason}
              onValueChange={(value) =>
                setReason(value as CancellationReason)
              }
            >
              <SelectTrigger id="cancel-reason" className="w-full">
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_REASONS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {CANCELLATION_REASON_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancel-note">
              Note{reason === "other" ? " (required)" : " (optional)"}
            </Label>
            <Textarea
              id="cancel-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add context for admins..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
            >
              Keep session
            </Button>
            <Button type="submit" variant="destructive" disabled={pending}>
              {pending ? "Cancelling…" : "Cancel session"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
