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
    <div className="w-full max-w-7xl 2xl:max-w-[1500px] mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 flex flex-col gap-8 sm:gap-10 animate-fadeIn">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        <div className="lg:col-span-7 flex flex-col gap-6 sm:gap-8">
          <Liveupdate />
          <Reachout />
        </div>

        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 mt-23">
          <Trendinghashtag />
          <GlobalTamilReach />
          <BreakingNew />
        </div>

      </div>

      <div className="w-full pt-4 sm:pt-6 border-t border-[#FFEFE0]/60">
        <RegionalHightlights />
      </div>

    </div>
  );
}