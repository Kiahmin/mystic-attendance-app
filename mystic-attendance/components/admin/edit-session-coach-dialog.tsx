"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateSessionCoach } from "@/lib/actions/sessions";
import type { Profile } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

type EditSessionCoachDialogProps = {
  sessionId: string;
  className: string;
  coachId: string | null;
  coaches: Pick<Profile, "id" | "full_name">[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditSessionCoachDialog({
  sessionId,
  className,
  coachId,
  coaches,
  open,
  onOpenChange,
}: EditSessionCoachDialogProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedCoachId, setSelectedCoachId] = useState(coachId ?? "");

  function handleOpenChange(next: boolean) {
    if (next) {
      setSelectedCoachId(coachId ?? "");
    } else {
      setError(null);
      setSelectedCoachId(coachId ?? "");
    }
    onOpenChange(next);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateSessionCoach(
        sessionId,
        selectedCoachId || null
      );
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
          <DialogTitle>Change coach</DialogTitle>
          <DialogDescription>
            Assign who is taking {className} for this session only. The class
            default coach is unchanged.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="session-coach">Coach</Label>
            <Select
              value={selectedCoachId || "__none__"}
              onValueChange={(value) =>
                setSelectedCoachId(value === "__none__" ? "" : value)
              }
            >
              <SelectTrigger id="session-coach" className="w-full">
                <SelectValue placeholder="Assign a coach" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No coach</SelectItem>
                {coaches.map((coach) => (
                  <SelectItem key={coach.id} value={coach.id}>
                    {coach.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save coach"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
