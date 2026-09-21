// src/types/auth.ts

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
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string | number;
  dob: string;
  role: UserRole;
}



export interface loginResponse {
  access_token: string;
  token_type: string;    
  user: UserProfile; 
  role: UserRole;   
}

export interface loginPayload {
  username: string;
  password?: string;
}

export interface ForgotPasswordPayload {
  identifier: string; // email or mobile number
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

export interface SimpleSuccessResponse {
  success: boolean;
  message: string;
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