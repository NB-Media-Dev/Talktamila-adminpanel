"use client";

import React from "react";
import { Rocket } from "lucide-react";

export default function ActiveCampaigns() {
  return (
    <div className="w-full bg-[#F27D42] rounded-[24px] sm:rounded-[32px] p-3.5 sm:p-5 text-white shadow-[0_8px_30px_rgba(242,125,66,0.15)] flex flex-col justify-between select-none hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(242,125,66,0.22)] transition-all duration-300">
      <div>
        <div className="flex justify-between items-start gap-1">
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.15em] text-white/80 uppercase truncate">
              CURRENT MOMENTUM
            </span>
            <h2 className="text-xs sm:text-lg font-bold text-white leading-snug mt-1">
              Active <br className="hidden sm:inline" /> Campaigns
            </h2>
          </div>
          <div className="bg-white/15 p-2 sm:p-2.5 rounded-2xl flex items-center justify-center text-white shrink-0">
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="flex items-baseline mt-3 sm:mt-5 mb-4 sm:mb-6">
          <span className="text-3xl sm:text-5xl font-black text-white leading-none">12</span>
          <span className="text-[10px] sm:text-xs text-white/90 uppercase tracking-widest ml-1.5 font-bold">BRANDS</span>
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-white/90 mb-1.5 tracking-wider uppercase">
          <span className="truncate">Monthly Target</span>
          <span className="shrink-0">75% Achieved</span>
        </div>
        <div className="h-1.5 sm:h-2 w-full bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500" 
            style={{ width: "75%" }} 
          />
        </div>
      </div>
    </div>
  );
}
