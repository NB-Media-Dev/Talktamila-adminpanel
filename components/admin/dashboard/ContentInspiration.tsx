"use client";


import { Lightbulb } from "lucide-react";

interface InspirationItem {
  id: number;
  text: string;
  bgClass: string;
  hoverBgClass: string;
}

export default function ContentInspiration() {
  const inspirations: InspirationItem[] = [
    {
      id: 1,
      text: "5 Tamil hooks that doubled watch time this week",
      bgClass: "bg-[#FFE8D6]",
      hoverBgClass: "hover:bg-[#FCD8B8]",
    },
    {
      id: 2,
      text: "Turn today's news into a 30s reel script",
      bgClass: "bg-[#FFF3E8]",
      hoverBgClass: "hover:bg-[#FEE5D0]",
    },
    {
      id: 3,
      text: "Carousel idea: Pongal recipes from 5 districts",
      bgClass: "bg-[#FFF9F2]",
      hoverBgClass: "hover:bg-[#FDF0E2]",
    },
  ];

  return (
    <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">

      <div className="flex items-center gap-2 mb-4.5">
        <div className="p-1.5 rounded-lg bg-[#FFF7ED] text-[#EA580C]">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Content Inspiration
        </h2>
      </div>

   
      <div className="flex flex-col gap-3">
        {inspirations.map((item) => (
          <div
            key={item.id}
            className={`px-5 py-4 ${item.bgClass} ${item.hoverBgClass} text-gray-800 text-sm font-semibold rounded-[24px] cursor-pointer transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5`}
          >
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
