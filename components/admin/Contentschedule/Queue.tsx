"use client";

import { useState } from "react";
import { Clock, Trash2, MoreHorizontal, Film, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "@/public/Svgicons/svgicons";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { MetricsSkeleton, ScheduleSlotSkeleton } from "@/components/ui/Skeletonloading";
import Image, { StaticImageData } from "next/image";
import avatar1 from "@/public/Images/avatar1.png";

interface QueueItem {
  id: string;
  time: string;
  status: "Scheduled" | "Needs Review";
  platform: "youtube" | "instagram";
  title: string;
  type: string;
  thumbnail: string | StaticImageData;
}

const RAW_QUEUE_ITEMS: [string, string, QueueItem["status"], QueueItem["platform"], string, string][] = [
  ["1", "Today, 09:30 AM", "Scheduled", "youtube", "Chennai Metro Phase II Details", "AI Shorts • 45s"],
  ["2", "Today, 01:00 PM", "Needs Review", "instagram", "Tamil Trending Tech News", "Reel • 30s"],
  ["3", "Today, 04:30 PM", "Scheduled", "youtube", "Is AI replacing developers?", "AI Shorts • 60s"],
  ["4", "Tomorrow, 09:00 AM", "Scheduled", "instagram", "Top 5 Chennai Food Spots", "Reel • 45s"],
  ["5", "Tomorrow, 02:00 PM", "Needs Review", "youtube", "NextJS 16 Breaking Features", "AI Shorts • 55s"],
  ["6", "Aug 21, 10:00 AM", "Scheduled", "youtube", "Tamil Nadu Spaceport Launch", "Video • 90s"],
  ["7", "Aug 22, 11:30 AM", "Scheduled", "instagram", "Weekly Tech Wrap Up", "Reel • 30s"],
];

const initialQueueItems: QueueItem[] = RAW_QUEUE_ITEMS.map(
  ([id, time, status, platform, title, type]) => ({
    id,
    time,
    status,
    platform,
    title,
    type,
    thumbnail: avatar1,
  })
);

function ReviewEditIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#9E3B0B]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  );
}

