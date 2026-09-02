import { getProfile, getSessionUser } from "@/lib/auth/profile";
import { isAdminRole } from "@/lib/auth/roles";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { CircleAlert } from "lucide-react";

export default async function CoachUnavailablePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile();
  if (profile && isAdminRole(profile.role)) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md rounded-xl">
        <CardHeader className="space-y-3">
          <div
            className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground"
            aria-hidden
          >
            <CircleAlert className="size-5" />
          </div>
          <CardTitle className="font-heading text-xl">
            Coach access isn’t available
          </CardTitle>
          <CardDescription>
            The coach app isn’t open yet. Sign in with an admin account, or ask
            a super-admin if you need office access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signOut}>
            <Button type="submit" variant="outline" className="w-full sm:w-auto">
              Sign out
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
