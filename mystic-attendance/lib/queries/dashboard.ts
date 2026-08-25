import { createClient } from "@/lib/supabase/server";
import { DAYS_OF_WEEK } from "@/lib/admin-utils";
import {
  endOfMonth,
  startOfMonth,
  weekdayOfCalendarDate,
} from "@/lib/datetime";
import { packageLabel, LOW_CREDIT_THRESHOLD } from "@/lib/package-utils";
import type {
  ClassGroup,
  DayOfWeek,
  PackageProduct,
  PackageSession,
  PackageStatus,
  Student,
} from "@/lib/types";

export type DashboardQueueItem = {
  packageId: string;
  studentId: string;
  studentName: string;
  packageLabel: string;
  remainingCredits: number;
  totalCredits: number;
  lastAttendedOn: string | null;
  classIds: string[];
  classNames: string[];
  informedAt: string | null;
};

export type MonthlyVenueCheckIns = {
  venue: string;
  total: number;
};

export type MonthlyDayCheckIns = {
  day: DayOfWeek;
  total: number;
};

export type DashboardOperations = {
  activePackageCount: number;
  dueSoonCount: number;
  informedCount: number;
  exhaustedPackageCount: number;
  monthCheckInCount: number;
  dueSoon: DashboardQueueItem[];
  informed: DashboardQueueItem[];
  monthlyByVenue: MonthlyVenueCheckIns[];
  monthlyByDay: MonthlyDayCheckIns[];
};

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function studentHasRenewal(
  studentId: string,
  packages: Array<{
    student_id: string;
    status: PackageStatus;
    remaining_credits: number;
  }>
): boolean {
  return packages.some(
    (pkg) =>
      pkg.student_id === studentId &&
      pkg.status === "active" &&
      pkg.remaining_credits > LOW_CREDIT_THRESHOLD
  );
}

