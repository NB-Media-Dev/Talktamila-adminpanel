"use client";

import { Star, CheckCircle2 } from "lucide-react";
import verified from "@/public/Images/verifiyedprofile.jpg";

export interface VerifiedReposterProps {
  name?: string;
  role?: string;
  level?: string;
  rating?: number;
  reviewsCount?: number;
  avatarUrl?: string | any;
  className?: string;
}

export default function VerifiedReposter({
  name = "Arun Kumar",
  role = "Verified Reposter",
  level = "Lv 6",
  rating = 4.8,
  reviewsCount = 235,
  avatarUrl = verified,
  className = "",
}: VerifiedReposterProps) {


  return (
    <div
      className={`w-full max-w-full bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col items-center text-center relative ${className}`}
    >

      <div className="relative mb-3">
        <img
          src={avatarUrl}
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
         loading="lazy"/>
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#C04808] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white shadow-xs whitespace-nowrap">
          {level}
        </span>
      </div>


      <div className="flex items-center gap-1.5 justify-center mt-1">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg tracking-tight">
          {name}
        </h3>
        <CheckCircle2 className="w-4 h-4 text-[#C04808] fill-[#C04808] text-white shrink-0" />
      </div>

      <p className="text-xs text-gray-500 font-medium mt-0.5">{role}</p>


      <div className="flex items-center justify-center gap-1 mt-3">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 fill-[#C04808] text-[#C04808]"
            />
          ))}
        </div>
        <span className="font-bold text-xs text-gray-900 ml-1">
          {rating.toFixed(1)}
        </span>
        <span className="text-xs text-gray-400">({reviewsCount})</span>
      </div>
    </div>
  );
}
