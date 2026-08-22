"use server";

import { emptyToNull } from "@/lib/admin-utils";
import { requireRole } from "@/lib/auth/profile";
import { eventPackageExpiresAt, PAYMENT_METHODS } from "@/lib/package-utils";
import { loadEffectiveSessionRosterStudents } from "@/lib/session-roster";
import type { SessionRosterStudent } from "@/lib/session-roster";
import { getEventPackageProduct } from "@/lib/queries/packages";
import { searchStudents } from "@/lib/queries/sessions";
import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod, SessionKind } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { revalidateSessionAttendance } from "@/lib/revalidate-session";

function revalidateAttendeePaths(sessionId: string, studentId?: string) {
  revalidateSessionAttendance(sessionId);
  revalidatePath("/admin/packages");
  if (studentId) {
    revalidatePath(`/admin/students/${studentId}`);
  }
}

type SessionRow = {
  id: string;
  class_id: string | null;
  kind: SessionKind;
  cancelled: boolean;
  requires_attendance: boolean;
};

function isTakeAttendanceEvent(session: SessionRow): boolean {
  return session.kind === "event" && session.requires_attendance;
}

async function findEnrolment(
  supabase: SupabaseClient,
  classId: string | null,
  studentId: string
) {
  if (!classId) return null;
  const { data } = await supabase
    .from("enrolments")
    .select("id")
    .eq("class_id", classId)
    .eq("student_id", studentId)
    .maybeSingle();
  return data;
}

async function loadSessionOrError(
  sessionId: string
): Promise<
  | { ok: true; session: SessionRow; supabase: SupabaseClient }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const { data: session, error } = await supabase
    .from("sessions")
    .select("id, class_id, kind, cancelled, requires_attendance")
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    return { ok: false, error: "Session not found." };
  }

  return {
    ok: true,
    session: {
      id: session.id as string,
      class_id: (session.class_id as string | null) ?? null,
      kind: (session.kind as SessionKind) ?? "class",
      cancelled: Boolean(session.cancelled),
      requires_attendance: session.requires_attendance !== false,
    },
    supabase,
  };
}

export type EventPackageInput = {
  amountSgd: number;
  isPaid?: boolean;
  paymentMethod?: PaymentMethod | null;
  notes?: string | null;
};

