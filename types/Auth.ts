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
}
