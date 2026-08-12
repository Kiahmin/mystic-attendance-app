"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Info, UserRound } from "lucide-react";
import { assignPackage } from "@/lib/actions/packages";
import {
  PACKAGE_SIZE_PRICES,
  PACKAGE_SIZES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  formatAmountSgd,
  type PackageSize,
} from "@/lib/package-utils";
import type { PaymentMethod, Student } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type AssignPackageFormProps = {
  students: Pick<Student, "id" | "full_name" | "contact_phone">[];
  initialStudentId?: string;
  cancelHref: string;
};

export function AssignPackageForm({
  students,
  initialStudentId,
  cancelHref,
}: AssignPackageFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [studentId, setStudentId] = useState(initialStudentId ?? "");
  const [size, setSize] = useState<PackageSize>(8);
  const [isPaid, setIsPaid] = useState(true);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("paynow");
  const [amount, setAmount] = useState(String(PACKAGE_SIZE_PRICES[8]));

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === studentId) ?? null,
    [students, studentId]
  );

  function handleSizeChange(next: PackageSize) {
    setSize(next);
    setAmount(String(PACKAGE_SIZE_PRICES[next]));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!studentId) {
      setError("Select a student.");
      return;
    }

    const amountSgd = amount.trim() === "" ? null : Number(amount);
    if (isPaid && (amountSgd == null || Number.isNaN(amountSgd))) {
      setError("Enter a valid amount in SGD.");
      return;
    }

    startTransition(async () => {
      const result = await assignPackage({
        student_id: studentId,
        total_credits: size,
        is_paid: isPaid,
        payment_method: isPaid ? paymentMethod : null,
        amount_sgd: amountSgd,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      router.push(`/admin/students/${studentId}`);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 xl:grid-cols-3"
    >
      <div className="space-y-6 xl:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserRound className="size-5 text-primary" />
              Student Information
            </CardTitle>
            <CardDescription>
              Choose who this package belongs to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStudent && initialStudentId === selectedStudent.id ? (
              <div className="flex items-center gap-4 rounded-lg border border-border/70 bg-muted/40 p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <UserRound className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                    Selected Student
                  </p>
                  <p className="truncate text-lg font-semibold">
                    {selectedStudent.full_name}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {selectedStudent.contact_phone ?? "No contact on file"}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => setStudentId("")}
                >
                  Change Student
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger id="student" className="w-full">
                    <SelectValue placeholder="Select a student…" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Package Selection</CardTitle>
            <CardDescription>
              Standard lesson packs. Validity starts on the first attended
              lesson.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {PACKAGE_SIZES.map((option) => {
                const selected = size === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSizeChange(option)}
                    className={cn(
                      "relative flex flex-col rounded-xl border p-5 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border/80 hover:border-primary/40"
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="font-semibold">{option} Lessons</span>
                      <CheckCircle2
                        className={cn(
                          "size-5 text-primary transition-opacity",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    <span className="mt-auto pt-4 text-2xl font-semibold text-primary">
                      {formatAmountSgd(PACKAGE_SIZE_PRICES[option])}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        SGD
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              <p>
                <span className="font-medium text-foreground">
                  Validity Rule:
                </span>{" "}
                All packages are valid for exactly 3 months starting from the
                date of the first attended lesson.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Details</CardTitle>
            <CardDescription>
              Unpaid packages cannot be used at check-in.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <div className="flex rounded-lg border border-border/80 bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => setIsPaid(true)}
                  className={cn(
                    "flex-1 rounded-md py-2 text-xs font-semibold tracking-wide uppercase transition-colors",
                    isPaid
                      ? "bg-card text-primary shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setIsPaid(false)}
                  className={cn(
                    "flex-1 rounded-md py-2 text-xs font-semibold tracking-wide uppercase transition-colors",
                    !isPaid
                      ? "bg-destructive/15 text-destructive shadow-sm"
                      : "text-muted-foreground"
                  )}
                >
                  Unpaid
                </button>
              </div>
              {!isPaid ? (
                <p className="flex items-center gap-1 text-sm text-destructive">
                  Unpaid packages cannot be activated or used to book classes.
                </p>
              ) : null}
            </div>

            {isPaid ? (
              <>
                <div className="space-y-2">
                  <Label>Method</Label>
                  <div className="grid gap-2">
                    {PAYMENT_METHODS.map((method) => {
                      const selected = paymentMethod === method;
                      return (
                        <label
                          key={method}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 transition-colors",
                            selected
                              ? "border-primary bg-primary/5"
                              : "border-border/80 hover:bg-muted/40"
                          )}
                        >
                          <input
                            type="radio"
                            name="payment_method"
                            value={method}
                            checked={selected}
                            onChange={() => setPaymentMethod(method)}
                            className="size-4 accent-primary"
                          />
                          <span className="text-sm">
                            {PAYMENT_METHOD_LABELS[method]}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (SGD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min={0}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required={isPaid}
                  />
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <span className="text-lg">Total Amount</span>
              <span className="text-2xl font-semibold">
                {formatAmountSgd(
                  amount.trim() === "" ? PACKAGE_SIZE_PRICES[size] : Number(amount)
                )}
              </span>
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-col gap-3">
              <Button type="submit" className="h-12 w-full" disabled={pending}>
                {pending ? "Assigning…" : "Confirm Assignment"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full"
                asChild
              >
                <Link href={cancelHref}>Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
