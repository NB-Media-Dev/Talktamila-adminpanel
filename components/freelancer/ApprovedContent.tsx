"use client";

import React, { useState } from "react";
import {
  Play,
  Eye,
  Heart,
  MessageCircle,
  Globe,
  ThumbsUp,
  SlidersHorizontal,
  Check,
  X,
} from "lucide-react";

export interface Creator {
  name: string;
  isVerified: boolean;
  avatar: string;
  platform: string;
  platformType: string;
}

export interface ContentStats {
  views?: string;
  reach?: string;
  likes: string;
  comments?: string;
}

export interface RewardInfo {
  amount: string;
  condition: string;
}

export interface ApprovedContentItem {
  id: string;
  type: "video" | "image";
  mediaUrl?: string;
  duration?: string;
  posterBg?: string;
  posterContent?: {
    tagline: string;
    headline: string;
    subtext: string;
  };
  creator: Creator;
  status: string;
  title: string;
  description: string;
  stats: ContentStats;
  reward: RewardInfo;
}

export interface ApprovedContentProps {
  title?: string;
  badgeCount?: number;
  items?: ApprovedContentItem[];
  className?: string;
  onRepost?: (item: ApprovedContentItem) => void;
  onPreview?: (item: ApprovedContentItem) => void;
}

const defaultApprovedItems: ApprovedContentItem[] = [
  {
    id: "ac-1",
    type: "video",
    mediaUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    duration: "0:38",
    creator: {
      name: "Travel Tamizha",
      isVerified: true,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      platform: "Instagram Reel",
      platformType: "Instagram",
    },
    status: "Ready to Repost",
    title: "Marina Beach Sunset Vibes 🌅",
    description:
      "Chennai evenings are something else! Feel the vibe ❤️ #Chennai #MarinaBeach #Sunset #TravelTamilan",
    stats: {
      views: "125K",
      likes: "12.4K",
      comments: "478",
    },
    reward: {
      amount: "₹250",
      condition: "For 1K Impressions",
    },
  },
  {
    id: "ac-2",
    type: "image",
    posterBg: "bg-gradient-to-br from-[#FF6B35] via-[#FF5722] to-[#E63946]",
    posterContent: {
      tagline: "ELECTION 2024",
      headline: "YOUR VOTE YOUR VOICE",
      subtext: "BE RESPONSIBLE",
    },
    creator: {
      name: "News Tamila",
      isVerified: true,
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      platform: "Facebook Post",
      platformType: "Facebook",
    },
    status: "Ready to Repost",
    title: "Voting is our Right & Responsibility 🗳️",
    description:
      "Let's build a better tomorrow. Vote for a better India. Every vote counts!",
    stats: {
      reach: "85K Reach",
      likes: "5.6K",
    },
    reward: {
      amount: "₹220",
      condition: "For 1K Impressions",
    },
  },
];