function PlatformBadge({ platform }: { platform: QueueItem["platform"] }) {
  const isYoutube = platform === "youtube";
  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6875rem] sm:text-xs font-semibold text-gray-700 shadow-inner-xs ${
        isYoutube ? "bg-red-200/40" : "bg-[#FFF0F3]"
      }`}
    >
      {isYoutube ? <YoutubeIcon /> : <InstagramIcon />}
      <span className="capitalize">{platform}</span>
    </div>
  );
}

function QueueActionButton({
  isScheduled,
  onDelete,
  id,
}: {
  isScheduled: boolean;
  onDelete: (id: string) => void;
  id: string;
}) {
  if (isScheduled) {
    return (
      <button
        onClick={() => onDelete(id)}
        className="border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-600 p-3.5 rounded-[20px] transition-all duration-200 cursor-pointer shrink-0 active:scale-[0.98]"
        title="Delete from Queue"
      >
        <Trash2 className="w-4 h-4 stroke-[2.5]" />
      </button>
    );
  }
  return (
    <button
      className="border border-gray-200 hover:bg-gray-50 text-gray-500 p-3.5 rounded-[20px] transition-all duration-200 cursor-pointer shrink-0 active:scale-[0.98]"
      title="More Actions"
    >
      <MoreHorizontal className="w-4 h-4 stroke-[2.5]" />
    </button>
  );
}

interface QueueCardProps {
  item: QueueItem;
  onDelete: (id: string) => void;
}

function QueueCard({ item, onDelete }: QueueCardProps) {
  const isScheduled = item.status === "Scheduled";

  return (
    <div className="w-full">
  
      <div className="hidden sm:flex flex-col bg-white rounded-[32px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.01)] border border-[#FFEFE0] gap-1 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,90,38,0.04)] w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                isScheduled ? "bg-[#F5EBE1]" : "bg-[#FFEFE0]"
              }`}
            >
              {isScheduled ? <Clock className="w-5 h-5 text-gray-700" /> : <ReviewEditIcon />}
            </div>

            <div className="flex flex-col">
              <span className="text-gray-900 text-xs sm:text-sm">{item.time}</span>
              <span
                className={`text-[0.6875rem] sm:text-xs leading-none mt-1 ${
                  isScheduled ? "text-gray-400" : "text-[#A75D00]"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
          <PlatformBadge platform={item.platform} />
        </div>

        <div className="flex items-center gap-3 sm:gap-4 py-1 min-w-0">
          <Image
            src={item.thumbnail}
            alt={item.title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] sm:rounded-[20px] object-cover shrink-0 border border-gray-100/60 shadow-sm"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm sm:text-[1.0625rem] leading-tight tracking-tight text-ellipsis overflow-hidden line-clamp-2">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-gray-500 text-[0.6875rem] sm:text-xs mt-0.5 font-semibold">
              <Film className="w-3.5 h-3.5 text-gray-400" />
              <span>{item.type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full mt-auto">
          <button
            className={`flex-1 py-3.5 px-6 rounded-[20px] text-xs sm:text-sm text-center transition-all duration-200 cursor-pointer active:scale-[0.98] ${
              isScheduled
                ? "bg-[#9E3B0B] hover:bg-[#8F3204] text-white"
                : "bg-[#EAEFF5] hover:bg-[#DDE5EF] text-[#2C3E50]"
            }`}
          >
            {isScheduled ? "Edit Studio" : "Review Assets"}
          </button>
          <QueueActionButton isScheduled={isScheduled} onDelete={onDelete} id={item.id} />
        </div>
      </div>

    
      <div className="flex sm:hidden flex-col bg-white rounded-[28px] p-5 gap-4 transition-all duration-300 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isScheduled ? "bg-[#EFE2D5]" : "bg-[#FFEFE0]"
              }`}
            >
              {isScheduled ? <Clock className="w-5 h-5 text-[#4A2617]" /> : <ReviewEditIcon />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[#3A2218] font-bold text-sm tracking-tight">{item.time}</span>
                <PlatformBadge platform={item.platform} />
              </div>
              <span
                className={`text-[10px] font-semibold leading-none block mt-1 ${
                  isScheduled ? "text-gray-400" : "text-[#A75D00]"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>

          {isScheduled ? (
            <button
              onClick={() => onDelete(item.id)}
              className="text-[#4A2617] hover:text-[#9E3B0B] transition-colors duration-200 p-1 cursor-pointer"
              title="Delete from Queue"
            >
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            </button>
          ) : (
            <button
              className="text-[#4A2617] hover:text-[#9E3B0B] transition-colors duration-200 p-1 cursor-pointer"
              title="More Actions"
            >
              <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Image
              src={item.thumbnail}
              alt={item.title}
              className="w-16 h-16 rounded-[16px] object-cover shrink-0 border border-gray-100/60"
            />
            <div className="flex flex-col min-w-0 gap-0.5">
              <h3 className="font-bold text-[#1A1A1A] text-sm leading-tight tracking-tight line-clamp-2">
                {item.title}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-[10px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                <span>{item.type}</span>
              </div>
            </div>
          </div>

          <button
            className={`py-2.5 px-4 rounded-[20px] text-xs font-semibold shrink-0 transition-all duration-200 active:scale-[0.98] cursor-pointer ${
              isScheduled
                ? "bg-[#9E3B0B] hover:bg-[#8F3204] text-white"
                : "bg-[#EAEFF5] hover:bg-[#DDE5EF] text-[#2C3E50]"
            }`}
          >
            {isScheduled ? "Edit Studio" : "Review Assets"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface QueueProps {
  isLoading?: boolean;
}

export default function Queue({ isLoading: propIsLoading }: QueueProps = {}) {
  const [isLoading, setIsLoading] = useState(propIsLoading ?? true);
  UsetimeoutLoader(setIsLoading);
  const [items, setItems] = useState<QueueItem[]>(initialQueueItems);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleDelete = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      const newTotalPages = Math.max(1, Math.ceil(updated.length / itemsPerPage));
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      return updated;
    });
  };

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedItems = items.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  let queueContent;

  if (isLoading) {
    queueContent = <MetricsSkeleton count={3} columns={3}/>;
  } else if (items.length === 0) {
    queueContent = (
      <div className="w-full bg-white rounded-[32px] p-12 text-center border border-[#FFEFE0] shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
        <p className="text-gray-500 font-medium">Your queue is empty.</p>
      </div>
    );
  } else {
    queueContent = (
      <>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-6 bg-white rounded-2xl border border-[#FFEFE0] shadow-[0_4px_30px_rgba(0,0,0,0.01)] w-full">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-semibold">{Math.min((activePage - 1) * itemsPerPage + 1, items.length)}</span> to{" "}
            <span className="text-gray-900 font-semibold">{Math.min(activePage * itemsPerPage, items.length)}</span> of{" "}
            <span className="text-gray-900 font-semibold">{items.length}</span> items
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="p-2 rounded-xl border border-[#FFEFE0] text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activePage === pageNum
                    ? "bg-[#9E3B0B] text-white shadow-md shadow-[#9E3B0B]/10"
                    : "border border-[#FFEFE0] text-[#4A5568] hover:bg-[#F5EBE1] hover:text-gray-950"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
              className="p-2 rounded-xl border border-[#FFEFE0] text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item, index) => (
            <QueueCard key={`queue-item-${item.id}-${index}`} item={item} onDelete={handleDelete} />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl text-gray-900 tracking-tight">Queue</h2>
          <span className="bg-[#EAEFF5] text-[#2C3E50]/70 text-[0.625rem] sm:text-xs font-bold py-1 px-3 rounded-full tracking-wider">
            {items.length} {items.length === 1 ? "ITEM" : "ITEMS"}
          </span>
        </div>
        <a
          href="#full-archive"
          className="flex items-center gap-1.5 text-[#FF5A26] text-sm sm:text-base transition-colors duration-200"
        >
          <span>Full Archive</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {queueContent}
    </div>
  );
}
