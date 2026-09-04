'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const skeletonheight = [
  { id: "bar-chart-1", h: 40 },
  { id: "bar-chart-2", h: 70 },
  { id: "bar-chart-3", h: 45 },
  { id: "bar-chart-4", h: 90 },
  { id: "bar-chart-5", h: 60 },
  { id: "bar-chart-6", h: 80 },
  { id: "bar-chart-7", h: 50 },
];

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-5 flex flex-col gap-3 sm:gap-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 sm:h-4 w-28 sm:w-36 bg-orange-100/80" />
        <Skeleton className="h-3.5 sm:h-4 w-12 sm:w-16 bg-orange-100/60 rounded-full" />
      </div>
     
      <div className="flex items-end justify-between h-28 sm:h-36 md:h-48 lg:h-56 pt-3 sm:pt-4 gap-1.5 sm:gap-2.5 md:gap-3 border-b border-gray-100">
        {skeletonheight.map((heightPct) => (
          <div key={heightPct.id} className="flex flex-col items-center gap-1.5 sm:gap-2 flex-1 h-full justify-end">
            <Skeleton
              className="w-full max-w-[40px] bg-orange-200/70 rounded-t-sm sm:rounded-t-md"
              style={{ height: `${heightPct.h}%` }}
            />
            <Skeleton className="h-2 sm:h-2.5 w-4 sm:w-6 bg-orange-100/60" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-gray-100 flex flex-col gap-2.5 sm:gap-3.5 w-full", className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100/80 shrink-0" />
        <Skeleton className="h-2.5 sm:h-3 w-10 sm:w-12 bg-orange-100/60" />
      </div>
      <Skeleton className="h-5 sm:h-6 w-20 sm:w-28 bg-orange-100/90" />
      <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-24 bg-orange-100/60" />
    </div>
  )
}

interface MetricsSkeletonProps {
  count?: number;
  columns?: number;
  className?: string;
}

const columnGridMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6",
}

export function MetricsSkeleton({ count = 3, columns = 1, className }: MetricsSkeletonProps) {
  const gridClass = columnGridMap[columns] || "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"

  return (
    <div className={cn("grid gap-2.5 sm:gap-3.5 w-full", gridClass, className)}>
      {Array.from({ length: count }, (_, i) => i + 1).map((id) => (
        <StatsCardSkeleton key={`metric-skeleton-item-${id}`} />
      ))}
    </div>
  );
}



