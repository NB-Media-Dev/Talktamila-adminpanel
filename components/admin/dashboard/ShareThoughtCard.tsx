"use client";

import { buttonVariants } from "@/components/ui/Button";
import { islandMoments } from "@/public/Fonts/Fonts";
import { Pencil, Image as ImageIcon, Video } from "lucide-react";

export default function ShareThoughtCard() {
  return (
    <div className={`@container w-full max-w-[24rem] mx-auto select-none p-0.5 sm:p-1 ${islandMoments.variable}`}>
      <div className="relative w-full">

        <div className="relative w-full h-[178px] sm:h-auto sm:aspect-[340/230] sm:min-h-[14.5rem] flex flex-col justify-between">

          <svg
            viewBox="0 0 340 230"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            preserveAspectRatio="none"
          >
            <path
              d="
                M 24 0
                H 196
                C 216 0 232 12 232 30
                C 232 64 256 84 288 84
                H 312
                C 328 84 340 96 340 110
                V 206
                C 340 219 329 230 316 230
                H 24
                C 11 230 0 219 0 206
                V 24
                C 0 11 11 0 24 0
                Z
              "
              fill="#FFFFFF"
            />
          </svg>

          <div
            className="absolute top-0 right-0 w-14 h-14 sm:w-20 sm:h-20 rounded-full pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #EE7233 0%, #F58D4E 45%, rgba(245,141,78,0.55) 65%, rgba(253,241,231,0) 85%)",
              filter: "blur(6px)",
            }}
          />

          <button
            type="button"
            className="
              absolute top-2 right-2 sm:top-4 sm:right-4 
              w-7 h-7 sm:w-11 sm:h-11 
              flex items-center justify-center 
              text-white cursor-pointer z-20 
              transition-transform duration-200 
              active:scale-90 hover:scale-110
            "
            title="Edit thought"
            aria-label="Edit thought"
          >
            <Pencil
              className="w-3.5 h-3.5 sm:w-5.5 sm:h-5.5 text-white transform -rotate-12 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.25)]"
              strokeWidth={2.4}
            />
          </button>

          <div className="relative z-10 pt-3 sm:pt-5 px-3.5 sm:px-6 pb-0.5 sm:pb-1">
            <span className="text-[11px] sm:text-[14px] font-sans text-[#8E8E93] block mb-0 sm:mb-0.5 tracking-normal font-medium">
              Share Your
            </span>

            <h2
              className="text-[28px] sm:text-[44px] font-normal leading-[0.9] sm:leading-[0.92] text-[#E05D24] tracking-normal"
              style={{ fontFamily: "var(--font-island-moments), cursive" }}
            >
              Thoughts...
            </h2>

            <p className="text-[11px] sm:text-[14px] text-[#3A3A3C] font-sans font-normal mt-1 sm:mt-4 truncate">
              New Thought Incoming...
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-between px-3.5 sm:px-6 pt-1 sm:pt-2 pb-3 sm:pb-4 mt-auto">

            <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-5 text-[#8E8E93]">
              <button
                type="button"
                className={`hover:${buttonVariants({ variant: 'hovericon' })} p-0.5`}
                title="Add Image"
                aria-label="Add Image"
              >
                <ImageIcon className="w-[17px] h-[17px] sm:w-[22px] sm:h-[22px]" strokeWidth={1.8} />
              </button>

              <button
                type="button"
                className={`hover:${buttonVariants({ variant: 'hovericon' })} p-0.5`}
                title="Add Video"
                aria-label="Add Video"
              >
                <Video className="w-[17px] h-[17px] sm:w-[22px] sm:h-[22px]" strokeWidth={1.8} />
              </button>

              <button
                type="button"
                className={`hover:${buttonVariants({ variant: 'hovericon' })} p-0.5`}
                title="Create Poll"
                aria-label="Create Poll"
              >
                <svg
                  className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <line x1="6" y1="20" x2="6" y2="12" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="18" y1="20" x2="18" y2="15" />
                </svg>
              </button>

              <button
                type="button"
                className={`hover:${buttonVariants({ variant: 'hovericon' })} p-0.5`}
                title="Add Emoji"
                aria-label="Add Emoji"
              >
                <svg
                  className="w-[17px] h-[17px] sm:w-[22px] sm:h-[22px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 13.5c0 2.2 1.8 4 4 4s4-1.8 4-4H8z" fill="currentColor" />
                </svg>
              </button>
            </div>

            <button
              type="button"
              className={`
               ${buttonVariants({ variant: "default" })}
                text-white
                text-[12px] sm:text-[15px]
                font-bold
                ml-1 sm:ml-3
                px-3 sm:px-4
                py-1 sm:py-2 
                rounded-full
                shadow-[0_4px_12px_rgba(240,90,36,0.35)]
                transition-all
                active:scale-95
                cursor-pointer
                whitespace-nowrap
              `}
            >
              Post
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}