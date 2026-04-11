"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface UserProfile {
  name: string;
  exam: string;
}

interface AuthUser {
  email: string;
  provider: "email" | "google";
}

interface UserContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, provider: "email" | "google") => void;
  logout: () => void;
  updateExam: (exam: string) => void;
  updateProfile: (profile: UserProfile) => void;
  setProfile: (profile: UserProfile) => void; // Alias for legacy support
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing auth session
    const savedAuth = localStorage.getItem("cracksarkar_auth");
    const savedProfile = localStorage.getItem("cracksarkar_profile");

    if (savedAuth) {
      setUser(JSON.parse(savedAuth));
    }
    if (savedProfile) {
      setProfileState(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  const login = (email: string, provider: "email" | "google" = "email") => {
    const newUser: AuthUser = { email, provider };
    localStorage.setItem("cracksarkar_auth", JSON.stringify(newUser));
    setUser(newUser);
    
    // Redirect logic
    const savedProfile = localStorage.getItem("cracksarkar_profile");
    if (!savedProfile) {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    localStorage.removeItem("cracksarkar_auth");
    // We keep the profile locally but clear the auth user
    setUser(null);
    router.push("/");
  };

  const updateProfile = (newProfile: UserProfile) => {
    localStorage.setItem("cracksarkar_profile", JSON.stringify(newProfile));
    setProfileState(newProfile);
  };

  const updateExam = (exam: string) => {
    if (profile) {
      updateProfile({ ...profile, exam });
    }
  };

  const completeOnboarding = (newProfile: UserProfile) => {
    updateProfile(newProfile);
    router.push("/dashboard");
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      login, 
      logout, 
      completeOnboarding, 
      updateProfile, 
      updateExam,
      setProfile: updateProfile 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
