"use client";

import React, { useContext, useState, useRef } from "react";
import { useContenthook } from "@/hooks/useContent";
import Image from "next/image";
import { X} from "lucide-react";
import avatar4 from "@/public/Images/avatar4.png";
import movie from "@/public/Images/movie.jpg";
import InfluencerPostAnalytics from "@/components/influencer/InfluencerPostAnalytics";
import { useAuthRole } from "@/hooks/useAuthRole";
import {  InstagramIcon } from "@/public/Svgicons/svgicons";
import { FeedCardfooter } from "./FeedCardfooter";
import { FeedCardheader } from "./FeedCardheader";



export default function FeedImagePost() {
  const { isInfluencer , isFreelancer } = useAuthRole();

   const Fooderdetail={
      isViews:'1.2M',
    isRevenue:'18,250',
    isAIScore:'96/100',
    isNextTime:'8:32PM',
    isLike:'12.4K',
    isMessage:'3.20K',
    isSend:'5,810',
    isSaved:'12.4k',
  }

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

      <FeedCardheader
        avatar={avatar4}
        name="News Tamila"
        username="@news_tamil"
        location="Chennai, India"
        time="12m"
        rightElement={
          <div className="text-[#E1306C] p-2 bg-pink-50 rounded-full hover:bg-pink-100 transition-colors">
            <InstagramIcon className="w-5 h-5" />
          </div>
        }
      />

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
        <FeedCardfooter PostAnalysis={Fooderdetail}
       /> 
      )}
    </div>
  );
}

