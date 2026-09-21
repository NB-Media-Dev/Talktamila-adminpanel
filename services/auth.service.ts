import {
  loginPayload,
  loginResponse,
  RegisterPayload,
  RegisterResponse,
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
  SimpleSuccessResponse,
  AvailabilityResponse,
} from '@/types/Auth';
import { apiClient } from './api-client';
import { setAuthToken, setAuthRole, clearAuthToken } from '@/lib/cookies';

export const authService = {
  signIn: async (payload: loginPayload): Promise<loginResponse> => {
    const response = await apiClient<loginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (response.access_token) {
      setAuthToken(response.access_token, 7 * 24 * 60 * 60);
      const role = response.role || response.user?.role;
      if (role) setAuthRole(String(role));
    }

    return response;
  },
  signUp: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    return apiClient<RegisterResponse>('/api/v1/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  signOut: () => {
    clearAuthToken();
  },
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<SimpleSuccessResponse> => {
    return apiClient<SimpleSuccessResponse>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  verifyOtp: async (payload: VerifyOtpPayload): Promise<SimpleSuccessResponse> => {
    return apiClient<SimpleSuccessResponse>('/api/v1/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  resetPassword: async (payload: ResetPasswordPayload): Promise<SimpleSuccessResponse> => {
    return apiClient<SimpleSuccessResponse>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  checkAvailability: async (fields: {
    email?: string;
    mobile_no?: string;
    username?: string;
  }): Promise<AvailabilityResponse> => {
    const params = new URLSearchParams();
    if (fields.email) params.set('email', fields.email);
    if (fields.mobile_no) params.set('mobile_no', fields.mobile_no);
    if (fields.username) params.set('username', fields.username);

    return apiClient<AvailabilityResponse>(
      `/api/v1/auth/check-availability?${params.toString()}`,
      { method: 'GET' }
    );
  },
};