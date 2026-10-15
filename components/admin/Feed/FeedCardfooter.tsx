"use client";
import { useContenthook } from "@/hooks/useContent";
import {
  Barcharticons,
  ClockIcons,
  IndianrupeeIcons,
  SparkleIcons,
  TrendingIcons,
} from "@/public/Svgicons/svgicons";
import { postService } from "@/services/post.service";
import type { PostComment, PostCommentReply } from "@/types/Posts";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Send,
  Loader2,
  Check,
  CornerDownRight,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";

export interface Footercard {
  isViews?: string;
  isRevenue?: string;
  isAIScore?: string;
  isNextTime?: string;
  isLike?: string;
  isMessage?: string;
  isSend?: string;
  isSaved?: string;
}

export interface FeedCardfooterProps {
  PostAnalysis: Footercard;
  postId?: number;
  postOwnerId?: number;
  initialComments?: PostComment[];
  isLikedInitial?: boolean;
  isSavedInitial?: boolean;
  isSharedInitial?: boolean;
  commentsDisabled?: boolean;
  hideLikeCount?: boolean;
  onLikeToggle?: (currentlyLiked?: boolean) => void;
  onSaveToggle?: (currentlySaved?: boolean) => void;
  onShare?: () => Promise<{ share_count?: number } | void> | void;
}

interface ReplyingTarget {
  commentId: number;
  authorName: string;
  authorUsername?: string;
  rootParentId: number;
}

