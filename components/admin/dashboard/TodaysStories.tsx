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
import PreviewStories from "./Previewstories";
import { useAuthuser } from "@/hooks/useAuthuser";
import { storyService } from "@/services/Stories.service";
import type { StoryUser, BackendStoryGroup } from "@/types/Stories";

const defaultAvatar = avatar1;

interface StoryAvatarProps {
  avatar: StaticImageData | string;
  hasActiveStory: boolean;
  isMyStory?: boolean;
  showPlus?: boolean;
  showLiveBadge?: boolean;
  sizeClass?: string;
  onClick: () => void;
  onPlusClick?: (e: React.MouseEvent) => void;
}

function StoryAvatar({
  avatar,
  hasActiveStory,
  isMyStory,
  showPlus,
  showLiveBadge,
  sizeClass = "w-[55px] h-[65px]",
  onClick,
  onPlusClick,
}: StoryAvatarProps) {
  return (
    <div
      onClick={onClick}
      className="relative shrink-0 group cursor-pointer hover:scale-105 transition-all duration-200"
    >
      <div
        className={`${sizeClass} p-[2.5px] rounded-[28px] ${
          hasActiveStory
            ? "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35] shadow-md shadow-orange-500/20"
            : isMyStory
            ? "bg-gradient-to-tr from-gray-200 via-gray-300 to-gray-200"
            : "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]"
        }`}
      >
        <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-[#fff0e7] flex items-center justify-center">
          {typeof avatar === "string" ? (
            <img
              src={avatar}
              alt="Story Profile"
              className={`w-full h-full object-cover ${!hasActiveStory && isMyStory ? "opacity-85" : ""}`}
            />
          ) : (
            <Image
              src={avatar}
              alt="Story Profile"
              fill
              sizes="55px"
              className={`object-cover ${!hasActiveStory && isMyStory ? "opacity-85" : ""}`}
            />
          )}
        </div>
      </div>

      {showPlus && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onPlusClick?.(e);
          }}
          className="absolute bottom-[2px] right-[2px] w-[18px] h-[18px] bg-[#FF3B30] text-white rounded-full border-2 border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform cursor-pointer"
          title="Add New Story"
        >
          <Plus size={10} strokeWidth={3} />
        </span>
      )}
    </div>
  );
}

export default function TodayStories() {
  // ==========================================
  // 🟢 1. VIEW VIEWPORT & VISIBILITY CONTROLS
  // ==========================================
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
        avatar: group.avatar || defaultAvatar,
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

      // 3. MY STORY SEPARATION
      const rawMyStory = data.find((group) => group.is_my_story === true);
      const myStoryParsed = rawMyStory ? normalizeGroupToUser(rawMyStory) : null;
      setMyStoryUser(myStoryParsed);

      // 4. OTHER STORIES SEPARATION
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
      console.error("Story control layer fetch query error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // ==========================================
  // 🎯 4. ACTION INTERACTORS LOGIC METHODS
  // ==========================================
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

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || e.currentTarget.scrollTop !== 0) return;
    if (e.targetTouches[0].clientY - touchStart > 50) {
      setIsExpanded(false);
      setTouchStart(null);
    }
  };
  const handleTouchEnd = () => setTouchStart(null);

  const displayAvatar = myStoryUser?.avatar || currentUser?.avatar_url || defaultAvatar;
  const feedUsers = allStoryUsers.filter((u) => !u.is_my_story);

  return (
    <>
      {/* ── Mobile Vertical / Drawer View ── */}
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
                sizeClass="w-[55px] h-[65px]"
                onClick={handleMyStoryClick}
                onPlusClick={() => setIsAddStoryOpen(true)}
              />

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