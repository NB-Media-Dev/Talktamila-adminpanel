"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface NewsAlert {
  id: number;
  title: string;
  time: string;
  hasIndicator: boolean;
}

export default function BreakingNew() {
  const alerts: NewsAlert[] = [
    {
      id: 1,
      title: "சென்னை மெட்ரோ Phase II: புதிய சுரங்கப்பாதை அமைக்கும் பணிகள் துவக்கம்",
      time: "2 mins ago",
      hasIndicator: true,
    },
    {
      id: 2,
      title: "Tamil Nadu Global Investors Meet dates announced",
      time: "16 mins ago",
      hasIndicator: false,
    },
  ];

  return (
    <div className="w-full bg-[#F4F7FA] rounded-[32px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.01)] border border-[#FFEFE0] flex flex-col gap-5 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
      
  
      <div className="flex items-center gap-2 select-none">
        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#B22222] fill-[#B22222]" />
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Breaking News
        </h2>
      </div>

   
      <div className="flex flex-col gap-5">
        {alerts.map((item) => (
          <div
            key={item.id}
            className={`flex flex-col gap-1 ${
              item.hasIndicator
                ? "border-l-3 border-[#A33F0F] pl-3.5 py-0.5"
                : "pl-3.5"
            }`}
          >
            <p className="text-sm font-semibold text-gray-800 leading-snug hover:text-[#FF5A26] transition-colors duration-150 cursor-pointer">
              {item.title}
            </p>
            <span className="text-xs text-gray-400 font-medium mt-0.5 select-none">
              {item.time}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