function parseCount(val?: string): number {
  if (!val) return 0;
  const clean = val.trim().toUpperCase();
  if (clean.endsWith("M")) return Math.round(parseFloat(clean) * 1_000_000) || 0;
  if (clean.endsWith("K")) return Math.round(parseFloat(clean) * 1_000) || 0;
  const n = parseInt(clean.replace(/,/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

function formatCount(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return String(num);
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
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export function FeedCardfooter({
  PostAnalysis,
  postId,
  postOwnerId,
  initialComments = [],
  isLikedInitial = false,
  isSavedInitial = false,
  isSharedInitial = false,
  commentsDisabled = false,
  hideLikeCount = false,
  onLikeToggle,
  onSaveToggle,
  onShare,
}: FeedCardfooterProps) {
  const context = useContext(useContenthook);
  const setAnalyticsState = context?.setAnalyticsState;

  // Like state
  const [liked, setLiked] = useState<boolean>(isLikedInitial);
  const [likeCount, setLikeCount] = useState<number>(() => parseCount(PostAnalysis.isLike));

  // Save state
  const [saved, setSaved] = useState<boolean>(isSavedInitial);
  const [saveCount, setSaveCount] = useState<number>(() => parseCount(PostAnalysis.isSaved));

  // Share state
  const [shared, setShared] = useState<boolean>(isSharedInitial);
  const [shareCount, setShareCount] = useState<number>(() => parseCount(PostAnalysis.isSend));
  const [copied, setCopied] = useState<boolean>(false);

  // Comment state
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<PostComment[]>(initialComments);
  const [commentCount, setCommentCount] = useState<number>(() =>
    parseCount(PostAnalysis.isMessage)
  );
  const [newComment, setNewComment] = useState<string>("");
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);

  // Reply state (Parent vs Child comment)
  const [replyingTo, setReplyingTo] = useState<ReplyingTarget | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<number, boolean>>({});

  // Long press / Delete state
  const [deleteTarget, setDeleteTarget] = useState<PostComment | PostCommentReply | null>(null);
  const [deletingComment, setDeletingComment] = useState<boolean>(false);

  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggeredRef = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync counts when PostAnalysis props change
  useEffect(() => {
    setCommentCount(parseCount(PostAnalysis.isMessage));
  }, [PostAnalysis.isMessage]);

  useEffect(() => {
    setLikeCount(parseCount(PostAnalysis.isLike));
  }, [PostAnalysis.isLike]);

  useEffect(() => {
    setSaveCount(parseCount(PostAnalysis.isSaved));
  }, [PostAnalysis.isSaved]);

  useEffect(() => {
    setShareCount(parseCount(PostAnalysis.isSend));
  }, [PostAnalysis.isSend]);

  // Sync when initial comments load from parent
  useEffect(() => {
    setComments(initialComments);
    if (initialComments.length > 0) {
      setCommentCount((prev) => Math.max(prev, initialComments.length));
    }
  }, [initialComments]);

  // Fetch comments fresh from backend when comments section opens
  useEffect(() => {
    if (showComments && postId) {
      postService
        .getComments(postId)
        .then((res) => {
          if (res && Array.isArray(res)) {
            setComments(res);
            setCommentCount(res.length);
          }
        })
        .catch(() => {});
    }
  }, [showComments, postId]);

  useEffect(() => {
    setLiked(Boolean(isLikedInitial));
  }, [isLikedInitial]);

  useEffect(() => {
    setSaved(Boolean(isSavedInitial));
  }, [isSavedInitial]);

  useEffect(() => {
    setShared(Boolean(isSharedInitial));
  }, [isSharedInitial]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !liked;
    setLiked(nextState);
    setLikeCount((prev) => Math.max(0, prev + (nextState ? 1 : -1)));

    if (onLikeToggle) {
      onLikeToggle(liked);
    } else if (postId) {
      postService.toggleLike(postId, liked).catch(() => {});
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !saved;
    setSaved(nextState);
    setSaveCount((prev) => Math.max(0, prev + (nextState ? 1 : -1)));

    if (onSaveToggle) {
      onSaveToggle(saved);
    } else if (postId) {
      postService.toggleSave(postId, saved).catch(() => {});
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Prevent duplicate increments if already shared
    if (!shared) {
      setShared(true);
      setShareCount((prev) => prev + 1);
    }

    let sharePromise: Promise<any> | undefined;
    if (onShare) {
      sharePromise = Promise.resolve(onShare());
    } else if (postId) {
      sharePromise = postService.recordShare(postId);
    }

    if (sharePromise) {
      sharePromise
        .then((res) => {
          if (res && typeof res.share_count === "number") {
            setShareCount(res.share_count);
            setShared(true);
          }
        })
        .catch(() => {});
    }

    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/post/${postId || ""}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Talk Tamila Post",
            url,
          });
          return;
        } catch {
          // User dismissed native share sheet
        }
      }
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(url)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => {});
      }
    }
  };

  const handleToggleComments = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (commentsDisabled) return;
    setShowComments((prev) => !prev);
  };

  // Start replying to a comment or child reply
  const handleStartReply = (
    c: PostComment | PostCommentReply,
    rootParentId: number
  ) => {
    setReplyingTo({
      commentId: c.comment_id,
      authorName: c.author?.name || "User",
      authorUsername: c.author?.username,
      rootParentId,
    });
    // Ensure the replies for that parent are expanded
    setExpandedReplies((prev) => ({ ...prev, [rootParentId]: true }));
    // Auto-focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Expand / fetch child replies for a parent comment
  const handleToggleReplies = async (parentCommentId: number) => {
    const isExpanded = Boolean(expandedReplies[parentCommentId]);
    if (isExpanded) {
      setExpandedReplies((prev) => ({ ...prev, [parentCommentId]: false }));
      return;
    }

    setExpandedReplies((prev) => ({ ...prev, [parentCommentId]: true }));

    // Fetch replies from backend
    if (postId) {
      setLoadingReplies((prev) => ({ ...prev, [parentCommentId]: true }));
      try {
        const fetchedReplies = await postService.getReplies(postId, parentCommentId);
        setComments((prev) =>
          prev.map((c) =>
            c.comment_id === parentCommentId
              ? {
                  ...c,
                  replies: fetchedReplies,
                  reply_count: Math.max(c.reply_count || 0, fetchedReplies.length),
                }
              : c
          )
        );
      } catch (err) {
        console.error("Failed to fetch replies:", err);
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [parentCommentId]: false }));
      }
    }
  };

  // Add a parent comment or a child reply
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment || !postId) return;

    const text = newComment.trim();
    const parentId = replyingTo ? replyingTo.rootParentId : null;
    setSubmittingComment(true);

    try {
      const created = await postService.addComment(postId, text, parentId);
      if (parentId) {
        // Nested child reply under root parent
        setComments((prev) =>
          prev.map((c) => {
            if (c.comment_id === parentId) {
              const currentReplies = c.replies || [];
              return {
                ...c,
                replies: [...currentReplies, created],
                reply_count: (c.reply_count || currentReplies.length) + 1,
              };
            }
            return c;
          })
        );
        setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
      } else {
        // Top-level parent comment
        setComments((prev) => [created, ...prev]);
      }

      setCommentCount((prev) => prev + 1);
      setNewComment("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Like or unlike a comment or reply
  const handleToggleCommentLike = async (
    e: React.MouseEvent,
    commentId: number,
    explicitLiked?: boolean,
    parentId?: number | null
  ) => {
    e.stopPropagation();

    // Determine current status synchronously
    let isCurrentlyLiked = typeof explicitLiked === "boolean" ? explicitLiked : false;
    if (typeof explicitLiked !== "boolean") {
      for (const c of comments) {
        if (parentId && c.comment_id === parentId) {
          const rep = (c.replies || []).find((r) => r.comment_id === commentId);
          if (rep) {
            isCurrentlyLiked = Boolean(rep.liked_by_me);
            break;
          }
        } else if (c.comment_id === commentId) {
          isCurrentlyLiked = Boolean(c.liked_by_me);
          break;
        }
      }
    }

    const nextLiked = !isCurrentlyLiked;

    // Optimistically update
    setComments((prev) =>
      prev.map((c) => {
        if (parentId && c.comment_id === parentId) {
          return {
            ...c,
            replies: (c.replies || []).map((r) => {
              if (r.comment_id === commentId) {
                return {
                  ...r,
                  liked_by_me: nextLiked,
                  like_count: Math.max(0, (r.like_count ?? 0) + (nextLiked ? 1 : -1)),
                };
              }
              return r;
            }),
          };
        }
        if (c.comment_id === commentId) {
          return {
            ...c,
            liked_by_me: nextLiked,
            like_count: Math.max(0, (c.like_count ?? 0) + (nextLiked ? 1 : -1)),
          };
        }
        return c;
      })
    );

    if (!postId) return;

    try {
      const res = await postService.toggleCommentLike(postId, commentId, isCurrentlyLiked);
      setComments((prev) =>
        prev.map((c) => {
          if (parentId && c.comment_id === parentId) {
            return {
              ...c,
              replies: (c.replies || []).map((r) =>
                r.comment_id === commentId
                  ? { ...r, liked_by_me: res.liked, like_count: res.like_count }
                  : r
              ),
            };
          }
          if (c.comment_id === commentId) {
            return {
              ...c,
              liked_by_me: res.liked,
              like_count: res.like_count,
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Failed to toggle comment like:", err);
      // Rollback on error
      setComments((prev) =>
        prev.map((c) => {
          if (parentId && c.comment_id === parentId) {
            return {
              ...c,
              replies: (c.replies || []).map((r) => {
                if (r.comment_id === commentId) {
                  return {
                    ...r,
                    liked_by_me: isCurrentlyLiked,
                    like_count: Math.max(0, (r.like_count ?? 0) + (isCurrentlyLiked ? 1 : -1)),
                  };
                }
                return r;
              }),
            };
          }
          if (c.comment_id === commentId) {
            return {
              ...c,
              liked_by_me: isCurrentlyLiked,
              like_count: Math.max(0, (c.like_count ?? 0) + (isCurrentlyLiked ? 1 : -1)),
            };
          }
          return c;
        })
      );
    }
  };

  // Long press timer logic for comment owner deletion
  const handlePointerDown = (comment: PostComment | PostCommentReply) => {
    if (comment.can_delete === false) return;
    isLongPressTriggeredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressTriggeredRef.current = true;
      if (typeof window !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(50);
        } catch {}
      }
      setDeleteTarget(comment);
    }, 500); // 500ms long press threshold
  };

  const handlePointerUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Confirm delete comment or reply
  const handleConfirmDelete = async () => {
    if (!deleteTarget || deletingComment || !postId) return;
    setDeletingComment(true);
    try {
      await postService.deleteComment(postId, deleteTarget.comment_id);

      if (deleteTarget.parent_id) {
        // Remove child reply from parent's replies array
        setComments((prev) =>
          prev.map((c) => {
            if (c.comment_id === deleteTarget.parent_id) {
              const filteredReplies = (c.replies || []).filter(
                (r) => r.comment_id !== deleteTarget.comment_id
              );
              return {
                ...c,
                replies: filteredReplies,
                reply_count: Math.max(0, (c.reply_count || 1) - 1),
              };
            }
            return c;
          })
        );
      } else {
        // Remove top-level parent comment
        setComments((prev) =>
          prev.filter((c) => c.comment_id !== deleteTarget.comment_id)
        );
      }

      setCommentCount((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      setDeletingComment(false);
    }
  };

  return (
    <div className="w-full select-none">
      {/* 4 Pill Metrics */}
      <div className="grid grid-cols-2 gap-1.5 xs:gap-2 mt-1">
        <div className="flex items-center gap-1.5 xs:gap-2 bg-[#FFF6ED] rounded-full px-2.5 xs:px-3 py-1 xs:py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02] min-w-0">
          <TrendingIcons />
          <div className="flex flex-col min-w-0">
            <span className="text-[0.625rem] xs:text-[0.6875rem] font-bold text-gray-900 leading-none truncate">
              {PostAnalysis.isViews}
            </span>
            <span className="text-[0.45rem] xs:text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5 truncate">
              Views
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 xs:gap-2 bg-[#FFF6ED] rounded-full px-2.5 xs:px-3 py-1 xs:py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02] min-w-0">
          <IndianrupeeIcons />
          <div className="flex flex-col min-w-0">
            <span className="text-[0.625rem] xs:text-[0.6875rem] font-bold text-gray-900 leading-none truncate">
              {PostAnalysis.isRevenue}
            </span>
            <span className="text-[0.45rem] xs:text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5 truncate">
              Revenue
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 xs:gap-2 bg-[#FFF6ED] rounded-full px-2.5 xs:px-3 py-1 xs:py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02] min-w-0">
          <SparkleIcons />
          <div className="flex flex-col min-w-0">
            <span className="text-[0.625rem] xs:text-[0.6875rem] font-bold text-gray-900 leading-none truncate">
              {PostAnalysis.isAIScore}
            </span>
            <span className="text-[0.45rem] xs:text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5 truncate">
              AI Score
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 xs:gap-2 bg-[#FFF6ED] rounded-full px-2.5 xs:px-3 py-1 xs:py-1.5 border border-[#FFEFE0] transition-transform duration-200 hover:scale-[1.02] min-w-0">
          <ClockIcons />
          <div className="flex flex-col min-w-0">
            <span className="text-[0.625rem] xs:text-[0.6875rem] font-bold text-gray-900 leading-none truncate">
              {PostAnalysis.isNextTime}
            </span>
            <span className="text-[0.45rem] xs:text-[0.5rem] text-[#8E8E93] font-semibold tracking-wider uppercase mt-0.5 truncate">
              Next Time
            </span>
          </div>
        </div>
      </div>

      {/* 4 Interactive Engagement Buttons & Analytics */}
      <div className="flex items-center justify-between gap-2 border-t border-[#FFEFE0] pt-3 sm:pt-4 mt-2 sm:mt-1">
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-3.5 text-[#8E8E93] shrink-0">
          {/* 1. Like Button */}
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors group cursor-pointer shrink-0 active:scale-95 ${
              liked ? "text-red-500 font-bold" : "hover:text-red-500"
            }`}
            title={liked ? "Unlike" : "Like"}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart
              className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] transition-all duration-200 ${
                liked
                  ? "fill-red-500 text-red-500 scale-110"
                  : "group-hover:fill-red-400/30 text-current"
              }`}
            />
            {!hideLikeCount && (
              <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">
                {formatCount(likeCount)}
              </span>
            )}
          </button>

          {/* 2. Comment Button */}
          <button
            type="button"
            onClick={handleToggleComments}
            className={`flex items-center gap-1 transition-colors group cursor-pointer shrink-0 active:scale-95 ${
              showComments ? "text-blue-500 font-bold" : "hover:text-blue-500"
            } ${commentsDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
            title={commentsDisabled ? "Comments are turned off" : "Comments"}
            aria-label={commentsDisabled ? "Comments are turned off" : "Comments"}
          >
            <MessageCircle
              className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] transition-all duration-200 ${
                showComments
                  ? "fill-blue-500/20 text-blue-500 scale-110"
                  : "group-hover:fill-blue-500/20 text-current"
              }`}
            />
            {!commentsDisabled && (
              <span className="text-[0.625rem] sm:text-[0.6875rem] font-semibold">
                {formatCount(commentCount)}
              </span>
            )}
          </button>

          {/* 3. Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className={`flex items-center gap-1 transition-colors group cursor-pointer shrink-0 active:scale-95 ${
              shared ? "text-green-600 font-bold" : "hover:text-green-500"
            }`}
            title={shared ? "Shared (Click to copy/share again)" : "Share"}
            aria-label={shared ? "Shared (Click to copy/share again)" : "Share"}
          >
            {copied ? (
              <Check className="w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] text-green-500 animate-in zoom-in" />
            ) : (
              <Send
                className={`w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] transition-transform group-hover:translate-x-0.5 ${
                  shared ? "text-green-600 fill-green-600/20" : "text-current"
                }`}
              />
            )}
            <span className="hidden xs:inline text-[0.625rem] sm:text-[0.6875rem] font-semibold">
              {copied ? "Copied!" : formatCount(shareCount)}
            </span>
          </button>

          {/* 4. Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-1 transition-colors group cursor-pointer shrink-0 active:scale-95 ${
              saved ? "text-[#FF6B35] font-bold" : "hover:text-yellow-500"
            }`}
            title={saved ? "Unsave" : "Save"}
            aria-label={saved ? "Unsave" : "Save"}
          >
            <Bookmark
              className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] transition-all duration-200 ${
                saved
                  ? "fill-[#FF6B35] text-[#FF6B35] scale-110"
                  : "group-hover:fill-yellow-500/30 text-current"
              }`}
            />
            <span className="hidden sm:inline text-[0.625rem] sm:text-[0.6875rem] font-semibold">
              {formatCount(saveCount)}
            </span>
          </button>
        </div>

        {/* Analytics Button */}
        <button
          type="button"
          onClick={() => setAnalyticsState?.(true)}
          className="flex items-center gap-1 sm:gap-1.5 border border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white rounded-full px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-[0.625rem] sm:text-[0.6875rem] font-bold shadow-[0_2px_8px_rgba(255,107,53,0.1)] active:scale-95 shrink-0 whitespace-nowrap transition-colors cursor-pointer"
        >
          <Barcharticons />
          <span>Analytics</span>
        </button>
      </div>

      {/* Comments Turned Off notice */}
      {commentsDisabled && (
        <div className="w-full pt-1">
          <p className="text-[12px] text-[#8E8E93] font-medium">Comments are turned off.</p>
        </div>
      )}

      {/* Expandable Comments Section (Parent & Child Hierarchy) */}
      {showComments && !commentsDisabled && (
        <div className="w-full mt-3 pt-3 border-t border-[#FFEFE0] flex flex-col gap-3 animate-in fade-in duration-200">
          {/* Replying Banner */}
          {replyingTo && (
            <div className="flex items-center justify-between bg-[#FFF6ED] border border-[#FFEFE0] rounded-xl px-3 py-1.5 text-xs text-gray-700 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-1.5 truncate min-w-0">
                <CornerDownRight className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
                <span className="truncate">
                  Replying to{" "}
                  <strong className="text-[#FF6B35] font-semibold">
                    @{replyingTo.authorUsername || replyingTo.authorName}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:bg-black/5 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer shrink-0 ml-2"
                title="Cancel reply"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Comment Input */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 w-full">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyingTo
                  ? `Reply to @${replyingTo.authorUsername || replyingTo.authorName}...`
                  : "Write a comment..."
              }
              disabled={submittingComment}
              className="flex-1 text-xs bg-[#FFF6ED]/50 border border-[#FFEFE0] rounded-full px-3.5 py-1.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF6B35] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submittingComment}
              className="bg-[#FF6B35] hover:bg-[#e05d24] disabled:opacity-50 text-white rounded-full px-3.5 py-1.5 text-xs font-semibold shrink-0 cursor-pointer transition-all active:scale-95 flex items-center gap-1"
            >
              {submittingComment ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : replyingTo ? (
                "Reply"
              ) : (
                "Post"
              )}
            </button>
          </form>

          {/* Comment List (Parent Comments with clickable child replies) */}
          <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-[0.6875rem] text-gray-400 italic py-1 text-center">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((parent) => {
                const replies = parent.replies || [];
                const replyCount = parent.reply_count ?? replies.length;
                const isExpanded = Boolean(expandedReplies[parent.comment_id]);
                const isLoadingReplies = Boolean(loadingReplies[parent.comment_id]);

                return (
                  <div key={parent.comment_id} className="flex flex-col gap-1.5">
                    {/* Parent Comment Item */}
                    <div
                      onPointerDown={() => handlePointerDown(parent)}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                      onClick={() => {
                        if (isLongPressTriggeredRef.current) {
                          isLongPressTriggeredRef.current = false;
                          return;
                        }
                        handleToggleReplies(parent.comment_id);
                      }}
                      onContextMenu={(e) => {
                        if (parent.can_delete !== false) {
                          e.preventDefault();
                          setDeleteTarget(parent);
                        }
                      }}
                      className="group relative flex items-start gap-2.5 bg-[#FFF6ED]/30 rounded-2xl p-2.5 border border-[#FFEFE0]/60 hover:bg-[#FFF6ED]/60 transition-all select-none cursor-pointer"
                      title="Tap to see replies. Long press to delete."
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-[#FFEFE0]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={parent.author?.avatar_url || "/Images/avatar1.png"}
                          alt={parent.author?.name || "avatar"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 truncate min-w-0">
                            <span className="text-xs font-bold text-gray-900 leading-none truncate">
                              {parent.author?.name || "User"}
                            </span>
                            {parent.author?.username && (
                              <span className="text-[0.625rem] text-gray-400 truncate">
                                @{parent.author.username}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] text-[#8E8E93]">
                              {timeAgo(parent.created_at)}
                            </span>
                            {/* Hover delete icon for desktop */}
                            {parent.can_delete !== false && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget(parent);
                                }}
                                title="Delete comment"
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 rounded transition-all cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-gray-800 mt-1 break-words font-normal leading-relaxed">
                          {parent.content}
                        </p>

                        {/* Reply Action Button, Like Comment & Toggle Child Replies */}
                        <div className="flex items-center gap-3 mt-1.5 text-[0.6875rem]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartReply(parent, parent.comment_id);
                            }}
                            className="font-semibold text-[#FF6B35] hover:text-[#e05d24] transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
                          >
                            <CornerDownRight className="w-3 h-3" />
                            <span>Reply</span>
                          </button>

                          {/* Like Comment Button */}
                          <button
                            type="button"
                            onClick={(e) =>
                              handleToggleCommentLike(
                                e,
                                parent.comment_id,
                                Boolean(parent.liked_by_me)
                              )
                            }
                            className={`font-semibold transition-all duration-150 cursor-pointer active:scale-95 flex items-center gap-1 ${
                              parent.liked_by_me
                                ? "text-red-500"
                                : "text-[#8E8E93] hover:text-red-500"
                            }`}
                            title={parent.liked_by_me ? "Unlike comment" : "Like comment"}
                            aria-label={parent.liked_by_me ? "Unlike comment" : "Like comment"}
                          >
                            <Heart
                              className={`w-3 h-3 transition-transform duration-150 ${
                                parent.liked_by_me
                                  ? "fill-red-500 text-red-500 scale-110"
                                  : "text-current"
                              }`}
                            />
                            <span>
                              {(parent.like_count ?? 0) > 0
                                ? formatCount(parent.like_count!)
                                : "Like"}
                            </span>
                          </button>

                          {/* Click to see child comments */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReplies(parent.comment_id);
                            }}
                            className="font-semibold text-[#FF6B35] hover:text-[#e05d24] transition-colors cursor-pointer flex items-center gap-1 bg-[#FFF6ED] hover:bg-[#FFEFE0] px-2 py-0.5 rounded-full border border-[#FFEFE0] active:scale-95"
                          >
                            {isLoadingReplies ? (
                              <Loader2 className="w-3 h-3 animate-spin text-[#FF6B35]" />
                            ) : isExpanded ? (
                              <ChevronUp className="w-3 h-3" />
                            ) : (
                              <ChevronDown className="w-3 h-3" />
                            )}
                            <span>
                              {isExpanded
                                ? "Hide replies"
                                : replyCount > 0
                                ? `View ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`
                                : "View replies"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Child Comments / Replies (Nested under clicked parent) */}
                    {isExpanded && (
                      <div className="ml-6 pl-3 border-l-2 border-[#FF6B35]/30 flex flex-col gap-2 mt-0.5 animate-in fade-in duration-150">
                        {isLoadingReplies && replies.length === 0 ? (
                          <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF6B35]" />
                            <span>Loading replies...</span>
                          </div>
                        ) : replies.length === 0 ? (
                          <div className="py-1 px-2 text-[0.6875rem] text-gray-400 italic">
                            No replies yet. Tap Reply to be the first!
                          </div>
                        ) : (
                          replies.map((reply) => (
                            <div
                              key={reply.comment_id}
                              onPointerDown={() => handlePointerDown(reply)}
                              onPointerUp={handlePointerUp}
                              onPointerLeave={handlePointerUp}
                              onContextMenu={(e) => {
                                if (reply.can_delete !== false) {
                                  e.preventDefault();
                                  setDeleteTarget(reply);
                                }
                              }}
                              className="group relative flex items-start gap-2 bg-[#FFF6ED]/20 rounded-xl p-2 border border-[#FFEFE0]/50 hover:bg-[#FFF6ED]/50 transition-all select-none cursor-pointer"
                              title={
                                reply.can_delete !== false
                                  ? "Long press (or right click) to delete"
                                  : undefined
                              }
                            >
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-[#FFEFE0]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={reply.author?.avatar_url || "/Images/avatar1.png"}
                                  alt={reply.author?.name || "avatar"}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1.5 truncate min-w-0">
                                    <span className="text-[0.6875rem] font-bold text-gray-900 leading-none truncate">
                                      {reply.author?.name || "User"}
                                    </span>
                                    {reply.author?.username && (
                                      <span className="text-[0.5625rem] text-gray-400 truncate">
                                        @{reply.author.username}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    <span className="text-[9px] text-[#8E8E93]">
                                      {timeAgo(reply.created_at)}
                                    </span>
                                    {reply.can_delete !== false && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteTarget(reply);
                                        }}
                                        title="Delete reply"
                                        className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 rounded transition-all cursor-pointer"
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-[0.6875rem] text-gray-800 mt-0.5 break-words font-normal leading-relaxed">
                                  {reply.content}
                                </p>
                                <div className="flex items-center gap-2.5 mt-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartReply(reply, parent.comment_id);
                                    }}
                                    className="text-[10px] font-semibold text-[#FF6B35] hover:text-[#e05d24] transition-colors cursor-pointer flex items-center gap-0.5 active:scale-95"
                                  >
                                    <CornerDownRight className="w-2.5 h-2.5" />
                                    <span>Reply</span>
                                  </button>

                                  {/* Like Reply Button */}
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      handleToggleCommentLike(
                                        e,
                                        reply.comment_id,
                                        Boolean(reply.liked_by_me),
                                        parent.comment_id
                                      )
                                    }
                                    className={`text-[10px] font-semibold transition-all duration-150 cursor-pointer active:scale-95 flex items-center gap-0.5 ${
                                      reply.liked_by_me
                                        ? "text-red-500"
                                        : "text-[#8E8E93] hover:text-red-500"
                                    }`}
                                    title={
                                      reply.liked_by_me
                                        ? "Unlike reply"
                                        : "Like reply"
                                    }
                                    aria-label={
                                      reply.liked_by_me
                                        ? "Unlike reply"
                                        : "Like reply"
                                    }
                                  >
                                    <Heart
                                      className={`w-2.5 h-2.5 transition-transform duration-150 ${
                                        reply.liked_by_me
                                          ? "fill-red-500 text-red-500 scale-110"
                                          : "text-current"
                                      }`}
                                    />
                                    <span>
                                      {(reply.like_count ?? 0) > 0
                                        ? formatCount(reply.like_count!)
                                        : "Like"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Long Press Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4 animate-in fade-in duration-150 select-none"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-[#FFEFE0] flex flex-col gap-3.5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-red-600 font-bold text-sm">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <span>Delete Comment?</span>
            </div>

            <p className="text-xs text-gray-600 bg-[#FFF6ED]/50 border border-[#FFEFE0] rounded-xl p-2.5 line-clamp-3 italic">
              "{deleteTarget.content}"
            </p>

            <p className="text-[11px] text-[#8E8E93]">
              Are you sure? This comment will be permanently removed.
            </p>

            <div className="flex items-center gap-2 pt-1 justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deletingComment}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deletingComment}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                {deletingComment ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}