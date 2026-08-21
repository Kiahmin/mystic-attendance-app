"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function isInAppNavigationClick(event: MouseEvent): boolean {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }

  const anchor = (event.target as Element | null)?.closest("a");
  if (!anchor) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:")) return false;

  const url = new URL(href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  if (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  ) {
    return false;
  }

  return true;
}

export function NavigationProgressBar() {
  return (
    <div
      role="progressbar"
      aria-label="Loading page"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 overflow-hidden bg-primary/15"
    >
      <div
        className="h-full w-1/3 bg-primary"
        style={{ animation: "navigation-progress 1s ease-in-out infinite" }}
      />
    </div>
  );
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<number | null>(null);

  useEffect(() => {
    setVisible(false);
    if (showTimer.current != null) {
      window.clearTimeout(showTimer.current);
      showTimer.current = null;
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!isInAppNavigationClick(event)) return;
      if (showTimer.current != null) window.clearTimeout(showTimer.current);
      showTimer.current = window.setTimeout(() => setVisible(true), 50);
    }

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (showTimer.current != null) window.clearTimeout(showTimer.current);
    };
  }, []);

  if (!visible) return null;

  return <NavigationProgressBar />;
}
