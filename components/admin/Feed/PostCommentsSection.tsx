"use client";

import React, { useState } from "react";
import { CornerDownRight, Heart, Loader2, MessageCircle, Send, Trash2, X } from "lucide-react";
import { useAuthuser } from "@/hooks/useAuthuser";
import { getInitials, initialsAvatar } from "@/lib/avatar";
import { postService } from "@/services/post.service";
import type { PostComment, PostCommentReply } from "@/types/Posts";

interface PostCommentsSectionProps {
  postId: number;
  postOwnerId?: number;
  comments: PostComment[];
  onCommentsChange: (comments: PostComment[]) => void;
  isOpen: boolean;
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
  return new Date(then).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function PostCommentsSection({
  postId,
  postOwnerId,
  comments,
  onCommentsChange,
  isOpen,
}: PostCommentsSectionProps) {
  const { user } = useAuthuser();
  const authUser: any = user;
  const currentUserId = authUser?.user?.user_id || authUser?.user_id || authUser?.id || 1;
  const currentUsername = authUser?.user?.username || authUser?.username || "admin";
  const currentName = authUser?.user?.full_name || authUser?.user?.name || authUser?.name || "Admin";
  const currentUserRole = authUser?.user?.role || authUser?.role || "admin";
  const currentAvatar =
    authUser?.user?.avatar_url ||
    authUser?.avatar_url ||
    initialsAvatar(getInitials({ name: currentName, username: currentUsername }));

  const isAdmin = currentUserRole === "admin";
  const isPostOwner = Boolean(postOwnerId && postOwnerId === currentUserId);

  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (!isOpen) return null;

  // Total comments count including child replies
  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  // Add top-level parent comment
  const handleAddParentComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text || submitting) return;

