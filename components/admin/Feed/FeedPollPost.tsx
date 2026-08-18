"use client";

import  { useState, useContext } from "react";
import { useContenthook } from "@/hooks/useContent";
import Image from "next/image";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  TrendingUp, 
  IndianRupee, 
  Sparkles, 
  Clock, 
  MapPin,
  BarChart2,
  MoreHorizontal
} from "lucide-react";
import avatar3 from "@/public/Images/avatar3.png";

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export default function FeedPollPost() {
  const context = useContext(useContenthook);
  const setAnalyticsState = context?.setAnalyticsState;

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

  return (
    <div className="w-full bg-white rounded-[32px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <div className="w-11 h-11 rounded-full overflow-hidden relative border border-[#FFEFE0] bg-gray-50 shrink-0">
            <Image
              src={avatar3}
              alt="Tech Tamizhan Avatar"
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
         
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[14px] text-gray-900 leading-none">Tech Tamizhan</span>
              <span className="text-[#8E8E93] text-[12px] font-normal">@tech_tamizhan</span>
            </div>
            <div className="flex items-center gap-1 text-[#8E8E93] mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[11px]">Coimbatore, India</span>
              <span className="text-[11px]">•</span>
              <span className="text-[11px]">2h</span>
            </div>
          </div>
        </div>

      
       <div className="flex items-center gap-2">
          <span className="bg-[#FFF6ED] text-[#E05D24] border border-[#FFEFE0] rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase">
            Poll
          </span>
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

    
      <div className="text-[13px] text-gray-800 leading-relaxed font-normal">
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
              className={`w-full relative h-12 rounded-full overflow-hidden text-left border transition-all duration-300 flex items-center justify-between px-5 cursor-pointer select-none group active:scale-[0.98] ${
                hasVoted 
                  ? isSelected
                    ? "border-[#FF6B35] bg-orange-50/10" 
                    : "border-[#FFEFE0] bg-gray-50/30"
                  : "border-[#FFEFE0] bg-white hover:border-[#FF6B35] hover:shadow-sm"
              }`}
            >
            
              <div 
                className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ease-out ${
                  isSelected ? "bg-gradient-to-r from-[#FCE6D4] to-[#FCE3CC]" : "bg-[#FFF6ED]"
                }`}
                style={{ width: `${percentage}%` }}
              />

          
              <span className={`relative z-10 text-[12.5px] font-medium transition-colors ${
                isSelected ? "text-[#E05D24] font-bold" : "text-gray-800 group-hover:text-[#E05D24]"
              }`}>
                {opt.text}
              </span>

             
              <span className="relative z-10 text-[12.5px] font-bold text-gray-900">
                {percentage}%
              </span>
            </button>
          );
        })}
        {hasVoted && (
          <span className="text-[10px] text-[#8E8E93] text-right px-1 mt-0.5 animate-fade-in font-medium">
            Total votes: {totalVotes.toLocaleString()} • Clicked to vote
          </span>
        )}
      </div>

  
      <div className="grid grid-cols-2 gap-2 mt-1">
       
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">315K</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Views</span>
          </div>
        </div>

         <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <IndianRupee className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">₹3,140</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Revenue</span>
          </div>
        </div>

       
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <Sparkles className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">81/100</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">AI Score</span>
          </div>
        </div>

    
        <div className="flex items-center gap-2 bg-[#FFF6ED] rounded-full px-3 py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02]">
          <Clock className="w-4 h-4 text-[#FF6B35]" />
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-900 leading-none">1:00 PM</span>
            <span className="text-[8px] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5">Next Time</span>
          </div>
        </div>
      </div>

   
      <div className="flex items-center justify-between border-t border-[#FFEFE0] pt-4 mt-1">
      
        <div className="flex items-center gap-2 sm:gap-3.5 text-[#8E8E93]">
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-red-500 transition-colors group cursor-pointer">
            <Heart className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-red-500 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-semibold">230</span>
          </button>
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-blue-500 transition-colors group cursor-pointer">
            <MessageCircle className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-blue-500/20 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-semibold">924</span>
          </button>
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-green-500 transition-colors group cursor-pointer">
            <Send className="w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] transition-all" />
            <span className="text-[10px] sm:text-[11px] font-semibold">512</span>
          </button>
          <button className="flex items-center gap-0.5 sm:gap-1 hover:text-yellow-500 transition-colors group cursor-pointer">
            <Bookmark className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] group-hover:fill-yellow-500 transition-all" />
            <span className="text-[10px] sm:text-[11px] font-semibold">255</span>
          </button>
        </div>

    
        <button 
          onClick={() => setAnalyticsState && setAnalyticsState(true)}
          className="flex items-center gap-1.5 border border-[#FF6B35] text-[#FF6B35] rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] font-bold hover:bg-[#FF6B35] hover:text-white transition-all cursor-pointer shadow-[0_2px_8px_rgba(255,107,53,0.1)] active:scale-95 shrink-0"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          Analytics
        </button>
      </div>
    </div>
  );
}
