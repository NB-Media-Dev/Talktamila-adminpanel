"use client";

import React from "react";
import { TrendingUp, Flame } from "lucide-react";

interface ReachoutItem {
  id: number;
  tag: string;
  time: string;
  title: string;
  description: string;
  metricType: "rising" | "viral";
  metricLabel: string;
  posts: string;
}

export default function Reachout() {
  const items: ReachoutItem[] = [
    {
      id: 1,
      tag: "#Approach",
      time: "1h ago",
      title: "Pongal 2024 Campaign Strategies",
      description: "AI-driven marketing strategy for the upcoming Festival season in Tamil Nadu.",
      metricType: "rising",
      metricLabel: "Rising 18%",
      posts: "2.5k Posts",
    },
    {
      id: 2,
      tag: "#TechTamil",
      time: "3h ago",
      title: "TamilLLM Breakthroughs",
      description: "New open-source model optimized for Tamil language processing released.",
      metricType: "viral",
      metricLabel: "Positive",
      posts: "8.2k Posts",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-3.5 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,107,53,0.08)] hover:scale-[1.01] group cursor-pointer"
          >
            
            <div className="flex items-center justify-between w-full">
              <span className="bg-[#FFF2EC] text-[#FF5A26] text-[10px] sm:text-xs font-extrabold py-1 px-3 rounded-full select-none">
                {item.tag}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
                {item.time}
              </span>
            </div>

            <div className="my-3 sm:my-4 flex-grow min-w-0">
              <h3 className="text-xs sm:text-base font-bold text-gray-900 leading-snug tracking-tight mb-1.5 line-clamp-2 group-hover:text-[#FF5A26] transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-500 font-medium text-[11px] sm:text-xs leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            <div className="w-full h-[1px] bg-gray-100 mb-3" />

            <div className="flex items-center justify-between w-full text-[10px] sm:text-xs font-bold text-gray-800 min-w-0">
              
              <div className="flex items-center gap-1 shrink-0">
                <TrendingUp className="w-3.5 h-3.5 text-[#FF5A26]" />
                <span className="text-[#FF5A26]">{item.metricLabel}</span>
              </div>

              <span className="text-gray-400 font-semibold truncate ml-1">
                {item.posts}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
