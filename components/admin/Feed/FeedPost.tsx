"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import PostCard from "./PostCard";
import TopCreators from "../RightPanel/TopCreators";
import BreakingNews from "../dashboard/BreakingNews";
import TodaysEvents from "../dashboard/TodaysEvents";
import { FeedPostSkeleton } from "@/components/ui/Skeletonloading";
import { onPostsChanged, postService } from "@/services/post.service";
import type { Poll, Post, PostAuthor } from "@/types/Posts";

const PAGE_SIZE = 10;

// Small mobile-only widgets that used to sit between the sample posts.
const MOBILE_WIDGETS = [BreakingNews, TopCreators, TodaysEvents];

export default function FeedPost() {
  const [items, setItems] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, PostAuthor>>({});
  const [hasMore, setHasMore] = useState(false);
  const [nextBefore, setNextBefore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const busyRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const fetchFirst = useCallback(async () => {
    try {
      const res = await postService.getFeed(PAGE_SIZE);
      setItems(res.items);
      setAuthors(res.authors);
      setHasMore(res.has_more);
      setNextBefore(res.next_before_id);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the feed.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || nextBefore == null || busyRef.current) return;
    busyRef.current = true;
    setLoadingMore(true);
    try {
      const res = await postService.getFeed(PAGE_SIZE, nextBefore);
      setItems((prev) => [...prev, ...res.items.filter((n) => !prev.some((o) => o.post_id === n.post_id))]);
      setAuthors((prev) => ({ ...prev, ...res.authors }));
      setHasMore(res.has_more);
      setNextBefore(res.next_before_id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load more posts.");
    } finally {
      busyRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore, nextBefore]);

  // First load, and reload whenever a post is created anywhere on the page.
  useEffect(() => {
    void fetchFirst();
    return onPostsChanged(() => {
      void fetchFirst();
    });
  }, [fetchFirst]);

  // Infinite scroll.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loadMore]);

  const handleDeleted = (postId: number) => setItems((prev) => prev.filter((p) => p.post_id !== postId));

  const handlePollUpdated = (postId: number, poll: Poll) =>
    setItems((prev) => prev.map((p) => (p.post_id === postId ? { ...p, poll } : p)));

  if (loading) {
    return (
      <div className="w-full gap-6 flex flex-col select-none">
        <FeedPostSkeleton />
        <FeedPostSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full gap-6 flex flex-col select-none">
      {error && (
        <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-100 text-red-600 text-[13px] rounded-2xl px-4 py-3">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              setError(null);
              void fetchFirst();
            }}
            className="font-bold underline cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {!error && items.length === 0 && (
        <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-8 border border-[#FFEFE0] text-center">
          <p className="text-[15px] font-bold text-gray-900">No posts yet</p>
          <p className="text-[13px] text-[#8E8E93] mt-1">New posts will show up here.</p>
        </div>
      )}

      {items.map((post, i) => {
        const Widget = MOBILE_WIDGETS[i];
        return (
          <Fragment key={post.post_id}>
            <PostCard
              post={post}
              author={authors[String(post.author_id)]}
              onDeleted={handleDeleted}
              onPollUpdated={handlePollUpdated}
            />
            {Widget && (
              <div className="md:hidden w-full">
                <Widget />
              </div>
            )}
          </Fragment>
        );
      })}

      {/* if there are fewer posts than widgets, still show the remaining widgets on mobile */}
      {MOBILE_WIDGETS.slice(items.length).map((Widget, i) => (
        <div key={`w-${i}`} className="md:hidden w-full">
          <Widget />
        </div>
      ))}

      {hasMore && (
        <div ref={sentinelRef} className="flex items-center justify-center py-4">
          {loadingMore ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#FF6B35]" />
          ) : (
            <button
              type="button"
              onClick={() => void loadMore()}
              className="text-[13px] font-semibold text-[#E05D24] hover:underline cursor-pointer"
            >
              Load more
            </button>
          )}
        </div>
      )}
    </div>
  );
}