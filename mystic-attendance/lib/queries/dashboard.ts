import { createClient } from "@/lib/supabase/server";
import { DAYS_OF_WEEK, isInactiveForSixMonths } from "@/lib/admin-utils";
import {
  endOfMonth,
  startOfMonth,
  weekdayOfCalendarDate,
} from "@/lib/datetime";
import { packageLabel, LOW_CREDIT_THRESHOLD, packageStudentNames } from "@/lib/package-utils";
import type {
  ClassGroup,
  DayOfWeek,
  PackageProduct,
  PackageSession,
  PackageStatus,
  Student,
  VenueRef,
} from "@/lib/types";
import { mapVenueRef, venueName } from "@/lib/venue-utils";

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
  status: PackageStatus;
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
  overshotCount: number;
  monthCheckInCount: number;
  dueSoon: DashboardQueueItem[];
  informed: DashboardQueueItem[];
  overshot: DashboardQueueItem[];
  monthlyByVenue: MonthlyVenueCheckIns[];
  monthlyByDay: MonthlyDayCheckIns[];
};

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

const DASHBOARD_QUEUE_SELECT = `
          id,
          student_id,
          remaining_credits,
          total_credits,
          used_credits,
          bonus_credits,
          status,
          first_lesson_date,
          created_at,
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
          students!packages_student_id_fkey!inner (
            id,
            full_name,
            created_at,
            archived_at
          ),
          package_students (
            student_id,
            students!package_students_student_id_fkey (
              id,
              full_name,
              created_at
            )
          )
        `;

function membersHaveRenewal(
  memberIds: string[],
  currentPackageId: string,
  packages: Array<{
    id: string;
    memberIds: string[];
    status: PackageStatus;
    remaining_credits: number;
  }>
): boolean {
  const members = new Set(memberIds);
  return packages.some(
    (pkg) =>
      pkg.id !== currentPackageId &&
      pkg.status === "active" &&
      pkg.remaining_credits > LOW_CREDIT_THRESHOLD &&
      pkg.memberIds.some((id) => members.has(id))
  );
}

function packRecencyKey(firstLessonDate: string | null, createdAt: string): string {
  return `${firstLessonDate ?? createdAt.slice(0, 10)}T${createdAt}`;
}

function membersHaveLaterClassPackage(
  memberIds: string[],
  currentPackageId: string,
  currentRecency: string,
  packages: Array<{
    id: string;
    memberIds: string[];
    recency: string;
  }>
): boolean {
  const members = new Set(memberIds);
  return packages.some(
    (pkg) =>
      pkg.id !== currentPackageId &&
      pkg.recency > currentRecency &&
      pkg.memberIds.some((id) => members.has(id))
  );
}

