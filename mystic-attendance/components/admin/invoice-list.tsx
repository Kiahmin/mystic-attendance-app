"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { formatInvoiceNumber } from "@/lib/invoice-utils";
import { payerLabel } from "@/lib/payer-utils";
import { formatAmountSgd, PAYMENT_METHOD_LABELS } from "@/lib/package-utils";
import { formatCalendarDate } from "@/lib/datetime";
import type { InvoiceWithRelations } from "@/lib/types";
import { Input } from "@/components/ui/input";

type InvoiceListProps = {
  invoices: InvoiceWithRelations[];
};

export function InvoiceList({ invoices }: InvoiceListProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return invoices;
    return invoices.filter((invoice) => {
      const number = formatInvoiceNumber(invoice.invoice_number).toLowerCase();
      const haystacks = [
        number,
        invoice.students.full_name,
        invoice.payers.display_name,
        invoice.payers.phone,
      ];
      return haystacks.some((value) => value?.toLowerCase().includes(q));
    });
  }, [invoices, search]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by number, payer, or student…"
          className="h-11 rounded-lg border-border/80 bg-card pl-9"
          aria-label="Search invoices"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-8 text-center">
          <p className="font-medium">
            {search.trim() ? "No matching invoices" : "No invoices yet"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Invoices are created when a package is marked paid.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
          <div className="hidden grid-cols-[7rem_1.2fr_1.2fr_7rem_8rem_7rem] gap-4 border-b border-border/60 bg-muted/50 px-5 py-3.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase lg:grid">
            <span>Number</span>
            <span>Payer</span>
            <span>Student</span>
            <span>Amount</span>
            <span>Method</span>
            <span>Paid</span>
          </div>
          <ul className="divide-y divide-border/60">
            {filtered.map((invoice) => (
              <li key={invoice.id}>
                <Link
                  href={`/admin/invoices/${invoice.id}`}
                  className="grid gap-2 px-5 py-4 transition-colors hover:bg-muted/40 lg:grid-cols-[7rem_1.2fr_1.2fr_7rem_8rem_7rem] lg:items-center lg:gap-4"
                >
                  <p className="font-medium">
                    {formatInvoiceNumber(invoice.invoice_number)}
                  </p>
                  <p className="truncate text-sm">{payerLabel(invoice.payers)}</p>
                  <p className="truncate text-sm">{invoice.students.full_name}</p>
                  <p className="text-sm">
                    {formatAmountSgd(invoice.amount_sgd)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {PAYMENT_METHOD_LABELS[invoice.payment_method]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCalendarDate(invoice.paid_at)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
