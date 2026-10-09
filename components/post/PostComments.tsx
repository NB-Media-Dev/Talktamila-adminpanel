"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import RichText from "@/components/post/RichText";
import { postService } from "@/services/post.service";
import { getInitials, initialsAvatar } from "@/lib/avatar";
import { timeAgo } from "@/lib/timeAgo";
import { useProfileLink } from "@/hooks/useProfileLink";
import { POST_LIMITS, type Post, type PostComment } from "@/types/Posts";

interface PostCommentsProps {
  post: Post;
  /** Called with the new total (comments + replies) whenever it changes. */
  onCountChange?: (total: number) => void;
  autoFocus?: boolean;
}

interface ReplyState {
  items: PostComment[];
  open: boolean;
  loading: boolean;
  hasMore: boolean;
  cursor: number | null;
}

interface ReplyTarget {
  rootId: number;
  username: string;
}

function CommentRow({
  comment,
  isReply,
  onLike,
  onReply,
  onDelete,
  onOpenProfile,
}: {
  comment: PostComment;
  isReply: boolean;
  onLike: (c: PostComment) => void;
  onReply: (c: PostComment) => void;
  onDelete: (c: PostComment) => void;
  onOpenProfile: (username: string) => void;
}) {
  const a = comment.author;
  const avatar = a.avatar_url || initialsAvatar(getInitials({ name: a.name, username: a.username }));
  return (
    <div className="flex items-start gap-2.5">
      <button type="button" onClick={() => onOpenProfile(a.username)} className="shrink-0 cursor-pointer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt=""
          className={`${isReply ? "w-6 h-6" : "w-8 h-8"} rounded-full object-cover border border-[#FFEFE0] bg-gray-50`}
        />
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-gray-800 leading-snug break-words whitespace-pre-wrap">
          <button
            type="button"
            onClick={() => onOpenProfile(a.username)}
            className="font-bold text-gray-900 mr-1.5 cursor-pointer"
          >
            {a.username}
          </button>
          {comment.by_post_owner && (
            <span className="mr-1.5 rounded-full bg-[#FFF6ED] border border-[#FFEFE0] px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-[#E05D24]">
              Author
            </span>
          )}
          <RichText text={comment.body} />
        </p>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-[#8E8E93]">
          <span>{timeAgo(comment.created_at)}</span>
          {comment.like_count > 0 && (
            <span className="font-semibold">
              {comment.like_count.toLocaleString()} {comment.like_count === 1 ? "like" : "likes"}
            </span>
          )}
          <button type="button" onClick={() => onReply(comment)} className="font-semibold hover:text-gray-700 cursor-pointer">
            Reply
          </button>
          {comment.can_delete && (
            <button
              type="button"
              onClick={() => onDelete(comment)}
              aria-label="Delete comment"
              className="hover:text-red-500 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onLike(comment)}
        aria-label={comment.liked_by_me ? "Unlike comment" : "Like comment"}
        aria-pressed={comment.liked_by_me}
        className="shrink-0 p-1 cursor-pointer"
      >
        <Heart
          className={`w-3.5 h-3.5 ${comment.liked_by_me ? "fill-red-500 text-red-500" : "text-[#8E8E93] hover:text-gray-700"}`}
        />
      </button>
    </div>
  );
}

export default function PostComments({ post, onCountChange, autoFocus = false }: PostCommentsProps) {
  const { openProfile } = useProfileLink();
  const postId = post.post_id;

  const [items, setItems] = useState<PostComment[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [disabled, setDisabled] = useState(Boolean(post.comments_disabled));
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<number, ReplyState>>({});

  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<ReplyTarget | null>(null);
  const [posting, setPosting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const onCountRef = useRef(onCountChange);
  useEffect(() => {
    onCountRef.current = onCountChange;
  }, [onCountChange]);

  const setTotalAndTell = useCallback((n: number) => {
    setTotal(n);
    onCountRef.current?.(n);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    postService
      .getComments(postId, 20)
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setHasMore(res.has_more);
        setCursor(res.next_cursor);
        setDisabled(res.comments_disabled);
        setTotal(res.total);
        onCountRef.current?.(res.total);
        setError(null);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load the comments.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  useEffect(() => {
    if (autoFocus && !loading) inputRef.current?.focus();
  }, [autoFocus, loading]);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await postService.getComments(postId, 20, cursor);
      setItems((prev) => {
        const seen = new Set(prev.map((c) => c.comment_id));
        return [...prev, ...res.items.filter((c) => !seen.has(c.comment_id))];
      });
      setHasMore(res.has_more);
      setCursor(res.next_cursor);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load more comments.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function toggleReplies(comment: PostComment) {
    const current = replies[comment.comment_id];
    if (current?.open) {
      setReplies((prev) => ({ ...prev, [comment.comment_id]: { ...current, open: false } }));
      return;
    }
    if (current && current.items.length > 0) {
      setReplies((prev) => ({ ...prev, [comment.comment_id]: { ...current, open: true } }));
      return;
    }
    setReplies((prev) => ({
      ...prev,
      [comment.comment_id]: { items: [], open: true, loading: true, hasMore: false, cursor: null },
    }));
    try {
      const res = await postService.getReplies(postId, comment.comment_id, 20);
      setReplies((prev) => ({
        ...prev,
        [comment.comment_id]: {
          items: res.items,
          open: true,
          loading: false,
          hasMore: res.has_more,
          cursor: res.next_cursor,
        },
      }));
    } catch (e) {
      setReplies((prev) => ({
        ...prev,
        [comment.comment_id]: { items: [], open: false, loading: false, hasMore: false, cursor: null },
      }));
      setError(e instanceof Error ? e.message : "Could not load the replies.");
    }
  }

  async function moreReplies(rootId: number) {
    const current = replies[rootId];
    if (!current || current.loading || !current.hasMore) return;
    setReplies((prev) => ({ ...prev, [rootId]: { ...current, loading: true } }));
    try {
      const res = await postService.getReplies(postId, rootId, 20, current.cursor);
      setReplies((prev) => {
        const cur = prev[rootId] ?? current;
        const seen = new Set(cur.items.map((c) => c.comment_id));
        return {
          ...prev,
          [rootId]: {
            ...cur,
            items: [...cur.items, ...res.items.filter((c) => !seen.has(c.comment_id))],
            loading: false,
            hasMore: res.has_more,
            cursor: res.next_cursor,
          },
        };
      });
    } catch (e) {
      setReplies((prev) => ({ ...prev, [rootId]: { ...current, loading: false } }));
      setError(e instanceof Error ? e.message : "Could not load more replies.");
    }
  }

  function startReply(c: PostComment) {
    const rootId = c.parent_id ?? c.comment_id;
    setReplyTo({ rootId, username: c.author.username });
    setText(`@${c.author.username} `);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function cancelReply() {
    setReplyTo(null);
    setText("");
  }

  async function submit() {
    const body = text.trim();
    if (!body || posting) return;
    setPosting(true);
    setError(null);
    try {
      const created = await postService.addComment(postId, body, replyTo?.rootId ?? null);
      if (replyTo) {
        const rootId = replyTo.rootId;
        setReplies((prev) => {
          const cur = prev[rootId] ?? { items: [], open: true, loading: false, hasMore: false, cursor: null };
          return { ...prev, [rootId]: { ...cur, open: true, items: [...cur.items, created] } };
        });
        setItems((prev) =>
          prev.map((c) => (c.comment_id === rootId ? { ...c, reply_count: c.reply_count + 1 } : c))
        );
      } else {
        setItems((prev) => [created, ...prev]);
      }
      setTotalAndTell(total + 1);
      setText("");
      setReplyTo(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not post your comment.");
    } finally {
      setPosting(false);
    }
  }

  async function toggleLike(c: PostComment) {
    const willLike = !c.liked_by_me;
    const apply = (list: PostComment[], liked: boolean, count: number) =>
      list.map((x) => (x.comment_id === c.comment_id ? { ...x, liked_by_me: liked, like_count: count } : x));
    const patchAll = (liked: boolean, count: number) => {
      setItems((prev) => apply(prev, liked, count));
      setReplies((prev) => {
        const next: Record<number, ReplyState> = {};
        for (const [k, v] of Object.entries(prev)) next[Number(k)] = { ...v, items: apply(v.items, liked, count) };
        return next;
      });
    };
    patchAll(willLike, Math.max(0, c.like_count + (willLike ? 1 : -1)));
    try {
      const res = willLike
        ? await postService.likeComment(postId, c.comment_id)
        : await postService.unlikeComment(postId, c.comment_id);
      patchAll(res.liked, res.like_count);
    } catch (e) {
      patchAll(c.liked_by_me, c.like_count);
      setError(e instanceof Error ? e.message : "Could not update your like.");
    }
  }

  async function remove(c: PostComment) {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const res = await postService.deleteComment(postId, c.comment_id);
      if (c.parent_id) {
        const rootId = c.parent_id;
        setReplies((prev) => {
          const cur = prev[rootId];
          if (!cur) return prev;
          return { ...prev, [rootId]: { ...cur, items: cur.items.filter((x) => x.comment_id !== c.comment_id) } };
        });
        setItems((prev) =>
          prev.map((x) => (x.comment_id === rootId ? { ...x, reply_count: Math.max(0, x.reply_count - 1) } : x))
        );
      } else {
        setItems((prev) => prev.filter((x) => x.comment_id !== c.comment_id));
        setReplies((prev) => {
          const next = { ...prev };
          delete next[c.comment_id];
          return next;
        });
      }
      if (replyTo && replyTo.rootId === c.comment_id) cancelReply();
      setTotalAndTell(res.comment_count);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete the comment.");
    }
  }

  if (disabled) {
    return <p className="text-[12px] text-[#8E8E93] text-center py-2">Comments are turned off for this post.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {loading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF6B35]" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-[12px] text-[#8E8E93] text-center py-2">No comments yet. Start the conversation.</p>
      ) : (
        <ul className="flex flex-col gap-3.5 max-h-[360px] overflow-y-auto pr-1">
          {items.map((c) => {
            const r = replies[c.comment_id];
            return (
              <li key={c.comment_id} className="flex flex-col gap-2">
                <CommentRow
                  comment={c}
                  isReply={false}
                  onLike={toggleLike}
                  onReply={startReply}
                  onDelete={remove}
                  onOpenProfile={openProfile}
                />
                {c.reply_count > 0 && (
                  <div className="pl-10 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleReplies(c)}
                      className="self-start text-[11px] font-semibold text-[#8E8E93] hover:text-gray-700 cursor-pointer flex items-center gap-2"
                    >
                      <span className="w-6 h-px bg-[#D9D9DE]" />
                      {r?.open ? "Hide replies" : `View ${c.reply_count} ${c.reply_count === 1 ? "reply" : "replies"}`}
                    </button>
                    {r?.open && (
                      <>
                        {r.items.map((rc) => (
                          <CommentRow
                            key={rc.comment_id}
                            comment={rc}
                            isReply
                            onLike={toggleLike}
                            onReply={startReply}
                            onDelete={remove}
                            onOpenProfile={openProfile}
                          />
                        ))}
                        {r.loading && <Loader2 className="w-4 h-4 animate-spin text-[#FF6B35]" />}
                        {r.hasMore && !r.loading && (
                          <button
                            type="button"
                            onClick={() => moreReplies(c.comment_id)}
                            className="self-start text-[11px] font-semibold text-[#8E8E93] hover:text-gray-700 cursor-pointer"
                          >
                            View more replies
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })}
          {hasMore && (
            <li className="flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="text-[12px] font-bold text-[#FF6B35] disabled:opacity-60 cursor-pointer"
              >
                {loadingMore ? "Loading…" : "Load more comments"}
              </button>
            </li>
          )}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {replyTo && (
        <div className="flex items-center justify-between rounded-full bg-[#FFF6ED] border border-[#FFEFE0] px-3 py-1 text-[11px] text-[#9b4811]">
          <span>Replying to @{replyTo.username}</span>
          <button type="button" onClick={cancelReply} className="font-bold cursor-pointer">
            Cancel
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-[#FFEFE0] pt-2.5">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          maxLength={POST_LIMITS.commentLength}
          placeholder={replyTo ? "Write a reply…" : "Add a comment…"}
          className="flex-1 min-w-0 bg-transparent outline-none text-[13px] text-gray-800 placeholder:text-[#8E8E93]"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!text.trim() || posting}
          className="text-[13px] font-bold text-[#FF6B35] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {posting ? "Posting…" : "Post"}
        </button>
      </div>
    </div>
  );
}