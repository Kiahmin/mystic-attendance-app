"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { startNavigationProgress } from "@/components/layout/navigation-progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  fallbackHref: string;
  label?: string;
  className?: string;
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
  fallbackHref: string
) {
  startNavigationProgress();
  if (canUseHistoryBack()) {
    router.back();
    return;
  }
  router.push(fallbackHref);
}

export function BackButton({
  fallbackHref,
  label = "Back",
  className,
}: BackButtonProps) {
  const router = useRouter();

  useEffect(() => {
    router.prefetch(fallbackHref);
  }, [fallbackHref, router]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn("-ml-2 w-fit", className)}
      onClick={() => navigateBack(router, fallbackHref)}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  );
}
