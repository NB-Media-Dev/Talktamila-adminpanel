"use client";

import { useState } from "react";
import { X, Info, CheckCircle2, BanknoteArrowDown, Landmark, Zap, Clock, Folder, ArrowRight } from "lucide-react";

interface FundsProps {
  onClose: () => void;
}

export default function Funds({ onClose }: FundsProps) {
  const [transferAmount, setTransferAmount] = useState("12450");

  const availableBalance = 12450;
  const minimumLimit = 1000;


  const handleAmountChange = (val: string) => {
    const cleaned = val.replace(/[^0-9]/g, "");

    setTransferAmount(cleaned);
  };

  
  const applyPresetAmount = (value: number) => {
    setTransferAmount(String(value));
  };

  const validateWithdrawal = () => {
    const amount = Number(transferAmount);

    if (!transferAmount || amount <= 0) {
      alert("Please enter a withdrawal amount.");
      return false;
    }

    if (amount < minimumLimit) {
      alert(
        `Minimum withdrawal amount is ₹${minimumLimit.toLocaleString(
          "en-IN"
        )}.`
      );
      return false;
    }

    if (amount > availableBalance) {
      alert(
        `You can withdraw a maximum of ₹${availableBalance.toLocaleString(
          "en-IN"
        )}.`
      );
      return false;
    }

    if (amount % 100 !== 0) {
      alert("Please enter the amount in multiples of ₹100.");
      return false;
    }

    return true;
  };

  const handleProceed = () => {
    if (!validateWithdrawal()) {
      return;
    }

    const amount = Number(transferAmount);

    alert(
      `Withdrawal request of ₹${amount.toLocaleString(
        "en-IN"
      )} initiated successfully.`
    );
  };

  const formattedAmount = Number(transferAmount || 0).toLocaleString("en-IN");

  return (
    <div className="mx-auto flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-[32px] border border-gray-100 bg-white p-5 font-sans text-gray-800 shadow-[0_16px_48px_rgba(0,0,0,0.08)] sm:p-6">

      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#FFF2EC] text-sm font-black text-[#E05319]">
            <BanknoteArrowDown size={16} />
          </div>

          <h2 className="text-lg font-bold tracking-tight text-gray-950">
            Withdraw Funds
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-100 p-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto py-4 pr-1">
        <div className="flex flex-col gap-4">
         
          <div className="relative flex shrink-0 items-start justify-between gap-4 rounded-2xl border border-[#F5EBE1] bg-[#FAF6F2] p-4">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Available Balance
              </span>

              <div className="mt-0.5 flex items-baseline font-black tracking-tight text-gray-950">
                <span className="mr-0.5 text-xl font-bold">₹</span>

                <span className="text-3xl font-extrabold">
                  {availableBalance.toLocaleString("en-IN")}
                </span>

                <span className="text-base font-bold opacity-70">.00</span>
              </div>

              <span className="mt-1 text-[10px] font-medium text-gray-400">
                Minimum withdrawal limit:{" "}
                {minimumLimit.toLocaleString("en-IN")}
              </span>
            </div>

         
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#FFD2BE] bg-white px-2 py-0.5 text-[9px] font-bold text-[#E05319]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E05319]" />

                Instant Ready
              </span>

              <span className="mt-0.5 text-[10px] font-medium text-gray-400">
                No daily ceiling
              </span>
            </div>
          </div>

         
          <div className="flex shrink-0 flex-col gap-2">
            <div className="flex items-center justify-between px-0.5 text-[11px] font-bold">
              <label htmlFor="transferAmount" className="text-gray-900">
                Transfer Amount
              </label>

              <span className="font-medium text-gray-400">
                Enter in multiples of 100
              </span>
            </div>

        
            <div className="relative flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-colors focus-within:border-orange-500">
              <div className="flex w-full items-center text-lg font-bold text-gray-900">
                <span className="mr-1 opacity-70">₹</span>

                <input
                  id="transferAmount"
                  type="text"
                  inputMode="numeric"
                  value={formattedAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full border-none bg-transparent font-bold tracking-wide text-gray-900 outline-none"
                  placeholder="Enter amount"
                  aria-label="Transfer amount"
                />
              </div>

              <button
                type="button"
                onClick={() => applyPresetAmount(availableBalance)}
                className="shrink-0 cursor-pointer rounded-lg bg-[#FFF2EC] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#E05319] transition-colors hover:bg-[#FFE3D5]"
              >
                MAX
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[1000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => applyPresetAmount(amt)}
                  className="cursor-pointer truncate rounded-lg border border-gray-200 bg-white py-1.5 text-center text-[11px] font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                >
                  ₹{amt.toLocaleString("en-IN")}
                </button>
              ))}

              <button
                type="button"
                onClick={() => applyPresetAmount(availableBalance)}
                className="cursor-pointer truncate rounded-lg bg-[#FFF2EC] py-1.5 text-center text-[11px] font-bold text-[#E05319] transition-colors hover:bg-[#FFE3D5]"
              >
                Full (₹12,450)
              </button>
            </div>
          </div>

          
          <div className="flex shrink-0 flex-col gap-2">
            <div className="flex items-center justify-between px-0.5 text-[11px] font-bold">
              <span className="text-gray-900">
                Disbursement Account
              </span>

              <button
                type="button"
                className="cursor-pointer text-[11px] font-bold text-[#E05319] hover:underline"
              >
                Change Account
              </button>
            </div>

            <div className="relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm">
              <div className="flex min-w-0 items-center gap-3">
               
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#F5EBE1] bg-[#FAF6F2] text-sm text-[#E05319]">
                  <Landmark size={16} />
                </div>

                <div className="flex min-w-0 flex-col">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold leading-tight text-gray-900">
                      HDFC Bank Limited
                    </span>

                    <span className="rounded-sm border border-[#FFD2BE] bg-[#FFF2EC] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#E05319]">
                      Primary
                    </span>
                  </div>

                  <span className="mt-1 truncate font-mono text-[10px] font-semibold leading-none text-gray-400">
                    A/C ending •••• 1267 • IFSC: HDFC0001824
                  </span>

                  <span className="mt-1 truncate text-[9px] font-medium leading-none text-gray-400">
                    Beneficiary: Karthik Raja (Talk Tamila Studio)
                  </span>
                </div>
              </div>

            
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-orange-500 text-[9px] font-bold ">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          
          <div className="flex shrink-0 flex-col gap-2.5 rounded-2xl border border-gray-100 bg-white p-3.5 text-xs font-medium shadow-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600 opacity-60">
                <Zap size={14} />
                Transfer Method:
              </span>

              <span className="font-bold text-gray-900">
                IMPS 24x7 Realtime
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600 opacity-60">
                <Folder size={14} />
                Platform Payout Fee:
              </span>

              <span className="flex items-center gap-1 font-bold text-gray-900">
                <span className="text-[#E05319]">₹0.00</span>

                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  Zero Fee Waiver
                </span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-gray-600 opacity-60">
                <Clock size={14} /> Estimated Turnaround:
              </span>

              <span className="font-extrabold text-gray-900">
                Under 60 seconds
              </span>
            </div>
          </div>

          
          <div className="flex shrink-0 items-start gap-2 rounded-xl   p-3 text-[10px] leading-relaxed ">
            <Info size={14} className="mt-0.5 shrink-0" />

            <p>
              A secure 6-digit Aadhaar/Mobile OTP will be prompted to
              confirm this disbursement to Karthik Raja&apos;s verified
              account.
            </p>
          </div>
        </div>
      </div>


      <div className="mt-2 flex shrink-0 items-center gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 cursor-pointer rounded-xl border border-gray-200 bg-white px-1 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleProceed}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#E05319] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C94712] active:scale-[0.99]"
        >
          <span>Proceed to Withdraw</span>

          <span><ArrowRight size={16} /></span>
        </button>
      </div>
    </div>
  );
}

