import { loginPayload, loginResponse, RegisterPayload, RegisterResponse } from '@/types/Auth';
import { apiClient } from './api-client';
import { setAuthToken, clearAuthToken } from '@/lib/cookies';

export const authService = {
  signIn: async (payload: loginPayload): Promise<loginResponse> => {
    const response = await apiClient<loginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (response.access_token) {
      setAuthToken(response.access_token, 7 * 24 * 60 * 60);
    }

    return response;
  },
  signUp: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    return apiClient<RegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  signOut: () => {
    clearAuthToken();
  }
};


