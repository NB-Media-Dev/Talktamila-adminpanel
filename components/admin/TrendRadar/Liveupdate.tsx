"use client";

import React from "react";
import { Train, ArrowRight } from "lucide-react";

export default function Liveupdate() {
  return (
    <div className="w-full">
   
      <div className="mb-6 select-none">
        <h1 className="text-3xl font-extrabold text-[#FF6B35] tracking-tight mb-2">
          Trend Radar
        </h1>
        <p className="text-sm sm:text-base text-gray-500 font-medium leading-relaxed">
          Real-time insights across Tamil Nadu and Global ecosystems.
        </p>
      </div>

   
      <div className="w-full bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-[#FFEFE0] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,107,53,0.06)] relative overflow-hidden group">
        

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
       
            <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl bg-[#FFF2EC] text-[#FF5A26] border border-[#FFEFE0] shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Train className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
            </div>
            
   
            <h2 className="text-xl sm:text-2xl font-bold text-[#FF5A26] tracking-tight">
              Chennai Metro Phase II
            </h2>
          </div>

    
          <span className="self-start sm:self-auto bg-[#E65C2B] text-white text-[10px] sm:text-xs font-bold py-1.5 px-4 rounded-full tracking-wider uppercase shadow-xs">
            Live Update
          </span>
        </div>

        <p className="text-gray-600 my-6 sm:my-8 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
          Major infrastructure milestones achieved in the Corridor 4 expansion. New tunneling phases starting near Thousand Lights area.
        </p>

     
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
      
          <div className="bg-[#FCFAF7]/95 border border-[#FFEFE0]/80 rounded-[24px] p-5 flex flex-col justify-center items-start shadow-2xs hover:bg-[#FFF6ED]/50 transition-colors duration-200">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase mb-1.5">
              Reach
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-800">
              428K+
            </span>
          </div>

 
          <div className="bg-[#FCFAF7]/95 border border-[#FFEFE0]/80 rounded-[24px] p-5 flex flex-col justify-center items-start shadow-2xs hover:bg-[#FFF6ED]/50 transition-colors duration-200">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase mb-1.5">
              Sentiment
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#FF5A26]">
              Positive
            </span>
          </div>

 
          <div className="bg-[#FCFAF7]/95 border border-[#FFEFE0]/80 rounded-[24px] p-5 flex flex-col justify-center items-start shadow-2xs hover:bg-[#FFF6ED]/50 transition-colors duration-200">
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-wider uppercase mb-1.5">
              Mentions
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-gray-800">
              12.5K
            </span>
          </div>
        </div>

  
        <div>
          <button className="inline-flex items-center gap-2 bg-[#FF5A26] hover:bg-[#E04D1B] text-white font-bold py-3.5 px-6 sm:px-8 rounded-full text-sm sm:text-base transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 cursor-pointer select-none group/btn">
            <span>Join Conversation</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </button>
        </div>

      </div>
    </div>
  );
}
