"use server";

import { requireRole } from "@/lib/auth/profile";
import { searchStudents } from "@/lib/queries/sessions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function revalidateEnrolmentPaths(studentId: string, classId: string) {
  revalidatePath("/admin/students");
  revalidatePath(`/admin/students/${studentId}`);
  revalidatePath("/admin/classes");
  revalidatePath(`/admin/classes/${classId}`);
  revalidatePath("/admin");
  revalidatePath("/coach");
}

export async function enrolStudent(studentId: string, classId: string) {
  await requireRole(["admin"]);

  if (!studentId || !classId) {
    return { error: "Student and class are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("enrolments").insert({
    student_id: studentId,
    class_id: classId,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Student is already enrolled in this class." };
    }
    return { error: error.message };
  }

  revalidateEnrolmentPaths(studentId, classId);
  return { success: true as const };
}

export async function unenrolStudent(studentId: string, classId: string) {
  await requireRole(["admin"]);

  if (!studentId || !classId) {
    return { error: "Student and class are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("enrolments")
    .delete()
    .eq("student_id", studentId)
    .eq("class_id", classId);

  if (error) {
    return { error: error.message };
  }

  revalidateEnrolmentPaths(studentId, classId);
  return { success: true as const };
}

export async function searchStudentsForEnrolment(query: string) {
  await requireRole(["admin"]);
  return searchStudents(query);
}
