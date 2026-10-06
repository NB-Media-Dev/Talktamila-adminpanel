"use client";

import { useState } from "react";
import { Image as ImageIcon, Loader2, MessageSquare, Trash2, Video } from "lucide-react";
import { postService } from "@/services/post.service";
import { getInitials, initialsAvatar } from "@/lib/avatar";
import type { Poll, Post, PostAuthor } from "@/types/Posts";

interface PostCardProps {
  post: Post;
  author?: PostAuthor;
  onDeleted: (postId: number) => void;
  onPollUpdated: (postId: number, poll: Poll) => void;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (s < 45) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${Math.max(m, 1)}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d`;
  return new Date(then).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/** Text with #hashtags in the brand colour. Newlines are kept. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(#[\p{L}\p{M}\p{N}_]+)/gu);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-[#FF6B35] font-semibold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function TypeBadge({ type }: { type: Post["post_type"] }) {
  const base = "p-2 rounded-full transition-colors";
  switch (type) {
    case "image":
      return (
        <div className={`${base} text-[#E1306C] bg-pink-50`}>
          <ImageIcon className="w-5 h-5" />
        </div>
      );
    case "video":
      return (
        <div className={`${base} text-[#FF0000] bg-red-50`}>
          <Video className="w-5 h-5" />
        </div>
      );
    case "poll":
      return (
        <span className="bg-[#FFF6ED] text-[#E05D24] border border-[#FFEFE0] rounded-full px-2.5 py-0.5 text-[0.5625rem] font-bold tracking-wider uppercase">
          Poll
        </span>
      );
    case "gif":
      return (
        <span className="bg-[#FFF6ED] text-[#E05D24] border border-[#FFEFE0] rounded-full px-2.5 py-0.5 text-[0.5625rem] font-bold tracking-wider uppercase">
          GIF
        </span>
      );
    default:
      return (
        <div className={`${base} text-[#E05D24] bg-orange-50`}>
          <MessageSquare className="w-5 h-5 fill-current" />
        </div>
      );
  }
}

export default function PostCard({ post, author, onDeleted, onPollUpdated }: PostCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const name = author?.name || author?.username || "Unknown";
  const avatar =
    author?.avatar_url || initialsAvatar(getInitials({ name: author?.name, username: author?.username }));

  const handleDelete = async () => {
    if (deleting || !window.confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    setMessage(null);
    try {
      await postService.remove(post.post_id);
      onDeleted(post.post_id);
    } catch (e) {
      setDeleting(false);
      setMessage(e instanceof Error ? e.message : "Could not delete the post.");
    }
  };

  const handleVote = async (optionId: number) => {
    if (voting || !post.poll || post.poll.my_vote_option_id !== null) return;
    setVoting(true);
    setMessage(null);
    try {
      const poll = await postService.vote(post.post_id, optionId);
      onPollUpdated(post.post_id, poll);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not record your vote.");
    } finally {
      setVoting(false);
    }
  };

  const poll = post.poll;
  const hasVoted = poll ? poll.my_vote_option_id !== null : false;

  return (
    <article className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-3.5 xs:p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-3.5 sm:gap-4">
      {/* header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full overflow-hidden relative border border-[#FFEFE0] bg-gray-50 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt={`${name} avatar`} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-sm text-gray-900 leading-none truncate">{name}</span>
              {author?.username && (
                <span className="text-[#8E8E93] text-xs font-normal truncate">@{author.username}</span>
              )}
            </div>
            <span className="text-[0.6875rem] text-[#8E8E93] mt-0.5">{timeAgo(post.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <TypeBadge type={post.post_type} />
          {post.can_delete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              title="Delete post"
              aria-label="Delete post"
              className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* text / caption / poll question */}
      {post.content &&
        (post.post_type === "text" ? (
          <div className="bg-[#FFFDFB] rounded-[20px] p-4 border border-[#FFEFE0] text-[0.84375rem] text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            <RichText text={post.content} />
          </div>
        ) : (
          <div className="text-[0.8125rem] text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            <RichText text={post.content} />
          </div>
        ))}

      {/* media */}
      {post.post_type === "image" && post.media_url && (
        <div className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-gray-900/5 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={postService.mediaSrc(post.media_url)}
            alt="Post image"
            loading="lazy"
            className="w-full h-auto max-h-[550px] object-contain"
          />
        </div>
      )}

      {post.post_type === "video" && post.media_url && (
        <div className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-black">
          <video
            src={postService.mediaSrc(post.media_url)}
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-[480px]"
          />
        </div>
      )}

      {post.post_type === "gif" && post.gif_url && (
        <div className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-gray-900/5 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.gif_url} alt="GIF" loading="lazy" className="w-full h-auto max-h-[480px] object-contain" />
        </div>
      )}

      {/* poll */}
      {poll && (
        <div className="flex flex-col gap-2.5 my-1">
          {poll.options.map((opt) => {
            const pct = poll.total_votes > 0 ? Math.round((opt.votes / poll.total_votes) * 100) : 0;
            const selected = poll.my_vote_option_id === opt.option_id;
            const style = !hasVoted
              ? "border-[#FFEFE0] bg-white hover:border-[#FF6B35] hover:shadow-sm"
              : selected
                ? "border-[#FF6B35] bg-orange-50/10"
                : "border-[#FFEFE0] bg-gray-50/30";
            return (
              <button
                key={opt.option_id}
                type="button"
                onClick={() => handleVote(opt.option_id)}
                disabled={hasVoted || voting}
                className={`w-full relative min-h-12 rounded-full overflow-hidden text-left border transition-all duration-300 flex items-center justify-between gap-3 px-5 py-2 select-none group ${
                  hasVoted ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
                } ${style}`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ease-out ${
                    selected ? "bg-gradient-to-r from-[#FCE6D4] to-[#FCE3CC]" : "bg-[#FFF6ED]"
                  }`}
                  style={{ width: `${pct}%` }}
                />
                <span
                  className={`relative z-10 text-[0.78125rem] break-words min-w-0 ${
                    selected ? "text-[#E05D24] font-bold" : "text-gray-800 font-medium group-hover:text-[#E05D24]"
                  }`}
                >
                  {opt.text}
                </span>
                <span className="relative z-10 text-[0.78125rem] font-bold text-gray-900 shrink-0">{pct}%</span>
              </button>
            );
          })}
          <span className="text-[0.625rem] text-[#8E8E93] text-right px-1 mt-0.5 font-medium">
            {poll.total_votes.toLocaleString()} {poll.total_votes === 1 ? "vote" : "votes"}
            {hasVoted ? " • You voted" : " • Tap an option to vote"}
          </span>
        </div>
      )}

      {message && (
        <p role="alert" className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {message}
        </p>
      )}
    </article>
  );
}