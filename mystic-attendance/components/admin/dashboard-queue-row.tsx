import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type DashboardQueueRowProps = {
  studentName: string;
  studentHref: string;
  why: string;
  whyClassName?: string;
  actions: React.ReactNode;
};

const scrollClasses =
  "max-h-64 overflow-y-auto overscroll-contain outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function DashboardQueueList({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <ul
      role="list"
      aria-label={label}
      tabIndex={0}
      className={cn(scrollClasses, "divide-y")}
    >
      {children}
    </ul>
  );
}

export function AssignPackageLink({
  studentId,
  studentName,
}: {
  studentId: string;
  studentName: string;
}) {
  return (
    <Link
      href={`/admin/packages/assign?studentId=${studentId}`}
      className={buttonVariants({ size: "sm" })}
      aria-label={`Assign package for ${studentName}`}
    >
      Assign package
    </Link>
  );
}

export function DashboardQueueRow({
  studentName,
  studentHref,
  why,
  whyClassName,
  actions,
}: DashboardQueueRowProps) {
  return (
    <li className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <Link
          href={studentHref}
          aria-label={`Edit ${studentName}`}
          className="block truncate font-medium underline-offset-4 hover:underline"
        >
          {studentName}
        </Link>
        <p
          className={cn(
            "mt-0.5 truncate text-sm text-muted-foreground",
            whyClassName
          )}
        >
          {why}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">{actions}</div>
    </li>
  );
}
