"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Send,
  CheckCircle2,
  Music,
  Pause,
  Play,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import { storyService } from "@/services/Stories.service";
import { StoryActivityData } from "@/types/Stories";
import { StorySlide, StoryUser, formatTimeAgo } from "./Previewstories";
import { ActivitySheet } from "./StoryActivity";

// ─── Progress Bars ───────────────────────────────────────────────────────────

interface ProgressBarProps {
  total: number;
  current: number;
  /** 0-100 progress of the active bar */
  progress: number;
  onSeek: (index: number) => void;
}

export function ProgressBars({ total, current, progress, onSeek }: ProgressBarProps) {
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

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StoryViewerProps {
  user: StoryUser;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onStoryDeleted?: (storyId: number) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function StoryViewer({
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
  const [isHolding, setIsHolding] = useState(false);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isTypingReply, setIsTypingReply] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyToast, setReplyToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [activityData, setActivityData] = useState<StoryActivityData | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const TICK = 50; // ms per tick

  useEffect(() => {
    setSlides(user.slides);
    setSlideIndex(0);
    setIsTypingReply(false);
    setReplyText("");
  }, [user]);

  const currentSlide = slides[slideIndex] || slides[0];
  const slideDuration = currentSlide?.duration ?? 5000;
  const totalSlides = slides.length;

  // Story is effectively paused if hold-to-pause is active, manual pause is on, typing in reply input, or activity sheet is open
  const isEffectivelyPaused =
    isPaused || isHolding || isTypingReply || Boolean(replyText.trim()) || showActivity;

  const isVideo =
    currentSlide?.media_type === "video" ||
    (typeof currentSlide?.imageUrl === "string" &&
      /\.(mp4|webm|mov|ogg)$/i.test(currentSlide.imageUrl));

  const isTextStory =
    currentSlide?.media_type === "text" ||
    currentSlide?.imageUrl === "text-story" ||
    currentSlide?.imageUrl === "default-text-story" ||
    (!currentSlide?.imageUrl && Boolean(currentSlide?.caption));

  // Dynamic fallback to resolve audio URL if not directly provided
  useEffect(() => {
    if (!currentSlide) {
      setResolvedAudioUrl(null);
      return;
    }

    if (currentSlide.music_url) {
      setResolvedAudioUrl(currentSlide.music_url);
    } else {
      const musicSearchTitle =
        currentSlide.music_title || currentSlide.musicTrack;

      if (musicSearchTitle && musicSearchTitle.trim()) {
        const cleanedQuery = musicSearchTitle
          .replace("🎵", "")
          .replace("–", "-")
          .trim();

        storyService
          .searchMusic(cleanedQuery, 1)
          .then((res) => {
            if (Array.isArray(res) && res.length > 0 && res[0].audio_url) {
              setResolvedAudioUrl(res[0].audio_url);
            } else {
              setResolvedAudioUrl(null);
            }
          })
          .catch(() => setResolvedAudioUrl(null));
      } else {
        setResolvedAudioUrl(null);
      }
    }
  }, [currentSlide]);

  const effectiveAudioUrl = currentSlide?.music_url || resolvedAudioUrl;
  const effectiveStartTime = currentSlide?.music_start_time || 0;

  // Audio Playback Controller
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (effectiveAudioUrl && !isEffectivelyPaused) {
      if (audio.src !== effectiveAudioUrl) {
        audio.src = effectiveAudioUrl;
        audio.currentTime = effectiveStartTime;
      }
      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Audio playback note:", err);
        });
      }
    } else {
      audio.pause();
    }
  }, [effectiveAudioUrl, effectiveStartTime, isEffectivelyPaused, slideIndex]);

  // Video Playback Controller
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isEffectivelyPaused) {
      video.pause();
    } else {
      video.play().catch(() => { });
    }
  }, [isEffectivelyPaused, slideIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!user.is_my_story && currentSlide) {
      const storyId = currentSlide.story_id || currentSlide.id;
      if (storyId) {
        storyService.recordView(storyId).catch(() => { });
      }
    }
    setLiked(Boolean(currentSlide?.liked));
  }, [currentSlide, user.is_my_story]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (isEffectivelyPaused) return;
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
  }, [clearTimer, isEffectivelyPaused, slideDuration]);

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
    if (isEffectivelyPaused) {
      clearTimer();
    } else {
      startTimer();
    }
  }, [isEffectivelyPaused, clearTimer, startTimer]);

  const goToSlide = (i: number) => {
    setSlideIndex(i);
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
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    holdTimer.current = setTimeout(() => setIsHolding(true), 150);
  };
  const handlePointerUp = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    setIsHolding(false);
  };

  // Like & Unlike Toggle
  const handleToggleLike = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentSlide || isLiking) return;
    const storyId = currentSlide.story_id || currentSlide.id;
    if (!storyId) return;

    const newLiked = !liked;
    setLiked(newLiked);

    // Optimistic UI update
    setSlides((prev) =>
      prev.map((s, idx) => {
        if (idx === slideIndex || (s.story_id || s.id) === storyId) {
          const currentCount = s.likes_count ?? 0;
          return {
            ...s,
            liked: newLiked,
            likes_count: newLiked ? currentCount + 1 : Math.max(0, currentCount - 1),
          };
        }
        return s;
      })
    );

    setIsLiking(true);
    try {
      if (newLiked) {
        await storyService.likeStory(storyId);
      } else {
        await storyService.unlikeStory(storyId);
      }
    } catch (err) {
      console.error("Like/Unlike action failed:", err);
      // Revert if error
      setLiked(!newLiked);
      setSlides((prev) =>
        prev.map((s, idx) => {
          if (idx === slideIndex || (s.story_id || s.id) === storyId) {
            const currentCount = s.likes_count ?? 0;
            return {
              ...s,
              liked: !newLiked,
              likes_count: !newLiked ? currentCount + 1 : Math.max(0, currentCount - 1),
            };
          }
          return s;
        })
      );
    } finally {
      setIsLiking(false);
    }
  };

  // Send Reply and Resume Story
  const handleSendReply = async () => {
    if (!replyText.trim() || !currentSlide || isSendingReply) return;
    const storyId = currentSlide.story_id || currentSlide.id;
    if (!storyId) return;

    const textToSend = replyText.trim();
    setReplyText("");
    setIsTypingReply(false);
    setIsSendingReply(true);

    try {
      await storyService.replyStory(storyId, textToSend);
      setReplyToast(true);
      setTimeout(() => setReplyToast(false), 2200);
    } catch (e) {
      console.error("Reply failed:", e);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleOpenActivity = async () => {
    if (!currentSlide) return;
    setShowActivity(true);
    setLoadingActivity(true);
    const storyId = currentSlide.story_id || currentSlide.id;

    try {
      const data = await storyService.getActivity(storyId);
      setActivityData(data);
    } catch (e) {
      console.error("Failed to load story activity:", e);
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleDeleteSlide = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentSlide || isDeleting) return;

    setIsPaused(true);

    if (!confirm("Are you sure you want to delete this story?")) {
      setIsPaused(false);
      return;
    }

    const storyId = Number(currentSlide.story_id || currentSlide.id);
    if (!storyId) {
      alert("Invalid story ID.");
      setIsPaused(false);
      return;
    }

    setIsDeleting(true);

    try {
      await storyService.deleteStory(storyId);
      if (onStoryDeleted) onStoryDeleted(storyId);

      const remaining = slides.filter((_, idx) => idx !== slideIndex);
      if (remaining.length === 0) {
        onClose();
      } else {
        setSlides(remaining);
        setSlideIndex(Math.max(0, slideIndex - 1));
        setProgress(0);
        setIsPaused(false);
      }
    } catch (e: any) {
      console.error("Failed to delete story:", e);
      alert(e?.message || "Failed to delete story. Please try again.");
      setIsPaused(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentSlide) return null;

  const displayMusicTrack =
    currentSlide.musicTrack ||
    (currentSlide.music_title
      ? `${currentSlide.music_title}${currentSlide.music_artist ? ` – ${currentSlide.music_artist}` : ''} 🎵`
      : undefined);

  return (
    <div className="relative w-full sm:h-full flex items-center justify-center select-none">
      {/* Background Audio Player */}
      <audio
        ref={audioRef}
        preload="auto"
        loop
        playsInline
      />

      <div
        className="relative w-[330px] sm:w-[320px] aspect-[9/16] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white/10 bg-black flex flex-col justify-between"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Reply Toast Message */}
        {replyToast && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-black/85 text-white border border-white/20 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
            <CheckCircle2 size={13} className="text-emerald-400 fill-emerald-400/20" />
            <span>Reply sent successfully!</span>
          </div>
        )}

        {/* Background Media */}
        {isVideo ? (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              src={currentSlide.imageUrl as string}
              autoPlay
              playsInline
              loop
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

        {/* Top section */}
        <div className="relative z-30 flex flex-col gap-2 pointer-events-auto">
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
                <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100">
                  {typeof user.avatar === "string" ? (
                    <img src={user.avatar} alt={user.userName} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={user.avatar} alt={user.userName} fill sizes="32px" className="object-cover" />
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
                  {formatTimeAgo(currentSlide?.created_at, user.timeAgo || "Just now")}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 relative z-30 pointer-events-auto">
              {user.is_my_story && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSlide(e);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  disabled={isDeleting}
                  className="w-7 h-7 rounded-full bg-red-600/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                  title="Delete this story"
                  aria-label="Delete Story"
                >
                  {isDeleting ? (
                    <Loader2 size={12} className="animate-spin text-white" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused((p) => !p);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer shadow-sm"
                aria-label={isPaused ? "Play" : "Pause"}
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer shadow-sm"
                aria-label="Close story"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Music badge */}
          {displayMusicTrack && (
            <div
              className="mx-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15 w-fit select-none"
              title="Playing music"
            >
              <Music
                size={10}
                className={`text-orange-400 ${!isEffectivelyPaused && effectiveAudioUrl ? "animate-bounce" : "opacity-70"
                  }`}
              />
              <span className="text-[9px] text-white font-semibold truncate max-w-[170px]">
                {displayMusicTrack}
              </span>
            </div>
          )}
        </div>

        {/* Tap zones (left / right navigate) - restricted vertically so they don't cover top header or bottom bar */}
        <div className="absolute inset-x-0 top-16 bottom-20 z-20 flex pointer-events-none">
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

        {/* Bottom Section with Bottom-Anchored Caption */}
        <div className="relative z-30 p-3 pt-0 flex flex-col gap-2 mt-auto">
          {/* Caption overlay positioned cleanly at the bottom */}
          {!isTextStory && currentSlide.caption && (
            <div
              className="bg-black/65 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 shadow-lg max-h-24 overflow-y-auto no-scrollbar pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
            >
              <p className="text-white text-xs font-semibold leading-snug break-words whitespace-pre-wrap">
                {currentSlide.caption}
              </p>
            </div>
          )}
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
            <div
              className="flex items-center gap-2 relative z-30"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
            >
              <div className="flex-1 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3.5 flex items-center shadow-md focus-within:border-[#FF6B35] focus-within:bg-black/60 transition-all">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => {
                    setReplyText(e.target.value);
                    setIsTypingReply(true);
                  }}
                  onFocus={() => setIsTypingReply(true)}
                  onBlur={() => {
                    if (!replyText.trim()) {
                      setIsTypingReply(false);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  placeholder={`Reply to ${user.userName}...`}
                  className="w-full bg-transparent text-white placeholder:text-white/70 text-xs outline-none"
                />
              </div>

              {/* Like / Unlike Button */}
              <button
                type="button"
                onClick={handleToggleLike}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-90 shadow-md"
                aria-label={liked ? "Unlike story" : "Like story"}
                title={liked ? "Unlike story" : "Like story"}
              >
                <Heart
                  size={16}
                  className={`transition-all duration-150 ${liked
                      ? "fill-rose-500 stroke-rose-500 text-rose-500 scale-110"
                      : "text-white hover:text-rose-200"
                    }`}
                />
              </button>

              {/* Send Reply Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendReply();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                disabled={!replyText.trim() || isSendingReply}
                className="w-9 h-9 rounded-full bg-[#FF6B35] hover:bg-[#ff5517] text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 disabled:opacity-40 shadow-md"
                aria-label="Send reply"
                title="Send reply"
              >
                <Send size={13} className={isSendingReply ? "animate-pulse" : ""} />
              </button>
            </div>
          )}
        </div>

        {/* Activity Sheet / Popover */}
        {showActivity && (
          <ActivitySheet
            activityData={activityData}
            loading={loadingActivity}
            fallbackViews={currentSlide.views_count ?? 0}
            fallbackLikes={currentSlide.likes_count ?? 0}
            onClose={() => setShowActivity(false)}
          />
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