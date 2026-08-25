"use client";

import React from "react";
import { Train, ArrowRight, TrendingUp } from "lucide-react";

export default function Liveupdate() {
  return (
    <div className="w-full">
   
      {/* Mobile & Tablet Header */}
      <div className="block lg:hidden mb-4 sm:mb-6 select-none">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <span className="p-1 rounded-lg bg-orange-100 text-[#FF5A26] inline-flex items-center justify-center">
            <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          </span>
          Trending Topics
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mt-1">
          Design, generate &amp; Publish in one flow
        </p>
      </div>

      {/* Desktop Header (Original Desktop Design) */}
      <div className="hidden lg:block mb-6 select-none">
        <h1 className="text-3xl font-extrabold text-[#FF6B35] tracking-tight mb-2">
          Trend Radar
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
          Real-time insights across Tamil Nadu and Global ecosystems.
        </p>
      </div>

      {/* Hero Card */}
      <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-[#FFEFE0] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,107,53,0.06)] relative overflow-hidden group">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl bg-[#FFF2EC] text-[#FF5A26] border border-[#FFEFE0] shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Train className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2]" />
            </div>
            
            <h2 className="text-base sm:text-2xl font-bold text-[#FF5A26] tracking-tight min-w-0 truncate sm:whitespace-normal">
              Chennai Metro Phase II
            </h2>
          </div>

          <span className="self-start sm:self-auto bg-[#E65C2B] text-white text-[10px] sm:text-xs font-bold py-1.5 px-4 rounded-full tracking-wider uppercase shadow-xs">
            Live Update
          </span>
        </div>

        <p className="text-gray-600 my-4 sm:my-8 text-xs sm:text-base leading-relaxed max-w-2xl font-medium">
          Major infrastructure milestones achieved in the Corridor 4 expansion. New tunneling phases starting near Thousand Lights area.
        </p>

        {/* 3 Stat Boxes Row */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-5 mb-6 sm:mb-8">
          <div className="bg-[#FCFAF7]/95 border border-[#FFEFE0]/80 rounded-[20px] sm:rounded-[24px] p-3 sm:p-5 flex flex-col justify-center items-start shadow-2xs hover:bg-[#FFF6ED]/50 transition-colors duration-200">
            <span className="text-[9px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase mb-1 sm:mb-1.5 truncate w-full">
              Reach
            </span>
            <span className="text-sm sm:text-2xl font-extrabold text-gray-800 truncate w-full">
              428K+
            </span>
          </div>

          <div className="bg-[#FCFAF7]/95 border border-[#FFEFE0]/80 rounded-[20px] sm:rounded-[24px] p-3 sm:p-5 flex flex-col justify-center items-start shadow-2xs hover:bg-[#FFF6ED]/50 transition-colors duration-200">
            <span className="text-[9px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase mb-1 sm:mb-1.5 truncate w-full">
              Sentiment
            </span>
            <span className="text-sm sm:text-2xl font-extrabold text-[#FF5A26] truncate w-full">
              Positive
            </span>
          </div>

          <div className="bg-[#FCFAF7]/95 border border-[#FFEFE0]/80 rounded-[20px] sm:rounded-[24px] p-3 sm:p-5 flex flex-col justify-center items-start shadow-2xs hover:bg-[#FFF6ED]/50 transition-colors duration-200">
            <span className="text-[9px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase mb-1 sm:mb-1.5 truncate w-full">
              Mentions
            </span>
            <span className="text-sm sm:text-2xl font-extrabold text-gray-800 truncate w-full">
              12.5K
            </span>
          </div>
        </div>

        <div>
          <button className="inline-flex items-center gap-2 bg-[#FF5A26] hover:bg-[#E04D1B] text-white font-bold py-3 sm:py-3.5 px-6 sm:px-8 rounded-full text-xs sm:text-base transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 cursor-pointer select-none group/btn">
            <span>Join Conversation</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
}
