import { apiClient, getBaseUrl } from "@/services/api-client";
import type {
  CommentDeleteResult,
  CommentLikeState,
  CommentListResponse,
  CreatePostInput,
  EditPostInput,
  FeedResponse,
  LikeState,
  LikersResponse,
  Poll,
  PostComment,
  PostInsights,
  ReportReason,
  SaveState,
  ScheduledListResponse,
  ShareState,
} from "@/types/Posts";

const BASE = "/api/v1/posts";
const CHANGED_EVENT = "tt:posts-changed";

export const postService = {
  getFeed(limit = 10, beforeId?: number | null): Promise<FeedResponse> {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (beforeId) qs.set("before_id", String(beforeId));
    return apiClient<FeedResponse>(`${BASE}?${qs.toString()}`);
  },

  /** Published posts of one person, newest first, pinned posts on top (for the profile grid). */
  getUserPosts(username: string, limit = 30, offset = 0): Promise<FeedResponse> {
    const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return apiClient<FeedResponse>(
      `/api/v1/users/by-username/${encodeURIComponent(username)}/posts?${qs.toString()}`,
    );
  },

  /** One post. The answer holds it as items[0]. Used by shared links. */
  getOne(postId: number): Promise<FeedResponse> {
    return apiClient<FeedResponse>(`${BASE}/${postId}`);
  },

  /** Posts I saved. */
  getSaved(limit = 30, offset = 0): Promise<FeedResponse> {
    const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return apiClient<FeedResponse>(`${BASE}/saved?${qs.toString()}`);
  },

  /** My own archived posts. */
  getArchived(limit = 30, offset = 0): Promise<FeedResponse> {
    const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return apiClient<FeedResponse>(`${BASE}/archived?${qs.toString()}`);
  },

  create(input: CreatePostInput): Promise<FeedResponse> {
    const fd = new FormData();
    fd.append("post_type", input.postType);
    if (input.content) fd.append("content", input.content);
    if (input.gifUrl) fd.append("gif_url", input.gifUrl);
    if (input.pollOptions) fd.append("poll_options", JSON.stringify(input.pollOptions));
    if (input.media) fd.append("media", input.media);
    if (input.scheduledAt) fd.append("scheduled_at", input.scheduledAt);
    if (input.commentsDisabled) fd.append("comments_disabled", "true");
    if (input.hideLikeCount) fd.append("hide_like_count", "true");
    if (input.music) {
      const m = input.music;
      if (m.music_id !== undefined && m.music_id !== null) fd.append("music_id", String(m.music_id));
      fd.append("music_title", m.title);
      if (m.artist) fd.append("music_artist", m.artist);
      fd.append("music_url", m.audio_url);
      if (m.cover_url) fd.append("music_thumbnail", m.cover_url);
      fd.append("music_start_time", String(m.start_time));
      fd.append("music_duration", String(m.duration));
    }
    return apiClient<FeedResponse>(BASE, { method: "POST", body: fd });
  },

  /** Owner only: caption, song, comments on/off, hide like count. */
  edit(postId: number, input: EditPostInput): Promise<FeedResponse> {
    const body: Record<string, unknown> = {};
    if (input.content !== undefined) body.content = input.content;
    if (input.commentsDisabled !== undefined) body.comments_disabled = input.commentsDisabled;
    if (input.hideLikeCount !== undefined) body.hide_like_count = input.hideLikeCount;
    if (input.removeMusic) body.remove_music = true;
    else if (input.music) body.music = input.music;
    return apiClient<FeedResponse>(`${BASE}/${postId}`, { method: "PATCH", body: JSON.stringify(body) });
  },

  archive(postId: number): Promise<FeedResponse> {
    return apiClient<FeedResponse>(`${BASE}/${postId}/archive`, { method: "POST" });
  },

  restore(postId: number): Promise<FeedResponse> {
    return apiClient<FeedResponse>(`${BASE}/${postId}/restore`, { method: "POST" });
  },

  pin(postId: number): Promise<FeedResponse> {
    return apiClient<FeedResponse>(`${BASE}/${postId}/pin`, { method: "POST" });
  },

  unpin(postId: number): Promise<FeedResponse> {
    return apiClient<FeedResponse>(`${BASE}/${postId}/pin`, { method: "DELETE" });
  },

  /** Admin only. Posts waiting to go live, soonest first. */
  getScheduled(
    opts: { limit?: number; offset?: number; fromAt?: string; toAt?: string } = {},
  ): Promise<ScheduledListResponse> {
    const qs = new URLSearchParams({
      limit: String(opts.limit ?? 20),
      offset: String(opts.offset ?? 0),
    });
    if (opts.fromAt) qs.set("from_at", opts.fromAt);
    if (opts.toAt) qs.set("to_at", opts.toAt);
    return apiClient<ScheduledListResponse>(`${BASE}/scheduled?${qs.toString()}`);
  },

  /** Admin only. Move a scheduled post to a new time (ISO-8601 with timezone). */
  reschedule(postId: number, scheduledAt: string): Promise<FeedResponse> {
    return apiClient<FeedResponse>(`${BASE}/${postId}/schedule`, {
      method: "PATCH",
      body: JSON.stringify({ scheduled_at: scheduledAt }),
    });
  },

  /** Admin only. Publish a scheduled post right now. */
  publishNow(postId: number): Promise<FeedResponse> {
    return apiClient<FeedResponse>(`${BASE}/${postId}/publish`, { method: "POST" });
  },

  /** Deletes a published or archived post, or cancels a scheduled one. */
  remove(postId: number): Promise<{ success: boolean; post_id: number }> {
    return apiClient(`${BASE}/${postId}`, { method: "DELETE" });
  },

  vote(postId: number, optionId: number): Promise<Poll> {
    return apiClient<Poll>(`${BASE}/${postId}/vote`, {
      method: "POST",
      body: JSON.stringify({ option_id: optionId }),
    });
  },

  // ---- likes / saves / shares
  like(postId: number): Promise<LikeState> {
    return apiClient<LikeState>(`${BASE}/${postId}/like`, { method: "POST" });
  },

  unlike(postId: number): Promise<LikeState> {
    return apiClient<LikeState>(`${BASE}/${postId}/like`, { method: "DELETE" });
  },

  getLikers(postId: number, limit = 50, offset = 0): Promise<LikersResponse> {
    const qs = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    return apiClient<LikersResponse>(`${BASE}/${postId}/likes?${qs.toString()}`);
  },

  save(postId: number): Promise<SaveState> {
    return apiClient<SaveState>(`${BASE}/${postId}/save`, { method: "POST" });
  },

  unsave(postId: number): Promise<SaveState> {
    return apiClient<SaveState>(`${BASE}/${postId}/save`, { method: "DELETE" });
  },

  /** Count a share. For "dm", pass how many people it was sent to. */
  recordShare(postId: number, channel: "link" | "dm" | "other", recipients = 1): Promise<ShareState> {
    return apiClient<ShareState>(`${BASE}/${postId}/share`, {
      method: "POST",
      body: JSON.stringify({ channel, recipients }),
    });
  },

  recordView(postId: number): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`${BASE}/${postId}/view`, { method: "POST" });
  },

  report(postId: number, reason: ReportReason): Promise<{ success: boolean }> {
    return apiClient<{ success: boolean }>(`${BASE}/${postId}/report`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  },

  getInsights(postId: number): Promise<PostInsights> {
    return apiClient<PostInsights>(`${BASE}/${postId}/insights`);
  },

  // ---- comments
  getComments(postId: number, limit = 20, beforeId?: number | null): Promise<CommentListResponse> {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (beforeId) qs.set("before_id", String(beforeId));
    return apiClient<CommentListResponse>(`${BASE}/${postId}/comments?${qs.toString()}`);
  },

  getReplies(
    postId: number,
    commentId: number,
    limit = 20,
    afterId?: number | null,
  ): Promise<CommentListResponse> {
    const qs = new URLSearchParams({ limit: String(limit) });
    if (afterId) qs.set("after_id", String(afterId));
    return apiClient<CommentListResponse>(
      `${BASE}/${postId}/comments/${commentId}/replies?${qs.toString()}`,
    );
  },

  addComment(postId: number, body: string, parentId?: number | null): Promise<PostComment> {
    return apiClient<PostComment>(`${BASE}/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ body, parent_id: parentId ?? null }),
    });
  },

  deleteComment(postId: number, commentId: number): Promise<CommentDeleteResult> {
    return apiClient<CommentDeleteResult>(`${BASE}/${postId}/comments/${commentId}`, {
      method: "DELETE",
    });
  },

  likeComment(postId: number, commentId: number): Promise<CommentLikeState> {
    return apiClient<CommentLikeState>(`${BASE}/${postId}/comments/${commentId}/like`, {
      method: "POST",
    });
  },

  unlikeComment(postId: number, commentId: number): Promise<CommentLikeState> {
    return apiClient<CommentLikeState>(`${BASE}/${postId}/comments/${commentId}/like`, {
      method: "DELETE",
    });
  },

  mediaSrc(url: string): string {
    return /^https?:\/\//i.test(url) ? url : `${getBaseUrl()}${url}`;
  },

  /** The link people share. /post/<id> sends them to the right place for their role. */
  shareLink(postId: number): string {
    if (typeof window === "undefined") return `/post/${postId}`;
    return `${window.location.origin}/post/${postId}`;
  },
};

export function notifyPostsChanged(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHANGED_EVENT));
}

export function onPostsChanged(callback: () => void): () => void {
  window.addEventListener(CHANGED_EVENT, callback);
  return () => window.removeEventListener(CHANGED_EVENT, callback);
}