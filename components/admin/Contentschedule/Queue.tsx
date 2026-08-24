"use client";

import React, { useState } from "react";
import { Clock, Trash2, MoreHorizontal, Film, ArrowRight, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface QueueItem {
  id: string;
  time: string;
  status: "Scheduled" | "Needs Review";
  platform: "youtube" | "instagram";
  title: string;
  type: string;
  thumbnail: string;
}

const initialQueueItems: QueueItem[] = [
  {
    id: "1",
    time: "Today, 09:30 AM",
    status: "Scheduled",
    platform: "youtube",
    title: "Chennai Metro Phase II Details",
    type: "AI Shorts • 45s",
    thumbnail: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    time: "Today, 01:00 PM",
    status: "Needs Review",
    platform: "instagram",
    title: "Tamil Trending Tech News",
    type: "Reel • 30s",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    time: "Today, 04:30 PM",
    status: "Scheduled",
    platform: "youtube",
    title: "Is AI replacing developers?",
    type: "AI Shorts • 60s",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    time: "Tomorrow, 09:00 AM",
    status: "Scheduled",
    platform: "instagram",
    title: "Top 5 Chennai Food Spots",
    type: "Reel • 45s",
    thumbnail: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "5",
    time: "Tomorrow, 02:00 PM",
    status: "Needs Review",
    platform: "youtube",
    title: "NextJS 16 Breaking Features",
    type: "AI Shorts • 55s",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "6",
    time: "Aug 21, 10:00 AM",
    status: "Scheduled",
    platform: "youtube",
    title: "Tamil Nadu Spaceport Launch",
    type: "Video • 90s",
    thumbnail: "https://images.unsplash.com/photo-1626125345510-4603468eedfb?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "7",
    time: "Aug 22, 11:30 AM",
    status: "Scheduled",
    platform: "instagram",
    title: "Weekly Tech Wrap Up",
    type: "Reel • 30s",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
  },
];

export default function Queue() {
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

      {items.length === 0 ? (
        <div className="w-full bg-white rounded-[32px] p-12 text-center border border-[#FFEFE0] shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
          <p className="text-gray-500 font-medium">Your queue is empty.</p>
        </div>
      ) : (
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
                      : "border border-[#FFEFE0] text-gray-600 hover:bg-gray-50 hover:text-gray-950"
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
            {paginatedItems.map((item) => {
              const isScheduled = item.status === "Scheduled";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.01)] border border-[#FFEFE0] flex flex-col gap-5 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,90,38,0.04)]"
                >
                 
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                     
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                          isScheduled ? "bg-[#F5EBE1]" : "bg-[#FFEFE0]"
                        }`}
                      >
                        {isScheduled ? (
                          <Clock className="w-5 h-5 text-gray-700" />
                        ) : (
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
                        )}
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
                    <div>
                      {item.platform === "youtube" ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#ECEFF1] rounded-full text-[0.6875rem] sm:text-xs font-semibold text-gray-700 shadow-inner-xs">
                          <Play className="w-3.5 h-3.5 text-red-600 fill-red-600 animate-pulse" />
                          <span>YouTube</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF0F3] rounded-full text-[0.6875rem] sm:text-xs font-semibold text-gray-700 shadow-inner-xs">
                          <svg
                            className="w-3.5 h-3.5 text-[#E1306C]"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                          </svg>
                          <span>Instagram</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 py-1 min-w-0">
                    <img
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
                    {isScheduled ? (
                      <>
                        <button className="flex-1 bg-[#9E3B0B] hover:bg-[#8F3204] text-white py-3.5 px-6 rounded-[20px] text-xs sm:text-sm text-center transition-all duration-200 cursor-pointer active:scale-[0.98]">
                          Edit Studio
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-600 p-3.5 rounded-[20px] transition-all duration-200 cursor-pointer shrink-0 active:scale-[0.98]"
                          title="Delete from Queue"
                        >
                          <Trash2 className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex-1 bg-[#EAEFF5] hover:bg-[#DDE5EF] text-[#2C3E50]  py-3.5 px-6 rounded-[20px] text-xs sm:text-sm text-center transition-all duration-200 cursor-pointer active:scale-[0.98]">
                          Review Assets
                        </button>
                        <button
                          className="border border-gray-200 hover:bg-gray-50 text-gray-500 p-3.5 rounded-[20px] transition-all duration-200 cursor-pointer shrink-0 active:scale-[0.98]"
                          title="More Actions"
                        >
                          <MoreHorizontal className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

//
