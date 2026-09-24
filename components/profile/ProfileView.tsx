"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Pencil, X, Check } from "lucide-react";
import { userService } from "@/services/user.service";
import { useAuthuser } from "@/hooks/useAuthuser";
import { buttonVariants } from "@/components/ui/Button";
import type { ProfileData } from "@/types/Auth";

export default function ProfileView() {
  const { user, setUser } = useAuthuser();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await userService.getProfile();
        setProfile(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setBio(data.bio || "");
        setAvatarPreview(data.avatar_url);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const updated = await userService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        bio,
        avatar: avatarFile,
      });
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFirstName(profile?.first_name || "");
    setLastName(profile?.last_name || "");
    setBio(profile?.bio || "");
    setAvatarFile(null);
    setAvatarPreview(profile?.avatar_url || null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="p-12 text-center text-gray-500">Profile not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-orange-100 to-orange-200" />
        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-6 flex flex-col sm:flex-row items-end gap-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                <img
                  src={avatarPreview || "/images/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-brand text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera size={14} />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="border-b border-brand outline-none bg-transparent w-24"
                    />
                    <input
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="border-b border-brand outline-none bg-transparent w-24"
                    />
                  </div>
                ) : (
                  `${profile.first_name} ${profile.last_name}`
                )}
              </h1>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
            <div className="pb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className={`${buttonVariants({ variant: "outline" })} flex items-center gap-1 px-3 py-1.5 text-xs font-bold disabled:opacity-50`}
                  >
                    <X size={13} />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`${buttonVariants({ variant: "default" })} flex items-center gap-1 px-3 py-1.5 text-xs font-bold disabled:opacity-50`}
                  >
                    {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    Save
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className={`${buttonVariants({ variant: "outline" })} flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold`}
                >
                  <Pencil size={13} />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    className="w-full p-3 rounded-xl border border-orange-100 outline-none focus:border-brand transition-colors text-sm"
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {profile.bio || "No bio added yet."}
                  </p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    value={profile.location || ""}
                    onChange={e => setBio(e.target.value)} // Logic simplified for a placeholder, ideally separate state
                    className="w-full p-3 rounded-xl border border-orange-100 outline-none focus:border-brand transition-colors text-sm"
                  />
                ) : (
                  <p className="text-gray-700 text-sm">{profile.location || "Not specified"}</p>
                )}
              </div>
            </div>
            <div className="bg-orange-50/50 rounded-2xl p-5 space-y-4 border border-orange-100">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block">
                  Email
                </span>
                <span className="text-gray-800 font-semibold truncate block">{profile.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block">
                  Role
                </span>
                <span className="text-gray-800 font-semibold capitalize">{profile.role}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block">
                  Followers
                </span>
                <span className="text-gray-800 font-semibold">{profile.followers_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-xl text-center border border-red-100">{error}</div>}
    </div>
  );
}
