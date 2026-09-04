'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export function FeedPostSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 border border-gray-100 shadow-xs flex flex-col gap-2.5 sm:gap-3.5 w-full", className)}>
    
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-orange-100/80 shrink-0" />
          <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
            <Skeleton className="h-3 sm:h-3.5 w-24 sm:w-32 bg-orange-100/80" />
            <Skeleton className="h-2 sm:h-2.5 w-14 sm:w-20 bg-orange-100/60" />
          </div>
        </div>
        <Skeleton className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-orange-100/50 shrink-0" />
      </div>

    
      <div className="flex flex-col gap-1.5 my-0.5 sm:my-1">
        <Skeleton className="h-2.5 sm:h-3 w-full bg-orange-100/70" />
        <Skeleton className="h-2.5 sm:h-3 w-4/5 sm:w-3/4 bg-orange-100/60" />
      </div>

   
      <Skeleton className="w-full h-36 sm:h-48 md:h-64 lg:h-72 rounded-lg sm:rounded-xl bg-orange-100/50" />

    
      <div className="flex justify-between items-center pt-2 border-t border-gray-50">
        <Skeleton className="h-3.5 sm:h-4 w-12 sm:w-16 md:w-20 bg-orange-100/60 rounded" />
        <Skeleton className="h-3.5 sm:h-4 w-12 sm:w-16 md:w-20 bg-orange-100/60 rounded" />
        <Skeleton className="h-3.5 sm:h-4 w-12 sm:w-16 md:w-20 bg-orange-100/60 rounded" />
      </div>
    </div>
  )
}

export function FeedListSkeleton({ count = 2, className }: { count?: number; className?: string }) {
  const feedItems = Array.from({ length: count }, (_, index) => index + 1);

  return (
    <div className={cn("flex flex-col gap-3 sm:gap-4 md:gap-5 w-full", className)}>
      {feedItems.map((item) => (
        <FeedPostSkeleton key={`feed-skeleton-${item}`} />
      ))}
    </div>
  )
}

