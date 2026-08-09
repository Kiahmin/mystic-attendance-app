export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        MS
      </div>
      <h1 className="font-heading text-2xl font-semibold">You&apos;re offline</h1>
      <p className="max-w-sm text-muted-foreground">
        Mystic Skates needs a connection to load attendance data. Check your
        network and try again.
      </p>
    </main>
  );
}
