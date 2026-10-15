"use client";

import { X, FileText, Download, Eye, Verified } from "lucide-react";

interface DocumentNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export default function DocDownload({ isVisible, onClose, onDownload }: DocumentNotificationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 w-full  flex items-center justify-center bg-black/30 p-4 font-sans text-[#2B211B] antialiased backdrop-blur-xs">
      <div className="overflow-hidden rounded-[24px] border border-[#F4ECE4] bg-white p-5 shadow-2xl">
        
      
        <div className="flex items-start justify-between border-b border-[#FAF6F0] pb-2.5">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF0E8] text-[#FF5E13]">
              <Verified size={24} className="fill-current text-[#FF5E13] stroke-white" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <h3 className="text-sm font-extrabold tracking-tight">Verified Document Ready</h3>
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                <span className="font-mono text-xs font-semibold text-[#766960]">ஆவணம் தயார்</span>
              </div>
              <p className="mt-0.5 font-mono text-[10px] font-semibold text-[#A59990] tracking-wide ">
                <span className="text-[#FF5E13]">CMRL Digital Seal #TN-2025</span> • SHA-256 Validated
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

       
        <div className="mt-4 rounded-2xl bg-[#FAF6F0]/50 border border-[#F4ECE4] p-3.5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <FileText size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-sm font-extrabold leading-snug">
                Corridor 4 Detailed Project Report & Blueprint
              </h4>
              <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[12px] font-semibold text-[#766960]">
                <span>12.4 MB</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#665C59]" />
                <span>Vector PDF</span>
               <span className="h-1.5 w-1.5 rounded-full bg-[#E1BFB5]" />
                <span className="text-[#FF5E13]">Poonamallee to Lighthouse</span>
              </p>
            </div>
          </div>
        </div>

      
        <div className="mt-4 flex items-center justify-between gap-4">
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-bold text-[#766960] hover:text-[#2B211B] transition"
          >
            <Eye size={14} className="text-[#A59990]" />
            Preview Online
          </button>

          <button
            type="button"
            onClick={onDownload}
            className="flex items-center gap-2 rounded-xl bg-[#FF5E13] px-5 py-2.5 text-xs font-extrabold text-white shadow-xs transition hover:bg-[#E04D08] active:scale-[0.98]"
          >
            <Download size={14} />
            Download Now (பதிவிறக்கு)
          </button>
        </div>

      </div>
    </div>
  );
}

