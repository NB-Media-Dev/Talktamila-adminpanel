"use client";

import { buttonVariants } from "@/components/ui/Button";
import React from "react";

export interface TrendingItem {
  id: string;
  title: string;
  isHot?: boolean;
  reward: string;
  imageUrl: string;
}

export interface TrendingRepostProps {
  title?: string;
  items?: TrendingItem[];
  className?: string;
  onViewAll?: () => void;
}

const defaultTrending: TrendingItem[] = [
  {
    id: "tr-1",
    title: "Chennai Flood Updates",
    isHot: true,
    reward: "₹500 / 1K Impressions",
    imageUrl:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "tr-2",
    title: "Thalavar 171 Update",
    isHot: false,
    reward: "₹250 / 1K Impressions",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=150&q=80",
  },
];

export default function TrendingRepost({
  title = "Trending Repost",
  items = defaultTrending,
  className = "",
  onViewAll,
}: TrendingRepostProps) {
  return (
    <div
      className={`w-full max-w-full bg-white rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col gap-4 ${className}`}
    >
    
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-base tracking-tight">
          {title}
        </h3>
        <button
          type="button"
          onClick={onViewAll}
       className={`${buttonVariants({variant:'link'})} text-xs `}
        >
          View All
        </button>
      </div>

      
      <div className="flex flex-col gap-3.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-50/80 transition-colors"
          >
            
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100 shadow-xs"
            />

            
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate flex items-center gap-1">
                <span>{item.title}</span>
                {item.isHot && <span className="text-xs">🔥</span>}
              </h4>
              <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                {item.reward}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
