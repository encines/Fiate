export default function LoadingDashboard() {
  return (
    <div className="min-h-screen space-y-8 animate-pulse p-8">
      {/* Hero Card Skeleton */}
      <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-[32px] w-full"></div>

      {/* Stats Grid Skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl"></div>
        ))}
      </div>

      {/* Analytics Row Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-[32px]"></div>
        <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-[32px]"></div>
      </div>

      {/* History Table Skeleton */}
      <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-[32px]"></div>
    </div>
  );
}
