"use client";

import { Banknote } from "lucide-react";

export default function EstimatedRevenue() {
  return (
    <>
      {/* Mobile & Tablet Card: Vibrant Orange Variant */}
      <div className="block lg:hidden w-full bg-[#E5632A] rounded-[20px] sm:rounded-[32px] p-3 sm:p-5 text-white shadow-[0_8px_30px_rgba(229,99,42,0.18)] flex flex-col justify-between select-none min-w-0 aspect-[142/141] min-[420px]:aspect-auto">
        <div>
          {/* Top Header */}
          <div className="flex justify-between items-start gap-1">
            <div className="flex flex-col min-w-0">
              <span className="text-[7.5px] min-[420px]:text-[9px] sm:text-[10px] font-extrabold tracking-[0.12em] text-white/70 uppercase">
                ESTIMATED REVENUE
              </span>
            </div>
            <div className="bg-white/20 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shrink-0">
              <Banknote className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Amount */}
          <h2 className="text-base min-[420px]:text-xl sm:text-2xl md:text-3xl font-black text-white mt-1 sm:mt-2 tracking-tight truncate">
            ₹1,84,320
          </h2>

          {/* Available Now Bar */}
          <div className="bg-white/15 rounded-xl px-2 sm:px-3.5 py-1 sm:py-2 flex justify-between items-center mt-1.5 sm:mt-3 mb-1.5 sm:mb-3">
            <span className="text-[7.5px] min-[420px]:text-[9.5px] sm:text-xs text-white/80 font-medium italic">Available now</span>
            <span className="text-[8px] min-[420px]:text-xs sm:text-sm font-black text-white">₹45,200</span>
          </div>
        </div>

        {/* Withdraw to Bank Button */}
        <button className="w-full py-1.5 sm:py-2.5 bg-white hover:bg-orange-50 active:scale-[0.98] text-[#E5632A] text-[9.5px] min-[420px]:text-xs sm:text-sm font-extrabold rounded-xl sm:rounded-2xl transition-all duration-200 text-center shadow-xs cursor-pointer truncate">
          Withdraw to Bank
        </button>
      </div>

      {/* Desktop Card: Original White Card Design (UNTOUCHED) */}
      <div className="hidden lg:flex w-full bg-white rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex-col justify-between select-none hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div>
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-[0.15em] text-gray-400 uppercase">
                ESTIMATED REVENUE
              </span>
              <h2 className="text-3xl sm:text-4xl text-gray-900 mt-2 tracking-tight">
                ₹1,84,320
              </h2>
            </div>
            <div className="p-2.5 rounded-2xl flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-gray-50/70 border border-[#FFEFE0]/60 rounded-2xl px-4 py-3 flex justify-between items-center mt-5 mb-5">
            <span className="text-xs font-medium text-gray-500 italic">Available now</span>
            <span className="text-xs font-black text-gray-900">₹45,200</span>
          </div>
        </div>

        <button className="w-full py-3.5 border border-[#F27D42]/20 hover:border-[#F27D42] hover:bg-[#FFF2EC]/30 text-[#F27D42] text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-200 text-center active:scale-[0.98] cursor-pointer">
          Withdraw to Bank
        </button>
      </div>
    </>
  );
}
