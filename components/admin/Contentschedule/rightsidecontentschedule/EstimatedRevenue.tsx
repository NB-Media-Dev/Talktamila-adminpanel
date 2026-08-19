"use client";

import { Banknote } from "lucide-react";

export default function EstimatedRevenue() {
  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col justify-between select-none hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div>
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-[10px]  tracking-[0.15em] text-gray-400 uppercase">
              ESTIMATED REVENUE
            </span>
            <h2 className="text-3xl sm:text-4xl  text-gray-900 mt-2 tracking-tight">
              ₹1,84,320
            </h2>
          </div>
          <div className=" p-2.5 bounder-gray-100/70 rounded-2xl flex items-center justify-center shrink-0">
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
  );
}
