"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MapPin, Settings } from "lucide-react";
import { userService } from "@/services/user.service";
import type { ProfileData } from "@/types/Auth";
import { buttonVariants } from "@/components/ui/Button";
import DiscoverPeople from "@/components/profile/DiscoverPeople";
import FollowListModal from "@/components/profile/FollowListModal";

export default function ProfileView() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listModalTab, setListModalTab] = useState<"followers" | "following" | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Silent refresh (no spinner) so the counts update after follow/unfollow.
  const refreshProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
    } catch {
      // keep showing the last known profile
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-12 text-center text-gray-500">
        {error || "Profile not found."}
      </div>
    );
  }

  const initials =
    `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() ||
    profile.username?.[0]?.toUpperCase() ||
    "?";

  const fullName = `${profile.first_name} ${profile.last_name}`.trim();

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6 sm:p-8">
        {/* ── header: avatar left, username/stats/edit-button right ── */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-2 ring-orange-200 ring-offset-4 overflow-hidden bg-orange-100 flex items-center justify-center shrink-0">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-brand">{initials}</span>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <h1 className="text-xl font-semibold text-gray-900 text-center sm:text-left">
                @{profile.username}
              </h1>

              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => router.push(`/${profile.role}/profile/settings`)}
                  aria-label="Settings"
                  className={`${buttonVariants({ variant: "outline" })} p-1.5`}
                >
                  <Settings size={14} />
                </button>
              </div>
            </div>

            {/* Posts / Followers / Following — Instagram-style stat row */}
            <div className="flex justify-center sm:justify-start gap-8 mt-4">
              <div className="text-center sm:text-left">
                <span className="block text-base font-bold text-gray-900">
                  {profile.posts_count}
                </span>
                <span className="text-xs text-gray-500">Posts</span>
              </div>
              <button
                type="button"
                onClick={() => setListModalTab("followers")}
                className="text-center sm:text-left cursor-pointer"
              >
                <span className="block text-base font-bold text-gray-900">
                  {profile.followers_count}
                </span>
                <span className="text-xs text-gray-500">Followers</span>
              </button>
              <button
                type="button"
                onClick={() => setListModalTab("following")}
                className="text-center sm:text-left cursor-pointer"
              >
                <span className="block text-base font-bold text-gray-900">
                  {profile.following_count}
                </span>
                <span className="text-xs text-gray-500">Following</span>
              </button>
            </div>

            {/* Name + bio, Instagram bio-block style */}
            <div className="mt-5 text-center sm:text-left">
              <h2 className="font-bold text-gray-900">{fullName}</h2>
              <p className="text-gray-700 text-sm leading-relaxed mt-1 whitespace-pre-line">
                {profile.bio || "No bio added yet."}
              </p>
              {profile.location && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1 justify-center sm:justify-start">
                  <MapPin size={12} />
                  {profile.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "Discover people" — follow suggestions, right after the profile card */}
      <DiscoverPeople onFollowChange={refreshProfile} />

      {listModalTab && (
        <FollowListModal
          userId={profile.user_id}
          initialTab={listModalTab}
          onClose={() => setListModalTab(null)}
          onChanged={refreshProfile}
        />
      )}
    </div>
  );
}
