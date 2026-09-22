// src/types/Stories.ts
import { StaticImageData } from "next/image";

export interface TextStoryPayload {
  media_url: string;
  media_type: string;
  caption: string;
  audience: string;
  music_title?: string | null;
  music_artist?: string | null;
  music_url?: string | null;
  music_thumbnail?: string | null;
  music_duration?: number;
  music_start_time?: number;
}

export interface StoryResponse {
  id: string;
  user_id: string;
  media_url: string;
  media_type: string;
  caption?: string;
  audience: string;
  music_title?: string;
  music_artist?: string;
  music_url?: string;
  music_start_time?: number;
  created_at: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  message?: string;
  stories: StoryResponse[];
}

/**
 * Represents a single slide frame within a story group.
 * - `id`          : Globally unique per-slide identifier (used for per-slide view tracking).
 * - `views_count` : View counter scoped strictly to this individual slide frame.
 * - `content`     : Human-readable text content of the slide (e.g. "good", "vanakamk", "hi bro").
 */
export interface StorySlide {
  id: number;              // Unique ID for this individual slide frame
  story_group_id?: number; // Shared parental story group identifier
  story_id?: number;       // Backend story reference identifier
  imageUrl: StaticImageData | string;
  media_url?: string;
  media_type?: string;
  /** Human-readable text content for this slide frame (e.g. "good", "vanakamk", "hi bro") */
  content?: string;
  caption?: string;
  duration?: number;
  liked?: boolean;
  likes_count?: number;
  /** View count scoped to this individual slide — NOT the parent story group */
  views_count?: number;
  created_at?: string;
  musicTrack?: string;
  music_url?: string;
  music_start_time?: number;
  music_title?: string;
  music_artist?: string;
}

/**
 * Represents a story group (parent container) that holds multiple individual slides.
 * - `story_id` : Shared parent ID across all slides in this group.
 * - `slides`   : Array of `StorySlide` elements, each with their own unique `id` and `views_count`.
 */
export interface StoryGroup {
  /** Shared parent identifier for this story group (common across all slides) */
  story_id: number;
  userName: string;
  slides: StorySlide[];
}

export interface UserStoryGroup {
  story_id?: number;       // The single common ID for the entire story post / group
  id: number;              // The common parental story identifier
  userName: string;
  avatar: StaticImageData | string;
  verified?: boolean;
  timeAgo?: string;
  slides: StorySlide[];    // Array containing the individual unique slides
  isViewed?: boolean;
  hasUnseen?: boolean;
  musicTrack?: string;
  is_my_story?: boolean;
}

export interface BackendSlide {
  id: string | number;
  story_id?: string | number;
  story_group_id?: string | number;
  imageUrl?: string;
  media_url?: string;
  media_type?: string;
  caption?: string;
  duration?: number;
  liked?: boolean;
  likes_count?: number;
  views_count?: number;
  created_at?: string;
  musicTrack?: string;
  music_url?: string;
  music_start_time?: number;
  music_title?: string;
  music_artist?: string;
}

export interface StoryUser extends UserStoryGroup {
  id: number;
  isViewed: boolean;        
  hasUnseen: boolean;
}

export interface BackendStoryGroup {
  id: string | number;
  story_id?: string | number;
  userName: string;
  avatar?: string;
  verified?: boolean;
  timeAgo?: string;
  all_viewed: boolean;        
  has_unseen_stories: boolean;
  slides: BackendSlide[];
  stories?: any[];
  musicTrack?: string;
  is_my_story?: boolean;
}

export interface BackendMusicTrack {
  track_id: number;
  title: string;
  artist: string;
  album?: string;
  duration_seconds: number;
  audio_url: string;
  cover_url?: string;
  genre?: string;
  language?: string;
  is_trending?: boolean;
}

export interface ActivityViewer {
  user_id: number;
  username: string;
  full_name?: string;
  avatar_url?: string;
  viewed_at?: string;
}

export interface ActivityLiker {
  user_id: number;
  username: string;
  full_name?: string;
  avatar_url?: string;
}

export interface StoryActivityData {
  story_id: number;
  total_views: number;
  total_likes: number;
  viewers: ActivityViewer[];
  likers: ActivityLiker[];
}

export interface LikeStoryResponse {
  story_id: number;
  likes_count: number;
  liked_by_me: boolean;
  success: boolean;
}

export interface ReplyStoryResponse {
  success: boolean;
  message: string;
  reply_id?: number;
}

export interface PreviewStoriesProps {
  stories: StoryUser[];
  initialUserIndex?: number;
  onClose: () => void;
  onStoryDeleted?: (storyId: number) => void;
}
