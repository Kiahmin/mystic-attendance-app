import { revalidatePath } from "next/cache";

/** Invalidate coach + admin session detail pages and list surfaces. */
export function revalidateSessionAttendance(
  sessionId: string,
  studentId?: string
) {
  revalidatePath(`/coach/sessions/${sessionId}`);
  revalidatePath(`/admin/sessions/${sessionId}`);
  revalidatePath("/coach");
  revalidatePath("/admin");
  revalidatePath("/admin/schedule");
  if (studentId) {
    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${studentId}`);
    revalidatePath(`/admin/students/${studentId}/attendance`);
  }
}
