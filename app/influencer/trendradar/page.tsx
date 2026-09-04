"use client";

import { useState } from "react";
import { TrendingUp, ArrowLeft } from "lucide-react";
import Liveupdate from "@/components/admin/TrendRadar/Liveupdate";
import Reachout from "@/components/admin/TrendRadar/Reachout";
import Trendinghashtag from "@/components/admin/TrendRadar/Trendinghashtag";
import GlobalTamilReach from "@/components/admin/TrendRadar/GlobalTamilReach";
import BreakingNew from "@/components/admin/TrendRadar/BreakingNew";
import RegionalHightlights from "@/components/admin/TrendRadar/RegionalHightlights";
import TrendingTopics from "@/components/admin/dashboard/TrendingTopics";
import AITrendRadar from "@/components/admin/dashboard/AITrendRadar";

export default function TrendRadarPage() {
  const [activeMobilePage, setActiveMobilePage] = useState<"first" | "second">("first");

  return (
    <div className="w-full py-3 sm:py-6 px-2.5 sm:px-4 select-none">
      
   
      {activeMobilePage === "first" ? (
        <div className="block lg:hidden flex flex-col gap-4 sm:gap-5 w-full">
         
          <div className="mb-2 sm:mb-4 select-none">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <span className="p-1 rounded-lg bg-orange-100 text-[#FF5A26] inline-flex items-center justify-center">
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </span>
             <span>Trending Topics</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mt-1">
              Design, generate &amp; Publish in one flow
            </p>
          </div>

          <TrendingTopics onExploreMore={() => setActiveMobilePage("second")} />

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Trendinghashtag compact={true} />
            <AITrendRadar compact={true} />
          </div>

          <GlobalTamilReach />
          <BreakingNew />
        </div>
      ) : (
        <div className="block lg:hidden flex flex-col gap-4 sm:gap-5 w-full">
         
          <div className="mb-2 sm:mb-4 select-none flex items-center gap-3">
            <button
              onClick={() => setActiveMobilePage("first")}
              className="p-1.5 rounded-full bg-orange-50 text-[#FF5A26] hover:bg-orange-100 active:scale-95 transition-all"
              aria-label="Back to trending topics"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Trending Topics
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mt-1">
                Design, generate &amp; Publish in one flow
              </p>
            </div>
          </div>

          <Liveupdate hideMobileHeader={true} />
          <Reachout />
          <RegionalHightlights />
        </div>
      )}

     
      <div className="hidden lg:flex flex-col gap-8 w-full">
        <div className="grid grid-cols-12 gap-8 items-start w-full">
          <div className="col-span-7 flex flex-col gap-8 w-full">
            <Liveupdate />
            <Reachout />
          </div>

          <div className="col-span-5 flex flex-col gap-6 mt-[78px] w-full">
            <Trendinghashtag />
            <GlobalTamilReach />
            <BreakingNew />
          </div>
        </div>

        <div className="w-full pt-6 border-t border-[#FFEFE0]/60">
          <RegionalHightlights />
        </div>
      </div>

    </div>
  );
}