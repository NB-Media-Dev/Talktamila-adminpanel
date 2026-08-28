"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowLeftToLine, ArrowRight, AtSign } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { InstagramIcon, FacebookIcon, TreadsIcon,YoutubeIcon } from "@/public/Svgicons/svgicons";

export interface RepostedItem {
  id: string;
  title: string;
  thumbnail: string;
  platform: "Instagram" | "Facebook" | "YouTube" | "Threads";
  postedDate: string;
  postedTime: string;
  impressions: string;
  earnings: string;
  status: "PUBLISHED" | "PROCESSING" | "REJECTED";
}

export interface RepostContentProps {
  title?: string;
  items?: RepostedItem[];
  maxRows?: number;
  className?: string;
  onViewAll?: () => void;
}

const defaultRepostedItems: RepostedItem[] = [
  {
    id: "rc-1",
    title: "Rain Relief Camps Campaign",
    thumbnail:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=120&q=80",
    platform: "Instagram",
    postedDate: "26 May 2024",
    postedTime: "10:30 PM",
    impressions: "45.6K",
    earnings: "₹156.80",
    status: "PUBLISHED",
  },
  {
    id: "rc-2",
    title: "Chennai Metro Phase 2 Updates",
    thumbnail:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80",
    platform: "Facebook",
    postedDate: "26 May 2024",
    postedTime: "08:15 PM",
    impressions: "32.1K",
    earnings: "₹98.60",
    status: "PROCESSING",
  },
  {
    id: "rc-3",
    title: "Rain Relief Camps Campaign",
    thumbnail:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=120&q=80",
    platform: "YouTube",
    postedDate: "26 May 2024",
    postedTime: "10:30 PM",
    impressions: "45.6K",
    earnings: "₹156.80",
    status: "PUBLISHED",
  },
  {
    id: "rc-4",
    title: "Chennai Metro Phase 2 Updates",
    thumbnail:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80",
    platform: "Facebook",
    postedDate: "26 May 2024",
    postedTime: "08:15 PM",
    impressions: "32.1K",
    earnings: "₹98.60",
    status: "PROCESSING",
  },
  {
    id: "rc-5",
    title: "Rain Relief Camps Campaign",
    thumbnail:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=120&q=80",
    platform: "Instagram",
    postedDate: "26 May 2024",
    postedTime: "10:30 PM",
    impressions: "45.6K",
    earnings: "₹156.80",
    status: "PUBLISHED",
  },
  {
    id: "rc-6",
    title: "Chennai Metro Phase 2 Updates",
    thumbnail:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80",
    platform: "Threads",
    postedDate: "26 May 2024",
    postedTime: "08:15 PM",
    impressions: "32.1K",
    earnings: "₹98.60",
    status: "PROCESSING",
  },
  {
    id: "rc-7",
    title: "Rain Relief Camps Campaign",
    thumbnail:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=120&q=80",
    platform: "Facebook",
    postedDate: "26 May 2024",
    postedTime: "10:30 PM",
    impressions: "45.6K",
    earnings: "₹156.80",
    status: "PUBLISHED",
  },
];

export default function RepostContent({
  title = "My Reposted Content",
  items = defaultRepostedItems,
  maxRows,
  className = "",
  onViewAll,
}: RepostContentProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filterTabs = [
    { label: "All (24)", key: "All" },
    { label: "Instagram", key: "Instagram" },
    { label: "Facebook", key: "Facebook" },
    { label: "YouTube", key: "YouTube" },
  ];

  const filteredItems = items.filter((item) => {
    if (activeFilter === "All") return true;
    return item.platform.toLowerCase() === activeFilter.toLowerCase();
  });

  const displayItems = maxRows ? filteredItems.slice(0, maxRows) : filteredItems;

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      router.push("/freelancer/submissions");
    }
  };

  const renderPlatformIcon = (platform: RepostedItem["platform"]) => {
    switch (platform) {
      case "Instagram":
        return (
        <InstagramIcon/>
        );
      case "Facebook":
        return (
          <FacebookIcon/>
        );
      case "YouTube":
        return (
         <YoutubeIcon/>
        );
      case "Threads":
        return (
         <TreadsIcon/>
        );
      default:
        return null;
    }
  };

  const getstatuscolor=(statuscolor:RepostedItem["status"])=>{
    switch( statuscolor){
      case "PUBLISHED" :
        return( "bg-[#E8F8F0] text-[#10B981] border-[#D1F2E2]")     
      case  "PROCESSING":
        return("bg-[#FFF8E6] text-[#D97706] border-[#FDE68A]")       
      case  "REJECTED" :
        return( "bg-red-50 text-red-500 border-red-200")       
      default:
        ""
    }
  }

  return (
    <div>
      <button  onClick={() => window.history.back()} className={`${buttonVariants({variant:'link'})} outline-none`} ><ArrowLeft className="w-8 h-6"/> Back</button>
    <div
      className={`w-full bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col select-none ${className}`}
    >
     
     
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h2>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? `${buttonVariants({variant:"default"})}`
                    : `${buttonVariants({variant:'secondary'})}`
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

   
      <div className="block sm:hidden divide-y divide-gray-100/80">
        {displayItems.map((item) => (
          <div key={item.id} className="p-4 flex flex-col gap-3 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100 shadow-xs"
                />
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {renderPlatformIcon(item.platform)}
                    <span className="text-[11px] text-gray-400 font-medium">
                      {item.postedDate} • {item.postedTime}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider border shrink-0 ${getstatuscolor(item.status)}` }
              >
                {item.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-400 font-medium">Impressions:</span>
                <span className="font-bold text-gray-900">{item.impressions}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400 font-medium">Earnings:</span>
                <span className="font-bold text-[#C04808] text-sm">{item.earnings}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    
      <div className="hidden sm:block w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-y border-gray-100 text-[12px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3.5 px-6 font-bold">Content</th>
              <th className="py-3.5 px-4 font-bold">Platform</th>
              <th className="py-3.5 px-4 font-bold">Posted On</th>
              <th className="py-3.5 px-4 font-bold">Impressions</th>
              <th className="py-3.5 px-4 font-bold">Earnings</th>
              <th className="py-3.5 px-6 text-right font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80 text-xs sm:text-sm">
            {displayItems.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50/60 transition-colors group"
              >
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-gray-100 shadow-xs"
                    />
                    <span className="font-semibold text-gray-800 line-clamp-1 max-w-[220px]">
                      {item.title}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  {renderPlatformIcon(item.platform)}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700 text-xs">
                      {item.postedDate}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                      {item.postedTime}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-bold text-gray-900 text-sm">
                    {item.impressions}
                  </span>
                </td>

                <td className="py-3.5 px-4">
                  <span className="font-bold text-[#C04808] text-sm sm:text-base">
                    {item.earnings}
                  </span>
                </td>

                <td className="py-3.5 px-6 text-right">
                  <span
                    className={`inline-block text-[10px] font-bold px-3 py-1 rounded-full tracking-wider border shrink-0 ${
                      getstatuscolor(item.status)
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="bg-[#F8FAFC]/80 border-t border-gray-100 p-4 flex items-center justify-center">
        <button
          type="button"
          onClick={handleViewAllClick}
          className="text-xs sm:text-sm font-bold text-[#C04808] hover:text-[#A33B05] flex items-center gap-2 transition-all cursor-pointer group"
        >
          <span>View All Reposted Content</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
    </div>
  );
}
