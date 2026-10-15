"use client";

import React, { useState, useRef } from "react";
import { X, Calendar, Clock, Sparkles, TrendingUp } from "lucide-react";
import { InstagramIcon } from "@/public/Svgicons/svgicons";
import { FeedPostSkeleton } from "@/components/ui/Skeletonloading";
import { UsetimeoutLoader as useTimeoutLoader } from "@/hooks/Usetimeoutloader";
const avatar4 = "/Images/avatar4.png";
const metro = "/Images/metro.jpg";
import Image from "next/image";

type QueueEditProps = {
  isLoading?: boolean;
  onClose?: () => void;
};

export default function QueueEdit({
  isLoading: propIsLoading,
  onClose,
}: QueueEditProps = {}) {
  const [isLoading, setIsLoading] = useState(propIsLoading ?? true);
  useTimeoutLoader(setIsLoading);

  const [publishDate, setPublishDate] = useState("2025-11-19");
  const [publishTime, setPublishTime] = useState("18:30");
  const [caption, setCaption] = useState(
    "சென்னை கடற்கரை சாலையில் புதிய மெட்ரோ வழித்தடப் பணிகள் துவக்கம்! #Chennai #MetroUpdate #News #TamilCreators"
  );

  const [channels, setChannels] = useState({
    talkTamila: true,
    instagramReels: true,
    xThread: false,
    whatsappBroadcast: true,
  });

  if (isLoading) {
    return <FeedPostSkeleton />;
  }

  return (
    
    <div className="w-full max-w-md mx-auto border rounded-[28px] p-4 sm:p-5 flex flex-col gap-4 shadow-sm bg-white max-h-[85vh] sm:max-h-[640px] overflow-y-auto scrollbar-thin">
      
      
      <div className="flex justify-between items-center pb-2 pt-2  border-b sticky top-0  bg-white z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <h3 className="text-sm sm:text-base font-bold">
            Quick Edit Studio
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 border rounded-full bg-[#FFF2EC] text-[#D45113] border-[#FFD2BE]">
            Active Editing
          </span>
         <button 
            type="button" 
            onClick={onClose}
            className="p-1 rounded-full border cursor-pointer hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      
      <div className="border border-gray-200 rounded-2xl p-3 flex flex-col gap-3 bg-amber-50 ">
       <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            
            <div className="w-9 h-9 rounded-full border border-gray-200 relative overflow-hidden shrink-0">
              <Image
                src={avatar4} 
                alt="Karthik Raja Profile"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            
            <div className="flex flex-col">
              <span className="text-md font-bold leading-tight">Karthik Raja</span>
              <span className="text-[13px] leading-tight opacity-60">@karthik_raja • Chennai</span>
            </div>
          </div>
          <InstagramIcon className="w-5 h-5" />
        </div>
              
        <div className="w-full aspect-video border border-gray-200 rounded-xl relative overflow-hidden flex items-end p-3 bg-gray-50 z-0">
         
          <Image
            src={metro} 
            alt="Metro"
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover"
            priority
            
          />
          <div className="w-full p-2 border border-gray-200 rounded-lg text-xs backdrop-blur-md bg-white/70 font-semibold truncate relative z-10 text-gray-800 shadow-xs">
            Previewing: reel_chennai_metro_v2.mp4
          </div>
        </div>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full text-xs font-medium resize-none focus:outline-hidden p-2 border border-gray-200 rounded-md bg-white placeholder:text-gray-400 placeholder:opacity-60"
        />

        <div className="flex justify-between items-center text-[10px] font-medium pt-1">
          <div className="flex items-center gap-1 text-[#F27D42] ">
            <Sparkles size={18} />
            <span className="text-[15px] font-bold">Tamil SEO optimized (Score: 94/100)</span>
          </div>
          <span className="opacity-60 text-[15px] ">{caption.length}/500</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 bg-amber-50 p-3 border border-gray-200 rounded-2xl">
        <h4 className="text-md font-bold uppercase tracking-wider opacity-70">
          Publishing Schedule
        </h4>
        <div className="grid grid-cols-2 gap-2 ">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
            <Calendar size={14} className="opacity-60" />
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="text-sm font-semibold focus:outline-hidden w-full bg-transparent border-none"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-white">
            <Clock size={14} className="opacity-60" />
            <input
              type="time"
              value={publishTime}
              onChange={(e) => setPublishTime(e.target.value)}
              className="text-sm font-semibold focus:outline-hidden w-full bg-transparent border-none"
            />
          </div>
        </div>
        <div className="flex justify-between items-center text-[15px] font-medium px-1">
          <span className="opacity-60">Timezone: Asia/Kolkata (IST)</span>
          <span className="font-bold text-[#F27D42] "><TrendingUp size={16} className="inline mr-1" />+38% High Traffic Window</span>
        </div>
      </div>

      
      <div className="flex flex-col gap-2 bg-amber-50 p-3 border border-gray-200 rounded-2xl">
        <h4 className="text-md font-bold uppercase tracking-wider opacity-70">
          Cross-Publishing Channels
        </h4>
        <div className="flex flex-col border border-gray-200 rounded-xl divide-y">
          <label className="flex justify-between items-center p-2.5 cursor-pointer text-xs font-medium hover:bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 border border-gray-200 rounded-full flex items-center justify-center text-[12px] bg-orange-500 text-white">TT</span> 
              {/* 📻 */}
              <span>Talk Tamila Main Feed</span>
            </div>
            <input
              type="checkbox"
              checked={channels.talkTamila}
              onChange={(e) => setChannels({ ...channels, talkTamila: e.target.checked })}
              className="w-4 h-4 rounded border accent-orange-500 cursor-pointer "
              // transition-colors checked:bg-orange-500 checked:border-orange-500 appearance-none
            />
          </label>

          <label className="flex justify-between items-center p-2.5 cursor-pointer text-xs font-medium hover:bg-gray-50/50">
            <div className="flex items-center gap-2">
              <InstagramIcon className="w-7 h-7 border rounded-full flex items-center justify-center text-[13px] bg-pink-500 text-white " />
              <span>Instagram Reels Sync (@karthik_vlogs)</span>
            </div>
            <input
              type="checkbox"
              checked={channels.instagramReels}
              onChange={(e) => setChannels({ ...channels, instagramReels: e.target.checked })}
              className="w-4 h-4 rounded border accent-orange-500 cursor-pointer"
            />
          </label>

          <label className="flex justify-between items-center p-2.5 cursor-pointer text-xs font-medium hover:bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 border rounded-md flex items-center justify-center font-bold text-[13px] bg-black text-white">X</span>
              <span>X / Twitter Thread</span>
            </div>
            <input
              type="checkbox"
              checked={channels.xThread}
              onChange={(e) => setChannels({ ...channels, xThread: e.target.checked })}
              className="w-4 h-4 rounded border accent-orange-500 cursor-pointer"
            />
          </label>

          <label className="flex justify-between items-center p-2.5 cursor-pointer text-xs font-medium hover:bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 border rounded-full flex items-center justify-center text-[13px] bg-green-500 text-white">💬</span>
              <span>WhatsApp Broadcast (12.4k members)</span>
            </div>
            <input
              type="checkbox"
              checked={channels.whatsappBroadcast}
              onChange={(e) => setChannels({ ...channels, whatsappBroadcast: e.target.checked })}
              className="w-4 h-4 rounded border accent-orange-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

   
      <div className="flex gap-2.5 mt-auto pt-2 border-t sticky bottom-0 bg-white z-10">
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-full border text-xs font-bold cursor-pointer transition-all active:scale-98 bg-orange-500 text-white hover:opacity-90"
        >
          Save Changes & Queue
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-full border text-xs font-medium opacity-70 hover:opacity-100 cursor-pointer bg-white hover:bg-gray-50"
        >
          Discard
        </button>
      </div> 

    </div>
  );
}


