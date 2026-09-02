import { Skeleton } from "../skeleton"

export function LivePreviewloading(){
    return(
        <div>
            <div className="bg-[#F0F2F5] mt-5 h-[500px] sm:h-full rounded-2xl p-2 border border-gray-200/40 flex-grow flex flex-col gap-2 w-full max-w-[340px] lg:max-w-[270px] mx-auto overflow-hidden shadow-xs">
                <div className="flex items-center gap-2 px-1 py-0.5">
                  <Skeleton className="w-4 h-4 rounded-full bg-orange-200/80" />
                  <Skeleton className="h-3 w-16 bg-orange-200/80" />
                </div>

                <div className="bg-white rounded-xl border border-gray-200/60 shadow-xs p-2.5 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full bg-orange-100/80 shrink-0" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="h-3 w-24 bg-orange-100/80" />
                        <Skeleton className="h-2 w-16 bg-orange-100/60" />
                      </div>
                    </div>
                    <Skeleton className="w-4 h-4 bg-orange-100/60 rounded" />
                  </div>

                  <div className="flex flex-col gap-1.5 my-1">
                    <Skeleton className="h-2.5 w-full bg-orange-100/70" />
                    <Skeleton className="h-2.5 w-3/4 bg-orange-100/60" />
                  </div>

                  <div className="w-full flex-1 min-h-[160px] bg-slate-900/5 rounded-lg flex items-center justify-center border border-gray-100 relative overflow-hidden">
                    <Skeleton className="w-full h-full bg-orange-100/40" />
                    <div className="absolute w-9 h-9 rounded-full bg-orange-200/60 flex items-center justify-center">
                      <Skeleton className="w-4 h-4 rounded-full bg-orange-300/80" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center px-0.5 pt-1">
                    <Skeleton className="h-3 w-20 bg-orange-100/70" 
                  />
                    
                    <Skeleton className="h-6 w-16 rounded-lg bg-orange-200/80" />
                  </div>

                  <div className="border-t border-gray-100 my-0.5"></div>

                  <div className="flex items-center justify-around">
                    <Skeleton className="h-3 w-12 bg-orange-100/70" />
                    <Skeleton className="h-3 w-14 bg-orange-100/70" />
                    <Skeleton className="h-3 w-12 bg-orange-100/70" />
                  </div>
                </div>
              </div>
        </div>
    )
}