export default function ApprovedContent({
  title = "Approved Content",
  badgeCount = 18,
  items: initialItems = defaultApprovedItems,
  className = "",
  onRepost,
  onPreview,
}: ApprovedContentProps) {
  const [items, setItems] = useState<ApprovedContentItem[]>(initialItems);
  const [selectedSort, setSelectedSort] = useState("Latest First");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<ApprovedContentItem | null>(null);
  const [repostedIds, setRepostedIds] = useState<Record<string, boolean>>({});

  const sortOptions = ["Latest First", "Highest Reward", "Most Views", "Oldest First"];

  const handleSortChange = (option: string) => {
    setSelectedSort(option);
    setIsDropdownOpen(false);

    const sorted = [...items];
    if (option === "Highest Reward") {
      sorted.sort((a, b) => {
        const numA = parseInt(a.reward.amount.replace(/\D/g, "")) || 0;
        const numB = parseInt(b.reward.amount.replace(/\D/g, "")) || 0;
        return numB - numA;
      });
    } else if (option === "Most Views") {
      sorted.sort((a, b) => {
        const numA = parseFloat(a.stats.views || a.stats.reach || "0") * 1000;
        const numB = parseFloat(b.stats.views || b.stats.reach || "0") * 1000;
        return numB - numA;
      });
    }
    setItems(sorted);
  };

  const handleRepostClick = (item: ApprovedContentItem) => {
    setRepostedIds((prev) => ({ ...prev, [item.id]: true }));
    if (onRepost) {
      onRepost(item);
    }
  };

  const handlePreviewClick = (item: ApprovedContentItem) => {
    setPreviewItem(item);
    if (onPreview) {
      onPreview(item);
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto flex flex-col gap-6 select-none ${className}`}>
  
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          <span className="bg-[#FFF2EC] text-[#FF6B35] text-xs font-semibold px-3 py-1 rounded-full border border-[#FFD8C9]/60 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse"></span>
            {badgeCount} New Items
          </span>
        </div>

       
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white hover:bg-gray-50 active:scale-95 text-gray-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full border border-gray-200/80 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>{selectedSort}</span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 shadow-xl rounded-2xl py-1.5 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSortChange(opt)}
                  className={`w-full text-left px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    opt === selectedSort
                      ? "bg-[#FFF2EC] text-[#FF6B35] font-bold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

    
      <div className="flex flex-col gap-5">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-[24px] sm:rounded-[28px] p-4 sm:p-5 border border-gray-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col md:flex-row gap-4 sm:gap-5"
          >
       
            <div className="w-full md:w-[280px] lg:w-[320px] h-[190px] md:h-[200px] shrink-0 rounded-2xl relative overflow-hidden group">
              {item.type === "video" ? (
                <>
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
           
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
             
                  <button
                    type="button"
                    onClick={() => handlePreviewClick(item)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/35 backdrop-blur-md border border-white/50 flex items-center justify-center text-white shadow-lg group-hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </button>

             
                  {item.duration && (
                    <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md tracking-wider">
                      {item.duration}
                    </span>
                  )}
                </>
              ) : (
                
                <div
                  className={`w-full h-full ${
                    item.posterBg ||
                    "bg-gradient-to-br from-[#FF6B35] via-[#FF5722] to-[#E63946]"
                  } p-5 flex flex-col justify-center items-center text-center text-white relative overflow-hidden group-hover:scale-105 transition-transform duration-500`}
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl pointer-events-none"></div>

                  <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase opacity-90 mb-1">
                    {item.posterContent?.tagline || "FEATURED"}
                  </span>
                  <div className="w-16 h-[1.5px] bg-white/40 my-1"></div>
                  <h4 className="text-base sm:text-lg font-black tracking-tight my-1 uppercase leading-tight">
                    {item.posterContent?.headline || item.title}
                  </h4>
                  <div className="w-16 h-[1.5px] bg-white/40 my-1"></div>
                  <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase opacity-90 mt-1">
                    {item.posterContent?.subtext || "TAKE ACTION NOW"}
                  </span>
                </div>
              )}
            </div>

       
            <div className="flex-1 flex flex-col justify-between space-y-3">
        
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.creator.avatar}
                    alt={item.creator.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-100 shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-900 text-sm sm:text-base truncate">
                        {item.creator.name}
                      </span>
                      {item.creator.isVerified && (
                        <span className="w-4 h-4 rounded-full bg-[#E55B2B] text-white flex items-center justify-center text-[9px] shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 font-medium block truncate">
                      Original Creator • {item.creator.platform}
                    </span>
                  </div>
                </div>

               
                <span className="bg-[#E8F8F0] text-[#10B981] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#D1F2E2] shrink-0">
                  {item.status}
                </span>
              </div>

           
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

      
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-gray-700 py-1">
                {item.stats.views && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span>{item.stats.views}</span>
                  </div>
                )}
                {item.stats.reach && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span>{item.stats.reach}</span>
                  </div>
                )}
                {item.stats.likes && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    {item.type === "video" ? (
                      <Heart className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ThumbsUp className="w-4 h-4 text-gray-500" />
                    )}
                    <span>{item.stats.likes}</span>
                  </div>
                )}
                {item.stats.comments && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span>{item.stats.comments}</span>
                  </div>
                )}
              </div>

         
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100/80">
            
                <div className="bg-[#FFF5EE] border border-[#FFE4D6] rounded-2xl px-4 py-1.5 flex flex-row sm:flex-col items-center justify-between sm:justify-center min-w-[110px]">
                  <span className="text-[9px] tracking-wider uppercase font-bold text-gray-400">
                    REWARD
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-[#E55B2B] leading-tight my-0.5">
                    {item.reward.amount}
                  </span>
                  <span className="text-[9px] font-medium text-gray-400">
                    {item.reward.condition}
                  </span>
                </div>

           
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handlePreviewClick(item)}
                    className="flex-1 sm:flex-none bg-white hover:bg-gray-50 active:scale-95 text-gray-700 text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full border border-gray-200 shadow-2xs transition-all cursor-pointer text-center"
                  >
                    Preview
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRepostClick(item)}
                    disabled={repostedIds[item.id]}
                    className={`flex-1 sm:flex-none text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-full shadow-[0_4px_14px_rgba(255,107,53,0.35)] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      repostedIds[item.id]
                        ? "bg-emerald-600 text-white cursor-default shadow-none"
                        : "bg-gradient-to-r from-[#FF6B35] to-[#FF521B] hover:opacity-95 text-white"
                    }`}
                  >
                    {repostedIds[item.id] ? (
                      <>
                        <Check className="w-4 h-4" /> Reposted
                      </>
                    ) : (
                      "Repost Now"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

   
      {previewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col relative animate-in zoom-in-95 max-h-[90vh]">
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 backdrop-blur-md transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

           
            <div className="overflow-y-auto flex-1">
       
              <div className="h-56 sm:h-64 bg-gray-900 relative flex items-center justify-center shrink-0">
                {previewItem.type === "video" ? (
                  <>
                    <img
                      src={previewItem.mediaUrl}
                      alt={previewItem.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute w-14 h-14 rounded-full bg-white/30 backdrop-blur-md border border-white/50 flex items-center justify-center text-white">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </>
                ) : (
                  <div
                    className={`w-full h-full ${
                      previewItem.posterBg ||
                      "bg-gradient-to-br from-[#FF6B35] via-[#FF5722] to-[#E63946]"
                    } p-6 flex flex-col justify-center items-center text-center text-white`}
                  >
                    <span className="text-sm font-semibold tracking-widest uppercase mb-1">
                      {previewItem.posterContent?.tagline}
                    </span>
                    <h4 className="text-xl font-black tracking-tight uppercase my-2">
                      {previewItem.posterContent?.headline}
                    </h4>
                    <span className="text-xs font-bold tracking-wider uppercase">
                      {previewItem.posterContent?.subtext}
                    </span>
                  </div>
                )}
              </div>

          
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={previewItem.creator.avatar}
                    alt={previewItem.creator.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">
                      {previewItem.creator.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {previewItem.creator.platform}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">
                    {previewItem.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{previewItem.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                  <div className="text-xs sm:text-sm font-semibold text-gray-700">
                    Earn <span className="text-[#FF6B35] font-extrabold">{previewItem.reward.amount}</span> {previewItem.reward.condition}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleRepostClick(previewItem);
                      setPreviewItem(null);
                    }}
                    className="bg-gradient-to-r from-[#FF6B35] to-[#FF521B] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full shadow-md hover:opacity-95 cursor-pointer text-center"
                  >
                    Repost Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
