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

export interface StorySlide {
  id: number;
  story_id?: number;
  imageUrl: StaticImageData | string;
  media_url?: string;
  media_type?: string;
  caption?: string;
  duration?: number;
  liked?: boolean;
  likes_count?: number;
  views_count?: number;
  musicTrack?: string;
  music_url?: string;
  music_start_time?: number;
  music_title?: string;
  music_artist?: string;
}

export interface BackendSlide {
  id: string | number;
  story_id?: string | number;
  imageUrl?: string;
  media_url?: string;
  media_type?: string;
  caption?: string;
  duration?: number;
  liked?: boolean;
  likes_count?: number;
  views_count?: number;
  musicTrack?: string;
  music_url?: string;
  music_start_time?: number;
  music_title?: string;
  music_artist?: string;
}

export interface StoryUser {
  id: number;
  userName: string;
  avatar: StaticImageData | string;
  verified?: boolean;
  timeAgo?: string;
  slides: StorySlide[];
  musicTrack?: string;
  is_my_story?: boolean;
}

export interface BackendStoryGroup {
  id: string | number;
  userName: string;
  avatar?: string;
  verified?: boolean;
  timeAgo?: string;
  slides: BackendSlide[];
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
