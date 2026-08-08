import { headers } from "next/headers";

/** Pathname forwarded by middleware via x-pathname. */
export async function getPathname(): Promise<string> {
  const headerStore = await headers();
  return headerStore.get("x-pathname") ?? "";
}
