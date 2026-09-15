"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { Zap, ChevronDown, ChevronUp, Plus, Sparkles } from "lucide-react";
import avatar1 from "@/public/Images/profile1.jpg";
import avatar2 from "@/public/Images/profile2.jpg";
import avatar3 from "@/public/Images/profile3.jpg";
import avatar4 from "@/public/Images/profile4.jpg";
import beach from "@/public/Images/beach.jpg";
import food from "@/public/Images/food.jpg";
import rain from "@/public/Images/rain.jpg";
import waterfall from "@/public/Images/waterfall.jpg";
import Addstories from "./Addstories";
import PreviewStories, { type StoryUser, type StorySlide } from "./Previewstories";
import { useAuthuser } from "@/hooks/useAuthuser";
import { getAuthToken } from "@/lib/cookies";

interface BackendSlide {
  id: number;
  story_id?: number;
  imageUrl?: string;
  media_url?: string;
  media_type?: string;
  caption?: string;
  duration?: number;
  liked?: boolean;
  likes_count?: number;
  views_count?: number;
  musicTrack?: string;
}

interface BackendStoryGroup {
  id: number;
  userName: string;
  avatar?: string;
  verified?: boolean;
  timeAgo?: string;
  musicTrack?: string;
  is_my_story?: boolean;
  slides: BackendSlide[];
}

const mockFallbackStories: StoryUser[] = [
  {
    id: 991,
    userName: "Amrita",
    avatar: avatar1,
    verified: true,
    timeAgo: "1h ago",
    musicTrack: "Anirudh – Trend Beat 🎵",
    slides: [
      { id: 9911, imageUrl: beach, duration: 5000, caption: "Chennai coastal evening vibe ✨" },
      { id: 9912, imageUrl: food, duration: 5000, caption: "Authentic South Indian feast 🍛" },
    ],
  },
  {
    id: 992,
    userName: "Priya",
    avatar: avatar2,
    verified: true,
    timeAgo: "2h ago",
    slides: [
      { id: 9921, imageUrl: waterfall, duration: 5000, caption: "Courtallam waterfalls exploration 🌊" },
    ],
  },
  {
    id: 993,
    userName: "Arjun",
    avatar: avatar3,
    verified: false,
    timeAgo: "4h ago",
    slides: [
      { id: 9931, imageUrl: rain, duration: 5000, caption: "Monsoon showers in Ooty 🌧️" },
    ],
  },
  {
    id: 994,
    userName: "Karthik",
    avatar: avatar4,
    verified: true,
    timeAgo: "5h ago",
    slides: [
      { id: 9941, imageUrl: food, duration: 5000, caption: "Madurai street food crawl 🍲" },
    ],
  },
];