export async function getDashboardOperations(
  reportMonth: string
): Promise<DashboardOperations> {
  const supabase = await createClient();
  const monthStart = startOfMonth(`${reportMonth}-01`);
  const monthEnd = endOfMonth(monthStart);

  const [activeResult, exhaustedResult, queueResult, sessionsResult] =
    await Promise.all([
      supabase
        .from("packages")
        .select("id, students!inner(archived_at)", { count: "exact", head: true })
        .is("session_id", null)
        .eq("status", "active")
        .is("students.archived_at", null),
      supabase
        .from("packages")
        .select("id, students!inner(archived_at)", { count: "exact", head: true })
        .is("session_id", null)
        .eq("status", "exhausted")
        .is("students.archived_at", null),
      supabase
        .from("packages")
        .select(
          `
          id,
          student_id,
          remaining_credits,
          total_credits,
          used_credits,
          bonus_credits,
          status,
          informed_at,
          session_id,
          package_products (
            product_type,
            label,
            total_credits
          ),
          sessions (
            id,
            name,
            session_date
          ),
          students!inner (
            id,
            full_name,
            archived_at
          )
        `
        )
        .is("session_id", null)
        .eq("status", "active")
        .gt("remaining_credits", 0)
        .is("students.archived_at", null),
      supabase
        .from("sessions")
        .select(
          `
          id,
          session_date,
          cancelled,
          class_id,
          kind,
          name,
          classes (
            id,
            name,
            venue
          )
        `
        )
        .gte("session_date", monthStart)
        .lte("session_date", monthEnd)
        .eq("cancelled", false),
    ]);

  if (activeResult.error) throw activeResult.error;
  if (exhaustedResult.error) throw exhaustedResult.error;
  if (queueResult.error) throw queueResult.error;
  if (sessionsResult.error) throw sessionsResult.error;

  type QueueRow = {
    id: string;
    student_id: string;
    remaining_credits: number;
    total_credits: number;
    used_credits: number;
    bonus_credits: number | null;
    status: PackageStatus;
    informed_at: string | null;
    session_id: string | null;
    package_products:
      | Pick<PackageProduct, "product_type" | "label" | "total_credits">
      | Pick<PackageProduct, "product_type" | "label" | "total_credits">[]
      | null;
    sessions: PackageSession | PackageSession[] | null;
    students: Pick<Student, "id" | "full_name"> | Pick<Student, "id" | "full_name">[] | null;
  };

  const queuePackages = (queueResult.data ?? []) as QueueRow[];
  const renewalSource = queuePackages.map((pkg) => ({
    student_id: pkg.student_id,
    status: pkg.status,
    remaining_credits: Number(pkg.remaining_credits),
  }));

  const dueSoonRows = queuePackages.filter(
    (pkg) =>
      Number(pkg.remaining_credits) <= LOW_CREDIT_THRESHOLD &&
      !pkg.informed_at &&
      !studentHasRenewal(pkg.student_id, renewalSource)
  );
  const informedRows = queuePackages.filter(
    (pkg) =>
      Boolean(pkg.informed_at) &&
      Number(pkg.remaining_credits) > 0 &&
      !studentHasRenewal(pkg.student_id, renewalSource)
  );

  const studentIds = [
    ...new Set(
      [...dueSoonRows, ...informedRows].map((pkg) => pkg.student_id)
    ),
  ];

  const lastAttendedByStudent = new Map<string, string>();
  const classIdsByStudent = new Map<string, string[]>();
  const classNamesByStudent = new Map<string, string[]>();

  if (studentIds.length > 0) {
    const [{ data: lastAttendance, error: lastError }, { data: enrolments, error: enrolmentError }] =
      await Promise.all([
        supabase
          .from("student_last_attendance")
          .select("student_id, last_attended_on")
          .in("student_id", studentIds),
        supabase
          .from("enrolments")
          .select("student_id, class_id, classes(id, name)")
          .in("student_id", studentIds),
      ]);

    if (lastError) throw lastError;
    if (enrolmentError) throw enrolmentError;

    for (const row of lastAttendance ?? []) {
      lastAttendedByStudent.set(
        row.student_id as string,
        row.last_attended_on as string
      );
    }

    for (const row of enrolments ?? []) {
      const studentId = row.student_id as string;
      const classId = row.class_id as string;
      const classRow = asSingle(
        row.classes as Pick<ClassGroup, "id" | "name"> | Pick<ClassGroup, "id" | "name">[] | null
      );
      const ids = classIdsByStudent.get(studentId) ?? [];
      const names = classNamesByStudent.get(studentId) ?? [];
      if (!ids.includes(classId)) {
        ids.push(classId);
        classIdsByStudent.set(studentId, ids);
      }
      if (classRow?.name && !names.includes(classRow.name)) {
        names.push(classRow.name);
        classNamesByStudent.set(studentId, names);
      }
    }
  }

  function toQueueItem(pkg: QueueRow): DashboardQueueItem {
    const student = asSingle(pkg.students);
    const product = asSingle(pkg.package_products);
    const session = asSingle(pkg.sessions);
    return {
      packageId: pkg.id,
      studentId: pkg.student_id,
      studentName: student?.full_name ?? "Student",
      packageLabel: packageLabel(
        {
          total_credits: Number(pkg.total_credits),
          bonus_credits: Number(pkg.bonus_credits ?? 0),
          sessions: session,
        },
        product
      ),
      remainingCredits: Number(pkg.remaining_credits),
      totalCredits: Number(pkg.total_credits),
      lastAttendedOn: lastAttendedByStudent.get(pkg.student_id) ?? null,
      classIds: classIdsByStudent.get(pkg.student_id) ?? [],
      classNames: classNamesByStudent.get(pkg.student_id) ?? [],
      informedAt: pkg.informed_at,
    };
  }

  const dueSoon = dueSoonRows.map(toQueueItem).sort((a, b) =>
    a.studentName.localeCompare(b.studentName)
  );
  const informed = informedRows
    .map(toQueueItem)
    .sort((a, b) => (b.informedAt ?? "").localeCompare(a.informedAt ?? ""));

  type MonthSession = {
    id: string;
    session_date: string;
    cancelled: boolean;
    class_id: string | null;
    kind: string | null;
    name: string | null;
    classes:
      | Pick<ClassGroup, "id" | "name" | "venue">
      | Pick<ClassGroup, "id" | "name" | "venue">[]
      | null;
  };

  const monthSessions = (sessionsResult.data ?? []) as MonthSession[];
  const sessionById = new Map(monthSessions.map((session) => [session.id, session]));
  const sessionIds = monthSessions.map((session) => session.id);

  let presentCount = 0;
  const presentBySession = new Map<string, number>();
  if (sessionIds.length > 0) {
    const { data: attendanceRows, error: attendanceError } = await supabase
      .from("attendance")
      .select("id, session_id")
      .eq("status", "present")
      .in("session_id", sessionIds);
    if (attendanceError) throw attendanceError;
    presentCount = attendanceRows?.length ?? 0;
    for (const row of attendanceRows ?? []) {
      const sessionId = row.session_id as string;
      presentBySession.set(sessionId, (presentBySession.get(sessionId) ?? 0) + 1);
    }
  }

  const venueTotals = new Map<string, MonthlyVenueCheckIns>();
  const dayTotals = new Map<DayOfWeek, number>(
    DAYS_OF_WEEK.map((day) => [day, 0])
  );

  for (const [sessionId, count] of presentBySession) {
    const session = sessionById.get(sessionId);
    if (!session) continue;
    const classRow = asSingle(session.classes);
    const venue =
      classRow?.venue?.trim() ||
      (session.kind === "event"
        ? session.name?.trim() || "Events"
        : classRow?.name?.trim() || "Unspecified");
    const existing = venueTotals.get(venue);
    if (existing) {
      existing.total += count;
    } else {
      venueTotals.set(venue, { venue, total: count });
    }
    const day = weekdayOfCalendarDate(session.session_date);
    dayTotals.set(day, (dayTotals.get(day) ?? 0) + count);
  }

  const monthlyByVenue = [...venueTotals.values()].sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.venue.localeCompare(b.venue);
  });

  return {
    activePackageCount: activeResult.count ?? 0,
    dueSoonCount: dueSoon.length,
    informedCount: informed.length,
    exhaustedPackageCount: exhaustedResult.count ?? 0,
    monthCheckInCount: presentCount,
    dueSoon,
    informed,
    monthlyByVenue,
    monthlyByDay: DAYS_OF_WEEK.map((day) => ({
      day,
      total: dayTotals.get(day) ?? 0,
    })),
  };
}
