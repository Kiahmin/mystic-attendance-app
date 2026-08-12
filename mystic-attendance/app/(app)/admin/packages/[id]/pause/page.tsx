import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import { getPackageWithStudent } from "@/lib/queries/packages";
import { canPausePackage } from "@/lib/package-utils";
import { PausePackageForm } from "@/components/admin/pause-package-form";
import { PageHeader } from "@/components/layout/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function PausePackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["admin"]);
  const { id } = await params;
  const pkg = await getPackageWithStudent(id);

  if (!pkg) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/packages"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 mb-2 w-fit"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to Packages
        </Link>
        <PageHeader
          title="Pause Package"
          description="Temporarily suspend an active membership or package."
        />
      </div>

      {!canPausePackage(pkg) ? (
        <Alert variant="destructive">
          <AlertTitle>Cannot pause this package</AlertTitle>
          <AlertDescription>
            {pkg.pause_used
              ? "This package has already used its one allowed pause."
              : !pkg.is_paid
                ? "Unpaid packages cannot be paused."
                : "Only active paid packages can be paused."}
          </AlertDescription>
        </Alert>
      ) : (
        <PausePackageForm pkg={pkg} />
      )}
    </div>
  );
}
