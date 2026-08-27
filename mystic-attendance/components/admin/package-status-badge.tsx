"use client";

import { Badge } from "@/components/ui/badge";
import { PACKAGE_STATUS_LABELS } from "@/lib/package-utils";
import type { PackageStatus } from "@/lib/types";

const VARIANT: Record<
  PackageStatus,
  "default" | "secondary" | "destructive" | "warning" | "success" | "outline"
> = {
  unpaid: "warning",
  active: "success",
  paused: "secondary",
  expired: "destructive",
  exhausted: "outline",
  overshot: "destructive",
};

export function PackageStatusBadge({ status }: { status: PackageStatus }) {
  return (
    <Badge variant={VARIANT[status]}>{PACKAGE_STATUS_LABELS[status]}</Badge>
  );
}
