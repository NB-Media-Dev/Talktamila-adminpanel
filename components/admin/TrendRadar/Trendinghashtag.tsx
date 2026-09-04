"use client";

import React, { useState } from "react";
import { RotateCw, ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { ContentSkeleton } from "@/components/ui/Skeletonloading";

interface HashtagItem {
  id: number;
  tag: string;
  interactions: string;
  growth: string;
}

interface TrendinghashtagProps {
  compact?: boolean;
  isLoading?: boolean;
}

const getRandomGrowthPercentage = (): string => {
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  const randomVal = (randomArray[0] / 4294967296) * 100;
  return `+${Math.floor(randomVal) + 30}%`;
};

const updateHashtagsGrowth = (prevList: HashtagItem[]): HashtagItem[] =>
  prevList.map((item) => ({
    ...item,
    growth: getRandomGrowthPercentage(),
  }));

export default function Trendinghashtag({ compact = false, isLoading: propIsLoading }: TrendinghashtagProps) {
  const [isLoading, setIsLoading] = useState(propIsLoading ?? true);
  UsetimeoutLoader(setIsLoading);
  const [isRotating, setIsRotating] = useState(false);
  const [hashtags, setHashtags] = useState<HashtagItem[]>([
    { id: 1, tag: "#தமிழ்நாடு", interactions: "124K interactions", growth: "+128%" },
    { id: 2, tag: "#ChennaiRains", interactions: "98K interactions", growth: "+98%" },
    { id: 3, tag: "#TamilCinema", interactions: "456K interactions", growth: "+74%" },
    { id: 4, tag: "#StartupTN", interactions: "82K interactions", growth: "+61%" },
  ]);

  const handleRefresh = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
      setHashtags(updateHashtagsGrowth);
    }, 800);
  };

  return (
    <div className={`w-full bg-white rounded-[24px] sm:rounded-[32px] ${compact ? "p-3 sm:p-5" : "p-6 sm:p-7"} shadow-[0_8px_30px_rgba(0,0,0,0.015)] border border-[#FFEFE0] flex flex-col ${compact ? "gap-3" : "gap-6"} transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,107,53,0.05)]`}>
      
      <div className={`flex items-center justify-between w-full select-none ${compact ? "pb-1" : "pb-2"}`}>
        <h2 className={`font-bold text-gray-900 tracking-tight flex items-center gap-0.5 ${compact ? "text-[11px] xs:text-[13px] sm:text-lg" : "text-lg sm:text-xl"}`}>
          {compact && <span className="text-[#FF5A26]">#</span>}
          Trending Hashtags
        </h2>
        {!compact && (
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-full text-gray-400 hover:text-[#FF5A26] hover:bg-[#FFF6ED] active:scale-90 transition-all duration-200 cursor-pointer"
            title="Refresh Trends"
          >
            <RotateCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isRotating ? "animate-spin text-[#FF5A26]" : ""}`} />
          </button>
        )}
      </div>

      <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-5"}`}>
        {isLoading ? (
          <ContentSkeleton count={4} height="h-[50px]" />
        ) : (
          hashtags.map((item) => (

          <div
            key={item.id}
            className={`flex items-center justify-between group hover:bg-[#FFF9F5]/40 rounded-xl transition-all duration-200 ${
              compact ? "-mx-1 px-1 py-1" : "-mx-3 px-3 py-1.5"
            }`}
          >
        
            <div className="flex flex-col min-w-0">
              <span className={`font-bold text-gray-800 transition-colors duration-200 group-hover:text-[#FF5A26] truncate ${compact ? "text-[11px] xs:text-xs sm:text-base" : "text-sm sm:text-base"}`}>
                {item.tag}
              </span>
              {!compact && (
                <span className="text-xs text-gray-400 font-semibold mt-0.5">
                  {item.interactions}
                </span>
              )}
            </div>

            <div className={`flex items-center gap-0.5 text-[#FF5A26] font-bold select-none shrink-0 ${compact ? "text-[10px] xs:text-xs sm:text-base" : "text-sm sm:text-base"}`}>
              <ArrowUpRight className={`${compact ? "w-3 h-3" : "w-4 h-4"} transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} />
              <span>{item.growth}</span>
            </div>
          </div>
        )))
        }
      </div>

      {!compact && !isLoading && (
        <div className="w-full pt-2">
          <button className={`w-full ${buttonVariants({variant:'hoverButton'})} font-bold text-sm sm:text-base py-3 px-6`}>
            Explore More Topics
          </button>
        </div>
      )}

    </div>
  );
}
