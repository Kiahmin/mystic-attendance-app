import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth/profile";
import {
  countUnchargedAttendanceByStudent,
  listPackageProducts,
} from "@/lib/queries/packages";
import { isEventProductType } from "@/lib/package-utils";
import { listPayers } from "@/lib/queries/payers";
import { listStudentDirectory } from "@/lib/queries/students";
import { AssignPackageForm } from "@/components/admin/assign-package-form";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function AssignPackagePage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const [students, products, unchargedByStudent, payers] = await Promise.all([
    listStudentDirectory(),
    listPackageProducts({ activeOnly: true }),
    countUnchargedAttendanceByStudent(),
    listPayers(),
  ]);
  const studentId = params.studentId;
  const cancelHref = studentId
    ? `/admin/students/${studentId}`
    : "/admin/packages";

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={cancelHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 mb-2 w-fit"
          )}
        >
          <ArrowLeft className="size-4" />
          {studentId ? "Back to Profile" : "Back to Packages"}
        </Link>
        <PageHeader
          title="Assign New Package"
          description="Create a lesson package and log payment details."
        />
      </div>
      <AssignPackageForm
        students={students}
        products={products.filter(
          (product) => !isEventProductType(product.product_type)
        )}
        payers={payers}
        unchargedByStudent={unchargedByStudent}
        initialStudentId={studentId}
        cancelHref={cancelHref}
      />
    </div>
  );
}
