"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { TrendingUp, ArrowRight } from "lucide-react";
import { useAuthRole } from "@/hooks/useAuthRole";

interface AdminTopic {
  id: number;
  hashtag: string;
  posts: string;
}

interface TamilTopic {
  id: number;
  rank: number;
  title: string;
  posts: string;
  category: "Politics" | "Cinema" | "General";
}

interface TrendingTopicsProps {
  onExploreMore?: () => void;
}

export default function TrendingTopics({ onExploreMore }: TrendingTopicsProps = {}) {
  const { isInfluencer } = useAuthRole();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  
  const adminTopics: AdminTopic[] = [
    { id: 1, hashtag: "#Chennai", posts: "24.5k Post" },
    { id: 2, hashtag: "#MetroUpdate", posts: "24.5k Post" },
    { id: 3, hashtag: "#News", posts: "24.5k Post" },
    { id: 4, hashtag: "#MetroUpdate", posts: "24.5k Post" },
    { id: 5, hashtag: "#News", posts: "24.5k Post" },
  ];


  const tamilTopics: TamilTopic[] = [
    { id: 1, rank: 1, title: "தமிழகத்தில் கனமழை", posts: "24.5K Posts", category: "General" },
    { id: 2, rank: 2, title: "விஜய் புதிய படம் அறிவிப்பு", posts: "18.2K Posts", category: "Cinema" },
    { id: 3, rank: 3, title: "சட்டமன்ற தேர்தல் அப்டேட்", posts: "15.4K Posts", category: "Politics" },
  ];

  const filteredTamilTopics = tamilTopics.filter((t) => {
    if (activeCategory === "All") return true;
    return t.category === activeCategory;
  });

  if (isInfluencer) {
    return (
      <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0]">
       
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Trending Tamil Topics
          </h2>
          <Link
            href="/influencer/trendradar"
            className="text-xs sm:text-sm font-semibold text-[#FF6B35] hover:text-[#D9652B] transition-colors"
          >
            View All
          </Link>
        </div>

      
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
          {["All", "Politics", "Cinema"].map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-0.5 rounded-full text-xs sm:text-sm transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FF6B35] text-white shadow-sm"
                    : "bg-[#F3F4F6] text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

  
        <div className="flex flex-col gap-3">
          {filteredTamilTopics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between py-2 group cursor-pointer hover:bg-orange-50/50 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#FF6B35]  text-sm sm:text-base min-w-[14px]">
                  {topic.rank}
                </span>
                <span className="text-sm text-gray-900 group-hover:text-[#FF6B35] transition-colors">
                  {topic.title}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
                {topic.posts}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        {adminTopics.map((topic, index) => (
          <div
            key={topic.id}
            className={`flex items-center justify-between py-2.5 border-gray-100 ${
              index === adminTopics.length - 1 ? "" : "border-b"
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
        <button
          onClick={onExploreMore}
          className={`flex items-center justify-center gap-2 px-6 py-2.5 w-full rounded-full ${buttonVariants({variant:'hoverButton'})}`}
        >
          Explore More
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
