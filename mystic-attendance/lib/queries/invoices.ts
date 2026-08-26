import { createClient } from "@/lib/supabase/server";
import type {
  Invoice,
  InvoiceWithRelations,
  Package,
  PackageProduct,
  PayerRef,
  Student,
} from "@/lib/types";

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

const INVOICE_SELECT = `
  id,
  invoice_number,
  package_id,
  payer_id,
  student_id,
  amount_sgd,
  payment_method,
  paid_at,
  created_at,
  payers (
    id,
    kind,
    display_name,
    phone
  ),
  students (
    id,
    full_name
  ),
  packages (
    id,
    student_id,
    is_paid,
    status,
    total_credits,
    bonus_credits,
    package_products (
      product_type,
      label,
      total_credits
    )
  )
`;

function mapInvoice(row: {
  amount_sgd?: number | string;
  invoice_number?: number | string;
  payers?: PayerRef | PayerRef[] | null;
  students?:
    | Pick<Student, "id" | "full_name">
    | Pick<Student, "id" | "full_name">[]
    | null;
  packages?:
    | (Pick<Package, "id" | "student_id" | "is_paid" | "status"> & {
        total_credits?: number;
        bonus_credits?: number;
        package_products?:
          | Pick<PackageProduct, "product_type" | "label" | "total_credits">
          | Pick<PackageProduct, "product_type" | "label" | "total_credits">[]
          | null;
      })
    | (Pick<Package, "id" | "student_id" | "is_paid" | "status"> & {
        package_products?:
          | Pick<PackageProduct, "product_type" | "label" | "total_credits">
          | Pick<PackageProduct, "product_type" | "label" | "total_credits">[]
          | null;
      })[]
    | null;
  [key: string]: unknown;
}): InvoiceWithRelations | null {
  const payer = asSingle(row.payers);
  const student = asSingle(row.students);
  const pkg = asSingle(row.packages);
  if (!payer || !student || !pkg) return null;

  return {
    id: row.id as string,
    invoice_number: Number(row.invoice_number),
    package_id: row.package_id as string,
    payer_id: row.payer_id as string,
    student_id: row.student_id as string,
    amount_sgd: Number(row.amount_sgd),
    payment_method: row.payment_method as Invoice["payment_method"],
    paid_at: row.paid_at as string,
    created_at: row.created_at as string,
    payers: payer,
    students: student,
    packages: {
      id: pkg.id,
      student_id: pkg.student_id,
      is_paid: pkg.is_paid,
      status: pkg.status,
      package_products: asSingle(pkg.package_products),
    },
  };
}

export async function listInvoices(): Promise<InvoiceWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_SELECT)
    .order("paid_at", { ascending: false })
    .order("invoice_number", { ascending: false });

  if (error) throw error;
  return (data ?? [])
    .map((row) => mapInvoice(row as Parameters<typeof mapInvoice>[0]))
    .filter((item): item is InvoiceWithRelations => item !== null);
}

export async function getInvoiceById(
  id: string
): Promise<InvoiceWithRelations | null> {
  if (!id) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select(INVOICE_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapInvoice(data as Parameters<typeof mapInvoice>[0]);
}
