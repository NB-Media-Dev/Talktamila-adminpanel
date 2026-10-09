"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Music, Pause, Play } from "lucide-react";
import type { PostMusic } from "@/types/Posts";

// Only one song plays at a time across the whole page.
let stopActive: (() => void) | null = null;

interface PostMusicPlayerProps {
  music: PostMusic;
  /** Smaller pill for tight places */
  compact?: boolean;
}

/** The song of a post: tap to play the chosen clip (it loops), tap again to pause. */
export default function PostMusicPlayer({ music, compact = false }: PostMusicPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startRef = useRef(0);

  const stop = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
    if (stopActive === stop) stopActive = null;
  }, []);

  // A different song (after an edit) starts fresh.
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audioRef.current = null;
      }
      if (stopActive === stop) stopActive = null;
    };
  }, [music.audio_url, stop]);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playing) {
      stop();
      return;
    }
    if (stopActive && stopActive !== stop) stopActive();

    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio(music.audio_url);
      audio.preload = "auto";
      const wanted = Math.max(0, music.start_time || 0);
      const a = audio;
      a.addEventListener("loadedmetadata", () => {
        // If the saved start is past the end of this file, play from the beginning.
        startRef.current = wanted < (a.duration || 0) - 1 ? wanted : 0;
        if (startRef.current > 0) a.currentTime = startRef.current;
      });
      a.addEventListener("timeupdate", () => {
        const end = Math.min(startRef.current + (music.duration || 30), a.duration || Infinity);
        if (a.currentTime >= end - 0.15) a.currentTime = startRef.current;
      });
      a.addEventListener("ended", () => {
        a.currentTime = startRef.current;
        a.play().catch(() => setPlaying(false));
      });
      a.addEventListener("error", () => {
        setFailed(true);
        setPlaying(false);
      });
      audioRef.current = a;
    }
    setFailed(false);
    audio
      .play()
      .then(() => {
        setPlaying(true);
        stopActive = stop;
      })
      .catch(() => {
        setFailed(true);
        setPlaying(false);
      });
  };

  const label = music.artist ? `${music.title} · ${music.artist}` : music.title;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? `Pause ${music.title}` : `Play ${music.title}`}
      title={failed ? "This song can't be played right now" : label}
      className={`group inline-flex max-w-full items-center gap-2 rounded-full border border-[#FFEFE0] bg-[#FFF6ED] text-[#9b4811] hover:bg-[#FFEFE0] transition-colors cursor-pointer ${
        compact ? "pl-1 pr-2.5 py-0.5" : "pl-1 pr-3 py-1"
      }`}
    >
      <span
        className={`relative shrink-0 rounded-full overflow-hidden bg-[#FCE3CC] flex items-center justify-center ${
          compact ? "w-5 h-5" : "w-6 h-6"
        }`}
      >
        {music.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={music.cover_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        <Music className="w-3 h-3 text-[#E05D24]" />
      </span>
      <span className={`truncate font-semibold ${compact ? "text-[10px]" : "text-[11px]"}`}>
        {failed ? "Song unavailable" : label}
      </span>
      {playing ? (
        <span className="flex items-end gap-[2px] h-3 shrink-0" aria-hidden>
          <span className="w-[2px] h-3 bg-[#E05D24] animate-pulse" />
          <span className="w-[2px] h-2 bg-[#E05D24] animate-pulse [animation-delay:150ms]" />
          <span className="w-[2px] h-3 bg-[#E05D24] animate-pulse [animation-delay:300ms]" />
        </span>
      ) : null}
      {playing ? (
        <Pause className="w-3 h-3 shrink-0 fill-current" />
      ) : (
        <Play className="w-3 h-3 shrink-0 fill-current" />
      )}
    </button>
  );
}