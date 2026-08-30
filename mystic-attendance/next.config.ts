import path from "node:path";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Repo root, not this package. Vercel Git deploys look up
  // routes-manifest-deterministic.json from the tracing root; pointing
  // that at mystic-attendance/ makes it search /vercel/path0/.next.
  outputFileTracingRoot: path.join(__dirname, ".."),
  experimental: {
    // Keep visited pages warm for the open PWA/tab. Closing the app
    // drops this in-memory cache; a new session also clears SW caches.
    staleTimes: {
      dynamic: 60 * 60 * 24,
      static: 60 * 60 * 24,
    },
  },
};

export default withSerwist(nextConfig);
