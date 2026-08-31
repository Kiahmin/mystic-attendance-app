import { requireRole } from "@/lib/auth/profile";
import { listStaff } from "@/lib/queries/profiles";
import { StaffInvitePanel } from "@/components/admin/staff-invite-panel";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminStaffPage() {
  await requireRole(["super_admin"]);
  const staff = await listStaff();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff"
        description="Invite coaches and admins. Only super-admins can send invites."
      />
      <StaffInvitePanel staff={staff} />
    </div>
  );
}
