"use client";

import React from "react";
import { MoveUp } from "lucide-react";
import { buttonVariants } from "../ui/Button";

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
        <button className={` ${buttonVariants({variant:'link'})} text-xs sm:text-sm `}>
          View All
        </button>
      </div>

      {/* Total Balance Row */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold text-gray-400 block mb-1">
            Total Balance
          </span>
          <div className="text-base sm:text-lg lg:text-xl font-black text-gray-900 tracking-tight whitespace-nowrap">
            {balance}
          </div>
        </div>
        <button className={`${buttonVariants({variant:'default'})} text-xs sm:text-sm px-4 py-2 whitespace-nowrap shrink-0`}>
          Withdraw
        </button>
      </div>

      {/* Stats Breakdown Row */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        {/* Stat 1 */}
        <div className="bg-[#FAFAFA] border border-gray-100/80 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 leading-tight whitespace-nowrap">
            This Week
          </span>
          <div className="mt-1.5 sm:mt-2">
            <div className="text-xs sm:text-sm font-extrabold text-gray-900 whitespace-nowrap">
              {thisWeek}
            </div>
            <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-[#10B981] mt-0.5 whitespace-nowrap">
              <MoveUp className="w-2.5 h-2.5 stroke-[3] shrink-0" />
              <span>{thisWeekChange}</span>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-[#FAFAFA] border border-gray-100/80 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 leading-tight whitespace-nowrap">
            This Month
          </span>
          <div className="mt-1.5 sm:mt-2">
            <div className="text-xs sm:text-sm font-extrabold text-gray-900 whitespace-nowrap">
              {thisMonth}
            </div>
            <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-[#10B981] mt-0.5 whitespace-nowrap">
              <MoveUp className="w-2.5 h-2.5 stroke-[3] shrink-0" />
              <span>{thisMonthChange}</span>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-[#FAFAFA] border border-gray-100/80 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 leading-tight whitespace-nowrap">
            This Year
          </span>
          <div className="mt-1.5 sm:mt-2">
            <div className="text-xs sm:text-sm font-extrabold text-gray-900 whitespace-nowrap">
              {thisYear}
            </div>
            <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-[#10B981] mt-0.5 whitespace-nowrap">
              <MoveUp className="w-2.5 h-2.5 stroke-[3] shrink-0" />
              <span>{thisYearChange}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}
