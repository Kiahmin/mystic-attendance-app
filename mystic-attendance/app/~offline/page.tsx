export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="max-w-sm text-muted-foreground">
        Mystic Skates needs a connection to load attendance data. Check your
        network and try again.
      </p>
    </main>
  );
}
