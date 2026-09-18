"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Send,
  Volume2,
  VolumeX,
  CheckCircle2,
  Music,
  Pause,
  Play,
  Eye,
  Trash2,
} from "lucide-react";
import { getAuthToken } from "@/lib/cookies";
import { getBackendUrl } from "@/services/api-client";

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
  musicTrack?: string;
  music_url?: string;
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

// ─── Progress Bar ────────────────────────────────────────────────────────────

interface ProgressBarProps {
  total: number;
  current: number;
  /** 0-100 progress of the active bar */
  progress: number;
  onSeek: (index: number) => void;
}

function ProgressBars({ total, current, progress, onSeek }: ProgressBarProps) {
  return (
    <div className="flex gap-1 w-full items-center px-3 pt-2.5">
      {Array.from({ length: total }).map((_, i) => {
        const isPast = i < current;
        const isActive = i === current;
        return (
          <div
            key={i}
            onClick={() => onSeek(i)}
            className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden cursor-pointer"
            title={`Slide ${i + 1}`}
          >
            <div
              className="h-full rounded-full bg-white transition-none"
              style={{
                width: isPast ? "100%" : isActive ? `${progress}%` : "0%",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Single User Story Viewer ────────────────────────────────────────────────

interface StoryViewerProps {
  user: StoryUser;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onStoryDeleted?: (storyId: number) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

interface ActivityViewer {
  user_id: number;
  username: string;
  full_name?: string;
  avatar_url?: string;
  viewed_at?: string;
}

interface ActivityLiker {
  user_id: number;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

interface ActivityData {
  story_id: number;
  total_views: number;
  total_likes: number;
  viewers: ActivityViewer[];
  likers: ActivityLiker[];
}

function StoryViewer({
  user,
  onNext,
  onPrev,
  onClose,
  onStoryDeleted,
  hasPrev,
  hasNext,
}: StoryViewerProps) {
  const [slides, setSlides] = useState<StorySlide[]>(user.slides);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [activityTab, setActivityTab] = useState<"viewers" | "likers">("viewers");
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(false);

  const BASE_URL = getBackendUrl();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TICK = 50; // ms per tick

  const [customDuration, setCustomDuration] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setSlides(user.slides);
    setSlideIndex(0);
    setCustomDuration(null);
  }, [user]);

  const currentSlide = slides[slideIndex] || slides[0];
  const slideDuration = customDuration ?? (currentSlide?.duration ?? 5000);
  const totalSlides = slides.length;

  useEffect(() => {
    if (!user.is_my_story && currentSlide) {
      const storyId = currentSlide.story_id || currentSlide.id;
      const token = getAuthToken();
      if (storyId && token) {
        fetch(`${BASE_URL}/api/v1/stories/${storyId}/view`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {});
      }
    }
    setLiked(Boolean(currentSlide?.liked));
  }, [currentSlide, user.is_my_story, BASE_URL]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (isPaused || showActivity) return;
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK / slideDuration) * 100;
        if (next >= 100) {
          clearTimer();
          return 100;
        }
        return next;
      });
    }, TICK);
  }, [clearTimer, isPaused, showActivity, slideDuration]);

  useEffect(() => {
    if (progress >= 100) {
      if (slideIndex < totalSlides - 1) {
        setSlideIndex((i) => i + 1);
        setProgress(0);
      } else {
        onNext();
      }
    }
  }, [progress, slideIndex, totalSlides, onNext]);

  useEffect(() => {
    setProgress(0);
    startTimer();
    return clearTimer;
  }, [slideIndex, user.id, startTimer, clearTimer]);

  useEffect(() => {
    if (isPaused || showActivity) {
      clearTimer();
    } else {
      startTimer();
    }
  }, [isPaused, showActivity, clearTimer, startTimer]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPaused || showActivity) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused, showActivity]);

  const goToSlide = (i: number) => {
    setSlideIndex(i);
    setCustomDuration(null);
    setProgress(0);
  };

  const handlePrevSlide = () => {
    if (slideIndex > 0) {
      goToSlide(slideIndex - 1);
    } else if (hasPrev) {
      onPrev();
    }
  };

  const handleNextSlide = () => {
    if (slideIndex < totalSlides - 1) {
      goToSlide(slideIndex + 1);
    } else if (hasNext) {
      onNext();
    } else {
      onClose();
    }
  };

  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlePointerDown = () => {
    holdTimer.current = setTimeout(() => setIsPaused(true), 150);
  };
  const handlePointerUp = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setIsPaused(false);
  };

  const handleToggleLike = async () => {
    if (!currentSlide) return;
    const storyId = currentSlide.story_id || currentSlide.id;
    const token = getAuthToken();
    if (!storyId || !token) return;

    const newLiked = !liked;
    setLiked(newLiked);

    try {
      await fetch(`${BASE_URL}/api/v1/stories/${storyId}/like`, {
        method: newLiked ? "POST" : "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.error("Like action failed:", e);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !currentSlide) return;
    const storyId = currentSlide.story_id || currentSlide.id;
    const token = getAuthToken();
    if (!storyId || !token) return;

    const textToSend = replyText;
    setReplyText("");

    try {
      await fetch(`${BASE_URL}/api/v1/stories/${storyId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: textToSend }),
      });
    } catch (e) {
      console.error("Reply failed:", e);
    }
  };

  const handleOpenActivity = async () => {
    if (!currentSlide) return;
    setShowActivity(true);
    setLoadingActivity(true);
    const storyId = currentSlide.story_id || currentSlide.id;
    const token = getAuthToken();

    try {
      const res = await fetch(`${BASE_URL}/api/v1/stories/${storyId}/activity`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setActivityData(data);
      }
    } catch (e) {
      console.error("Failed to load story activity:", e);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleDeleteSlide = async () => {
    if (!currentSlide || isDeleting) return;
    if (!confirm("Are you sure you want to delete this story slide?")) return;

    const storyId = currentSlide.story_id || currentSlide.id;
    const token = getAuthToken();
    setIsDeleting(true);

    try {
      await fetch(`${BASE_URL}/api/v1/stories/${storyId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (onStoryDeleted) onStoryDeleted(storyId);

      const remaining = slides.filter((_, idx) => idx !== slideIndex);
      if (remaining.length === 0) {
        onClose();
      } else {
        setSlides(remaining);
        setSlideIndex(Math.max(0, slideIndex - 1));
      }
    } catch (e) {
      console.error("Failed to delete story:", e);
      alert("Failed to delete story. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentSlide) return null;

  const isVideo =
    currentSlide.media_type === "video" ||
    (typeof currentSlide.imageUrl === "string" &&
      (currentSlide.imageUrl.startsWith("data:video") ||
        currentSlide.imageUrl.endsWith(".mp4") ||
        currentSlide.imageUrl.endsWith(".webm") ||
        currentSlide.imageUrl.endsWith(".mov") ||
        currentSlide.imageUrl.endsWith(".m4v") ||
        currentSlide.imageUrl.endsWith(".avi")));

  const isTextStory =
    currentSlide.imageUrl === "text-story" ||
    currentSlide.imageUrl === "default-text-story" ||
    (!currentSlide.imageUrl && currentSlide.caption);

  return (
    <div className="relative w-full sm:h-full flex items-center justify-center select-none">
      <div
        className="relative w-[330px] sm:w-[320px] aspect-[9/16] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white/10 bg-black flex flex-col justify-between"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Background Media */}
        {isVideo ? (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              key={typeof currentSlide.imageUrl === "string" ? currentSlide.imageUrl : currentSlide.id}
              src={currentSlide.imageUrl as string}
              autoPlay
              muted={isMuted}
              playsInline
              loop={false}
              onLoadedMetadata={(e) => {
                const dur = e.currentTarget.duration;
                if (dur && !isNaN(dur) && isFinite(dur)) {
                  setCustomDuration(Math.max(3000, Math.min(dur * 1000, 60000)));
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
          </div>
        ) : isTextStory ? (
          <div className="absolute inset-0 bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center p-6 text-center">
            <p className="text-white text-base sm:text-lg font-extrabold leading-snug drop-shadow-md whitespace-pre-wrap break-words">
              {currentSlide.caption || "TalkTamila Story"}
            </p>
          </div>
        ) : typeof currentSlide.imageUrl === "string" ? (
          <div className="absolute inset-0">
            <img
              src={currentSlide.imageUrl}
              alt={`${user.userName} story slide`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0">
            <Image
              src={currentSlide.imageUrl}
              alt={`${user.userName} story slide`}
              fill
              sizes="360px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Background audio track preview */}
        {currentSlide.music_url && !isMuted && !isVideo && (
          <audio
            ref={(audio) => {
              if (audio) {
                if (isPaused) {
                  audio.pause();
                } else {
                  audio.play().catch(() => {});
                }
              }
            }}
            src={currentSlide.music_url}
            autoPlay
            loop
          />
        )}

        {/* Top section */}
        <div className="relative z-10 flex flex-col gap-2">
          {/* Progress bars */}
          <ProgressBars
            total={totalSlides}
            current={slideIndex}
            progress={progress}
            onSeek={goToSlide}
          />

          {/* Header */}
          <div className="flex items-center justify-between px-3 pb-1">
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-8 h-8 p-[2px] rounded-full bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35] shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100 flex items-center justify-center">
                  {user.avatar ? (
                    typeof user.avatar === "string" ? (
                      <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                    ) : (
                      <Image src={user.avatar} alt={user.userName} fill className="object-cover" />
                    )
                  ) : (
                    <span className="text-white text-xs font-bold bg-orange-500 w-full h-full flex items-center justify-center">
                      {user.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                    </span>
                  )}
                </div>
              </div>
              {/* Name + meta */}
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white leading-tight drop-shadow-sm flex items-center gap-1">
                  {user.is_my_story ? "Your Story" : user.userName}
                  {user.verified && (
                    <CheckCircle2 size={10} className="text-blue-400 fill-blue-400" />
                  )}
                </span>
                <span className="text-[9px] text-white/70 font-medium">
                  {totalSlides > 1
                    ? `Slide ${slideIndex + 1} of ${totalSlides}`
                    : user.timeAgo ?? "Just now"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              {user.is_my_story && (
                <button
                  onClick={handleDeleteSlide}
                  disabled={isDeleting}
                  className="w-7 h-7 rounded-full bg-red-600/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-all cursor-pointer shadow-sm"
                  title="Delete this story"
                  aria-label="Delete Story"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
              </button>
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
                aria-label="Close story"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Music badge */}
          {user.musicTrack && !isMuted && (
            <div className="mx-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15 w-fit">
              <Music size={9} className="text-orange-400 animate-bounce" />
              <span className="text-[9px] text-white font-semibold truncate max-w-[140px]">
                {user.musicTrack}
              </span>
            </div>
          )}
        </div>

        {/* Tap zones (left / right navigate) */}
        <div className="absolute inset-0 z-20 flex pointer-events-none">
          <div
            className="w-1/3 h-full cursor-pointer pointer-events-auto"
            onClick={handlePrevSlide}
          />
          <div className="w-1/3 h-full" />
          <div
            className="w-1/3 h-full cursor-pointer pointer-events-auto"
            onClick={handleNextSlide}
          />
        </div>

        {/* Caption overlay */}
        {!isTextStory && currentSlide.caption && (
          <div className="relative z-10 mx-3 mb-1 bg-black/60 backdrop-blur-xs p-2.5 rounded-xl border border-white/15">
            <p className="text-white text-xs font-medium leading-relaxed break-words whitespace-pre-wrap">
              {currentSlide.caption}
            </p>
          </div>
        )}

        {/* Bottom Section */}
        <div className="relative z-10 p-3 pt-0">
          {user.is_my_story ? (
            /* Owner story viewer bottom bar */
            <div className="flex items-center justify-between bg-black/40 backdrop-blur-md border border-white/20 px-3 py-2 rounded-2xl">
              <button
                onClick={handleOpenActivity}
                className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer text-xs font-bold"
              >
                <Eye size={14} className="text-orange-400" />
                <span>{currentSlide.views_count ?? 0} Views</span>
                <span className="text-[10px] text-white/60 font-normal">· Seen by</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                  <Heart size={12} className="fill-rose-500" />
                  {currentSlide.likes_count ?? 0}
                </span>
              </div>
            </div>
          ) : (
            /* Other user's story reply bar */
            <div className="flex items-center gap-2">
              <div className="flex-1 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-3 flex items-center">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendReply();
                  }}
                  placeholder={`Reply to ${user.userName}...`}
                  className="w-full bg-transparent text-white placeholder:text-white/60 text-[10px] outline-none"
                />
              </div>
              <button
                onClick={handleToggleLike}
                className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
                aria-label="Like story"
              >
                <Heart
                  size={14}
                  className={liked ? "fill-rose-500 stroke-rose-500" : "text-white"}
                />
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="w-8 h-8 rounded-full bg-[#FF6B35] text-white backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 disabled:opacity-40"
                aria-label="Send reply"
              >
                <Send size={11} />
              </button>
            </div>
          )}
        </div>

        {/* Activity Sheet / Popover */}
        {showActivity && (
          <div className="absolute inset-x-0 bottom-0 top-16 bg-[#18181b]/95 backdrop-blur-md z-30 rounded-t-[24px] p-4 flex flex-col border-t border-white/20 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActivityTab("viewers")}
                  className={`text-xs font-extrabold pb-1 cursor-pointer transition-colors ${
                    activityTab === "viewers"
                      ? "text-[#FF6B35] border-b-2 border-[#FF6B35]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Viewers ({activityData?.total_views ?? currentSlide.views_count ?? 0})
                </button>
                <button
                  onClick={() => setActivityTab("likers")}
                  className={`text-xs font-extrabold pb-1 cursor-pointer transition-colors ${
                    activityTab === "likers"
                      ? "text-[#FF6B35] border-b-2 border-[#FF6B35]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Likes ({activityData?.total_likes ?? currentSlide.likes_count ?? 0})
                </button>
              </div>
              <button
                onClick={() => setShowActivity(false)}
                className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar py-3 flex flex-col gap-2.5">
              {loadingActivity ? (
                <div className="flex items-center justify-center py-8 text-xs text-gray-400">
                  Loading activity...
                </div>
              ) : activityTab === "viewers" ? (
                activityData?.viewers && activityData.viewers.length > 0 ? (
                  activityData.viewers.map((viewer) => (
                    <div key={viewer.user_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 font-bold flex items-center justify-center text-[10px] overflow-hidden">
                          {viewer.avatar_url ? (
                            <img src={viewer.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            viewer.username.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white">{viewer.username}</span>
                          {viewer.full_name && (
                            <span className="text-[9px] text-gray-400">{viewer.full_name}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[9px] text-gray-400">{viewer.viewed_at || "Seen"}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-gray-400">
                    No viewers yet for this slide.
                  </div>
                )
              ) : activityData?.likers && activityData.likers.length > 0 ? (
                activityData.likers.map((liker) => (
                  <div key={liker.user_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center text-[10px] overflow-hidden">
                        {liker.avatar_url ? (
                          <img src={liker.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          liker.username.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <span className="text-xs font-bold text-white">{liker.username}</span>
                    </div>
                    <Heart size={13} className="text-rose-500 fill-rose-500" />
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-gray-400">
                  No likes yet for this slide.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── External prev / next user arrows ── */}
      {hasPrev && (
        <button
          onClick={onPrev}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center shadow-lg hover:bg-black/70 transition-all cursor-pointer z-30"
          aria-label="Previous user story"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {hasNext && (
        <button
          onClick={onNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center shadow-lg hover:bg-black/70 transition-all cursor-pointer z-30"
          aria-label="Next user story"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
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
    if (userIndex < stories.length - 1) {
      setUserIndex((i) => i + 1);
    } else {
      onClose();
    }
  }, [userIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (userIndex > 0) {
      setUserIndex((i) => i - 1);
    }
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
      {/* User avatar strip at the top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40 overflow-x-auto max-w-[90vw] no-scrollbar px-2">
        {stories.map((user, idx) => (
          <button
            key={user.id}
            onClick={() => setUserIndex(idx)}
            className={`flex flex-col items-center gap-0.5 shrink-0 transition-all cursor-pointer ${
              idx === userIndex ? "scale-110" : "opacity-60 hover:opacity-90"
            }`}
            aria-label={`View ${user.userName}'s story`}
          >
            <div
              className={`p-[2px] rounded-full ${
                idx === userIndex
                  ? "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]"
                  : "bg-white/30"
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden relative bg-gray-100 flex items-center justify-center">
                {user.avatar ? (
                  typeof user.avatar === "string" ? (
                    <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={user.avatar} alt={user.userName} fill className="object-cover" />
                  )
                ) : (
                  <span className="text-white text-xs font-bold bg-orange-500 w-full h-full flex items-center justify-center">
                    {user.userName ? user.userName.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[8px] text-white/80 font-medium max-w-[36px] truncate">
              {user.is_my_story ? "You" : user.userName}
            </span>
          </button>
        ))}
      </div>

      {/* Viewer */}
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
