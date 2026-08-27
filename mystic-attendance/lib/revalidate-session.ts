import { revalidatePath } from "next/cache";

/** Invalidate coach + admin session detail pages and list surfaces. */
export function revalidateSessionAttendance(sessionId: string) {
  revalidatePath(`/coach/sessions/${sessionId}`);
  revalidatePath(`/admin/sessions/${sessionId}`);
  revalidatePath("/coach");
  revalidatePath("/admin");
  revalidatePath("/admin/schedule");
}
