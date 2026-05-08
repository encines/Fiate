import React from "react";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800/50 rounded-2xl ${className}`} />
);

export const DashboardSkeleton = () => (
  <div className="view-shell space-y-10">
    {/* Header Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-12 w-2/3 max-w-md" />
      <Skeleton className="h-4 w-1/2 max-w-sm" />
    </div>

    {/* Main Card Skeleton */}
    <Skeleton className="h-80 w-full rounded-[40px]" />

    {/* Grid Skeleton */}
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 rounded-3xl" />
      ))}
    </div>

    {/* Table/List Skeleton */}
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-24" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  </div>
);
