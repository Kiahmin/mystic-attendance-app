import Link from "next/link";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { listPackages, type PackageListFilter } from "@/lib/queries/packages";
import { PackageList } from "@/components/admin/package-list";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

const FILTERS = new Set<PackageListFilter>([
  "finishing",
  "unpaid",
  "active",
  "paused",
  "expired",
  "finished",
  "overshot",
]);

const FILTER_ALIASES: Record<string, PackageListFilter> = {
  at_risk: "finishing",
  exhausted: "finished",
};

function parseFilters(value: string | undefined): PackageListFilter[] {
  if (value === undefined) return ["finishing"];
  if (value === "") return [];

  const valid = value
    .split(",")
    .map((token) => token.trim())
    .map((token) => FILTER_ALIASES[token] ?? token)
    .filter((token): token is PackageListFilter =>
      FILTERS.has(token as PackageListFilter)
    );

  return valid.length > 0 ? [...new Set(valid)] : ["finishing"];
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
        className="sm:items-end"
        title="Package Management"
        description="Track low credits, expiring packs, unpaid balances, and forfeitures."
      >
        <Button asChild className="h-11 min-h-11 px-6">
          <Link
            href="/admin/packages/assign"
            className="inline-flex h-11 min-h-11 items-center px-6"
          >
            <Plus className="size-4" />
            Assign Package
          </Link>
        </Button>
      </PageHeader>
      <PackageList
        packages={packages}
        initialFilter={filters}
        initialSearch={params.q ?? ""}
      />
    </div>
  );
}
