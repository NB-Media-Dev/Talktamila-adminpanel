"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Archive, Bookmark, Camera, Copy, Heart, Loader2, MessageCircle, Music, Pin, Video, X } from "lucide-react";
import PostCard from "@/components/admin/Feed/PostCard";
import { notifyPostsChanged, onPostsChanged, postService } from "@/services/post.service";
import type { FeedResponse, Poll, Post, PostAuthor } from "@/types/Posts";
import DemoPosts from "@/components/profile/DemoPosts";

const PAGE_SIZE = 30;
const REFRESH_MS = 15000;

export type ProfilePostsSource = "posts" | "saved" | "archived";

interface ProfilePostsProps {
  username: string;
  /** "posts" = this person's posts, "saved" = what I saved, "archived" = my archived posts. */
  source?: ProfilePostsSource;
  /** Change this (for example the posts count) to reload the grid. */
  refreshKey?: number | string;
  isMe?: boolean;
  /** Set for roles that show hard-coded sample posts for now (see lib/demoPosts.ts). */
  demoRole?: string;
  /** Called when the list of posts changed, so the page can refresh its counts. */
  onChanged?: () => void;
  /** Used with demoRole: show nothing (no spinner / empty message) when there are no live posts. */
  hideEmpty?: boolean;
}

function Tile({ post, onOpen }: { post: Post; onOpen: () => void }) {
  const base =
    "relative aspect-square w-full overflow-hidden bg-[#FFF6ED] cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]";

  let media: React.ReactNode;
  if (post.post_type === "image" && post.media_url) {
    media = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={postService.mediaSrc(post.media_url)}
        alt={post.content || "Post image"}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  } else if (post.post_type === "video" && post.media_url) {
    media = (
      <video
        src={`${postService.mediaSrc(post.media_url)}#t=0.1`}
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
    );
  } else if (post.post_type === "gif" && post.gif_url) {
    media = (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={post.gif_url} alt="GIF" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
    );
  } else {
    media = (
      <div className="absolute inset-0 flex flex-col justify-center gap-2 p-3 sm:p-4 bg-gradient-to-br from-[#FFF6ED] to-[#FCE3CC]">
        {post.post_type === "poll" && (
          <span className="self-start rounded-full border border-[#FFEFE0] bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#E05D24]">
            Poll
          </span>
        )}
        <p className="text-[11px] sm:text-sm font-semibold text-gray-800 leading-snug line-clamp-5 break-words whitespace-pre-line">
          {post.content || "Post"}
        </p>
      </div>
    );
  }

  const showLikes = post.like_count !== null && post.like_count !== undefined;

  return (
    <button type="button" onClick={onOpen} aria-label="Open post" className={base}>
      {media}
      {/* small badges in the corner */}
      <span className="absolute top-2 right-2 flex items-center gap-1.5 text-white drop-shadow">
        {post.is_pinned && <Pin className="w-4 h-4 fill-current" />}
        {post.music && <Music className="w-4 h-4" />}
        {(post.media_urls?.length ?? 0) > 1 && <Copy className="w-4 h-4" aria-label="Carousel" />}
        {post.post_type === "video" && <Video className="w-4 h-4" />}
        {post.post_type === "gif" && (
          <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold">GIF</span>
        )}
      </span>
      {/* counts on hover, like Instagram */}
      <span className="absolute inset-0 flex items-center justify-center gap-4 bg-black/0 group-hover:bg-black/35 text-white text-sm font-bold opacity-0 group-hover:opacity-100 transition-all">
        {showLikes && (
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 fill-current" /> {(post.like_count ?? 0).toLocaleString()}
          </span>
        )}
        {!post.comments_disabled && (
          <span className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 fill-current" /> {(post.comment_count ?? 0).toLocaleString()}
          </span>
        )}
      </span>
    </button>
  );
}

export default function ProfilePosts(props: ProfilePostsProps) {
  if (props.demoRole && (props.source ?? "posts") === "posts") {
    // Real posts first, the hard-coded sample posts underneath.
    return (
      <>
        <LivePosts {...props} hideEmpty />
        <DemoPosts username={props.username} role={props.demoRole} />
      </>
    );
  }
  return <LivePosts {...props} />;
}

