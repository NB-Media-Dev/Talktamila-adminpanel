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

interface AITrendRadarProps {
  compact?: boolean;
}

export default function AITrendRadar({ compact = false }: AITrendRadarProps) {
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
    <div className={`w-full bg-white rounded-[24px] sm:rounded-[32px] ${compact ? "p-3 sm:p-5" : "p-4 sm:p-5"} shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]`}>
      <div className={`flex items-center justify-between ${compact ? "mb-2" : "mb-4"}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          {!compact && (
            <div className="p-1.5 rounded-lg bg-[#FFF2F0] text-[#FF4B2B] shrink-0">
              <Radar className="w-5 h-5" />
            </div>
          )}
          {compact && (
            <span className="p-1 rounded-lg bg-orange-100 text-[#FF5A26] inline-flex items-center justify-center shrink-0">
              <Radar className="w-3.5 h-3.5" />
            </span>
          )}
          <h2 className={`font-bold text-gray-900 tracking-tight truncate ${compact ? "text-[11px] xs:text-[13px] sm:text-lg" : "text-base sm:text-lg"}`}>
            AI Trend Radar
          </h2>
        </div>
        {!compact && (
          <Link
            href={targetHref}
            className="text-xs sm:text-sm text-[#FF6B35] hover:text-[#D9652B] transition-colors duration-200 font-medium shrink-0"
          >
            View All
          </Link>
        )}
      </div>

      {isInfluencer ? (
      
        <div className="flex flex-col">
          {influencerTrends.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between py-2 sm:py-3 group cursor-pointer ${
                index === influencerTrends.length - 1 ? "" : "border-b border-gray-100"
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <span className="text-gray-400 font-bold text-xs sm:text-base shrink-0">#</span>
                <span className={`text-gray-800 group-hover:text-[#FF5A26] transition-colors truncate ${compact ? "text-[11px] xs:text-xs sm:text-base" : "text-sm sm:text-base"}`}>
                  {item.hashtag}
                </span>
              </div>

              <div className="flex flex-col items-end gap-0.5 shrink-0 ml-1">
                {!compact && (
                  <span className="text-xs text-gray-400 font-medium">
                    {item.posts}
                  </span>
                )}
                <span className={`font-bold text-[#FF6B35] ${compact ? "text-[10px] xs:text-xs sm:text-sm" : "text-xs"}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
       
        <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4"}`}>
          {adminTrends.map((item) => (
            <div key={item.id} className="flex flex-col group min-w-0">
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <span className={`text-gray-800 group-hover:text-[#FF5A26] transition-colors duration-200 truncate pr-1 ${compact ? "text-[11px] xs:text-xs sm:text-base" : "text-sm"}`}>
                  {item.title}
                </span>
                <span className={`text-[#FF5A26] font-bold ${compact ? "text-[10px] xs:text-xs sm:text-base" : "text-sm"}`}>
                  {item.score}
                </span>
              </div>

              <div className="w-full h-1.5 sm:h-2 bg-[#FFF6F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FFA07A] to-[#FF5A26] rounded-full transition-all duration-500 ease-out group-hover:brightness-105"
                  style={{ width: `${item.score}%` }}
                />
              </div>

              <span className={`text-gray-400 font-medium pl-0.5 ${compact ? "text-[9px] xs:text-[10px] sm:text-xs mt-0.5" : "text-xs mt-1"}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
