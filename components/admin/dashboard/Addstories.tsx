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
  ChevronLeft,
  ChevronRight,
  Images as ImagesIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { useContenthook } from "@/hooks/useContent";
import defaultAvatar from "@/public/Images/profile1.jpg";
import { useAuthRole } from "@/hooks/useAuthRole";
import { storyService } from "@/services/Stories.service";
import MusicsControl, {
  type MusicTrack,
  CLIP_DURATION,
} from "./MusicsControl";

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
  {
    id: "insta",
    name: "Instagram Classic",
    bg: "bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    bg: "bg-gradient-to-tr from-[#f12711] via-[#f5af19] to-[#ff5858]",
  },
  {
    id: "cyber",
    name: "Cyber Neon",
    bg: "bg-gradient-to-br from-[#4158D0] via-[#C850C0] to-[#FFCC70]",
  },
  {
    id: "midnight",
    name: "Midnight Vibe",
    bg: "bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364]",
  },
];

export default function Addstories({
  isOpen = true,
  onClose,
  onStoryAdded,
}: AddstoriesProps) {
  const context = useContext(useContenthook);
  const setHandlestate = context?.setHandlestate;
  const { isAdmin } = useAuthRole();
  const currentAudienceOptions = isAdmin ? adminAudienceOptions : allAudienceOptions;

  const [step, setStep] = useState<"edit" | "loading" | "preview">("edit");
  const [caption, setCaption] = useState<string>("");
  const [selectedAudience, setSelectedAudience] = useState<string>("public");
  const [selectedThemeIndex, setSelectedThemeIndex] = useState<number>(0);

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

  // ─── Music state (delegated to MusicsControl) ──────────────────────────────
  const [selectedTrack, setSelectedTrack] = useState<MusicTrack | null>(null);
  const [musicStartTime, setMusicStartTime] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  const handleCancel = () => {
    setSelectedTrack(null);
    setMusicStartTime(0);
    if (onClose) {
      onClose();
    } else if (setHandlestate) {
      setHandlestate(false);
    }
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

    Promise.all(readPromises).then((newImages) => {
      setTimeout(() => {
        setMediaList((prev) => {
          const updated = [...prev, ...newImages];
          setActiveSlideIndex(prev.length);
          return updated;
        });
        setRawFiles((prev) => [...prev, ...fileArray]);
        setIsPreviewLoading(false);
      }, 400);
    });
  };

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
      const audienceVal = selectedAudience === "close" ? "close_friends" : selectedAudience;
      let responseData;

      const musicDataPayload = selectedTrack
        ? {
            music_title: selectedTrack.trackName,
            music_artist: selectedTrack.artistName,
            music_url: selectedTrack.previewUrl || "",
            music_thumbnail: selectedTrack.artworkUrl100,
            music_duration: CLIP_DURATION,
            music_start_time: musicStartTime,
          }
        : null;

      if (rawFiles.length > 0) {
        const formData = new FormData();
        rawFiles.forEach((file) => {
          formData.append("files", file);
        });
        if (caption) {
          formData.append("captions", JSON.stringify(rawFiles.map(() => caption)));
        }
        formData.append("audience", audienceVal);
        if (musicDataPayload) {
          formData.append("music_data", JSON.stringify(musicDataPayload));
        }
        if (musicStartTime > 0) {
          formData.append("music_start_time", String(musicStartTime));
        }

        responseData = await storyService.uploadMultipleFiles(formData);
        console.log("Backend response for files upload:", responseData);
      } else if (caption.trim()) {
        const textPayload = {
          media_url: "text-story",
          media_type: "text",
          caption: caption,
          audience: audienceVal,
          music_title: selectedTrack?.trackName || "",
          music_artist: selectedTrack?.artistName,
          music_url: selectedTrack?.previewUrl,
          music_thumbnail: selectedTrack?.artworkUrl100,
          music_duration: selectedTrack ? CLIP_DURATION : undefined,
          music_start_time: musicStartTime,
        };

        responseData = await storyService.addTextStory(textPayload);
        console.log("Backend response for text story:", responseData);
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
          musicTrack: selectedTrack?.trackName,
        });
      }

      setTimeout(() => {
        handleCancel();
      }, 1000);
    } catch (err: any) {
      console.error("Story upload failed:", err);
      setIsPublishing(false);
      const errorMessage =
        err.message || "Failed to upload story. Please check your connection and try again.";
      alert(errorMessage);
    }
  };

  const totalBars = mediaList.length > 0 ? mediaList.length : 1;
  const currentImage = mediaList[activeSlideIndex] || null;
  const isVideo = (src: string) => src.startsWith("data:video/");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 top-[52px] xs:top-[40px] sm:top-[20px] md:top-0 bg-black/60 backdrop-blur-xs flex items-start justify-center p-0 md:p-4 z-40 animate-in fade-in duration-200">
      <div className="w-full h-full xs:mt-4 md:h-auto md:max-h-[94vh] md:max-w-3xl min-[2560px]:max-w-[1250px] min-[3840px]:max-w-[1550px] rounded-none md:rounded-[28px] bg-[#fff0e7] shadow-2xl px-4 pt-3 pb-24 md:px-6 md:py-5 min-[2560px]:p-6 min-[3840px]:p-8 relative font-sans antialiased border-0 md:border border-orange-100 overflow-y-auto md:overflow-hidden flex flex-col justify-start">
        {/* Mobile Back Button */}
        <div className="flex sm:hidden mb-2">
          <button
            onClick={() => setStep("edit")}
            className="p-1 -ml-1 text-orange-700 hover:text-orange-900 transition-colors cursor-pointer flex items-center gap-1 font-bold text-sm"
            aria-label="Back"
          >
            <MoveLeft size={22} className="text-[#ef8b54]" />
            <span>Back</span>
          </button>
        </div>

        {/* Desktop Close button */}
        <button
          onClick={handleCancel}
          className="hidden sm:flex absolute right-4 top-4 md:right-3 md:top-0 h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 hover:text-gray-700 shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer z-20"
          aria-label="Close"
        >
          <X size={17} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] min-[2560px]:grid-cols-[1fr_390px] min-[3840px]:grid-cols-[1fr_450px] gap-6 min-[3840px]:gap-8 items-start mt-1">
          {/* Left Form Column */}
          <div
            className={`flex flex-col gap-3 min-[3840px]:gap-4 ${
              step === "edit" ? "block" : "hidden lg:flex"
            }`}
          >
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
                Add multiple photos or type text to share with your audience for 24 hours.
              </p>
            </div>

            {/* Story Caption Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="storyCaption"
                  className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5"
                >
                  <Type size={15} className="text-orange-600" />
                  <span>Story Caption &amp; Live Text</span>
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

              {/* Text gradient selector (when no media uploaded) */}
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

            {/* Media Upload Box */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-gray-800 flex items-center gap-1.5">
                  <ImagesIcon size={15} className="text-orange-600" />
                  <span>Story Media ({mediaList.length} Selected)</span>
                </label>
                <span className="text-[11px] text-orange-600 font-semibold">
                  Photos &amp; videos
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/mov,video/quicktime,video/webm,video/x-msvideo"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={addMoreInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/mov,video/quicktime,video/webm,video/x-msvideo"
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
                    {mediaList.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`relative w-14 h-18 rounded-xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all group ${
                          activeSlideIndex === idx
                            ? "border-orange-500 ring-2 ring-orange-400/40 scale-105 shadow-md"
                            : "border-gray-200 opacity-75 hover:opacity-100"
                        }`}
                      >
                        {isVideo(img) ? (
                          <video
                            src={img}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                          />
                        ) : (
                          <Image
                            src={img}
                            alt={`Slide ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        )}
                        {isVideo(img) && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
                              <span className="text-white text-[8px]">▶</span>
                            </div>
                          </div>
                        )}

                        <span className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1 rounded-sm">
                          {idx + 1}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMedia(idx);
                          }}
                          className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 cursor-pointer shadow-xs"
                          title="Remove image"
                        >
                          <Trash2 size={9} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addMoreInputRef.current?.click()}
                      className="w-14 h-18 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-100/70 text-orange-600 flex flex-col items-center justify-center gap-1 shrink-0 transition-all cursor-pointer hover:scale-102"
                      title="Add more photos"
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
                      Click to browse or drag &amp; drop
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Photos (PNG, JPG, WEBP, GIF) &amp; Videos (MP4, MOV, WEBM)
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
                    Select Photos &amp; Videos
                  </button>
                </div>
              )}
            </div>

            {/* Audience & Audio Track Row */}
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

              {/* Audio Track Component */}
              <MusicsControl
                selectedTrack={selectedTrack}
                musicStartTime={musicStartTime}
                onTrackChange={setSelectedTrack}
                onStartTimeChange={setMusicStartTime}
              />
            </div>

            {/* Mobile preview toggle button */}
            <button
              type="button"
              onClick={() => setStep("preview")}
              className="mt-2 w-full py-2.5 bg-[#ef8b54] hover:bg-[#d9723a] text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer lg:hidden uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Eye size={15} />
              <span>Preview Story ({totalBars} {totalBars === 1 ? 'bar' : 'bars'})</span>
            </button>
          </div>

          {/* Right Live Preview Column */}
          <div
            className={`flex flex-col items-center gap-3 ${
              step !== "edit" ? "block" : "hidden lg:flex"
            }`}
          >
            <div className="w-full flex items-center justify-between lg:hidden mb-1">
              <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">
                Live Preview
              </span>
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

            {/* Story Device Container */}
            <div
              className={`w-full max-w-[270px] sm:max-w-[290px] min-[2560px]:max-w-[320px] aspect-[9/16] rounded-[24px] overflow-hidden shadow-2xl border-4 border-white relative flex flex-col justify-between select-none ${
                currentImage ? "bg-black" : gradientThemes[selectedThemeIndex].bg
              }`}
            >
              {/* Skeleton loading overlay */}
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
                    <span className="text-[11px] font-bold text-orange-200">
                      Adding Story Media...
                    </span>
                  </div>
                  <Skeleton className="h-8 w-full bg-white/10 rounded-full" />
                </div>
              ) : null}

              {/* Background media */}
              {currentImage && (
                <div className="absolute inset-0 w-full h-full">
                  {isVideo(currentImage) ? (
                    <video
                      src={currentImage}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <Image
                      src={currentImage}
                      alt={`Story Preview Slide ${activeSlideIndex + 1}`}
                      fill
                      sizes="320px"
                      className="object-cover transition-opacity duration-300"
                      priority
                    />
                  )}

                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none" />
                </div>
              )}

              {/* Slide navigation buttons */}
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

              {/* Top Header Section */}
              <div className="relative z-10 p-3 pt-2.5 flex flex-col gap-2">
                {/* Progress bars */}
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

                {/* User avatar + name */}
                <div className="flex items-center justify-between mt-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 p-[1.5px] rounded-full bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]">
                      <div className="w-full h-full rounded-full border border-white overflow-hidden relative bg-gray-100">
                        <Image
                          src={defaultAvatar}
                          alt="Your Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-white leading-tight drop-shadow-xs flex items-center gap-1">
                        talktamila_official
                        <CheckCircle2 size={10} className="text-blue-400 fill-blue-400" />
                      </span>
                      <span className="text-[8px] text-white/80 font-medium">
                        {mediaList.length > 1 ? `Slide ${activeSlideIndex + 1} of ${mediaList.length}` : 'Just now'}
                      </span>
                    </div>
                  </div>

                  {selectedTrack && (
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
                      <Music size={8} className="text-orange-400 animate-bounce" />
                      <span className="text-[8px] text-white font-semibold truncate max-w-[70px]">
                        {selectedTrack.trackName.split(" ")[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Section: Caption */}
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
                        Text Mode
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

              {/* Bottom Dummy Interaction Bar */}
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

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full justify-center mt-1">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPublishing}
                className={`${buttonVariants({
                  variant: "outline",
                })} px-4 py-1.5 text-xs font-bold min-w-[90px] shadow-xs cursor-pointer disabled:opacity-50`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddStory}
                disabled={isPublishing || isPreviewLoading}
                className={`${buttonVariants({
                  variant: "default",
                })} px-6 py-1.5 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all min-w-[120px] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5`}
              >
                {isPublishing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} strokeWidth={3} />
                    <span>Add Story {mediaList.length > 1 ? `(${mediaList.length})` : ""}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
