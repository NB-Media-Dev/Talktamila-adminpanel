"use client";

import React, { useState } from "react";
import { ChevronDown, MoveUp } from "lucide-react";
import { buttonVariants } from "../ui/Button";
import { ChartSkeleton } from "../ui/Skeletonloading";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";

export interface DailyStat {
  day: string;
  value: string | number;
  heightPercent: number;
  isPeak?: boolean;
}

export interface RepostAnalysisProps {
  title?: string;
  filterOption?: string;
  filterOptions?: string[];
  impressions?: string;
  impressionsChange?: string;
  revenue?: string;
  revenueChange?: string;
  dailyData?: DailyStat[];
  onFilterChange?: (option: string) => void;
  className?: string;
}

const defaultDailyData: DailyStat[] = [
  { day: "MON", value: "32K", heightPercent: 42 },
  { day: "TUE", value: "45K", heightPercent: 58 },
  { day: "WED", value: "58K", heightPercent: 72 },
  { day: "THU", value: "38K", heightPercent: 48 },
  { day: "FRI", value: "52K", heightPercent: 65 },
  { day: "SAT", value: "85K", heightPercent: 96, isPeak: true },
  { day: "SUN", value: "62K", heightPercent: 75 },
];

export default function Repostanalysis({
  title = "Repost Analytics",
  filterOption: initialFilter = "Last 7 Days",
  filterOptions = ["Last 7 Days", "Last 30 Days", "This Month", "All Time"],
  impressions = "245K",
  impressionsChange = "24.3%",
  revenue = "₹4,850",
  revenueChange = "18.6%",
  dailyData = defaultDailyData,
  onFilterChange,
  className = "",
}: RepostAnalysisProps) {
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    UsetimeoutLoader(setIsLoading);
  

    if (isLoading) {
      return <ChartSkeleton />;
    }

  const handleSelectFilter = (option: string) => {
    setSelectedFilter(option);
    setIsDropdownOpen(false);
    onFilterChange?.(option);
  };

  return (
    <div
      className={`w-full max-w-full bg-white rounded-[28px] p-4 sm:p-6 border border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] select-none flex flex-col gap-4 ${className}`}
    >

      <div className="flex items-center justify-between relative">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h3>


        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#F0F4F8] hover:bg-[#E4ECF3] active:scale-95 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 transition-all cursor-pointer"
          >
            <span>{selectedFilter}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 stroke-[2.5]" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 shadow-lg rounded-2xl py-1.5 z-20 overflow-hidden animate-in fade-in slide-in-from-top-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectFilter(opt)}
                  className={`w-full text-left px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${opt === selectedFilter
                      ? "bg-[#FFF2EC] text-[#FF6B35] font-bold"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">

        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-gray-400 block mb-0.5">
            Impressions
          </span>
          <div className="text-xl sm:text-2xl text-gray-900 tracking-tight leading-tight">
            {impressions}
          </div>
          <div className="flex items-center gap-0.5 text-[11px] font-bold text-[#10B981] mt-0.5">
            <MoveUp className="w-3 h-3 stroke-[3] shrink-0" />
            <span>{impressionsChange}</span>
          </div>
        </div>


        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-gray-400 block mb-0.5">
            Revenue
          </span>
          <div className="text-xl sm:text-2xl text-gray-900 tracking-tight leading-tight">
            {revenue}
          </div>
          <div className="flex items-center gap-0.5 text-[11px] font-bold text-[#10B981] mt-0.5">
            <MoveUp className="w-3 h-3 stroke-[3] shrink-0" />
            <span>{revenueChange}</span>
          </div>
        </div>
      </div>


      <div className="bg-[#F0F4F8]/70 border border-gray-100/60 rounded-[28px] p-4 sm:p-5 pt-6 flex flex-col justify-end">

        <div className="h-28 sm:h-32 flex items-end justify-between gap-1.5 sm:gap-2 px-1">
          {dailyData.map((item, index) => {
            const isHovered = hoveredBar === index;
            const isPeak = item.isPeak;

            return (
              <div
                key={item.day}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              >

                {isHovered && (
                  <div className="absolute -top-7 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-10 animate-in fade-in">
                    {item.value}
                  </div>
                )}


                <div
                  style={{ height: `${item.heightPercent}%` }}
                  className={`w-full rounded-t-lg sm:rounded-t-xl transition-all duration-300 ${isPeak
                      ? `${buttonVariants({ variant: 'default' })} shadow-[0_4px_12px_rgba(255,107,53,0.3)]`
                      : `${buttonVariants({ variant: 'secondary' })}`
                    }`}
                />
              </div>
            );
          })}
        </div>


        <div className="flex items-center justify-between gap-1.5 sm:gap-2 px-1 mt-3">
          {dailyData.map((item) => (
            <span
              key={item.day}
              className={`flex-1 text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${item.isPeak ? "text-[#FF6B35]" : "text-gray-400"
                }`}
            >
              {item.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
