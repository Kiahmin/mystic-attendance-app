import { createClient } from "@/lib/supabase/server";
import type {
  ClassGroup,
  EnrolmentWithClass,
  Student,
  StudentListItem,
  StudentWithEnrolments,
} from "@/lib/types";

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function listStudents(
  search?: string
): Promise<StudentListItem[]> {
  const supabase = await createClient();

  let query = supabase
    .from("students")
    .select(
      `
        id,
        full_name,
        date_of_birth,
        is_minor,
        guardian_name,
        guardian_phone,
        contact_phone,
        skill_level,
        notes,
        enrolments (id)
      `
    )
    .order("full_name");

  const trimmed = search?.trim();
  if (trimmed) {
    query = query.ilike("full_name", `%${trimmed}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => {
    const { enrolments, ...student } = row;
    return {
      ...(student as Student),
      enrolment_count: Array.isArray(enrolments) ? enrolments.length : 0,
    };
  });
}

export async function getStudentById(
  id: string
): Promise<StudentWithEnrolments | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("students")
    .select(
      `
        id,
        full_name,
        date_of_birth,
        is_minor,
        guardian_name,
        guardian_phone,
        contact_phone,
        skill_level,
        notes,
        enrolments (
          id,
          student_id,
          class_id,
          enrolled_at,
          classes (
            id,
            name,
            day_of_week,
            start_time,
            end_time,
            coach_id,
            is_active
          )
        )
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { enrolments, ...student } = data as Student & {
    enrolments: Array<{
      id: string;
      student_id: string;
      class_id: string;
      enrolled_at: string;
      classes: ClassGroup | ClassGroup[];
    }> | null;
  };

  const typedEnrolments: EnrolmentWithClass[] = (enrolments ?? [])
    .map((enrolment) => {
      const classGroup = asSingle(enrolment.classes);
      if (!classGroup) return null;
      return {
        id: enrolment.id,
        student_id: enrolment.student_id,
        class_id: enrolment.class_id,
        enrolled_at: enrolment.enrolled_at,
        classes: classGroup,
      };
    })
    .filter((item): item is EnrolmentWithClass => item !== null);

  typedEnrolments.sort((a, b) =>
    a.classes.name.localeCompare(b.classes.name)
  );

  return {
    ...student,
    enrolments: typedEnrolments,
  };
}
