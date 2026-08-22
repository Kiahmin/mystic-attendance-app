"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createStudent,
  updateStudent,
  type StudentInput,
} from "@/lib/actions/students";
import {
  ageFromDob,
  isMinorDob,
  SKILL_LEVEL_LABELS,
  SKILL_LEVELS,
} from "@/lib/admin-utils";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  defaultAmountForProduct,
  formatAmountSgd,
} from "@/lib/package-utils";
import type {
  PackageProduct,
  PaymentMethod,
  SkillLevel,
  Student,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type StudentFormProps = {
  student?: Student;
  trialProducts: PackageProduct[];
  hasTrialPackage?: boolean;
  onSuccess?: (id: string) => void;
  submitLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
};

export function StudentForm({
  student,
  trialProducts,
  hasTrialPackage = false,
  onSuccess,
  submitLabel,
  showCancel,
  onCancel,
}: StudentFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState(student?.full_name ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    student?.date_of_birth ?? ""
  );
  const [contactPhone, setContactPhone] = useState(
    student?.contact_phone ?? ""
  );
  const [guardianName, setGuardianName] = useState(
    student?.guardian_name ?? ""
  );
  const [guardianPhone, setGuardianPhone] = useState(
    student?.guardian_phone ?? ""
  );
  const [skillLevel, setSkillLevel] = useState<SkillLevel | "">(
    student?.skill_level ?? ""
  );
  const [notes, setNotes] = useState(student?.notes ?? "");
  const [isTrial, setIsTrial] = useState(student?.is_trial ?? false);

  const defaultTrial =
    trialProducts.find((product) => product.product_type === "trial_group") ??
    trialProducts[0] ??
    null;
  const [trialProductId, setTrialProductId] = useState(defaultTrial?.id ?? "");
  const selectedTrialProduct =
    trialProducts.find((product) => product.id === trialProductId) ??
    defaultTrial;
  const [trialPaid, setTrialPaid] = useState(true);
  const [trialPaymentMethod, setTrialPaymentMethod] =
    useState<PaymentMethod>("paynow");
  const [trialAmount, setTrialAmount] = useState(
    defaultTrial ? String(defaultAmountForProduct(defaultTrial)) : ""
  );

  const isMinor = useMemo(
    () => isMinorDob(dateOfBirth || null),
    [dateOfBirth]
  );
  const age = useMemo(() => ageFromDob(dateOfBirth || null), [dateOfBirth]);
  const needsTrialPackage = isTrial && !hasTrialPackage;

  function handleTrialProductChange(product: PackageProduct) {
    setTrialProductId(product.id);
    setTrialAmount(String(defaultAmountForProduct(product)));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (needsTrialPackage && !selectedTrialProduct) {
      setError("Choose a trial package.");
      return;
    }

    const amountSgd =
      trialAmount.trim() === "" ? null : Number(trialAmount);
    if (
      needsTrialPackage &&
      trialPaid &&
      (amountSgd == null || Number.isNaN(amountSgd))
    ) {
      setError("Enter a valid amount in SGD.");
      return;
    }

    const input: StudentInput = {
      full_name: fullName,
      date_of_birth: dateOfBirth || null,
      contact_phone: contactPhone || null,
      guardian_name: guardianName || null,
      guardian_phone: guardianPhone || null,
      skill_level: skillLevel || null,
      notes: notes || null,
      is_trial: isTrial,
      trial:
        needsTrialPackage && selectedTrialProduct
          ? {
              package_product_id: selectedTrialProduct.id,
              is_paid: trialPaid,
              payment_method: trialPaid ? trialPaymentMethod : null,
              amount_sgd: amountSgd,
            }
          : null,
    };

    startTransition(async () => {
      if (student) {
        const result = await updateStudent(student.id, input);
        if (result.error) {
          setError(result.error);
          return;
        }
        router.refresh();
        onSuccess?.(student.id);
        return;
      }

      const result = await createStudent(input);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.id) {
        onSuccess?.(result.id);
        router.push(`/admin/students/${result.id}`);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
          Personal Information
        </h3>
        <div className="space-y-2">
          <Label htmlFor="full_name">
            Full name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Jane Doe"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">
              Date of birth <span className="text-destructive">*</span>
            </Label>
            <Input
              id="date_of_birth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required={!student}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              value={age != null ? String(age) : ""}
              readOnly
              placeholder="Auto-calculated"
              className="bg-muted"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact number</Label>
          <Input
            id="contact_phone"
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            autoComplete="tel"
            placeholder="+65 …"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={isTrial}
            onChange={(event) => setIsTrial(event.target.checked)}
            className="size-4 accent-primary"
          />
          <span className="text-sm font-medium">Trial student</span>
        </label>
        {!isTrial
          ? student?.is_trial
            ? (
                <p className="text-sm text-muted-foreground">
                  Clears the trial flag. Existing packages stay as they are.
                </p>
              )
            : null
          : hasTrialPackage
            ? (
                <p className="text-sm text-muted-foreground">
                  Student already has a trial pack.
                </p>
              )
            : (
                <p className="text-sm text-muted-foreground">
                  Requires a Trial (Group) or Trial (Private) pack.
                </p>
              )}

        {needsTrialPackage ? (
          <div className="space-y-4 rounded-xl border border-border/70 p-4">
            {trialProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active trial products are available.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Trial type</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {trialProducts.map((product) => {
                      const selected = selectedTrialProduct?.id === product.id;
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleTrialProductChange(product)}
                          className={cn(
                            "rounded-lg border px-3 py-3 text-left transition-colors",
                            selected
                              ? "border-primary bg-primary/5"
                              : "border-border/80 hover:border-primary/40"
                          )}
                        >
                          <span className="block font-medium">
                            {product.label}
                          </span>
                          <span className="mt-1 block text-sm text-muted-foreground">
                            {formatAmountSgd(defaultAmountForProduct(product))}{" "}
                            SGD
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment status</Label>
                  <div className="flex rounded-lg border border-border/80 bg-muted/40 p-1">
                    <button
                      type="button"
                      onClick={() => setTrialPaid(true)}
                      className={cn(
                        "flex-1 rounded-md py-2 text-xs font-semibold tracking-wide uppercase transition-colors",
                        trialPaid
                          ? "bg-card text-primary shadow-sm"
                          : "text-muted-foreground"
                      )}
                    >
                      Paid
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrialPaid(false)}
                      className={cn(
                        "flex-1 rounded-md py-2 text-xs font-semibold tracking-wide uppercase transition-colors",
                        !trialPaid
                          ? "bg-destructive/15 text-destructive shadow-sm"
                          : "text-muted-foreground"
                      )}
                    >
                      Unpaid
                    </button>
                  </div>
                </div>

                {trialPaid ? (
                  <>
                    <div className="space-y-2">
                      <Label>Method</Label>
                      <div className="grid gap-2">
                        {PAYMENT_METHODS.map((method) => {
                          const selected = trialPaymentMethod === method;
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
                                name="trial_payment_method"
                                value={method}
                                checked={selected}
                                onChange={() => setTrialPaymentMethod(method)}
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
                      <Label htmlFor="trial_amount">Amount</Label>
                      <Input
                        id="trial_amount"
                        type="number"
                        min={0}
                        step="0.01"
                        value={trialAmount}
                        onChange={(e) => setTrialAmount(e.target.value)}
                        required={trialPaid}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-destructive">
                    Unpaid packages cannot be used at check-in.
                  </p>
                )}
              </>
            )}
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
          Skating Profile
        </h3>
        <div className="space-y-2">
          <Label>Skill level</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {SKILL_LEVELS.map((level) => {
              const selected = skillLevel === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSkillLevel(level)}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border/80 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  {SKILL_LEVEL_LABELS[level]}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className={cn(
          "space-y-4 rounded-xl p-4",
          isMinor ? "bg-muted" : "border border-border/70"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xs font-semibold tracking-[0.08em] text-primary uppercase">
            Guardian &amp; Medical Details
          </h3>
          {isMinor ? <Badge variant="guardian">Guardian required</Badge> : null}
        </div>

        {isMinor ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="guardian_name">
                Parent / guardian name{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="guardian_name"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian_phone">Guardian phone</Label>
              <Input
                id="guardian_phone"
                type="tel"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Guardian fields appear when the student is under 18.
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Medical notes / allergies</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="List conditions, allergies, or medications…"
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {showCancel ? (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={pending} className="sm:min-w-36">
          {pending
            ? "Saving…"
            : (submitLabel ?? (student ? "Save Changes" : "Save Student"))}
        </Button>
      </div>
    </form>
  );
}
