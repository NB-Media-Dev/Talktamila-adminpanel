"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Music,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { storyService } from "@/services/Stories.service";
import type { BackendMusicTrack } from "@/types/Stories";

export interface MusicTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl?: string;
  trackTimeMillis?: number;
}

export const CLIP_DURATION = 60; 

export const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const mapBackendToTrack = (t: BackendMusicTrack): MusicTrack => ({
  trackId: t.track_id,
  trackName: t.title,
  artistName: t.artist,
  artworkUrl100:
    t.cover_url ||
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80",
  previewUrl: t.audio_url,
  trackTimeMillis: t.duration_seconds ? t.duration_seconds * 1000 : 180000,
});

export interface MusicsControlProps {
  selectedTrack: MusicTrack | null;
  musicStartTime: number;
  onTrackChange: (track: MusicTrack | null) => void;
  onStartTimeChange: (startTime: number) => void;
}

export default function MusicsControl({
  selectedTrack,
  musicStartTime,
  onTrackChange,
  onStartTimeChange,
}: MusicsControlProps) {
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [musicPanelStep, setMusicPanelStep] = useState<"pick" | "trim">("pick");
  const [musicQuery, setMusicQuery] = useState("");
  const [musicResults, setMusicResults] = useState<MusicTrack[]>([]);
  const [isMusicLoading, setIsMusicLoading] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const musicSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trackDurationSecs = selectedTrack?.trackTimeMillis
    ? selectedTrack.trackTimeMillis / 1000
    : 180;

  const musicEndTime = musicStartTime + CLIP_DURATION;

  const loadTrendingTracks = useCallback(async () => {
    setIsMusicLoading(true);
    try {
      const data = await storyService.getTrendingMusic(15);
      if (Array.isArray(data) && data.length > 0) {
        setMusicResults(data.map(mapBackendToTrack));
      } else {
        setMusicResults([]);
      }
    } catch (e) {
      console.error("Failed to load trending music from backend:", e);
      setMusicResults([]);
    } finally {
      setIsMusicLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showMusicPanel && !musicQuery.trim()) {
      loadTrendingTracks();
    }
  }, [showMusicPanel, musicQuery, loadTrendingTracks]);

  const searchMusic = async (query: string) => {
    if (!query.trim()) {
      loadTrendingTracks();
      return;
    }
    setIsMusicLoading(true);
    try {
      const data = await storyService.searchMusic(query, 15);
      if (Array.isArray(data)) {
        setMusicResults(data.map(mapBackendToTrack));
      } else {
        setMusicResults([]);
      }
    } catch (err) {
      console.error("Music search error:", err);
      setMusicResults([]);
    } finally {
      setIsMusicLoading(false);
    }
  };

  const handleMusicQueryChange = (val: string) => {
    setMusicQuery(val);
    if (musicSearchTimer.current) clearTimeout(musicSearchTimer.current);
    musicSearchTimer.current = setTimeout(() => searchMusic(val), 400);
  };

  const handleUseTrack = (track: MusicTrack) => {
    onTrackChange(track);
    onStartTimeChange(0);
    setMusicPanelStep("trim");
  };

  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartTimeRef.current = musicStartTime;
    e.preventDefault();
  };

  const handleTimelineTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.touches[0].clientX;
    dragStartTimeRef.current = musicStartTime;
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const deltaRatio = (e.clientX - dragStartXRef.current) / rect.width;
      const newStart = Math.max(
        0,
        Math.min(
          trackDurationSecs - CLIP_DURATION,
          dragStartTimeRef.current + deltaRatio * trackDurationSecs
        )
      );
      onStartTimeChange(newStart);
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const deltaRatio = (e.touches[0].clientX - dragStartXRef.current) / rect.width;
      const newStart = Math.max(
        0,
        Math.min(
          trackDurationSecs - CLIP_DURATION,
          dragStartTimeRef.current + deltaRatio * trackDurationSecs
        )
      );
      onStartTimeChange(newStart);
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [trackDurationSecs, onStartTimeChange]);

  const quickJumps = (() => {
    const j: number[] = [];
    for (let t = 0; t <= trackDurationSecs - CLIP_DURATION; t += 30) j.push(t);
    return j.slice(0, 8);
  })();

  const handlePreviewClip = () => {
    if (isPreviewPlaying) {
      previewAudioRef.current?.pause();
      setIsPreviewPlaying(false);
      return;
    }
    if (!selectedTrack?.previewUrl) {
      alert("No preview available for this track.");
      return;
    }
    const audio = new Audio(selectedTrack.previewUrl);
    previewAudioRef.current = audio;
    audio.play().catch(() => setIsPreviewPlaying(false));
    setIsPreviewPlaying(true);
    setTimeout(() => {
      audio.pause();
      setIsPreviewPlaying(false);
    }, Math.min(CLIP_DURATION * 1000, 30000));
    audio.onended = () => setIsPreviewPlaying(false);
  };

  const handleUseClip = () => {
    setShowMusicPanel(false);
    setMusicPanelStep("pick");
  };

  const handleClearMusic = () => {
    onTrackChange(null);
    onStartTimeChange(0);
    setMusicQuery("");
    previewAudioRef.current?.pause();
    setIsPreviewPlaying(false);
  };

  useEffect(() => {
    return () => {
      previewAudioRef.current?.pause();
    };
  }, []);

  return (
    <>
      {/* ─── Audio Track Card / Selector Button ─── */}
      <div className="flex flex-col gap-1">
        <label className="text-[12px] font-bold text-gray-700 flex items-center gap-1">
          <Music size={12} className="text-orange-600" />
          <span>Audio Track</span>
        </label>

        {selectedTrack ? (
          <div className="flex items-center gap-2 bg-white border border-orange-200 rounded-xl px-2.5 py-1.5 shadow-xs">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-orange-100 relative">
              <img
                src={selectedTrack.artworkUrl100}
                alt={selectedTrack.trackName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-extrabold text-gray-800 truncate leading-tight">
                🎵 {selectedTrack.trackName}
              </p>
              <p className="text-[9px] text-orange-600 font-semibold truncate">
                {formatTime(musicStartTime)} → {formatTime(musicEndTime)} · 60s clip
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowMusicPanel(true);
                  setMusicPanelStep("trim");
                }}
                className="text-[9px] font-bold text-orange-600 hover:text-orange-800 bg-orange-50 hover:bg-orange-100 px-1.5 py-0.5 rounded-md transition-all cursor-pointer whitespace-nowrap"
                title="Edit timing"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleClearMusic}
                className="w-4 h-4 rounded-full bg-red-100 text-red-500 hover:bg-red-200 flex items-center justify-center transition-all cursor-pointer"
                title="Remove music"
              >
                <X size={9} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setShowMusicPanel(true);
              setMusicPanelStep("pick");
            }}
            className="h-8 sm:h-9 w-full flex items-center gap-2 pl-3 pr-3 rounded-xl bg-white border border-transparent outline-none text-xs transition-all shadow-xs hover:border-[#ef8b54] hover:bg-orange-50/40 text-gray-500 hover:text-orange-700 cursor-pointer"
          >
            <Music size={13} className="text-orange-400 shrink-0" />
            <span className="flex-1 text-left text-[11px]">Pick background music…</span>
            <Search size={13} className="text-gray-400 shrink-0" />
          </button>
        )}
      </div>

      {/* ─── Music Picker & Clip Trimmer Modal ─── */}
      {showMusicPanel && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMusicPanel(false);
          }}
        >
          <div className="w-full max-w-md bg-white rounded-t-[28px] sm:rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200 max-h-[85vh]">
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                {musicPanelStep === "trim" && (
                  <button
                    type="button"
                    onClick={() => setMusicPanelStep("pick")}
                    className="w-7 h-7 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-100 transition-all cursor-pointer"
                    aria-label="Back to songs"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}
                <div>
                  <h2 className="text-sm font-extrabold text-gray-900 leading-tight">
                    {musicPanelStep === "pick" ? "🎵 Pick a Song" : "✂️ Trim Your Clip"}
                  </h2>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {musicPanelStep === "pick"
                      ? "Tamil favourites · Live trending hits · Database tracks"
                      : "Drag the orange window · 60 seconds will play"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMusicPanel(false)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-all cursor-pointer"
                aria-label="Close music panel"
              >
                <X size={15} />
              </button>
            </div>

            {musicPanelStep === "pick" && (
              <>
                <div className="px-4 py-2.5 border-b border-gray-100 shrink-0">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={musicQuery}
                      onChange={(e) => handleMusicQueryChange(e.target.value)}
                      placeholder="Search Tamil & global music in real time…"
                      className="w-full h-9 pl-8 pr-3 rounded-xl bg-gray-50 border border-gray-200 outline-none text-xs text-gray-800 placeholder:text-gray-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-300/30 transition-all"
                      autoFocus
                    />
                    {isMusicLoading && (
                      <Loader2
                        size={13}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-400 animate-spin"
                      />
                    )}
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 px-2 py-2">
                  {musicResults.length === 0 && !isMusicLoading && (
                    <div className="py-8 text-center text-gray-400 text-xs">
                      No tracks found. Try a different search.
                    </div>
                  )}
                  {musicResults.map((track) => {
                    const durationSec = track.trackTimeMillis
                      ? Math.floor(track.trackTimeMillis / 1000)
                      : null;
                    return (
                      <div
                        key={track.trackId}
                        className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-orange-50/60 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-orange-100 to-orange-200 relative shadow-xs">
                          <img
                            src={track.artworkUrl100}
                            alt={track.trackName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <Music
                              size={12}
                              className="text-white opacity-0 group-hover:opacity-100 transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate leading-tight">
                            {track.trackName}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {track.artistName}
                            {durationSec ? ` · ${formatTime(durationSec)}` : ""}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUseTrack(track)}
                          className="shrink-0 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-[10px] font-extrabold rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          Use
                          <ChevronRight size={11} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="px-4 py-2.5 border-t border-gray-100 shrink-0">
                  <p className="text-[9px] text-gray-400 text-center">
                    Powered by TalkTamila Dynamic Music Engine · Live library &amp; database sync
                  </p>
                </div>
              </>
            )}

            {musicPanelStep === "trim" && selectedTrack && (
              <div className="flex flex-col gap-0 flex-1 overflow-y-auto">
                <div className="flex items-center gap-3 px-4 py-3 bg-orange-50/60 border-b border-orange-100 shrink-0">
                  <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm bg-orange-100 relative">
                    <img
                      src={selectedTrack.artworkUrl100}
                      alt={selectedTrack.trackName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-gray-900 truncate">
                      {selectedTrack.trackName}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {selectedTrack.artistName}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-bold text-orange-600">60s clip</p>
                    <p className="text-[9px] text-gray-400">
                      {formatTime(musicStartTime)} → {formatTime(musicEndTime)}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-4 flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-gray-700">Timeline</span>
                      <span className="text-[10px] text-gray-400">
                        Total: {formatTime(trackDurationSecs)}
                      </span>
                    </div>

                    <div
                      ref={timelineRef}
                      className="relative h-14 bg-gray-100 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-gray-200"
                      onMouseDown={handleTimelineMouseDown}
                      onTouchStart={handleTimelineTouchStart}
                    >
                      <div className="absolute inset-0 flex items-center gap-px px-1 pointer-events-none">
                        {Array.from({ length: 80 }).map((_, i) => {
                          const h =
                            20 +
                            Math.sin(i * 0.7) * 15 +
                            Math.sin(i * 1.3) * 10 +
                            Math.random() * 8;
                          const inWindow =
                            (i / 80) * trackDurationSecs >= musicStartTime &&
                            (i / 80) * trackDurationSecs < musicStartTime + CLIP_DURATION;
                          return (
                            <div
                              key={i}
                              className={`flex-1 rounded-full transition-colors duration-100 ${
                                inWindow ? "bg-orange-400" : "bg-gray-300"
                              }`}
                              style={{ height: `${Math.max(4, Math.min(44, h))}%` }}
                            />
                          );
                        })}
                      </div>

                      <div
                        className="absolute top-0 bottom-0 bg-orange-400/25 border-x-2 border-orange-500 pointer-events-none"
                        style={{
                          left: `${(musicStartTime / trackDurationSecs) * 100}%`,
                          width: `${
                            (Math.min(CLIP_DURATION, trackDurationSecs - musicStartTime) /
                              trackDurationSecs) *
                            100
                          }%`,
                        }}
                      >
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-7 bg-orange-500 rounded-full shadow-md flex items-center justify-center">
                          <div className="w-0.5 h-3 bg-white/80 rounded-full" />
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-7 bg-orange-500 rounded-full shadow-md flex items-center justify-center">
                          <div className="w-0.5 h-3 bg-white/80 rounded-full" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[9px] font-extrabold text-orange-700 bg-white/80 px-1.5 py-0.5 rounded-full shadow-xs">
                            {formatTime(musicStartTime)} – {formatTime(musicEndTime)}
                          </span>
                        </div>
                      </div>

                      <div className="absolute bottom-1 left-1.5 text-[8px] text-gray-400 font-bold pointer-events-none">
                        0:00
                      </div>
                      <div className="absolute bottom-1 right-1.5 text-[8px] text-gray-400 font-bold pointer-events-none">
                        {formatTime(trackDurationSecs)}
                      </div>
                    </div>

                    <p className="text-[9px] text-gray-400 mt-1.5 text-center">
                      Drag the orange window to position your 60-second clip
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold text-gray-700 mb-1.5">⚡ Quick Jump</p>
                    <div className="flex flex-wrap gap-1.5">
                      {quickJumps.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => onStartTimeChange(t)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            Math.abs(musicStartTime - t) < 1
                              ? "bg-orange-500 text-white shadow-xs"
                              : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700"
                          }`}
                        >
                          {formatTime(t)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handlePreviewClip}
                      className={`flex-1 h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                        isPreviewPlaying
                          ? "bg-orange-100 border-orange-300 text-orange-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700"
                      }`}
                    >
                      {isPreviewPlaying ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                          Stop Preview
                        </>
                      ) : (
                        <>▶ Preview Clip</>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleUseClip}
                      className="flex-1 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-orange-200"
                    >
                      <CheckCircle2 size={14} />
                      Use This Clip
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
