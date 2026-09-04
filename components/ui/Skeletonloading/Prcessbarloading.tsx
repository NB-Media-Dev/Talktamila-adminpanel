import { Skeleton } from "../skeleton"
import { cn } from "@/lib/utils"

interface ProcessloadingProps {
  count?: number
  className?: string
}

export function Processloading({ count = 6, className }: ProcessloadingProps) {
  const processItems = Array.from({ length: count }, (_, idx) => idx + 1);

  return (
    <div className={cn("w-full mb-3 sm:mb-5", className)}>
      <div className="flex flex-col gap-2.5 sm:gap-3.5">
        {processItems.map((item) => (
          <div key={`process-skeleton-${item}`} className="flex items-center gap-2 sm:gap-3.5 w-full">
            <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-16 md:w-20 bg-orange-100/80 shrink-0" />
            <Skeleton className="h-2 sm:h-2.5 flex-1 bg-orange-100/60 rounded-full" />
            <Skeleton className="h-2.5 sm:h-3 w-7 sm:w-10 bg-orange-100/60 shrink-0" />
            <Skeleton className="h-2.5 sm:h-3 w-7 sm:w-10 bg-orange-100/80 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}