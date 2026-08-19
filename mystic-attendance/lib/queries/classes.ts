import { createClient } from "@/lib/supabase/server";
import { DAYS_OF_WEEK } from "@/lib/admin-utils";
import type {
  ClassDetail,
  ClassGroup,
  ClassWithCoach,
  EnrolmentWithStudent,
  Profile,
  Student,
} from "@/lib/types";

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapClassWithCoach(row: {
  id: string;
  name: string;
  day_of_week: ClassGroup["day_of_week"];
  start_time: string;
  end_time: string;
  coach_id: string | null;
  is_active: boolean;
  profiles:
    | Pick<Profile, "id" | "full_name">
    | Pick<Profile, "id" | "full_name">[]
    | null;
}): ClassWithCoach {
  return {
    id: row.id,
    name: row.name,
    day_of_week: row.day_of_week,
    start_time: row.start_time,
    end_time: row.end_time,
    coach_id: row.coach_id,
    is_active: row.is_active,
    coach: asSingle(row.profiles),
  };
}

export async function listClasses(options?: {
  activeOnly?: boolean;
}): Promise<ClassWithCoach[]> {
  const supabase = await createClient();

  let query = supabase
    .from("classes")
    .select(
      `
        id,
        name,
        day_of_week,
        start_time,
        end_time,
        coach_id,
        is_active,
        profiles!coach_id (
          id,
          full_name
        )
      `
    )
    .order("day_of_week")
    .order("start_time")
    .order("name");

  if (options?.activeOnly) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) throw error;

  const dayRank = new Map(DAYS_OF_WEEK.map((day, index) => [day, index]));

  return (data ?? [])
    .map((row) =>
      mapClassWithCoach(row as Parameters<typeof mapClassWithCoach>[0])
    )
    .sort((a, b) => {
      const byDay =
        (dayRank.get(a.day_of_week) ?? 99) - (dayRank.get(b.day_of_week) ?? 99);
      if (byDay !== 0) return byDay;
      const byTime = a.start_time.localeCompare(b.start_time);
      if (byTime !== 0) return byTime;
      return a.name.localeCompare(b.name);
    });
}

export async function getClassById(id: string): Promise<ClassDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("classes")
    .select(
      `
        id,
        name,
        day_of_week,
        start_time,
        end_time,
        coach_id,
        is_active,
        profiles!coach_id (
          id,
          full_name
        ),
        enrolments (
          id,
          student_id,
          class_id,
          enrolled_at,
          students (
            id,
            full_name,
            date_of_birth,
            is_minor,
            guardian_name,
            guardian_phone,
            contact_phone,
            skill_level,
            notes
          )
        )
      `
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as {
    id: string;
    name: string;
    day_of_week: ClassGroup["day_of_week"];
    start_time: string;
    end_time: string;
    coach_id: string | null;
    is_active: boolean;
    profiles:
      | Pick<Profile, "id" | "full_name">
      | Pick<Profile, "id" | "full_name">[]
      | null;
    enrolments: Array<{
      id: string;
      student_id: string;
      class_id: string;
      enrolled_at: string;
      students: Student | Student[];
    }> | null;
  };

  const typedEnrolments: EnrolmentWithStudent[] = (row.enrolments ?? [])
    .map((enrolment) => {
      const student = asSingle(enrolment.students);
      if (!student) return null;
      return {
        id: enrolment.id,
        student_id: enrolment.student_id,
        class_id: enrolment.class_id,
        enrolled_at: enrolment.enrolled_at,
        students: student,
      };
    })
    .filter((item): item is EnrolmentWithStudent => item !== null);

  typedEnrolments.sort((a, b) =>
    a.students.full_name.localeCompare(b.students.full_name)
  );

  const mapped = mapClassWithCoach(row);

  return {
    ...mapped,
    enrolments: typedEnrolments,
  };
}
