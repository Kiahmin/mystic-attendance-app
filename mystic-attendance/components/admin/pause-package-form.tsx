"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  addCalendarDays,
  calendarDaysBetween,
  formatCalendarDate,
  todayInSingapore,
} from "@/lib/datetime";
import { pausePackage } from "@/lib/actions/packages";
import {
  PAUSE_REASONS,
  formatPackageExpiry,
  packageLabel,
  type PauseReasonValue,
} from "@/lib/package-utils";
import type { PackageWithStudent } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PackageStatusBadge } from "@/components/admin/package-status-badge";
import { Info, PauseCircle, UserRound } from "lucide-react";

type PausePackageFormProps = {
  pkg: PackageWithStudent;
};

export function PausePackageForm({ pkg }: PausePackageFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [pausedAt, setPausedAt] = useState(todayInSingapore());
  const [pauseEndsAt, setPauseEndsAt] = useState("");
  const [reason, setReason] = useState<PauseReasonValue | "">("");
  const [note, setNote] = useState("");

  const projectedExpiry = useMemo(() => {
    if (!pkg.expires_at || !pausedAt || !pauseEndsAt) return null;
    if (pauseEndsAt < pausedAt) return null;
    const days = calendarDaysBetween(pausedAt, pauseEndsAt);
    if (days <= 0) return pkg.expires_at;
    return addCalendarDays(pkg.expires_at, days);
  }, [pkg.expires_at, pausedAt, pauseEndsAt]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!reason) {
      setError("Select a reason for the pause.");
      return;
    }

    startTransition(async () => {
      const result = await pausePackage(pkg.id, {
        paused_at: pausedAt,
        pause_ends_at: pauseEndsAt,
        reason,
        note,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push(`/admin/students/${pkg.student_id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <UserRound className="size-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">{pkg.students.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {pkg.students.contact_phone ?? "No contact on file"}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="mb-1 flex flex-wrap items-center gap-2 sm:justify-end">
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold">
                {packageLabel(pkg.total_credits, pkg.package_products)}
              </span>
              <PackageStatusBadge status={pkg.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {pkg.remaining_credits} session
              {pkg.remaining_credits === 1 ? "" : "s"} remaining
              {pkg.expires_at
                ? ` · expires ${formatPackageExpiry(pkg.expires_at)}`
                : ""}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Pause Details</CardTitle>
            <CardDescription>
              One pause per package. Validity is frozen for the actual pause
              length when resumed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paused_at">Start Date</Label>
                <Input
                  id="paused_at"
                  type="date"
                  value={pausedAt}
                  onChange={(e) => setPausedAt(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pause_ends_at">End Date</Label>
                <Input
                  id="pause_ends_at"
                  type="date"
                  value={pauseEndsAt}
                  min={pausedAt || undefined}
                  onChange={(e) => setPauseEndsAt(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Planned end date is required (T&amp;C: one approved pause).
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Pause</Label>
              <Select
                value={reason}
                onValueChange={(value) =>
                  setReason(value as PauseReasonValue)
                }
              >
                <SelectTrigger id="reason" className="w-full">
                  <SelectValue placeholder="Select a reason…" />
                </SelectTrigger>
                <SelectContent>
                  {PAUSE_REASONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Internal Note (Optional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add context for other admins…"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="size-4 text-primary" />
                Impact Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b border-border/50 pb-4">
                <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  New Expiry Date
                </p>
                {projectedExpiry ? (
                  <>
                    <p className="font-medium">
                      {formatCalendarDate(projectedExpiry)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Extends by the pause length when resumed.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">Pending Dates…</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pkg.expires_at
                        ? "Calculated once start and end dates are set."
                        : "Expiry is set on first lesson; pause still freezes after activation."}
                    </p>
                  </>
                )}
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Validity
                </p>
                <p className="text-sm text-muted-foreground">
                  While paused, the package cannot expire on the calendar.
                  Credits are not deducted during the pause.
                </p>
              </div>
            </CardContent>
          </Card>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="flex flex-col gap-2">
            <Button type="submit" className="h-11 w-full" disabled={pending}>
              <PauseCircle className="size-4" />
              {pending ? "Saving…" : "Confirm Pause"}
            </Button>
            <Button type="button" variant="outline" className="h-11 w-full" asChild>
              <Link href="/admin/packages">Cancel & Go Back</Link>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
