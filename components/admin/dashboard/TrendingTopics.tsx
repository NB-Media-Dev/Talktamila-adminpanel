"use client";

import { buttonVariants } from "@/components/ui/Button";
import { TrendingUp, ArrowRight } from "lucide-react";

interface Topic {
  id: number;
  hashtag: string;
  posts: string;
}

export default function TrendingTopics() {
  const topics: Topic[] = [
    { id: 1, hashtag: "#Chennai", posts: "24.5k Post" },
    { id: 2, hashtag: "#MetroUpdate", posts: "24.5k Post" },
    { id: 3, hashtag: "#News", posts: "24.5k Post" },
    { id: 4, hashtag: "#MetroUpdate", posts: "24.5k Post" },
    { id: 5, hashtag: "#News", posts: "24.5k Post" },
  ];

  return (
    <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
    
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-red-50 text-[#FF4B2B]">
          <TrendingUp className="w-5 h-5" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Trending Topics
        </h2>
      </div>

      <div className="flex flex-col mb-4">
        {topics.map((topic, index) => (
          <div
            key={topic.id}
            className={`flex items-center justify-between py-2.5 border-gray-100 ${
              index === topics.length - 1 ? "" : "border-b"
            }`}
          >
            <span className=" text-[#FF6B35] hover:text-[#D9652B] hover:underline cursor-pointer transition-colors text-sm ">
              {topic.hashtag}
            </span>
            <span className="text-gray-400 text-xs sm:text-sm font-medium">
              {topic.posts}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-1">
        <button className={`flex items-center justify-center gap-2 px-6 py-2.5 w-full rounded-full ${buttonVariants({variant:'hoverButton'})}`}>
          Explore More
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
