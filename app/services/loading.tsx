export default function LoadingServices() {
  return (
    <div className="view-shell space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-10 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl"></div>
          <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl"></div>
        </div>
        <div className="lg:col-span-2 h-72 bg-zinc-200 dark:bg-zinc-800 rounded-[32px]"></div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-3xl"></div>
        ))}
      </div>
    </div>
  );
}
