"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bookmark, Heart, MessageCircle, Music, Send, X } from "lucide-react";
import RichText from "@/components/post/RichText";
import { getDemoPosts, type DemoPost } from "@/lib/demoPosts";
import { getInitials, initialsAvatar } from "@/lib/avatar";

interface DemoPostsProps {
  username: string;
  role?: string | null;
}

function ago(hours: number): string {
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

function Tile({ post, onOpen }: { post: DemoPost; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open post"
      className="relative aspect-square w-full overflow-hidden bg-[#FFF6ED] cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
    >
      {post.kind === "image" && post.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.imageUrl} alt={post.caption} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-[#FFF6ED] to-[#FCE3CC]">
          {post.kind === "poll" && (
            <span className="self-start rounded-full border border-[#FFEFE0] bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#E05D24]">
              Poll
            </span>
          )}
          <p className="text-[11px] sm:text-sm font-semibold text-gray-800 leading-snug line-clamp-5 break-words">{post.caption}</p>
        </div>
      )}
      {post.song && <Music className="absolute top-2 right-2 w-4 h-4 text-white drop-shadow" />}
      <span className="absolute inset-0 flex items-center justify-center gap-4 bg-black/0 group-hover:bg-black/35 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-all">
        <span className="flex items-center gap-1">
          <Heart className="w-4 h-4 fill-current" /> {post.likes.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4 fill-current" /> {post.comments.length}
        </span>
      </span>
    </button>
  );
}

/** Sample posts for roles that can't post yet. Nothing here talks to the server. */
export default function DemoPosts({ username, role }: DemoPostsProps) {
  const posts = useMemo(() => getDemoPosts(role), [role]);
  const [selected, setSelected] = useState<DemoPost | null>(null);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [selected]);

  const avatar = initialsAvatar(getInitials({ username }));

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1 p-0.5 sm:p-1">
        {posts.map((p) => (
          <Tile key={p.id} post={p} onOpen={() => setSelected(p)} />
        ))}
      </div>
      <p className="px-4 py-3 text-center text-[11px] text-gray-400">
        These are sample posts. Real posts for this account are coming soon.
      </p>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Post"
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 p-3 sm:p-6 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div className="relative w-full max-w-xl my-auto" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute -top-3 -right-1 sm:-right-3 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-[#FF6B35] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <article className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 border border-[#FFEFE0] flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-[#FFEFE0]" />
                <div>
                  <p className="font-bold text-sm text-gray-900 leading-none">@{username}</p>
                  <p className="text-[0.6875rem] text-[#8E8E93] mt-1">{ago(selected.hoursAgo)}</p>
                </div>
              </div>

              {selected.song && (
                <span className="self-start inline-flex items-center gap-1.5 rounded-full border border-[#FFEFE0] bg-[#FFF6ED] px-3 py-1 text-[11px] font-semibold text-[#9b4811]">
                  <Music className="w-3 h-3" /> {selected.song}
                </span>
              )}

              {selected.kind === "image" && selected.imageUrl && (
                <div className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.imageUrl} alt={selected.caption} className="w-full aspect-square object-cover" />
                </div>
              )}

              {selected.kind === "text" && (
                <div className="bg-[#FFFDFB] rounded-[20px] p-4 border border-[#FFEFE0] text-[0.84375rem] text-gray-800 leading-relaxed">
                  <RichText text={selected.caption} />
                </div>
              )}

              {selected.kind === "poll" && selected.pollOptions && (
                <div className="flex flex-col gap-2.5">
                  <p className="text-[0.8125rem] text-gray-800">{selected.caption}</p>
                  {selected.pollOptions.map((o) => (
                    <div key={o.text} className="relative min-h-12 rounded-full overflow-hidden border border-[#FFEFE0] flex items-center justify-between px-5 py-2">
                      <div className="absolute left-0 top-0 bottom-0 bg-[#FFF6ED]" style={{ width: `${o.pct}%` }} />
                      <span className="relative text-[0.78125rem] font-medium text-gray-800">{o.text}</span>
                      <span className="relative text-[0.78125rem] font-bold text-gray-900">{o.pct}%</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 -mx-1">
                <button
                  type="button"
                  onClick={() => setLiked((m) => ({ ...m, [selected.id]: !m[selected.id] }))}
                  aria-label="Like"
                  className="p-1.5 rounded-full hover:bg-orange-50 active:scale-90 transition-transform cursor-pointer"
                >
                  <Heart className={`w-6 h-6 ${liked[selected.id] ? "fill-red-500 text-red-500" : "text-gray-800"}`} />
                </button>
                <span className="p-1.5"><MessageCircle className="w-6 h-6 text-gray-800" /></span>
                <span className="p-1.5"><Send className="w-6 h-6 text-gray-800" /></span>
                <button
                  type="button"
                  onClick={() => setSaved((m) => ({ ...m, [selected.id]: !m[selected.id] }))}
                  aria-label="Save"
                  className="ml-auto p-1.5 rounded-full hover:bg-orange-50 cursor-pointer"
                >
                  <Bookmark className={`w-6 h-6 ${saved[selected.id] ? "fill-gray-900 text-gray-900" : "text-gray-800"}`} />
                </button>
              </div>

              <div className="flex flex-col gap-1 text-[13px] text-gray-700">
                <b className="font-bold text-gray-900">
                  {(selected.likes + (liked[selected.id] ? 1 : 0)).toLocaleString()} likes
                </b>
                {selected.kind !== "text" && selected.kind !== "poll" && (
                  <p>
                    <b className="font-bold text-gray-900 mr-1.5">{username}</b>
                    <RichText text={selected.caption} />
                  </p>
                )}
                {selected.comments.map((c, i) => (
                  <p key={i}>
                    <b className="font-bold text-gray-900 mr-1.5">{c.user}</b>
                    {c.text}
                  </p>
                ))}
              </div>
              <p className="text-[11px] text-[#8E8E93]">Sample post. Comments and sharing turn on when posting goes live.</p>
            </article>
          </div>
        </div>
      )}
    </>
  );
}