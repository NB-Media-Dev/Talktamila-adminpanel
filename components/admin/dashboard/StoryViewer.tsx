import { CheckCircle2, ChevronLeft, ChevronRight, Eye, Heart, Music, Send, Trash2, Volume2, VolumeX, X } from "lucide-react";
import { ActivitySheet } from "./StoryActivity";
import { StoryUser } from "./Previewstories";
import { useEffect, useRef, useState } from "react";
import { StoryActivityData, StorySlide } from "@/types/Stories";
import { storyService } from "@/services/Stories.service";
import Image from "next/image";



function ProgressBars({
  total,
  current,
  progress,
  onSeek,
}: {
  total: number;
  current: number;
  progress: number;
  onSeek: (idx: number) => void;
}) {
  return (
    <div className="flex gap-1 w-full items-center px-3 pt-2.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          onClick={() => onSeek(i)}
          className="flex-1 h-[3px] rounded-full bg-white/30 overflow-hidden cursor-pointer"
          title={`Slide ${i + 1}`}
        >
          <div
            className="h-full rounded-full bg-white transition-none"
            style={{ width: i < current ? "100%" : i === current ? `${progress}%` : "0%" }}
          />
        </div>
      ))}
    </div>
  );
}

const isStoryVideo = (slide?: StorySlide) => {
  if (!slide) return false;
  if (slide.media_type === "video") return true;
  if (typeof slide.imageUrl === "string") {
    const url = slide.imageUrl.toLowerCase();
    return (
      url.startsWith("data:video") ||
      url.endsWith(".mp4") ||
      url.endsWith(".webm") ||
      url.endsWith(".mov") ||
      url.endsWith(".m4v") ||
      url.endsWith(".avi")
    );
  }
  return false;
};

const isStoryText = (slide?: StorySlide) => {
  if (!slide) return false;
  if (slide.media_type === "text") return true;
  if (!slide.imageUrl && Boolean(slide.caption)) return true;
  if (typeof slide.imageUrl === "string") {
    const url = slide.imageUrl.toLowerCase();
    return (
      url === "text-story" ||
      url === "default-text-story" ||
      url.startsWith("gradient:") ||
      ["insta", "sunset", "cyber", "midnight"].includes(url)
    );
  }
  return false;
};

const getTextStoryGradient = (url?: any) => {
  if (typeof url === "string") {
    if (url.includes("sunset")) return "bg-gradient-to-tr from-[#f12711] via-[#f5af19] to-[#ff5858]";
    if (url.includes("cyber")) return "bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70]";
    if (url.includes("midnight")) return "bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364]";
  }
  return "bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]";
};




