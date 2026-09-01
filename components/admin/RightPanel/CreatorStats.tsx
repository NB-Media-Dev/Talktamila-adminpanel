"use client";

import React from "react";
import { Users, TrendingUp, Clock, IndianRupee } from "lucide-react";

interface StatItem {
  id: number;
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

export default function CreatorStats() {
  const stats: StatItem[] = [
    {
      id: 1,
      label: "Today's Revenue",
      value: "₹12,480",
      change: "+18%",
      icon: <IndianRupee className="w-4 h-4 text-[#FF6B35]" />,
    },
    {
      id: 2,
      label: "Followers",
      value: "482K",
      change: "+2.4K",
      icon: <Users className="w-4 h-4 text-[#FF6B35]" />,
    },
    {
      id: 3,
      label: "Growth",
      value: "8.6%",
      change: "30d",
      icon: <TrendingUp className="w-4 h-4 text-[#FF6B35]" />,
    },
    {
      id: 4,
      label: "Performance",
      value: "94",
      change: "Score",
      icon: <Clock className="w-4 h-4 text-[#FF6B35]" />,
    },
  ];

  return (
    <div className="@container grid grid-cols-2 gap-3.5 sm:gap-4 w-full max-w-full">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-[28px] sm:rounded-[32px] p-4.5 sm:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-gray-100/80 flex flex-col justify-between hover:shadow-md transition-all duration-300 group select-none"
        >
          {/* Top Icon */}
          <div className="w-7 h-7 rounded-full bg-[#FFF2EC] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
            {stat.icon}
          </div>

          {/* Main Stat Value & Label */}
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
              {stat.value}
            </h3>

            <span className="text-[11px] sm:text-xs font-semibold text-gray-400 block mt-1">
              {stat.label}
            </span>

            {/* Change Tag */}
            <span className="text-[11px] sm:text-xs font-bold text-[#FF6B35] block mt-1">
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

