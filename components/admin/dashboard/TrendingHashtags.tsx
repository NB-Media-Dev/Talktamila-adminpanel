"use client";

import { Hash } from "lucide-react";

interface Hashtag {
  id: number;
  tag: string;
  growth: string;
}

export default function TrendingHashtags() {
  const hashtags: Hashtag[] = [
    { id: 1, tag: "#தமிழ்நாடு", growth: "+128%" },
    { id: 2, tag: "#ChennaiRains", growth: "+96%" },
    { id: 3, tag: "#TamilCinema", growth: "+74%" },
    { id: 4, tag: "#StartupTN", growth: "+41%" },
  ];

  return (
    <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
    
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-orange-50 text-[#FF6B35]">
          <Hash className="w-5 h-5 stroke-[2.5]" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Trending Hashtags
        </h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {hashtags.map((item) => (
          <div key={item.id} className="flex">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-[#FFF6ED] hover:bg-[#FCE3CC]/70 transition-colors rounded-2xl cursor-pointer group">
              <span className=" text-gray-800 text-sm  group-hover:text-[#FF6B35] transition-colors">
                {item.tag}
              </span>
              <span className="font-bold text-[#FF6B35] text-xs sm:text-sm">
                {item.growth}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
