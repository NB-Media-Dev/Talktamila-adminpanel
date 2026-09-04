import { Skeleton } from "../skeleton"
import { cn } from "@/lib/utils"


export function LivePreviewloading({ className }: { className?: string }) {
  return (
    <div className={cn("w-full flex justify-center", className)}>
      <div className="bg-[#F0F2F5] min-h-[420px] sm:min-h-[480px] h-full rounded-2xl p-2 sm:p-3 border border-gray-200/40 flex flex-col gap-2 w-full max-w-[320px] sm:max-w-[360px] md:max-w-md lg:max-w-[290px]  min-[2560px]:max-w-[360px] min-[3840px]:max-w-[420px] mx-auto overflow-hidden shadow-xs">
      
        <div className="flex items-center gap-2 px-1 py-0.5">
          <Skeleton className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-orange-200/80" />
          <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-20 bg-orange-200/80" />
        </div>

   
        <div className="bg-white rounded-xl border border-gray-200/60 shadow-xs p-2.5 sm:p-3 flex flex-col gap-2 flex-1">
       
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100/80 shrink-0" />
              <div className="flex flex-col gap-1 min-w-0">
                <Skeleton className="h-2.5 sm:h-3 w-20 sm:w-24 bg-orange-100/80" />
                <Skeleton className="h-2 w-12 sm:w-16 bg-orange-100/60" />
              </div>
            </div>
            <Skeleton className="w-4 h-4 bg-orange-100/60 rounded shrink-0" />
          </div>

         
          <div className="flex flex-col gap-1.5 my-1">
            <Skeleton className="h-2 sm:h-2.5 w-full bg-orange-100/70" />
            <Skeleton className="h-2 sm:h-2.5 w-3/4 bg-orange-100/60" />
          </div>

          
          <div className="w-full flex-1 min-h-[140px] sm:min-h-[180px] bg-slate-900/5 rounded-lg flex items-center justify-center border border-gray-100 relative overflow-hidden">
            <Skeleton className="w-full h-full bg-orange-100/40" />
            <div className="absolute w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-orange-200/60 flex items-center justify-center">
              <Skeleton className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-orange-300/80" />
            </div>
          </div>

          {/* Media Info */}
          <div className="flex justify-between items-center px-0.5 pt-1">
            <Skeleton className="h-2.5 sm:h-3 w-16 sm:w-20 bg-orange-100/70" />
            <Skeleton className="h-5 sm:h-6 w-14 sm:w-16 rounded-lg bg-orange-200/80" />
          </div>

          <div className="border-t border-gray-100 my-0.5"></div>

          {/* Action Bar */}
          <div className="flex items-center justify-around">
            <Skeleton className="h-2.5 sm:h-3 w-10 sm:w-12 bg-orange-100/70" />
            <Skeleton className="h-2.5 sm:h-3 w-12 sm:w-14 bg-orange-100/70" />
            <Skeleton className="h-2.5 sm:h-3 w-10 sm:w-12 bg-orange-100/70" />
          </div>
        </div>
      </div>
    </div>
  )
}
