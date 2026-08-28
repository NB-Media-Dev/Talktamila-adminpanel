"use client";

import React, { useContext, useState, useRef } from "react";
import { useContenthook } from "@/hooks/useContent";
import Image from "next/image";
import { X} from "lucide-react";
import avatar4 from "@/public/Images/avatar4.png";
import movie from "@/public/Images/movie.jpg";
import { buttonVariants } from "@/components/ui/Button";
import InfluencerPostAnalytics from "@/components/influencer/InfluencerPostAnalytics";
import { useAuthRole } from "@/hooks/useAuthRole";
import { Barcharticons, ClockIcons, HeartIcon, IndianrupeeIcons, InstagramIcon, LocationsIcons, MessageIcons, SavedIcons, SendIcon, SparkleIcons, TrendingIcons } from "@/public/Svgicons/svgicons";



export default function FeedImagePost() {
  const context = useContext(useContenthook);
  const setAnalyticsState = context?.setAnalyticsState;
  const { isInfluencer , isFreelancer } = useAuthRole();

  const defaultImageSrc = typeof movie === "string" ? movie : (movie as any)?.src || movie;
  const [imageSrc, setImageSrc] = useState<string>(defaultImageSrc);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
    }
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    const { naturalWidth, naturalHeight } = img;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      setAspectRatio(ratio);
    }
  };

  const handleResetImage = () => {
    setImageSrc(defaultImageSrc);
    setAspectRatio(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
              <LocationsIcons/>
              <span className="text-[0.6875rem]">Chennai, India</span>
              <span className="text-[0.6875rem]">•</span>
              <span className="text-[0.6875rem]">12m</span>
            </div>
          </div>
        </div>

        <div className="text-[#E1306C] p-2 bg-pink-50 rounded-full hover:bg-pink-100 transition-colors">
          <InstagramIcon className="w-5 h-5" />
        </div>
      </div>

      <div className="text-[0.8125rem] text-gray-800 leading-relaxed font-normal">
        சென்னை கடற்கரை சாலையில் புதிய மெட்ரோ வழித்தடப் பணிகள் துவக்கம்!{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#Chennai</span>{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#MetroUpdate</span>{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#News</span>
      </div>

      <div className="w-full relative flex flex-col gap-2">
        <div 
          className="w-full rounded-[24px] overflow-hidden relative border border-[#FFEFE0] bg-gray-900/5 transition-all duration-300 flex items-center justify-center group min-h-[200px] max-h-[550px]"
          style={{
            aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
          }}
        >
          <img
            src={imageSrc}
            alt="Post Image"
            onLoad={handleImageLoad}
            className="w-full h-full object-contain animate-fade-in rounded-[24px] max-h-[550px]"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          
            {imageSrc !== defaultImageSrc && (
              <button
                onClick={handleResetImage}
                type="button"
                className="flex items-center justify-center w-7 h-7 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-full border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                title="Reset Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isInfluencer || isFreelancer ? (
        <InfluencerPostAnalytics
          igReach="12.4K"
          fbReach="8.7K"
          ytReach="5.3K"
          threadsReach="2.1K"
          earnedAmount="₹12,450"
          views="24.5K"
          likes="2.3K"
          comments="156"
          shares="489"
          saves="1.2K"
          aiPerformanceScore="92"
          aiPerformanceLabel="Excellent"
          bestTime="Today, 8:00 PM"
          expectedReach="125K – 180K"
          trendingProb="High"
          seoScore="88"
          qualityScore="93"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
              <TrendingIcons/>
              <div className="flex flex-col">
                <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">1.2M</span>
                <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Views</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
              <IndianrupeeIcons/>
              <div className="flex flex-col">
                <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">₹18,240</span>
                <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Revenue</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
              <SparkleIcons/>
              <div className="flex flex-col">
                <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">96/100</span>
                <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">SEO Score</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
              <ClockIcons/>
              <div className="flex flex-col">
                <span className="text-[0.6875rem] font-bold text-gray-900 leading-none">7:32 PM</span>
                <span className="text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Best Time</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#FFEFE0] pt-4 mt-1">
            <div className="flex items-center gap-2 sm:gap-3.5 text-[#8E8E93]">
              <button className="flex items-center gap-0.5 sm:gap-1 hover:text-red-500 transition-colors group cursor-pointer">
               <HeartIcon/>
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">12.4K</span>
              </button>
              <button className="flex items-center gap-0.5 sm:gap-1 hover:text-blue-500 transition-colors group cursor-pointer">
                <MessageIcons/>
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">3.20K</span>
              </button>
              <button className="flex items-center gap-0.5 sm:gap-1 hover:text-green-500 transition-colors group cursor-pointer">
                <SendIcon/>
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">5,810</span>
              </button>
              <button className="flex items-center gap-0.5 sm:gap-1 hover:text-yellow-500 transition-colors group cursor-pointer">
                <SavedIcons/>
                <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">12.4K</span>
              </button>
            </div>

            <button
              onClick={() => setAnalyticsState && setAnalyticsState(true)}
              className={`flex items-center gap-1.5 border border-[#FF6B35] text-[#FF6B35] rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[0.625rem] sm:text-[0.6875rem] font-bold ${buttonVariants({ variant: 'hoverButton' })} shadow-[0_2px_8px_rgba(255,107,53,0.1)] active:scale-95 shrink-0`}
            >
             <Barcharticons/>
              Analytics
            </button>
          </div>
        </>
      )}
    </div>
  );
}