function LivePosts({
  username,
  source = "posts",
  refreshKey,
  isMe = false,
  onChanged,
  hideEmpty = false,
}: ProfilePostsProps) {
  const [first, setFirst] = useState<Post[]>([]);
  const [older, setOlder] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, PostAuthor>>({});
  const [hasMoreFirst, setHasMoreFirst] = useState(false);
  const [hasMoreOlder, setHasMoreOlder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [extra, setExtra] = useState<Post | null>(null);

  const idsRef = useRef<string>("");
  const deepLinkDone = useRef(false);
  const onChangedRef = useRef(onChanged);
  useEffect(() => {
    onChangedRef.current = onChanged;
  }, [onChanged]);

  const fetchPage = useCallback(
    (limit: number, offset: number): Promise<FeedResponse> => {
      if (source === "saved") return postService.getSaved(limit, offset);
      if (source === "archived") return postService.getArchived(limit, offset);
      return postService.getUserPosts(username, limit, offset);
    },
    [source, username]
  );

  const loadFirst = useCallback(
    async (silent: boolean) => {
      try {
        const res = await fetchPage(PAGE_SIZE, 0);
        const ids = res.items.map((p) => p.post_id).join(",");
        const idsChanged = idsRef.current !== "" && idsRef.current !== ids;
        idsRef.current = ids || "none";

        setFirst((prev) => (JSON.stringify(prev) === JSON.stringify(res.items) ? prev : res.items));
        setAuthors((prev) => ({ ...prev, ...res.authors }));
        setHasMoreFirst(res.has_more);
        setError(null);
        if (idsChanged) onChangedRef.current?.();
      } catch (e) {
        if (!silent) setError(e instanceof Error ? e.message : "Could not load posts.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [fetchPage]
  );

  // First load, and a clean start when the person or the tab changes.
  useEffect(() => {
    setFirst([]);
    setOlder([]);
    setHasMoreFirst(false);
    setHasMoreOlder(false);
    setSelectedId(null);
    setLoading(true);
    idsRef.current = "";
    loadFirst(false);
  }, [loadFirst]);

  // Reload quietly when the page says something changed (for example the posts count).
  useEffect(() => {
    if (refreshKey === undefined) return;
    loadFirst(true);
  }, [refreshKey, loadFirst]);

  // A post made, pinned or deleted elsewhere in the app.
  useEffect(() => onPostsChanged(() => loadFirst(true)), [loadFirst]);

  // Keep the grid current so a scheduled post shows up when it goes live and counts stay fresh.
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) loadFirst(true);
    };
    const id = setInterval(tick, REFRESH_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [loadFirst]);

  const posts = useMemo(() => {
    const seen = new Set(first.map((p) => p.post_id));
    return [...first, ...older.filter((p) => !seen.has(p.post_id))];
  }, [first, older]);

  const hasMore = older.length > 0 ? hasMoreOlder : hasMoreFirst;

  // A shared link (?post=123) opens that post as soon as the grid has loaded.
  useEffect(() => {
    if (source !== "posts" || loading || deepLinkDone.current) return;
    const raw = new URLSearchParams(window.location.search).get("post");
    const id = raw ? Number(raw) : NaN;
    deepLinkDone.current = true;
    if (!Number.isInteger(id) || id <= 0) return;
    if (posts.some((p) => p.post_id === id)) {
      setSelectedId(id);
      return;
    }
    postService
      .getOne(id)
      .then((res) => {
        const item = res.items[0];
        if (!item) return;
        // Only show it here if it belongs to the profile that is open.
        const a = res.authors[String(item.author_id)];
        if (a && a.username.toLowerCase() !== username.toLowerCase()) return;
        setAuthors((prev) => ({ ...prev, ...res.authors }));
        setExtra(item);
        setSelectedId(item.post_id);
      })
      .catch(() => {});
  }, [source, loading, posts, username]);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const res = await fetchPage(PAGE_SIZE, posts.length);
      setOlder((prev) => [...prev, ...res.items]);
      setAuthors((prev) => ({ ...prev, ...res.authors }));
      setHasMoreOlder(res.has_more);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load more posts.");
    } finally {
      setLoadingMore(false);
    }
  }

  function closeViewer() {
    setSelectedId(null);
    setExtra(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has("post")) {
      url.searchParams.delete("post");
      window.history.replaceState(null, "", url.pathname + (url.search || "") + url.hash);
    }
  }

  function dropPost(postId: number) {
    setFirst((prev) => prev.filter((p) => p.post_id !== postId));
    setOlder((prev) => prev.filter((p) => p.post_id !== postId));
    closeViewer();
    notifyPostsChanged();
    onChangedRef.current?.();
  }

  function handleUpdated(next: Post) {
    const apply = (list: Post[]) => list.map((p) => (p.post_id === next.post_id ? next : p));
    setFirst(apply);
    setOlder(apply);
    setExtra((prev) => (prev && prev.post_id === next.post_id ? next : prev));
  }

  function handlePoll(postId: number, poll: Poll) {
    const apply = (list: Post[]) => list.map((p) => (p.post_id === postId ? { ...p, poll } : p));
    setFirst(apply);
    setOlder(apply);
  }

  // Close the viewer with Escape and stop the page behind it from scrolling.
  useEffect(() => {
    if (selectedId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [selectedId]);

  if (hideEmpty && (loading || posts.length === 0)) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-14">
        <Loader2 className="w-7 h-7 text-brand animate-spin" />
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            loadFirst(false);
          }}
          className="mt-3 text-sm font-bold text-[#FF6B35] cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    const Icon = source === "saved" ? Bookmark : source === "archived" ? Archive : Camera;
    const title =
      source === "saved"
        ? "Save what you like"
        : source === "archived"
          ? "Nothing archived"
          : isMe
            ? "Share your first post"
            : "No posts yet";
    const text =
      source === "saved"
        ? "Tap the bookmark on a post to keep it here. Only you can see what you saved."
        : source === "archived"
          ? "Posts you archive are hidden from your profile and show up here."
          : isMe
            ? "When you share a post, it will appear here."
            : `Posts shared by @${username} will appear here.`;
    return (
      <div className="flex flex-col items-center text-center px-6 py-14">
        <div className="w-16 h-16 rounded-full border-2 border-[#FF6B35] text-[#FF6B35] flex items-center justify-center">
          <Icon className="w-7 h-7" />
        </div>
        <p className="mt-4 text-base font-bold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">{text}</p>
      </div>
    );
  }

  const selected =
    selectedId !== null
      ? posts.find((p) => p.post_id === selectedId) ?? (extra && extra.post_id === selectedId ? extra : undefined)
      : undefined;

  return (
    <>
      <div className="grid grid-cols-3 gap-0.5 sm:gap-1 p-0.5 sm:p-1">
        {posts.map((post) => (
          <Tile key={post.post_id} post={post} onOpen={() => setSelectedId(post.post_id)} />
        ))}
      </div>

      {error && <p className="px-4 pb-3 text-center text-xs text-red-600">{error}</p>}

      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="px-5 py-2 text-sm font-bold text-[#FF6B35] rounded-full border border-orange-100 hover:bg-orange-50 disabled:opacity-60 cursor-pointer"
          >
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        </div>
      )}

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Post"
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 p-3 sm:p-6 overflow-y-auto"
          onClick={closeViewer}
        >
          <div className="relative w-full max-w-xl my-auto" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={closeViewer}
              aria-label="Close"
              className="absolute -top-3 -right-1 sm:-right-3 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-[#FF6B35] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <PostCard
              post={selected}
              author={authors[String(selected.author_id)]}
              onDeleted={dropPost}
              onRemoved={dropPost}
              onUpdated={handleUpdated}
              onPollUpdated={handlePoll}
            />
          </div>
        </div>
      )}
    </>
  );
}