import { Skeleton } from "../skeleton";

export function Processloading(){
    return(
          <div className="flex-1 p-5 pt-4 pb-28 md:pb-5 flex flex-col gap-4.5 bg-[#FCFAF7] overflow-y-auto">
 
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFF6ED] border border-[#FFEFE0] rounded-xl p-2.5 flex flex-col gap-1.5 shadow-2xs"
                >
                  <Skeleton className="h-2.5 w-14 bg-orange-100/80" />
                  <Skeleton className="h-4 w-20 bg-orange-200/70" />
                </div>
              ))}
            </div>

  
            <div>
              <Skeleton className="h-3 w-32 bg-orange-100/80 mb-2.5" />
              <div className="flex flex-col gap-3">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Skeleton className="h-3 w-16 bg-orange-100/80 shrink-0" />
                    <Skeleton className="h-2 flex-1 bg-orange-100/60 rounded-full" />
                    <Skeleton className="h-3 w-10 bg-orange-100/60 shrink-0" />
                    <Skeleton className="h-3 w-10 bg-orange-100/80 shrink-0" />
                  </div>
                ))}
              </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-t border-orange-100/50 pt-4">
              <div>
                <Skeleton className="h-3 w-24 bg-orange-100/80 mb-2.5" />
                <div className="flex flex-col gap-2.5">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Skeleton className="h-3 w-10 bg-orange-100/80 shrink-0" />
                      <Skeleton className="h-1.5 flex-1 bg-orange-100/60 rounded-full" />
                      <Skeleton className="h-3 w-7 bg-orange-100/80 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Skeleton className="h-3 w-24 bg-orange-100/80 mb-2.5" />
                <div className="flex flex-col gap-2.5">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <Skeleton className="h-3 w-20 bg-orange-100/80" />
                      <Skeleton className="h-3 w-28 bg-orange-100/60" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
    )
}