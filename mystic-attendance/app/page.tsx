import {
  getProfile,
  getSessionUser,
  homePathForRole,
  isStaffRole,
} from "@/lib/auth/profile";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "@/lib/actions/auth";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile();

  if (!profile || !isStaffRole(profile.role)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
            <CardDescription>
              Only Mystic Skates staff accounts can use this app. Contact an
              admin if you need access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={signOut}>
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
            <Button asChild variant="link" className="h-auto p-0">
              <Link href="/auth/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  redirect(homePathForRole(profile.role));
}
