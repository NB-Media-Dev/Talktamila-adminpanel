"use client";

import React from "react";


const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" {...props}>
    <radialGradient id="ig-upcoming-grad" cx="30%" cy="107%" r="130%">
      <stop offset="0%" stopColor="#fdf497" />
      <stop offset="5%" stopColor="#fdf497" />
      <stop offset="45%" stopColor="#fd5949" />
      <stop offset="60%" stopColor="#d6249f" />
      <stop offset="90%" stopColor="#285AEB" />
    </radialGradient>
    <path
      fill="url(#ig-upcoming-grad)"
      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
    />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="#FF0000" className="w-4.5 h-4.5 shrink-0" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107A31.248 31.248 0 0 0 0 12.007a31.253 31.253 0 0 0 .502 5.844 3.003 3.003 0 0 0 2.11 2.107c1.863.514 9.388.514 9.388.514s7.524 0 9.388-.514a3.002 3.002 0 0 0 2.11-2.107 31.25 31.25 0 0 0 .502-5.844 31.248 31.248 0 0 0-.502-5.844zM9.545 15.568V8.44l6.18 3.568-6.18 3.56z" />
  </svg>
);

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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
          Upcoming Posts
        </h3>
        <button className="text-xs sm:text-sm font-bold text-[#FF6B35] hover:text-[#F95A22] transition-colors cursor-pointer">
          View All
        </button>
      </div>

      {/* Posts List */}
      <div className="flex flex-col divide-y divide-gray-100">
        {upcomingPostsData.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0 group hover:bg-gray-50/50 rounded-xl transition-colors -mx-1 px-1 gap-2"
          >
            {/* Left Info (Thumbnail + Platform Icon + Title + Time) */}
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

              {/* Platform icon inline with title */}
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

            {/* Right Status Badge */}
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
