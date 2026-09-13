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

export type StudentListQuery = {
  inactive?: boolean;
  q?: string;
  page?: number;
};

function studentListSearchParams(options?: StudentListQuery) {
  const params = new URLSearchParams();
  if (options?.inactive) params.set("inactive", "1");
  const q = options?.q?.trim();
  if (q) params.set("q", q);
  if (options?.page != null && options.page > 1) {
    params.set("page", String(options.page));
  }
  return params;
}

export function studentListHref(options?: StudentListQuery): string {
  const qs = studentListSearchParams(options).toString();
  return qs ? `/admin/students?${qs}` : "/admin/students";
}

export function studentDetailHref(id: string, list?: StudentListQuery): string {
  const qs = studentListSearchParams(list).toString();
  return qs ? `/admin/students/${id}?${qs}` : `/admin/students/${id}`;
}
