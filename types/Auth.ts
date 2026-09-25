export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export enum UserRole {
  ADMIN = 'admin',
  INFLUENCER = 'influencer',
  FREELANCER = 'freelancer'
}

/* ---------- Login ---------- */

export interface loginPayload {
  username: string;
  password: string;
}

export interface AuthUser {
  id?: string | number;
  user_id?: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  mobile_no?: string;
  dob?: string | null;
  role?: string;
  avatar_url?: string | null;
  followers_count?: number;
}

export interface loginResponse {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  user: AuthUser;
  id?: string | number;
  user_id?: number;
  username?: string;
  email?: string;
  full_name?: string;
  mobile_no?: string;
  dob?: string | null;
  role?: string;
}

/* ---------- Register ---------- */

export interface RegisterPayload {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  password: string;
  dob: string;
  role: string | UserRole;
}

export interface RegisterResponse {
  id?: string | number;
  username: string;
}

export interface AvailabilityField {
  available: boolean;
  message: string | null;
}

export interface AvailabilityResponse {
  email?: AvailabilityField;
  mobile_no?: AvailabilityField;
  username?: AvailabilityField;
}

/* ---------- Forgot / reset password ---------- */

export interface ForgotPasswordPayload {
  identifier: string;
}

export interface VerifyOtpPayload {
  identifier: string;
  otp: string;
}

export interface ResetPasswordPayload {
  identifier: string;
  otp: string;
  new_password: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface SimpleSuccessResponse {
  success: boolean;
  message: string;
}

/* ---------- Profile ---------- */

export interface ProfileData {
  id: number;
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  mobile_no: string;
  dob: string | null;
  role: string;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

/* ---------- Discover people / follow ---------- */

export interface UserSuggestion {
  id: number;
  user_id: number;
  username: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  bio: string | null;
  followers_count: number;
  is_following: boolean;
}

export interface FollowActionResponse {
  success: boolean;
  is_following: boolean;
  followers_count: number;
}