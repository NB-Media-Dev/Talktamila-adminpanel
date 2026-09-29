"use client";

import { useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/Button";

type Variant = "mobile" | "desktop" | "login" | "splash";

const STYLES: Record<Variant, { wrap: string; talk: string; tamila: string; dot: string; dotInner: string }> = {
  mobile: {
    wrap: "flex items-center gap-0.5 select-none shrink-0",
    talk: "text-sm xs:text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight",
    tamila: "text-sm xs:text-base sm:text-lg font-bold text-[#FF6B35] tracking-tight flex items-center gap-0.5",
    dot: "w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 gap-[1px] ml-0.5",
    dotInner: "w-[1.5px] h-[1.5px] xs:w-[2px] xs:h-[2px] sm:w-[2.5px] sm:h-[2.5px]",
  },
  desktop: {
    wrap: "flex items-center gap-1 shrink-0 select-none",
    talk: "text-lg md:text-xl font-bold text-black tracking-tight",
    tamila: "text-lg md:text-xl font-bold text-brand tracking-tight flex items-center gap-1.5",
    dot: "w-4 h-4 md:w-5 md:h-5 gap-0.5",
    dotInner: "w-1 h-1",
  },
  login: {
    wrap: "flex items-center gap-0.5 select-none shrink-0",
    talk: "text-md sm:text-lg font-bold text-[#1A1A1A] tracking-tight",
    tamila: "text-base sm:text-lg font-bold text-[#FF6B35] tracking-tight flex items-center gap-0.5",
    dot: "w-3.5 h-3.5 sm:w-4 sm:h-4 gap-[1px] ml-0.5",
    dotInner: "w-[2px] h-[2px] sm:w-[2.5px] sm:h-[2.5px]",
  },
  splash: {
    wrap: "flex items-center gap-2 select-none",
    talk: "tt-intro-talk text-5xl sm:text-6xl font-extrabold text-[#1A1A1A] tracking-tight",
    tamila: "tt-intro-tamila text-5xl sm:text-6xl font-extrabold text-[#FF6B35] tracking-tight flex items-center gap-3",
    dot: "tt-intro-dot w-8 h-8 sm:w-10 sm:h-10 gap-1",
    dotInner: "w-1.5 h-1.5 sm:w-2 sm:h-2",
  },
};

const ANIMATIONS = ["tt-anim-quake", "tt-anim-flip", "tt-anim-jelly"] as const;

/**
 * The Talk Tamila wordmark. Tap/click it and one of three animations plays at random
 * (earthquake shake then fall, bounce + flip, rainbow jelly) - never the same one twice in a row.
 */
export default function AnimatedLogo({
  variant,
  interactive = true,
}: {
  variant: Variant;
  interactive?: boolean;
}) {
  const s = STYLES[variant];
  const [anim, setAnim] = useState<string | null>(null);
  const lastRef = useRef<string | null>(null);

  const play = () => {
    if (anim) return; // let the current one finish
    const pool = ANIMATIONS.filter((a) => a !== lastRef.current);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    lastRef.current = pick;
    setAnim(pick);
  };

  const interactiveProps = interactive
    ? {
        role: "button" as const,
        tabIndex: 0,
        "aria-label": "Talk Tamila",
        onClick: play,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            play();
          }
        },
      }
    : {};

  return (
    <div
      {...interactiveProps}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setAnim(null);
      }}
      className={`tt-logo ${interactive ? "tt-logo-clickable" : ""} ${anim ?? ""} ${s.wrap}`}
    >
      <span className={s.talk}>Talk</span>
      <span className={s.tamila}>
        Tamila
        <span
          className={`${s.dot} rounded-full ${buttonVariants({ variant: "default" })} flex items-center justify-center shrink-0 shadow-xs`}
        >
          <span className={`${s.dotInner} rounded-full bg-white inline-block`} />
          <span className={`${s.dotInner} rounded-full bg-white inline-block`} />
        </span>
      </span>
    </div>
  );
}
