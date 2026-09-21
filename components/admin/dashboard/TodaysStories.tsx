"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image, { type StaticImageData } from "next/image";
import { Zap, ChevronDown, ChevronUp, Plus } from "lucide-react";
import avatar1 from "@/public/Images/profile1.jpg";
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
  hasUnseen?: boolean;
  onClick: () => void;
  onPlusClick?: (e: React.MouseEvent) => void;
}

function StoryAvatar({
  avatar,
  hasActiveStory,
  isMyStory,
  showPlus,
  hasUnseen = true,
  sizeClass = "w-[55px] h-[65px]",
  onClick,
  onPlusClick,
}: StoryAvatarProps) {
  // Determine ring border gradient or grey based on viewed status
  const getRingColor = () => {
    if (isMyStory) {
      return hasActiveStory
        ? "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]"
        : "bg-gradient-to-tr from-gray-200 via-gray-300 to-gray-200";
    }
    // If active story has no unseen slides (fully viewed), make it grey
    if (hasActiveStory && !hasUnseen) {
      return "bg-gradient-to-tr from-gray-300 via-gray-400 to-gray-300";
    }
    // Default active unseen story ring (red/orange)
    return hasActiveStory
      ? "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]"
      : "bg-gradient-to-tr from-gray-200 via-gray-300 to-gray-200";
  };

  return (
    <div
      onClick={onClick}
      className="relative shrink-0 group cursor-pointer transition-all duration-200"
    >
      <div className={`${sizeClass} p-[2.5px] rounded-[28px] ${getRingColor()}`}>
        <div className="w-full h-full rounded-[26px] border-2 border-white overflow-hidden relative bg-[#fff0e7] flex items-center justify-center">
          {typeof avatar === "string" ? (
            <img src={avatar} alt="Story Profile" className="w-full h-full object-cover" />
          ) : (
            <Image src={avatar} alt="Story Profile" fill sizes="55px" className="object-cover" />
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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [, setLoading] = useState(true);

  const { user: authUser } = useAuthuser();
  const [allStoryUsers, setAllStoryUsers] = useState<StoryUser[]>([]);
  const [myStoryUser, setMyStoryUser] = useState<StoryUser | null>(null);

  const currentUser = (authUser as { user?: unknown })?.user || authUser || null;

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
        isViewed: group.all_viewed ?? false,
        hasUnseen: group.has_unseen_stories ?? true,
        slides: (group.slides || []).map((s, idx) => {
          const correspondingStory = (group.stories || [])[idx];
          return {
            id: Number(s.id),
            story_id: Number(s.story_id || s.id),
            imageUrl: s.imageUrl || s.media_url || correspondingStory?.media_url || "",
            media_type: s.media_type || correspondingStory?.media_type || "image",
            caption: s.caption || correspondingStory?.caption,
            duration: s.duration || 5000,
            liked: s.liked || correspondingStory?.liked_by_me || false,
            likes_count: s.likes_count || correspondingStory?.likes_count || 0,
            views_count: s.views_count || correspondingStory?.views_count || 0,
            created_at: s.created_at || correspondingStory?.created_at,
            musicTrack: s.musicTrack || (correspondingStory?.music_title ? `${correspondingStory.music_title}${correspondingStory.music_artist ? ` – ${correspondingStory.music_artist}` : ''} 🎵` : undefined),
            music_url: s.music_url || correspondingStory?.music_url,
            music_start_time: s.music_start_time ?? correspondingStory?.music_start_time ?? 0,
            music_title: s.music_title || correspondingStory?.music_title,
            music_artist: s.music_artist || correspondingStory?.music_artist,
          };
        }),
      });
      // 3. MY STORY SEPARATION
      const rawMyStory = data.find((group) => group.is_my_story === true);
      const myStoryParsed = rawMyStory ? normalizeGroupToUser(rawMyStory) : null;
      setMyStoryUser(myStoryParsed);

      const otherStoriesParsed = data
        .filter((group) => group.is_my_story !== true)
        .map(normalizeGroupToUser);

      if (myStoryParsed) {
        setAllStoryUsers([myStoryParsed, ...otherStoriesParsed]);
      } else {
        setAllStoryUsers(otherStoriesParsed);
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

  const feedUsers = useMemo(() => {
    const filtered = allStoryUsers.filter((u) => !u.is_my_story);
    
    return [...filtered].sort((a, b) => {
      const aViewed = a.isViewed || !a.hasUnseen;
      const bViewed = b.isViewed || !b.hasUnseen;

      if (!aViewed && bViewed) return -1;
      if (aViewed && !bViewed) return 1;
      return 0;
    });
  }, [allStoryUsers]);

  const hasMyActiveStory = Boolean(myStoryUser?.slides?.length);

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

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null || e.currentTarget.scrollTop !== 0) return;
    if (e.targetTouches[0].clientY - touchStart > 50) {
      setIsExpanded(false);
      setTouchStart(null);
    }
  };
  const handleTouchEnd = () => setTouchStart(null);

  const displayAvatar =
    typeof myStoryUser?.avatar === "string" || myStoryUser?.avatar
      ? myStoryUser.avatar
      : (currentUser as { avatar_url?: StaticImageData | string })?.avatar_url || defaultAvatar;

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

              {feedUsers.map((user) => {
                const userIndexInAll = allStoryUsers.findIndex((u) => u.id === user.id);
                return (
                  <StoryAvatar
                    key={user.id}
                    avatar={user.avatar}
                    hasActiveStory={Boolean(user.slides && user.slides.length > 0)}
                    hasUnseen={user.hasUnseen}
                    sizeClass="w-[55px] h-[65px]"
                    onClick={() => openPreview(userIndexInAll >= 0 ? userIndexInAll : 0)}
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
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              Today&apos;s Stories
            </h2>
          </div>
          <button className="text-sm text-[#FF6B35] hover:underline bg-transparent border-none cursor-pointer">
            View all
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
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
              >
                <StoryAvatar
                  avatar={user.avatar}
                  hasActiveStory={Boolean(user.slides && user.slides.length > 0)}
                  hasUnseen={user.hasUnseen}
                  sizeClass="w-[55px] h-[65px]"
                  onClick={() => openPreview(userIndexInAll >= 0 ? userIndexInAll : 0)}
                />
                <span className="text-[10px] font-medium text-gray-600 truncate max-w-[55px]">
                  {user.userName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
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