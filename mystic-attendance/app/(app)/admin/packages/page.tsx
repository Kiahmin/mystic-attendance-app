import { requireRole } from "@/lib/auth/profile";
import { listPackages, type PackageListFilter } from "@/lib/queries/packages";
import { PackageList } from "@/components/admin/package-list";
import { PageHeader } from "@/components/layout/page-header";
import type { PackageStatus } from "@/lib/types";

const FILTERS = new Set([
  "at_risk",
  "all",
  "unpaid",
  "active",
  "paused",
  "expired",
  "exhausted",
]);

function parseFilter(value: string | undefined): PackageListFilter {
  if (value && FILTERS.has(value)) {
    return value as PackageListFilter;
  }
  return "at_risk";
}

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const packages = await listPackages({
    filter,
    search: params.q,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Package Management"
        description="Track low credits, expiring packs, unpaid balances, and forfeitures."
      />
      <PackageList
        packages={packages}
        initialFilter={filter === "at_risk" || filter === "all" ? filter : (filter as PackageStatus)}
        initialSearch={params.q ?? ""}
      />
    </div>
  );
}
