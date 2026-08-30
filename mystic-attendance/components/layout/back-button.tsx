"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  fallbackHref: string;
  label?: string;
  className?: string;
  /** Use fallbackHref instead of history.back(), e.g. a filtered list URL. */
  preferFallback?: boolean;
}

function canUseHistoryBack() {
  if (typeof window === "undefined") return false;

  const idx = window.history.state?.idx;
  if (typeof idx === "number") {
    return idx > 0;
  }

  try {
    if (!document.referrer) return window.history.length > 1;
    const referrer = new URL(document.referrer);
    return (
      referrer.origin === window.location.origin &&
      referrer.href !== window.location.href
    );
  } catch {
    return window.history.length > 1;
  }
}

export function navigateBack(
  router: ReturnType<typeof useRouter>,
  fallbackHref: string,
  preferFallback = false
) {
  if (!preferFallback && canUseHistoryBack()) {
    router.back();
    return;
  }
  router.push(fallbackHref);
}

export function BackButton({
  fallbackHref,
  label = "Back",
  className,
  preferFallback = false,
}: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("-ml-2 w-fit", className)}
      onClick={() => navigateBack(router, fallbackHref, preferFallback)}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  );
}
