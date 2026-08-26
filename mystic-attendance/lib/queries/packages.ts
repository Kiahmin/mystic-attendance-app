import { createClient } from "@/lib/supabase/server";
import {
  isFinishingPackage,
  isTrialProductType,
  packageIsTrialProduct,
} from "@/lib/package-utils";
import type {
  Invoice,
  Package,
  PackageProduct,
  PackageSession,
  PackageStatus,
  PackageWithStudent,
  PayerRef,
  Student,
} from "@/lib/types";

const PACKAGE_PRODUCT_COLUMNS = `
  id,
  product_type,
  label,
  total_credits,
  amount_sgd,
  is_active,
  sort_order
`;

const PACKAGE_COLUMNS = `
  id,
  student_id,
  payer_id,
  package_product_id,
  session_id,
  total_credits,
  used_credits,
  remaining_credits,
  bonus_credits,
  customisation_notes,
  forfeited_credits,
  forfeited_at,
  payment_method,
  amount_sgd,
  is_paid,
  first_lesson_date,
  expires_at,
  paused_at,
  pause_ends_at,
  paused_reason,
  resumed_at,
  pause_used,
  informed_at,
  status,
  created_at,
  package_products (
    ${PACKAGE_PRODUCT_COLUMNS}
  ),
  sessions (
    id,
    name,
    session_date
  ),
  payers (
    id,
    kind,
    display_name,
    phone
  ),
  invoices (
    id,
    invoice_number
  )
`;

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapPackageProduct(
  row: PackageProduct | null | undefined
): PackageProduct | null {
  if (!row) return null;
  return {
    ...row,
    amount_sgd: Number(row.amount_sgd),
  };
}

function mapPackage(row: {
  package_product_id?: string | null;
  session_id?: string | null;
  payer_id?: string | null;
  amount_sgd?: number | string | null;
  bonus_credits?: number | string | null;
  customisation_notes?: string | null;
  package_products?: PackageProduct | PackageProduct[] | null;
  sessions?: PackageSession | PackageSession[] | null;
  payers?: PayerRef | PayerRef[] | null;
  invoices?:
    | Pick<Invoice, "id" | "invoice_number">
    | Pick<Invoice, "id" | "invoice_number">[]
    | null;
  [key: string]: unknown;
}): Package {
  const product = mapPackageProduct(asSingle(row.package_products));
  const payer = asSingle(row.payers);
  const invoice = asSingle(row.invoices);
  return {
    ...(row as unknown as Package),
    package_product_id: row.package_product_id ?? null,
    session_id: row.session_id ?? null,
    payer_id: row.payer_id ?? payer?.id ?? null,
    payer,
    invoice: invoice
      ? { id: invoice.id, invoice_number: Number(invoice.invoice_number) }
      : null,
    bonus_credits: Number(row.bonus_credits ?? 0),
    customisation_notes: row.customisation_notes ?? null,
    amount_sgd:
      row.amount_sgd == null || row.amount_sgd === ""
        ? null
        : Number(row.amount_sgd),
    package_products: product,
    sessions: asSingle(row.sessions),
    informed_at:
      typeof row.informed_at === "string" ? row.informed_at : null,
  };
}

export async function listPackageProducts(options?: {
  activeOnly?: boolean;
}): Promise<PackageProduct[]> {
  const supabase = await createClient();
  let query = supabase
    .from("package_products")
    .select(PACKAGE_PRODUCT_COLUMNS)
    .order("sort_order")
    .order("total_credits");

  if (options?.activeOnly !== false) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => mapPackageProduct(row as PackageProduct)!);
}

export async function listTrialPackageProducts(): Promise<PackageProduct[]> {
  const products = await listPackageProducts({ activeOnly: true });
  return products.filter((product) => isTrialProductType(product.product_type));
}

export async function studentHasTrialProductPackage(
  studentId: string
): Promise<boolean> {
  const packages = await listPackagesForStudent(studentId);
  return packages.some(packageIsTrialProduct);
}

export async function getEventPackageProduct(): Promise<PackageProduct | null> {
  const products = await listPackageProducts({ activeOnly: true });
  return products.find((product) => product.product_type === "event") ?? null;
}

export async function getPackageProductById(
  id: string
): Promise<PackageProduct | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("package_products")
    .select(PACKAGE_PRODUCT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapPackageProduct(data as PackageProduct);
}

