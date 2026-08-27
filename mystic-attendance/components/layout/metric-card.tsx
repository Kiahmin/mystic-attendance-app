import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  /** Spoken value when `value` is not a string or number. */
  valueText?: string;
  detail?: string;
  icon?: React.ReactNode;
  accent?: "default" | "warning" | "destructive";
  className?: string;
  href?: string;
}

const accentClasses = {
  default: "",
  warning: "border-l-4 border-l-warning",
  destructive: "border-l-4 border-l-destructive",
} as const;

function metricValueText(value: React.ReactNode): string | null {
  if (typeof value === "number" || typeof value === "string") {
    return String(value);
  }
  return null;
}

export function MetricCard({
  label,
  value,
  valueText,
  detail,
  icon,
  accent = "default",
  className,
  href,
}: MetricCardProps) {
  const announced = valueText ?? metricValueText(value);
  const card = (
    <Card
      className={cn(
        "h-full rounded-xl",
        accentClasses[accent],
        href &&
          "cursor-pointer transition-colors hover:bg-muted/40",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="font-heading text-sm leading-snug font-medium text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <div
            aria-hidden="true"
            className="text-muted-foreground [&_svg]:size-4"
          >
            {icon}
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        {detail ? (
          <p className="mt-1 text-sm font-normal text-muted-foreground">
            {detail}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={announced ? `${label}, ${announced}` : label}
        className="block h-full rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {card}
      </Link>
    );
  }

  return card;
}
