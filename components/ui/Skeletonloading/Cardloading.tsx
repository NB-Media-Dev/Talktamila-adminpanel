'use client'
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface AvatarloadingProps {
  count?: number
  className?: string
}

const avatarWidthVariants = [
  "w-3/4 max-w-[180px] sm:max-w-[220px]",
  "w-4/5 max-w-[200px] sm:max-w-[250px]",
  "w-2/3 max-w-[150px] sm:max-w-[190px]",
];

export function Avatarloading({ count = 3, className }: AvatarloadingProps) {
  const avatarItems = Array.from({ length: count }, (_, index) => index + 1);

  return (
    <div className={cn("flex flex-col gap-3 sm:gap-4 w-full", className)}>
      {avatarItems.map((item, index) => (
        <div key={`avatar-skeleton-${item}`} className="flex items-center gap-2.5 sm:gap-3.5 w-full">
          <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:h-11 shrink-0 rounded-full bg-orange-100/80" />
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <Skeleton 
              className={cn(
                "h-3.5 sm:h-4 bg-orange-100/80",
                avatarWidthVariants[index % 3]
              )} 
            />
            <Skeleton className="h-2.5 sm:h-3 w-20 sm:w-28 bg-orange-100/60" />
          </div>
        </div>
      ))}
    </div>
  )
}


interface ContentSkeletonProps {
  count?: number 
  width?: string 
  height?: string 
  className?: string
}

export default function ContentSkeleton({ 
  count = 3,         
  width = 'w-full',    
  height = 'h-16 sm:h-20 md:h-24',
  className
}: ContentSkeletonProps): React.JSX.Element {
  const skeletonArray = Array.from({ length: count }, (_, index) => index + 1)

  return (
    <div className={cn("flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 w-full", className)}>
      {skeletonArray.map((item) => (
        <Skeleton 
          key={`content-skeleton-${item}`} 
          className={cn(`${height} ${width} rounded-xl sm:rounded-2xl bg-orange-100/50 border border-orange-100/60`)}
        />
      ))}
    </div>
  )
}