export async function listPackagesForStudent(
  studentId: string
): Promise<Package[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(PACKAGE_COLUMNS)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) => mapPackage(row));
}

export async function getPackageById(id: string): Promise<Package | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(PACKAGE_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapPackage(data);
}

export async function getPackageWithStudent(
  id: string
): Promise<PackageWithStudent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select(
      `
      ${PACKAGE_COLUMNS},
      students (
        id,
        full_name,
        contact_phone,
        payer_id
      )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { students, ...pkg } = data as {
    students:
      | Pick<Student, "id" | "full_name" | "contact_phone" | "payer_id">
      | Pick<Student, "id" | "full_name" | "contact_phone" | "payer_id">[]
      | null;
    package_product_id?: string | null;
    amount_sgd?: number | string | null;
    package_products?: PackageProduct | PackageProduct[] | null;
    [key: string]: unknown;
  };

  const student = asSingle(students);
  if (!student) return null;

  return {
    ...mapPackage(pkg),
    students: student,
  };
}

export type PackageListFilter =
  | "finishing"
  | "finished"
  | Exclude<PackageStatus, "exhausted">;

export async function listPackages(options?: {
  filters?: PackageListFilter[];
  search?: string;
}): Promise<PackageWithStudent[]> {
  const supabase = await createClient();
  const filters = options?.filters ?? ["finishing"];
  const hasFinishing = filters.includes("finishing");
  const statuses = filters.flatMap((value): PackageStatus[] => {
    if (value === "finishing") return [];
    if (value === "finished") return ["exhausted"];
    return [value];
  });

  let query = supabase
    .from("packages")
    .select(
      `
      ${PACKAGE_COLUMNS},
      students!inner (
        id,
        full_name,
        contact_phone,
        payer_id
      )
    `
    )
    .order("created_at", { ascending: false });

  if (statuses.length > 0 && !hasFinishing) {
    query = query.in("status", statuses);
  }

  const trimmed = options?.search?.trim();
  if (trimmed) {
    query = query.ilike("students.full_name", `%${trimmed}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const packages = (data ?? [])
    .map((row) => {
      const { students, ...pkg } = row as {
        students:
          | Pick<Student, "id" | "full_name" | "contact_phone" | "payer_id">
          | Pick<Student, "id" | "full_name" | "contact_phone" | "payer_id">[]
          | null;
        package_product_id?: string | null;
        amount_sgd?: number | string | null;
        package_products?: PackageProduct | PackageProduct[] | null;
        [key: string]: unknown;
      };
      const student = asSingle(students);
      if (!student) return null;
      return {
        ...mapPackage(pkg),
        students: student,
      } satisfies PackageWithStudent;
    })
    .filter((item): item is PackageWithStudent => item !== null)
    .filter((pkg) => !(pkg.session_id && pkg.status === "exhausted"));

  if (hasFinishing && statuses.length > 0) {
    return packages.filter(
      (pkg) => isFinishingPackage(pkg) || statuses.includes(pkg.status)
    );
  }
  if (hasFinishing) {
    return packages.filter(isFinishingPackage);
  }

  return packages;
}

export async function countUnchargedAttendanceForStudent(
  studentId: string
): Promise<number> {
  if (!studentId) return 0;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance")
    .select("id, sessions!inner(kind)")
    .eq("student_id", studentId)
    .is("package_id", null)
    .eq("deduct_credit", true)
    .eq("sessions.kind", "class");

  if (error) throw error;
  return data?.length ?? 0;
}

export async function countUnchargedAttendanceForPackage(
  pkg: Pick<Package, "student_id" | "session_id">
): Promise<number> {
  if (!pkg.student_id) return 0;
  const supabase = await createClient();

  if (pkg.session_id) {
    const { count, error } = await supabase
      .from("attendance")
      .select("id", { count: "exact", head: true })
      .eq("student_id", pkg.student_id)
      .eq("session_id", pkg.session_id)
      .is("package_id", null)
      .eq("deduct_credit", true);

    if (error) throw error;
    return count ?? 0;
  }

  return countUnchargedAttendanceForStudent(pkg.student_id);
}

export async function countUnchargedAttendanceByStudent(): Promise<
  Record<string, number>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance")
    .select("student_id, sessions!inner(kind)")
    .is("package_id", null)
    .eq("deduct_credit", true)
    .eq("sessions.kind", "class");

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const studentId = row.student_id as string;
    counts[studentId] = (counts[studentId] ?? 0) + 1;
  }
  return counts;
}
