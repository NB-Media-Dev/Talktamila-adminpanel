"use client";

import React, { useState, useRef, useContext, useEffect } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  MoveLeft,
  CheckCircle2,
  Trash2,
  Eye,
  Smile,
  Globe,
  Users,
  Lock,
  Heart,
  Send,
  Loader2,
  Flame,
  Music,
  Plus,
  Type,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Images as ImagesIcon,
  Search,
  Play,
  Pause,
  Video,
  Film
} from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { useContenthook } from "@/hooks/useContent";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useAuthuser } from "@/hooks/useAuthuser";
import { getAuthToken } from "@/lib/cookies";
import { getBackendUrl } from "@/services/api-client";

interface AddstoriesProps {
  isOpen?: boolean;
  onClose?: () => void;
  onStoryAdded?: (story: {
    imageUrl: string;
    imageUrls?: string[];
    caption: string;
    audience: string;
    musicTrack?: string;
  }) => void;
}

const allAudienceOptions = [
  { id: "public", label: "Public", icon: Globe, desc: "Everyone on Talk Tamila" },
  { id: "followers", label: "Followers", icon: Users, desc: "Only your followers" },
  { id: "close", label: "Close Friends", icon: Lock, desc: "Selected friends only" },
];

const adminAudienceOptions = [
  { id: "public", label: "Public", icon: Globe, desc: "Everyone on Talk Tamila" },
];

const gradientThemes = [
  { id: "insta", name: "Instagram Classic", bg: "bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]" },
  { id: "sunset", name: "Sunset Glow", bg: "bg-gradient-to-tr from-[#f12711] via-[#f5af19] to-[#ff5858]" },
  { id: "cyber", name: "Cyber Neon", bg: "bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70]" },
  { id: "midnight", name: "Midnight Vibe", bg: "bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364]" },
];

