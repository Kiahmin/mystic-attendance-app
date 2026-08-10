import {
  getProfile,
  getSessionUser,
  homePathForRole,
  isStaffRole,
} from "@/lib/auth/profile";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile();

  if (!profile || !isStaffRole(profile.role)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <Card className="w-full max-w-md rounded-xl">
          <CardHeader>
            <CardTitle className="font-heading">Access denied</CardTitle>
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
            <Link
              href="/auth/login"
              className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
            >
              Back to login
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  redirect(homePathForRole(profile.role));
}
