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

export function studentListHref(options?: {
  inactive?: boolean;
  q?: string;
}): string {
  const params = new URLSearchParams();
  if (options?.inactive) params.set("inactive", "1");
  const q = options?.q?.trim();
  if (q) params.set("q", q);
  const qs = params.toString();
  return qs ? `/admin/students?${qs}` : "/admin/students";
}
