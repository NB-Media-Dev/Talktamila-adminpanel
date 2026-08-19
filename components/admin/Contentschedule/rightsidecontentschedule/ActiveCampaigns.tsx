"use client";

import React from "react";
import { Rocket } from "lucide-react";

export default function ActiveCampaigns() {
  return (
    <div className="mt-4 w-full bg-[#F27D42] rounded-2xl sm:rounded-[32px] p-4 sm:p-5 text-white shadow-[0_8px_30px_rgba(242,125,66,0.15)] flex flex-col justify-between select-none hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(242,125,66,0.22)] transition-all duration-300">
      <div>
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.15em] text-white/70 uppercase">
              CURRENT MOMENTUM
            </span>
            <h2 className="text-sm sm:text-xl text-white">
              Active <br></br> Campaign
            </h2>
          </div>
          <div className="bg-white/15 p-2.5 rounded-2xl flex items-center justify-center text-white shrink-0">
            <Rocket className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-baseline mt-6 mb-8">
          <span className="text-5xl sm:text-6xl font-black text-white leading-none">12</span>
          <span className="text-xs  text-white/90 uppercase tracking-widest ml-2">BRANDS</span>
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center text-[10px]    text-white/90 mb-2.5 tracking-wider uppercase">
          <span>Monthly Target</span>
          <span>75% Achieved</span>
        </div>
        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500" 
            style={{ width: "75%" }} 
          />
        </div>
      </div>
    </div>
  );
}
