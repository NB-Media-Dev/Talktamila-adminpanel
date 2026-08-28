"use client";

import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { FacebookIcon, InstagramIcon, TalkTamilaIcon, YoutubeIcon } from "@/public/Svgicons/svgicons";
import { buttonVariants } from "../ui/Button";


// const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     {...props}
//   >
//     <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//     <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//     <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//   </svg>
// );

// const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="#FF0000" className="w-4.5 h-4.5 shrink-0" {...props}>
//     <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107A31.248 31.248 0 0 0 0 12.007a31.253 31.253 0 0 0 .502 5.844 3.003 3.003 0 0 0 2.11 2.107c1.863.514 9.388.514 9.388.514s7.524 0 9.388-.514a3.002 3.002 0 0 0 2.11-2.107 31.25 31.25 0 0 0 .502-5.844 31.248 31.248 0 0 0-.502-5.844zM9.545 15.568V8.44l6.18 3.568-6.18 3.56z" />
//   </svg>
// );

// const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
//   <svg viewBox="0 0 24 24" fill="#1877F2" className="w-4 h-4 shrink-0" {...props}>
//     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//   </svg>
// );



export interface ContentItem {
  id: string;
  thumbnail: string;
  duration: string;
  title: string;
  description: string;
  type: "Reel" | "Video" | "Post" | "Shorts";
  platform: "Instagram" | "YouTube" | "Facebook" | "TalkTamila";
  views: string;
  engagement: string;
  date: string;
  status: "Published" | "Draft" | "Scheduled";
}

const contentData: ContentItem[] = [
  {
    id: "1",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
    duration: "0:45",
    title: "Marina Beach Sunset Vibes 🏳️‍🌈",
    description: "Exploring evening beauty of Marina...",
    type: "Reel",
    platform: "Instagram",
    views: "125K",
    engagement: "12.4K",
    date: "26 May 2025",
    status: "Published",
  },
  {
    id: "2",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80",
    duration: "5:12",
    title: "Ooty Travel Series - Episode 3",
    description: "Exploring the beauty of Ooty hills...",
    type: "Video",
    platform: "YouTube",
    views: "98K",
    engagement: "8.7K",
    date: "25 May 2025",
    status: "Published",
  },
  {
    id: "3",
    thumbnail: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80",
    duration: "0:32",
    title: "Madurai Meenakshi Temple 🙏",
    description: "Divine experience at Madurai...",
    type: "Post",
    platform: "Instagram",
    views: "63K",
    engagement: "5.1K",
    date: "24 May 2025",
    status: "Published",
  },
  {
    id: "4",
    thumbnail: "https://images.unsplash.com/photo-1610057099443-f63a1580d32f?auto=format&fit=crop&w=300&q=80",
    duration: "0:22",
    title: "Chettinad Food Experience 😋",
    description: "Must try yummy food in Chennai...",
    type: "Reel",
    platform: "Instagram",
    views: "78K",
    engagement: "7.2K",
    date: "23 May 2025",
    status: "Published",
  },
  {
    id: "5",
    thumbnail: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=300&q=80",
    duration: "0:35",
    title: "Kanyakumari Sunrise 🌅",
    description: "Beautiful sunrise at Kanyakumari...",
    type: "Shorts",
    platform: "YouTube",
    views: "145K",
    engagement: "13.8K",
    date: "22 May 2025",
    status: "Published",
  },
];

const tabs = ["All", "Instagram", "YouTube", "Facebook", "TalkTamila"] as const;

