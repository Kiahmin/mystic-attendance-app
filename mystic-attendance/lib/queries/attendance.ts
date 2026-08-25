import { createClient } from "@/lib/supabase/server";
import { packageLabel } from "@/lib/package-utils";
import { sessionDisplayName, sessionDisplayStart } from "@/lib/session-utils";
import type {
  AttendanceStatus,
  AttendeeSource,
  ClassGroup,
  PackageProduct,
  PackageSession,
  Profile,
  SessionKind,
  StudentAttendanceEntry,
} from "@/lib/types";

const STUDENT_ATTENDANCE_SELECT = `
  id,
  session_id,
  status,
  attendee_source,
  decline_reason,
  deduct_credit,
  package_id,
  marked_at,
  marked_by_profile:profiles!attendance_marked_by_fkey (
    id,
    full_name
  ),
  sessions!inner (
    id,
    kind,
    name,
    session_date,
    start_time,
    end_time,
    class_id,
    profiles!sessions_coach_id_fkey (
      id,
      full_name
    ),
    classes (
      id,
      name,
      venue,
      day_of_week,
      start_time,
      end_time,
      coach_id,
      is_active,
      profiles!classes_coach_id_fkey (
        id,
        full_name
      )
    )
  ),
  packages (
    id,
    session_id,
    total_credits,
    bonus_credits,
    package_products (
      product_type,
      label,
      total_credits
    ),
    sessions (
      id,
      name,
      session_date
    )
  )
`;

type CoachRef = Pick<Profile, "id" | "full_name">;

type Embedded<T> = T | T[] | null;

type AttendanceSessionRow = {
  id: string;
  kind: SessionKind | null;
  name: string | null;
  session_date: string;
  start_time: string | null;
  end_time: string | null;
  class_id: string | null;
  profiles?: Embedded<CoachRef>;
  classes?: Embedded<ClassGroup & { profiles?: Embedded<CoachRef> }>;
};

type AttendancePackageRow = {
  id: string;
  session_id: string | null;
  total_credits: number;
  bonus_credits: number | null;
  package_products?: Embedded<
    Pick<PackageProduct, "product_type" | "label" | "total_credits">
  >;
  sessions?: Embedded<PackageSession>;
};

type StudentAttendanceRow = {
  id: string;
  session_id: string;
  status: AttendanceStatus | null;
  attendee_source: AttendeeSource | null;
  decline_reason: string | null;
  deduct_credit: boolean | null;
  package_id: string | null;
  marked_at: string | null;
  marked_by_profile?: Embedded<CoachRef>;
  sessions: Embedded<AttendanceSessionRow>;
  packages?: Embedded<AttendancePackageRow>;
};

function asSingle<T>(value: Embedded<T> | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function mapAttendanceRow(
  row: StudentAttendanceRow
): StudentAttendanceEntry | null {
  const session = asSingle(row.sessions);
  if (!session) return null;

  const classGroup = asSingle(session.classes);
  const coach =
    asSingle(session.profiles) ??
    (classGroup ? asSingle(classGroup.profiles) : null);
  const pkg = asSingle(row.packages);
  const sessionShape = {
    name: session.name ?? null,
    start_time: session.start_time ?? null,
    classes: classGroup,
  };

  return {
    id: row.id,
    status: row.status,
    attendeeSource: row.attendee_source ?? "enrolled",
    decline_reason: row.decline_reason,
    deduct_credit: Boolean(row.deduct_credit),
    package_id: row.package_id,
    marked_at: row.marked_at,
    sessionId: session.id,
    sessionDate: session.session_date,
    sessionKind: session.kind ?? "class",
    sessionName: sessionDisplayName(sessionShape),
    startTime: sessionDisplayStart(sessionShape),
    coachName: coach?.full_name ?? null,
    markedByName: asSingle(row.marked_by_profile)?.full_name ?? null,
    packageName: pkg
      ? packageLabel(
          {
            total_credits: pkg.total_credits,
            bonus_credits: pkg.bonus_credits,
            sessions: asSingle(pkg.sessions),
          },
          asSingle(pkg.package_products)
        )
      : null,
  };
}

/** Every attendance row for a student, newest session first. */
export async function listAttendanceForStudent(
  studentId: string
): Promise<StudentAttendanceEntry[]> {
  if (!studentId) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("attendance")
    .select(STUDENT_ATTENDANCE_SELECT)
    .eq("student_id", studentId);

  if (error) throw error;

  return ((data ?? []) as unknown as StudentAttendanceRow[])
    .map(mapAttendanceRow)
    .filter((entry): entry is StudentAttendanceEntry => entry !== null)
    .sort((a, b) => {
      const byDate = b.sessionDate.localeCompare(a.sessionDate);
      if (byDate !== 0) return byDate;
      return b.startTime.localeCompare(a.startTime);
    });
}
