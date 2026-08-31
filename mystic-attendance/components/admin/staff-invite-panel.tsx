"use client";

import { useActionState, useEffect, useState } from "react";
import { inviteStaff } from "@/lib/actions/staff";
import type { StaffListItem } from "@/lib/queries/profiles";
import type { UserRole } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super-admin",
  admin: "Admin",
  coach: "Coach",
};

export function StaffInvitePanel({ staff }: { staff: StaffListItem[] }) {
  const [state, formAction, pending] = useActionState(inviteStaff, null);
  const [role, setRole] = useState<"coach" | "admin">("coach");

  useEffect(() => {
    if (state?.success) {
      setRole("coach");
    }
  }, [state?.success]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Invite staff</CardTitle>
          <CardDescription>
            They will receive an email to set their own password. You can invite
            them as a coach or an admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            key={state?.success ?? "form"}
            action={formAction}
            className="grid gap-4 sm:grid-cols-2"
          >
            <input type="hidden" name="role" value={role} />

            {state?.error ? (
              <Alert variant="destructive" className="sm:col-span-2">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            ) : null}
            {state?.success ? (
              <Alert className="sm:col-span-2">
                <AlertDescription>{state.success}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                name="full_name"
                autoComplete="name"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => {
                  if (value === "coach" || value === "admin") setRole(value);
                }}
              >
                <SelectTrigger id="role" className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button type="submit" className="h-11 w-full sm:w-auto" disabled={pending}>
                {pending ? "Sending…" : "Send invite"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Name
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Email
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {staff.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-muted-foreground">
                  No staff accounts yet.
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr key={member.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{member.full_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {member.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">{ROLE_LABELS[member.role]}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
