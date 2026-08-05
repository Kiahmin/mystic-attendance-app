"use server";

import { markWalkIn as markWalkInAction } from "@/lib/actions/attendance";
import { searchStudents } from "@/lib/queries/sessions";

export async function searchStudentsForWalkIn(query: string) {
  return searchStudents(query);
}

export async function markWalkIn(
  sessionId: string,
  studentId: string,
  walkInStatus: "admitted" | "declined",
  declineReason?: string
) {
  return markWalkInAction(sessionId, studentId, walkInStatus, declineReason);
}
