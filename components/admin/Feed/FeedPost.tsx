"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import PostCard from "./PostCard";
import TopCreators from "../RightPanel/TopCreators";
import BreakingNews from "../dashboard/BreakingNews";
import TodaysEvents from "../dashboard/TodaysEvents";
import { FeedListSkeleton } from "@/components/ui/Skeletonloading";
import { onPostsChanged, postService } from "@/services/post.service";
import type { Poll, Post, PostAuthor } from "@/types/Posts";

const PAGE_SIZE = 10;
const REFRESH_MS = 20000;

// The real feed: every published post, newest first. A scheduled post shows up here
// by itself a few seconds after it goes live.
export default function FeedPost() {
  const [first, setFirst] = useState<Post[]>([]);
  const [older, setOlder] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, PostAuthor>>({});
  const [hasMoreFirst, setHasMoreFirst] = useState(false);
  const [hasMoreOlder, setHasMoreOlder] = useState(false);
  const [nextBeforeId, setNextBeforeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const olderCountRef = useRef(0);
  useEffect(() => {
    olderCountRef.current = older.length;
  }, [older.length]);

  const loadFirst = useCallback(async (silent: boolean) => {
    try {
      const res = await postService.getFeed(PAGE_SIZE);
      setFirst((prev) => (JSON.stringify(prev) === JSON.stringify(res.items) ? prev : res.items));
      setAuthors((prev) => ({ ...prev, ...res.authors }));
      setHasMoreFirst(res.has_more);
      setNextBeforeId((prev) => (olderCountRef.current === 0 ? res.next_before_id : prev));
      setError(null);
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : "Could not load the feed.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirst(false);
  }, [loadFirst]);

  // A post was created, deleted or published somewhere in the app.
  useEffect(() => onPostsChanged(() => loadFirst(true)), [loadFirst]);

  // Poll quietly so scheduled posts appear when their time comes.
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

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !nextBeforeId) return;
    setLoadingMore(true);
    try {
      const res = await postService.getFeed(PAGE_SIZE, nextBeforeId);
      setOlder((prev) => [...prev, ...res.items]);
      setAuthors((prev) => ({ ...prev, ...res.authors }));
      setHasMoreOlder(res.has_more);
      setNextBeforeId(res.next_before_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load more posts.");
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, nextBeforeId]);

  // Load the next page when the bottom of the feed scrolls into view.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore, posts.length]);

  function handleDeleted(postId: number) {
    setFirst((prev) => prev.filter((p) => p.post_id !== postId));
    setOlder((prev) => prev.filter((p) => p.post_id !== postId));
  }

  function handlePoll(postId: number, poll: Poll) {
    const apply = (list: Post[]) => list.map((p) => (p.post_id === postId ? { ...p, poll } : p));
    setFirst(apply);
    setOlder(apply);
  }

  // Small-screen widgets, spread between the posts like before.
  const widgets = [<BreakingNews key="news" />, <TopCreators key="creators" />, <TodaysEvents key="events" />];

  if (loading) {
    return (
      <div className="w-full">
        <FeedListSkeleton count={2} />
      </div>
    );
  }

  return (
    <div className="w-full gap-6 flex flex-col">
      {error && posts.length === 0 && (
        <div className="w-full bg-white rounded-[24px] border border-[#FFEFE0] p-6 text-center">
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
      )}

      {!error && posts.length === 0 && (
        <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] border border-[#FFEFE0] p-8 text-center">
          <p className="text-base font-bold text-gray-900">No posts yet</p>
          <p className="text-sm text-gray-500 mt-1">New posts will appear here as soon as they are published.</p>
        </div>
      )}

      {posts.map((post, index) => (
        <React.Fragment key={post.post_id}>
          <PostCard
            post={{ ...post, created_at: post.published_at || post.created_at }}
            author={authors[String(post.author_id)]}
            onDeleted={handleDeleted}
            onPollUpdated={handlePoll}
          />
          {index < widgets.length && <div className="md:hidden w-full">{widgets[index]}</div>}
        </React.Fragment>
      ))}

      {/* If there are fewer posts than widgets, still show the rest on small screens. */}
      {posts.length < widgets.length &&
        widgets.slice(posts.length).map((widget, i) => (
          <div key={`extra-${i}`} className="md:hidden w-full">
            {widget}
          </div>
        ))}

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-4">
          {loadingMore ? (
            <Loader2 className="w-6 h-6 text-brand animate-spin" />
          ) : (
            <button
              type="button"
              onClick={loadMore}
              className="px-5 py-2 text-sm font-bold text-[#FF6B35] rounded-full border border-orange-100 hover:bg-orange-50 cursor-pointer"
            >
              Load more
            </button>
          )}
        </div>
      )}

      {error && posts.length > 0 && <p className="text-center text-xs text-red-600">{error}</p>}
    </div>
  );
}