export default function Addstories({
  isOpen = true,
  onClose,
  onStoryAdded,
}: AddstoriesProps) {
  const context = useContext(useContenthook);
  const setHandlestate = context?.setHandlestate;
  const { isAdmin } = useAuthRole();
  const { user: authUser } = useAuthuser();
  const currentUser = (authUser as any)?.user || authUser || null;
  const currentAudienceOptions = isAdmin ? adminAudienceOptions : allAudienceOptions;

  interface MusicTrackItem {
    track_id: number;
    title: string;
    artist: string;
    cover_url?: string;
    audio_url?: string;
    duration_seconds?: number;
    genre?: string;
  }

  const [step, setStep] = useState<"edit" | "loading" | "preview">("edit");
  const [caption, setCaption] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<string>("public");
  const [selectedMusic, setSelectedMusic] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<MusicTrackItem | null>(null);
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(0);

  // Music Picker Modal States
  const [isMusicModalOpen, setIsMusicModalOpen] = useState<boolean>(false);
  const [musicSearchQuery, setMusicSearchQuery] = useState<string>("");
  const [activeMusicCategory, setActiveMusicCategory] = useState<string>("trending");
  const [musicTracks, setMusicTracks] = useState<MusicTrackItem[]>([]);
  const [isMusicLoading, setIsMusicLoading] = useState<boolean>(false);
  const [previewingAudioUrl, setPreviewingAudioUrl] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Clip Trimmer States
  const CLIP_DURATION = 60; // fixed 60-second window
  const [musicStartTime, setMusicStartTime] = useState<number>(0);
  const [isTrimmerOpen, setIsTrimmerOpen] = useState<boolean>(false);
  const [trimmerTrack, setTrimmerTrack] = useState<MusicTrackItem | null>(null);
  const [isDraggingTrimmer, setIsDraggingTrimmer] = useState<boolean>(false);
  const [isClipPreviewing, setIsClipPreviewing] = useState<boolean>(false);
  const clipPreviewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trimmerBarRef = useRef<HTMLDivElement | null>(null);

  // Fetch songs for the music modal dynamically
  useEffect(() => {
    if (!isMusicModalOpen) return;
    const BASE_URL = getBackendUrl();
    const fetchMusic = async () => {
      try {
        setIsMusicLoading(true);
        let searchTerm = musicSearchQuery.trim();
        if (!searchTerm) {
          if (activeMusicCategory === "anirudh") searchTerm = "Anirudh";
          else if (activeMusicCategory === "vijay") searchTerm = "Thalapathy Vijay";
          else if (activeMusicCategory === "arrahman") searchTerm = "A.R. Rahman";
          else if (activeMusicCategory === "melody") searchTerm = "Tamil Melody";
          else if (activeMusicCategory === "mass") searchTerm = "Tamil Mass";
        }

        const url = searchTerm
          ? `${BASE_URL}/api/v1/stories/music/search?q=${encodeURIComponent(searchTerm)}&limit=30`
          : `${BASE_URL}/api/v1/stories/music/trending?limit=30`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setMusicTracks(data);
          }
        }
      } catch (e) {
        // silent catch
      } finally {
        setIsMusicLoading(false);
      }
    };
    const debounce = setTimeout(fetchMusic, 250);
    return () => clearTimeout(debounce);
  }, [isMusicModalOpen, musicSearchQuery, activeMusicCategory]);

  const handleToggleAudioPreview = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (!url) return;
    if (previewingAudioUrl === url) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPreviewingAudioUrl(null);
    } else {
      setPreviewingAudioUrl(url);
      if (audioPreviewRef.current) {
        audioPreviewRef.current.src = url;
        audioPreviewRef.current.play().catch(() => {});
      }
    }
  };

  const handleSelectTrack = (t: MusicTrackItem) => {
    // Open trimmer step instead of immediately closing
    setTrimmerTrack(t);
    setMusicStartTime(0);
    setIsTrimmerOpen(true);
    if (audioPreviewRef.current) audioPreviewRef.current.pause();
    setPreviewingAudioUrl(null);
    setIsClipPreviewing(false);
  };

  const handleConfirmClip = () => {
    if (!trimmerTrack) return;
    setSelectedTrack(trimmerTrack);
    setSelectedMusic(`${trimmerTrack.title} - ${trimmerTrack.artist} 🎵`);
    if (audioPreviewRef.current) audioPreviewRef.current.pause();
    setPreviewingAudioUrl(null);
    setIsClipPreviewing(false);
    if (clipPreviewTimerRef.current) clearTimeout(clipPreviewTimerRef.current);
    setIsTrimmerOpen(false);
    setIsMusicModalOpen(false);
  };

  const handleToggleClipPreview = () => {
    if (!trimmerTrack?.audio_url || !audioPreviewRef.current) return;
    if (isClipPreviewing) {
      audioPreviewRef.current.pause();
      setIsClipPreviewing(false);
      if (clipPreviewTimerRef.current) clearTimeout(clipPreviewTimerRef.current);
    } else {
      audioPreviewRef.current.src = trimmerTrack.audio_url;
      audioPreviewRef.current.currentTime = musicStartTime;
      audioPreviewRef.current.play().catch(() => {});
      setIsClipPreviewing(true);
      // Auto-stop after CLIP_DURATION seconds
      clipPreviewTimerRef.current = setTimeout(() => {
        if (audioPreviewRef.current) audioPreviewRef.current.pause();
        setIsClipPreviewing(false);
      }, CLIP_DURATION * 1000);
    }
  };

  const handleTrimmerDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!trimmerBarRef.current || !trimmerTrack) return;
    const rect = trimmerBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const relX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const totalDuration = trimmerTrack.duration_seconds || 180;
    const maxStart = Math.max(0, totalDuration - CLIP_DURATION);
    const rawStart = (relX / rect.width) * totalDuration;
    const newStart = Math.max(0, Math.min(rawStart, maxStart));
    setMusicStartTime(Math.round(newStart * 10) / 10);
    // Update clip preview position if playing
    if (isClipPreviewing && audioPreviewRef.current) {
      audioPreviewRef.current.currentTime = newStart;
    }
  };

  const handleRemoveTrack = () => {
    setSelectedTrack(null);
    setSelectedMusic("");
    setMusicStartTime(0);
    setTrimmerTrack(null);
    setIsTrimmerOpen(false);
    setIsClipPreviewing(false);
    if (clipPreviewTimerRef.current) clearTimeout(clipPreviewTimerRef.current);
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
    }
    setPreviewingAudioUrl(null);
  };

  useEffect(() => {
    if (isAdmin && selectedAudience !== "public") {
      setSelectedAudience("public");
    }
  }, [isAdmin, selectedAudience]);
  

  const [mediaList, setMediaList] = useState<string[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);


  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else if (setHandlestate) {
      setHandlestate(false);
    }
  };


  const isVideoMedia = (mediaSrc: string | null | undefined, file?: File | null) => {
    if (!mediaSrc) return false;
    if (file && file.type) return file.type.startsWith("video/");
    return (
      mediaSrc.startsWith("data:video/") ||
      mediaSrc.endsWith(".mp4") ||
      mediaSrc.endsWith(".webm") ||
      mediaSrc.endsWith(".mov") ||
      mediaSrc.endsWith(".m4v") ||
      mediaSrc.endsWith(".avi")
    );
  };

  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (fileArray.length === 0) return;

    setIsPreviewLoading(true);
    const readPromises: Promise<string>[] = fileArray.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((newMedia) => {
      setTimeout(() => {
        setMediaList((prev) => {
          const updated = [...prev, ...newMedia];
          setActiveSlideIndex(prev.length);
          return updated;
        });
        setRawFiles((prev) => [...prev, ...fileArray]);
        setIsPreviewLoading(false);
      }, 400);
    });
  };

  // Image Upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }

    e.target.value = "";
  };


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };


  const handleRemoveMedia = (indexToRemove: number) => {
    setMediaList((prev) => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (activeSlideIndex >= updated.length) {
        setActiveSlideIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
    setRawFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };


  const handleClearAll = () => {
    setMediaList([]);
    setRawFiles([]);
    setActiveSlideIndex(0);
  };


  const handlePrevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeSlideIndex < mediaList.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };


  const handleAddStory = async () => {
    setIsPublishing(true);
    try {
      const BASE_URL = getBackendUrl();
      const token = getAuthToken();
      const audienceVal = selectedAudience === "close" ? "close_friends" : selectedAudience;

      if (rawFiles.length > 0) {
        const formData = new FormData();
        rawFiles.forEach((file) => {
          formData.append("files", file);
        });
        if (caption) {
          formData.append("captions", JSON.stringify(rawFiles.map(() => caption)));
        }
        formData.append("audience", audienceVal);
        const musicPayload = selectedTrack ? {
          music_id: selectedTrack.track_id,
          music_title: selectedTrack.title,
          music_artist: selectedTrack.artist,
          music_url: selectedTrack.audio_url,
          music_thumbnail: selectedTrack.cover_url,
          music_duration: 60.0,
        } : (selectedMusic ? { music_title: selectedMusic } : null);

        if (musicPayload) {
          formData.append("music_data", JSON.stringify(musicPayload));
        }
        // Send clip start time (seconds) for the 60-second window
        formData.append("music_start_time", String(musicStartTime));

        const res = await fetch(`${BASE_URL}/api/v1/stories/upload-multiple`, {
          method: "POST",
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: formData,
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Upload failed with status ${res.status}`);
        }
      } else if (caption.trim()) {
        const musicPayload = selectedTrack ? {
          music_id: selectedTrack.track_id,
          music_title: selectedTrack.title,
          music_artist: selectedTrack.artist,
          music_url: selectedTrack.audio_url,
          music_thumbnail: selectedTrack.cover_url,
          music_duration: 60.0,
        } : (selectedMusic ? { music_title: selectedMusic } : null);

        const res = await fetch(`${BASE_URL}/api/v1/stories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            media_url: "text-story",
            media_type: "text",
            caption: caption,
            audience: audienceVal,
            music_id: musicPayload?.music_id,
            music_title: musicPayload?.music_title,
            music_artist: musicPayload?.music_artist,
            music_url: musicPayload?.music_url,
            music_thumbnail: musicPayload?.music_thumbnail,
            music_duration: 60.0,
            music_start_time: musicStartTime,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Upload failed with status ${res.status}`);
        }
      } else {
        throw new Error("Please upload a photo/video or enter caption text for your story.");
      }

      setIsPublishing(false);
      setPublishSuccess(true);

      if (onStoryAdded) {
        onStoryAdded({
          imageUrl: mediaList[0] || "default-text-story",
          imageUrls: mediaList,
          caption,
          audience: selectedAudience,
          musicTrack: selectedMusic,
        });
      }

      setTimeout(() => {
        handleCancel();
      }, 1000);
    } catch (err: any) {
      console.error("Story upload failed:", err);
      setIsPublishing(false);
      alert(err.message || "Failed to upload story. Please check your connection and try again.");
    }
  };


  const totalBars = mediaList.length > 0 ? mediaList.length : 1;
  const currentImage = mediaList[activeSlideIndex] || null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-[52px] xs:top-[40px] sm:top-[20px] md:top-0 bg-black/60 backdrop-blur-xs flex items-start justify-center p-0 md:p-4 z-40 animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full h-full xs:mt-4 md:h-auto md:max-h-[94vh] md:max-w-3xl min-[2560px]:max-w-[1250px] min-[3840px]:max-w-[1550px] rounded-none md:rounded-[28px] bg-[#fff0e7] shadow-2xl px-4 pt-3 pb-24 md:px-6 md:py-5 min-[2560px]:p-6 min-[3840px]:p-8 relative font-sans antialiased border-0 md:border border-orange-100 overflow-y-auto flex flex-col justify-start">
        
  
        <div className="flex sm:hidden  mb-2">
          <button
            onClick={() => setStep("edit")}
            className="p-1 -ml-1 text-orange-700 hover:text-orange-900 transition-colors cursor-pointer flex items-center gap-1 font-bold text-sm"
            aria-label="Back"
          >
            <MoveLeft size={22} className="text-[#ef8b54]" />
            <span>Back</span>
          </button>
        </div>

  
        <button
          onClick={handleCancel}
          className="hidden sm:flex absolute right-4 top-4 md:right-3 md:top-0 h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer z-20"
          aria-label="Close"
        >
          <X size={17} />
        </button>


        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] min-[2560px]:grid-cols-[1fr_390px] min-[3840px]:grid-cols-[1fr_450px] gap-6 min-[3840px]:gap-8 items-start mt-1">
          
 
          <div className={`flex flex-col gap-3 min-[3840px]:gap-4 ${step === "edit" ? "block" : "hidden lg:flex"}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-orange-500/10 text-orange-600">
                  <Flame className="w-5 h-5 fill-orange-500 stroke-orange-500" />
                </span>
                <h1 className="text-xl sm:text-2xl min-[2560px]:text-3xl font-extrabold text-[#9b4811] tracking-tight">
                  Add to Story
                </h1>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-orange-900/70 font-medium">
                Add photos, videos, or type text to share with your audience for 24 hours.
              </p>
            </div>


            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="storyCaption" className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5">
                  <Type size={15} className="text-orange-600" />
                  <span>Story Caption & Live Text</span>
                </label>
                <span className="text-[11px] text-gray-400 font-medium">
                  Live updates in preview
                </span>
              </div>

              <div className="relative">
                <textarea
                  id="storyCaption"
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Type your story text or caption here..."
                  className="w-full p-2.5 rounded-xl bg-white border border-orange-100 outline-none text-xs sm:text-sm resize-none transition-all shadow-xs focus:border-[#ef8b54] focus:ring-1 focus:ring-[#ef8b54]/30 placeholder:text-gray-400 text-gray-800 leading-relaxed"
                />
                <div className="absolute right-2.5 bottom-2.5 text-gray-400 hover:text-gray-600 cursor-pointer">
                  <Smile size={16} />
                </div>
              </div>

  
              {mediaList.length === 0 && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-semibold text-gray-600">Text Style:</span>
                  <div className="flex items-center gap-1.5">
                    {gradientThemes.map((theme, idx) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSelectedThemeIndex(idx)}
                        className={`w-5 h-5 rounded-full ${theme.bg} transition-all cursor-pointer ${
                          selectedThemeIndex === idx
                            ? "ring-2 ring-offset-1 ring-orange-500 scale-110 shadow-xs"
                            : "opacity-70 hover:opacity-100"
                        }`}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

  
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5">
                  <ImagesIcon size={15} className="text-orange-600" />
                  <span>Story Media ({mediaList.length} Selected)</span>
                </label>
                <span className="text-[11px] text-orange-600 font-semibold flex items-center gap-1">
                  <Film size={12} />
                  <span>Photos & Videos supported</span>
                </span>
              </div>


              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,video/mp4,video/webm,video/quicktime,video/mov,video/x-m4v"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={addMoreInputRef}
                type="file"
                multiple
                accept="image/*,video/*,video/mp4,video/webm,video/quicktime,video/mov,video/x-m4v"
                onChange={handleFileChange}
                className="hidden"
              />

              {mediaList.length > 0 ? (
 
                <div className="bg-white border border-orange-200 rounded-2xl p-3 flex flex-col gap-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-500 fill-emerald-100" />
                      {mediaList.length} {mediaList.length === 1 ? "Story Slide" : "Story Slides"} Added
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

            
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5">
                    {mediaList.map((img, idx) => {
                      const isVid = isVideoMedia(img, rawFiles[idx]);
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveSlideIndex(idx)}
                          className={`relative w-14 h-18 rounded-xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all group bg-black ${
                            activeSlideIndex === idx
                              ? "border-orange-500 ring-2 ring-orange-400/40 scale-105 shadow-md"
                              : "border-gray-200 opacity-75 hover:opacity-100"
                          }`}
                        >
                          {isVid ? (
                            <div className="relative w-full h-full bg-black flex items-center justify-center">
                              <video
                                src={img}
                                muted
                                playsInline
                                className="w-full h-full object-cover pointer-events-none"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                                  <Play size={9} className="fill-white ml-0.5" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={img}
                              alt={`Slide ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                   
                          <span className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1 rounded-sm flex items-center gap-0.5">
                            {isVid && <Video size={8} className="text-orange-400" />}
                            {idx + 1}
                          </span>

                
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMedia(idx);
                            }}
                            className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer shadow-xs z-10"
                            title="Remove media"
                          >
                            <Trash2 size={9} />
                          </button>
                        </div>
                      );
                    })}

                 
                    <button
                      type="button"
                      onClick={() => addMoreInputRef.current?.click()}
                      className="w-14 h-18 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-100/70 text-orange-600 flex flex-col items-center justify-center gap-1 shrink-0 transition-all cursor-pointer hover:scale-102"
                      title="Add more photos or videos"
                    >
                      <Plus size={16} strokeWidth={2.5} />
                      <span className="text-[9px] font-bold">Add</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    💡 Click thumbnails or preview arrows to switch active slide. Top progress bar updates automatically.
                  </p>
                </div>
              ) : (

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center gap-2 shadow-xs transition-all duration-200 cursor-pointer ${
                    isDragOver
                      ? "border-orange-500 bg-orange-50/80 scale-[0.99]"
                      : "border-orange-200 bg-white hover:border-orange-400 hover:bg-orange-50/30"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#fff0e7] flex items-center justify-center text-[#ef8b54] shadow-xs">
                    <UploadCloud className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col items-center">
                    <p className="text-xs sm:text-sm font-bold text-gray-800">
                      Click to browse or drag & drop photos or videos
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Select PNG, JPG, WEBP, MP4, MOV, or WEBM files
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-1 px-4 py-1.5 bg-[#ef8b54] text-white text-xs font-bold rounded-full hover:bg-[#d9723a] transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    Select Photos or Videos
                  </button>
                </div>
              )}
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Audience */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-gray-700">Audience</label>
                <div className="flex gap-1.5 bg-white p-1 rounded-xl shadow-xs border border-orange-50">
                  {currentAudienceOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedAudience === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedAudience(option.id)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#ef8b54] text-white shadow-xs"
                            : "text-gray-600 hover:bg-orange-50"
                        }`}
                      >
                        <Icon size={12} />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>


              {/* Audio Track */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-bold text-gray-700 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Music size={12} className="text-orange-600" />
                    <span>Audio Track</span>
                  </span>
                  {selectedTrack || selectedMusic ? (
                    <button
                      type="button"
                      onClick={handleRemoveTrack}
                      className="text-[10px] text-red-500 hover:text-red-700 font-semibold cursor-pointer flex items-center gap-0.5"
                    >
                      <Trash2 size={10} />
                      <span>Remove</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsMusicModalOpen(true)}
                      className="text-[10px] text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                    >
                      + Browse Songs
                    </button>
                  )}
                </label>

                {selectedTrack || selectedMusic ? (
                  <div className="p-2 rounded-xl bg-white border border-orange-200 shadow-xs flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {selectedTrack?.cover_url ? (
                          <img
                            src={selectedTrack.cover_url}
                            alt={selectedTrack.title}
                            className="w-8 h-8 rounded-lg object-cover shrink-0 shadow-xs border border-orange-100"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                            <Music size={14} />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-bold text-gray-800 text-[11px] truncate">
                            {selectedTrack ? selectedTrack.title : selectedMusic}
                          </span>
                          <span className="text-[10px] text-gray-500 truncate">
                            {selectedTrack ? selectedTrack.artist : "Tamil Audio"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsMusicModalOpen(true)}
                          className="px-2 py-1 text-[10px] font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-md border border-orange-200 cursor-pointer transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                    {/* Clip timing badge */}
                    {selectedTrack && (
                      <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-2 py-1 border border-orange-100">
                        <Music size={9} className="text-orange-500 shrink-0" />
                        <span className="text-[10px] font-bold text-orange-700 flex-1">
                          {`${Math.floor(musicStartTime / 60)}:${String(Math.round(musicStartTime % 60)).padStart(2, "0")} → ${Math.floor((musicStartTime + 60) / 60)}:${String(Math.round((musicStartTime + 60) % 60)).padStart(2, "0")} · 60s clip`}
                        </span>
                        <button
                          type="button"
                          onClick={() => { setTrimmerTrack(selectedTrack); setIsTrimmerOpen(true); setIsMusicModalOpen(true); }}
                          className="text-[9px] font-bold text-orange-600 hover:text-orange-800 underline cursor-pointer shrink-0"
                        >
                          Edit Timing
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsMusicModalOpen(true)}
                    className="w-full h-9 px-3 rounded-xl bg-white border border-dashed border-orange-200 hover:border-orange-400 hover:bg-orange-50/50 transition-all shadow-xs flex items-center justify-between text-xs text-gray-600 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-orange-600 min-w-0">
                      <Search size={13} className="shrink-0" />
                      <span className="text-[11px] text-gray-500 font-medium truncate">Search Tamil & trending music...</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[9.5px] font-bold shrink-0">
                      Open Library
                    </span>
                  </button>
                )}
              </div>

            </div>


            <button
              type="button"
              onClick={() => setStep("preview")}
              className="mt-2 w-full py-2.5 bg-[#ef8b54] hover:bg-[#d9723a] text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer lg:hidden uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Eye size={15} />
              <span>Preview Story ({totalBars} {totalBars === 1 ? 'bar' : 'bars'})</span>
            </button>
          </div>


          <div className={`flex flex-col items-center gap-3 ${step !== "edit" ? "block" : "hidden lg:flex"}`}>
            

            <div className="w-full flex items-center justify-between lg:hidden mb-1">
            
              <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Live Preview</span>
            </div>

            <div className="hidden lg:flex items-center justify-between w-full px-1">
              <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Live Story Preview
              </span>
              <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                {mediaList.length > 0 ? `${mediaList.length} Stories` : 'Text Story'}
              </span>
            </div>


            <div className={`w-full max-w-[270px] sm:max-w-[290px] min-[2560px]:max-w-[320px] aspect-[9/16] rounded-[24px] overflow-hidden shadow-2xl border-4 border-white relative flex flex-col justify-between select-none ${
              currentImage ? "bg-black" : gradientThemes[selectedThemeIndex].bg
            }`}>
              

              {isPreviewLoading ? (
                <div className="absolute inset-0 z-30 bg-slate-900 flex flex-col justify-between p-3 animate-pulse">
                  <div className="flex gap-1">
                    {Array.from({ length: Math.max(2, totalBars) }).map((_, i) => (
                      <Skeleton key={i} className="h-1 flex-1 bg-orange-400/60 rounded-full" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Skeleton className="w-8 h-8 rounded-full bg-orange-300/40" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-2.5 w-20 bg-orange-300/40" />
                      <Skeleton className="h-2 w-12 bg-white/20" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                    <span className="text-[11px] font-bold text-orange-200">Adding Story Media...</span>
                  </div>
                  <Skeleton className="h-8 w-full bg-white/10 rounded-full" />
                </div>
              ) : null}

              {currentImage && (
                <div className="absolute inset-0 w-full h-full bg-black">
                  {isVideoMedia(currentImage, rawFiles[activeSlideIndex]) ? (
                    <video
                      key={currentImage}
                      src={currentImage}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={currentImage}
                      alt={`Story Preview Slide ${activeSlideIndex + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  )}
 
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />
                </div>
              )}

 
              {mediaList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    disabled={activeSlideIndex === 0}
                    className={`absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center transition-all cursor-pointer hover:bg-black/60 ${
                      activeSlideIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-75 hover:opacity-100 shadow-md"
                    }`}
                    aria-label="Previous story slide"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    disabled={activeSlideIndex === mediaList.length - 1}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center transition-all cursor-pointer hover:bg-black/60 ${
                      activeSlideIndex === mediaList.length - 1 ? "opacity-0 pointer-events-none" : "opacity-75 hover:opacity-100 shadow-md"
                    }`}
                    aria-label="Next story slide"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}


              <div className="relative z-10 p-3 pt-2.5 flex flex-col gap-2">
        
                <div className="flex gap-1 w-full items-center">
                  {Array.from({ length: totalBars }).map((_, index) => {
                    const isActive = index === activeSlideIndex;
                    const isPassed = index < activeSlideIndex;
                    return (
                      <div
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (mediaList.length > index) setActiveSlideIndex(index);
                        }}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 cursor-pointer ${
                          isActive
                            ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                            : isPassed
                            ? "bg-white/90"
                            : "bg-white/30"
                        }`}
                        title={`Slide ${index + 1}`}
                      />
                    );
                  })}
                </div>

     
                <div className="flex items-center justify-between mt-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 p-[1.5px] rounded-full bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]">
                      <div className="w-full h-full rounded-full border border-white overflow-hidden relative bg-gray-100 flex items-center justify-center">
                        {currentUser?.avatar_url || currentUser?.profile_pic_url ? (
                          <img
                            src={currentUser.avatar_url || currentUser.profile_pic_url}
                            alt="Your Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-[10px] font-bold bg-orange-500 w-full h-full flex items-center justify-center">
                            {(currentUser?.username || "Y").charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-white leading-tight drop-shadow-xs flex items-center gap-1">
                        {currentUser?.username || "Your Story"}
                        <CheckCircle2 size={10} className="text-blue-400 fill-blue-400" />
                      </span>
                      <span className="text-[8px] text-white/80 font-medium">
                        {mediaList.length > 1 ? `Slide ${activeSlideIndex + 1} of ${mediaList.length}` : 'Just now'}
                      </span>
                    </div>
                  </div>

                  {/* Audio badge */}
                  {selectedMusic && (
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                      <Music size={8} className="text-orange-400 animate-bounce" />
                      <span className="text-[8px] text-white font-semibold truncate max-w-[70px]">
                        {selectedMusic.split("-")[0] || "Audio"}
                      </span>
                    </div>
                  )}
                </div>
              </div>


              {!currentImage ? (

                <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 text-center my-auto">
                  {caption.trim() ? (
                    <div className="bg-black/30 backdrop-blur-xs px-4 py-3 rounded-2xl border border-white/20 shadow-lg max-w-full animate-in zoom-in-95 duration-150">
                      <p className="text-white text-xs sm:text-sm font-extrabold leading-snug break-words whitespace-pre-wrap drop-shadow-md">
                        {caption}
                      </p>
                    </div>
                  ) : (

                    <div className="flex flex-col items-center justify-center text-white/90 gap-1.5 animate-in fade-in duration-200">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-sm border border-white/30">
                        <Type size={18} strokeWidth={2.5} />
                      </div>
                      <p className="text-xs sm:text-[13px] font-extrabold text-white tracking-wide drop-shadow-md">
                        Type something to share...
                      </p>
                      <span className="text-[9.5px] text-white/70 font-medium bg-black/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        Aa · Live Instagram Text Mode
                      </span>
                    </div>
                  )}
                </div>
              ) : (

                <div className="relative z-10 flex-1 flex flex-col justify-end p-3">
                  {caption.trim() ? (
                    <div className="bg-black/60 backdrop-blur-xs p-2.5 rounded-xl border border-white/20 shadow-md mb-1 animate-in fade-in">
                      <p className="text-white text-[11px] font-medium leading-relaxed whitespace-pre-wrap break-words line-clamp-3 drop-shadow-xs">
                        {caption}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}

  
              <div className="relative z-10 p-3 pt-0 flex items-center gap-2">
                <div className="flex-1 h-7 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 px-2.5 flex items-center text-white/80 text-[9px]">
                  <span>Send a message...</span>
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                  <Heart size={12} className="fill-white/20" />
                </div>
                <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                  <Send size={11} />
                </div>
              </div>
            </div>

            {publishSuccess && (
              <div className="w-full bg-emerald-100 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Story ({mediaList.length || 1} slides) published successfully!</span>
              </div>
            )}


            <div className="flex items-center gap-2.5 w-full justify-center mt-1">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPublishing}
                className={`${buttonVariants({ variant: 'outline' })} px-4 py-1.5 text-xs font-bold min-w-[90px] shadow-xs cursor-pointer disabled:opacity-50`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddStory}
                disabled={isPublishing || isPreviewLoading}
                className={`${buttonVariants({ variant: 'default' })} px-6 py-1.5 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all min-w-[120px] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5`}
              >
                {isPublishing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} strokeWidth={3} />
                    <span>Add Story {mediaList.length > 1 ? `(${mediaList.length})` : ''}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio element for track previewing */}
      <audio ref={audioPreviewRef} onEnded={() => setPreviewingAudioUrl(null)} className="hidden" />

      {/* Story Music Picker Modal */}
      {isMusicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-5 duration-200">

            {/* ── STEP 2: CLIP TRIMMER ── */}
            {isTrimmerOpen && trimmerTrack ? (
              <>
                {/* Trimmer Header */}
                <div className="p-4 border-b border-orange-100 flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50">
                  <button
                    type="button"
                    onClick={() => { setIsTrimmerOpen(false); setIsClipPreviewing(false); if (audioPreviewRef.current) audioPreviewRef.current.pause(); }}
                    className="w-8 h-8 rounded-full bg-white border border-orange-200 text-orange-600 flex items-center justify-center cursor-pointer hover:bg-orange-50 shadow-xs"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">Choose Your 60s Clip</h3>
                    <p className="text-[11px] text-gray-500 truncate">{trimmerTrack.title} · {trimmerTrack.artist}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsTrimmerOpen(false); setIsMusicModalOpen(false); setIsClipPreviewing(false); if (audioPreviewRef.current) audioPreviewRef.current.pause(); }}
                    className="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-gray-700 flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Trimmer Body */}
                <div className="flex-1 p-5 flex flex-col gap-5 overflow-y-auto">
                  {/* Track card */}
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-2xl border border-orange-100">
                    {trimmerTrack.cover_url ? (
                      <img src={trimmerTrack.cover_url} alt={trimmerTrack.title} className="w-12 h-12 rounded-xl object-cover shadow-xs border border-orange-100 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-orange-200 flex items-center justify-center text-orange-700 shrink-0"><Music size={20} /></div>
                    )}
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-extrabold text-gray-900 text-sm truncate">{trimmerTrack.title}</span>
                      <span className="text-xs text-gray-500 truncate">{trimmerTrack.artist}</span>
                      <span className="text-[10px] text-orange-600 font-semibold mt-0.5">
                        Total: {Math.floor((trimmerTrack.duration_seconds || 180) / 60)}:{String(Math.round((trimmerTrack.duration_seconds || 180) % 60)).padStart(2, "0")} · Clip: 60s
                      </span>
                    </div>
                    {/* Clip preview toggle */}
                    <button
                      type="button"
                      onClick={handleToggleClipPreview}
                      className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-sm ${isClipPreviewing ? "bg-orange-500 text-white scale-110" : "bg-white border border-orange-200 text-orange-600 hover:bg-orange-50"}`}
                      title={isClipPreviewing ? "Pause Clip" : "Preview 60s Clip"}
                    >
                      {isClipPreviewing ? <Pause size={16} className="fill-white" /> : <Play size={16} className="fill-orange-600 ml-0.5" />}
                    </button>
                  </div>

                  {/* Timeline scrubber */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
                      <span>Drag to set start position</span>
                      <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        {`${Math.floor(musicStartTime / 60)}:${String(Math.floor(musicStartTime % 60)).padStart(2, "0")} → ${Math.floor((musicStartTime + 60) / 60)}:${String(Math.floor((musicStartTime + 60) % 60)).padStart(2, "0")}`}
                      </span>
                    </div>

                    {/* Timeline track */}
                    <div className="relative select-none">
                      {/* Full track background */}
                      <div
                        ref={trimmerBarRef}
                        className="relative h-12 bg-gray-100 rounded-xl overflow-hidden cursor-pointer border border-gray-200"
                        onMouseDown={(e) => { setIsDraggingTrimmer(true); handleTrimmerDrag(e); }}
                        onMouseMove={(e) => { if (isDraggingTrimmer) handleTrimmerDrag(e); }}
                        onMouseUp={() => setIsDraggingTrimmer(false)}
                        onMouseLeave={() => setIsDraggingTrimmer(false)}
                        onTouchStart={(e) => { setIsDraggingTrimmer(true); handleTrimmerDrag(e); }}
                        onTouchMove={(e) => { if (isDraggingTrimmer) handleTrimmerDrag(e); }}
                        onTouchEnd={() => setIsDraggingTrimmer(false)}
                      >
                        {/* Waveform bars (decorative) */}
                        <div className="absolute inset-0 flex items-center gap-[2px] px-2 pointer-events-none">
                          {Array.from({ length: 60 }).map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-full bg-gray-300"
                              style={{ height: `${20 + Math.sin(i * 0.8) * 14 + Math.sin(i * 2.1) * 8}%` }}
                            />
                          ))}
                        </div>

                        {/* Selected 60s orange window */}
                        {(() => {
                          const total = trimmerTrack.duration_seconds || 180;
                          const leftPct = (musicStartTime / total) * 100;
                          const widthPct = Math.min((60 / total) * 100, 100 - leftPct);
                          return (
                            <div
                              className="absolute top-0 bottom-0 bg-orange-500/30 border-l-2 border-r-2 border-orange-500 flex items-center justify-center pointer-events-none"
                              style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                            >
                              <div className="w-1 h-5 bg-orange-500 rounded-full opacity-80" />
                              <span className="text-[8px] font-bold text-orange-800 bg-orange-100/90 px-1 rounded ml-1">60s</span>
                            </div>
                          );
                        })()}

                        {/* Playhead indicator */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-orange-600 pointer-events-none"
                          style={{ left: `${(musicStartTime / (trimmerTrack.duration_seconds || 180)) * 100}%` }}
                        />
                      </div>

                      {/* Time labels */}
                      <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-gray-400 font-medium">
                        <span>0:00</span>
                        <span>{Math.floor((trimmerTrack.duration_seconds || 180) / 60)}:{String(Math.round((trimmerTrack.duration_seconds || 180) % 60)).padStart(2, "0")}</span>
                      </div>
                    </div>

                    {/* Quick jump buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-gray-500 font-semibold">Quick jump:</span>
                      {[0, 15, 30, 45, 60, 90].filter(t => t + 60 <= (trimmerTrack.duration_seconds || 180)).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setMusicStartTime(t); if (isClipPreviewing && audioPreviewRef.current) audioPreviewRef.current.currentTime = t; }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${musicStartTime === t ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-700"}`}
                        >
                          {`${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`}
                        </button>
                      ))}
                    </div>

                    <p className="text-[10px] text-gray-400 text-center">
                      🎵 Drag the orange window or tap a quick-jump to set where your clip starts. The story will play exactly 60 seconds of this song.
                    </p>
                  </div>
                </div>

                {/* Trimmer Footer */}
                <div className="p-4 border-t border-orange-100 bg-orange-50 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => { setIsTrimmerOpen(false); setIsClipPreviewing(false); if (audioPreviewRef.current) audioPreviewRef.current.pause(); }}
                    className="flex-1 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-xl border border-gray-200 cursor-pointer transition-colors"
                  >
                    ← Back to Songs
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmClip}
                    className="flex-1 py-2.5 bg-[#ef8b54] hover:bg-[#d9723a] text-white font-extrabold text-sm rounded-xl shadow-md shadow-orange-500/20 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={15} className="fill-white/20" />
                    Use This Clip
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* ── STEP 1: SONG LIST ── */}
                {/* Modal Header */}
                <div className="p-4 border-b border-orange-100 flex items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#ef8b54] flex items-center justify-center text-white shadow-xs">
                      <Music size={17} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">Add Music to Story</h3>
                      <p className="text-[11px] text-gray-500">Free Tamil & Global Songs · Pick & trim 60s</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (audioPreviewRef.current) audioPreviewRef.current.pause();
                      setPreviewingAudioUrl(null);
                      setIsMusicModalOpen(false);
                    }}
                    className="w-8 h-8 rounded-full bg-white text-gray-500 hover:text-gray-800 shadow-xs flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Search Input & Filter Chips */}
                <div className="p-3 border-b border-gray-100 bg-white">
                  <div className="relative flex items-center">
                    <Search size={15} className="absolute left-3 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={musicSearchQuery}
                      onChange={(e) => setMusicSearchQuery(e.target.value)}
                      placeholder="Search song, artist, movie or album..."
                      className="w-full pl-9 pr-8 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      autoFocus
                    />
                    {musicSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setMusicSearchQuery("")}
                        className="absolute right-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Category filter chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 text-[11px] no-scrollbar">
                    {[
                      { id: "trending", label: "🔥 All Trending" },
                      { id: "melody", label: "🎶 Top Melody" },
                      { id: "anirudh", label: "⚡ Anirudh Hits" },
                      { id: "vijay", label: "👑 Thalapathy Vijay" },
                      { id: "arrahman", label: "✨ A.R. Rahman" },
                      { id: "mass", label: "💥 Mass / Kuthu" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setActiveMusicCategory(cat.id);
                          setMusicSearchQuery("");
                        }}
                        className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                          activeMusicCategory === cat.id && !musicSearchQuery
                            ? "bg-[#ef8b54] text-white shadow-xs font-bold"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scrollable Song List */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-2 flex flex-col gap-1 divide-y divide-gray-50 max-h-[50vh]">
                  {isMusicLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Loader2 size={24} className="animate-spin text-orange-500" />
                      <span className="text-xs font-medium">Searching high-quality audio tracks...</span>
                    </div>
                  ) : musicTracks.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-1.5 text-gray-400 text-center px-4">
                      <Music size={28} className="text-gray-300 mb-1" />
                      <span className="text-xs font-bold text-gray-700">No songs found</span>
                      <span className="text-[11px] text-gray-500">Try searching for another Tamil song, artist or movie name</span>
                    </div>
                  ) : (
                    musicTracks.map((track) => {
                      const isSelected = selectedTrack?.track_id === track.track_id;
                      const isPreviewing = previewingAudioUrl === track.audio_url;

                      return (
                        <div
                          key={track.track_id}
                          onClick={() => handleSelectTrack(track)}
                          className={`p-2 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-orange-50/80 group ${
                            isSelected ? "bg-orange-50 border border-orange-200" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-orange-100 shadow-xs">
                              {track.cover_url ? (
                                <img
                                  src={track.cover_url}
                                  alt={track.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-orange-500">
                                  <Music size={18} />
                                </div>
                              )}
                              {track.audio_url && (
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleAudioPreview(e, track.audio_url)}
                                  className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center text-white transition-opacity cursor-pointer ${
                                    isPreviewing ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                  }`}
                                  title={isPreviewing ? "Pause" : "Quick preview"}
                                >
                                  {isPreviewing ? (
                                    <Pause size={16} className="fill-white animate-pulse" />
                                  ) : (
                                    <Play size={16} className="fill-white ml-0.5" />
                                  )}
                                </button>
                              )}
                            </div>

                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="font-bold text-gray-900 text-xs truncate group-hover:text-[#ef8b54] transition-colors">
                                {track.title}
                              </span>
                              <span className="text-[11px] text-gray-500 truncate">{track.artist}</span>
                              {track.duration_seconds && (
                                <span className="text-[10px] text-orange-400 font-medium">
                                  {Math.floor(track.duration_seconds / 60)}:{String(Math.round(track.duration_seconds % 60)).padStart(2, "0")}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTrack(track);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                                isSelected
                                  ? "bg-[#ef8b54] text-white shadow-xs"
                                  : "bg-orange-50 hover:bg-[#ef8b54] text-orange-700 hover:text-white"
                              }`}
                            >
                              {isSelected ? "✓ Selected" : "Use →"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-[11px] text-gray-500">
                  <span>🎵 Select a song to trim your 60-second clip</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (audioPreviewRef.current) audioPreviewRef.current.pause();
                      setPreviewingAudioUrl(null);
                      setIsMusicModalOpen(false);
                    }}
                    className="px-3 py-1 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-lg border border-gray-200 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}