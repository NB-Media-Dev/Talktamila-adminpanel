
import {
  BackendMusicTrack,
  BackendStoryGroup,
  StoryResponse,
  TextStoryPayload,
  StoryActivityData,
  LikeStoryResponse,
  ReplyStoryResponse,
  MultipleUploadResponse,
} from '@/types/Stories';
import { apiClient } from './api-client';

export const storyService = {
  // Feed & Discovery
  getStoriesFeed: async (): Promise<BackendStoryGroup[]> => {
    return apiClient<BackendStoryGroup[]>('/api/v1/stories', {
      method: 'GET',
    });
  },

  // Upload & Create
  uploadMultipleFiles: async (formData: FormData): Promise<StoryResponse[] | MultipleUploadResponse> => {
    return apiClient<StoryResponse[] | MultipleUploadResponse>('/api/v1/stories/upload-multiple', {
      method: 'POST',
      body: formData,
    });
  },

  addTextStory: async (payload: TextStoryPayload): Promise<StoryResponse> => {
    return apiClient<StoryResponse>('/api/v1/stories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Views & Likes

  /**
   * Records a view for an individual slide frame.
   * POSTs to: POST /api/stories/slides/${slideId}/view
   * @param slideId - The unique `id` of the StorySlide being viewed (NOT the parent story_id / group id).
   */
  recordSlideView: async (slideId: number): Promise<{ success: boolean; views_count: number }> => {
    const response = await fetch(`http://localhost:8000/api/stories/slides/${slideId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Slide view POST failed: ${response.status}`);
    }
    return response.json();
  },

  /** @deprecated Use recordSlideView(slide.id) for per-slide tracking. */
  recordView: async (storyId: number | string): Promise<{ success: boolean; views_count: number }> => {
    return apiClient<{ success: boolean; views_count: number }>(`/api/v1/stories/${storyId}/view`, {
      method: 'POST',
    });
  },

  likeStory: async (storyId: number | string): Promise<LikeStoryResponse> => {
    return apiClient<LikeStoryResponse>(`/api/v1/stories/${storyId}/like`, {
      method: 'POST',
    });
  },

  unlikeStory: async (storyId: number | string): Promise<LikeStoryResponse> => {
    return apiClient<LikeStoryResponse>(`/api/v1/stories/${storyId}/like`, {
      method: 'DELETE',
    });
  },

  // Replies & Activity
  replyStory: async (storyId: number | string, text: string): Promise<ReplyStoryResponse> => {
    return apiClient<ReplyStoryResponse>(`/api/v1/stories/${storyId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  getActivity: async (storyId: number | string): Promise<StoryActivityData> => {
    return apiClient<StoryActivityData>(`/api/v1/stories/${storyId}/activity`, {
      method: 'GET',
    });
  },

  // Delete
  deleteStory: async (storyId: number | string): Promise<void> => {
    return apiClient<void>(`/api/v1/stories/${storyId}`, {
      method: 'DELETE',
    });
  },

  // Music
  getTrendingMusic: async (limit: number = 15): Promise<BackendMusicTrack[]> => {
    return apiClient<BackendMusicTrack[]>(`/api/v1/stories/music/trending?limit=${limit}`, {
      method: 'GET',
    });
  },

  searchMusic: async (query: string = '', limit: number = 15): Promise<BackendMusicTrack[]> => {
    return apiClient<BackendMusicTrack[]>(`/api/v1/stories/music/search?q=${encodeURIComponent(query)}&limit=${limit}`, {
      method: 'GET',
    });
  },
};

export const StoryService = storyService;
