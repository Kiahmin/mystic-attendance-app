"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { markPackagePaid } from "@/lib/actions/packages";
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "@/lib/package-utils";
import type { Payer, PaymentMethod } from "@/lib/types";
import { PayerPicker } from "@/components/admin/payer-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type MarkPackagePaidFormProps = {
  packageId: string;
  studentId: string;
  defaultPayerId: string;
  defaultAmount: string;
  payers: Payer[];
  backfillNote?: string | null;
};

export function MarkPackagePaidForm({
  packageId,
  studentId,
  defaultPayerId,
  defaultAmount,
  payers: initialPayers,
  backfillNote,
}: MarkPackagePaidFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [payers, setPayers] = useState(initialPayers);
  const [payerId, setPayerId] = useState(defaultPayerId);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("paynow");
  const [amount, setAmount] = useState(defaultAmount);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const amountSgd = Number(amount);
    startTransition(async () => {
      const result = await markPackagePaid(packageId, {
        payment_method: paymentMethod,
        amount_sgd: amountSgd,
        payer_id: payerId || null,
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
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="pay_payer">Payer</Label>
        <PayerPicker
          id="pay_payer"
          payers={payers}
          value={payerId}
          onChange={setPayerId}
          onCreated={(payer) =>
            setPayers((current) =>
              current.some((item) => item.id === payer.id)
                ? current
                : [...current, payer]
            )
          }
          allowNone={false}
          noneLabel="Select a payer"
        />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Method</legend>
        <div className="grid gap-2">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/80 px-3 py-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="radio"
                name="payment_method"
                value={method}
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
                className="size-4 accent-primary"
                required
              />
              <span className="text-sm">{PAYMENT_METHOD_LABELS[method]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="amount_sgd" className="text-sm font-medium">
          Amount
        </label>
        <input
          id="amount_sgd"
          name="amount_sgd"
          type="number"
          min={0}
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {backfillNote ? (
        <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          {backfillNote}
        </p>
      ) : null}

      <Button type="submit" disabled={pending || !payerId} className="h-11 w-full">
        {pending ? "Saving…" : "Confirm Payment"}
      </Button>
    </form>
  );
}
