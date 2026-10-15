"use client";

import { X, Mic, AudioLines } from "lucide-react";

interface VoiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: () => void;
}

export default function Speek({ isOpen, onClose, onWithdraw }: VoiceRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 font-sans text-[#2B211B] antialiased backdrop-blur-xs">
     
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close modal" />

    
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[24px] bg-white p-5 shadow-2xl border border-[#F4ECE4] animate-in fade-in zoom-in-95 duration-200">
        
       
        <div className="flex items-start justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0E8] text-[#FF5E13]">
              <Mic size={18} className="stroke-[2.5]" />
              <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-[#FF5E13] ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold tracking-tight">Voice Request Sent</h3>
                <span className="text-xs text-[#A59990]">•</span>
              </div>
              <p className="text-xs font-semibold text-[#766960] mt-0.5">
                You&apos;re <span className="text-[#FF5E13] font-bold">#3</span> in queue for Chennai Metro Phase II Stage
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="rounded-full p-1 text-[#A59990] hover:bg-[#FAF6F0] hover:text-[#2B211B] transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-[#F7F3EE] border border-[#E6E2DD] ">
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-b  border-gray-200 p-3 pt-1.5 pb-3 text-[11px] font-semibold">
          <span className="rounded-full bg-[#FF5000] px-2 py-0.5  text-[11px] text-white tracking-wider">
            #TransitAlignment
          </span>
          <span className="text-[#766960] font-medium text-[12px]">Dr. Raman moderating</span>
        </div>
     
       
        <div className="mt-3 flex items-center justify-between border-b border-[#F7F3EE] p-3 pt-1.5 pb-3.5 text-xs">
          <div className="flex items-center gap-1 font-semibold text-[#2B211B]">
            <span className="text-[#FF5E13]"><AudioLines size={14}/></span>
            <span>MacBook Pro Mic (Clear)</span>
          </div>
          <span className="font-bold text-[#FF5E13]">Est. wait ~1 min</span>
        </div>
        </div>

       
        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-[#EFE6DC] bg-[#EBE8E3] px-4 py-2 text-xs font-bold transition hover:bg-[#F2EAE1]"
          >
            <Mic size={15} className="text-[#FF5E13]" />
            Test Mic
          </button>
          
          <button
            type="button"
            onClick={onWithdraw}
            className="text-xs font-bold text-[#766960] underline transition hover:text-[#BA1A1A]"
          >
            Withdraw Request
          </button>
        </div>

      </div>
    </div>
  );
}

