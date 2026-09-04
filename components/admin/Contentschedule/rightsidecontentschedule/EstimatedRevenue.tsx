"use client";

import React, { useState } from "react";
import { Banknote } from "lucide-react";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { ContentSkeleton } from "@/components/ui/Skeletonloading";

export default function EstimatedRevenue() {
  const [isLoading, setIsLoading] = useState(true);
  UsetimeoutLoader(setIsLoading);

  return (
    <div className="w-full bg-[#E5632A] lg:bg-white rounded-[20px] sm:rounded-[32px] p-3 sm:p-5 lg:p-6 text-white lg:text-gray-900 shadow-[0_8px_30px_rgba(229,99,42,0.18)] lg:shadow-[0_4px_24px_rgba(0,0,0,0.03)] border-0 lg:border lg:border-[#FFEFE0] flex flex-col justify-between select-none min-w-0 aspect-[142/141] min-[420px]:aspect-auto hover:scale-[1.01] lg:hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div>
        <div className="flex justify-between items-start gap-1">
          <div className="flex flex-col min-w-0">
            <span className="text-[7.5px] min-[420px]:text-[9px] sm:text-[10px] font-extrabold lg:font-normal tracking-[0.12em] lg:tracking-[0.15em] text-white/70 lg:text-gray-400 uppercase truncate">
              ESTIMATED REVENUE
            </span>
          </div>
          <div className="bg-white/20 lg:bg-transparent p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center text-white lg:text-gray-900 shrink-0">
            <Banknote className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <ContentSkeleton count={1} />
      ) : (
        <>
          <div>
            <h2 className="text-base min-[420px]:text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-black lg:font-normal text-white lg:text-gray-900 mt-1 sm:mt-2 tracking-tight truncate">
              ₹1,84,320
            </h2>

            <div className="bg-white/15 lg:bg-gray-50/70 lg:border lg:border-[#FFEFE0]/60 rounded-xl lg:rounded-2xl px-2 sm:px-3.5 lg:px-4 py-1 sm:py-2 lg:py-3 flex justify-between items-center mt-1.5 sm:mt-3 lg:mt-5 mb-1.5 sm:mb-3 lg:mb-5">
              <span className="text-[7.5px] min-[420px]:text-[9.5px] sm:text-xs text-white/80 lg:text-gray-500 font-medium italic">
                Available now
              </span>
              <span className="text-[8px] min-[420px]:text-xs sm:text-sm lg:text-xs font-black text-white lg:text-gray-900">
                ₹45,200
              </span>
            </div>
          </div>

          <button
            type="button"
            className="w-full py-1.5 sm:py-2.5 lg:py-3.5 bg-white lg:bg-transparent hover:bg-orange-50 lg:hover:bg-[#FFF2EC]/30 lg:border lg:border-[#F27D42]/20 lg:hover:border-[#F27D42] text-[#E5632A] lg:text-[#F27D42] text-[9.5px] min-[420px]:text-xs sm:text-sm lg:text-xs font-extrabold lg:font-black lg:uppercase lg:tracking-widest rounded-xl sm:rounded-2xl transition-all duration-200 text-center shadow-xs lg:shadow-none active:scale-[0.98] cursor-pointer truncate"
          >
            Withdraw to Bank
          </button>
        </>
      )}
    </div>
  );
}
