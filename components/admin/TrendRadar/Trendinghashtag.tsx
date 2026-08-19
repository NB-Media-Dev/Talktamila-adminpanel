"use client";

import React, { useState } from "react";
import { RotateCw, ArrowUpRight } from "lucide-react";

interface HashtagItem {
  id: number;
  tag: string;
  interactions: string;
  growth: string;
}

export default function Trendinghashtag() {
  const [isRotating, setIsRotating] = useState(false);
  const [hashtags, setHashtags] = useState<HashtagItem[]>([
    { id: 1, tag: "#தமிழ்நாடு", interactions: "124K interactions", growth: "+128%" },
    { id: 2, tag: "#ChennaiRains", interactions: "98K interactions", growth: "+98%" },
    { id: 3, tag: "#TamilCinema", interactions: "456K interactions", growth: "+74%" },
  ]);

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      setHashtags((prev) =>
        prev.map((h) => ({
          ...h,
          growth: `+${Math.floor(Math.random() * 100) + 30}%`,
        }))
      );
    }, 800);
  };

  return (
    <div className="w-full bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.015)] border border-[#FFEFE0] flex flex-col gap-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,107,53,0.05)]">
     
      <div className="flex items-center justify-between w-full pb-2 select-none">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          Trending Hashtags
        </h2>
        <button
          onClick={handleRefresh}
          className="p-1.5 rounded-full text-gray-400 hover:text-[#FF5A26] hover:bg-[#FFF6ED] active:scale-90 transition-all duration-200 cursor-pointer"
          title="Refresh Trends"
        >
          <RotateCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRotating ? "animate-spin text-[#FF5A26]" : ""}`} />
        </button>
      </div>


      <div className="flex flex-col gap-5">
        {hashtags.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between group hover:bg-[#FFF9F5]/40 -mx-3 px-3 py-1.5 rounded-2xl transition-all duration-200"
          >
        
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-bold text-gray-800 transition-colors duration-200 group-hover:text-[#FF5A26]">
                {item.tag}
              </span>
              <span className="text-xs text-gray-400 font-semibold mt-0.5">
                {item.interactions}
              </span>
            </div>

         
            <div className="flex items-center gap-1 text-[#FF5A26] font-bold text-sm sm:text-base select-none">
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span>{item.growth}</span>
            </div>
          </div>
        ))}
      </div>

    
      <div className="w-full pt-2">
        <button className="w-full border border-[#FF6B35]/40 hover:border-[#FF5A26] text-[#FF6B35] hover:text-[#FF5A26] font-bold text-sm sm:text-base py-3 px-6 rounded-full transition-all duration-200 bg-transparent hover:bg-[#FFF6ED]/30 active:scale-[0.99] cursor-pointer">
          Explore More Topics
        </button>
      </div>

    </div>
  );
}
