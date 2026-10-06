"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import type { EmojiClickData } from "emoji-picker-react";
import { Image as ImageIcon, Loader2, Plus, Search, Video, X } from "lucide-react";
import { notifyPostsChanged, postService } from "@/services/post.service";
import { useAuthuser } from "@/hooks/useAuthuser";
import { getInitials, initialsAvatar } from "@/lib/avatar";
import { POST_LIMITS, type PostType } from "@/types/Posts";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] flex items-center justify-center text-xs text-[#8E8E93]">Loading emojis…</div>
  ),
});

export type ComposerMode = PostType;

const TITLES: Record<ComposerMode, string> = {
  text: "Share your thoughts",
  image: "Share a photo",
  video: "Share a video",
  poll: "Create a poll",
  gif: "Share a GIF",
};

const PLACEHOLDERS: Record<ComposerMode, string> = {
  text: "What's on your mind?",
  image: "Add a caption (optional)",
  video: "Add a caption (optional)",
  poll: "Ask a question…",
  gif: "Add a caption (optional)",
};

const GIPHY_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;

interface AuthLike {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  username?: string;
  avatar_url?: string | null;
}

interface GiphyItem {
  id: string;
  title: string;
  images: { fixed_height: { url: string }; original: { url: string } };
}

function isAllowedGifLink(raw: string): boolean {
  try {
    const u = new URL(raw.trim());
    return (
      u.protocol === "https:" &&
      /(^|\.)(giphy\.com|tenor\.com)$/i.test(u.hostname) &&
      /\.(gif|webp)$/i.test(u.pathname)
    );
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ GIF panel */
function GifPanel({ onPick }: { onPick: (url: string) => void }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<GiphyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(Boolean(GIPHY_KEY));
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (!GIPHY_KEY) return;
    let cancelled = false;
    const timer = setTimeout(
      async () => {
        setLoading(true);
        try {
          const term = query.trim();
          const url = term
            ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(term)}&limit=24&rating=g`
            : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&limit=24&rating=g`;
          const res = await fetch(url);
          if (!res.ok) throw new Error("GIF search failed");
          const json = await res.json();
          if (!cancelled) {
            setItems(json.data || []);
            setError(null);
          }
        } catch {
          if (!cancelled) setError("Could not load GIFs. Check your connection or the Giphy key.");
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      query ? 350 : 0
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return (
    <div className="flex flex-col gap-2.5 p-3">
      {GIPHY_KEY ? (
        <>
          <div className="flex items-center gap-2 bg-[#FFF6ED] border border-[#FFEFE0] rounded-full px-3 py-2">
            <Search className="w-4 h-4 text-[#8E8E93] shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search GIFs"
              className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 placeholder:text-[#8E8E93]"
            />
          </div>
          <div className="h-[240px] overflow-y-auto">
            {loading && (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[#FF6B35]" />
              </div>
            )}
            {!loading && error && <p className="text-xs text-red-500 text-center pt-8">{error}</p>}
            {!loading && !error && items.length === 0 && (
              <p className="text-xs text-[#8E8E93] text-center pt-8">No GIFs found.</p>
            )}
            {!loading && !error && items.length > 0 && (
              <div className="columns-2 gap-2">
                {items.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onPick(g.images.original.url)}
                    className="mb-2 w-full block rounded-xl overflow-hidden border border-[#FFEFE0] hover:border-[#FF6B35] cursor-pointer"
                    title={g.title}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.images.fixed_height.url} alt={g.title || "GIF"} loading="lazy" className="w-full h-auto block" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-[10px] text-[#8E8E93] text-right">Powered by GIPHY</p>
        </>
      ) : (
        <div className="flex flex-col gap-2 py-2">
          <p className="text-xs text-[#8E8E93]">
            GIF search is off. Paste a direct GIF link from Giphy or Tenor (it must end in .gif or .webp), or add
            NEXT_PUBLIC_GIPHY_API_KEY to your .env.local to turn on search.
          </p>
          <div className="flex gap-2">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://media.giphy.com/media/…/giphy.gif"
              className="flex-1 min-w-0 border border-[#FFEFE0] bg-[#FFF6ED] rounded-full px-3 py-2 text-[13px] outline-none focus:border-[#FF6B35]"
            />
            <button
              type="button"
              disabled={!isAllowedGifLink(link)}
              onClick={() => onPick(link.trim())}
              className="px-4 py-2 rounded-full text-[13px] font-bold text-white bg-[linear-gradient(135deg,#E6703A,#FFA663)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Use
            </button>
          </div>
          {link && !isAllowedGifLink(link) && (
            <p className="text-[11px] text-red-500">Only https links to .gif / .webp files on giphy.com or tenor.com work.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------- composer */
interface PostComposerProps {
  mode: ComposerMode;
  openEmoji?: boolean;
  onClose: () => void;
}

export default function PostComposer({ mode: initialMode, openEmoji = false, onClose }: PostComposerProps) {
  const { user } = useAuthuser();
  const me = ((user as unknown as { user?: AuthLike } | null)?.user ?? user) as AuthLike | null;
  const displayName =
    me?.full_name || [me?.first_name, me?.last_name].filter(Boolean).join(" ") || me?.username || "You";
  const avatarSrc =
    me?.avatar_url ||
    initialsAvatar(getInitials({ firstName: me?.first_name, lastName: me?.last_name, username: me?.username }));

  const [mode, setMode] = useState<ComposerMode>(initialMode);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gifUrl, setGifUrl] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [panel, setPanel] = useState<"emoji" | "gif" | null>(openEmoji ? "emoji" : null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<string | null>(null);
  const postingRef = useRef(false);

  const canGif = mode === "text" || mode === "gif";
  const trimmed = text.trim();
  const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
  const distinctOptions = new Set(cleanOptions.map((o) => o.toLowerCase())).size === cleanOptions.length;

  const canPost = (() => {
    switch (mode) {
      case "text":
        return trimmed.length > 0;
      case "image":
      case "video":
        return file !== null;
      case "gif":
        return gifUrl !== "";
      case "poll":
        return trimmed.length > 0 && cleanOptions.length >= POST_LIMITS.pollMinOptions && distinctOptions;
    }
  })();

  const requestClose = () => {
    if (!postingRef.current) onClose();
  };

  // Close on Escape, stop the page behind from scrolling, free the preview URL on exit.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFile = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setFile(null);
    setPreviewUrl(null);
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    e.target.value = "";
    if (!picked) return;
    const isImage = mode === "image";
    const okTypes: readonly string[] = isImage ? POST_LIMITS.imageTypes : POST_LIMITS.videoTypes;
    const maxBytes = isImage ? POST_LIMITS.imageBytes : POST_LIMITS.videoBytes;
    if (!okTypes.includes(picked.type)) {
      setError(isImage ? "Please choose a JPG, PNG, WEBP or GIF image." : "Please choose an MP4, WEBM or MOV video.");
      return;
    }
    if (picked.size > maxBytes) {
      setError(`That file is too large. Maximum size is ${maxBytes / (1024 * 1024)} MB.`);
      return;
    }
    clearFile();
    const url = URL.createObjectURL(picked);
    urlRef.current = url;
    setFile(picked);
    setPreviewUrl(url);
    setError(null);
  };

  const insertEmoji = (emoji: string) => {
    const el = textRef.current;
    if (!el) {
      setText((t) => (t + emoji).slice(0, POST_LIMITS.contentLength));
      return;
    }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? start;
    const next = text.slice(0, start) + emoji + text.slice(end);
    if (next.length > POST_LIMITS.contentLength) return;
    setText(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + emoji.length;
      el.setSelectionRange(pos, pos);
    });
  };

  const pickGif = (url: string) => {
    setGifUrl(url);
    setMode("gif");
    setPanel(null);
    setError(null);
  };

  const removeGif = () => {
    setGifUrl("");
    setMode("text");
  };

  const submit = async () => {
    if (!canPost || postingRef.current) return;
    postingRef.current = true;
    setPosting(true);
    setError(null);
    try {
      await postService.create({
        postType: mode,
        content: trimmed || undefined,
        media: file ?? undefined,
        gifUrl: mode === "gif" ? gifUrl : undefined,
        pollOptions: mode === "poll" ? cleanOptions : undefined,
      });
      notifyPostsChanged();
      postingRef.current = false;
      onClose();
    } catch (e) {
      postingRef.current = false;
      setPosting(false);
      setError(e instanceof Error ? e.message : "Could not post. Please try again.");
    }
  };

  const setOption = (i: number, value: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? value : o)));

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/45 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={TITLES[mode]}
        className="w-full sm:max-w-lg max-h-[92vh] flex flex-col bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-[#FFEFE0] overflow-hidden"
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#FFEFE0]">
          <h3 className="text-[15px] font-bold text-gray-900">{TITLES[mode]}</h3>
          <button
            type="button"
            onClick={requestClose}
            disabled={posting}
            className="w-8 h-8 rounded-full bg-[#FFF6ED] text-[#E05D24] flex items-center justify-center hover:bg-[#FFEFE0] cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatarSrc} alt="" className="w-9 h-9 rounded-full object-cover border border-[#FFEFE0]" />
            <span className="text-[13px] font-bold text-gray-900">{displayName}</span>
          </div>

          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={POST_LIMITS.contentLength}
            rows={mode === "text" ? 5 : 3}
            autoFocus={mode === "text" || mode === "poll"}
            placeholder={PLACEHOLDERS[mode]}
            className="w-full resize-none outline-none text-[14px] text-gray-800 placeholder:text-[#8E8E93] leading-relaxed bg-transparent"
          />

          {/* image / video chooser + preview */}
          {(mode === "image" || mode === "video") && (
            <>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept={mode === "image" ? POST_LIMITS.imageTypes.join(",") : POST_LIMITS.videoTypes.join(",")}
                onChange={onPickFile}
              />
              {previewUrl ? (
                <div className="relative rounded-[20px] overflow-hidden border border-[#FFEFE0] bg-gray-900/5">
                  {mode === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={previewUrl} alt="Preview" className="w-full max-h-[320px] object-contain" />
                  ) : (
                    <video src={previewUrl} controls playsInline className="w-full max-h-[320px] bg-black" />
                  )}
                  <button
                    type="button"
                    onClick={clearFile}
                    disabled={posting}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
                    aria-label="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-[170px] rounded-[20px] border-2 border-dashed border-[#FFD9BF] bg-[#FFFDFB] hover:bg-[#FFF6ED] flex flex-col items-center justify-center gap-2 text-[#E05D24] cursor-pointer transition-colors"
                >
                  {mode === "image" ? <ImageIcon className="w-7 h-7" /> : <Video className="w-7 h-7" />}
                  <span className="text-[13px] font-semibold">
                    {mode === "image" ? "Choose a photo" : "Choose a video"}
                  </span>
                  <span className="text-[11px] text-[#8E8E93]">
                    {mode === "image" ? "JPG, PNG, WEBP or GIF · up to 5 MB" : "MP4, WEBM or MOV · up to 25 MB"}
                  </span>
                </button>
              )}
            </>
          )}

          {/* gif preview */}
          {mode === "gif" && gifUrl && (
            <div className="relative rounded-[20px] overflow-hidden border border-[#FFEFE0] bg-gray-900/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gifUrl} alt="Selected GIF" className="w-full max-h-[320px] object-contain" />
              <button
                type="button"
                onClick={removeGif}
                disabled={posting}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
                aria-label="Remove GIF"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* poll options */}
          {mode === "poll" && (
            <div className="flex flex-col gap-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={opt}
                    onChange={(e) => setOption(i, e.target.value)}
                    maxLength={POST_LIMITS.pollOptionLength}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 min-w-0 border border-[#FFEFE0] bg-[#FFFDFB] rounded-full px-4 py-2.5 text-[13px] outline-none focus:border-[#FF6B35]"
                  />
                  {options.length > POST_LIMITS.pollMinOptions && (
                    <button
                      type="button"
                      onClick={() => setOptions((prev) => prev.filter((_, idx) => idx !== i))}
                      className="w-8 h-8 shrink-0 rounded-full text-[#8E8E93] hover:text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer"
                      aria-label={`Remove option ${i + 1}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {options.length < POST_LIMITS.pollMaxOptions && (
                <button
                  type="button"
                  onClick={() => setOptions((prev) => [...prev, ""])}
                  className="self-start flex items-center gap-1.5 text-[13px] font-semibold text-[#E05D24] hover:underline cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add option
                </button>
              )}
              {cleanOptions.length > 1 && !distinctOptions && (
                <p className="text-[11px] text-red-500">Poll options must be different from each other.</p>
              )}
            </div>
          )}

          {error && (
            <p role="alert" className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* emoji / gif panel */}
        {panel && (
          <div className="border-t border-[#FFEFE0] bg-white">
            {canGif && (
              <div className="flex gap-1 px-3 pt-2">
                {(["emoji", "gif"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setPanel(tab)}
                    className={`px-3.5 py-1 rounded-full text-[12px] font-bold cursor-pointer ${
                      panel === tab ? "bg-[#FFEFE0] text-[#E05D24]" : "text-[#8E8E93] hover:text-[#E05D24]"
                    }`}
                  >
                    {tab === "emoji" ? "Emoji" : "GIF"}
                  </button>
                ))}
              </div>
            )}
            {panel === "emoji" ? (
              <EmojiPicker
                onEmojiClick={(e: EmojiClickData) => insertEmoji(e.emoji)}
                width="100%"
                height={320}
                lazyLoadEmojis
                previewConfig={{ showPreview: false }}
              />
            ) : (
              <GifPanel onPick={pickGif} />
            )}
          </div>
        )}

        {/* footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-[#FFEFE0]">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPanel((p) => (p === "emoji" ? null : "emoji"))}
              className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                panel === "emoji" ? "bg-[#FFEFE0] text-[#E05D24]" : "text-[#8E8E93] hover:text-[#E05D24]"
              }`}
              title="Emoji"
              aria-label="Emoji"
            >
              <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="9" />
                <path d="M8 13.5c0 2.2 1.8 4 4 4s4-1.8 4-4H8z" fill="currentColor" />
              </svg>
            </button>
            {canGif && (
              <button
                type="button"
                onClick={() => setPanel((p) => (p === "gif" ? null : "gif"))}
                className={`h-9 px-2.5 rounded-full text-[12px] font-extrabold tracking-wide cursor-pointer transition-colors ${
                  panel === "gif" ? "bg-[#FFEFE0] text-[#E05D24]" : "text-[#8E8E93] hover:text-[#E05D24]"
                }`}
                title="GIF"
                aria-label="GIF"
              >
                GIF
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {text.length > POST_LIMITS.contentLength * 0.8 && (
              <span className="text-[11px] text-[#8E8E93]">
                {text.length}/{POST_LIMITS.contentLength}
              </span>
            )}
            <button
              type="button"
              onClick={submit}
              disabled={!canPost || posting}
              className="min-w-[84px] flex items-center justify-center gap-2 px-5 py-2 rounded-full text-[14px] font-bold text-white bg-[linear-gradient(135deg,#E6703A,#FFA663)] shadow-[0_4px_12px_rgba(240,90,36,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}