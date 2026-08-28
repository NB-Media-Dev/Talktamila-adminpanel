"use client";

import React from "react";
import { Rocket } from "lucide-react";

export default function ActiveCampaigns() {
  return (
    <div className="w-full bg-[#E5632A] rounded-[20px] sm:rounded-[32px] p-3 sm:p-5 text-white shadow-[0_8px_30px_rgba(229,99,42,0.18)] flex flex-col justify-between select-none min-w-0 aspect-[142/141] min-[420px]:aspect-auto hover:scale-[1.01] transition-all duration-300">
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start gap-1">
          <div className="flex flex-col min-w-0">
            <span className="text-[7.5px] min-[420px]:text-[9px] sm:text-[10px] font-extrabold tracking-[0.12em] text-white/70 uppercase truncate">
              CURRENT MOMENTUM
            </span>
            <h2 className="text-[11px] min-[420px]:text-sm sm:text-lg md:text-xl font-extrabold text-white leading-tight mt-0.5 sm:mt-1">
              Active<br className="inline min-[420px]:hidden sm:inline" /> Campaigns
            </h2>
          </div>
          <div className="bg-white/20 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shrink-0">
            <Rocket className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Number Section */}
        <div className="flex items-baseline mt-2 sm:mt-4 mb-1 sm:mb-4">
          <span className="text-2xl min-[420px]:text-3xl sm:text-4xl md:text-5xl font-black text-white leading-none">12</span>
          <span className="text-[8px] min-[420px]:text-[10px] sm:text-xs text-white/90 uppercase tracking-widest ml-1 sm:ml-1.5 font-bold">BRANDS</span>
        </div>
      </div>

      {/* Bottom Progress Section */}
      <div className="w-full">
        <div className="flex justify-between items-center text-[7.5px] min-[420px]:text-[9px] sm:text-[10px] font-bold text-white/90 mb-1 sm:mb-1.5 tracking-wider uppercase">
          <span>Monthly Target</span>
          <span>75% Achieved</span>
        </div>
        <div className="h-1.5 sm:h-2 w-full bg-white/25 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500" 
            style={{ width: "75%" }} 
          />
        </div>
      </div>
    </div>
  );
}

