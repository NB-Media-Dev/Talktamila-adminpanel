"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Instagram-style picture frame: it follows the first picture's own shape, but is never
// taller than 4:5 and never wider than 1.91:1. Every slide uses the same frame.
const MIN_RATIO = 4 / 5;
const MAX_RATIO = 1.91;

function clampRatio(width: number, height: number): number {
  if (!width || !height) return 1;
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, width / height));
}

interface PostCarouselProps {
  /** Full picture addresses, in slide order. */
  urls: string[];
  alt?: string;
  className?: string;
}

/**
 * Swipe through several pictures of one post.
 * - Touch / trackpad: swipe sideways (the slides snap into place).
 * - Mouse: the arrow buttons. Keyboard: left and right arrow keys.
 * - A "2/5" counter and dots show where you are.
 * Double-clicking a slide bubbles up, so the post card's double-tap like still works.
 */
export default function PostCarousel({ urls, alt = "Post picture", className = "" }: PostCarouselProps) {
  const scroller = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [ratio, setRatio] = useState(1);

  const count = urls.length;
  const signature = urls.join("|");

  // A different set of pictures starts again from the first slide.
  useEffect(() => {
    setIndex(0);
    scroller.current?.scrollTo({ left: 0 });
  }, [signature]);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    []
  );

  const onScroll = () => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const el = scroller.current;
      if (!el || !el.clientWidth) return;
      const next = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(Math.min(count - 1, Math.max(0, next)));
    });
  };

  const goTo = useCallback(
    (target: number) => {
      const el = scroller.current;
      if (!el) return;
      const clamped = Math.min(count - 1, Math.max(0, target));
      el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
      setIndex(clamped);
    },
    [count]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  if (count === 0) return null;

  return (
    <div
      className={`relative group w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-gray-900/5 ${className}`}
      style={{ aspectRatio: ratio }}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${alt}, ${index + 1} of ${count}`}
    >
      <div
        ref={scroller}
        onScroll={onScroll}
        onKeyDown={onKeyDown}
        tabIndex={0}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory focus:outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ overscrollBehaviorX: "contain" }}
      >
        {urls.map((url, i) => (
          <div key={`${url}-${i}`} className="relative w-full h-full shrink-0 snap-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${alt} ${i + 1} of ${count}`}
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
              onLoad={
                i === 0 ? (e) => setRatio(clampRatio(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)) : undefined
              }
              className="w-full h-full object-cover select-none"
            />
          </div>
        ))}
      </div>

      {/* 2/5 counter */}
      <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-bold text-white select-none pointer-events-none">
        {index + 1}/{count}
      </span>

      {/* arrows (hover on desktop, always reachable by keyboard) */}
      {index > 0 && (
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous picture"
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 text-gray-800 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {index < count - 1 && (
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next picture"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 text-gray-800 shadow flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* dots */}
      <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
        {urls.map((_, i) => (
          <span
            key={i}
            className={`rounded-full transition-all ${
              i === index ? "w-2 h-2 bg-[#ef8b54]" : "w-1.5 h-1.5 bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}