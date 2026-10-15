export type PostType = "text" | "image" | "video" | "gif" | "poll";

export interface PostAuthor {
  user_id: number;
  name: string;
  username: string;
  role: string;
  avatar_url?: string | null;
}

export interface CommentAuthor {
  user_id: number;
  name: string;
  username: string;
  avatar_url?: string | null;
  role?: string;
}

export interface PostCommentReply {
  comment_id: number;
  post_id: number;
  parent_id?: number | null;
  content: string;
  created_at: string;
  author: CommentAuthor;
  can_delete?: boolean;
  like_count?: number;
  liked_by_me?: boolean;
}

export interface PostComment {
  comment_id: number;
  post_id: number;
  parent_id?: number | null;
  content: string;
  created_at: string;
  author: CommentAuthor;
  can_delete?: boolean;
  replies?: PostComment[];
  reply_count?: number;
  like_count?: number;
  liked_by_me?: boolean;
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

export type PostStatus = "published" | "scheduled";

export interface Post {
  post_id: number;
  author_id: number;
  post_type: PostType;
  status: PostStatus;
  content?: string | null;
  media_type?: "image" | "video" | null;
  media_url?: string | null;
  gif_url?: string | null;
  poll?: Poll | null;
  created_at: string; // ISO-8601 UTC, ends with "Z"
  scheduled_at?: string | null; // when it is due to go live (UTC, "Z")
  published_at?: string | null; // null while still scheduled
  can_delete: boolean;

  // Engagement stats & metadata
  like_count?: number;
  likes_count?: number;
  comment_count?: number;
  comments_count?: number;
  share_count?: number;
  shares_count?: number;
  save_count?: number;
  saves_count?: number;
  liked_by_me?: boolean;
  is_liked?: boolean;
  saved_by_me?: boolean;
  is_saved?: boolean;
  shared_by_me?: boolean;
  is_shared?: boolean;
  views_count?: string;
  revenue?: string;
  ai_score?: string;
  next_time?: string;
  location?: string;
  platform?: "instagram" | "youtube" | "facebook" | "threads" | "talktamila";
  is_owner?: boolean;
  can_edit?: boolean;
  comments_disabled?: boolean;
  hide_like_count?: boolean;
  is_pinned?: boolean;
  is_archived?: boolean;
}

export interface EditPostInput {
  content?: string;
  commentsDisabled?: boolean;
  hideLikeCount?: boolean;
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
  gifUrl?: string;
  pollOptions?: string[];
  /** ISO-8601 WITH timezone, e.g. new Date(...).toISOString(). 1 minute to 365 days ahead. Omit to post now. */
  scheduledAt?: string;
}

// Keep these in sync with the limits in post_service.py
export const POST_LIMITS = {
  contentLength: 5000,
  imageBytes: 5 * 1024 * 1024,
  videoBytes: 25 * 1024 * 1024,
  pollMinOptions: 2,
  pollMaxOptions: 5,
  pollOptionLength: 80,
  imageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  videoTypes: ["video/mp4", "video/webm", "video/quicktime"],
} as const;

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