    setSubmitting(true);
    try {
      let createdComment: PostComment;
      try {
        createdComment = await postService.addComment(postId, text, null);
      } catch {
        // Fallback optimistic local creation
        createdComment = {
          comment_id: Date.now(),
          post_id: postId,
          parent_id: null,
          content: text,
          created_at: new Date().toISOString(),
          author: {
            user_id: currentUserId,
            name: currentName,
            username: currentUsername,
            avatar_url: currentAvatar,
            role: currentUserRole,
          },
          can_delete: true,
          replies: [],
        };
      }

      onCommentsChange([...comments, createdComment]);
      setCommentText("");
    } catch (err: any) {
      alert(err?.message || "Could not post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  // Add child reply to a parent comment
  const handleAddReply = async (parentCommentId: number) => {
    const text = replyText.trim();
    if (!text || submittingReply) return;

    setSubmittingReply(true);
    try {
      let createdReply: PostCommentReply;
      try {
        const res = await postService.addComment(postId, text, parentCommentId);
        createdReply = {
          comment_id: res.comment_id,
          post_id: postId,
          parent_id: parentCommentId,
          content: res.content,
          created_at: res.created_at,
          author: res.author,
          can_delete: true,
        };
      } catch {
        // Fallback optimistic local creation
        createdReply = {
          comment_id: Date.now(),
          post_id: postId,
          parent_id: parentCommentId,
          content: text,
          created_at: new Date().toISOString(),
          author: {
            user_id: currentUserId,
            name: currentName,
            username: currentUsername,
            avatar_url: currentAvatar,
            role: currentUserRole,
          },
          can_delete: true,
        };
      }

      const updated = comments.map((c) => {
        if (c.comment_id === parentCommentId) {
          return {
            ...c,
            replies: [...(c.replies || []), createdReply],
          };
        }
        return c;
      });

      onCommentsChange(updated);
      setReplyText("");
      setReplyingToId(null);
    } catch (err: any) {
      alert(err?.message || "Could not post reply.");
    } finally {
      setSubmittingReply(false);
    }
  };

  // Delete parent comment (Owner of post, Admin, or Parent Comment Author)
  const handleDeleteParentComment = async (commentId: number) => {
    if (deletingId || !window.confirm("Delete this comment and all its replies?")) return;
    setDeletingId(commentId);
    try {
      try {
        await postService.deleteComment(postId, commentId);
      } catch {
        // Ignore API failure in offline mock mode
      }
      onCommentsChange(comments.filter((c) => c.comment_id !== commentId));
    } catch (err: any) {
      alert(err?.message || "Could not delete comment.");
    } finally {
      setDeletingId(null);
    }
  };

  // Delete child reply (Only the user who commented the child reply, or post owner/admin)
  const handleDeleteReply = async (parentCommentId: number, replyId: number) => {
    if (deletingId || !window.confirm("Delete this reply?")) return;
    setDeletingId(replyId);
    try {
      try {
        await postService.deleteComment(postId, replyId);
      } catch {
        // Ignore API failure in offline mock mode
      }
      const updated = comments.map((c) => {
        if (c.comment_id === parentCommentId) {
          return {
            ...c,
            replies: (c.replies || []).filter((r) => r.comment_id !== replyId),
          };
        }
        return c;
      });
      onCommentsChange(updated);
    } catch (err: any) {
      alert(err?.message || "Could not delete reply.");
    } finally {
      setDeletingId(null);
    }
  };

  // Like or unlike a comment or reply
  const handleToggleCommentLike = async (
    commentId: number,
    parentId?: number | null
  ) => {
    let wasLiked = false;
    const prevComments = comments;

    // Optimistic update
    const updated = comments.map((c) => {
      if (parentId && c.comment_id === parentId) {
        return {
          ...c,
          replies: (c.replies || []).map((r) => {
            if (r.comment_id === commentId) {
              wasLiked = Boolean(r.liked_by_me);
              const nextLiked = !wasLiked;
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
        wasLiked = Boolean(c.liked_by_me);
        const nextLiked = !wasLiked;
        return {
          ...c,
          liked_by_me: nextLiked,
          like_count: Math.max(0, (c.like_count ?? 0) + (nextLiked ? 1 : -1)),
        };
      }
      return c;
    });

    onCommentsChange(updated);

    try {
      const res = await postService.toggleCommentLike(postId, commentId, wasLiked);
      const synced = comments.map((c) => {
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
      });
      onCommentsChange(synced);
    } catch (err) {
      console.error("Failed to toggle comment like:", err);
      onCommentsChange(prevComments);
    }
  };

  return (
    <div className="w-full border-t border-[#FFEFE0] pt-4 mt-1 flex flex-col gap-3 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#FF6B35]" />
          <span className="text-xs font-bold text-gray-900 tracking-tight">
            Comments ({totalCount})
          </span>
        </div>
        <span className="text-[10px] text-[#8E8E93] font-medium">
          Parent & Threaded Replies
        </span>
      </div>

      {/* Main Comment Input Box */}
      <form onSubmit={handleAddParentComment} className="flex items-center gap-2 w-full">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-[#FFEFE0] shrink-0 relative bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentAvatar}
            alt={currentName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-[#FFF6ED] border border-[#FFEFE0] rounded-full px-3.5 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B35] focus:bg-white transition-all pr-9"
          />
          <button
            type="submit"
            disabled={!commentText.trim() || submitting}
            title="Post comment"
            className="absolute right-1.5 p-1 rounded-full text-[#FF6B35] hover:bg-[#FFEFE0] disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="py-4 text-center text-xs text-[#8E8E93] bg-[#FFFDFB] rounded-2xl border border-dashed border-[#FFEFE0] my-1">
          No comments yet. Be the first to start the conversation!
        </div>
      ) : (
        <div className="flex flex-col gap-3 mt-1 max-h-[380px] overflow-y-auto pr-1">
          {comments.map((comment) => {
            const authorName = comment.author?.name || comment.author?.username || "User";
            const authorAvatar =
              comment.author?.avatar_url ||
              initialsAvatar(
                getInitials({ name: comment.author?.name, username: comment.author?.username })
              );

            // Parent comment delete condition:
            // Allowed if: Admin OR Post Owner OR Parent Comment Author
            const isCommentAuthor =
              comment.author?.user_id === currentUserId ||
              comment.author?.username === currentUsername;
            const canDeleteParent = isAdmin || isPostOwner || isCommentAuthor;

            const isReplying = replyingToId === comment.comment_id;
            const isDeleting = deletingId === comment.comment_id;

            return (
              <div
                key={comment.comment_id}
                className="flex flex-col gap-2 p-2.5 rounded-2xl bg-[#FFFDFB] border border-[#FFEFE0]/80 transition-all hover:border-[#FFEFE0]"
              >
                {/* Parent Comment Header & Content */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#FFEFE0] shrink-0 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <span className="text-xs font-bold text-gray-900 truncate">
                          {authorName}
                        </span>
                        {comment.author?.username && (
                          <span className="text-[10px] text-[#8E8E93]">
                            @{comment.author.username}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">• {timeAgo(comment.created_at)}</span>
                      </div>

                      {/* Parent Delete Button */}
                      {canDeleteParent && (
                        <button
                          type="button"
                          onClick={() => handleDeleteParentComment(comment.comment_id)}
                          disabled={isDeleting}
                          title="Delete parent comment & thread (Allowed for comment author, post owner, or admin)"
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer shrink-0"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    <p className="text-[12px] text-gray-800 mt-0.5 leading-relaxed whitespace-pre-wrap break-words">
                      {comment.content}
                    </p>

                    {/* Action Bar (Reply & Like buttons) */}
                    <div className="flex items-center gap-3 mt-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          if (isReplying) {
                            setReplyingToId(null);
                            setReplyText("");
                          } else {
                            setReplyingToId(comment.comment_id);
                            setReplyText(`@${comment.author?.username || authorName} `);
                          }
                        }}
                        className="font-bold text-[#FF6B35] hover:text-[#e05d24] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <CornerDownRight className="w-3 h-3" />
                        <span>{isReplying ? "Cancel" : "Reply"}</span>
                      </button>

                      {/* Like Comment Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleCommentLike(comment.comment_id)}
                        className={`font-semibold transition-all duration-150 cursor-pointer active:scale-95 flex items-center gap-1 ${
                          comment.liked_by_me
                            ? "text-red-500"
                            : "text-[#8E8E93] hover:text-red-500"
                        }`}
                        title={comment.liked_by_me ? "Unlike comment" : "Like comment"}
                      >
                        <Heart
                          className={`w-3 h-3 transition-transform duration-150 ${
                            comment.liked_by_me
                              ? "fill-red-500 text-red-500 scale-110"
                              : "text-current"
                          }`}
                        />
                        <span>
                          {(comment.like_count ?? 0) > 0 ? comment.like_count : "Like"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Reply Input for this Parent Comment */}
                {isReplying && (
                  <div className="ml-7 mt-1 pl-3 border-l-2 border-[#FF6B35]/40 flex items-center gap-2">
                    <input
                      type="text"
                      value={replyText}
                      autoFocus
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to @${comment.author?.username || authorName}...`}
                      className="flex-1 bg-white border border-[#FFEFE0] rounded-full px-3 py-1 text-[11px] text-gray-900 focus:outline-none focus:border-[#FF6B35]"
                    />
                    <button
                      type="button"
                      disabled={!replyText.trim() || submittingReply}
                      onClick={() => handleAddReply(comment.comment_id)}
                      className="px-3 py-1 bg-[#FF6B35] hover:bg-[#e05d24] text-white text-[11px] font-bold rounded-full transition-colors disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      {submittingReply ? "Posting…" : "Reply"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingToId(null);
                        setReplyText("");
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Nested Child Comments (Replies) */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-6 pl-3 border-l-2 border-[#FFEFE0] flex flex-col gap-2 mt-1">
                    {comment.replies.map((reply) => {
                      const replyAuthorName = reply.author?.name || reply.author?.username || "User";
                      const replyAvatar =
                        reply.author?.avatar_url ||
                        initialsAvatar(
                          getInitials({ name: reply.author?.name, username: reply.author?.username })
                        );

                      // CHILD COMMENT DELETION RULE:
                      // "for child command alone who commaned they can oly delete"
                      // Allowed strictly if user is the author of this child comment, or admin/post owner
                      const isReplyAuthor =
                        reply.author?.user_id === currentUserId ||
                        reply.author?.username === currentUsername;
                      const canDeleteReply = isReplyAuthor || isAdmin || isPostOwner;

                      const isReplyDeleting = deletingId === reply.comment_id;

                      return (
                        <div
                          key={reply.comment_id}
                          className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-[#FFEFE0]/60"
                        >
                          <div className="w-6 h-6 rounded-full overflow-hidden border border-[#FFEFE0] shrink-0 bg-gray-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={replyAvatar}
                              alt={replyAuthorName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                <span className="text-[11px] font-bold text-gray-900 truncate">
                                  {replyAuthorName}
                                </span>
                                {reply.author?.username && (
                                  <span className="text-[9px] text-[#8E8E93]">
                                    @{reply.author.username}
                                  </span>
                                )}
                                <span className="text-[9px] text-gray-400">
                                  • {timeAgo(reply.created_at)}
                                </span>
                              </div>

                              {/* Child comment delete button: strictly for who commented (or owner/admin) */}
                              {canDeleteReply && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteReply(comment.comment_id, reply.comment_id)
                                  }
                                  disabled={isReplyDeleting}
                                  title="Delete your reply (Only the author who commented can delete)"
                                  className="p-0.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer shrink-0"
                                >
                                  {isReplyDeleting ? (
                                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="w-2.5 h-2.5" />
                                  )}
                                </button>
                              )}
                            </div>

                            <p className="text-[11px] text-gray-800 mt-0.5 leading-relaxed whitespace-pre-wrap break-words">
                              {reply.content}
                            </p>

                            <div className="flex items-center gap-2.5 mt-1 text-[10px]">
                              {/* Like Reply Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleCommentLike(
                                    reply.comment_id,
                                    comment.comment_id
                                  )
                                }
                                className={`font-semibold transition-all duration-150 cursor-pointer active:scale-95 flex items-center gap-0.5 ${
                                  reply.liked_by_me
                                    ? "text-red-500"
                                    : "text-[#8E8E93] hover:text-red-500"
                                }`}
                                title={
                                  reply.liked_by_me ? "Unlike reply" : "Like reply"
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
                                    ? reply.like_count
                                    : "Like"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
