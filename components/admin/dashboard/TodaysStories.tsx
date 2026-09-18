"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { Zap, ChevronDown, ChevronUp, Plus, Sparkles } from "lucide-react";
import defaultAvatar from "@/public/Images/profile1.jpg";
import avatar1 from "@/public/Images/avatar1.png";
import avatar2 from "@/public/Images/avatar2.png";
import avatar3 from "@/public/Images/avatar3.png";
import avatar4 from "@/public/Images/avatar4.png";
import beach from "@/public/Images/beach.jpg";
import food from "@/public/Images/food.jpg";
import waterfall from "@/public/Images/waterfall.jpg";
import rain from "@/public/Images/rain.jpg";
import Addstories from "./Addstories";
import PreviewStories, { type StoryUser } from "./Previewstories";
import { useAuthuser } from "@/hooks/useAuthuser";
import { storyService } from "@/services/Stories.service";
import type { BackendStoryGroup } from "@/types/Stories";

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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { user: authUser } = useAuthuser();
  const [allStoryUsers, setAllStoryUsers] = useState<StoryUser[]>([]);
  const [myStoryUser, setMyStoryUser] = useState<StoryUser | null>(null);

  const currentUser = (authUser as any)?.user || authUser || null;

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await storyService.getStoriesFeed();
      if (!Array.isArray(data)) return;

      const normalizeGroupToUser = (group: BackendStoryGroup): StoryUser => ({
        id: Number(group.id),
        userName: group.userName,
        avatar: group.avatar || avatar1,
        verified: group.verified || false,
        timeAgo: group.timeAgo || "Just now",
        musicTrack: group.musicTrack,
        is_my_story: Boolean(group.is_my_story),
        slides: (group.slides || []).map((s) => ({
          id: Number(s.id),
          story_id: Number(s.story_id || s.id),
          imageUrl: s.imageUrl || s.media_url || "",
          media_type: s.media_type || "image",
          caption: s.caption,
          duration: s.duration || 5000,
          liked: s.liked || false,
          likes_count: s.likes_count || 0,
          views_count: s.views_count || 0,
          musicTrack: s.musicTrack || group.musicTrack,
        })),
      });

      const rawMyStory = data.find((group) => group.is_my_story === true);
      const myStoryParsed = rawMyStory ? normalizeGroupToUser(rawMyStory) : null;
      setMyStoryUser(myStoryParsed);

      const otherStoriesParsed = data
        .filter((group) => group.is_my_story !== true)
        .map(normalizeGroupToUser);

      const displayFeed = otherStoriesParsed;
      if (myStoryParsed) {
        setAllStoryUsers([myStoryParsed, ...displayFeed]);
      } else {
        setAllStoryUsers(displayFeed);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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
      const myIdx = allStoryUsers.findIndex((u) => u.is_my_story);
      openPreview(myIdx >= 0 ? myIdx : 0);
    } else {
      setIsAddStoryOpen(true);
    }
  };

  // Mobile gesture touch handler configurations
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || e.currentTarget.scrollTop !== 0) return;
    if (e.targetTouches[0].clientY - touchStart > 50) {
      setIsExpanded(false);
      setTouchStart(null);
    }
  };
  const handleTouchEnd = () => setTouchStart(null);

  const displayAvatar = myStoryUser?.avatar || currentUser?.avatar_url || avatar1;
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
            <StoryAvatar
              avatar={displayAvatar}
              hasActiveStory={hasMyActiveStory}
              isMyStory
              showPlus
              sizeClass="w-[55px] h-[75px]"
              onClick={handleMyStoryClick}
              onPlusClick={() => setIsAddStoryOpen(true)}
            />
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
              <StoryAvatar
                avatar={displayAvatar}
                hasActiveStory={hasMyActiveStory}
                isMyStory
                showPlus
                onClick={handleMyStoryClick}
                onPlusClick={() => setIsAddStoryOpen(true)}
              />
              {feedUsers.map((user) => {
                const userIndex = allStoryUsers.findIndex((u) => u.id === user.id);
                return (
                  <StoryAvatar
                    key={user.id}
                    avatar={user.avatar}
                    hasActiveStory={true}
                    onClick={() => openPreview(userIndex >= 0 ? userIndex : 0)}
                  />
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
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Today&apos;s Stories</h2>
          </div>
          <button className="text-xs text-[#FF6B35] hover:text-[#D9652B] font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full">
            <span>View All</span>
          </button>
        </div>

        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1 mb-3 w-full max-w-full">
          {/* Your Story */}
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <StoryAvatar
              avatar={displayAvatar}
              hasActiveStory={hasMyActiveStory}
              isMyStory
              showPlus
              showLiveBadge
              onClick={handleMyStoryClick}
              onPlusClick={() => setIsAddStoryOpen(true)}
            />
            <span className="text-[10px] font-bold text-gray-800">
              {hasMyActiveStory ? "Your Story" : "Add Story"}
            </span>
          </div>

          {/* Other Creators */}
          {feedUsers.map((user) => {
            const userIndex = allStoryUsers.findIndex((u) => u.id === user.id);
            return (
              <div key={user.id} className="flex flex-col items-center gap-1.5 shrink-0">
                <StoryAvatar
                  avatar={user.avatar}
                  hasActiveStory={true}
                  onClick={() => openPreview(userIndex >= 0 ? userIndex : 0)}
                />
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
          onStoryAdded={() => fetchStories()}
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
          onStoryDeleted={() => fetchStories()}
        />
      )}
    </>
  );
}

interface StoryAvatarProps {
  avatar: string | StaticImageData;
  hasActiveStory?: boolean;
  isMyStory?: boolean;
  showPlus?: boolean;
  showLiveBadge?: boolean;
  sizeClass?: string;
  onClick?: () => void;
  onPlusClick?: () => void;
}

function StoryAvatar({
  avatar,
  hasActiveStory = false,
  isMyStory = false,
  showPlus = false,
  showLiveBadge = false,
  sizeClass = "w-14 h-14",
  onClick,
  onPlusClick,
}: StoryAvatarProps) {
  const avatarSrc = avatar || defaultAvatar;

  return (
    <div className="relative cursor-pointer select-none group" onClick={onClick}>
      <div
        className={`relative rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 flex items-center justify-center ${
          hasActiveStory
            ? "bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500"
            : "bg-gray-200"
        } ${sizeClass}`}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden bg-white border-2 border-white">
          <Image
            src={avatarSrc}
            alt="Story Avatar"
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      </div>

      {showPlus && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onPlusClick) onPlusClick();
            else if (onClick) onClick();
          }}
          className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-[#FF6B35] hover:bg-orange-600 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform active:scale-90"
        >
          <Plus className="w-3 h-3 stroke-[3]" />
        </button>
      )}
    </div>
  );
}