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
  BarChart2
} from "lucide-react";
import avatar4 from "@/public/Images/avatar4.png";
import movie from "@/public/Images/movie.jpg";
import { buttonVariants } from "@/components/ui/Button";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function FeedImagePost() {
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
              <span className="font-bold text-[14px] text-gray-900 leading-none">News Tamila</span>
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

    
        <div className="text-[#E1306C] p-2 bg-pink-50 rounded-full hover:bg-pink-100 transition-colors">
          <InstagramIcon className="w-5 h-5" />
        </div>
      </div>


      <div className="text-[13px] text-gray-800 leading-relaxed font-normal">
        சென்னை கடற்கரை சாலையில் புதிய மெட்ரோ வழித்தடப் பணிகள் துவக்கம்!{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#Chennai</span>{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#MetroUpdate</span>{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#News</span>
      </div>

      <div className="w-full h-[320px] sm:h-[420px] md:h-[520px] rounded-[24px] overflow-hidden relative border border-[#FFEFE0]">
        <Image
          src={movie}
          alt="Post Image"
          fill
          className="object-cover animate-fade-in"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 550px"
          priority
        />
      </div>

    
      <div className="grid grid-cols-2 gap-2 mt-1">
      
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">1.2M</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Views</span>
          </div>
        </div>

    
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <IndianRupee className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">₹18,240</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Revenue</span>
          </div>
        </div>

     
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <Sparkles className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">96/100</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">SEO Score</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <Clock className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">7:32 PM</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Best Time</span>
          </div>
        </div>
      </div>

    
      <div className="flex items-center justify-between border-t border-[#FFEFE0] pt-4 mt-1">
       
        <div className="flex items-center gap-2 sm:gap-3.5 text-[#8E8E93]">
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-red-500 transition-colors group cursor-pointer">
            <Heart className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-red-500 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-semibold">12.4K</span>
          </button>
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-blue-500 transition-colors group cursor-pointer">
            <MessageCircle className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-blue-500/20 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-semibold">3.20K</span>
          </button>
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-green-500 transition-colors group cursor-pointer">
            <Send className="w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] transition-all" />
            <span className="text-[10px] sm:text-[11px] font-semibold">5,810</span>
          </button>
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-yellow-500 transition-colors group cursor-pointer">
            <Bookmark className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-yellow-500 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-semibold">12.4K</span>
          </button>
        </div>

    
        <button 
          onClick={() => setAnalyticsState && setAnalyticsState(true)}
          className={`flex items-center gap-1.5 border border-[#FF6B35] text-[#FF6B35] rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] font-bold ${buttonVariants({variant:'hoverButton'})} shadow-[0_2px_8px_rgba(255,107,53,0.1)] active:scale-95 shrink-0`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          Analytics
        </button>
      </div>
    </div>
  );
}

