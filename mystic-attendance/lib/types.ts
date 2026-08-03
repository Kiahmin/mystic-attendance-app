export type UserRole = "admin" | "coach";

export type AttendanceStatus =
  | "present"
  | "absent"
  | "no_show"
  | "cancelled_valid"
  | "cancelled_late"
  | "session_cancelled"
  | "complimentary"
  | "walk_in";

export type WalkInStatus = "admitted" | "declined";

export type PackageStatus =
  | "unpaid"
  | "active"
  | "paused"
  | "expired"
  | "exhausted";

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  phone: string | null;
  created_at: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  day_of_week: "saturday" | "sunday";
  start_time: string;
  end_time: string;
  coach_id: string | null;
  is_active: boolean;
}

export interface Session {
  id: string;
  class_id: string;
  session_date: string;
  cancelled: boolean;
  cancellation_reason: string | null;
  cancellation_note: string | null;
  cancelled_by: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  is_minor: boolean;
  guardian_name: string | null;
  guardian_phone: string | null;
  contact_phone: string | null;
  skill_level: string | null;
  notes: string | null;
}

export interface Package {
  id: string;
  student_id: string;
  total_credits: number;
  used_credits: number;
  remaining_credits: number;
  is_paid: boolean;
  first_lesson_date: string | null;
  expires_at: string | null;
  status: PackageStatus;
}

export interface Attendance {
  id: string;
  session_id: string;
  student_id: string;
  status: AttendanceStatus | null;
  walk_in_status: WalkInStatus | null;
  decline_reason: string | null;
  deduct_credit: boolean;
  package_id: string | null;
  marked_by: string | null;
  marked_at: string | null;
}

export interface SessionWithClass extends Session {
  classes: ClassGroup;
}

export interface CheckInStudent {
  student: Student;
  attendance: Attendance | null;
  package: Package | null;
  chargeablePackageId: string | null;
  isWalkIn: boolean;
}

export interface DashboardSession {
  session: SessionWithClass;
  expectedCount: number;
  checkedInCount: number;
  packageAlerts: number;
}
