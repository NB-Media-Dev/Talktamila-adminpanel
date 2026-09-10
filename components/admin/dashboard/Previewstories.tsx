"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image, { type StaticImageData } from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Send,
  MoreHorizontal,
  Volume2,
  VolumeX,
  CheckCircle2,
  Music,
  Pause,
  Play,
} from "lucide-react";



export interface StorySlide {
  id: number;
  imageUrl: StaticImageData | string;
  duration?: number; // ms, default 5000
}

export interface StoryUser {
  id: number;
  userName: string;
  avatar: StaticImageData | string;
  verified?: boolean;
  timeAgo?: string;
  slides: StorySlide[];
  musicTrack?: string;
}

interface PreviewStoriesProps {
  /** All story-users to display */
  stories: StoryUser[];
  /** Index of the user whose story opens first */
  initialUserIndex?: number;
  onClose: () => void;
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
  hasPrev: boolean;
  hasNext: boolean;
}

function StoryViewer({
  user,
  onNext,
  onPrev,
  onClose,
  hasPrev,
  hasNext,
}: StoryViewerProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TICK = 50; // ms per tick

  const currentSlide = user.slides[slideIndex];
  const slideDuration = currentSlide?.duration ?? 5000;
  const totalSlides = user.slides.length;

  // ── Progress timer ──
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (isPaused) return;
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
  }, [clearTimer, isPaused, slideDuration]);

  // Advance when progress hits 100
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

  // (Re)start timer whenever slide changes
  useEffect(() => {
    setProgress(0);
    startTimer();
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideIndex, user.id]);

  useEffect(() => {
    if (isPaused) {
      clearTimer();
    } else {
      startTimer();
    }
  }, [isPaused, clearTimer, startTimer]);

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

  // Long-press pause
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handlePointerDown = () => {
    holdTimer.current = setTimeout(() => setIsPaused(true), 150);
  };
  const handlePointerUp = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    setIsPaused(false);
  };

  return (
    <div className="relative w-full sm:h-full flex items-center justify-center select-none ">
      <div
        className="relative w-[320px] sm:w-[300px] aspect-[7/13]  rounded-[28px] overflow-hidden shadow-2xl border-4 border-white/10 bg-black flex flex-col"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Background image */}
        {currentSlide?.imageUrl && (
          <div className="absolute inset-0">
            <Image
              src={currentSlide.imageUrl}
              alt={`${user.userName} story slide ${slideIndex + 1}`}
              fill
              sizes="360px"
              className="object-cover"
              priority
            />
            {/* Gradient overlays */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
          </div>
        )}

        {/* Top section */}
        <div className="relative z-10 flex flex-col gap-2.5">
          {/* Progress bars */}
          <ProgressBars
            total={totalSlides}
            current={slideIndex}
            progress={progress}
            onSeek={goToSlide}
          />

          {/* Header */}
          <div className="flex items-center justify-between px-3 pb-1 ">
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div className="w-8 h-8 p-[2px] rounded-full bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35] shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100">
                  <Image
                    src={user.avatar}
                    alt={user.userName}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Name + meta */}
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white leading-tight drop-shadow-sm flex items-center gap-1">
                  {user.userName}
                  {user.verified && (
                    <CheckCircle2 size={10} className="text-blue-400 fill-blue-400" />
                  )}
                </span>
                <span className="text-[9px] text-white/70 font-medium">
                  {totalSlides > 1
                    ? `Slide ${slideIndex + 1} of ${totalSlides}`
                    : (user.timeAgo ?? "Just now")}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all cursor-pointer"
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play size={12} /> : <Pause size={12} />}
              </button>
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all cursor-pointer"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
              <button
                className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all cursor-pointer"
                aria-label="More options"
              >
                <MoreHorizontal size={14} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all cursor-pointer"
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

        {/* Bottom – reply bar */}
        <div className="relative z-10 mt-auto p-3 pt-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-8 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 px-3 flex items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${user.userName}...`}
                className="w-full bg-transparent text-white placeholder:text-white/60 text-[10px] outline-none"
              />
            </div>
            <button
              onClick={() => setLiked((l) => !l)}
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer hover:scale-110"
              aria-label="Like story"
            >
              <Heart
                size={14}
                className={liked ? "fill-red-500 stroke-red-500" : "text-white"}
              />
            </button>
            <button
              className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white transition-all cursor-pointer hover:scale-110"
              aria-label="Share story"
            >
              <Send size={12} />
            </button>
          </div>
        </div>
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
}: PreviewStoriesProps) {
  const [userIndex, setUserIndex] = useState(initialUserIndex);

  // Sync when parent changes initial index
  useEffect(() => {
    setUserIndex(initialUserIndex);
  }, [initialUserIndex]);

  // Close on Escape key
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

  const currentUser = stories[userIndex];

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
              <div className="w-8 h-8 rounded-full overflow-hidden relative bg-gray-100">
                <Image src={user.avatar} alt={user.userName} fill className="object-cover" />
              </div>
            </div>
            <span className="text-[8px] text-white/80 font-medium max-w-[36px] truncate">
              {user.userName}
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
          hasPrev={userIndex > 0}
          hasNext={userIndex < stories.length - 1}
        />
      </div>
    </div>
  );
}
