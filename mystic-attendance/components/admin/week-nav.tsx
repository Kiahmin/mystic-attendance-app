import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addCalendarDays, formatCalendarDate } from "@/lib/datetime";
import { adminWeekHref } from "@/lib/session-utils";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type WeekNavProps = {
  monday: string;
  sunday: string;
  isCurrentWeek: boolean;
};

export function WeekNav({ monday, sunday, isCurrentWeek }: WeekNavProps) {
  const prevMonday = addCalendarDays(monday, -7);
  const nextMonday = addCalendarDays(monday, 7);
  const label = isCurrentWeek
    ? "This week"
    : `${formatCalendarDate(monday)} – ${formatCalendarDate(sunday)}`;

  return (
    <div className="flex items-center gap-1">
      <Link
        href={adminWeekHref(prevMonday)}
        aria-label="Previous week"
        className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }))}
      >
        <ChevronLeft className="size-4" />
      </Link>
      <p className="px-2 text-center text-sm font-medium whitespace-nowrap">
        {label}
      </p>
      <Link
        href={adminWeekHref(nextMonday)}
        aria-label="Next week"
        className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }))}
      >
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
