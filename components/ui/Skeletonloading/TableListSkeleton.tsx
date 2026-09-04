'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function TableSkeleton({ 
  rows = 4, 
  cols = 4,
  className 
}: { 
  rows?: number; 
  cols?: number; 
  className?: string 
}) {
  return (
    <div className={cn("w-full bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 md:p-5 flex flex-col gap-2.5 sm:gap-3.5", className)}>
     
      <div className="flex items-center justify-between pb-2 border-b border-gray-100 gap-2 sm:gap-4">
        {Array.from({ length: cols }, (_, idx) => idx + 1).map((colNum) => (
          <Skeleton 
            key={`table-header-col-${colNum}`} 
            className={cn(
              "h-3.5 sm:h-4 flex-1 bg-orange-100/80 rounded",
              colNum >= 3 && "hidden sm:block"
            )} 
          />
        ))}
      </div>
    
      {Array.from({ length: rows }, (_, idx) => idx + 1).map((rowNum) => (
        <div key={`table-row-${rowNum}`} className="flex items-center justify-between py-2 sm:py-2.5 border-b border-gray-50 gap-2 sm:gap-4">
          {Array.from({ length: cols }, (_, idx) => idx + 1).map((colNum) => (
            <Skeleton 
              key={`table-row-${rowNum}-col-${colNum}`} 
              className={cn(
                "h-3 sm:h-3.5 flex-1 bg-orange-100/60 rounded",
                colNum >= 3 && "hidden sm:block"
              )} 
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ListSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  const listItems = Array.from({ length: count }, (_, index) => index + 1);

  return (
    <div className={cn("flex flex-col gap-2.5 sm:gap-3.5 w-full", className)}>
      {listItems.map((item) => (
        <div 
          key={`list-skeleton-${item}`} 
          className="flex items-center justify-between p-2.5 sm:p-3.5 min-h-[76px] sm:min-h-[90px] rounded-xl bg-white border border-gray-100 gap-3"
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
            <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl bg-orange-100/80 shrink-0" />
            <div className="flex flex-col gap-1.5 sm:gap-2 flex-1 min-w-0">
              <Skeleton className="h-3.5 sm:h-4 w-3/4 max-w-[260px] bg-orange-100/80" />
              <Skeleton className="h-2.5 sm:h-3 w-1/2 max-w-[180px] bg-orange-100/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function NotificationSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  const notificationItems = Array.from({ length: count }, (_, index) => index + 1);

  return (
    <div className={cn("flex flex-col gap-2 sm:gap-2.5 w-full", className)}>
      {notificationItems.map((item) => (
        <div key={`notification-skeleton-${item}`} className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white border border-orange-100/50">
          <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-200/80 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 sm:gap-1.5 flex-1 min-w-0">
            <Skeleton className="h-3 sm:h-3.5 w-4/5 sm:w-3/4 bg-orange-100/80" />
            <Skeleton className="h-2 sm:h-2.5 w-1/2 sm:w-1/3 bg-orange-100/60" />
          </div>
          <Skeleton className="h-2 sm:h-2.5 w-8 sm:w-10 bg-orange-100/50 shrink-0" />
        </div>
      ))}
    </div>
  )
}

