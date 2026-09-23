"use client";
import React, { createContext, useContext, useState } from "react";
import { loginResponse } from "@/types/Auth";
 
export type AuthUserData =
  | loginResponse
  | {
      id?: string;
      username?: string;
      email?: string;
      role?: string;
      [key: string]: any;
    };
 
interface AuthContextType {
  user: AuthUserData | null;
  setUser: (user: AuthUserData | null) => void;
}
 
const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUserData | null;
}) {
  const [user, setUser] = useState<AuthUserData | null>(initialUser);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
 
export function useAuthuser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}