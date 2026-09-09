"use client";

import { Wallet } from "lucide-react";
import { useState } from "react";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { ContentSkeleton } from "@/components/ui/Skeletonloading";

// Mock data — swap for GET /superadmin/revenue-overview once it exists.
// This is the money view a regular Admin should NOT see: revenue across
// every influencer + freelancer combined, not just what they personally manage.
export function PlatformRevenueOverview() {
  const [isLoading, setIsLoading] = useState(true);
  UsetimeoutLoader(setIsLoading);

  return (
    <div className="@container w-full max-w-full bg-gradient-to-br from-[#FFAE64] to-[#FF5B3E] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 shadow-[0_12px_30px_rgba(255,91,62,0.25)] relative overflow-hidden flex flex-col justify-between min-h-[220px] text-white select-none">
      <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
        <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-white/95 shrink-0" />
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-white/90">
          Platform-Wide Revenue
        </span>
      </div>

      {isLoading ? (
        <ContentSkeleton count={3} height="h-[24px]" width="w-full" />
      ) : (
        <div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black tracking-tight leading-none mb-3 sm:mb-4.5">
            ₹8,42,150
          </h2>

          <div className="flex flex-col gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold text-white/90">
            <div className="flex items-center gap-1">
              <span className="opacity-80">Paid to influencers</span>
              <span className="opacity-60">-</span>
              <span className="font-bold">₹4,10,200</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="opacity-80">Paid to freelancers</span>
              <span className="opacity-60">-</span>
              <span className="font-bold">₹1,86,500</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="opacity-80">Retained by Talk Tamila</span>
              <span className="opacity-60">-</span>
              <span className="font-bold">₹2,45,450</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
