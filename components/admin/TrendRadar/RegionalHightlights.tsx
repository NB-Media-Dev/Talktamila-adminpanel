"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HighlightItem {
  id: number;
  location: string;
  image: string;
  title: string;
  description: string;
}

export default function RegionalHightlights() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const highlights: HighlightItem[] = [
    {
      id: 1,
      location: "Madurai",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80",
      title: "Food Festival Trends",
      description: "Cultural culinary tourism is spiking on social feeds.",
    },
    {
      id: 2,
      location: "Coimbatore",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
      title: "EV Startup Growth",
      description: "Local startups lead in sustainable mobility discussions.",
    },
    {
      id: 3,
      location: "Kanchipuram",
      image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=80",
      title: "Handloom 2.0",
      description: "D2C textile brands gaining massive traction online.",
    },
    {
      id: 4,
      location: "Tiruchendur",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&auto=format&fit=crop&q=80",
      title: "Spiritual Tourism",
      description: "Pilgrimage travel vlogs seeing 3x engagement surge.",
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      const targetScroll =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      
      <div className="flex items-center justify-between w-full select-none">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Regional Highlights
        </h2>
      
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll("left")}
            className="flex items-center justify-center p-2 rounded-full bg-[#FFF6ED] hover:bg-[#FCE3CC] text-gray-700 active:scale-90 transition-all cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="flex items-center justify-center p-2 rounded-full bg-[#FFF6ED] hover:bg-[#FCE3CC] text-gray-700 active:scale-90 transition-all cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="w-full flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-3 px-0.5 -mx-0.5"
      >
        {highlights.map((item) => (
          <div
            key={item.id}
            className="min-w-[270px] sm:min-w-[280px] md:min-w-[250px] flex-1 bg-white rounded-[32px] overflow-hidden border border-[#FFEFE0] shadow-[0_8px_30px_rgba(0,0,0,0.015)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,107,53,0.04)] hover:scale-[1.005] flex flex-col group cursor-pointer"
          >
          
            <div className="relative h-[160px] w-full overflow-hidden shrink-0">
              <img
                src={item.image}
                alt={`${item.location} highlight`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
             
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            
              <span className="absolute bottom-4 left-5 font-bold text-white text-base sm:text-lg tracking-wide drop-shadow-sm select-none">
                {item.location}
              </span>
            </div>

            <div className="p-5 sm:p-6 flex flex-col gap-1.5 flex-grow">
              <h3 className="text-sm sm:text-base font-bold text-gray-800 leading-snug tracking-tight group-hover:text-[#FF5A26] transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
