"use client";

import  { useState } from "react";
import Image, { StaticImageData } from "next/image";
import avatar1 from "@/public/Images/avatar1.png";
import avatar2 from "@/public/Images/avatar2.png";
import avatar3 from "@/public/Images/avatar3.png";
import { buttonVariants } from "../ui/Button";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { Avatarloading } from "../ui/Skeletonloading";

export interface RepostorItem {
  id: string;
  name: string;
  amount: string;
  avatar: string | StaticImageData;
}

export interface TopRepostorsProps {
  title?: string;
  viewAllText?: string;
  repostors?: RepostorItem[];
  onViewAll?: () => void;
  onRepostorClick?: (repostor: RepostorItem) => void;
  className?: string;
}

const defaultRepostors: RepostorItem[] = [
  {
    id: "1",
    name: "Ravi Kumar",
    amount: "₹12,450",
    avatar: avatar1,
  },
  {
    id: "2",
    name: "Priya Sharma",
    amount: "₹10,230",
    avatar: avatar2,
  },
  {
    id: "3",
    name: "Anand Raj",
    amount: "₹8,150",
    avatar: avatar3,
  },

];

export default function Toprepostors({
  title = "Top Repostors",
  viewAllText = "View All",
  repostors = defaultRepostors,
  onViewAll,
  onRepostorClick,
  className = "",
}: TopRepostorsProps) {

  const [isLoading, setIsLoading] = useState( true);
    UsetimeoutLoader(setIsLoading);
  
  return (
    <div
      className={`w-full max-w-full bg-white rounded-[28px] p-4 sm:p-6 border border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] select-none flex flex-col gap-4 ${className}`}
    >
      
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className={`${buttonVariants({variant:'link'})} text-sm`}
        >
          {viewAllText}
        </button>
      </div>

      {isLoading ? <Avatarloading/> : <div className="flex flex-col gap-3">
        {repostors.map((repostor, idx) => (
          <button
            type="button"
            key={repostor.id}
            onClick={() => onRepostorClick?.(repostor)}
            className="flex items-center justify-between gap-3 group cursor-pointer hover:bg-gray-50/70 p-1.5 -mx-1.5 rounded-2xl transition-colors w-full text-left bg-transparent border-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-bold text-gray-400 w-4 text-center shrink-0">
                {idx + 1}
              </span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden relative border border-gray-100 shrink-0 bg-gray-100">
                <Image
                  src={repostor.avatar}
                  alt={repostor.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {repostor.name}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-900 shrink-0">
              {repostor.amount}
            </span>
          </button>
        ))}
      </div> }
     
    </div>
  );
}