export default function TodayStories() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const { user: authUser } = useAuthuser();
  const [allStoryUsers, setAllStoryUsers] = useState<StoryUser[]>(mockFallbackStories);
  const [myStoryUser, setMyStoryUser] = useState<StoryUser | null>(null);
  const currentUser = (authUser as any)?.user || authUser || null;

  const BASE_URL = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://127.0.0.1:8000";

  // Fetch active stories feed from backend
  const fetchStories = useCallback(async () => {
    const token = getAuthToken();
    try {
      const res = await fetch(`${BASE_URL}/api/v1/stories`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) return;

      const data: BackendStoryGroup[] = await res.json();
      if (!Array.isArray(data)) return;

      let foundMyStory: StoryUser | null = null;
      const otherUsers: StoryUser[] = [];

      data.forEach((group) => {
        const slides: StorySlide[] = (group.slides || []).map((s) => ({
          id: s.id,
          story_id: s.story_id || s.id,
          imageUrl: s.imageUrl || s.media_url || "",
          media_type: s.media_type || "image",
          caption: s.caption,
          duration: s.duration || 5000,
          liked: s.liked,
          likes_count: s.likes_count,
          views_count: s.views_count,
          musicTrack: s.musicTrack || group.musicTrack,
        }));

        const storyUser: StoryUser = {
          id: group.id,
          userName: group.userName,
          avatar: group.avatar || avatar1,
          verified: group.verified,
          timeAgo: group.timeAgo || "Just now",
          slides: slides,
          musicTrack: group.musicTrack,
          is_my_story: Boolean(group.is_my_story),
        };

        if (group.is_my_story) {
          foundMyStory = storyUser;
        } else {
          otherUsers.push(storyUser);
        }
      });

      setMyStoryUser(foundMyStory);

      // If backend has other creators, use them; otherwise keep fallback mock creators
      const mergedList = foundMyStory
        ? [foundMyStory, ...(otherUsers.length > 0 ? otherUsers : mockFallbackStories)]
        : [...(otherUsers.length > 0 ? otherUsers : mockFallbackStories)];

      setAllStoryUsers(mergedList);
    } catch (err) {
      console.error("Failed to fetch stories:", err);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const hasMyActiveStory = Boolean(myStoryUser && myStoryUser.slides && myStoryUser.slides.length > 0);

  const openPreview = (userIndex: number) => {
    setSelectedUserIndex(userIndex);
    setIsPreviewOpen(true);
  };

  const handleMyStoryClick = () => {
    if (hasMyActiveStory) {
      // Find index of myStory in allStoryUsers (normally 0)
      const myIdx = allStoryUsers.findIndex((u) => u.is_my_story);
      openPreview(myIdx >= 0 ? myIdx : 0);
    } else {
      setIsAddStoryOpen(true);
    }
  };

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

  const displayAvatar =
    myStoryUser?.avatar ||
    currentUser?.avatar_url ||
    avatar1;

  // List of other users to display in the feed
  const feedUsers = allStoryUsers.filter((u) => !u.is_my_story);

  return (
    <>
      {/* ── Mobile Vertical View ── */}
      <div
        className={`absolute top-0 right-0 z-30 flex flex-col items-center bg-[#FFFDFB]/95 border border-[#FFEFE0] rounded-full py-3 px-2 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 w-[72px] sm:hidden ${
          isExpanded ? "h-[480px]" : "h-[178px]"
        }`}
      >
        {!isExpanded ? (
          <div className="flex flex-col items-center gap-7.5 w-full mt-2">
            {/* My Story Ring */}
            <div
              onClick={handleMyStoryClick}
              className="relative shrink-0 group cursor-pointer hover:scale-105 transition-all duration-200"
              title={hasMyActiveStory ? "View Your Story" : "Add Story"}
            >
              <div
                className={`w-[55px] h-[75px] p-[2.5px] rounded-[28px] ${
                  hasMyActiveStory
                    ? "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35] animate-pulse"
                    : "bg-gradient-to-tr from-gray-200 via-gray-300 to-gray-200"
                }`}
              >
                <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-gray-50">
                  {typeof displayAvatar === "string" ? (
                    <img src={displayAvatar} alt="Your Story" className="w-full h-full object-cover" />
                  ) : (
                    <Image src={displayAvatar} alt="Your Story" fill sizes="55px" className="object-cover" />
                  )}
                </div>
              </div>
              {/* Plus badge */}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddStoryOpen(true);
                }}
                className="absolute bottom-[2px] right-[2px] w-[18px] h-[18px] bg-[#FF3B30] text-white rounded-full border border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
                title="Add to story"
              >
                <Plus size={11} strokeWidth={3} />
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
              {/* My Story in expanded list */}
              <div
                onClick={handleMyStoryClick}
                className="relative shrink-0 group cursor-pointer hover:scale-105 transition-all duration-200"
              >
                <div
                  className={`w-[55px] h-[65px] p-[2.5px] rounded-[28px] ${
                    hasMyActiveStory
                      ? "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]"
                      : "bg-gray-200"
                  }`}
                >
                  <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-gray-50">
                    {typeof displayAvatar === "string" ? (
                      <img src={displayAvatar} alt="Your Story" className="w-full h-full object-cover" />
                    ) : (
                      <Image src={displayAvatar} alt="Your Story" fill sizes="55px" className="object-cover" />
                    )}
                  </div>
                </div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAddStoryOpen(true);
                  }}
                  className="absolute bottom-[2px] right-[2px] w-[16px] h-[16px] bg-[#FF3B30] text-white rounded-full border border-white flex items-center justify-center shadow-sm cursor-pointer"
                >
                  <Plus size={10} strokeWidth={3} />
                </span>
              </div>

              {/* Other Stories */}
              {feedUsers.map((user) => {
                const userIndexInAll = allStoryUsers.findIndex((u) => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    onClick={() => openPreview(userIndexInAll >= 0 ? userIndexInAll : 0)}
                    className="relative shrink-0 group cursor-pointer hover:scale-105 transition-all duration-200"
                  >
                    <div className="w-[55px] h-[65px] p-[2.5px] rounded-[28px] bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]">
                      <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-gray-50">
                        {typeof user.avatar === "string" ? (
                          <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                        ) : (
                          <Image src={user.avatar} alt={user.userName} fill sizes="55px" className="object-cover" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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

      {/* ── Desktop Horizontal View ── */}
      <div className="hidden sm:flex sm:flex-col sm:relative sm:top-0 sm:right-0 sm:z-0 sm:w-full sm:max-w-full sm:bg-white sm:rounded-[32px] sm:p-5 sm:shadow-[0_4px_24px_rgba(0,0,0,0.03)] sm:border sm:border-[#FFEFE0] sm:overflow-hidden">
        <div className="flex items-center justify-between mb-2 py-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-50 text-[#FF6B35]">
              <Zap className="w-5 h-5 fill-orange-400 stroke-orange-200" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Today&apos;s Stories
            </h2>
          </div>
          <button
            onClick={() => setIsAddStoryOpen(true)}
            className="text-xs text-[#FF6B35] hover:text-[#D9652B] font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>Add Story</span>
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 mb-3 w-full max-w-full">
          {/* Your Story (Click ring to view your story if active, or plus to add) */}
          <div
            onClick={handleMyStoryClick}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            title={hasMyActiveStory ? "Click to view your story" : "Add New Story"}
          >
            <div className="relative shrink-0 group-hover:scale-105 transition-all duration-200">
              <div
                className={`w-[55px] h-[65px] p-[2.5px] rounded-[28px] ${
                  hasMyActiveStory
                    ? "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35] shadow-md shadow-orange-500/20"
                    : "bg-gradient-to-tr from-gray-200 via-gray-300 to-gray-200"
                }`}
              >
                <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-[#fff0e7] flex items-center justify-center">
                  {typeof displayAvatar === "string" ? (
                    <img
                      src={displayAvatar}
                      alt="Your Story"
                      className={`w-full h-full object-cover ${hasMyActiveStory ? "" : "opacity-85"}`}
                    />
                  ) : (
                    <Image
                      src={displayAvatar}
                      alt="Your Story"
                      fill
                      sizes="55px"
                      className={`object-cover ${hasMyActiveStory ? "" : "opacity-85"}`}
                    />
                  )}
                </div>
              </div>

              {/* Plus badge on bottom right */}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddStoryOpen(true);
                }}
                className="absolute bottom-[2px] right-[2px] w-[18px] h-[18px] bg-[#FF3B30] text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
                title="Add New Story"
              >
                <Plus size={10} strokeWidth={3} />
              </span>

              {hasMyActiveStory && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] font-extrabold px-1 rounded-full border border-white flex items-center gap-0.5">
                  <Sparkles size={7} />
                  Live
                </span>
              )}
            </div>

            <span className="text-[10px] font-bold text-gray-800 flex items-center gap-0.5">
              {hasMyActiveStory ? "Your Story" : "Add Story"}
            </span>
          </div>

          {/* Other creators' stories */}
          {feedUsers.map((user) => {
            const userIndexInAll = allStoryUsers.findIndex((u) => u.id === user.id);
            return (
              <div
                key={user.id}
                onClick={() => openPreview(userIndexInAll >= 0 ? userIndexInAll : 0)}
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
              >
                <div className="relative shrink-0 hover:scale-105 transition-all duration-200">
                  <div className="w-[55px] h-[65px] p-[2.5px] rounded-[28px] bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]">
                    <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-gray-50">
                      {typeof user.avatar === "string" ? (
                        <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                      ) : (
                        <Image src={user.avatar} alt={user.userName} fill sizes="55px" className="object-cover" />
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-gray-600 truncate max-w-[55px]">
                  {user.userName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Story Modal */}
      {isAddStoryOpen && (
        <Addstories
          isOpen={isAddStoryOpen}
          onClose={() => {
            setIsAddStoryOpen(false);
            fetchStories();
          }}
          onStoryAdded={() => {
            fetchStories();
          }}
        />
      )}

      {/* Preview Story Modal */}
      {isPreviewOpen && allStoryUsers.length > 0 && (
        <PreviewStories
          stories={allStoryUsers}
          initialUserIndex={selectedUserIndex}
          onClose={() => {
            setIsPreviewOpen(false);
            fetchStories();
          }}
          onStoryDeleted={() => {
            fetchStories();
          }}
        />
      )}
    </>
  );
}