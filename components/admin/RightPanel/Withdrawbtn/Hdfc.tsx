"use client";

import { useState } from "react";
import { X, ShieldCheck, ArrowLeft, Send, LucideRotateCcwClock, Landmark, Wallet, Zap, Smartphone, BadgeCheck, Clock } from "lucide-react";

export default function Hdfc({ onClose }: { onClose: () => void }) {
  const [otp, setOtp] = useState(["7", "2", "9", "", "", ""]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);
  };

  return (
    
    <div className="w-full max-w-md mx-auto border border-gray-100 rounded-[28px] p-5 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col max-h-[90vh] overflow-hidden select-none font-sans text-gray-800">
     
      <div className="flex justify-between items-start w-full pb-3 border-b border-gray-100 shrink-0">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[12px] font-black uppercase tracking-wider text-[#E05319]">
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-[10px] font-black">
            <LucideRotateCcwClock size={15}  />
            </div>
            <span>Step 2 of 3 • Authentication</span>
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-gray-950 mt-1">
            Confirm Transfer to HDFC
          </h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-wide leading-tight">
            HDFC வங்கி பரிமாற்ற உறுதிப்படுத்தல் & 2FA சரிபார்ப்பு
          </p>
        </div>
        <button 
          type="button" 
          onClick={onClose}
          className="p-1 rounded-full text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
        >
          <X size={18} />
        </button>
      </div>

   
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4 pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        
       
        <div className="border border-[#F7EFE9] bg-[#FAF6F2] rounded-2xl p-3 flex justify-between items-center gap-4 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center text-[#E05319] shrink-0 shadow-3xs">
              <Landmark size={16} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-gray-900 leading-tight">
                HDFC Direct Settlement
              </span>
              <span className="text-[10px] font-semibold text-gray-400 mt-0.5 font-mono truncate">
                A/C •••• 1267 • IFSC: HDFCOOO1042
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-black text-gray-600 bg-white border border-[#FFD2BE] px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 shadow-3xs">
            <span className="w-2 h-2 rounded-full bg-[#E05319] " />
            <span>IMPS Direct Rail</span>
          </div>
        </div>

    
        <div className="flex flex-col items-center justify-center py-1 text-center w-full shrink-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
            Disbursement Amount
          </span>
          <div className="flex items-baseline justify-center text-[#E05319] font-black tracking-tight select-all">
            <span className="text-xl mr-0.5 font-bold">₹</span>
            <span className="text-3xl">10,000</span>
            <span className="text-base opacity-80 font-bold">.00</span>
          </div>
          <p className="text-[10px] font-semibold text-gray-500 mt-2 flex items-center justify-center gap-1 bg-gray-50 border px-3 py-1 rounded-lg">
            <Wallet size={14} /> Deducted from creator balance: <span className="font-extrabold text-gray-800">12,450.00</span>
          </p>
        </div>

        <div className="border border-gray-150 rounded-2xl p-3.5 border-[#F7EFE9] bg-[#FAF6F2]  shadow-2xs flex flex-col gap-2.5 text-xs font-medium shrink-0">
          <div className="flex justify-between items-center">
            <span className="opacity-60">Remaining Balance</span>
            <span className="font-bold text-gray-900">2,450.00 (Unclaimed)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-60">Verified Beneficiary</span>
            <span className="font-bold text-gray-900 flex items-center gap-1">
              Karthik Raja 
              <span className="text-emerald-600 text-[8px] font-black "><BadgeCheck size={15}/></span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="opacity-60">Processing Platform Fee</span>
            <span className="font-black text-emerald-600  px-2 py-0.5 text-[10px]  uppercase tracking-wide">
              <span className="font-extrabold text-orange-500"> ₹0.00</span> <span className="font-bold border border-gray-300 bg-gray-200 rounded-full  px-2 py-0.5 text-gray-700">Waived</span> 
            </span>
          </div>
          <div className="flex justify-between items-center border-t pt-2.5 mt-0.5">
            <span className="opacity-60 flex items-center gap-1"><Zap size={14} className="text-orange-500" /> Estimated Time</span>
            <span className="font-extrabold text-gray-900">Instant (&lt; 60 seconds)</span>
          </div>
        </div>

      
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex justify-between items-center px-0.5 text-[10px] sm:text-xs font-bold">
            <span className="flex items-center gap-1 text-gray-700">
              <Smartphone size={14} className="text-orange-500" /> Enter 6-digit OTP
            </span>
            <span className="opacity-50">
              Sent to +91 98400 •••••
            </span>
          </div>
          <div className="grid grid-cols-6 gap-2 w-full">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, idx)}
                placeholder="•"
                className={`w-full aspect-square border text-center font-mono text-sm font-extrabold rounded-xl transition-all shadow-3xs outline-none ${
                  digit 
                    ? "bg-white border-[#E05319] text-gray-900 shadow-2xs" 
                    : "bg-[#FAF6F2] border-gray-100 placeholder:text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center px-0.5 text-[10px] font-bold mt-0.5">
            <span className="opacity-50 flex items-center gap-1">
              <Clock size={14} className="text-orange-500" /> Resend available in <span className="text-gray-800">0:42</span>
            </span>
            <button 
              type="button" 
              className="text-[#E05319] hover:underline opacity-40 cursor-not-allowed"
              disabled
            >
              Resend OTP
            </button>
          </div>
        </div>

       
        <div className="w-full py-2 bg-[#FAF6F2] border border-[#F7EFE9] rounded-xl flex items-center justify-center gap-1.5 text-[9px] font-black text-gray-500 tracking-wide shrink-0">
          <ShieldCheck size={12} className="text-orange-600" />
          <span>256-Bit Bank-grade Encryption • RBI Regulated Gateway</span>
        </div>

      </div>

    
      <div className="flex items-center gap-2.5 w-full pt-3 border-t border-gray-100 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-3 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-black text-gray-700 cursor-pointer transition-all active:scale-98 flex items-center justify-center gap-1 shrink-0"
        >
          <ArrowLeft size={14} />
          <span>Back / Edit</span>
        </button>

        <button
          type="submit"
          className="flex-1 py-3 bg-[#E05319] hover:bg-[#C94713] text-white font-extrabold text-xs sm:text-sm rounded-full shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Confirm & Transfer ₹10,000</span>
          <Send size={14} className="opacity-80 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

    </div>
  );
}

