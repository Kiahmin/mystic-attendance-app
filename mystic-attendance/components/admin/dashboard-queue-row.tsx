import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type QueueMarkup = "list" | "table";

type DashboardQueueRowProps = {
  studentName: string;
  studentHref: string;
  why: string;
  whyClassName?: string;
  actions: React.ReactNode;
  as?: QueueMarkup;
};

const scrollClasses =
  "max-h-64 overflow-y-auto overscroll-contain outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function DashboardQueueList({
  label,
  as = "list",
  children,
}: {
  label: string;
  as?: QueueMarkup;
  children: React.ReactNode;
}) {
  if (as === "table") {
    return (
      <div tabIndex={0} className={scrollClasses}>
        <table className="w-full">
          <caption className="sr-only">{label}</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Student</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="[&>tr:first-child>td]:pt-0 [&>tr:last-child>td]:pb-0">
            {children}
          </tbody>
        </table>
      </div>
    );
  }

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

function QueueStudentCell({
  studentName,
  studentHref,
  why,
  whyClassName,
}: Pick<
  DashboardQueueRowProps,
  "studentName" | "studentHref" | "why" | "whyClassName"
>) {
  return (
    <div className="min-w-0">
      <Link
        href={studentHref}
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
  );
}

export function DashboardQueueRow({
  studentName,
  studentHref,
  why,
  whyClassName,
  actions,
  as = "list",
}: DashboardQueueRowProps) {
  if (as === "table") {
    return (
      <tr className="border-t border-border first:border-t-0">
        <td className="py-3 pr-3 align-top">
          <QueueStudentCell
            studentName={studentName}
            studentHref={studentHref}
            why={why}
            whyClassName={whyClassName}
          />
        </td>
        <td className="w-px whitespace-nowrap py-3 pl-3 align-top">
          <div className="flex shrink-0 flex-col items-end gap-1">{actions}</div>
        </td>
      </tr>
    );
  }

  return (
    <li className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <QueueStudentCell
        studentName={studentName}
        studentHref={studentHref}
        why={why}
        whyClassName={whyClassName}
      />
      <div className="flex shrink-0 flex-col items-end gap-1">{actions}</div>
    </li>
  );
}
