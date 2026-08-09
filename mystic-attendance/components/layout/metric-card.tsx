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
  icon?: React.ReactNode;
  accent?: "default" | "warning" | "destructive";
  className?: string;
}

const accentClasses = {
  default: "",
  warning: "border-l-4 border-l-warning",
  destructive: "border-l-4 border-l-destructive",
} as const;

export function MetricCard({
  label,
  value,
  icon,
  accent = "default",
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("rounded-xl", accentClasses[accent], className)}>
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
      </CardContent>
    </Card>
  );
}
