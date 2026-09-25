import { ProfileData, UserSuggestion, FollowActionResponse } from '@/types/Auth';
import { apiClient } from './api-client';

export interface ProfileUpdateInput {
  first_name?: string;
  last_name?: string;
  username?: string;
  bio?: string;
  location?: string;
  email?: string;
  mobile_no?: string;
  avatar?: File | null;
}

/** A person shown in the Settings lists (muted creators / close friends). */
export interface SettingsPerson {
  user_id: number;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role?: string;
}

function buildProfileFormData(input: ProfileUpdateInput): FormData {
  const formData = new FormData();

  if (input.first_name !== undefined) formData.append('first_name', input.first_name);
  if (input.last_name !== undefined) formData.append('last_name', input.last_name);
  if (input.username !== undefined) formData.append('username', input.username);
  if (input.bio !== undefined) formData.append('bio', input.bio);
  if (input.location !== undefined) formData.append('location', input.location);
  if (input.email !== undefined) formData.append('email', input.email);
  if (input.mobile_no !== undefined) formData.append('mobile_no', input.mobile_no);
  if (input.avatar) formData.append('avatar', input.avatar);

  return formData;
}

export const userService = {
  getProfile: async (): Promise<ProfileData> => {
    return apiClient<ProfileData>('/api/v1/auth/profile', {
      method: 'GET',
    });
  },

  updateProfile: async (input: ProfileUpdateInput): Promise<ProfileData> => {
    return apiClient<ProfileData>('/api/v1/auth/profile', {
      method: 'PUT',
      body: buildProfileFormData(input),
    });
  },

  /* ---- Discover people ----
     Matches GET /api/v1/stories/suggestions on the backend
     (StoryService.get_suggestions). */
  getSuggestions: async (limit: number = 10): Promise<UserSuggestion[]> => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    return apiClient<UserSuggestion[]>(
      `/api/v1/stories/suggestions?${params.toString()}`,
      { method: 'GET' }
    );
  },

  /* These two match the existing backend routes in
     app/story/routes.py (prefix "/stories"):
       POST   /stories/follow/{user_id}
       DELETE /stories/follow/{user_id} */
  followUser: async (userId: number): Promise<FollowActionResponse> => {
    return apiClient<FollowActionResponse>(`/api/v1/stories/follow/${userId}`, {
      method: 'POST',
    });
  },

  unfollowUser: async (userId: number): Promise<FollowActionResponse> => {
    return apiClient<FollowActionResponse>(`/api/v1/stories/follow/${userId}`, {
      method: 'DELETE',
    });
  },

  /* ---- Followers / Following lists ----
     Match app/story/settings_routes.py (prefix "/stories/settings"). */
  getFollowers: async (userId: number, limit: number = 50): Promise<UserSuggestion[]> => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    return apiClient<UserSuggestion[]>(
      `/api/v1/stories/settings/followers/${userId}?${params.toString()}`,
      { method: 'GET' }
    );
  },

  getFollowing: async (userId: number, limit: number = 50): Promise<UserSuggestion[]> => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    return apiClient<UserSuggestion[]>(
      `/api/v1/stories/settings/following/${userId}?${params.toString()}`,
      { method: 'GET' }
    );
  },

  /* ---- Settings: muted creators & close friends ---- */
  getMutedCreators: async (): Promise<SettingsPerson[]> => {
    return apiClient<SettingsPerson[]>('/api/v1/stories/settings/muted', {
      method: 'GET',
    });
  },

  unmuteCreator: async (userId: number): Promise<{ success: boolean }> => {
    return apiClient<{ success: boolean }>(`/api/v1/stories/settings/muted/${userId}`, {
      method: 'DELETE',
    });
  },

  getCloseFriends: async (): Promise<SettingsPerson[]> => {
    return apiClient<SettingsPerson[]>('/api/v1/stories/settings/close-friends', {
      method: 'GET',
    });
  },

  addCloseFriend: async (friendId: number): Promise<{ success: boolean }> => {
    return apiClient<{ success: boolean }>(
      `/api/v1/stories/settings/close-friends/${friendId}`,
      { method: 'POST' }
    );
  },

  removeCloseFriend: async (friendId: number): Promise<{ success: boolean }> => {
    return apiClient<{ success: boolean }>(
      `/api/v1/stories/settings/close-friends/${friendId}`,
      { method: 'DELETE' }
    );
  },
};