"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronDown, Info, UserRound } from "lucide-react";
import { assignPackage } from "@/lib/actions/packages";
import {
  PACKAGE_PRODUCT_TYPE_LABELS,
  PACKAGE_PRODUCT_TYPES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  defaultAmountForProduct,
  formatAmountSgd,
  isEventProductType,
  isTrialProductType,
  packageCreditBreakdown,
  packageLabel,
  unchargedClassesNote,
} from "@/lib/package-utils";
import type { PackageProduct, PackageProductType, Payer, PaymentMethod, Student } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PayerPicker } from "@/components/admin/payer-picker";
import { StudentSharePicker } from "@/components/admin/student-share-picker";
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

type AssignPackageFormProps = {
  students: Pick<Student, "id" | "full_name" | "contact_phone" | "payer_id">[];
  products: PackageProduct[];
  payers: Payer[];
  unchargedByStudent: Record<string, number>;
  initialStudentId?: string;
  cancelHref: string;
};

export function AssignPackageForm({
  students,
  products,
  payers: initialPayers,
  unchargedByStudent,
  initialStudentId,
  cancelHref,
}: AssignPackageFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const availableTypes = useMemo(() => {
    const present = new Set(products.map((p) => p.product_type));
    return PACKAGE_PRODUCT_TYPES.filter((type) => present.has(type));
  }, [products]);

  const initialType = availableTypes[0] ?? "group";
  const [studentId, setStudentId] = useState(initialStudentId ?? "");
  const [sharedStudentIds, setSharedStudentIds] = useState<string[]>([]);
  const [payers, setPayers] = useState(initialPayers);
  const initialPayerId =
    students.find((student) => student.id === (initialStudentId ?? ""))
      ?.payer_id ?? "";
  const [payerId, setPayerId] = useState(initialPayerId);
  const [productType, setProductType] =
    useState<PackageProductType>(initialType);

  const productsForType = useMemo(
    () =>
      products
        .filter((p) => p.product_type === productType)
        .sort((a, b) => a.total_credits - b.total_credits),
    [products, productType]
  );

  const [productId, setProductId] = useState(productsForType[0]?.id ?? "");
  const selectedProduct =
    productsForType.find((p) => p.id === productId) ??
    productsForType[0] ??
    null;

  const [isPaid, setIsPaid] = useState(true);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("paynow");
  const [amount, setAmount] = useState(
    selectedProduct ? String(defaultAmountForProduct(selectedProduct)) : ""
  );
  const [customBase, setCustomBase] = useState(
    selectedProduct ? String(selectedProduct.total_credits) : ""
  );
  const [bonusCredits, setBonusCredits] = useState("0");
  const [notes, setNotes] = useState("");
  const [customiseOpen, setCustomiseOpen] = useState(false);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === studentId) ?? null,
    [students, studentId]
  );

  const previewCredits = useMemo(() => {
    const catalogBase = selectedProduct?.total_credits ?? 0;
    const parsedCustom = Number(customBase);
    const base =
      Number.isInteger(parsedCustom) && parsedCustom >= 1
        ? parsedCustom
        : catalogBase;
    const parsedBonus = bonusCredits.trim() === "" ? 0 : Number(bonusCredits);
    const bonus =
      Number.isInteger(parsedBonus) && parsedBonus >= 0 ? parsedBonus : 0;
    return {
      total_credits: base + bonus,
      bonus_credits: bonus,
      base,
    };
  }, [selectedProduct, customBase, bonusCredits]);

  const previewBreakdown = selectedProduct
    ? packageCreditBreakdown(previewCredits, selectedProduct)
    : null;

  const backfillNote =
    isPaid && studentId
      ? unchargedClassesNote(
          [studentId, ...sharedStudentIds].reduce(
            (sum, id) => sum + (unchargedByStudent[id] ?? 0),
            0
          ),
          previewCredits.total_credits
        )
      : null;

  function handleProductTypeChange(next: PackageProductType) {
    setProductType(next);
    if (isEventProductType(next)) {
      setSharedStudentIds([]);
    }
    const nextProducts = products
      .filter((p) => p.product_type === next)
      .sort((a, b) => a.total_credits - b.total_credits);
    const nextProduct = nextProducts[0] ?? null;
    setProductId(nextProduct?.id ?? "");
    setAmount(
      nextProduct ? String(defaultAmountForProduct(nextProduct)) : ""
    );
    setCustomBase(nextProduct ? String(nextProduct.total_credits) : "");
  }

  function handleProductChange(nextProduct: PackageProduct) {
    setProductId(nextProduct.id);
    setAmount(String(defaultAmountForProduct(nextProduct)));
    setCustomBase(String(nextProduct.total_credits));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!studentId) {
      setError("Select a student.");
      return;
    }
    if (!selectedProduct) {
      setError("Choose a package product.");
      return;
    }

    const amountSgd = amount.trim() === "" ? null : Number(amount);
    if (isPaid && (amountSgd == null || Number.isNaN(amountSgd))) {
      setError("Enter a valid amount in SGD.");
      return;
    }
    if (isPaid && !payerId) {
      setError("Select a payer before recording payment.");
      return;
    }

    const parsedBonus =
      bonusCredits.trim() === "" ? 0 : Number(bonusCredits);
    if (!Number.isInteger(parsedBonus) || parsedBonus < 0) {
      setError("Complimentary credits must be a whole number of 0 or more.");
      return;
    }

    let customTotalCredits: number | null = null;
    if (customBase.trim() !== "") {
      const parsedCustom = Number(customBase);
      if (!Number.isInteger(parsedCustom) || parsedCustom < 1) {
        setError("Lesson count must be a whole number of at least 1.");
        return;
      }
      customTotalCredits =
        parsedCustom === selectedProduct.total_credits ? null : parsedCustom;
    }

    if ((customTotalCredits ?? selectedProduct.total_credits) + parsedBonus < 1) {
      setError("Package must have at least 1 credit.");
      return;
    }

    startTransition(async () => {
      const result = await assignPackage({
        student_id: studentId,
        shared_student_ids: isEventProductType(productType)
          ? []
          : sharedStudentIds,
        payer_id: payerId || null,
        package_product_id: selectedProduct.id,
        is_paid: isPaid,
        payment_method: isPaid ? paymentMethod : null,
        amount_sgd: amountSgd,
        custom_total_credits: customTotalCredits,
        bonus_credits: parsedBonus,
        customisation_notes: notes,
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
              Choose who this package belongs to. Optional siblings share the
              same credit pool — each class they attend uses 1 credit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedStudent && initialStudentId === selectedStudent.id ? (
              <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
                <p className="font-medium">{selectedStudent.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedStudent.contact_phone ?? "No contact on file"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select
                  value={studentId || undefined}
                  onValueChange={(value) => {
                    setStudentId(value);
                    const next = students.find((student) => student.id === value);
                    setPayerId(next?.payer_id ?? "");
                    setSharedStudentIds((ids) =>
                      ids.filter((id) => id !== value)
                    );
                  }}
                >
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
            {!isEventProductType(productType) ? (
              <div className="mt-4 space-y-2">
                <Label htmlFor="share_with">Share credits with</Label>
                <StudentSharePicker
                  id="share_with"
                  students={students}
                  excludeIds={studentId ? [studentId] : []}
                  value={sharedStudentIds}
                  onChange={setSharedStudentIds}
                />
                <p className="text-xs text-muted-foreground">
                  Both siblings can use this pack. If they attend the same
                  class, two credits are deducted.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Package Selection</CardTitle>
            <CardDescription>
              Choose a product tier, then adjust lesson count or add
              complimentary credits as required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Product type</Label>
              <Select
                value={productType}
                onValueChange={(value) =>
                  handleProductTypeChange(value as PackageProductType)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {PACKAGE_PRODUCT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div
              className={cn(
                "grid gap-3",
                productsForType.length === 1
                  ? "sm:grid-cols-1"
                  : "sm:grid-cols-3"
              )}
            >
              {productsForType.map((option) => {
                const selected = selectedProduct?.id === option.id;
                const displayCredits = selected
                  ? previewCredits.total_credits
                  : option.total_credits;
                const isAdjusted =
                  selected &&
                  (previewCredits.bonus_credits > 0 ||
                    previewCredits.base !== option.total_credits);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleProductChange(option)}
                    className={cn(
                      "relative flex flex-col rounded-xl border p-5 text-left transition-colors",
                      selected
                        ? "border-primary bg-primary/5"
                        : "border-border/80 hover:border-primary/40"
                    )}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <span className="font-semibold">
                        {isTrialProductType(option.product_type)
                          ? option.label
                          : `${displayCredits} Lessons`}
                      </span>
                      <CheckCircle2
                        className={cn(
                          "size-5 text-primary transition-opacity",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </div>
                    {isAdjusted ? (
                      <span className="text-xs text-muted-foreground">
                        {previewBreakdown ?? "Customised"}
                      </span>
                    ) : null}
                    <span className="mt-auto pt-4 text-2xl font-semibold text-primary">
                      {formatAmountSgd(defaultAmountForProduct(option))}{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        SGD
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {productsForType.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No active products for this type.
              </p>
            ) : null}

            {selectedProduct ? (
              <div className="rounded-xl border border-border/70 bg-muted/20">
                <button
                  type="button"
                  onClick={() => setCustomiseOpen((open) => !open)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                  aria-expanded={customiseOpen}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Customise this pack</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform",
                      customiseOpen && "rotate-180"
                    )}
                  />
                </button>
                {customiseOpen ? (
                  <div className="space-y-4 border-t border-border/60 px-4 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="custom-base">Lesson count</Label>
                        <Input
                          id="custom-base"
                          type="number"
                          min={1}
                          step={1}
                          value={customBase}
                          onChange={(e) => setCustomBase(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bonus-credits">
                          Complimentary credits
                        </Label>
                        <Input
                          id="bonus-credits"
                          type="number"
                          min={0}
                          step={1}
                          value={bonusCredits}
                          onChange={(e) => setBonusCredits(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customisation-notes">Notes</Label>
                      <Textarea
                        id="customisation-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Comments"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {packageLabel(previewCredits, selectedProduct)}
                      {previewBreakdown ? ` · ${previewBreakdown}` : ""}
                      {" · "}
                      {previewCredits.total_credits} credit
                      {previewCredits.total_credits === 1 ? "" : "s"} total
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

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
              <Label htmlFor="package_payer">Payer</Label>
              <PayerPicker
                id="package_payer"
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
                allowNone={!isPaid}
                noneLabel="Use student default / none"
              />
            </div>
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
                  <Label htmlFor="amount">Amount</Label>
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

            {isPaid && backfillNote ? (
              <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                {backfillNote}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="bg-muted/40">
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <span className="text-lg">Total Amount</span>
              <span className="text-2xl font-semibold">
                {formatAmountSgd(
                  amount.trim() === ""
                    ? selectedProduct
                      ? defaultAmountForProduct(selectedProduct)
                      : null
                    : Number(amount)
                )}
              </span>
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="h-12 w-full"
                disabled={pending || !selectedProduct || (isPaid && !payerId)}
              >
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
