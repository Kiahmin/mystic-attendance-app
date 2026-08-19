export function PageLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div className="space-y-2">
        <div className="h-8 w-48 max-w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted sm:col-span-2 xl:col-span-1" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="flex h-14 items-center border-b border-border/60 px-4 last:border-0"
          >
            <div
              className="h-4 animate-pulse rounded bg-muted"
              style={{ width: `${70 - index * 6}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
