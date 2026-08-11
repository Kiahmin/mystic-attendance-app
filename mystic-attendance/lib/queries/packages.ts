import { createClient } from "@/lib/supabase/server";
import { isAtRiskPackage } from "@/lib/package-utils";
import type {
  Package,
  PackageStatus,
  PackageWithStudent,
  Student,
} from "@/lib/types";

const PACKAGE_COLUMNS = `
  id,
  student_id,
  total_credits,
  used_credits,
  remaining_credits,
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
  created_at
`;

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapPackage(row: Package): Package {
  return {
    ...row,
    amount_sgd:
      row.amount_sgd == null ? null : Number(row.amount_sgd),
  };
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
  return (data ?? []).map((row) => mapPackage(row as Package));
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
  return mapPackage(data as Package);
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

  const { students, ...pkg } = data as Package & {
    students:
      | Pick<Student, "id" | "full_name" | "contact_phone">
      | Pick<Student, "id" | "full_name" | "contact_phone">[]
      | null;
  };

  const student = asSingle(students);
  if (!student) return null;

  return {
    ...mapPackage(pkg),
    students: student,
  };
}

export type PackageListFilter =
  | "at_risk"
  | "all"
  | PackageStatus;

export async function listPackages(options?: {
  filter?: PackageListFilter;
  search?: string;
}): Promise<PackageWithStudent[]> {
  const supabase = await createClient();
  const filter = options?.filter ?? "at_risk";

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

  if (filter !== "all" && filter !== "at_risk") {
    query = query.eq("status", filter);
  }

  const trimmed = options?.search?.trim();
  if (trimmed) {
    query = query.ilike("students.full_name", `%${trimmed}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const packages = (data ?? [])
    .map((row) => {
      const { students, ...pkg } = row as Package & {
        students:
          | Pick<Student, "id" | "full_name" | "contact_phone">
          | Pick<Student, "id" | "full_name" | "contact_phone">[]
          | null;
      };
      const student = asSingle(students);
      if (!student) return null;
      return {
        ...mapPackage(pkg),
        students: student,
      } satisfies PackageWithStudent;
    })
    .filter((item): item is PackageWithStudent => item !== null);

  if (filter === "at_risk") {
    return packages.filter(isAtRiskPackage);
  }

  return packages;
}
