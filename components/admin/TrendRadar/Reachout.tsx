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
      tag: "#Agriculture",
      time: "2h ago",
      title: "Pongal 2024 Campaign Strategies",
      description: "AI-driven marketing trends for the upcoming festive season are peaking.",
      metricType: "rising",
      metricLabel: "Rising 15%",
      posts: "24.5K Posts",
    },
    {
      id: 2,
      tag: "#TechTamil",
      time: "5h ago",
      title: "Tamil LLM Breakthroughs",
      description: "New open-source models optimized for Tamil language processing released.",
      metricType: "viral",
      metricLabel: "Viral Now",
      posts: "89.2K Posts",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-full bg-white rounded-[32px] p-6 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.015)] border border-[#FFEFE0] flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,107,53,0.05)] hover:scale-[1.01] group cursor-pointer"
          >
            {/* Top Row: Tag and Time */}
            <div className="flex items-center justify-between w-full">
              <span className="bg-[#FCEDE2] text-[#8A5237] text-[11px] sm:text-xs font-bold py-1 px-3.5 rounded-full select-none">
                {item.tag}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {item.time}
              </span>
            </div>

            {/* Middle Section: Title and Description */}
            <div className="my-5 flex-grow">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug tracking-tight mb-2 group-hover:text-[#FF5A26] transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-gray-500 font-medium text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Divider Line */}
            <div className="w-full h-[1px] bg-gray-100/80 mb-4" />

            {/* Footer Section */}
            <div className="flex items-center justify-between w-full">
              {/* Metric label with Icon */}
              <div className="flex items-center gap-1.5 select-none">
                {item.metricType === "rising" ? (
                  <TrendingUp className="w-4 h-4 text-[#C15C3D]" />
                ) : (
                  <Flame className="w-4 h-4 text-[#FF5A26] fill-[#FF5A26]/10" />
                )}
                <span className="text-xs sm:text-sm font-bold text-gray-800">
                  {item.metricLabel}
                </span>
              </div>

              {/* Post Count */}
              <span className="text-xs text-gray-400 font-semibold">
                {item.posts}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
