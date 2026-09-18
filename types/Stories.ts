export interface TextStoryPayload {
  media_url: string;
  media_type: string;
  caption: string;
  audience: string;
  music_title: string | null;
}

export interface StoryResponse {
  id: string;
  user_id: string;
  media_url: string;
  media_type: string;
  caption?: string;
  audience: string;
  music_title?: string;
  created_at: string;
}

export interface MultipleUploadResponse {
  success: boolean;
  message?: string;
  stories: StoryResponse[];
}

export interface BackendSlide {
  id: string;
  story_id?: string;
  imageUrl?: string;
  media_url?: string;
  media_type?: string;
  caption?: string;
  duration?: number;
  liked?: boolean;
  likes_count?: number;
  views_count?: number;
  musicTrack?: string;
}

export interface BackendStoryGroup {
  id: string;
  userName: string;
  avatar?: string;
  verified?: boolean;
  timeAgo?: string;
  slides: BackendSlide[];
  musicTrack?: string;
  is_my_story?: boolean;
}
