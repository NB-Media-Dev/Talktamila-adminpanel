"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import { StoryViewer } from "./StoryViewer";

export interface StorySlide {
  id: number;
  story_id?: number;
  imageUrl: StaticImageData | string;
  media_type?: string;
  caption?: string;
  duration?: number; // ms, default 5000
  liked?: boolean;
  likes_count?: number;
  views_count?: number;
  created_at?: string;
  musicTrack?: string;
  music_url?: string;
  music_start_time?: number;
  music_title?: string;
  music_artist?: string;
}

export function formatTimeAgo(timestamp?: string | null, fallback?: string): string {
  if (!timestamp) return fallback || "Just now";

  const raw = timestamp.trim();
  if (
    raw.includes("ago") ||
    raw.includes("Just") ||
    raw.includes("now") ||
    /^\d+[smhdwy]$/i.test(raw)
  ) {
    return raw;
  }

  try {
    const date = new Date(raw);
    if (isNaN(date.getTime())) return fallback || raw;

    const now = new Date();
    const diffSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

    if (diffSeconds < 60) {
      return diffSeconds <= 5 ? "Just now" : `${diffSeconds}s ago`;
    }
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `${diffDays}d ago`;
    }
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}w ago`;
  } catch {
    return fallback || "Just now";
  }
}

export interface StoryUser {
  id: number;
  userName: string;
  avatar: StaticImageData | string;
  verified?: boolean;
  timeAgo?: string;
  slides: StorySlide[];
  musicTrack?: string;
  is_my_story?: boolean;
}

interface PreviewStoriesProps {
  /** All story-users to display */
  stories: StoryUser[];
  /** Index of the user whose story opens first */
  initialUserIndex?: number;
  onClose: () => void;
  onStoryDeleted?: (storyId: number) => void;
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function PreviewStories({
  stories,
  initialUserIndex = 0,
  onClose,
  onStoryDeleted,
}: PreviewStoriesProps) {
  const [userIndex, setUserIndex] = useState(initialUserIndex);

  useEffect(() => {
    setUserIndex(initialUserIndex);
  }, [initialUserIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const goNext = useCallback(() => {
    if (userIndex < stories.length - 1) setUserIndex((i) => i + 1);
    else onClose();
  }, [userIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (userIndex > 0) setUserIndex((i) => i - 1);
  }, [userIndex]);

  if (!stories.length) return null;

  const currentUser = stories[userIndex] || stories[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40 overflow-x-auto max-w-[90vw] no-scrollbar px-2">
        {stories.map((u, idx) => (
          <button
            key={u.id}
            onClick={() => setUserIndex(idx)}
            className={`flex flex-col items-center gap-0.5 shrink-0 transition-all cursor-pointer ${idx === userIndex ? "scale-110" : "opacity-60 hover:opacity-90"
              }`}
            aria-label={`View ${u.userName}'s story`}
          >
            <div
              className={`p-[2px] rounded-full ${idx === userIndex ? "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]" : "bg-white/30"
                }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden relative bg-gray-100">
                {typeof u.avatar === "string" ? (
                  <img src={u.avatar} alt={u.userName} className="w-full h-full object-cover" />
                ) : (
                  <Image src={u.avatar} alt={u.userName} fill sizes="32px" className="object-cover" />
                )}
              </div>
            </div>
            <span className="text-[8px] text-white/80 font-medium max-w-[36px] truncate">
              {u.is_my_story ? "You" : u.userName}
            </span>
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-sm sm:max-w-md mt-12">
        <StoryViewer
          key={userIndex}
          user={currentUser}
          onNext={goNext}
          onPrev={goPrev}
          onClose={onClose}
          onStoryDeleted={onStoryDeleted}
          hasPrev={userIndex > 0}
          hasNext={userIndex < stories.length - 1}
        />
      </div>
    </div>
  );
}

// AI Prompt: "Check my images in this file. Add the priority prop to images above the fold (visible instantly), and ensure loading="lazy" is handled properly for images below the fold."