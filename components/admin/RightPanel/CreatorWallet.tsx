"use client";

import { Wallet, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAuthRole } from "@/hooks/useAuthRole";
import { WalterIcons } from "@/public/Svgicons/svgicons";
import { useState } from "react";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { ContentSkeleton } from "@/components/ui/Skeletonloading";

export default function CreatorWallet() {
  const { isInfluencer } = useAuthRole();

  
     const [isLoading, setIsLoading] = useState(true);

  
 UsetimeoutLoader(setIsLoading)

  if (isInfluencer) {
    return (
      <div className="@container w-full max-w-full bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col justify-between select-none">
       
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Revenue Wallet
          </h2>
          <Link
            href="/influencer/wallet"
            className="text-xs sm:text-sm font-semibold text-[#FF6B35] hover:text-[#D9652B] transition-colors"
          >
            View Details
          </Link>
        </div>

        {isLoading ? <ContentSkeleton count={3} height="h-[30px]" width="w-full"/> :
         <div>
       <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs text-gray-400 font-medium block mb-1">
              Total Balance
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                ₹2,45,680.50
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                +12.4%
              </span>
            </div>
          </div>

          <button className="bg-[#FF6B35] hover:bg-[#FF5A26] active:scale-95 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-1.5 rounded-full transition-all shadow-sm cursor-pointer whitespace-nowrap">
            Withdraw
          </button>
        </div>

      
        <div className="grid grid-cols-3 gap-2">
      
          <div className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium leading-tight">
                {"Today's Earnings"}
            </span>
            <div className="mt-1">
              <div className="text-xs sm:text-sm font-bold text-gray-900">
                ₹12,450
              </div>
              <span className="text-[10px] font-bold text-emerald-500 mt-0.5 block">
                +8.6%
              </span>
            </div>
          </div>

  
          <div className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium leading-tight">
              This Month
            </span>
            <div className="mt-1">
              <div className="text-xs sm:text-sm font-bold text-gray-900">
                ₹1,25,430
              </div>
              <span className="text-[10px] font-bold text-emerald-500 mt-0.5 block">
                +18.2%
              </span>
            </div>
          </div>

        
          <div className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between">
            <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium leading-tight">
              Pending Payout
            </span>
            <div className="mt-1">
              <div className="text-xs sm:text-sm font-bold text-gray-900">
                ₹48,750
              </div>
              <span className="text-[10px] font-bold text-[#FF6B35] mt-0.5 block">
                Processing
              </span>
            </div>
          </div>
        </div>
        </div>}
      
      </div>
    );
  }

  return (
    <div>
     <div className="@container w-full max-w-full bg-gradient-to-br from-[#FFAE64] to-[#FF5B3E] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-[0_12px_30px_rgba(255,91,62,0.25)] relative overflow-hidden flex flex-col justify-between min-h-[240px] sm:min-h-[260px] text-white select-none">
      <div className="z-10 max-w-[calc(100%-85px)] xs:max-w-[calc(100%-105px)] sm:max-w-[220px]">
        <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white/95 shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white/90">
            Creator Wallet
          </span>
        </div>
         {isLoading ? <ContentSkeleton count={3} height="h-[50px]" width="w-full"/> :
         <div>
           <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight leading-none mb-3 sm:mb-4.5">
          ₹1,84,320
        </h2>

        <div className="flex flex-col gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-white/90">
          <div className="flex items-center gap-1 text-white/90">
            <span className="opacity-80">Pending approval</span>
            <span className="opacity-60">-</span>
            <span className="font-bold">₹22,400</span>
          </div>
          <div className="flex items-center gap-1 text-white/90">
            <span className="opacity-80">Campaign earnings</span>
            <span className="opacity-60">-</span>
            <span className="font-bold">₹96,100</span>
          </div>
          <div className="flex items-center gap-1 text-white/90">
            <span className="opacity-80">Affiliate income</span>
            <span className="opacity-60">-</span>
            <span className="font-bold">₹18,750</span>
          </div>
        </div>
     

      <div className="z-10 mt-5 sm:mt-6 flex items-end">
        <button
          className="bg-white hover:bg-white/95 active:scale-[0.98] text-[#FF5B3E] font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)] cursor-pointer"
        >
          Withdraw
        </button>
      </div>

      <WalterIcons/>
        </div>
        }
       
    </div>
    </div>
    </div>
    
  );
}
