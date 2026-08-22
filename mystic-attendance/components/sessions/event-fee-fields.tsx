"use client";

import { useState } from "react";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
} from "@/lib/package-utils";
import type { PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type EventFeeValues = {
  amountSgd: number;
  isPaid: boolean;
  paymentMethod: PaymentMethod | null;
  notes: string | null;
};

type EventFeeFieldsProps = {
  studentName: string;
  onBack: () => void;
  onConfirm: (values: EventFeeValues) => void;
  pending?: boolean;
  confirmLabel?: string;
};

const fieldLabelClass =
  "mb-1.5 block text-xs font-medium tracking-wide text-foreground uppercase";

export function EventFeeFields({
  studentName,
  onBack,
  onConfirm,
  pending,
  confirmLabel = "Add student",
}: EventFeeFieldsProps) {
  const [amount, setAmount] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("paynow");
  const [notes, setNotes] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  function handleConfirm() {
    const parsed = Number(amount);
    if (amount.trim() === "" || Number.isNaN(parsed) || parsed < 0) {
      setLocalError("Enter a valid amount in SGD.");
      return;
    }
    setLocalError(null);
    onConfirm({
      amountSgd: parsed,
      isPaid,
      paymentMethod: isPaid ? paymentMethod : null,
      notes: notes.trim() ? notes.trim() : null,
    });
  }

  return (
    <div>
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          One-off for this session only. Class enrolments are unchanged.
        </p>
        <p className="text-sm text-foreground">
          Quoted fee for{" "}
          <span className="font-medium">{studentName}</span>.
        </p>
        {localError ? (
          <p className="text-sm text-destructive">{localError}</p>
        ) : null}
        <div>
          <Label htmlFor="event-package-amount" className={fieldLabelClass}>
            Amount
          </Label>
          <Input
            id="event-package-amount"
            type="number"
            min={0}
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
            autoFocus
            disabled={pending}
            className="rounded-xl"
          />
        </div>
        <Label
          htmlFor="event-package-paid"
          className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-background px-3 py-3"
        >
          <span className="text-sm font-medium">Paid</span>
          <Switch
            id="event-package-paid"
            checked={isPaid}
            onCheckedChange={setIsPaid}
            disabled={pending}
          />
        </Label>
        {isPaid ? (
          <div>
            <p className={fieldLabelClass}>Payment method</p>
            <div className="grid gap-2">
              {PAYMENT_METHODS.map((method) => {
                const selected = paymentMethod === method;
                return (
                  <label
                    key={method}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="event-package-payment-method"
                      value={method}
                      checked={selected}
                      onChange={() => setPaymentMethod(method)}
                      disabled={pending}
                      className="size-4 accent-primary"
                    />
                    {PAYMENT_METHOD_LABELS[method]}
                  </label>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Unpaid packages cannot be deducted at check-in until payment is
            logged.
          </p>
        )}
        <div>
          <Label htmlFor="event-package-notes" className={fieldLabelClass}>
            Notes
          </Label>
          <Textarea
            id="event-package-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional notes for this event package"
            disabled={pending}
            rows={3}
            className="min-h-20 resize-y rounded-xl"
          />
        </div>
      </div>
      <DialogFooter className="mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={pending}
          className="rounded-xl text-xs font-medium tracking-wide uppercase"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={pending}
          className="rounded-xl text-xs font-medium tracking-wide uppercase"
        >
          {pending ? "Adding…" : confirmLabel}
        </Button>
      </DialogFooter>
    </div>
  );
}
