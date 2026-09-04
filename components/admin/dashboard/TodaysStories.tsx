"use client";

import Image, { type StaticImageData } from "next/image";
import { Zap, ChevronDown, ChevronUp } from "lucide-react";
import avatar1 from "@/public/Images/profile1.jpg";
import avatar2 from "@/public/Images/profile2.jpg";
import avatar3 from "@/public/Images/profile3.jpg";
import avatar4 from "@/public/Images/profile4.jpg";
import { useState } from "react";

interface Story {
  id: number;
  userName: string;
  avatar: StaticImageData;
  hasActiveStory: boolean;
}

export default function TodayStories() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const stories: Story[] = [
    { id: 1, userName: "Amrita", avatar: avatar1, hasActiveStory: true },
    { id: 2, userName: "Priya", avatar: avatar2, hasActiveStory: true },
    { id: 3, userName: "Arjun", avatar: avatar3, hasActiveStory: true },
    { id: 4, userName: "Karthik", avatar: avatar4, hasActiveStory: true },
    { id: 5, userName: "Vishwa", avatar: avatar1, hasActiveStory: true },
    { id: 6, userName: "Swathi", avatar: avatar2, hasActiveStory: true },
    { id: 7, userName: "Deepak", avatar: avatar3, hasActiveStory: true },
    { id: 8, userName: "Ananya", avatar: avatar4, hasActiveStory: true },
    { id: 9, userName: "Rohan", avatar: avatar1, hasActiveStory: true },
    { id: 10, userName: "Kavya", avatar: avatar2, hasActiveStory: true },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const isAtTop = e.currentTarget.scrollTop === 0;
    if (!isAtTop) return;

    const currentY = e.targetTouches[0].clientY;
    const diff = currentY - touchStart;

    if (diff > 50) {
      setIsExpanded(false);
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
  };

  return (
    <>
      <div
        className={`absolute top-0 right-0 z-30 flex flex-col items-center bg-[#FFFDFB]/95 border border-[#FFEFE0] rounded-full py-3 px-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 w-[72px] sm:hidden ${
          isExpanded ? "h-[480px]" : "h-[178px]"
        }`}
      >
        {!isExpanded ? (
          <div className="flex flex-col items-center gap-7.5 w-full mt-2">
            <div className="relative shrink-0 group cursor-pointer hover:scale-105 transition-all duration-200">
              <div className="w-[55px] h-[75px] p-[2.5px] rounded-[28px] bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]">
                <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-gray-50">
                  <Image
                    src={stories[0].avatar}
                    alt={stories[0].userName}
                    fill
                    sizes="55px"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="absolute bottom-[2px] right-[2px] w-[16px] h-[16px] bg-[#FF3B30] text-white rounded-full border border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-2.5 h-2.5"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </span>
            </div>

            <button
              onClick={() => setIsExpanded(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EAE3DC] hover:bg-[#DFD7CF] active:scale-90 transition-all text-[#7A7571] cursor-pointer"
              title="View More Stories"
              aria-label="Expand Stories"
            >
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-between h-full w-full">
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex flex-col items-center gap-3 overflow-y-auto no-scrollbar flex-1 w-full pb-1"
            >
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="relative shrink-0 group cursor-pointer hover:scale-105 transition-all duration-200"
                >
                  <div className="w-[55px] h-[65px] p-[2.5px] rounded-[28px] bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]">
                    <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-gray-50">
                      <Image
                        src={story.avatar}
                        alt={story.userName}
                        fill
                        sizes="55px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="absolute bottom-[2px] right-[2px] w-[16px] h-[16px] bg-[#FF3B30] text-white rounded-full border border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-2.5 h-2.5"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EAE3DC] hover:bg-[#DFD7CF] active:scale-90 transition-all text-[#7A7571] cursor-pointer shrink-0 mt-1"
              title="Collapse Stories"
              aria-label="Collapse Stories"
            >
              <ChevronUp className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

     
      <div className="hidden sm:flex sm:flex-col sm:relative sm:top-0 sm:right-0 sm:z-0 sm:w-full sm:max-w-full sm:bg-white sm:rounded-[32px] sm:p-5 sm:shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:border sm:border-[#FFEFE0] sm:overflow-hidden">
        <div className="flex items-center justify-between mb-2 py-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-50 text-red-500">
              <Zap className="w-5 h-5 fill-orange-400 stroke-orange-200" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Today&apos;s Stories
            </h2>
          </div>
          <button className="text-sm text-[#FF6B35] hover:text-[#D9652B] font-semibold transition-colors cursor-pointer shrink-0">
            View All
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 mb-3 w-full max-w-full">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            >
              <div className="relative shrink-0 hover:scale-105 transition-all duration-200">
                <div className="w-[55px] h-[65px] p-[2.5px] rounded-[28px] bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]">
                  <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-gray-50">
                    <Image
                      src={story.avatar}
                      alt={story.userName}
                      fill
                      sizes="55px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className="absolute bottom-[2px] right-[2px] w-[16px] h-[16px] bg-[#FF3B30] text-white rounded-full border border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-2.5 h-2.5"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
  