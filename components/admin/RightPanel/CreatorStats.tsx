"use client";

import React from "react";
import { Users, TrendingUp, Compass, IndianRupee } from "lucide-react";

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
      icon: <IndianRupee className="w-4 h-4" />,
    },
    {
      id: 2,
      label: "Followers",
      value: "482K",
      change: "+2.4K",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: 3,
      label: "Growth",
      value: "8.6%",
      change: "30d",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 4,
      label: "Performance",
      value: "94",
      change: "Score",
      icon: <Compass className="w-4 h-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 w-xs max-w-4xl">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="bg-white rounded-[24px] p-4.5 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col justify-between hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5"
        >

          <div className="w-8 h-8 rounded-lg bg-[#FFF2EC] text-[#FF5A26] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
            {stat.icon}
          </div>

          <div className="mt-3.5">
    
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
              {stat.value}
            </h3>

            <span className="text-[0.6875rem] font-semibold text-gray-400 block mt-1">
              {stat.label}
            </span>
          </div>

          <span className="text-[0.6875rem] font-bold text-[#FF5A26] mt-2 bg-[#FFF2EC] px-2 py-0.5 rounded-full w-fit">
            {stat.change}
          </span>
        </div>
      ))}
    </div>
  );
}
