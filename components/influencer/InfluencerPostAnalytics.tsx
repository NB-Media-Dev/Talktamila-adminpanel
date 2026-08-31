"use client";

import React from "react";
import {
  Eye,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Repeat,
  Share2,
  Info,
  TrendingUp
} from "lucide-react";
import { FacebookIcon, InstagramIcon, ThreadsIcon, YoutubeIcon } from "@/public/Svgicons/svgicons";



export interface InfluencerPostMetricsProps {
  igReach?: string;
  fbReach?: string;
  ytReach?: string;
  threadsReach?: string;
  earnedAmount?: string;
  views?: string;
  likes?: string;
  comments?: string;
  shares?: string;
  saves?: string;
  aiPerformanceScore?: string;
  aiPerformanceLabel?: string;
  bestTime?: string;
  expectedReach?: string;
  trendingProb?: string;
  seoScore?: string;
  qualityScore?: string;
}

export default function InfluencerPostAnalytics({
  igReach = "12.4K",
  fbReach = "8.7K",
  ytReach = "5.3K",
  threadsReach = "2.1K",
  earnedAmount = "₹12,450",
  views = "24.5K",
  likes = "2.3K",
  comments = "156",
  shares = "489",
  saves = "1.2K",
  aiPerformanceScore = "92",
  aiPerformanceLabel = "Excellent",
  bestTime = "Today, 8:00 PM",
  expectedReach = "125K – 180K",
  trendingProb = "High",
  seoScore = "88",
  qualityScore = "93"
}: InfluencerPostMetricsProps) {
  return (
    <div className="flex flex-col gap-3 select-none w-full">

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
            <InstagramIcon />
            <span>{igReach}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
            <FacebookIcon />
            <span>{fbReach}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
            <YoutubeIcon />
            <span>{ytReach}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
            <ThreadsIcon />
            <span>{threadsReach}</span>
          </div>
          <span className="text-[10px]  text-[#FF6B35] bg-[#FFF2EC] px-1.5 py-0.5 rounded-full shrink-0">
            +2
          </span>
        </div>

        <div className="bg-[#EAF8F1] border border-[#D1F2E2] text-[#059669] px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full  text-xs sm:text-sm flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-black bg-[#059669] text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0">
            $
          </span>
          <span className="whitespace-nowrap">
            {earnedAmount} <span className="font-semibold text-[11px] opacity-80">Earned</span>
          </span>
        </div>
      </div>


      <div className="flex items-center justify-between text-gray-600 text-xs sm:text-sm pt-2.5 border-t border-gray-100/80">
        <div className="flex items-center gap-3 sm:gap-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Eye className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="font-bold text-gray-900">{views}</span>
            <span className="text-gray-400 text-xs font-medium">Views</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Heart className="w-3.5 h-3.5 text-gray-400 hover:text-red-500 cursor-pointer shrink-0 transition-colors" />
            <span className="font-bold text-gray-900">{likes}</span>
            <span className="text-gray-400 text-xs font-medium">Likes</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <MessageCircle className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500 cursor-pointer shrink-0 transition-colors" />
            <span className="font-bold text-gray-900">{comments}</span>
            <span className="text-gray-400 text-xs font-medium">Comments</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Send className="w-3.5 h-3.5 text-gray-400 hover:text-green-500 cursor-pointer shrink-0 transition-colors" />
            <span className="font-bold text-gray-900">{shares}</span>
            <span className="text-gray-400 text-xs font-medium">Shares</span>
          </div>
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Bookmark className="w-3.5 h-3.5 text-gray-400 hover:text-yellow-500 cursor-pointer shrink-0 transition-colors" />
            <span className="font-bold text-gray-900">{saves}</span>
            <span className="text-gray-400 text-xs font-medium">Saves</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-400 shrink-0">
          <Repeat className="w-3.5 h-3.5 hover:text-gray-700 cursor-pointer transition-colors" />
          <Share2 className="w-3.5 h-3.5 hover:text-gray-700 cursor-pointer transition-colors" />
        </div>
      </div>


      <div className="bg-[#FAF8F5]/90 rounded-[20px] p-3 border border-[#FFEFE0] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-left overflow-hidden">

        <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-gray-400 min-w-0">
            <span className="truncate">AI Performance</span>
            <Info className="w-3 h-3 text-gray-400 shrink-0"/>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5 min-w-0">
            <span className="text-lg sm:text-xl font-black text-[#059669] shrink-0">
              {aiPerformanceScore}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-[#059669] bg-[#EAF8F1] px-1.5 py-0.5 rounded truncate">
              {aiPerformanceLabel}
            </span>
          </div>
        </div>  
        <div className="flex flex-col gap-0.5 border-l border-gray-200/50 pl-2 sm:pl-2.5 min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-[11px] font-semibold text-gray-400 truncate">Best Time</div>
          <div className="text-[11px] sm:text-xs font-bold text-gray-900 mt-1 truncate" title={bestTime}>
            {bestTime}
          </div>
        </div>

        <div className="flex flex-col gap-0.5 border-l-0 sm:border-l border-gray-200/50 pl-0 sm:pl-2.5 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-gray-400 min-w-0">
            <span className="truncate">Expected Reach</span>
            <Info className="w-3 h-3 text-gray-400 shrink-0"  />
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-gray-900 mt-1 truncate" title={expectedReach}>
            {expectedReach}
          </div>
        </div>

        <div className="flex flex-col gap-0.5 border-l border-gray-200/50 pl-2 sm:pl-2.5 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-gray-400 min-w-0">
            <span className="truncate min-w-0" title="Trending Probability">
              <span className="hidden sm:inline lg:hidden">Trending Prob.</span>
              <span className="inline sm:hidden lg:inline">Trending Probability</span>
            </span>
            <Info className="w-3 h-3 text-gray-400 shrink-0" />
          </div>
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#059669] mt-1 min-w-0">
            <span className="truncate">{trendingProb}</span>
            <TrendingUp className="w-3 h-3 shrink-0" />
          </div>
        </div>

        <div className="flex flex-col gap-0.5 border-l-0 sm:border-l border-gray-200/50 pl-0 sm:pl-2.5 min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-[11px] font-semibold text-gray-400 truncate">SEO Score</div>
          <div className="text-[11px] sm:text-xs font-bold text-gray-900 mt-1 truncate">
            {seoScore}<span className="text-gray-400 font-normal text-[10px]">/100</span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5 border-l border-gray-200/50 pl-2 sm:pl-2.5 min-w-0 overflow-hidden">
          <div className="text-[10px] sm:text-[11px] font-semibold text-gray-400 truncate">Quality Score</div>
          <div className="text-[11px] sm:text-xs font-bold text-gray-900 mt-1 truncate">
            {qualityScore}<span className="text-gray-400 font-normal text-[10px]">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
