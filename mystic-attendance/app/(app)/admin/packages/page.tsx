import { requireRole } from "@/lib/auth/profile";
import { listPackages, type PackageListFilter } from "@/lib/queries/packages";
import { PackageList } from "@/components/admin/package-list";
import { PageHeader } from "@/components/layout/page-header";

const FILTERS = new Set<PackageListFilter>([
  "at_risk",
  "unpaid",
  "active",
  "paused",
  "expired",
  "exhausted",
]);

function parseFilters(value: string | undefined): PackageListFilter[] {
  if (value === undefined) return ["at_risk"];
  if (value === "") return [];

  const valid = value
    .split(",")
    .map((token) => token.trim())
    .filter((token): token is PackageListFilter =>
      FILTERS.has(token as PackageListFilter)
    );

  return valid.length > 0 ? valid : ["at_risk"];
}

export default async function AdminPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const filters = parseFilters(params.filter);
  const packages = await listPackages({
    filters,
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
        initialFilter={filters}
        initialSearch={params.q ?? ""}
      />
    </div>
  );
}
