"use client";

import { useEffect } from "react";

const SESSION_KEY = "mystic-pwa-session";
const CLEAR_MESSAGE = "CLEAR_SESSION_CACHES";

function isPrecache(name: string) {
  return name.toLowerCase().includes("precache");
}

async function deleteRuntimeCaches() {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(
    keys.filter((key) => !isPrecache(key)).map((key) => caches.delete(key))
  );
}

/** Runtime SW caches persist after close. sessionStorage does not. */
export function ClearCachesOnNewSession() {
  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");

    void deleteRuntimeCaches();
    navigator.serviceWorker?.controller?.postMessage({ type: CLEAR_MESSAGE });
  }, []);

  return null;
}
