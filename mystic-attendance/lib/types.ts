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

export type SkillLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "freestyle";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

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
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  coach_id: string | null;
  is_active: boolean;
}

export interface Session {
  id: string;
  class_id: string;
  session_date: string;
  coach_id: string | null;
  start_time: string | null;
  end_time: string | null;
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
  skill_level: SkillLevel | null;
  notes: string | null;
  is_trial: boolean;
}

export type StudentSearchHit = Pick<
  Student,
  "id" | "full_name" | "skill_level" | "is_trial"
>;

export interface Enrolment {
  id: string;
  student_id: string;
  class_id: string;
  enrolled_at: string;
}

export interface EnrolmentWithClass extends Enrolment {
  classes: ClassGroup;
}

export interface StudentWithEnrolments extends Student {
  enrolments: EnrolmentWithClass[];
}

export interface StudentListItem extends Student {
  enrolment_count: number;
}

export interface ClassWithCoach extends ClassGroup {
  coach: Pick<Profile, "id" | "full_name"> | null;
  enrolment_count: number;
}

export interface EnrolmentWithStudent extends Enrolment {
  students: Student;
}

export interface ClassDetail extends ClassWithCoach {
  enrolments: EnrolmentWithStudent[];
}

export type PaymentMethod = "cash" | "bank_transfer" | "paynow";

export type PackageProductType =
  | "group"
  | "freestyle"
  | "private"
  | "trial_group"
  | "trial_private";

export interface PackageProduct {
  id: string;
  product_type: PackageProductType;
  label: string;
  total_credits: number;
  amount_sgd: number;
  is_active: boolean;
  sort_order: number;
}

export interface Package {
  id: string;
  student_id: string;
  package_product_id: string | null;
  total_credits: number;
  used_credits: number;
  remaining_credits: number;
  bonus_credits: number;
  customisation_notes: string | null;
  forfeited_credits: number | null;
  forfeited_at: string | null;
  payment_method: PaymentMethod | null;
  amount_sgd: number | null;
  is_paid: boolean;
  first_lesson_date: string | null;
  expires_at: string | null;
  paused_at: string | null;
  pause_ends_at: string | null;
  paused_reason: string | null;
  resumed_at: string | null;
  pause_used: boolean;
  status: PackageStatus;
  created_at: string;
  package_products?: PackageProduct | null;
}

export interface PackageWithStudent extends Package {
  students: Pick<Student, "id" | "full_name" | "contact_phone">;
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
  classes: ClassGroup & {
    coach?: Pick<Profile, "id" | "full_name"> | null;
  };
  coach?: Pick<Profile, "id" | "full_name"> | null;
}

export type CheckInRosterSource = "enrolled" | "include" | "former";

export interface CheckInStudent {
  student: Student;
  attendance: Attendance | null;
  package: Package | null;
  chargeablePackageId: string | null;
  isWalkIn: boolean;
  /** Present for expected roster rows and former recorded attendees; null for walk-ins. */
  rosterSource: CheckInRosterSource | null;
}

export interface DashboardSession {
  session: SessionWithClass;
  expectedCount: number;
  checkedInCount: number;
  packageAlerts: number;
  coachName: string | null;
}
