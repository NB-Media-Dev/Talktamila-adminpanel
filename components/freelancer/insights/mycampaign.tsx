"use client";

import React from "react";
import { Megaphone, Newspaper } from "lucide-react";

export interface CampaignItem {
  id: string;
  title: string;
  reward: string;
  status: string;
  icon: "megaphone" | "newspaper";
}

export interface MyCampaignProps {
  title?: string;
  campaigns?: CampaignItem[];
  className?: string;
  onViewAll?: () => void;
}

const defaultCampaigns: CampaignItem[] = [
  {
    id: "mc-1",
    title: "Election Awareness 2024",
    reward: "Reward ₹250 / 1K Imp.",
    status: "Active",
    icon: "megaphone",
  },
  {
    id: "mc-2",
    title: "Tamil Nadu Updates",
    reward: "Reward ₹150 / 1K Imp.",
    status: "Active",
    icon: "newspaper",
  },
];

export default function MyCampaign({
  title = "My Campaigns",
  campaigns = defaultCampaigns,
  className = "",
  onViewAll,
}: MyCampaignProps) {
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
          className="text-xs font-bold text-[#C04808] hover:underline transition-all cursor-pointer"
        >
          View All
        </button>
      </div>


      <div className="flex flex-col gap-3">
        {campaigns.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 p-1 rounded-2xl hover:bg-gray-50/80 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
           
              <div className="w-10 h-10 rounded-2xl bg-[#FFF2EC] text-[#C04808] flex items-center justify-center shrink-0">
                {item.icon === "megaphone" ? (
                  <Megaphone className="w-5 h-5" />
                ) : (
                  <Newspaper className="w-5 h-5" />
                )}
              </div>

       
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-400 font-medium truncate mt-0.5">
                  {item.reward}
                </p>
              </div>
            </div>

          
            <span className="bg-[#E8F8F0] text-[#10B981] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#D1F2E2] shrink-0">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
