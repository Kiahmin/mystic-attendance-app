import { createClient } from "@/lib/supabase/server";
import { addCalendarDays, todayInSingapore } from "@/lib/datetime";
import {
  EXPIRING_WITHIN_DAYS,
  isFinishingPackage,
  isTrialProductType,
  LOW_CREDIT_THRESHOLD,
  packageIsTrialProduct,
} from "@/lib/package-utils";
import type {
  Package,
  PackageCreditTransfer,
  PackageMember,
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
  package_students (
    student_id,
    students!package_students_student_id_fkey (
      id,
      full_name
    )
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

type PackageStudentRow = {
  student_id?: string;
  students?:
    | Pick<Student, "id" | "full_name">
    | Pick<Student, "id" | "full_name">[]
    | null;
};

function mapPackageMembers(
  rows: PackageStudentRow[] | PackageStudentRow | null | undefined,
  fallback?: PackageMember | null
): PackageMember[] {
  const list = Array.isArray(rows) ? rows : rows ? [rows] : [];
  const members = list
    .map((row) => {
      const student = asSingle(row.students);
      if (student?.id) {
        return { id: student.id, full_name: student.full_name };
      }
      if (row.student_id) {
        return { id: row.student_id, full_name: "Student" };
      }
      return null;
    })
    .filter((item): item is PackageMember => item != null);

  if (fallback && !members.some((member) => member.id === fallback.id)) {
    members.unshift(fallback);
  }

  return members;
}

function mapPackage(row: {
  student_id?: string;
  package_product_id?: string | null;
  session_id?: string | null;
  payer_id?: string | null;
  amount_sgd?: number | string | null;
  bonus_credits?: number | string | null;
  customisation_notes?: string | null;
  package_products?: PackageProduct | PackageProduct[] | null;
  sessions?: PackageSession | PackageSession[] | null;
  payers?: PayerRef | PayerRef[] | null;
  package_students?: PackageStudentRow[] | PackageStudentRow | null;
  [key: string]: unknown;
}): Package {
  const product = mapPackageProduct(asSingle(row.package_products));
  const payer = asSingle(row.payers);
  const studentId = (row.student_id as string | undefined) ?? "";
  return {
    ...(row as unknown as Package),
    package_product_id: row.package_product_id ?? null,
    session_id: row.session_id ?? null,
    payer_id: row.payer_id ?? payer?.id ?? null,
    payer,
    members: mapPackageMembers(
      row.package_students,
      studentId ? { id: studentId, full_name: "Student" } : null
    ),
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

export async function listPackageMembershipsForStudents(
  studentIds: string[]
): Promise<{ package_id: string; student_id: string }[]> {
  if (studentIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("package_students")
    .select("package_id, student_id")
    .in("student_id", studentIds);
  if (error) throw error;
  return (data ?? []).map((row) => ({
    package_id: row.package_id as string,
    student_id: row.student_id as string,
  }));
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
  const { data: memberships, error: membershipError } = await supabase
    .from("package_students")
    .select("package_id")
    .eq("student_id", studentId);

  if (membershipError) throw membershipError;
  const packageIds = [
    ...new Set((memberships ?? []).map((row) => row.package_id as string)),
  ];
  if (packageIds.length === 0) return [];

  const { data, error } = await supabase
    .from("packages")
    .select(PACKAGE_COLUMNS)
    .in("id", packageIds)
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

export async function listPackageCreditTransfers(
  packageIds: string[]
): Promise<PackageCreditTransfer[]> {
  if (packageIds.length === 0) return [];
  const supabase = await createClient();
  const select = `
    id,
    from_package_id,
    to_package_id,
    from_student_id,
    to_student_id,
    credits,
    note,
    created_at,
    from_student:students!from_student_id ( full_name ),
    to_student:students!to_student_id ( full_name )
  `;

  const [fromResult, toResult] = await Promise.all([
    supabase
      .from("package_credit_transfers")
      .select(select)
      .in("from_package_id", packageIds)
      .order("created_at", { ascending: false }),
    supabase
      .from("package_credit_transfers")
      .select(select)
      .in("to_package_id", packageIds)
      .order("created_at", { ascending: false }),
  ]);

  if (fromResult.error) throw fromResult.error;
  if (toResult.error) throw toResult.error;

  const byId = new Map<string, PackageCreditTransfer>();
  for (const row of [...(fromResult.data ?? []), ...(toResult.data ?? [])]) {
    const fromStudent = asSingle(
      row.from_student as { full_name: string } | { full_name: string }[] | null
    );
    const toStudent = asSingle(
      row.to_student as { full_name: string } | { full_name: string }[] | null
    );
    byId.set(row.id as string, {
      id: row.id as string,
      from_package_id: row.from_package_id as string,
      to_package_id: row.to_package_id as string,
      from_student_id: row.from_student_id as string,
      to_student_id: row.to_student_id as string,
      credits: Number(row.credits),
      note: (row.note as string | null) ?? null,
      created_at: row.created_at as string,
      from_student_name: fromStudent?.full_name ?? "Student",
      to_student_name: toStudent?.full_name ?? "Student",
    });
  }

  return [...byId.values()].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
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
      students!packages_student_id_fkey (
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
    ...mapPackage({
      ...pkg,
      student_id: (pkg.student_id as string | undefined) ?? student.id,
    }),
    members: mapPackageMembers(
      pkg.package_students as PackageStudentRow[] | PackageStudentRow | null,
      { id: student.id, full_name: student.full_name }
    ),
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
      students!packages_student_id_fkey!inner (
        id,
        full_name,
        contact_phone,
        payer_id
      )
    `
    )
    .order("created_at", { ascending: false });

  if (hasFinishing && statuses.length === 0) {
    const expiryCutoff = addCalendarDays(
      todayInSingapore(),
      EXPIRING_WITHIN_DAYS
    );
    query = query
      .is("session_id", null)
      .eq("status", "active")
      .or(
        `remaining_credits.lte.${LOW_CREDIT_THRESHOLD},expires_at.lte.${expiryCutoff}`
      );
  } else if (statuses.length > 0) {
    const statusFilter = hasFinishing
      ? [...new Set([...statuses, "active" as PackageStatus])]
      : statuses;
    query = query.in("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;

  const trimmed = options?.search?.trim().toLowerCase();

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
        package_students?:
          | PackageStudentRow[]
          | PackageStudentRow
          | null;
        [key: string]: unknown;
      };
      const student = asSingle(students);
      if (!student) return null;
      const mapped = mapPackage({
        ...pkg,
        student_id: (pkg.student_id as string | undefined) ?? student.id,
      });
      return {
        ...mapped,
        members: mapPackageMembers(pkg.package_students, {
          id: student.id,
          full_name: student.full_name,
        }),
        students: student,
      } satisfies PackageWithStudent;
    })
    .filter((item): item is PackageWithStudent => item !== null)
    .filter((pkg) => !(pkg.session_id && pkg.status === "exhausted"))
    .filter((pkg) => {
      if (!trimmed) return true;
      const haystacks = [
        pkg.students.full_name,
        pkg.payer?.display_name,
        pkg.payer?.phone,
        ...pkg.members.map((member) => member.full_name),
      ];
      return haystacks.some((value) => value?.toLowerCase().includes(trimmed));
    });

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
  pkg: Pick<Package, "student_id" | "session_id" | "members">
): Promise<number> {
  const studentIds = [
    ...new Set([
      pkg.student_id,
      ...(pkg.members ?? []).map((member) => member.id),
    ]),
  ].filter(Boolean);
  if (studentIds.length === 0) return 0;
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

  const { data, error } = await supabase
    .from("attendance")
    .select("id, sessions!inner(kind)")
    .in("student_id", studentIds)
    .is("package_id", null)
    .eq("deduct_credit", true)
    .eq("sessions.kind", "class");

  if (error) throw error;
  return data?.length ?? 0;
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