export async function getDashboardOperations(
  reportMonth: string
): Promise<DashboardOperations> {
  const supabase = await createClient();
  const monthStart = startOfMonth(`${reportMonth}-01`);
  const monthEnd = endOfMonth(monthStart);

  const [
    activeResult,
    exhaustedResult,
    queueResult,
    exhaustedQueueResult,
    overshotResult,
    sessionsResult,
    renewalResult,
    openSuccessorResult,
  ] =
    await Promise.all([
      supabase
        .from("packages")
        .select("id, students!packages_student_id_fkey!inner(archived_at)", {
          count: "exact",
          head: true,
        })
        .is("session_id", null)
        .eq("status", "active")
        .is("students.archived_at", null),
      supabase
        .from("packages")
        .select("id, students!packages_student_id_fkey!inner(archived_at)", {
          count: "exact",
          head: true,
        })
        .is("session_id", null)
        .eq("status", "exhausted")
        .is("students.archived_at", null),
      supabase
        .from("packages")
        .select(DASHBOARD_QUEUE_SELECT)
        .is("session_id", null)
        .eq("status", "active")
        .gt("remaining_credits", 0)
        .or(
          `remaining_credits.lte.${LOW_CREDIT_THRESHOLD},informed_at.not.is.null`
        )
        .is("students.archived_at", null),
      supabase
        .from("packages")
        .select(DASHBOARD_QUEUE_SELECT)
        .is("session_id", null)
        .eq("status", "exhausted")
        .is("students.archived_at", null),
      supabase
        .from("packages")
        .select(DASHBOARD_QUEUE_SELECT)
        .is("session_id", null)
        .eq("status", "overshot")
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
          venue_id,
          venues (id, name),
          classes (
            id,
            name,
            venue_id,
            venues (id, name)
          )
        `
        )
        .gte("session_date", monthStart)
        .lte("session_date", monthEnd)
        .eq("cancelled", false),
      supabase
        .from("packages")
        .select(
          `
          id,
          remaining_credits,
          status,
          first_lesson_date,
          created_at,
          students!packages_student_id_fkey!inner (
            id,
            archived_at
          ),
          package_students (
            student_id
          )
        `
        )
        .is("session_id", null)
        .eq("status", "active")
        .gt("remaining_credits", LOW_CREDIT_THRESHOLD)
        .is("students.archived_at", null),
      supabase
        .from("packages")
        .select(
          `
          id,
          remaining_credits,
          status,
          first_lesson_date,
          created_at,
          students!packages_student_id_fkey!inner (
            id,
            archived_at
          ),
          package_students (
            student_id
          )
        `
        )
        .is("session_id", null)
        .in("status", ["paused", "unpaid"])
        .is("students.archived_at", null),
    ]);

  if (activeResult.error) {
    throw new Error(
      [activeResult.error.message, activeResult.error.hint, activeResult.error.details, activeResult.error.code]
        .filter(Boolean)
        .join(" — ") || "Failed to load active packages"
    );
  }
  if (exhaustedResult.error) {
    throw new Error(
      [exhaustedResult.error.message, exhaustedResult.error.hint, exhaustedResult.error.details, exhaustedResult.error.code]
        .filter(Boolean)
        .join(" — ") || "Failed to load exhausted packages"
    );
  }
  if (queueResult.error) {
    throw new Error(
      [queueResult.error.message, queueResult.error.hint, queueResult.error.details, queueResult.error.code]
        .filter(Boolean)
        .join(" — ") || "Failed to load package queue"
    );
  }
  if (exhaustedQueueResult.error) {
    throw new Error(
      [
        exhaustedQueueResult.error.message,
        exhaustedQueueResult.error.hint,
        exhaustedQueueResult.error.details,
        exhaustedQueueResult.error.code,
      ]
        .filter(Boolean)
        .join(" — ") || "Failed to load exhausted packages for queue"
    );
  }
  if (overshotResult.error) {
    throw new Error(
      [overshotResult.error.message, overshotResult.error.hint, overshotResult.error.details, overshotResult.error.code]
        .filter(Boolean)
        .join(" — ") || "Failed to load overshot packages"
    );
  }
  if (sessionsResult.error) {
    throw new Error(
      [sessionsResult.error.message, sessionsResult.error.hint, sessionsResult.error.details, sessionsResult.error.code]
        .filter(Boolean)
        .join(" — ") || "Failed to load month sessions"
    );
  }
  if (renewalResult.error) {
    throw new Error(
      [renewalResult.error.message, renewalResult.error.hint, renewalResult.error.details, renewalResult.error.code]
        .filter(Boolean)
        .join(" — ") || "Failed to load renewal packages"
    );
  }
  if (openSuccessorResult.error) {
    throw new Error(
      [
        openSuccessorResult.error.message,
        openSuccessorResult.error.hint,
        openSuccessorResult.error.details,
        openSuccessorResult.error.code,
      ]
        .filter(Boolean)
        .join(" — ") || "Failed to load later packages"
    );
  }

  type QueueStudent = Pick<Student, "id" | "full_name"> & { created_at: string };

  type QueueRow = {
    id: string;
    student_id: string;
    remaining_credits: number;
    total_credits: number;
    used_credits: number;
    bonus_credits: number | null;
    status: PackageStatus;
    first_lesson_date: string | null;
    created_at: string;
    informed_at: string | null;
    session_id: string | null;
    package_products:
      | Pick<PackageProduct, "product_type" | "label" | "total_credits">
      | Pick<PackageProduct, "product_type" | "label" | "total_credits">[]
      | null;
    sessions: PackageSession | PackageSession[] | null;
    students: QueueStudent | QueueStudent[] | null;
    package_students?:
      | {
          student_id: string;
          students?: QueueStudent | QueueStudent[] | null;
        }
      | {
          student_id: string;
          students?: QueueStudent | QueueStudent[] | null;
        }[]
      | null;
  };

  type QueueMember = QueueStudent;

  const queuePackages = (queueResult.data ?? []) as QueueRow[];
  const exhaustedQueueRows = (exhaustedQueueResult.data ?? []) as QueueRow[];
  const overshotRows = (overshotResult.data ?? []) as QueueRow[];

  function queueMembers(pkg: QueueRow): QueueMember[] {
    const nested = Array.isArray(pkg.package_students)
      ? pkg.package_students
      : pkg.package_students
        ? [pkg.package_students]
        : [];
    const members = nested
      .map((row) => asSingle(row.students))
      .filter((item): item is QueueMember => Boolean(item));
    const primary = asSingle(pkg.students);
    if (primary && !members.some((member) => member.id === primary.id)) {
      members.unshift(primary);
    }
    return members;
  }

  type SuccessorRow = {
    id: string;
    remaining_credits: number;
    status: PackageStatus;
    first_lesson_date: string | null;
    created_at: string;
    students: Pick<Student, "id"> | Pick<Student, "id">[] | null;
    package_students?:
      | { student_id: string }
      | { student_id: string }[]
      | null;
  };

  function successorMembers(pkg: SuccessorRow | QueueRow): string[] {
    const nested = Array.isArray(pkg.package_students)
      ? pkg.package_students
      : pkg.package_students
        ? [pkg.package_students]
        : [];
    const memberIds = nested.map((row) => row.student_id);
    const primary = asSingle(pkg.students);
    if (primary && !memberIds.includes(primary.id)) {
      memberIds.unshift(primary.id);
    }
    return memberIds;
  }

  function toSuccessor(pkg: SuccessorRow | QueueRow) {
    return {
      id: pkg.id,
      memberIds: successorMembers(pkg),
      status: pkg.status,
      remaining_credits: Number(pkg.remaining_credits),
      recency: packRecencyKey(pkg.first_lesson_date, pkg.created_at),
    };
  }

  const renewalSource = ((renewalResult.data ?? []) as SuccessorRow[]).map(
    toSuccessor
  );

  const successorById = new Map<
    string,
    ReturnType<typeof toSuccessor>
  >();
  for (const pkg of [
    ...renewalSource,
    ...((openSuccessorResult.data ?? []) as SuccessorRow[]).map(toSuccessor),
    ...queuePackages.map(toSuccessor),
    ...exhaustedQueueRows.map(toSuccessor),
    ...overshotRows.map(toSuccessor),
  ]) {
    successorById.set(pkg.id, pkg);
  }
  const successorSource = [...successorById.values()];

  function withoutRenewal(pkg: QueueRow): boolean {
    return !membersHaveRenewal(
      queueMembers(pkg).map((member) => member.id),
      pkg.id,
      renewalSource
    );
  }

  function withoutLaterClassPackage(pkg: QueueRow): boolean {
    return !membersHaveLaterClassPackage(
      queueMembers(pkg).map((member) => member.id),
      pkg.id,
      packRecencyKey(pkg.first_lesson_date, pkg.created_at),
      successorSource
    );
  }

  const dueSoonRows = [
    ...queuePackages.filter(
      (pkg) =>
        Number(pkg.remaining_credits) <= LOW_CREDIT_THRESHOLD &&
        !pkg.informed_at &&
        withoutRenewal(pkg)
    ),
    ...exhaustedQueueRows.filter(
      (pkg) =>
        !pkg.informed_at &&
        withoutRenewal(pkg) &&
        withoutLaterClassPackage(pkg)
    ),
  ];
  const pendingOvershotRows = overshotRows.filter((pkg) => !pkg.informed_at);
  const informedRows = [
    ...queuePackages.filter(
      (pkg) =>
        Boolean(pkg.informed_at) &&
        Number(pkg.remaining_credits) > 0 &&
        withoutRenewal(pkg)
    ),
    ...exhaustedQueueRows.filter(
      (pkg) => Boolean(pkg.informed_at) && withoutRenewal(pkg)
    ),
    ...overshotRows.filter(
      (pkg) => Boolean(pkg.informed_at) && withoutRenewal(pkg)
    ),
  ];

  const studentIds = [
    ...new Set(
      [...dueSoonRows, ...informedRows, ...pendingOvershotRows].flatMap((pkg) =>
        queueMembers(pkg).map((member) => member.id)
      )
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

  function exhaustedMembersInactive(pkg: QueueRow): boolean {
    const members = queueMembers(pkg);
    return (
      members.length > 0 &&
      members.every((member) =>
        isInactiveForSixMonths(
          lastAttendedByStudent.get(member.id) ?? null,
          member.created_at
        )
      )
    );
  }

  function memberSetKey(pkg: QueueRow): string {
    return (
      queueMembers(pkg)
        .map((member) => member.id)
        .sort()
        .join(",") || pkg.student_id
    );
  }

  function packRecency(pkg: QueueRow): string {
    return packRecencyKey(pkg.first_lesson_date, pkg.created_at);
  }

  function preferCurrentDueSoon(a: QueueRow, b: QueueRow): QueueRow {
    const aFinishing = a.status === "active";
    const bFinishing = b.status === "active";
    if (aFinishing !== bFinishing) return aFinishing ? a : b;
    return packRecency(a) >= packRecency(b) ? a : b;
  }

  function latestDueSoonPerMembers(rows: QueueRow[]): QueueRow[] {
    const best = new Map<string, QueueRow>();
    for (const pkg of rows) {
      const key = memberSetKey(pkg);
      const current = best.get(key);
      best.set(key, current ? preferCurrentDueSoon(current, pkg) : pkg);
    }
    return [...best.values()];
  }

  function toQueueItem(pkg: QueueRow): DashboardQueueItem {
    const student = asSingle(pkg.students);
    const product = asSingle(pkg.package_products);
    const session = asSingle(pkg.sessions);
    const members = queueMembers(pkg);
    const classIds = [
      ...new Set(members.flatMap((member) => classIdsByStudent.get(member.id) ?? [])),
    ];
    const classNames = [
      ...new Set(
        members.flatMap((member) => classNamesByStudent.get(member.id) ?? [])
      ),
    ];
    const lastAttendedOn =
      members
        .map((member) => lastAttendedByStudent.get(member.id) ?? null)
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1) ?? null;
    return {
      packageId: pkg.id,
      studentId: pkg.student_id,
      studentName: packageStudentNames(
        { student_id: pkg.student_id, members },
        student?.full_name
      ),
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
      lastAttendedOn,
      classIds,
      classNames,
      informedAt: pkg.informed_at,
      status: pkg.status,
    };
  }

  const dueSoon = latestDueSoonPerMembers(
    dueSoonRows.filter(
      (pkg) => pkg.status !== "exhausted" || !exhaustedMembersInactive(pkg)
    )
  )
    .map(toQueueItem)
    .sort((a, b) => a.studentName.localeCompare(b.studentName));
  const informed = informedRows
    .map(toQueueItem)
    .sort((a, b) => (b.informedAt ?? "").localeCompare(a.informedAt ?? ""));
  const overshot = pendingOvershotRows
    .map(toQueueItem)
    .sort((a, b) => a.remainingCredits - b.remainingCredits);

  type MonthSession = {
    id: string;
    session_date: string;
    cancelled: boolean;
    class_id: string | null;
    kind: string | null;
    name: string | null;
    venue_id: string | null;
    venues: VenueRef | VenueRef[] | null;
    classes:
      | (Pick<ClassGroup, "id" | "name" | "venue_id"> & {
          venues?: VenueRef | VenueRef[] | null;
        })
      | (Pick<ClassGroup, "id" | "name" | "venue_id"> & {
          venues?: VenueRef | VenueRef[] | null;
        })[]
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
      .select("session_id")
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
      venueName(mapVenueRef(session.venues)) ||
      venueName(mapVenueRef(classRow?.venues)) ||
      "Unspecified";
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
    overshotCount: overshot.length,
    monthCheckInCount: presentCount,
    dueSoon,
    informed,
    overshot,
    monthlyByVenue,
    monthlyByDay: DAYS_OF_WEEK.map((day) => ({
      day,
      total: dayTotals.get(day) ?? 0,
    })),
  };
}