async function ensureEventPackage(
  supabase: SupabaseClient,
  sessionId: string,
  studentId: string,
  input: EventPackageInput
): Promise<{ error?: string }> {
  const { data: existing, error: existingError } = await supabase
    .from("packages")
    .select("id")
    .eq("student_id", studentId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (existingError) return { error: existingError.message };
  if (existing) return {};

  const product = await getEventPackageProduct();
  if (!product) {
    return { error: "Event package product is not available." };
  }

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("session_date")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session?.session_date) {
    return { error: "Session not found." };
  }

  const isPaid = Boolean(input.isPaid);
  const { data: created, error } = await supabase
    .from("packages")
    .insert({
      student_id: studentId,
      package_product_id: product.id,
      session_id: sessionId,
      total_credits: 1,
      bonus_credits: 0,
      is_paid: isPaid,
      payment_method: isPaid ? input.paymentMethod : null,
      amount_sgd: input.amountSgd,
      expires_at: eventPackageExpiresAt(session.session_date as string),
      customisation_notes: emptyToNull(input.notes),
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  if (isPaid && created?.id) {
    const { error: backfillError } = await supabase.rpc(
      "backfill_uncharged_attendance",
      { p_package_id: created.id }
    );
    if (backfillError) {
      return {
        error: `The student was added, but uncharged attendance could not be applied: ${backfillError.message}`,
      };
    }
  }

  return {};
}

async function deleteUnusedEventPackage(
  supabase: SupabaseClient,
  sessionId: string,
  studentId: string
): Promise<{ error?: string }> {
  const { data: pkg, error: pkgError } = await supabase
    .from("packages")
    .select("id, is_paid, used_credits")
    .eq("student_id", studentId)
    .eq("session_id", sessionId)
    .maybeSingle();

  if (pkgError) return { error: pkgError.message };
  if (!pkg) return {};
  if (pkg.is_paid || Number(pkg.used_credits) > 0) return {};

  const { data: attendance, error: attendanceError } = await supabase
    .from("attendance")
    .select("id")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (attendanceError) return { error: attendanceError.message };
  if (attendance) return {};

  const { error } = await supabase.from("packages").delete().eq("id", pkg.id);
  if (error) return { error: error.message };
  return {};
}

export async function getSessionAttendeesForEditor(
  sessionId: string
): Promise<
  | { attendees: SessionRosterStudent[]; cancelled: boolean }
  | { error: string }
> {
  await requireRole(["admin", "coach"]);
  const loaded = await loadSessionOrError(sessionId);
  if (!loaded.ok) return { error: loaded.error };

  const { session, supabase } = loaded;
  try {
    const attendees = await loadEffectiveSessionRosterStudents(
      supabase,
      session.id,
      session.class_id
    );
    return { attendees, cancelled: session.cancelled };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to load attendees.",
    };
  }
}

export async function searchStudentsForSessionAttendees(query: string) {
  await requireRole(["admin", "coach"]);
  return searchStudents(query);
}

/**
 * Add a non-enrolled student for this session only.
 * If they were previously excluded (enrolled), clearing the exclude restores them.
 */
export async function includeStudentInSession(
  sessionId: string,
  studentId: string,
  options?: EventPackageInput
): Promise<{ success: true } | { error: string }> {
  const profile = await requireRole(["admin", "coach"]);

  if (!sessionId || !studentId) {
    return { error: "Session and student are required." };
  }

  const loaded = await loadSessionOrError(sessionId);
  if (!loaded.ok) return { error: loaded.error };
  const { session, supabase } = loaded;

  if (session.cancelled) {
    return { error: "Cannot edit attendees on a cancelled session." };
  }

  if (session.requires_attendance === false) {
    return { error: "Attendance is not taken for this event." };
  }

  let eventPackage: EventPackageInput | null = null;
  if (isTakeAttendanceEvent(session)) {
    const amount = options?.amountSgd;
    if (amount == null || Number.isNaN(amount) || amount < 0) {
      return { error: "Enter a valid amount in SGD." };
    }
    const isPaid = Boolean(options?.isPaid);
    if (isPaid) {
      const method = options?.paymentMethod ?? null;
      if (!method || !PAYMENT_METHODS.includes(method)) {
        return { error: "Payment method is required for paid packages." };
      }
    }
    eventPackage = {
      amountSgd: amount,
      isPaid,
      paymentMethod: isPaid ? options?.paymentMethod : null,
      notes: options?.notes ?? null,
    };
  }

  const enrolment = await findEnrolment(supabase, session.class_id, studentId);

  const { data: existing } = await supabase
    .from("session_attendee_overrides")
    .select("id, kind")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (enrolment) {
    if (existing?.kind === "exclude") {
      const { error } = await supabase
        .from("session_attendee_overrides")
        .delete()
        .eq("id", existing.id);
      if (error) return { error: error.message };
      revalidateAttendeePaths(sessionId, studentId);
      return { success: true };
    }
    return { error: "Student is already on the class roster for this session." };
  }

  if (existing?.kind === "include") {
    return { error: "Student is already added to this session." };
  }

  if (existing) {
    const { error } = await supabase
      .from("session_attendee_overrides")
      .update({ kind: "include", created_by: profile.id })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("session_attendee_overrides").insert({
      session_id: sessionId,
      student_id: studentId,
      kind: "include",
      created_by: profile.id,
    });
    if (error) return { error: error.message };
  }

  if (eventPackage) {
    const packResult = await ensureEventPackage(
      supabase,
      sessionId,
      studentId,
      eventPackage
    );
    if (packResult.error) {
      await supabase
        .from("session_attendee_overrides")
        .delete()
        .eq("session_id", sessionId)
        .eq("student_id", studentId);
      return { error: packResult.error };
    }
  }

  revalidateAttendeePaths(sessionId, studentId);
  return { success: true };
}

/**
 * Remove from this session only:
 * - enrolled → write exclude
 * - one-off include → delete include
 */
export async function excludeStudentFromSession(
  sessionId: string,
  studentId: string
): Promise<{ success: true } | { error: string }> {
  const profile = await requireRole(["admin", "coach"]);

  if (!sessionId || !studentId) {
    return { error: "Session and student are required." };
  }

  const loaded = await loadSessionOrError(sessionId);
  if (!loaded.ok) return { error: loaded.error };
  const { session, supabase } = loaded;

  if (session.cancelled) {
    return { error: "Cannot edit attendees on a cancelled session." };
  }

  if (session.requires_attendance === false) {
    return { error: "Attendance is not taken for this event." };
  }

  const enrolment = await findEnrolment(supabase, session.class_id, studentId);

  const { data: existing } = await supabase
    .from("session_attendee_overrides")
    .select("id, kind")
    .eq("session_id", sessionId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (existing?.kind === "include") {
    const { error } = await supabase
      .from("session_attendee_overrides")
      .delete()
      .eq("id", existing.id);
    if (error) return { error: error.message };
    if (isTakeAttendanceEvent(session)) {
      const packResult = await deleteUnusedEventPackage(
        supabase,
        sessionId,
        studentId
      );
      if (packResult.error) return { error: packResult.error };
    }
    revalidateAttendeePaths(sessionId, studentId);
    return { success: true };
  }

  if (!enrolment) {
    return { error: "Student is not on this session’s expected roster." };
  }

  if (existing?.kind === "exclude") {
    return { error: "Student is already excluded from this session." };
  }

  if (existing) {
    const { error } = await supabase
      .from("session_attendee_overrides")
      .update({ kind: "exclude", created_by: profile.id })
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("session_attendee_overrides").insert({
      session_id: sessionId,
      student_id: studentId,
      kind: "exclude",
      created_by: profile.id,
    });
    if (error) return { error: error.message };
  }

  revalidateAttendeePaths(sessionId);
  return { success: true };
}

/** Restore class default for this student on this session (delete override). */
export async function clearSessionAttendeeOverride(
  sessionId: string,
  studentId: string
): Promise<{ success: true } | { error: string }> {
  await requireRole(["admin", "coach"]);

  if (!sessionId || !studentId) {
    return { error: "Session and student are required." };
  }

  const loaded = await loadSessionOrError(sessionId);
  if (!loaded.ok) return { error: loaded.error };
  const { session, supabase } = loaded;

  if (session.cancelled) {
    return { error: "Cannot edit attendees on a cancelled session." };
  }

  if (session.requires_attendance === false) {
    return { error: "Attendance is not taken for this event." };
  }

  const { error } = await supabase
    .from("session_attendee_overrides")
    .delete()
    .eq("session_id", sessionId)
    .eq("student_id", studentId);

  if (error) return { error: error.message };

  revalidateAttendeePaths(sessionId);
  return { success: true };
}
