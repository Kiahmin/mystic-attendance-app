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
};

export default withSerwist(nextConfig);
