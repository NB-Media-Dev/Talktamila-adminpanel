"use client";

import React, { useContext } from "react";
import { useContenthook } from "@/hooks/useContent";
import Image from "next/image";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  TrendingUp, 
  IndianRupee, 
  Sparkles, 
  Clock, 
  MapPin,
  MessageSquare,
  BarChart2
} from "lucide-react";
import avatar6 from "@/public/Images/avatar6.png";

export default function FeedTextPost() {
  const context = useContext(useContenthook);
  const setAnalyticsState = context?.setAnalyticsState;
  return (
    <div className="w-full bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full overflow-hidden relative border border-[#FFEFE0] bg-gray-50 shrink-0">
            <Image
              src={avatar6}
              alt="News Tamila Avatar"
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          {/* User Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[14px] text-gray-900 leading-none">News Tamila</span>
              {/* Verified Dot/Badge */}
              <span className="w-4.5 h-4.5 rounded-full bg-[#E05D24] text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
              <span className="text-[#8E8E93] text-[12px] font-normal">@news_tamil</span>
            </div>
            <div className="flex items-center gap-1 text-[#8E8E93] mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[11px]">Chennai, India</span>
              <span className="text-[11px]">•</span>
              <span className="text-[11px]">12m</span>
            </div>
          </div>
        </div>

        {/* Platform Icon */}
        <div className="text-[#E05D24] p-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors">
          <MessageSquare className="w-5 h-5 fill-current" />
        </div>
      </div>

      {/* Post Content - Text Card */}
      <div className="bg-[#FFFDFB] rounded-[20px] p-4.5 border border-[#FFEFE0] text-[13.5px] text-gray-800 leading-relaxed font-normal shadow-inner">
        சென்னை கடற்கரை சாலையில் புதிய மெட்ரோ வழித்தடப் பணிகள் வெற்றிகரமாக துவங்கப்பட்டுள்ளது. இதனால் போக்குவரத்து மாற்றங்கள் செய்யப்பட்டுள்ளது. பொதுமக்கள் ஒத்துழைக்குமாறு கேட்டுக்கொள்ளப்படுகிறது!
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[#FF6B35] font-semibold cursor-pointer">#Chennai</span>
          <span className="text-[#FF6B35] font-semibold cursor-pointer">#MetroUpdate</span>
          <span className="text-[#FF6B35] font-semibold cursor-pointer">#TrafficUpdate</span>
          <span className="text-[#FF6B35] font-semibold cursor-pointer">#TamilNews</span>
        </div>
      </div>

      {/* Metrics Chips Grid */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {/* Views */}
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">1.1M</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Views</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <IndianRupee className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">₹15,420</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Revenue</span>
          </div>
        </div>

        {/* AI Score */}
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <Sparkles className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">88/100</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">AI Score</span>
          </div>
        </div>

        {/* Best Time */}
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <Clock className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">1:30 PM</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Best Time</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-[#FFEFE0] pt-4 mt-1">
        {/* Engagement Icons */}
        <div className="flex items-center gap-3.5 text-[#8E8E93]">
          <button className="flex items-center gap-1 hover:text-red-500 transition-colors group cursor-pointer">
            <Heart className="w-[18px] h-[18px] group-hover:fill-red-500 transition-all" />
            <span className="text-[11px] font-semibold">42K</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-500 transition-colors group cursor-pointer">
            <MessageCircle className="w-[18px] h-[18px] group-hover:fill-blue-500/20 transition-all" />
            <span className="text-[11px] font-semibold">2.8K</span>
          </button>
          <button className="flex items-center gap-1 hover:text-green-500 transition-colors group cursor-pointer">
            <Send className="w-[17px] h-[17px] transition-all" />
            <span className="text-[11px] font-semibold">450</span>
          </button>
          <button className="flex items-center gap-1 hover:text-yellow-500 transition-colors group cursor-pointer">
            <Bookmark className="w-[18px] h-[18px] group-hover:fill-yellow-500 transition-all" />
            <span className="text-[11px] font-semibold">1.8K</span>
          </button>
        </div>

        {/* Analytics Button */}
        <button 
          onClick={() => setAnalyticsState && setAnalyticsState(true)}
          className="flex items-center gap-1.5 border border-[#FF6B35] text-[#FF6B35] rounded-full px-3.5 py-1.5 text-[11px] font-bold hover:bg-[#FF6B35] hover:text-white transition-all cursor-pointer shadow-[0_2px_8px_rgba(255,107,53,0.1)] active:scale-95"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          Analytics
        </button>
      </div>
    </div>
  );
}
