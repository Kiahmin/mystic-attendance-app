import { AppHeader } from "@/components/layout/app-header";
import { requireProfile } from "@/lib/auth/profile";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader profile={profile} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}
