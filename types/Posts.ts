export type PostType = "text" | "image" | "video" | "gif" | "poll";

export interface PostAuthor {
  user_id: number;
  name: string;
  username: string;
  role: string;
  avatar_url?: string | null;
}

export interface PollOption {
  option_id: number;
  text: string;
  votes: number;
}

export interface Poll {
  options: PollOption[];
  total_votes: number;
  my_vote_option_id: number | null;
}

export type PostStatus = "published" | "scheduled" | "archived";

/** A song on a post. The same shape is sent to the server and read back. */
export interface PostMusic {
  music_id?: number | null;
  title: string;
  artist?: string | null;
  audio_url: string;
  cover_url?: string | null;
  /** Where in the song the clip starts (seconds) */
  start_time: number;
  /** How long the clip plays (seconds) */
  duration: number;
}

export interface LikerPreview {
  user_id: number;
  username: string;
}

export interface Post {
  post_id: number;
  author_id: number;
  post_type: PostType;
  status: PostStatus;
  content?: string | null;
  media_type?: "image" | "video" | null;
  media_url?: string | null;
  /** Every picture of a carousel, in order (one entry for a normal photo post). */
  media_urls?: string[];
  gif_url?: string | null;
  poll?: Poll | null;
  created_at: string; // ISO-8601 UTC, ends with "Z"
  scheduled_at?: string | null; // when it is due to go live (UTC, "Z")
  published_at?: string | null; // null while still scheduled
  can_delete: boolean;

  // Engagement. Everything below is optional so older code that builds a Post still compiles.
  /** null when the owner hid the like count (the owner still gets the number) */
  like_count?: number | null;
  likes_hidden?: boolean;
  comment_count?: number;
  share_count?: number;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
  liked_by_preview?: LikerPreview | null;

  // Roles and owner settings
  is_owner?: boolean;
  can_edit?: boolean;
  following_author?: boolean;
  comments_disabled?: boolean;
  hide_like_count?: boolean;
  is_pinned?: boolean;
  edited_at?: string | null;
  music?: PostMusic | null;
}

export interface ScheduledListResponse {
  items: Post[];
  authors: Record<string, PostAuthor>;
  total: number;
  limit: number;
  offset: number;
}

export interface FeedResponse {
  items: Post[];
  authors: Record<string, PostAuthor>;
  has_more: boolean;
  next_before_id: number | null;
}

export interface CreatePostInput {
  postType: PostType;
  content?: string;
  media?: File;
  /** Pictures 2, 3, ... of a carousel (the first picture is `media`). Photos only. */
  extraMedia?: File[];
  gifUrl?: string;
  pollOptions?: string[];
  /** ISO-8601 WITH timezone, e.g. new Date(...).toISOString(). 1 minute to 365 days ahead. Omit to post now. */
  scheduledAt?: string;
  /** A song from the same picker the stories use. Not allowed on videos. */
  music?: PostMusic | null;
  commentsDisabled?: boolean;
  hideLikeCount?: boolean;
}

/** Only the fields you send are changed. */
export interface EditPostInput {
  content?: string;
  commentsDisabled?: boolean;
  hideLikeCount?: boolean;
  /** Set or replace the song */
  music?: PostMusic | null;
  /** Take the song off */
  removeMusic?: boolean;
}

export interface LikeState {
  liked: boolean;
  like_count: number | null;
}

export interface SaveState {
  saved: boolean;
}

export interface ShareState {
  share_count: number;
}

export interface PostUser {
  user_id: number;
  username: string;
  name: string;
  avatar_url?: string | null;
  role?: string | null;
}

export interface LikersResponse {
  items: PostUser[];
  total: number;
}

export interface PostComment {
  comment_id: number;
  post_id: number;
  parent_id: number | null;
  body: string;
  created_at: string;
  author: PostAuthor;
  like_count: number;
  liked_by_me: boolean;
  reply_count: number;
  can_delete: boolean;
  by_post_owner: boolean;
}

export interface CommentListResponse {
  items: PostComment[];
  total: number;
  has_more: boolean;
  next_cursor: number | null;
  comments_disabled: boolean;
}

export interface CommentLikeState {
  liked: boolean;
  like_count: number;
}

export interface CommentDeleteResult {
  success: boolean;
  comment_id: number;
  comment_count: number;
}

export interface PostInsights {
  post_id: number;
  status: PostStatus;
  published_at?: string | null;
  reach: number;
  followers_reach: number;
  non_followers_reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagement_rate: number | null;
  poll_votes: number | null;
  daily: { date: string; likes: number; comments: number }[];
}

export type ReportReason =
  | "spam"
  | "scam"
  | "nudity"
  | "hate"
  | "violence"
  | "self_harm"
  | "false_info"
  | "bullying"
  | "other";

export const REPORT_REASONS: { id: ReportReason; label: string }[] = [
  { id: "spam", label: "It's spam" },
  { id: "scam", label: "Scam or fraud" },
  { id: "nudity", label: "Nudity or sexual content" },
  { id: "hate", label: "Hate speech or symbols" },
  { id: "violence", label: "Violence or dangerous people" },
  { id: "self_harm", label: "Self-harm or suicide" },
  { id: "false_info", label: "False information" },
  { id: "bullying", label: "Bullying or harassment" },
  { id: "other", label: "Something else" },
];

// Keep these in sync with the limits in post_service.py / post_engagement_service.py
export const POST_LIMITS = {
  contentLength: 5000,
  commentLength: 1000,
  imageBytes: 5 * 1024 * 1024,
  /** Most pictures in one carousel post */
  maxCarousel: 10,
  videoBytes: 25 * 1024 * 1024,
  pollMinOptions: 2,
  pollMaxOptions: 5,
  pollOptionLength: 80,
  maxPinned: 3,
  imageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  videoTypes: ["video/mp4", "video/webm", "video/quicktime"],
} as const;