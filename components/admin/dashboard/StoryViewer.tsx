"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  Share2,
  VolumeX,
  EyeOff,
  Flag,
  Bookmark,
  MoreVertical,
  Star,
  Users,
  Globe,
  Repeat,
  AtSign,
  Download,
} from "lucide-react";
import { storyService } from "@/services/Stories.service";
import type { StoryActivityData, StorySlide, StoryUser, UserStoryGroup } from "@/types/Stories";
import { formatTimeAgo } from "./Previewstories";
import { ActivitySheet } from "./StoryActivity";
import { useAuthuser } from "@/hooks/useAuthuser";
import { saveStoryToDevice } from "@/lib/storyExporter";

// ─── Progress Bars ───────────────────────────────────────────────────────────

interface ProgressBarProps {
  slides?: StorySlide[];
  total: number;
  current: number;
  /** 0-100 progress of the active bar */
  progress: number;
  onSeek: (index: number) => void;
}

export function ProgressBars({ slides, total, current, progress, onSeek }: ProgressBarProps) {
  const items = slides && slides.length > 0 ? slides : Array.from({ length: total });
  return (
    <div className="flex gap-1 w-full items-center px-3 pt-2.5">
      {items.map((item, i) => {
        const isPast = i < current;
        const isActive = i === current;
        const key = (item as StorySlide)?.id ?? i;
        return (
          <div
            key={key}
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
  initialSlideIndex?: number;
  initialStoryId?: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onStoryDeleted?: (storyId: number) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const sortSlidesAscending = (rawSlides?: StorySlide[]): StorySlide[] =>
  [...(rawSlides || [])].sort((a, b) => (new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()) || (Number(a.id || 0) - Number(b.id || 0)));

const resolveInitialSlideIndex = (
  sorted: StorySlide[],
  initialStoryId?: number,
  initialSlideIndex?: number
): number => {
  if (initialStoryId) {
    const idx = sorted.findIndex((s) => s.id === initialStoryId || s.story_id === initialStoryId);
    if (idx >= 0) return idx;
  }
  return typeof initialSlideIndex === "number" && initialSlideIndex >= 0 && initialSlideIndex < sorted.length ? initialSlideIndex : 0;
};

export function StoryViewer({
  user,
  initialSlideIndex,
  initialStoryId,
  onNext,
  onPrev,
  onClose,
  onStoryDeleted,
  hasPrev,
  hasNext,
}: StoryViewerProps) {
  const initialSorted = useMemo(() => sortSlidesAscending(user.slides), [user.slides]);
  const [slides, setSlides] = useState<StorySlide[]>(initialSorted);
  const [slideIndex, setSlideIndex] = useState<number>(() =>
    resolveInitialSlideIndex(initialSorted, initialStoryId, initialSlideIndex)
  );
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
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Download to device state
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Mention Modal State
  const [showMentionModal, setShowMentionModal] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionResults, setMentionResults] = useState<import("@/types/Stories").MentionUserSearchItem[]>([]);
  const [isMentionSearching, setIsMentionSearching] = useState(false);
  const [selectedMentions, setSelectedMentions] = useState<import("@/types/Stories").MentionUserSearchItem[]>([]);
  const [isSubmittingMention, setIsSubmittingMention] = useState(false);
  const [mentionToast, setMentionToast] = useState<string | null>(null);

  // Resharing State
  const [isResharing, setIsResharing] = useState(false);
  const [reshareToast, setReshareToast] = useState(false);

  // Reporting State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("Inappropriate content");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSuccessToast, setReportSuccessToast] = useState<string | null>(null);

  const viewedSlideIdsRef = useRef<Set<number>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const TICK = 50; // ms per tick

  useEffect(() => {
    const sorted = sortSlidesAscending(user.slides);
    setSlides(sorted);
    setSlideIndex(resolveInitialSlideIndex(sorted, initialStoryId, initialSlideIndex));
    setIsTypingReply(false);
    setReplyText("");
  }, [user, initialStoryId, initialSlideIndex]);


  const { user: authUser } = useAuthuser();
  const currentLoggedInUser = (authUser as any)?.user || authUser || null;
  const currentUsername = (currentLoggedInUser?.username || "").toLowerCase().trim();
  const currentUserId = currentLoggedInUser?.id || currentLoggedInUser?.user_id;

  const currentSlide = slides[slideIndex] || slides[0];

  const canReshareThisSlide = useMemo(() => {
    if (!currentSlide || user.is_my_story) return false;
    if (currentSlide.can_reshare === true) return true;
    if (currentSlide.mentions && Array.isArray(currentSlide.mentions) && currentSlide.mentions.length > 0) {
      if (currentSlide.mentions.some((m) => 
        (m.username && currentUsername && m.username.toLowerCase().trim() === currentUsername) ||
        (m.mentioned_user_id && currentUserId && Number(m.mentioned_user_id) === Number(currentUserId))
      )) {
        return true;
      }
    }
    const captionLower = (currentSlide.caption || "").toLowerCase();
    if (currentUsername && (captionLower.includes(`@${currentUsername}`) || captionLower.includes(`@${currentUsername.replace(/\s+/g, '')}`))) {
      return true;
    }
    return false;
  }, [currentSlide, user.is_my_story, currentUsername, currentUserId]);

  const slideDuration = currentSlide?.duration ?? 5000;
  const totalSlides = slides.length;

  // Story is effectively paused if hold-to-pause is active, manual pause is on, typing in reply input, activity sheet is open, or report modal is open
  const isEffectivelyPaused =
    isPaused || isHolding || isTypingReply || Boolean(replyText.trim()) || showActivity || showReportModal;

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
          // Ignore AbortError since it's normal when play is interrupted by pause
          if (err.name !== 'AbortError') {
            console.warn("Audio playback note:", err);
          }
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
      const storyId = Number(currentSlide.story_id || currentSlide.id);
      if (storyId && !viewedSlideIdsRef.current.has(storyId)) {
        viewedSlideIdsRef.current.add(storyId);
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

  const handleReshareStory = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentSlide || isResharing) return;
    const storyIdToReshare = currentSlide.id || currentSlide.story_id;
    if (!storyIdToReshare) return;

    try {
      setIsResharing(true);
      await storyService.reshareStory(storyIdToReshare);
      setReshareToast(true);
      setTimeout(() => setReshareToast(false), 2500);
    } catch (err: any) {
      console.error("Reshare story failed:", err);
      alert(err.message || "Failed to add story to your story.");
    } finally {
      setIsResharing(false);
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

  const handleReportSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const storyId = currentSlide?.story_id || currentSlide?.id || user?.story_id || user?.id;
    if (!storyId) return;

    if (!reportReason.trim()) {
      alert("Please select or enter a reason for reporting.");
      return;
    }

    setIsSubmittingReport(true);
    try {
      const res = await storyService.reportStory(storyId, reportReason, reportDetails);
      setReportSuccessToast(res.message || "Report submitted to admin. Thank you!");
      setTimeout(() => {
        setReportSuccessToast(null);
        setShowReportModal(false);
        setReportDetails("");
        setReportReason("Inappropriate content");
        setIsPaused(false);
      }, 2000);
    } catch (err: any) {
      console.error("Report story failed:", err);
      alert(err.message || "Failed to submit report. Please try again.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Save to device (download) handler
  const handleSaveToDevice = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentSlide || isSaving) return;

    setIsSaving(true);
    setSaveToast("Preparing download...");

    try {
      const res = await saveStoryToDevice(
        currentSlide,
        effectiveAudioUrl,
        (progressMsg) => {
          if (progressMsg) setSaveToast(progressMsg);
        }
      );
      setSaveToast(res.message);
      setTimeout(() => setSaveToast(null), 3000);
    } catch (err: any) {
      console.error("Download failed:", err);
      setSaveToast("Failed to save story.");
      setTimeout(() => setSaveToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Mention search handler
  const handleMentionSearch = async (q: string) => {
    setMentionQuery(q);
    if (!q.trim()) {
      setMentionResults([]);
      return;
    }
    setIsMentionSearching(true);
    try {
      const results = await storyService.searchMentionUsers(q, 15);
      setMentionResults(results);
    } catch {
      setMentionResults([]);
    } finally {
      setIsMentionSearching(false);
    }
  };

  const handleToggleMentionUser = (u: import("@/types/Stories").MentionUserSearchItem) => {
    setSelectedMentions((prev) => {
      const exists = prev.some((m) => m.user_id === u.user_id);
      if (exists) return prev.filter((m) => m.user_id !== u.user_id);
      return [...prev, u];
    });
  };

  const handleSubmitMentions = async () => {
    if (!currentSlide || selectedMentions.length === 0 || isSubmittingMention) return;
    const storyId = Number(currentSlide.story_id || currentSlide.id);
    if (!storyId) return;

    setIsSubmittingMention(true);
    try {
      for (const u of selectedMentions) {
        await storyService.addMentionToStory(storyId, u.user_id);
      }
      const names = selectedMentions.map((u) => `@${u.username}`).join(", ");
      setMentionToast(`Mentioned ${names} in your story!`);
      setTimeout(() => {
        setMentionToast(null);
        setShowMentionModal(false);
        setSelectedMentions([]);
        setMentionQuery("");
        setMentionResults([]);
        setIsPaused(false);
      }, 2000);
    } catch (err: any) {
      setMentionToast(err?.message || "Failed to mention users.");
      setTimeout(() => setMentionToast(null), 2200);
    } finally {
      setIsSubmittingMention(false);
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

    {/* Reshare Toast Message */}
    {reshareToast && (
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-black/85 text-white border border-white/20 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
        <Repeat size={13} className="text-emerald-400" />
        <span>Added to your Story!</span>
      </div>
    )}

    {/* Save / Download Toast */}
    {saveToast && (
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-black/85 text-white border border-white/20 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
        <Download size={13} className="text-amber-400" />
        <span>{saveToast}</span>
      </div>
    )}

    {/* Mention Toast */}
    {mentionToast && (
      <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 bg-black/85 text-white border border-white/20 text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
        <AtSign size={13} className="text-blue-400" />
        <span>{mentionToast}</span>
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
          alt={`${user.username} story slide`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
      </div>
    ) : (
      <div className="absolute inset-0">
        <Image
          src={currentSlide.imageUrl}
          alt={`${user.username} story slide`}
          fill
          sizes="360px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
      </div>
    )}

    {/* Story Mentions Overlay */}
    {currentSlide.mentions && currentSlide.mentions.length > 0 && (
      <div className="absolute inset-0 pointer-events-none z-20">
        {currentSlide.mentions.map((m) => (
          <div
            key={m.id || m.username}
            style={{
              position: "absolute",
              left: `${m.x != null ? m.x * 100 : 50}%`,
              top: `${m.y != null ? m.y * 100 : 75}%`,
              transform: "translate(-50%, -50%)",
            }}
            className="pointer-events-auto cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold text-xs border border-white/25 shadow-lg hover:scale-105 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              alert(`Mentioned @${m.username}`);
            }}
          >
            <AtSign size={11} className="text-orange-400" />
            <span>{m.username}</span>
          </div>
        ))}
      </div>
    )}

    {/* Top section */}
    <div className="relative z-30 flex flex-col gap-2 pointer-events-auto">
      {/* Progress bars */}
      <ProgressBars
        slides={slides}
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
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <Image src={user.avatar} alt={user.username} fill sizes="32px" className="object-cover" />
              )}
            </div>
          </div>
          {/* Name + meta */}
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-white leading-tight drop-shadow-sm flex items-center gap-1">
              {user.is_my_story ? "Your Story" : user.username}
              {user.verified && (
                <CheckCircle2 size={10} className="text-blue-400 fill-blue-400" />
              )}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] text-white/70 font-medium">
                {formatTimeAgo(currentSlide?.created_at, user.timeAgo || "Just now")}
              </span>
              {currentSlide?.audience && (currentSlide.audience.toUpperCase() === "CLOSE_FRIENDS" || currentSlide.audience.toUpperCase() === "CLOSE") ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#10B981] text-[8px] text-white font-semibold shadow-xs">
                  <Star size={8} className="fill-white" /> Close Friends
                </span>
              ) : currentSlide?.audience && (currentSlide.audience.toUpperCase() === "FOLLOWERS" || currentSlide.audience.toUpperCase() === "FOLLOWER") ? (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#3B82F6] text-[8px] text-white font-medium shadow-xs">
                  <Users size={8} /> Followers
                </span>
              ) : null}
            </div>
            {currentSlide?.is_reshare && currentSlide?.original_username && (
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[8.5px] text-white/95 font-semibold">
                  <Repeat size={9} className="text-emerald-400" />
                  <span>Re-shared from @{currentSlide.original_username}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 relative z-30 pointer-events-auto">
          {/* 3-Dot Options Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowOptionsMenu((prev) => !prev);
                setIsPaused(true);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer shadow-sm"
              aria-label="More options"
              title="More options"
            >
              <MoreVertical size={14} />
            </button>

            {/* Dropdown Menu */}
            {showOptionsMenu && (
              <div
                className="absolute right-0 top-9 w-44 bg-zinc-900/95 backdrop-blur-md border border-white/15 rounded-xl shadow-2xl py-1.5 z-50 flex flex-col animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
              >
                {user.is_my_story ? (
                  <>
                    {/* Mention Option */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptionsMenu(false);
                        setIsPaused(true);
                        setMentionQuery("");
                        setMentionResults([]);
                        setSelectedMentions([]);
                        setShowMentionModal(true);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-blue-300 hover:bg-white/10 transition-colors text-left cursor-pointer border-b border-white/10"
                    >
                      <AtSign size={14} className="text-blue-400" />
                      <span>Mention</span>
                    </button>

                    {/* Delete Option */}
                    <button
                      type="button"
                      onClick={(e) => {
                        setShowOptionsMenu(false);
                        setIsPaused(false);
                        handleDeleteSlide(e);
                      }}
                      disabled={isDeleting}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-white/10 transition-colors text-left disabled:opacity-50 cursor-pointer"
                    >
                      {isDeleting ? (
                        <Loader2 size={14} className="animate-spin text-red-400" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      <span>Delete</span>
                    </button>

                    {/* Save to Device Option */}
                    <button
                      type="button"
                      onClick={(e) => {
                        setShowOptionsMenu(false);
                        handleSaveToDevice(e);
                      }}
                      disabled={isSaving}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-white/90 hover:bg-white/10 transition-colors text-left cursor-pointer disabled:opacity-50"
                    >
                      {isSaving ? (
                        <Loader2 size={14} className="animate-spin text-amber-400" />
                      ) : (
                        <Download size={14} className="text-amber-400" />
                      )}
                      <span>{isSaving ? "Saving..." : "Save to Device"}</span>
                    </button>
                  </>
                ) : (
                  /* --- OTHER USER'S STORY OPTIONS --- */
                 <>
                    {/* Song Details Option (Inside Menu - Shown ONLY IF music track exists) */}
                    {(displayMusicTrack || currentSlide.musicTrack) && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowOptionsMenu(false);
                          setIsPaused(false);
                          alert(`Song Playing: ${currentSlide.musicTrack || displayMusicTrack}`);
                        }}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-white/90 hover:bg-white/10 transition-colors text-left cursor-pointer border-b border-white/10"
                      >
                        <Music size={14} className="text-orange-400" />
                        <span className="truncate max-w-[120px]">
                          {currentSlide.musicTrack || displayMusicTrack}
                        </span>
                      </button>
                    )}

                    {/* Re-share / Add to My Story Option (Only if current user was mentioned in this specific story) */}
                    {canReshareThisSlide && (
                      <button
                        type="button"
                        onClick={(e) => {
                          setShowOptionsMenu(false);
                          setIsPaused(false);
                          handleReshareStory(e);
                        }}
                        disabled={isResharing}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-white/90 hover:bg-white/10 transition-colors text-left cursor-pointer"
                      >
                        {isResharing ? (
                          <Loader2 size={14} className="animate-spin text-orange-400" />
                        ) : (
                          <Repeat size={14} className="text-emerald-400" />
                        )}
                        <span>Add to My Story</span>
                      </button>
                    )}

                    {/* Report Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setIsPaused(true);
                        setShowReportModal(true);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-white/10 transition-colors text-left cursor-pointer"
                    >
                      <Flag size={14} />
                      <span>Report Story</span>
                    </button>

                    {/* Mute Option */}
                    <button
                      type="button"
                      onClick={async () => {
                        setShowOptionsMenu(false);
                        try {
                          await storyService.muteCreator(user.id);
                          alert(`Muted @${user.username}'s stories.`);
                          onNext();
                        } catch {
                          alert(`Muted @${user.username}'s stories.`);
                        }
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-white/90 hover:bg-white/10 transition-colors text-left cursor-pointer"
                    >
                      <VolumeX size={14} />
                      <span>Mute @{user.username}</span>
                    </button>
                  </>
                )}
            
              </div>
            )}
          </div>

          {/* Pause/Play Button */}
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

          {/* Close Button */}
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
   
    </div>

    {/* Tap zones */}
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

    {/* Bottom Section */}
    <div className="relative z-30 p-3 pt-0 flex flex-col gap-2 mt-auto">
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
        <div className="flex items-center justify-between bg-black/40 backdrop-blur-md border border-white/20 px-3 py-2 rounded-2xl">
          <button
            onClick={handleOpenActivity}
            className="flex items-center gap-1.5 text-white/90 hover:text-white transition-colors cursor-pointer text-xs font-bold"
          >
            <Eye size={14} className="text-orange-400" />
            <span>{currentSlide.views_count ?? 0} Views</span>
            <span className="text-[10px] text-white/60 font-normal">· Seen by</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
              <Heart size={14} className="fill-rose-500" />
              {currentSlide.likes_count ?? 0}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({ title: 'Story', url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Story link copied to clipboard!");
                }
              }}
              className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer"
              title="Share Story"
            >
              <Share2 size={13} />
            </button>
          </div>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 relative z-30"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
        >
          <div className="flex-1 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-4 flex items-center justify-between shadow-md focus-within:border-[#FF6B35] focus-within:bg-black/60 transition-all">
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
              placeholder={`Reply to ${user.username}...`}
              className="w-full bg-transparent text-white placeholder:text-white/70 text-xs outline-none pr-2"
            />
            {replyText.trim() && (
              <button
                type="button"
                onClick={handleSendReply}
                disabled={isSendingReply}
                className="text-[#FF6B35] hover:text-[#ff5517] transition-all cursor-pointer shrink-0"
                title="Send reply"
              >
                <Send size={15} className={isSendingReply ? "animate-pulse" : ""} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleLike}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-90 shadow-md shrink-0"
            title={liked ? "Unlike story" : "Like story"}
          >
            <Heart
              size={16}
              className={`transition-all duration-150 ${
                liked ? "fill-rose-500 stroke-rose-500 text-rose-500 scale-110" : "text-white"
              }`}
            />
          </button>

          {canReshareThisSlide && (
            <button
              type="button"
              onClick={handleReshareStory}
              disabled={isResharing}
              className="w-9 h-9 rounded-full bg-emerald-500/40 border border-emerald-400/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-emerald-500/60 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-md shrink-0 disabled:opacity-50"
              title="Add to My Story (You were mentioned)"
            >
              {isResharing ? (
                <Loader2 size={15} className="animate-spin text-emerald-200" />
              ) : (
                <Repeat size={15} className="text-emerald-200 hover:text-white" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (navigator.share) {
                navigator.share({ title: 'Story', url: window.location.href }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Story link copied to share!");
              }
            }}
            className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-md shrink-0"
            title="Share or send to friends"
          >
            <Share2 size={16} />
          </button>
        </div>
      )}
    </div>

    {showActivity && (
      <ActivitySheet
        activityData={activityData}
        loading={loadingActivity}
        fallbackViews={currentSlide.views_count ?? 0}
        fallbackLikes={currentSlide.likes_count ?? 0}
        onClose={() => setShowActivity(false)}
      />
    )}

    {/* Mention Modal */}
    {showMentionModal && (
      <div
        className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
      >
        <div className="bg-[#111114] border border-white/10 rounded-t-3xl p-4 text-white shadow-2xl max-h-[88%] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
              <AtSign size={16} className="text-blue-400" />
              <span>Tag People in Story</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowMentionModal(false);
                setIsPaused(false);
                setSelectedMentions([]);
                setMentionQuery("");
                setMentionResults([]);
              }}
              className="text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Success state */}
          {mentionToast && (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 text-blue-300">
              <CheckCircle2 size={36} className="animate-bounce" />
              <p className="font-semibold text-sm">{mentionToast}</p>
            </div>
          )}

          {!mentionToast && (
            <>
              {/* Selected Mentions Chips */}
              {selectedMentions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3 px-0.5">
                  {selectedMentions.map((u) => (
                    <button
                      key={u.user_id}
                      type="button"
                      onClick={() => handleToggleMentionUser(u)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-200 text-xs font-semibold hover:bg-blue-600/50 transition-all"
                    >
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt={u.username} className="w-4 h-4 rounded-full object-cover" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-blue-500/60 flex items-center justify-center text-[8px] font-bold">
                          {u.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <span>@{u.username}</span>
                      <X size={10} className="opacity-60" />
                    </button>
                  ))}
                </div>
              )}

              {/* Search Input */}
              <div className="relative mb-3">
                <div className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-xl px-3 py-2.5 focus-within:border-blue-400/60 focus-within:bg-black/40 transition-all">
                  <AtSign size={14} className="text-blue-400 shrink-0" />
                  <input
                    type="text"
                    value={mentionQuery}
                    autoFocus
                    onChange={(e) => handleMentionSearch(e.target.value)}
                    placeholder="Search people to mention..."
                    className="flex-1 bg-transparent text-white placeholder:text-white/40 text-xs outline-none"
                  />
                  {isMentionSearching && <Loader2 size={13} className="animate-spin text-blue-400 shrink-0" />}
                  {mentionQuery && !isMentionSearching && (
                    <button
                      type="button"
                      onClick={() => { setMentionQuery(""); setMentionResults([]); }}
                      className="text-white/40 hover:text-white transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Results List */}
              <div className="flex-1 overflow-y-auto space-y-1 min-h-[80px] max-h-[200px] pr-0.5">
                {mentionResults.length === 0 && !isMentionSearching && mentionQuery.trim() && (
                  <div className="py-6 text-center text-white/40 text-xs">No users found for "@{mentionQuery}"</div>
                )}
                {mentionResults.length === 0 && !mentionQuery.trim() && (
                  <div className="py-6 text-center text-white/30 text-xs flex flex-col items-center gap-1.5">
                    <AtSign size={22} className="text-white/20" />
                    <span>Type a username to search and tag people</span>
                  </div>
                )}
                {mentionResults.map((u) => {
                  const isSelected = selectedMentions.some((m) => m.user_id === u.user_id);
                  return (
                    <button
                      key={u.user_id}
                      type="button"
                      onClick={() => handleToggleMentionUser(u)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all text-left ${
                        isSelected
                          ? "bg-blue-600/25 border border-blue-400/40"
                          : "hover:bg-white/8 border border-transparent"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt={u.username} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                            {u.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                        {isSelected && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-blue-500 border border-[#111114] flex items-center justify-center">
                            <CheckCircle2 size={9} className="text-white" />
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">@{u.username}</p>
                        {u.full_name && <p className="text-[10px] text-white/50 truncate">{u.full_name}</p>}
                      </div>
                      {/* Following badge */}
                      {u.is_following && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium shrink-0">Following</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleSubmitMentions}
                  disabled={selectedMentions.length === 0 || isSubmittingMention}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-40 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25"
                >
                  {isSubmittingMention ? (
                    <><Loader2 size={13} className="animate-spin" /><span>Tagging...</span></>
                  ) : (
                    <><AtSign size={13} /><span>Tag {selectedMentions.length > 0 ? `${selectedMentions.length} ${selectedMentions.length === 1 ? 'Person' : 'People'}` : 'People'}</span></>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    {/* Report Story Modal */}
    {showReportModal && (
      <div 
        className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-end sm:justify-center p-3 sm:p-4 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="bg-[#18181b] border border-white/15 rounded-2xl p-4 text-white shadow-2xl w-full max-h-[92%] overflow-y-auto space-y-3.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <Flag size={16} />
              <span>Report Story</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowReportModal(false);
                setIsPaused(false);
              }}
              className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {reportSuccessToast ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 text-emerald-400">
              <CheckCircle2 size={36} className="animate-bounce" />
              <p className="font-semibold text-sm">{reportSuccessToast}</p>
              <p className="text-xs text-white/60">Our admin team has received your report with reason and details.</p>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-white/70 block mb-1.5 uppercase tracking-wider">
                  Reason *
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {[
                    "Inappropriate content",
                    "Spam or misleading",
                    "Harassment or bullying",
                    "Hate speech or discrimination",
                    "Violence or dangerous content",
                    "False information",
                    "Intellectual property violation",
                    "Other",
                  ].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReportReason(r)}
                      className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center justify-between ${
                        reportReason === r
                          ? "bg-red-500/20 border-red-500/50 text-red-300 font-medium"
                          : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <span>{r}</span>
                      {reportReason === r && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-white/70 block mb-1 uppercase tracking-wider">
                  Details (Optional)
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide additional context for the admin..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-red-400/60 focus:ring-1 focus:ring-red-400/60 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    setIsPaused(false);
                  }}
                  className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport || !reportReason}
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30"
                >
                  {isSubmittingReport ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Send to Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )}
  </div>

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