import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { getInvoiceById } from "@/lib/queries/invoices";
import { formatInvoiceNumber } from "@/lib/invoice-utils";
import { payerLabel } from "@/lib/payer-utils";
import {
  formatAmountSgd,
  PAYMENT_METHOD_LABELS,
} from "@/lib/package-utils";
import { formatCalendarDate } from "@/lib/datetime";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) notFound();

  const product = invoice.packages.package_products;
  const label = product?.label ?? "Package";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link
        href="/admin/invoices"
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "-ml-2 w-fit"
        )}
      >
        <ArrowLeft className="size-4" />
        Back to Invoices
      </Link>
      <PageHeader
        title={formatInvoiceNumber(invoice.invoice_number)}
        description={`Paid ${formatCalendarDate(invoice.paid_at)}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Receipt</CardTitle>
          <CardDescription>
            Logged when the package was marked paid.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Payer</span>
            <span className="text-right">{payerLabel(invoice.payers)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Student</span>
            <Link
              href={`/admin/students/${invoice.student_id}`}
              className="text-right underline underline-offset-2"
            >
              {invoice.students.full_name}
            </Link>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Package</span>
            <Link
              href={`/admin/packages/${invoice.package_id}/pay`}
              className="text-right underline underline-offset-2"
            >
              {label}
            </Link>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Amount</span>
            <span>{formatAmountSgd(invoice.amount_sgd)} SGD</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Method</span>
            <span>{PAYMENT_METHOD_LABELS[invoice.payment_method]}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
