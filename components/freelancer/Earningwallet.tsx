"use client";


import { Landmark } from "lucide-react";
import { buttonVariants } from "../ui/Button";

export interface EarningWalletProps {
  title?: string;
  availableBalance?: string;
  pendingBalance?: string;
  thisMonthBalance?: string;
  totalBalance?: string;
  bankName?: string;
  bankAccountLast4?: string;
  onWithdraw?: () => void;
  onViewDetails?: () => void;
  onChangeBank?: () => void;
  className?: string;
}

export default function Earningwallet({
  title = "Earnings Wallet",
  availableBalance = "₹12,450.00",
  pendingBalance = "₹3,230",
  thisMonthBalance = "₹18,450",
  totalBalance = "₹86,200",
  bankName = "Bank Transfer",
  bankAccountLast4 = "4567",
  onWithdraw,
  onViewDetails,
  onChangeBank,
  className = "",
}: EarningWalletProps) {
  return (
    <div
      className={`w-full max-w-full bg-white rounded-[28px] p-4 sm:p-6 border border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] select-none flex flex-col gap-4 ${className}`}
    >

      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl text-gray-900 tracking-tight">
          {title}
        </h3>
        <button
          type="button"
          onClick={onViewDetails}
          className="text-xs sm:text-sm text-[#B84218] hover:text-[#9A3412] transition-colors cursor-pointer active:scale-95"
        >
          View Details
        </button>
      </div>


      <div className="-mt-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
          Available Balance
        </span>
        <div className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {availableBalance}
        </div>
      </div>


      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">

        <div className="bg-[#F0F4F8]/70 border border-gray-100/60 rounded-[20px] p-2 sm:p-3 flex flex-col items-center justify-center text-center min-w-0">
          <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 leading-tight truncate max-w-full">
            Pending
          </span>
          <span className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 truncate max-w-full">
            {pendingBalance}
          </span>
        </div>


        <div className="bg-[#F0F4F8]/70 border border-gray-100/60 rounded-[20px] p-2 sm:p-3 flex flex-col items-center justify-center text-center min-w-0">
          <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 leading-tight truncate max-w-full">
            This Month
          </span>
          <span className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 truncate max-w-full">
            {thisMonthBalance}
          </span>
        </div>


        <div className="bg-[#F0F4F8]/70 border border-gray-100/60 rounded-[20px] p-2 sm:p-3 flex flex-col items-center justify-center text-center min-w-0">
          <span className="text-[10px] sm:text-[11px] font-medium text-gray-400 leading-tight truncate max-w-full">
            Total
          </span>
          <span className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5 truncate max-w-full">
            {totalBalance}
          </span>
        </div>
      </div>


      <button
        type="button"
        onClick={onWithdraw}
        className={`w-full py-3 px-3 active:scale-[0.98] ${buttonVariants({ variant: 'default' })} text-xs sm:text-sm font-bold rounded-full shadow-[0_6px_20px_rgba(255,107,53,0.3)] transition-all cursor-pointer flex items-center justify-center`}
      >
        Withdraw Funds
      </button>

      <div className="border border-gray-200/70 rounded-full px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2 bg-white">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-700 shrink-0">
            <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-semibold text-gray-900 leading-tight truncate">
              {bankName}
            </span>
            <span className="text-[11px] font-medium text-gray-400 leading-none mt-0.5">
              •••• {bankAccountLast4}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeBank}
          className="text-xs font-semibold text-[#B84218] hover:text-[#9A3412] transition-colors cursor-pointer shrink-0 active:scale-95"
        >
          Change
        </button>
      </div>
    </div>
  );
}
