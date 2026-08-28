"use client";

import React from "react";
import { Megaphone, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export interface AnnouncementProps {
  title?: string;
  timeAgo?: string;
  badgeText?: string;
  platform?: string;
  className?: string;
  onRepostNow?: () => void;
  onPreview?: () => void;
}

export default function Announcement({
  title = "Election Awareness 2024",
  timeAgo = "6 hours ago",
  badgeText = "Official Campaign",
  platform = "FACEBOOK",
  className = "",
  onRepostNow,
  onPreview,
}: AnnouncementProps) {
  return (
    <div
      className={`w-full bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 ${className}`}
    >
    
      <div className="flex items-center gap-3">
       
        <div className={`${buttonVariants({variant:'ghost'})}`}>
          <Megaphone className="w-5 h-5" />
        </div>

      
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
              {title}
            </h3>
            <CheckCircle2 className="w-4 h-4 text-[#C04808] fill-[#C04808] text-white shrink-0" />
          </div>
          <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
            {timeAgo} • {badgeText}
          </p>
        </div>
      </div>

    
      <div className="mt-1">
        <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block">
          PLATFORM: {platform}
        </span>
      </div>

   
      <div className="flex items-center gap-3 mt-1">
        <button
          type="button"
          onClick={onRepostNow}
          className={`flex-1 ${buttonVariants({variant:'default'})} sm:text-sm py-2.5 px-4 rounded-full text-center shadow-xs `}
        >
          Repost Now
        </button>
        <button
          type="button"
          onClick={onPreview}
          className={`flex-1  ${buttonVariants({variant:'outline'})} text-xs sm:text-sm py-2.5 px-4 rounded-full`}
        >
          Preview
        </button>
      </div>
    </div>
  );
}
