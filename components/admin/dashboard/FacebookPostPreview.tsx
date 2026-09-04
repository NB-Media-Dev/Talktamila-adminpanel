"use client";

import Image, { type StaticImageData } from "next/image";
import { MoreHorizontal, Play, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { FacebookIcon } from "@/public/Svgicons/svgicons";
import avatar1 from "@/public/Images/avatar1.png";

interface FacebookPostPreviewProps {
  title?: string;
  caption?: string;
  image?: StaticImageData | string;
  isVideo?: boolean;
  formatBadge?: string;
  className?: string;
}

export function FacebookPostPreview({
  title = "it can be really easy to over indulge",
  caption = "Write your thoughts here... Use #hashtags to trend!",
  image = avatar1,
  isVideo = true,
  formatBadge,
  className = "",
}: FacebookPostPreviewProps) {
  return (
    <div className={`bg-[#F0F2F5] rounded-xl p-1.5 min-[2560px]:p-2.5 min-[3840px]:p-3  border border-gray-200/40 flex flex-col gap-1 min-[3840px]:gap-1.5 w-full max-w-[470px] lg:max-w-[340px] min-[2560px]:max-w-[320px] min-[3840px]:max-w-[380px] mx-auto overflow-hidden ${className}`}>
      <div className="flex items-center gap-1 px-0.5 select-none">
        <FacebookIcon />
        <span className="text-[9.5px] min-[2560px]:text-xs font-extrabold text-[#1c1e21] tracking-tight">Facebook</span>
      </div>

      <div className="bg-white rounded-lg border border-gray-200/60 shadow-xs p-1.5 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6.5 h-6.5 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-extrabold text-[10px] shadow-xs shrink-0 select-none">
              Y
            </div>
            <div className="flex flex-col">
              <h4 className="text-[9px] font-bold text-[#050505] flex items-center gap-0.5 leading-none select-none">
                <span>Your Business Name</span>
                <span className="w-3 h-3 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[6px] font-black shrink-0">✓</span>
              </h4>
              <span className="text-[7.5px] text-[#65676b] font-medium leading-none mt-0.5 flex items-center gap-0.5 select-none">
                <span>Sponsored ·</span> <span className="text-[8px] -mt-[1px]">🌐</span>
              </span>
            </div>
          </div>
          <button className="text-[#65676b] hover:text-[#050505] transition-colors cursor-pointer p-0.5">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[9px] text-[#050505] font-normal leading-tight whitespace-pre-wrap px-0.5 break-words line-clamp-2">
          {caption}
        </p>

        <div className="w-full aspect-[4/3] bg-slate-950 relative group border border-gray-100 rounded-md overflow-hidden">
          <Image
            src={image}
            fill
            sizes="(max-width: 768px) 100vw, 250px"
            alt="Ad Preview"
            className="w-full h-full object-cover opacity-95"
          />

          {isVideo && (
            <>
              <div className="absolute inset-x-1.5 top-1/2 -translate-y-1/2 text-center z-10 select-none">
                <p className="text-white text-[8px] font-semibold leading-tight bg-black/40 py-0.5 px-1.5 rounded-md backdrop-blur-xs max-w-[90%] mx-auto shadow-xs">
                  {title}
                </p>
              </div>

              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-xs border border-white/20 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all">
                  <Play className="w-3 h-3 text-white fill-white translate-x-[0.5px]" />
                </div>
              </div>

              <div className="absolute bottom-5 left-2 right-2 h-0.5 bg-white/30 rounded-full overflow-hidden z-10 select-none">
                <div className="w-1/3 h-full bg-white rounded-full"></div>
              </div>

              <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[7.5px] text-white select-none z-10 font-bold drop-shadow-xs">
                <div className="flex items-center gap-1.5">
                  <span className="cursor-pointer hover:text-gray-200">▶</span>
                  <span>0:00 / 0:54</span>
                </div>
                <div className="flex items-center gap-1.5 opacity-90 cursor-pointer">
                  <span>🔊</span>
                  <span>⛶</span>
                  <span>⋮</span>
                </div>
              </div>
            </>
          )}

          {!isVideo && formatBadge && (
            <div className="absolute top-1.5 left-1.5 bg-[#1877F2]/90 text-white text-[7.5px] font-extrabold py-0.5 px-1.5 rounded shadow-xs backdrop-blur-xs z-10 uppercase tracking-wide select-none">
              🖼️ {formatBadge}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-0.5 pt-0.5 select-none">
          <div className="flex items-center gap-1 text-[8px] text-[#65676b] font-medium">
            <div className="flex items-center shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#1877F2] flex items-center justify-center border border-white z-10 text-[7px] text-white">
                👍
              </div>
              <div className="w-3 h-3 rounded-full bg-[#F02849] flex items-center justify-center border border-white -ml-1 z-0 text-[7px] text-white">
                ❤️
              </div>
            </div>
            <span className="ml-0.5">20 · 1 comment</span>
          </div>

          <button className="px-2.5 py-1 bg-[#1877F2] hover:bg-[#166FE5] text-white text-[8px] font-bold rounded-md transition-colors shadow-xs cursor-pointer">
            Learn More
          </button>
        </div>

        <div className="border-t border-gray-200/80 my-0.5"></div>

        <div className="flex items-center justify-around text-[8px] text-[#65676b] font-bold select-none">
          <button type="button" className="flex items-center gap-1 hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer">
            <ThumbsUp className="w-3 h-3 text-[#65676b]" /> Like
          </button>
          <button type="button" className="flex items-center gap-1 hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer">
            <MessageCircle className="w-3 h-3 text-[#65676b]" /> Comment
          </button>
          <button type="button" className="flex items-center gap-1 hover:bg-gray-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer">
            <Share2 className="w-3 h-3 text-[#65676b]" /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
