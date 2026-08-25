"use client";

import React from "react";
import Liveupdate from "@/components/admin/TrendRadar/Liveupdate";
import Reachout from "@/components/admin/TrendRadar/Reachout";
import Trendinghashtag from "@/components/admin/TrendRadar/Trendinghashtag";
import GlobalTamilReach from "@/components/admin/TrendRadar/GlobalTamilReach";
import BreakingNew from "@/components/admin/TrendRadar/BreakingNew";
import RegionalHightlights from "@/components/admin/TrendRadar/RegionalHightlights";

export default function TrendRadarPage() {
  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1500px] mx-auto py-3 sm:py-6 px-2.5 sm:px-4 select-none">
      
      {/* Mobile & Tablet Layout (< lg) */}
      <div className="block lg:hidden flex flex-col gap-4 sm:gap-5 w-full">
        <Liveupdate />
        <Reachout />
        <RegionalHightlights />
        <Trendinghashtag />
        <GlobalTamilReach />
        <BreakingNew />
      </div>

      {/* Desktop Layout (>= lg) */}
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