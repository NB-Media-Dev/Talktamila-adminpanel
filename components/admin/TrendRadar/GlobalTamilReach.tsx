"use client";

import React from "react";
import { Globe } from "lucide-react";

export default function GlobalTamilReach() {
  return (
    <div className="w-full bg-[#A33F0F] rounded-[32px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(163,63,15,0.08)] relative overflow-hidden flex flex-col justify-between select-none group min-h-[170px]">
      
      <div className="absolute bottom-[-15px] right-[-15px] text-white/10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6">
        <Globe className="w-36 h-36 stroke-[1.2]" />
      </div>

      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-[10px] sm:text-xs font-bold text-orange-200 tracking-wider uppercase">
          Global Tamil Reach
        </span>
        <span className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          1.2B+
        </span>
      </div>

      <div className="relative z-10 w-full h-[3px] bg-white my-4 rounded-full" />

      <div className="relative z-10">
        <span className="text-xs sm:text-sm font-semibold text-orange-100">
          Active creators worldwide
        </span>
      </div>

    </div>
  );
}
