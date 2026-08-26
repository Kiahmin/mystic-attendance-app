import { requireRole } from "@/lib/auth/profile";
import { listInvoices } from "@/lib/queries/invoices";
import { InvoiceList } from "@/components/admin/invoice-list";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminInvoicesPage() {
  await requireRole(["admin"]);
  const invoices = await listInvoices();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoices"
        description="Receipts created when a package is marked paid."
      />
      <InvoiceList invoices={invoices} />
    </div>
  );
}
