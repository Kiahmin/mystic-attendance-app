import { todayInSingapore } from "@/lib/datetime";
import { rentalSummary } from "@/lib/gear-utils";
import { createClient } from "@/lib/supabase/server";
import { loadEffectiveSessionRosters } from "@/lib/session-roster";
import type { GearOrderStatus, StudentGearOrder, VenueRef } from "@/lib/types";
import { mapVenueRef } from "@/lib/venue-utils";

const GEAR_ORDER_COLUMNS = `
  id,
  student_id,
  item_name,
  size,
  notes,
  status,
  created_at,
  updated_at,
  given_at
`;

export function mapGearOrder(row: Record<string, unknown>): StudentGearOrder {
  return {
    id: row.id as string,
    student_id: row.student_id as string,
    item_name: row.item_name as string,
    size: (row.size as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    status: row.status as GearOrderStatus,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    given_at: (row.given_at as string | null) ?? null,
  };
}

export async function listGearOrdersForStudent(
  studentId: string
): Promise<StudentGearOrder[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("student_gear_orders")
    .select(GEAR_ORDER_COLUMNS)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row) =>
    mapGearOrder(row as unknown as Record<string, unknown>)
  );
}

export async function listOpenGearOrdersForStudents(
  studentIds: string[]
): Promise<StudentGearOrder[]> {
  if (studentIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("student_gear_orders")
    .select(GEAR_ORDER_COLUMNS)
    .in("student_id", studentIds)
    .neq("status", "given")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []).map((row) =>
    mapGearOrder(row as unknown as Record<string, unknown>)
  );
}

export type BringTodayStudent = {
  studentId: string;
  fullName: string;
  rentalLine: string | null;
  readyOrders: StudentGearOrder[];
};

export type BringTodaySession = {
  sessionId: string;
  title: string;
  timeLabel: string;
  venueName: string | null;
  href: string;
  students: BringTodayStudent[];
};

export type OpenGearOrderRow = {
  order: StudentGearOrder;
  studentName: string;
};

export type GearDashboard = {
  bringToday: BringTodaySession[];
  openOrders: OpenGearOrderRow[];
};

type SessionGearRow = {
  id: string;
  class_id: string | null;
  name: string | null;
  cancelled: boolean;
  start_time: string | null;
  venues?: VenueRef | VenueRef[] | null;
  classes?:
    | {
        name: string;
        start_time: string;
        venues?: VenueRef | VenueRef[] | null;
      }
    | {
        name: string;
        start_time: string;
        venues?: VenueRef | VenueRef[] | null;
      }[]
    | null;
};

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export async function getGearDashboard(
  today = todayInSingapore()
): Promise<GearDashboard> {
  const supabase = await createClient();

  const [sessionsResult, ordersResult] = await Promise.all([
    supabase
      .from("sessions")
      .select(
        `
          id,
          class_id,
          name,
          cancelled,
          start_time,
          venues (id, name),
          classes (
            name,
            start_time,
            venues (id, name)
          )
        `
      )
      .eq("session_date", today)
      .eq("cancelled", false),
    supabase
      .from("student_gear_orders")
      .select(
        `
          ${GEAR_ORDER_COLUMNS},
          students!inner (
            id,
            full_name,
            archived_at
          )
        `
      )
      .neq("status", "given")
      .order("created_at", { ascending: true }),
  ]);

  if (sessionsResult.error) throw sessionsResult.error;
  if (ordersResult.error) throw ordersResult.error;

  const sessionRows = (sessionsResult.data ?? []) as SessionGearRow[];
  const rosters = await loadEffectiveSessionRosters(
    supabase,
    sessionRows.map((session) => ({
      sessionId: session.id,
      classId: session.class_id,
    }))
  );

  const rosterStudentIds = [
    ...new Set(
      [...rosters.values()].flatMap((entries) =>
        entries.map((entry) => entry.studentId)
      )
    ),
  ];

  const studentsResult =
    rosterStudentIds.length === 0
      ? { data: [], error: null }
      : await supabase
          .from("students")
          .select(
            "id, full_name, archived_at, needs_rental_skates, needs_rental_gear, rental_note"
          )
          .in("id", rosterStudentIds);

  if (studentsResult.error) throw studentsResult.error;

  const studentsById = new Map(
    (studentsResult.data ?? []).map((row) => [row.id as string, row])
  );

  const openOrders = (ordersResult.data ?? [])
    .map((row) => {
      const student = asSingle(
        (
          row as {
            students?:
              | { id: string; full_name: string; archived_at: string | null }
              | { id: string; full_name: string; archived_at: string | null }[];
          }
        ).students
      );
      if (!student || student.archived_at) return null;
      return {
        order: mapGearOrder(row as unknown as Record<string, unknown>),
        studentName: student.full_name,
      };
    })
    .filter((row): row is OpenGearOrderRow => row !== null);

  const readyByStudent = new Map<string, StudentGearOrder[]>();
  for (const row of openOrders) {
    if (row.order.status !== "ready") continue;
    const list = readyByStudent.get(row.order.student_id);
    if (list) list.push(row.order);
    else readyByStudent.set(row.order.student_id, [row.order]);
  }

  const bringToday: BringTodaySession[] = sessionRows
    .map((session) => {
      const classRow = asSingle(session.classes);
      const venue =
        mapVenueRef(session.venues) ??
        (classRow ? mapVenueRef(classRow.venues) : null);
      const roster = rosters.get(session.id) ?? [];
      const students: BringTodayStudent[] = [];
      for (const entry of roster) {
        const student = studentsById.get(entry.studentId);
        if (!student || student.archived_at) continue;
        const rentalLine = rentalSummary({
          needs_rental_skates: Boolean(student.needs_rental_skates),
          needs_rental_gear: Boolean(student.needs_rental_gear),
          rental_note: (student.rental_note as string | null) ?? null,
        });
        const readyOrders = readyByStudent.get(entry.studentId) ?? [];
        if (!rentalLine && readyOrders.length === 0) continue;
        students.push({
          studentId: entry.studentId,
          fullName: student.full_name as string,
          rentalLine,
          readyOrders,
        });
      }
      students.sort((a, b) => a.fullName.localeCompare(b.fullName));
      const start = session.start_time ?? classRow?.start_time ?? "00:00:00";
      return {
        sessionId: session.id,
        title: session.name ?? classRow?.name ?? "Untitled",
        timeLabel: start.slice(0, 5),
        venueName: venue?.name ?? null,
        href: `/admin/sessions/${session.id}`,
        students,
      };
    })
    .filter((session) => session.students.length > 0)
    .sort((a, b) => a.timeLabel.localeCompare(b.timeLabel));

  const bringingOrderIds = new Set(
    bringToday.flatMap((session) =>
      session.students.flatMap((student) =>
        student.readyOrders.map((order) => order.id)
      )
    )
  );

  const waiting = openOrders
    .filter((row) => !bringingOrderIds.has(row.order.id))
    .sort((a, b) => {
      const byName = a.studentName.localeCompare(b.studentName);
      if (byName !== 0) return byName;
      return a.order.created_at.localeCompare(b.order.created_at);
    });

  return { bringToday, openOrders: waiting };
}
