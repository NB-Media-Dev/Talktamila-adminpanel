'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function CalendarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-5 flex flex-col gap-2.5 sm:gap-3.5", className)}>
      <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-gray-100">
        <Skeleton className="h-4 sm:h-5 w-24 sm:w-32 bg-orange-100/80" />
        <div className="flex gap-1.5 sm:gap-2">
          <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-orange-100/60" />
          <Skeleton className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg bg-orange-100/60" />
        </div>
      </div>
    
      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
        {Array.from({ length: 7 }, (_, idx) => idx + 1).map((item) => (
          <Skeleton key={`cal-header-${item}`} className="h-3 sm:h-4 bg-orange-100/80 rounded text-center" />
        ))}
        {Array.from({ length: 28 }, (_, idx) => idx + 1).map((item) => (
          <Skeleton key={`cal-day-${item}`} className="h-8 sm:h-10 md:h-12 lg:h-14 bg-orange-50/60 rounded-md sm:rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function ScheduleSlotSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  const slotItems = Array.from({ length: count }, (_, idx) => idx + 1);

  return (
    <div className={cn("flex flex-col gap-2 sm:gap-3 w-full", className)}>
      {slotItems.map((item) => (
        <div key={`schedule-slot-${item}`} className="flex items-center justify-between p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-white border border-gray-100">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Skeleton className="w-2 sm:w-2.5 h-8 sm:h-10 rounded-full bg-orange-400/80 shrink-0" />
            <div className="flex flex-col gap-1 min-w-0">
              <Skeleton className="h-3 sm:h-3.5 w-24 sm:w-36 md:w-44 bg-orange-100/80" />
              <Skeleton className="h-2 sm:h-2.5 w-16 sm:w-24 bg-orange-100/60" />
            </div>
          </div>
          <Skeleton className="h-4 sm:h-5 w-12 sm:w-16 rounded-full bg-orange-100/60 shrink-0 ml-2" />
        </div>
      ))}
    </div>
  )
}

