"use client";

import { Zap } from "lucide-react";

interface NewsItem {
  id: number;
  time: string;
  title: string;
}

export default function BreakingNews() {
  const newsList: NewsItem[] = [
    {
      id: 1,
      time: "2m",
      title: "சென்னை மெட்ரோ இரண்டாம் கட்டப் பணிகள் துவக்கம்",
    },
    {
      id: 2,
      time: "18m",
      title: "தமிழ்நாட்டில் புதிய தொழில் முதலீடு ₹4,200 கோடி",
    },
    {
      id: 3,
      time: "46m",
      title: "கோவை விமான நிலையம் விரிவாக்கம் அறிவிப்பு",
    },
  ];

  return (
    <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
      
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FFF2F0] text-[#FF4B2B]">
              <Zap className="w-5 h-5 fill-[#FF4B2B]" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Breaking News
            </h2>
          </div>
          <a
            href="#"
            className="text-xs sm:text-sm text-[#FF6B35] hover:text-[#D9652B] transition-colors duration-200"
          >
            All news
          </a>
        </div>

      <div className="flex flex-col gap-3.5">
        {newsList.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50/50 p-1.5 -mx-1.5 rounded-2xl transition-all duration-200"
          >
          
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#FFF2F0] text-[#FF4B2B] text-xs font-bold shrink-0 transition-transform group-hover:scale-105 duration-200">
              {item.time}
            </div>

            <p className="text-sm text-gray-800 font-medium leading-snug group-hover:text-[#FF6B35] transition-colors duration-200">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