export default function RecentContent() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredContent = activeTab === "All" 
    ? contentData 
    : contentData.filter((item) => item.platform.toLowerCase() === activeTab.toLowerCase());

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case "Instagram":
        return  <InstagramIcon className="w-5 h-5 text-[#E1306C]  bg-pink-50 rounded-full hover:bg-pink-100 transition-colors" />;
      case "YouTube":
        return <YoutubeIcon />;
      case "Facebook":
        return <FacebookIcon />;
      case "TalkTamila":
        return <TalkTamilaIcon />;
      default:
        return null;
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "Reel":
        return "bg-[#FFE4EE] text-[#FF2E7E]";
      case "Video":
        return "bg-[#F3E8FF] text-[#9333EA]";
      case "Post":
        return "bg-[#E0F2FE] text-[#0284C7]";
      case "Shorts":
        return "bg-[#FFEDD5] text-[#EA580C]";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full bg-white rounded-[20px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] select-none">
   
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">
          Recent Content
        </h2>
        <button className={` ${buttonVariants({variant:'link'})} text-xs sm:text-sm `}>
          View All
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#FF6B35] text-white shadow-xs"
                : "bg-[#F5EFE8] text-gray-600 hover:bg-gray-200/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

     
      <div className="block sm:hidden flex flex-col gap-3">
        {filteredContent.length > 0 ? (
          filteredContent.map((item) => (
            <div
              key={item.id}
              className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-3 flex flex-col gap-3"
            >
              <div className="flex gap-3">
                <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 py-0.2 rounded font-medium">
                    {item.duration}
                  </span>
                </div>

                <div className="min-w-0 flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <button className="text-gray-400 p-0.5 shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getTypeBadgeStyle(item.type)}`}>
                      {item.type}
                    </span>
                    <div className="flex items-center gap-1">
                      {renderPlatformIcon(item.platform)}
                      <span className="text-[11px] text-gray-500 font-medium">{item.platform}</span>
                    </div>
                  </div>
                </div>
              </div>

              
              <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-[11px] text-gray-500">
                <div>
                  <span className="text-gray-400">Views:</span> <span className="font-bold text-gray-800">{item.views}</span>
                </div>
                <div>
                  <span className="text-gray-400">Eng:</span> <span className="font-bold text-gray-800">{item.engagement}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-400">{item.date}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F8F0] text-[#10B981]">
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-gray-400">
            No content found for {activeTab}
          </div>
        )}
      </div>

      {/* Desktop & Tablet Table View */}
      <div className="hidden sm:block w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
        <table className="w-full min-w-[620px] text-left border-collapse">
          <thead>
            <tr className="text-[10px] sm:text-[11px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 pl-2 pr-2 whitespace-nowrap">Content</th>
              <th className="pb-3 px-2 text-center whitespace-nowrap">Type</th>
              <th className="pb-3 px-2 text-center whitespace-nowrap">Platform</th>
              <th className="pb-3 px-2 text-center whitespace-nowrap">Views</th>
              <th className="pb-3 px-2 text-center whitespace-nowrap">Engagement</th>
              <th className="pb-3 px-2 text-left whitespace-nowrap">Date</th>
              <th className="pb-3 px-2 text-center whitespace-nowrap">Status</th>
              <th className="pb-3 pr-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100/80">
            {filteredContent.length > 0 ? (
              filteredContent.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                  {/* Content (Thumbnail + Title + Description) */}
                  <td className="py-2.5 sm:py-3 pl-2">
                    <div className="flex items-center gap-2.5 sm:gap-3 max-w-[240px] sm:max-w-[300px] md:max-w-[260px] lg:max-w-[340px]">
                      <div className="relative w-[64px] h-[42px] sm:w-[76px] sm:h-[48px] rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent -z-10" />
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] sm:text-[9px] px-1 py-0.2 rounded backdrop-blur-xs">
                          {item.duration}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#FF6B35] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] font-medium text-gray-400 truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="py-2.5 sm:py-3 text-center">
                    <span
                      className={`inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${getTypeBadgeStyle(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>
                  </td>

                  {/* Platform Icon */}
                  <td className="py-2.5 sm:py-3 text-center">
                    <div className="flex items-center justify-center">
                      {renderPlatformIcon(item.platform)}
                    </div>
                  </td>

                  {/* Views */}
                  <td className="py-2.5 sm:py-3 text-center text-xs sm:text-sm text-gray-900 font-semibold">
                    {item.views}
                  </td>

                  {/* Engagement */}
                  <td className="py-2.5 sm:py-3 text-center text-xs sm:text-sm text-gray-900 font-semibold">
                    {item.engagement}
                  </td>

                  {/* Date */}
                  <td className="py-2.5 sm:py-3 text-left text-[11px] sm:text-xs text-gray-700 whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 sm:py-3 text-center">
                    <span className="inline-block px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#E8F8F0] text-[#10B981]">
                      {item.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 sm:py-3 pr-2 text-right">
                    <button className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-gray-400">
                  No content found for {activeTab}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
