import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
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

export function MetricCard({
  label,
  value,
  detail,
  icon,
  accent = "default",
  className,
  href,
}: MetricCardProps) {
  const card = (
    <Card
      className={cn(
        "rounded-xl",
        accentClasses[accent],
        href &&
          "cursor-pointer transition-colors hover:bg-muted/40",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        {icon ? (
          <div className="text-muted-foreground [&_svg]:size-4">{icon}</div>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className="font-heading text-3xl font-semibold tracking-tight">
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
        className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {card}
      </Link>
    );
  }

  return card;
}
