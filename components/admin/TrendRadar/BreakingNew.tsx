"use client";

import React, { useState } from "react";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { ContentSkeleton } from "@/components/ui/Skeletonloading";

interface NewsAlert {
  id: number;
  title: string;
  time: string;
}

export default function BreakingNew() {
  const alerts: NewsAlert[] = [
    {
      id: 1,
      title: "சென்னை மெட்ரோ இரண்டாம் கட்டப் பணிகள் துவக்கம்",
      time: "3m",
    },
    {
      id: 2,
      title: "தமிழ்நாட்டில் புதிய தொழில் 1200",
      time: "18m",
    },
    {
      id: 3,
      title: "கோவை விமான நிலையம் விரிவாக்கம் அறிவிப்பு",
      time: "45m",
    },
  ];

   const [isLoading, setIsLoading] = useState( true);
  UsetimeoutLoader(setIsLoading);

 
  return (
    <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.015)] border border-[#FFEFE0] flex flex-col gap-5 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,107,53,0.05)]">
      
      <div className="flex items-center justify-between w-full select-none">
        <h2 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
          Breaking News
        </h2>
        <span className="text-xs sm:text-sm font-semibold text-[#FF6B35] hover:text-[#D9652B] transition-colors cursor-pointer">
          View All
        </span>
      </div>
      {isLoading ? <ContentSkeleton height="h-[30px]" width="w-full"/> :<div className="flex flex-col gap-4">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3.5"
          >
            <span className="bg-[#E86B3E] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 min-w-[38px] text-center select-none">
              {item.time}
            </span>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug hover:text-[#FF5A26] transition-colors duration-150 cursor-pointer select-text">
              {item.title}
            </p>
          </div>
        ))}
      </div> }
      

    </div>
  );
}
