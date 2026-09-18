"use client";

import  { useState, useEffect, useCallback} from "react";
import Image from "next/image";
import type {
  StorySlide,
  StoryUser,
  PreviewStoriesProps,
} from "@/types/Stories";
import { StoryViewer } from "./StoryViewer";

export type { StorySlide, StoryUser };

export default function PreviewStories({
  stories,
  initialUserIndex = 0,
  onClose,
  onStoryDeleted,
}: PreviewStoriesProps) {
  const [userIndex, setUserIndex] = useState(initialUserIndex);

  useEffect(() => {
    setUserIndex(initialUserIndex);
  }, [initialUserIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const goNext = useCallback(() => {
    if (userIndex < stories.length - 1) setUserIndex((i) => i + 1);
    else onClose();
  }, [userIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (userIndex > 0) setUserIndex((i) => i - 1);
  }, [userIndex]);

  if (!stories.length) return null;

  const currentUser = stories[userIndex] || stories[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >

      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40 overflow-x-auto max-w-[90vw] no-scrollbar px-2">
        {stories.map((u, idx) => (
          <button
            key={u.id}
            onClick={() => setUserIndex(idx)}
            className={`flex flex-col items-center gap-0.5 shrink-0 transition-all cursor-pointer ${
              idx === userIndex ? "scale-110" : "opacity-60 hover:opacity-90"
            }`}
            aria-label={`View ${u.userName}'s story`}
          >
            <div
              className={`p-[2px] rounded-full ${
                idx === userIndex ? "bg-gradient-to-tr from-[#FF4B2B] via-[#FF416C] to-[#FF6B35]" : "bg-white/30"
              }`}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden relative bg-gray-100 flex items-center justify-center">
                {u.avatar ? (
                  typeof u.avatar === "string" ? (
                    <img src={u.avatar} alt={u.userName} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={u.avatar} alt={u.userName} fill className="object-cover" />
                  )
                ) : (
                  <span className="text-white text-xs font-bold bg-orange-500 w-full h-full flex items-center justify-center">
                    {u.userName ? u.userName.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[8px] text-white/80 font-medium max-w-[36px] truncate">
              {u.is_my_story ? "You" : u.userName}
            </span>
          </button>
        ))}
      </div>

    
      <div className="relative w-full max-w-sm sm:max-w-md mt-12">
        <StoryViewer
          key={userIndex}
          user={currentUser}
          onNext={goNext}
          onPrev={goPrev}
          onClose={onClose}
          onStoryDeleted={onStoryDeleted}
          hasPrev={userIndex > 0}
          hasNext={userIndex < stories.length - 1}
        />
      </div>
    </div>
  );
}