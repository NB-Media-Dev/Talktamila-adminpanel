"use client";

import Image, { type StaticImageData } from "next/image";
import { Zap } from "lucide-react";
import avatar1 from "@/public/Images/avatar1.png"
import avatar2 from "@/public/Images/avatar2.png"
import avatar3 from "@/public/Images/avatar3.png"
import avatar4 from "@/public/Images/avatar4.png"
import avatar5 from "@/public/Images/avatar5.png"
import avatar6 from "@/public/Images/avatar6.png"

interface Story {
  id: number;
  userName: string;
  avatar:StaticImageData;
  hasActiveStory: boolean;
}

export default function TodayStories() {

  const stories: Story[] = [
    { id: 1, userName: "Amrita", avatar:avatar1, hasActiveStory: true },
    { id: 2, userName: "Priya", avatar:avatar2, hasActiveStory: true },
    { id: 3, userName: "Arjun", avatar:avatar3, hasActiveStory: true },
    { id: 4, userName: "Karthik",avatar:avatar5, hasActiveStory: true },
    { id: 5, userName: "Vishwa",avatar:avatar6, hasActiveStory: true },
    { id: 6, userName: "swathi",avatar:avatar4, hasActiveStory: true },
  ];

  return (
    <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
    
      <div className="flex items-center justify-between mb-2 py-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-red-500">
            <Zap className="w-5 h-5 fill-orange-400 stroke-orange-200" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Today&apos;s Stories
          </h2>
        </div>
        <button className="text-xs sm:text-sm  text-[#FF6B35] hover:text-[#D9652B] transition-colors cursor-pointer">
          View All
        </button>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1  mb-3">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer">
         
            <div className="relative">
           
              <div className="p-[2px] rounded-full  bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35] transition-transform duration-300">
                <div className="w-[52px] h-[52px] sm:w-[58px] sm:h-[58px]  rounded-full border-2 border-white overflow-hidden relative bg-gray-50">
                  <Image
                    src={story.avatar}
                    alt={story.userName}
                    fill
                    sizes="(max-width: 640px) 52px, 58px"
                    className="object-cover"
                  />
                </div>
              </div>
              
              <span className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-[#FF3B30] text-white rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black shadow-sm group-hover:scale-110 transition-transform">
                +
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
