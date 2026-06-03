export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 animate-pulse">
          Sincronizando garaje...
        </p>
      </div>
    </div>
  );
}
