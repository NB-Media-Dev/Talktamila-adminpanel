import { apiClient, getBaseUrl } from "@/services/api-client";
import type { CreatePostInput, FeedResponse, Poll } from "@/types/Posts";

const BASE = "/api/v1/posts";
const CHANGED_EVENT = "tt:posts-changed";

export const postService = {
  getFeed(limit = 10, beforeId?: number | null): Promise<FeedResponse> {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (beforeId) qs.set("before_id", String(beforeId));
    return apiClient<FeedResponse>(`${BASE}?${qs.toString()}`);
  },

  create(input: CreatePostInput): Promise<FeedResponse> {
    const fd = new FormData();
    fd.append("post_type", input.postType);
    if (input.content) fd.append("content", input.content);
    if (input.gifUrl) fd.append("gif_url", input.gifUrl);
    if (input.pollOptions) fd.append("poll_options", JSON.stringify(input.pollOptions));
    if (input.media) fd.append("media", input.media);
    return apiClient<FeedResponse>(BASE, { method: "POST", body: fd });
  },

  remove(postId: number): Promise<{ success: boolean; post_id: number }> {
    return apiClient(`${BASE}/${postId}`, { method: "DELETE" });
  },

  vote(postId: number, optionId: number): Promise<Poll> {
    return apiClient<Poll>(`${BASE}/${postId}/vote`, {
      method: "POST",
      body: JSON.stringify({ option_id: optionId }),
    });
  },

  mediaSrc(url: string): string {
    return /^https?:\/\//i.test(url) ? url : `${getBaseUrl()}${url}`;
  },
};

export function notifyPostsChanged(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGED_EVENT));
}

export function onPostsChanged(callback: () => void): () => void {
  window.addEventListener(CHANGED_EVENT, callback);
  return () => window.removeEventListener(CHANGED_EVENT, callback);
}