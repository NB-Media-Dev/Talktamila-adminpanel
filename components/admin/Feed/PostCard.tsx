"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, Copy, Eye, EyeOff, Flag, Image as ImageIcon, Loader2, MessageCircle, MessageSquare, MoreVertical, Pencil, Trash2, Video } from "lucide-react";
import { postService } from "@/services/post.service";
import { getInitials, initialsAvatar } from "@/lib/avatar";
import { InstagramIcon, YoutubeIcon } from "@/public/Svgicons/svgicons";
import { FeedCardfooter } from "./FeedCardfooter";
import PostEditModal from "@/components/post/PostEditModal";
import type { Poll, Post, PostAuthor, PostComment } from "@/types/Posts";

interface PostCardProps {
  post: Post;
  author?: PostAuthor;
  onDeleted: (postId: number) => void;
  onPollUpdated?: (postId: number, poll: Poll) => void;
}

function timeAgo(iso?: string): string {
  if (!iso) return "just now";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "just now";
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

function RichText({ text }: { text: string }) {
  const parts = text.split(/(#[\p{L}\p{M}\p{N}_]+)/gu);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-[#FF6B35] font-semibold hover:underline cursor-pointer">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function isVideoMedia(post: Post): boolean {
  if (post.post_type === "video" || post.media_type === "video") return true;
  const url = (post.media_url || "").toLowerCase();
  if (url.startsWith("data:video/")) return true;
  return /\.(mp4|webm|mov|m4v|mkv|avi)(\?.*)?$/i.test(url);
}

function isImageMedia(post: Post): boolean {
  if (isVideoMedia(post)) return false;
  if (post.post_type === "image" || post.media_type === "image") return true;
  const url = (post.media_url || "").toLowerCase();
  if (url.startsWith("data:image/") || url.startsWith("blob:") || url.startsWith("/Images/")) return true;
  return !!post.media_url;
}

function TypeBadge({ post }: { post: Post }) {
  const isVid = isVideoMedia(post);
  if (post.platform === "youtube" || isVid) {
    return (
      <div className="text-[#FF0000] p-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors shadow-xs">
        <YoutubeIcon className="w-5 h-5" />
      </div>
    );
  }
  if (post.platform === "instagram" || isImageMedia(post)) {
    return (
      <div className="text-[#E1306C] p-2 bg-pink-50 rounded-full hover:bg-pink-100 transition-colors shadow-xs">
        <InstagramIcon className="w-5 h-5" />
      </div>
    );
  }
  if (post.post_type === "poll") {
    return (
      <span className="bg-[#FFF6ED] text-[#E05D24] border border-[#FFEFE0] rounded-full px-2.5 py-0.5 text-[0.5625rem] font-bold tracking-wider uppercase">
        Poll
      </span>
    );
  }
  if (post.post_type === "gif") {
    return (
      <span className="bg-[#FFF6ED] text-[#E05D24] border border-[#FFEFE0] rounded-full px-2.5 py-0.5 text-[0.5625rem] font-bold tracking-wider uppercase">
        GIF
      </span>
    );
  }
  return (
    <div className="text-[#E05D24] p-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors">
      <MessageSquare className="w-5 h-5 fill-current" />
    </div>
  );
}

export default function PostCard({ post, author, onDeleted, onPollUpdated }: PostCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState(post.content || "");
  const [commentsDisabled, setCommentsDisabled] = useState(Boolean(post.comments_disabled));
  const [hideLikeCount, setHideLikeCount] = useState(Boolean(post.hide_like_count));
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    setContent(post.content || "");
    setCommentsDisabled(Boolean(post.comments_disabled));
    setHideLikeCount(Boolean(post.hide_like_count));
  }, [post.content, post.comments_disabled, post.hide_like_count]);

  const isOwnPost = post.is_owner !== undefined ? post.is_owner : Boolean(post.can_delete);

  const handleEditClick = () => {
    setMenuOpen(false);
    setEditModalOpen(true);
  };

  const handleToggleHideLikeCount = async () => {
    setMenuOpen(false);
    const nextVal = !hideLikeCount;
    setHideLikeCount(nextVal);
    try {
      await postService.edit(post.post_id, { hideLikeCount: nextVal });
    } catch {
      setHideLikeCount(!nextVal);
    }
  };

  const handleToggleComments = async () => {
    setMenuOpen(false);
    const nextVal = !commentsDisabled;
    setCommentsDisabled(nextVal);
    try {
      await postService.edit(post.post_id, { commentsDisabled: nextVal });
    } catch {
      setCommentsDisabled(!nextVal);
    }
  };

  const name = author?.name || author?.username || "Admin Tamil";
  const avatar =
    author?.avatar_url ||
    initialsAvatar(getInitials({ name: author?.name || "Admin Tamil", username: author?.username || "admin" }));
  const location = post.location || "Chennai, India";

  // Close menu on click outside or Escape
  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/post/${post.post_id}`;
      navigator.clipboard?.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setMenuOpen(false);
        }, 1200);
      }).catch(() => {
        setMenuOpen(false);
      });
    }
  };

  const handleReport = () => {
    setReported(true);
    setTimeout(() => {
      setReported(false);
      setMenuOpen(false);
    }, 1500);
  };

  // Fetch comments on mount
  useEffect(() => {
    let active = true;
    postService
      .getComments(post.post_id)
      .then((res) => {
        if (active && res && Array.isArray(res)) {
          setComments(res);
        } else if (active) {
          setComments([]);
        }
      })
      .catch(() => {
        if (active) setComments([]);
      });
    return () => {
      active = false;
    };
  }, [post.post_id]);

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
      onPollUpdated?.(post.post_id, poll);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not record your vote.");
    } finally {
      setVoting(false);
    }
  };

  const poll = post.poll;
  const hasVoted = poll ? poll.my_vote_option_id !== null : false;

  const footerDetails = {
    isViews: post.views_count || "1.2M",
    isRevenue: post.revenue || "18,250",
    isAIScore: post.ai_score || "96/100",
    isNextTime: post.next_time || "8:32PM",
    isLike: (post.like_count ?? post.likes_count) !== undefined ? `${post.like_count ?? post.likes_count}` : "0",
    isMessage: (post.comment_count ?? post.comments_count) !== undefined ? `${post.comment_count ?? post.comments_count}` : "0",
    isSend: (post.share_count ?? post.shares_count) !== undefined ? `${post.share_count ?? post.shares_count}` : "0",
    isSaved: (post.save_count ?? post.saves_count) !== undefined ? `${post.save_count ?? post.saves_count}` : "0",
  };

  return (
    <article className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-3.5 xs:p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-3.5 sm:gap-4 select-none">
      {/* Header */}
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
            <span className="text-[0.6875rem] text-[#8E8E93] mt-0.5">
              {location} • {timeAgo(post.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <TypeBadge post={post} />
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              disabled={deleting}
              title="More options"
              aria-label="More options"
              aria-expanded={menuOpen}
              className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
              ) : (
                <MoreVertical className="w-4 h-4" />
              )}
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-1.5 z-30 w-52 overflow-hidden rounded-2xl border border-[#FFEFE0] bg-white py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5 animate-in fade-in duration-100"
              >
                {isOwnPost && (
                  <>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleEditClick}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#FFF6ED] hover:text-[#FF6B35] transition-colors text-left cursor-pointer"
                    >
                      <Pencil className="w-4 h-4 text-[#FF6B35]" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleToggleHideLikeCount}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#FFF6ED] hover:text-[#FF6B35] transition-colors text-left cursor-pointer"
                    >
                      {hideLikeCount ? (
                        <>
                          <Eye className="w-4 h-4 text-[#FF6B35]" />
                          <span>Show like count</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 text-[#FF6B35]" />
                          <span>Hide like count</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleToggleComments}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#FFF6ED] hover:text-[#FF6B35] transition-colors text-left cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#FF6B35]" />
                      <span>{commentsDisabled ? "Turn on commenting" : "Turn off commenting"}</span>
                    </button>

                    <div className="my-1 h-px bg-[#FFEFE0]" />
                  </>
                )}

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-gray-700 hover:bg-[#FFF6ED] hover:text-[#FF6B35] transition-colors text-left cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                  <span>{copied ? "Link copied!" : "Copy link"}</span>
                </button>

                {post.can_delete && (
                  <>
                    <div className="my-1 h-px bg-[#FFEFE0]" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        handleDelete();
                      }}
                      disabled={deleting}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Delete post</span>
                    </button>
                  </>
                )}

                {!post.can_delete && (
                  <>
                    <div className="my-1 h-px bg-[#FFEFE0]" />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleReport}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors text-left cursor-pointer"
                    >
                      <Flag className="w-4 h-4 text-gray-400" />
                      <span>{reported ? "Reported" : "Report post"}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text / Caption */}
      {content &&
        (post.post_type === "text" ? (
          <div className="bg-[#FFFDFB] rounded-[20px] p-4 border border-[#FFEFE0] text-[0.84375rem] text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            <RichText text={content} />
          </div>
        ) : (
          <div className="text-[0.8125rem] text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
            <RichText text={content} />
          </div>
        ))}

      {/* Media: Video */}
      {isVideoMedia(post) && post.media_url && (
        <div className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-black flex items-center justify-center max-h-[500px] relative">
          <video
            src={postService.mediaSrc(post.media_url)}
            controls
            playsInline
            preload="metadata"
            className="w-full max-h-[480px] object-contain rounded-[24px]"
          />
        </div>
      )}

      {/* Media: Image */}
      {isImageMedia(post) && post.media_url && (
        <div className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-gray-900/5 flex items-center justify-center min-h-[200px] max-h-[550px] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={postService.mediaSrc(post.media_url)}
            alt={post.content ? post.content.slice(0, 50) : "Post image"}
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes("/Images/avatar1.png")) {
                target.src = "/Images/avatar1.png";
              }
            }}
            className="w-full h-auto max-h-[550px] object-contain rounded-[24px]"
          />
        </div>
      )}

      {/* Media: GIF */}
      {post.post_type === "gif" && post.gif_url && (
        <div className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-gray-900/5 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.gif_url} alt="GIF" loading="lazy" className="w-full h-auto max-h-[480px] object-contain rounded-[24px]" />
        </div>
      )}

      {/* Poll */}
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

      {/* 4 Pill Stats & Footer Actions & Comments */}
      <FeedCardfooter
        PostAnalysis={footerDetails}
        postId={post.post_id}
        postOwnerId={post.author_id}
        initialComments={comments}
        isLikedInitial={Boolean(post.liked_by_me ?? post.is_liked)}
        isSavedInitial={Boolean(post.saved_by_me ?? post.is_saved)}
        isSharedInitial={Boolean(post.shared_by_me ?? post.is_shared)}
        commentsDisabled={commentsDisabled}
        hideLikeCount={hideLikeCount}
        onLikeToggle={(currentlyLiked?: boolean) => postService.toggleLike(post.post_id, currentlyLiked).catch(() => {})}
        onSaveToggle={(currentlySaved?: boolean) => postService.toggleSave(post.post_id, currentlySaved).catch(() => {})}
        onShare={() => postService.recordShare(post.post_id)}
      />

      {/* Edit Post Modal */}
      {editModalOpen && (
        <PostEditModal
          post={post}
          currentContent={content}
          currentHideLikeCount={hideLikeCount}
          currentCommentsDisabled={commentsDisabled}
          onClose={() => setEditModalOpen(false)}
          onSaved={(newContent, newHideLikes, newCommentsOff) => {
            setContent(newContent);
            setHideLikeCount(newHideLikes);
            setCommentsDisabled(newCommentsOff);
          }}
        />
      )}
    </article>
  );
}