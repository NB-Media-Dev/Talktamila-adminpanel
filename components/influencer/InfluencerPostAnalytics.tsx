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

const InstagramColorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" {...props}>
    <radialGradient id="ig-grad" cx="30%" cy="107%" r="130%">
      <stop offset="0%" stopColor="#fdf497" />
      <stop offset="5%" stopColor="#fdf497" />
      <stop offset="45%" stopColor="#fd5949" />
      <stop offset="60%" stopColor="#d6249f" />
      <stop offset="90%" stopColor="#285AEB" />
    </radialGradient>
    <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="#1877F2" className="w-4 h-4 shrink-0" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeColorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="#FF0000" className="w-4 h-4 shrink-0" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107A31.248 31.248 0 0 0 0 12.007a31.253 31.253 0 0 0 .502 5.844 3.003 3.003 0 0 0 2.11 2.107c1.863.514 9.388.514 9.388.514s7.524 0 9.388-.514a3.002 3.002 0 0 0 2.11-2.107 31.25 31.25 0 0 0 .502-5.844 31.248 31.248 0 0 0-.502-5.844zM9.545 15.568V8.44l6.18 3.568-6.18 3.56z" />
  </svg>
);

const ThreadsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-black shrink-0" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.185 13.914c-.16 2.457-1.782 4.195-4.225 4.195-2.616 0-4.462-1.996-4.462-4.815 0-2.827 1.87-4.832 4.542-4.832 2.404 0 3.996 1.572 4.168 3.738h-1.84c-.131-1.22-.962-2.023-2.308-2.023-1.572 0-2.664 1.251-2.664 3.117 0 1.858 1.072 3.109 2.585 3.109 1.346 0 2.196-.86 2.336-2.164h-2.585v-1.547h4.453v1.222z" />
  </svg>
);

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
            <InstagramColorIcon />
            <span>{igReach}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
            <FacebookIcon />
            <span>{fbReach}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 shrink-0">
            <YoutubeColorIcon />
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

        <div className="flex flex-col gap-0.5 border-l sm:border-l border-gray-200/50 pl-2 sm:pl-2.5 min-w-0 overflow-hidden">
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-gray-400 min-w-0">
            <span className="truncate">Expected Reach</span>
            <Info className="w-3 h-3 text-gray-400 shrink-0"  />
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-gray-900 mt-1 truncate" title={expectedReach}>
            {expectedReach}
          </div>
        </div>

        <div className="flex flex-col gap-0.5 border-l-0 sm:border-l border-gray-200/50 pl-0 sm:pl-2.5 min-w-0 overflow-hidden">
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

        <div className="flex flex-col gap-0.5 border-l border-gray-200/50 pl-2 sm:pl-2.5 min-w-0 overflow-hidden">
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
