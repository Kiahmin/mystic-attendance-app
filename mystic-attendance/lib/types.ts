export type UserRole = "admin" | "coach";

export type AttendanceStatus = "present" | "absent" | "no_show";

export type AttendeeSource = "enrolled" | "one_off" | "walk_in";

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

export interface Venue {
  id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
}

export type VenueRef = Pick<Venue, "id" | "name">;

export type PayerKind = "person" | "company";

export interface Payer {
  id: string;
  kind: PayerKind;
  display_name: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
}

export type PayerRef = Pick<Payer, "id" | "kind" | "display_name" | "phone">;

export interface ClassGroup {
  id: string;
  name: string;
  venue_id: string | null;
  venue: VenueRef | null;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  coach_id: string | null;
  is_active: boolean;
}

export type SessionKind = "class" | "event";

export interface Session {
  id: string;
  class_id: string | null;
  kind: SessionKind;
  name: string | null;
  requires_attendance: boolean;
  session_date: string;
  venue_id: string | null;
  venue: VenueRef | null;
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
  payer_id: string | null;
  payer?: PayerRef | null;
  skill_level: SkillLevel | null;
  notes: string | null;
  is_trial: boolean;
  archived_at: string | null;
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

export type StudentRosterClass = Pick<
  ClassGroup,
  "id" | "name" | "venue_id" | "venue" | "day_of_week" | "start_time"
>;

export type StudentRosterPackage = {
  remaining_credits: number;
  total_credits: number;
  used_credits: number;
  bonus_credits: number;
  status: PackageStatus;
  expires_at: string | null;
  first_lesson_date: string | null;
  package_products: Pick<
    PackageProduct,
    "product_type" | "label" | "total_credits"
  > | null;
  sessions: Pick<Session, "name" | "session_date"> | null;
};

export interface StudentListItem extends Student {
  enrolment_count: number;
  created_at: string;
  last_attended_on: string | null;
  class_ids: string[];
  classes: StudentRosterClass[];
  roster_package: StudentRosterPackage | null;
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
  | "trial_private"
  | "event";

export interface PackageProduct {
  id: string;
  product_type: PackageProductType;
  label: string;
  total_credits: number;
  amount_sgd: number;
  is_active: boolean;
  sort_order: number;
}

export type PackageSession = Pick<Session, "id" | "name" | "session_date">;

export type PackageMember = Pick<Student, "id" | "full_name">;

export interface Package {
  id: string;
  student_id: string;
  members: PackageMember[];
  payer_id: string | null;
  payer?: PayerRef | null;
  package_product_id: string | null;
  session_id: string | null;
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
  informed_at: string | null;
  status: PackageStatus;
  created_at: string;
  package_products?: PackageProduct | null;
  sessions?: PackageSession | null;
}

export interface PackageWithStudent extends Package {
  students: Pick<Student, "id" | "full_name" | "contact_phone" | "payer_id">;
}

export interface Attendance {
  id: string;
  session_id: string;
  student_id: string;
  status: AttendanceStatus | null;
  attendee_source: AttendeeSource;
  decline_reason: string | null;
  deduct_credit: boolean;
  package_id: string | null;
  marked_by: string | null;
  marked_at: string | null;
}

/** One attendance row flattened for the student attendance history table. */
export interface StudentAttendanceEntry {
  id: string;
  status: AttendanceStatus | null;
  attendeeSource: AttendeeSource;
  decline_reason: string | null;
  deduct_credit: boolean;
  package_id: string | null;
  marked_at: string | null;
  sessionId: string;
  sessionDate: string;
  sessionKind: SessionKind;
  sessionName: string;
  startTime: string;
  coachName: string | null;
  markedByName: string | null;
  packageName: string | null;
}

export interface SessionWithClass extends Session {
  classes: (ClassGroup & {
    coach?: Pick<Profile, "id" | "full_name"> | null;
  }) | null;
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
