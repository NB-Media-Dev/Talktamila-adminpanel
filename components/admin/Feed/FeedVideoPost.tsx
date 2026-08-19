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
  BarChart2,
  Play
} from "lucide-react";
import avatar4 from "@/public/Images/avatar4.png";
import avatar3 from "@/public/Images/avatar3.png";
import { buttonVariants } from "@/components/ui/Button";

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    {...props}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107A31.248 31.248 0 0 0 0 12.007a31.253 31.253 0 0 0 .502 5.844 3.003 3.003 0 0 0 2.11 2.107c1.863.514 9.388.514 9.388.514s7.524 0 9.388-.514a3.002 3.002 0 0 0 2.11-2.107 31.25 31.25 0 0 0 .502-5.844 31.248 31.248 0 0 0-.502-5.844zM9.545 15.568V8.44l6.18 3.568-6.18 3.56z" />
  </svg>
);

export default function FeedVideoPost() {
  const context = useContext(useContenthook);
  const setAnalyticsState = context?.setAnalyticsState;
  return (
    <div className="w-full bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4">
     
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
    
          <div className="w-11 h-11 rounded-full overflow-hidden relative border border-[#FFEFE0] bg-gray-50 shrink-0">
            <Image
              src={avatar4}
              alt="News Tamila Avatar"
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
    
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-gray-900 leading-none">News Tamila</span>
            
              <span className="text-[#8E8E93] text-xs font-normal">@news_tamil</span>
            </div>
            <div className="flex items-center gap-1 text-[#8E8E93] mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[0.6875rem]">Chennai, India</span>
              <span className="text-[0.6875rem]">•</span>
              <span className="text-[0.6875rem]">12m</span>
            </div>
          </div>
        </div>

        <div className="text-[#FF0000] p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors">
          <YoutubeIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="text-[0.8125rem] text-gray-800 leading-relaxed font-normal">
        சென்னை கடற்கரை சாலையில் புதிய மெட்ரோ வழித்தடப் பணிகள் துவக்கம்!{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#Chennai</span>{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#MetroUpdate</span>{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#News</span>
      </div>

      <div className="w-full h-[320px] sm:h-[420px] md:h-[520px] rounded-[24px] overflow-hidden relative border border-[#FFEFE0] group cursor-pointer">
        <Image
          src={avatar3}
          alt="Video Thumbnail"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 550px"
        />
     
        <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-300" />
    
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-black/45 backdrop-blur-md border-2 border-white flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:bg-[#FF6B35]/80 group-hover:border-[#FF6B35] active:scale-95">
            <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">1.2M</span>
            <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Views</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <IndianRupee className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">₹18,240</span>
            <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Revenue</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <Sparkles className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">96/100</span>
            <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">AI Score</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <Clock className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">1:30 PM</span>
            <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Best Time</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#FFEFE0] pt-4 mt-1">
       
        <div className="flex items-center gap-2 sm:gap-3.5 text-[#8E8E93]">
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-red-500 transition-colors group cursor-pointer">
            <Heart className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-red-500 transition-all" />
            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">52.5K</span>
          </button>
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-blue-500 transition-colors group cursor-pointer">
            <MessageCircle className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-blue-500/20 transition-all" />
            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">3.2K</span>
          </button>
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-green-500 transition-colors group cursor-pointer">
            <Send className="w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] transition-all" />
            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">522</span>
          </button>
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-yellow-500 transition-colors group cursor-pointer">
            <Bookmark className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-yellow-500 transition-all" />
            <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">2.1K</span>
          </button>
        </div>

              <button 
                onClick={() => setAnalyticsState && setAnalyticsState(true)}
                className={`flex items-center gap-1.5 border border-[#FF6B35] text-[#FF6B35] rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[0.625rem] sm:text-[0.6875rem] font-bold ${buttonVariants({variant:'hoverButton'})} shadow-[0_2px_8px_rgba(255,107,53,0.1)] active:scale-95 shrink-0`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Analytics
              </button>
      </div>
    </div>
  );
}