export function StoryViewer({
  user,
  onNext,
  onPrev,
  onClose,
  onStoryDeleted,
  hasPrev,
  hasNext,
}: {
  user: StoryUser;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onStoryDeleted?: (id: number) => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  const [slides, setSlides] = useState<StorySlide[]>(user.slides);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyToast, setReplyToast] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [activityData, setActivityData] = useState<StoryActivityData | null>(null);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const TICK = 50;

  useEffect(() => {
    setSlides(user.slides);
    setSlideIndex(0);
    setVideoDuration(null);
  }, [user]);

  const currentSlide = slides[slideIndex] || slides[0];
  const totalSlides = slides.length;
  const slideDuration = videoDuration ?? currentSlide?.duration ?? 5000;
  const isVideo = isStoryVideo(currentSlide);
  const isText = isStoryText(currentSlide);


  useEffect(() => {
    if (!currentSlide) return;
    setLiked(Boolean(currentSlide.liked));

    const storyId = currentSlide.story_id || currentSlide.id;
    if (!user.is_my_story && storyId) {
      storyService.recordView(storyId).catch(() => {});
    }
  }, [slideIndex, user.id, user.is_my_story]);

  // Advance progress percentage
  useEffect(() => {
    if (isPaused || showActivity) return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (TICK / slideDuration) * 100, 100));
    }, TICK);

    return () => clearInterval(interval);
  }, [slideDuration, isPaused, showActivity]);

  // Handle slide auto-advance when progress completes
  useEffect(() => {
    if (progress >= 100) {
      if (slideIndex < totalSlides - 1) {
        setSlideIndex((i) => i + 1);
        setVideoDuration(null);
        setProgress(0);
      } else {
        onNext();
      }
    }
  }, [progress, slideIndex, totalSlides, onNext]);

  // Reset progress on slide or user change
  useEffect(() => {
    setProgress(0);
  }, [slideIndex, user.id]);

 
  useEffect(() => {
    if (videoRef.current) {
      if (isPaused || showActivity) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused, showActivity]);

  const goToSlide = (idx: number) => {
    setSlideIndex(idx);
    setVideoDuration(null);
    setProgress(0);
  };

  const handlePrevSlide = () => {
    if (slideIndex > 0) goToSlide(slideIndex - 1);
    else if (hasPrev) onPrev();
  };

  const handleNextSlide = () => {
    if (slideIndex < totalSlides - 1) goToSlide(slideIndex + 1);
    else if (hasNext) onNext();
    else onClose();
  };

  // Like / Unlike toggle via storyService
  const handleToggleLike = async () => {
    if (!currentSlide) return;
    const storyId = currentSlide.story_id || currentSlide.id;
    if (!storyId) return;

    const newLiked = !liked;
    setLiked(newLiked);

    setSlides((prev) =>
      prev.map((s) =>
        (s.story_id || s.id) === storyId
          ? {
              ...s,
              liked: newLiked,
              likes_count: newLiked ? (s.likes_count ?? 0) + 1 : Math.max(0, (s.likes_count ?? 0) - 1),
            }
          : s
      )
    );

    try {
      const response = newLiked
        ? await storyService.likeStory(storyId)
        : await storyService.unlikeStory(storyId);

      if (response && typeof response.likes_count === "number") {
        setSlides((prev) =>
          prev.map((s) =>
            (s.story_id || s.id) === storyId ? { ...s, liked: newLiked, likes_count: response.likes_count } : s
          )
        );
      }
    } catch (e) {
      console.error("Like failed:", e);
    }
  };

  // Send reply via storyService
  const handleSendReply = async () => {
    if (!replyText.trim() || !currentSlide || isSendingReply) return;
    const storyId = currentSlide.story_id || currentSlide.id;
    if (!storyId) return;

    const textToSend = replyText.trim();
    setReplyText("");
    setIsSendingReply(true);

    try {
      await storyService.replyStory(storyId, textToSend);
      setReplyToast(true);
      setTimeout(() => setReplyToast(false), 2000);
    } catch (e) {
      console.error("Reply failed:", e);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Delete story via storyService
  const handleDeleteSlide = async () => {
    if (!currentSlide || isDeleting || !confirm("Are you sure you want to delete this story slide?")) return;
    const storyId = currentSlide.story_id || currentSlide.id;
    setIsDeleting(true);

    try {
      await storyService.deleteStory(storyId);
      onStoryDeleted?.(storyId);
      const remaining = slides.filter((_, idx) => idx !== slideIndex);
      if (remaining.length === 0) onClose();
      else {
        setSlides(remaining);
        setSlideIndex(Math.max(0, slideIndex - 1));
      }
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Failed to delete story.");
    } finally {
      setIsDeleting(false);
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
      console.error("Load activity failed:", e);
    } finally {
      setLoadingActivity(false);
    }
  };

  if (!currentSlide) return null;

  return (
    <div className="relative w-full sm:h-full flex items-center justify-center select-none">
      <div
        className="relative w-[330px] sm:w-[320px] aspect-[9/16] rounded-[28px] overflow-hidden shadow-2xl border-4 border-white/10 bg-black flex flex-col justify-between"
        onPointerDown={() => {
          holdTimer.current = setTimeout(() => setIsPaused(true), 150);
        }}
        onPointerUp={() => {
          if (holdTimer.current) clearTimeout(holdTimer.current);
          setIsPaused(false);
        }}
        onPointerLeave={() => {
          if (holdTimer.current) clearTimeout(holdTimer.current);
          setIsPaused(false);
        }}
      >

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
                  setVideoDuration(Math.max(3000, Math.min(dur * 1000, 60000)));
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
          </div>
        ) : isText ? (
          <div className={`absolute inset-0 ${getTextStoryGradient(currentSlide.imageUrl)} flex items-center justify-center p-6 text-center`}>
            <div className="bg-black/25 backdrop-blur-xs px-5 py-4 rounded-2xl border border-white/20 shadow-xl max-w-[90%]">
              <p className="text-white text-base sm:text-lg font-extrabold leading-snug drop-shadow-md whitespace-pre-wrap break-words">
                {currentSlide.caption || "TalkTamila Story"}
              </p>
            </div>
          </div>
        ) : typeof currentSlide.imageUrl === "string" ? (
          <div className="absolute inset-0">
            <img src={currentSlide.imageUrl} alt="story slide" className="w-full h-full object-cover" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0">
            <Image src={currentSlide.imageUrl} alt="story slide" fill sizes="360px" className="object-cover" priority />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
          </div>
        )}

        {currentSlide.music_url && !isMuted && !isVideo && (
          <audio
            ref={(el) => {
              if (el) {
                if (isPaused) el.pause();
                else el.play().catch(() => {});
              }
            }}
            src={currentSlide.music_url}
            autoPlay
            loop
          />
        )}

        <div className="relative z-10 flex flex-col gap-2">
          <ProgressBars total={totalSlides} current={slideIndex} progress={progress} onSeek={goToSlide} />

          <div className="flex items-center justify-between px-3 pb-1">
            <div className="flex items-center gap-2">
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
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-white leading-tight drop-shadow-sm flex items-center gap-1">
                  {user.is_my_story ? "Your Story" : user.userName}
                  {user.verified && <CheckCircle2 size={10} className="text-blue-400 fill-blue-400" />}
                </span>
                <span className="text-[9px] text-white/70 font-medium">
                  {totalSlides > 1 ? `Slide ${slideIndex + 1} of ${totalSlides}` : user.timeAgo ?? "Just now"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {user.is_my_story && (
                <button
                  onClick={handleDeleteSlide}
                  disabled={isDeleting}
                  className="w-7 h-7 rounded-full bg-red-600/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600 transition-all cursor-pointer shadow-sm"
                  title="Delete Story"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <button
                onClick={() => setIsMuted((m) => !m)}
                className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {user.musicTrack && !isMuted && (
            <div className="mx-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/15 w-fit">
              <Music size={9} className="text-orange-400 animate-bounce" />
              <span className="text-[9px] text-white font-semibold truncate max-w-[140px]">{user.musicTrack}</span>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 top-16 bottom-24 z-10 flex pointer-events-none">
          <div className="w-1/3 h-full cursor-pointer pointer-events-auto" onClick={handlePrevSlide} />
          <div className="w-1/3 h-full" />
          <div className="w-1/3 h-full cursor-pointer pointer-events-auto" onClick={handleNextSlide} />
        </div>

        <div className="relative z-30 mt-auto flex flex-col p-3 gap-2 pointer-events-auto">
          {replyToast && (
            <div className="self-center bg-black/80 text-white border border-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Reply sent!</span>
            </div>
          )}

          {!isText && currentSlide.caption && (
            <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/15 shadow-lg">
              <p className="text-white text-xs font-medium leading-relaxed break-words whitespace-pre-wrap">
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
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                  <Heart size={12} className="fill-rose-500" />
                  {currentSlide.likes_count ?? 0}
                </span>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 relative z-30"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="flex-1 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-3.5 flex items-center shadow-md focus-within:border-[#FF6B35] focus-within:bg-black/60 transition-all">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
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
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleLike();
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-md"
                aria-label="Like story"
              >
                <Heart
                  size={16}
                  className={liked ? "fill-rose-500 stroke-rose-500 text-rose-500" : "text-white"}
                />
              </button>
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
              >
                <Send size={13} className={isSendingReply ? "animate-pulse" : ""} />
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