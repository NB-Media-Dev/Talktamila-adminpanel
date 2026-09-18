// src/types/Stories.ts

// 1. Text components post payload parameters schema definitions maps
export interface TextStoryPayload {
  media_url: string;
  media_type: string;
  caption: string;
  audience: string;
  music_title: string | null;
}

// 2. Exact individual base components records database format mapping models
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

// 3. Dynamic multi-media upload array responses mapping layer structures object definition
export interface MultipleUploadResponse {
  success: boolean;
  message?: string;
  stories: StoryResponse[]; // Multi files query outputs array values parsing
}



/**
 * Interface representing individual slides inside a user's story group.
 * Matches properties like s.imageUrl, s.media_url, s.liked etc.
 */
export interface BackendSlide {
  id: string;
  story_id?: string;
  imageUrl?: string;
  media_url?: string;
  media_type?: string; // e.g., 'image' | 'video' | 'text'
  caption?: string;
  duration?: number;   // Slide play duration in milliseconds
  liked?: boolean;
  likes_count?: number;
  views_count?: number;
  musicTrack?: string;
}

/**
 * Core interface returned by the '/api/v1/stories' GET endpoint.
 * Groups multiple active story slides together under a specific creator profile context.
 */
export interface BackendStoryGroup {
  id: string;          // Creator profile user ID or unique group token ID
  userName: string;    // Display handle name of the story creator (e.g., User A)
  avatar?: string;     // Profile picture image web link URL asset string
  verified?: boolean;  // Verification badge check metric state flag
  timeAgo?: string;    // Relative posting window timeline text (e.g., "3h ago")
  slides: BackendSlide[]; // Collection array of all active nested slide records
  musicTrack?: string; // Global background audio sync identifier
  is_my_story?: boolean; // Flag to separate current visitor session (User B vs User A)
}
