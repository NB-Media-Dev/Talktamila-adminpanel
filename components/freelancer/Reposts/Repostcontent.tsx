"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, AtSign } from "lucide-react";

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
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </div>
        );
      case "Facebook":
        return (
          <div className="w-7 h-7 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-xs shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </div>
        );
      case "YouTube":
        return (
          <div className="w-7 h-7 rounded-full bg-[#FF0000] flex items-center justify-center text-white shadow-xs shrink-0">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        );
      case "Threads":
        return (
          <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white shadow-xs shrink-0">
            <AtSign className="w-4 h-4" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
                    ? "bg-[#C04808] text-white shadow-xs"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
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
                className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider border shrink-0 ${
                  item.status === "PUBLISHED"
                    ? "bg-[#E8F8F0] text-[#10B981] border-[#D1F2E2]"
                    : item.status === "PROCESSING"
                    ? "bg-[#FFF8E6] text-[#D97706] border-[#FDE68A]"
                    : "bg-red-50 text-red-500 border-red-200"
                }`}
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
                      item.status === "PUBLISHED"
                        ? "bg-[#E8F8F0] text-[#10B981] border-[#D1F2E2]"
                        : item.status === "PROCESSING"
                        ? "bg-[#FFF8E6] text-[#D97706] border-[#FDE68A]"
                        : "bg-red-50 text-red-500 border-red-200"
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
  );
}
