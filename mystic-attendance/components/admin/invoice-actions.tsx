"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Receipt } from "lucide-react";
import { createInvoiceForPaidPackage } from "@/lib/actions/packages";
import { formatInvoiceNumber } from "@/lib/invoice-utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type CreateInvoiceButtonProps = {
  packageId: string;
};

export function CreateInvoiceButton({ packageId }: CreateInvoiceButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      <button
        type="button"
        disabled={pending}
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const result = await createInvoiceForPaidPackage(packageId);
            if (result.error) {
              setError(result.error);
              return;
            }
            if (result.invoiceId) {
              router.push(`/admin/invoices/${result.invoiceId}`);
              router.refresh();
            }
          });
        }}
      >
        <Receipt className="size-3.5" />
        {pending ? "Creating…" : "Create invoice"}
      </button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export function InvoiceLink({
  invoiceId,
  invoiceNumber,
}: {
  invoiceId: string;
  invoiceNumber: number;
}) {
  return (
    <Link
      href={`/admin/invoices/${invoiceId}`}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
    >
      <Receipt className="size-3.5" />
      {formatInvoiceNumber(invoiceNumber)}
    </Link>
  );
}
