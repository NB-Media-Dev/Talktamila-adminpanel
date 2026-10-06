
import {
  BackendMusicTrack,
  BackendStoryGroup,
  StoryResponse,
  TextStoryPayload,
  StoryActivityData,
  LikeStoryResponse,
  ReplyStoryResponse,
  MultipleUploadResponse,
  AdminReportItem,
  ReportStoryResponse,
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

  recordSlideView: async (slideId: number): Promise<{ success: boolean; views_count: number }> => {
    return apiClient<{ success: boolean; views_count: number }>(`/api/v1/stories/${slideId}/view`, {
      method: 'POST',
    });
  },

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

  // Reporting & Moderation
  reportStory: async (storyId: number | string, reason: string, details?: string): Promise<ReportStoryResponse> => {
    return apiClient<ReportStoryResponse>(`/api/v1/stories/${storyId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details: details || undefined }),
    });
  },

  muteCreator: async (userId: number | string): Promise<{ success: boolean; message: string; muted_user_id: number; is_muted: boolean }> => {
    return apiClient<{ success: boolean; message: string; muted_user_id: number; is_muted: boolean }>(`/api/v1/stories/users/${userId}/mute`, {
      method: 'POST',
    });
  },

  // Admin Reports & Actions
  getStoryReports: async (limit: number = 50, offset: number = 0): Promise<AdminReportItem[]> => {
    return apiClient<AdminReportItem[]>(`/api/v1/admin/stories/reports?limit=${limit}&offset=${offset}`, {
      method: 'GET',
    });
  },

  adminDeleteStory: async (storyId: number | string): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(`/api/v1/admin/stories/${storyId}`, {
      method: 'DELETE',
    });
  },

  adminRestoreStory: async (storyId: number | string): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(`/api/v1/admin/stories/${storyId}/restore`, {
      method: 'PATCH',
    });
  },

  adminBanUser: async (userId: number | string): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(`/api/v1/admin/users/${userId}/ban`, {
      method: 'POST',
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
