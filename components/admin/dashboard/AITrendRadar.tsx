"use client";

import { Radar } from "lucide-react";
import Link from "next/link";
import { useAuthRole } from "@/hooks/useAuthRole";

interface AdminTrendItem {
  id: number;
  title: string;
  score: number;
  status: string;
}

interface InfluencerTrendItem {
  id: number;
  hashtag: string;
  posts: string;
  status: string;
}

export default function AITrendRadar() {
  const { isInfluencer } = useAuthRole();

  
  const adminTrends: AdminTrendItem[] = [
    { id: 1, title: "Metro Phase II", score: 94, status: "Peaks in 3h" },
    { id: 2, title: "Pongal Campaigns", score: 87, status: "Peaks in 2d" },
    { id: 3, title: "AI in Tamil", score: 79, status: "Rising" },
  ];

    const influencerTrends: InfluencerTrendItem[] = [
    { id: 1, hashtag: "Chennai Rains ", posts: "12.4K Posts", status: "Trending" },
    { id: 2, hashtag: "Vijay New Movie", posts: "8.7K Posts", status: "Trending" },
    { id: 3, hashtag: "Pongal Campaigns", posts: "15.2K Posts", status: "Trending" },
  ];

  const targetHref = isInfluencer ? "/influencer/trendradar" : "/admin/trendradar";

  return (
    <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FFF2F0] text-[#FF4B2B]">
            <Radar className="w-5 h-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            AI Trend Radar
          </h2>
        </div>
        <Link
          href={targetHref}
          className="text-xs sm:text-sm text-[#FF6B35] hover:text-[#D9652B] transition-colors duration-200 font-medium"
        >
          View All
        </Link>
      </div>

      {isInfluencer ? (
      
        <div className="flex flex-col">
          {influencerTrends.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between py-3 group cursor-pointer ${
                index === influencerTrends.length - 1 ? "" : "border-b border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-gray-400 font-bold text-sm sm:text-base">#</span>
                <span className="text-sm sm:text-base text-gray-800 group-hover:text-[#FF5A26] transition-colors">
                  {item.hashtag}
                </span>
              </div>

              <div className="flex flex-col items-end gap-0.5">
                <span className="text-xs text-gray-400 font-medium">
                  {item.posts}
                </span>
                <span className="text-xs font-bold text-[#FF6B35]">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
       
        <div className="flex flex-col gap-4">
          {adminTrends.map((item) => (
            <div key={item.id} className="flex flex-col group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-800 group-hover:text-[#FF5A26] transition-colors duration-200">
                  {item.title}
                </span>
                <span className="text-sm text-[#FF5A26]">
                  {item.score}
                </span>
              </div>

              <div className="w-full h-2 bg-[#FFF6F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FFA07A] to-[#FF5A26] rounded-full transition-all duration-500 ease-out group-hover:brightness-105"
                  style={{ width: `${item.score}%` }}
                />
              </div>

              <span className="text-xs text-gray-400 mt-1 font-medium pl-0.5">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
