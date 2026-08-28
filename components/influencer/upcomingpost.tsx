"use client";

import { InstagramIcon, YoutubeIcon } from "@/public/Svgicons/svgicons";
import React from "react";
import { buttonVariants } from "../ui/Button";




export interface UpcomingPostItem {
  id: string;
  thumbnail: string;
  title: string;
  date: string;
  time: string;
  platform: "Instagram" | "YouTube";
  status: "Scheduled" | "Draft";
}

const upcomingPostsData: UpcomingPostItem[] = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300&q=80",
    title: "Dubai Travel Vlog",
    date: "28 May 2025",
    time: "06:00 PM",
    platform: "Instagram",
    status: "Scheduled",
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=300&q=80",
    title: "Packing Tips for Travel",
    date: "30 May 2025",
    time: "07:30 PM",
    platform: "YouTube",
    status: "Scheduled",
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
    title: "Top 10 Beaches in India",
    date: "01 Jun 2025",
    time: "06:00 PM",
    platform: "Instagram",
    status: "Scheduled",
  },
  {
    id: "4",
    thumbnail: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=300&q=80",
    title: "Travel Photography Tips",
    date: "03 Jun 2025",
    time: "08:30 PM",
    platform: "Instagram",
    status: "Scheduled",
  },
];

export default function UpcomingPost() {
  return (
    <div className="w-full bg-white rounded-[20px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] select-none">
     
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
          Upcoming Posts
        </h3>
        <button className={`${buttonVariants({variant:'link'})} text-sm`}>
          View All
        </button>
      </div>

      
      <div className="flex flex-col divide-y divide-gray-100">
        {upcomingPostsData.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0 group hover:bg-gray-50/50 rounded-xl transition-colors -mx-1 px-1 gap-2"
          >
            
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>

        
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="shrink-0">
                    {post.platform === "Instagram" ? <InstagramIcon /> : <YoutubeIcon />}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#FF6B35] transition-colors">
                    {post.title}
                  </h4>
                </div>
                <p className="text-[10px] sm:text-[11px] font-medium text-gray-400 mt-0.5 truncate">
                  {post.date} &nbsp;•&nbsp; {post.time}
                </p>
              </div>
            </div>

            
            <div className="shrink-0">
              <span className="inline-block px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#E0F2FE] text-[#0284C7]">
                {post.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
