import { createClient } from "@/lib/supabase/server";
import {
  isFinishingPackage,
  isTrialProductType,
  packageIsTrialProduct,
} from "@/lib/package-utils";
import type {
  Package,
  PackageProduct,
  PackageStatus,
  PackageWithStudent,
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
  package_product_id,
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
  status,
  created_at,
  package_products (
    ${PACKAGE_PRODUCT_COLUMNS}
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
  amount_sgd?: number | string | null;
  bonus_credits?: number | string | null;
  customisation_notes?: string | null;
  package_products?: PackageProduct | PackageProduct[] | null;
  [key: string]: unknown;
}): Package {
  const product = mapPackageProduct(asSingle(row.package_products));
  return {
    ...(row as unknown as Package),
    package_product_id: row.package_product_id ?? null,
    bonus_credits: Number(row.bonus_credits ?? 0),
    customisation_notes: row.customisation_notes ?? null,
    amount_sgd:
      row.amount_sgd == null || row.amount_sgd === ""
        ? null
        : Number(row.amount_sgd),
    package_products: product,
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
        contact_phone
      )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { students, ...pkg } = data as {
    students:
      | Pick<Student, "id" | "full_name" | "contact_phone">
      | Pick<Student, "id" | "full_name" | "contact_phone">[]
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
        contact_phone
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
          | Pick<Student, "id" | "full_name" | "contact_phone">
          | Pick<Student, "id" | "full_name" | "contact_phone">[]
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
    .filter((item): item is PackageWithStudent => item !== null);

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
  const { count, error } = await supabase
    .from("attendance")
    .select("id", { count: "exact", head: true })
    .eq("student_id", studentId)
    .is("package_id", null)
    .eq("deduct_credit", true);

  if (error) throw error;
  return count ?? 0;
}

export async function countUnchargedAttendanceByStudent(): Promise<
  Record<string, number>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance")
    .select("student_id")
    .is("package_id", null)
    .eq("deduct_credit", true);

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const studentId = row.student_id as string;
    counts[studentId] = (counts[studentId] ?? 0) + 1;
  }
  return counts;
}
