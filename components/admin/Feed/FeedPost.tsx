"use client";
import React, { useState, useEffect, useCallback } from "react";
import PostCard from "./PostCard";
import TopCreators from "../RightPanel/TopCreators";
import BreakingNews from "../dashboard/BreakingNews";
import TodaysEvents from "../dashboard/TodaysEvents";
import { onPostsChanged, postService } from "@/services/post.service";
import type { Poll, Post, PostAuthor } from "@/types/Posts";
import { FeedPostSkeleton } from "@/components/ui/Skeletonloading";
import FeedImagePost from "./FeedImagePost";
import FeedVideoPost from "./FeedVideoPost";
import FeedTextPost from "./FeedTextPost";
import FeedPollPost from "./FeedPollPost";

export default function FeedPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, PostAuthor>>({});
  const [loading, setLoading] = useState(true);

  const fetchFeed = useCallback(async () => {
    try {
      const res = await postService.getFeed(30);
      setPosts(res.items || []);
      setAuthors(res.authors || {});
    } catch (err) {
      console.error("Failed to load posts feed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    const unsub = onPostsChanged(() => {
      fetchFeed();
    });
    return unsub;
  }, [fetchFeed]);

  const handleDeleted = (postId: number) => {
    setPosts((prev) => prev.filter((p) => p.post_id !== postId));
  };

  const handlePollUpdated = (postId: number, poll: Poll) => {
    setPosts((prev) =>
      prev.map((p) => (p.post_id === postId ? { ...p, poll } : p))
    );
  };

  if (loading) {
    return (
      <div className="w-full gap-6 flex flex-col select-none">
        <FeedPostSkeleton />
        <FeedPostSkeleton />
      </div>
    );
  }

  // If no published posts exist in the database or local feed, show showcase starter posts
  if (posts.length === 0) {
    return (
      <div className="w-full gap-6 flex flex-col select-none">
        <FeedImagePost />
        <div className="md:hidden w-full">
          <BreakingNews />
        </div>
        <FeedVideoPost />
        <div className="md:hidden w-full">
          <TopCreators />
        </div>
        <FeedTextPost />
        <div className="md:hidden w-full">
          <TodaysEvents />
        </div>
        <FeedPollPost />
      </div>
    );
  }

  return (
    <div className="w-full gap-6 flex flex-col select-none">
      {posts.map((post, index) => {
        const author = authors[String(post.author_id)];
        return (
          <React.Fragment key={post.post_id}>
            <PostCard
              post={post}
              author={author}
              onDeleted={handleDeleted}
              onPollUpdated={handlePollUpdated}
            />

            {/* Intersperse widgets for responsive layout on mobile */}
            {index === 0 && (
              <div className="md:hidden w-full">
                <BreakingNews />
              </div>
            )}
            {index === 1 && (
              <div className="md:hidden w-full">
                <TopCreators />
              </div>
            )}
            {index === 2 && (
              <div className="md:hidden w-full">
                <TodaysEvents />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
