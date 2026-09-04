"use client";

import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { FacebookIcon, InstagramIcon, TalkTamilaIcon, YoutubeIcon } from "@/public/Svgicons/svgicons";
import { buttonVariants } from "../ui/Button";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { TableSkeleton } from "@/components/ui/Skeletonloading";
import Image, { StaticImageData } from "next/image";
import avatar1 from "@/public/Images/avatar1.png";

export interface ContentItem {
  id: string;
  thumbnail: string | StaticImageData;
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

const RAW_CONTENT_DATA: [string, string, string, string, ContentItem["type"], ContentItem["platform"], string, string, string, ContentItem["status"]][] = [
  ["1", "0:45", "Marina Beach Sunset Vibes 🏳️‍🌈", "Exploring evening beauty of Marina...", "Reel", "Instagram", "125K", "12.4K", "26 May 2025", "Published"],
  ["2", "5:12", "Ooty Travel Series - Episode 3", "Exploring the beauty of Ooty hills...", "Video", "YouTube", "98K", "8.7K", "25 May 2025", "Published"],
  ["3", "0:32", "Madurai Meenakshi Temple 🙏", "Divine experience at Madurai...", "Post", "Facebook", "63K", "5.1K", "24 May 2025", "Published"],
  ["4", "0:22", "Chettinad Food Experience 😋", "Must try yummy food in Chennai...", "Shorts", "TalkTamila", "78K", "7.2K", "23 May 2025", "Published"],
  ["5", "0:35", "Kanyakumari Sunrise 🌅", "Beautiful sunrise at Kanyakumari...", "Reel", "Instagram", "145K", "13.8K", "22 May 2025", "Published"],
];

const contentData: ContentItem[] = RAW_CONTENT_DATA.map(
  ([id, duration, title, description, type, platform, views, engagement, date, status]) => ({
    id,
    thumbnail: avatar1,
    duration,
    title,
    description,
    type,
    platform,
    views,
    engagement,
    date,
    status,
  })
);

const tabs = ["All", "Instagram", "YouTube", "Facebook", "TalkTamila"] as const;

function PlatformIcon({ platform }: { platform: ContentItem["platform"] }) {
  switch (platform) {
    case "Instagram":
      return <InstagramIcon />;
    case "YouTube":
      return <YoutubeIcon />;
    case "Facebook":
      return <FacebookIcon />;
    case "TalkTamila":
      return <TalkTamilaIcon />;
    default:
      return null;
  }
}

function TypeBadge({ type }: { type: ContentItem["type"] }) {
  const styles: Record<ContentItem["type"], string> = {
    Reel: "bg-[#FFE4EE] text-[#FF2E7E]",
    Video: "bg-[#F3E8FF] text-[#9333EA]",
    Post: "bg-[#E0F2FE] text-[#0284C7]",
    Shorts: "bg-[#FFEDD5] text-[#EA580C]",
  };

  return (
    <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${styles[type]}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: ContentItem["status"] }) {
  return (
    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#E8F8F0] text-[#10B981]">
      {status}
    </span>
  );
}

function MobileContentCard({ item }: { item: ContentItem }) {
  return (
    <div className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-3 flex flex-col gap-3">
      <div className="flex gap-3">
        <div className="relative w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            className="w-full h-full object-cover"
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
            <TypeBadge type={item.type} />
            <div className="flex items-center gap-1">
              <PlatformIcon platform={item.platform} />
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
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
}

function DesktopTableRow({ item }: { item: ContentItem }) {
  return (
    <tr className="group hover:bg-gray-50/50 transition-colors">
      <td className="py-2.5 sm:py-3 pl-2">
        <div className="flex items-center gap-2.5 sm:gap-3 max-w-[240px] sm:max-w-[300px] md:max-w-[260px] lg:max-w-[340px]">
          <div className="relative w-[64px] h-[42px] sm:w-[76px] sm:h-[48px] rounded-xl overflow-hidden shrink-0 bg-gray-100 border border-gray-100">
            <Image
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover"
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

      <td className="py-2.5 sm:py-3 text-center">
        <TypeBadge type={item.type} />
      </td>

      <td className="py-2.5 sm:py-3 text-center">
        <div className="flex items-center justify-center">
          <PlatformIcon platform={item.platform} />
        </div>
      </td>

      <td className="py-2.5 sm:py-3 text-center text-xs sm:text-sm text-gray-900 font-semibold">
        {item.views}
      </td>

      <td className="py-2.5 sm:py-3 text-center text-xs sm:text-sm text-gray-900 font-semibold">
        {item.engagement}
      </td>

      <td className="py-2.5 sm:py-3 text-left text-[11px] sm:text-xs text-gray-700 whitespace-nowrap">
        {item.date}
      </td>

      <td className="py-2.5 sm:py-3 text-center">
        <StatusBadge status={item.status} />
      </td>

      <td className="py-2.5 sm:py-3 pr-2 text-right">
        <button className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

interface RecentContentProps {
  isLoading?: boolean;
}

export default function RecentContent({ isLoading: propIsLoading }: RecentContentProps = {}) {
  const [isLoading, setIsLoading] = useState(propIsLoading ?? true);
  UsetimeoutLoader(setIsLoading);

  const [activeTab, setActiveTab] = useState<string>("All");

  if (isLoading) {
    return <TableSkeleton rows={4} cols={5} />;
  }

  const filteredContent = activeTab === "All"
    ? contentData
    : contentData.filter((item) => item.platform.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="w-full bg-white rounded-[20px] sm:rounded-[28px] p-4 sm:p-5 md:p-6 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] select-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-tight">
          Recent Content
        </h2>
        <button className={` ${buttonVariants({ variant: "link" })} text-xs sm:text-sm `}>
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

      {/* Mobile view */}
      <div className="flex sm:hidden flex-col gap-3">
        {filteredContent.length > 0 ? (
          filteredContent.map((item, index) => (
            <MobileContentCard key={`mobile-${item.id}-${index}`} item={item} />
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
              filteredContent.map((item, index) => (
                <DesktopTableRow key={`desktop-${item.id}-${index}`} item={item} />
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
