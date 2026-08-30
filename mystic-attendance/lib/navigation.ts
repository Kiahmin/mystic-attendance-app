export function isNavActive(
  pathname: string,
  href: string,
  exact = false
): boolean {
  if (exact || href === "/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Same-app list URL only — used as a Back target from student detail. */
export function safeStudentListHref(value: string | undefined): string {
  const fallback = "/admin/students";
  if (!value) return fallback;

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return fallback;
  }

  if (!decoded.startsWith(fallback)) return fallback;
  if (decoded.startsWith("//") || decoded.includes("://")) return fallback;
  if (decoded.includes("\\")) return fallback;
  return decoded;
}
