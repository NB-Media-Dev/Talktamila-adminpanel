"use client";

import  { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UsetimeoutLoader } from "@/hooks/Usetimeoutloader";
import { MetricsSkeleton } from "@/components/ui/Skeletonloading";
import avatar1 from "@/public/Images/avatar1.png"
import Image, { StaticImageData } from "next/image";
interface HighlightItem {
  id: number;
  location: string;
  image: string | StaticImageData;
  title: string;
  description: string;
}

export default function RegionalHightlights() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const highlights: HighlightItem[] = [
    {
      id: 1,
      location: "Madurai",
      image: avatar1,
      title: "Food Festival Trends",
      description: "Cultural culinary tourism is spiking on social feeds.",
    },
    {
      id: 2,
      location: "Coimbatore",
      image: avatar1,
      title: "EV Startup Growth",
      description: "Local startups lead in sustainable mobility discussions.",
    },
    {
      id: 3,
      location: "Kanchipuram",
      image: avatar1,
      title: "Handloom 2.0",
      description: "D2C textile brands gaining massive traction online.",
    },
    {
      id: 4,
      location: "Tiruchendur",
      image: avatar1,
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
   const [isLoading, setIsLoading] = useState( true);
  UsetimeoutLoader(setIsLoading);


  return (
    <>

      <div className="block lg:hidden w-full bg-white rounded-[24px] sm:rounded-[32px] p-3.5 sm:p-5 border border-gray-100 shadow-xs select-none">
        {isLoading ? <MetricsSkeleton count={4} columns={2} /> : <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {highlights.map((item) => (
            <div
              key={item.id}
              className="w-full bg-[#FFECE2] border border-[#FFE3D5] rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col justify-between hover:shadow-md transition-all duration-300 group cursor-pointer"
            >
              <div className="relative h-24 sm:h-36 w-full rounded-xl overflow-hidden shrink-0 mb-2 sm:mb-3">
                <Image
                  src={item.image}
                  alt={`${item.location} highlight`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute bottom-2 left-2.5 font-bold text-white text-xs sm:text-base drop-shadow-sm z-10">
                  {item.location}
                </span>
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-xs sm:text-base font-extrabold text-gray-900 leading-snug tracking-tight line-clamp-1 group-hover:text-[#FF5A26] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-600 font-medium leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div> }
        
      </div>

        {isLoading ? <div className="hidden lg:block w-full"><MetricsSkeleton count={4} columns={4} /></div> : <div className="hidden lg:flex flex-col gap-5 w-full">

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
                <Image
                  src={item.image}
                  alt={`${item.location} highlight`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              
                <span className="absolute bottom-4 left-5 font-bold text-white text-base sm:text-lg tracking-wide drop-shadow-sm select-none z-10">
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
      </div>}
     
    </>
  );
}
