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
