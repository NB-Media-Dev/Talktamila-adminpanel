import { BackendStoryGroup, StoryResponse, TextStoryPayload, MultipleUploadResponse } from '@/types/stories';
import { apiClient } from './api-client';

export const storyService = {
  uploadMultipleFiles: async (formData: FormData): Promise<MultipleUploadResponse | StoryResponse[]> => {
    return apiClient<MultipleUploadResponse | StoryResponse[]>('/api/v1/stories/upload-multiple', {
      method: 'POST',
      body: formData,
    });
  },

  addTextStory: async (payload: TextStoryPayload): Promise<StoryResponse> => {
    return apiClient<StoryResponse>('/api/v1/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },

  getStoriesFeed: async (): Promise<BackendStoryGroup[]> => {
    return apiClient<BackendStoryGroup[]>('/api/v1/stories', {
      method: 'GET',
    });
  },
};

export const StoryService = storyService;