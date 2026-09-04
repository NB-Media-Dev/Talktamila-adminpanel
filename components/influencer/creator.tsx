"use client";

import  { useState } from "react";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import {  MetricsSkeleton } from "@/components/ui/Skeletonloading";
import Image, { StaticImageData } from "next/image";
import avatar1 from "@/public/Images/avatar1.png";
export interface CreatorItem {
  id: string;
  name: string;
  handle: string;
  score: number;
  avatar: string | StaticImageData;
  isFollowing?: boolean;
}

const creatorsData: CreatorItem[] = [
  {
    id: "1",
    name: "Indhu Vlogs",
    handle: "@indhuvlogs",
    score: 92,
    avatar: avatar1,
    isFollowing: false,
  },
  {
    id: "2",
    name: "Tech Tamizha",
    handle: "@techtamizha",
    score: 92,
    avatar: avatar1,
    isFollowing: false,
  },
  {
    id: "3",
    name: "Chennai Paiyan",
    handle: "@chennaipaiyan",
    score: 89,
    avatar: avatar1,
    isFollowing: false,
  },
  {
    id: "4",
    name: "Ananya Trends",
    handle: "@ananyatrends",
    score: 95,
    avatar: avatar1,
    isFollowing: false,
  },
];

export interface CreatorProps {
  limit?: number;
  isLoading?: boolean;
}

export default function Creator({ limit = 2, isLoading: propIsLoading }: CreatorProps) {
  const [isLoading, setIsLoading] = useState(propIsLoading ?? true);
  UsetimeoutLoader(setIsLoading);
  const [creators, setCreators] = useState<CreatorItem[]>(creatorsData);

  if (isLoading) {
    return < MetricsSkeleton count={2} columns={2}/>;
  }

  const toggleFollow = (id: string) => {
    setCreators((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFollowing: !item.isFollowing } : item
      )
    );
  };

  const displayedCreators = limit ? creators.slice(0, limit) : creators;

  return (
    <div className="w-full select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {displayedCreators.map((creator) => (
          <div
            key={creator.id}
            className="bg-white rounded-[20px] sm:rounded-[28px] p-3.5 sm:p-4 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-200 flex items-center justify-between gap-2.5 sm:gap-4 min-w-0"
          >
           
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              
              <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full p-[2px] bg-gradient-to-tr from-[#FF6B35] via-[#FF8C42] to-[#FF4D8D] shrink-0 shadow-xs">
                <div className="w-full h-full rounded-full overflow-hidden bg-white border border-white">
                  <Image
                    src={creator.avatar}
                    alt={creator.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              </div>

              
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-base font-bold text-gray-900 truncate tracking-tight">
                  {creator.name}
                </h4>
                <p className="text-[11px] sm:text-xs font-semibold text-gray-400 truncate mt-0.5">
                  {creator.handle}
                </p>
              </div>
            </div>

          
            <div className="flex items-center gap-3 sm:gap-6 shrink-0">
             
              <div className="text-right shrink-0">
                <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Score
                </span>
                <span className="text-sm sm:text-lg font-extrabold text-gray-900">
                  {creator.score}
                </span>
              </div>

             
              <button
                onClick={() => toggleFollow(creator.id)}
                className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0 ${
                  creator.isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    : "border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                }`}
              >
                {creator.isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
