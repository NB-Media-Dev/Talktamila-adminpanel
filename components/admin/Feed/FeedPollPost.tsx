"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MoreHorizontal
} from "lucide-react";
import avatar3 from "@/public/Images/avatar3.png";
import InfluencerPostAnalytics from "@/components/influencer/InfluencerPostAnalytics";
import { useAuthRole } from "@/hooks/useAuthRole";
import { FeedCardfooter } from "./FeedCardfooter";
import { FeedCardheader } from "./FeedCardheader";

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export default function FeedPollPost() {

  const { isInfluencer,isFreelancer } = useAuthRole();

  const [options, setOptions] = useState<PollOption[]>([
    { id: 1, text: "Caption Generator", votes: 440 },
    { id: 2, text: "Voice Over", votes: 280 },
    { id: 3, text: "Poster Studio", votes: 180 },
    { id: 4, text: "Translate", votes: 80 }
  ]);

  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = (id: number) => {
    if (hasVoted) return;
    setSelectedOptionId(id);
    setOptions(prev =>
      prev.map(opt =>
        opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
      )
    );
    setHasVoted(true);
  };

  const Fooderdetail={
      isViews:'1.2M',
    isRevenue:'18,250',
    isAIScore:'96/100',
    isNextTime:'8:32PM',
    isLike:'12.4K',
    isMessage:'3.20K',
    isSend:'5,810',
    isSaved:'12.4k',
  }

  return (
    <div className="w-full bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4">

      <FeedCardheader
        avatar={avatar3}
        name="Tech Tamizhan"
        username="@tech_tamizhan"
        location="Coimbatore, India"
        time="2h"
        rightElement={
          <>
            <span className="bg-[#FFF6ED] text-[#E05D24] border border-[#FFEFE0] rounded-full px-2.5 py-0.5 text-[0.5625rem] font-bold tracking-wider uppercase">
              Poll
            </span>
            <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </>
        }
      />

      <div className="text-[0.8125rem] text-gray-800 leading-relaxed font-normal">
        தமிழில் AI கருவிகள் - நீங்கள் எதை அதிகம் பயன்படுத்துகிறீர்கள்?{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#AITools</span>{" "}
        <span className="text-[#FF6B35] font-semibold cursor-pointer">#Tamil</span>
      </div>

      <div className="flex flex-col gap-2.5 my-1">
        {options.map((opt) => {
          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          const isSelected = opt.id === selectedOptionId;

          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={hasVoted}
              className={`w-full relative h-12 rounded-full overflow-hidden text-left border transition-all duration-300 flex items-center justify-between px-5 cursor-pointer select-none group active:scale-[0.98] ${hasVoted
                  ? isSelected
                    ? "border-[#FF6B35] bg-orange-50/10"
                    : "border-[#FFEFE0] bg-gray-50/30"
                  : "border-[#FFEFE0] bg-white hover:border-[#FF6B35] hover:shadow-sm"
                }`}
            >

              <div
                className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ease-out ${isSelected ? "bg-gradient-to-r from-[#FCE6D4] to-[#FCE3CC]" : "bg-[#FFF6ED]"
                  }`}
                style={{ width: `${percentage}%` }}
              />

              <span className={`relative z-10 text-[0.78125rem] font-medium transition-colors ${isSelected ? "text-[#E05D24] font-bold" : "text-gray-800 group-hover:text-[#E05D24]"
                }`}>
                {opt.text}
              </span>

              <span className="relative z-10 text-[0.78125rem] font-bold text-gray-900">
                {percentage}%
              </span>
            </button>
          );
        })}
        {hasVoted && (
          <span className="text-[0.625rem] text-[#8E8E93] text-right px-1 mt-0.5 animate-fade-in font-medium">
            Total votes: {totalVotes.toLocaleString()} • Clicked to vote
          </span>
        )}
      </div>

      {isInfluencer || isFreelancer ? (
        <InfluencerPostAnalytics
          igReach="8.5K"
          fbReach="5.2K"
          ytReach="1.9K"
          threadsReach="3.4K"
          earnedAmount="₹3,140"
          views="18.5K"
          likes="230"
          comments="924"
          shares="512"
          saves="255"
          aiPerformanceScore="81"
          aiPerformanceLabel="Good"
          bestTime="Today, 8:00 PM"
          expectedReach="50K – 80K"
          trendingProb="Medium"
          seoScore="82"
          qualityScore="85"
        />
      ) : (
       <FeedCardfooter PostAnalysis={Fooderdetail}
       />  
      )}
    </div>
  );
}

