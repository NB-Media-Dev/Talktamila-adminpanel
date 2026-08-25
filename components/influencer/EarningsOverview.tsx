"use client";

import React from "react";
import { MoveUp } from "lucide-react";

export interface EarningsOverviewProps {
  balance?: string;
  thisWeek?: string;
  thisWeekChange?: string;
  thisMonth?: string;
  thisMonthChange?: string;
  thisYear?: string;
  thisYearChange?: string;
}

export default function EarningsOverview({
  balance = "₹1,25,430.50",
  thisWeek = "₹32,450",
  thisWeekChange = "18.7%",
  thisMonth = "₹1,25,430",
  thisMonthChange = "16.8%",
  thisYear = "₹12,45,300",
  thisYearChange = "22.5%",
}: EarningsOverviewProps) {
  return (
    <div className="w-full bg-white rounded-[20px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] select-none">
     
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
          Earnings Overview
        </h3>
        <button className="text-xs sm:text-sm font-bold text-[#FF6B35] hover:text-[#F95A22] transition-colors cursor-pointer">
          View All
        </button>
      </div>

      
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-medium text-gray-400 block mb-1">
            Total Balance
          </span>
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight truncate">
            {balance}
          </div>
        </div>
        <button className="bg-[#FF6B35] hover:bg-[#F95A22] active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0">
          Withdraw
        </button>
      </div>

      
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        
        <div className="bg-[#FAFAFA] border border-gray-100/80 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between min-w-0">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 leading-tight truncate">
            This Week
          </span>
          <div className="mt-2 min-w-0">
            <div className="text-xs sm:text-sm font-bold text-gray-900 truncate">
              {thisWeek}
            </div>
            <div className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-[#10B981] mt-0.5">
              <MoveUp className="w-2.5 h-2.5 stroke-[3] shrink-0" />
              <span className="truncate">{thisWeekChange}</span>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-[#FAFAFA] border border-gray-100/80 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between min-w-0">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 leading-tight truncate">
            This Month
          </span>
          <div className="mt-2 min-w-0">
            <div className="text-xs sm:text-sm font-bold text-gray-900 truncate">
              {thisMonth}
            </div>
            <div className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-[#10B981] mt-0.5">
              <MoveUp className="w-2.5 h-2.5 stroke-[3] shrink-0" />
              <span className="truncate">{thisMonthChange}</span>
            </div>
          </div>
        </div>

      {/* Stat 3 */}
        <div className="bg-[#FAFAFA] border border-gray-100/80 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between min-w-0">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 leading-tight truncate">
            This Year
          </span>
          <div className="mt-2 min-w-0">
            <div className="text-xs sm:text-sm font-bold text-gray-900 truncate">
              {thisYear}
            </div>
            <div className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-bold text-[#10B981] mt-0.5">
              <MoveUp className="w-2.5 h-2.5 stroke-[3] shrink-0" />
              <span className="truncate">{thisYearChange}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
