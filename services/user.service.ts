import { ProfileData } from '@/types/Auth';
import { apiClient } from './api-client';

export interface ProfileUpdateInput {
  first_name?: string;
  last_name?: string;
  bio?: string;
  location?: string;
  avatar?: File | null;
}

function buildProfileFormData(input: ProfileUpdateInput): FormData {
  const formData = new FormData();

  if (input.first_name !== undefined) formData.append('first_name', input.first_name);
  if (input.last_name !== undefined) formData.append('last_name', input.last_name);
  if (input.bio !== undefined) formData.append('bio', input.bio);
  if (input.location !== undefined) formData.append('location', input.location);
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
};
