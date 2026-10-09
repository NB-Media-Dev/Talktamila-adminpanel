"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Info,
  LayoutGrid,
  Link2,
  Loader2,
  MapPin,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react";
import { userService } from "@/services/user.service";
import { goBack as historyBack } from "@/lib/navigation";
import { getInitials } from "@/lib/avatar";
import { buttonVariants } from "@/components/ui/Button";
import FollowListModal from "@/components/profile/FollowListModal";
import ProfilePosts from "@/components/profile/ProfilePosts";
import { useMessagesBase } from "@/hooks/useMessagesBase";
import { useProfileLink } from "@/hooks/useProfileLink";
import { DEMO_POST_COUNT, isDemoRole } from "@/lib/demoPosts";
import type { PublicProfileData } from "@/types/Auth";

const LIVE_POLL_MS = 10000;

function roleLabel(role?: string | null) {
  if (!role) return "";
  if (role.toLowerCase() === "superadmin") return "Super Admin";
  return role.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function joinedLabel(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export default function PublicProfileView({ username }: { username: string }) {
  const router = useRouter();
  const messagesBase = useMessagesBase();
  const { base } = useProfileLink();

  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [followBusy, setFollowBusy] = useState(false);
  const [confirmUnfollow, setConfirmUnfollow] = useState(false);
  const [tab, setTab] = useState<"posts" | "about">("posts");
  const [listModalTab, setListModalTab] = useState<"followers" | "following" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    userService
      .getPublicProfile(username)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load this profile.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const refresh = useCallback(async () => {
    if (busyRef.current) return;
    try {
      const data = await userService.getPublicProfile(username);
      setProfile((prev) => (prev && JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    } catch {
      /* keep showing the last known profile */
    }
  }, [username]);

  useEffect(() => {
    const check = () => {
      if (!document.hidden) refresh();
    };
    const id = setInterval(check, LIVE_POLL_MS);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, [refresh]);

  useEffect(() => {
    if (profile?.is_me) router.replace(`${base}/profile${window.location.search}`);
  }, [profile?.is_me, base, router]);

  async function toggleFollow() {
    if (!profile || busyRef.current) return;
    busyRef.current = true;
    setFollowBusy(true);
    setActionError(null);
    try {
      const res = profile.is_following
        ? await userService.unfollowUser(profile.user_id)
        : await userService.followUser(profile.user_id);
      setProfile((p) =>
        p ? { ...p, is_following: res.is_following, followers_count: res.followers_count } : p
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      busyRef.current = false;
      setFollowBusy(false);
      setConfirmUnfollow(false);
    }
  }

  async function copyLink() {
    setMenuOpen(false);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setActionError("Couldn't copy the link.");
    }
  }

  const goBack = () => historyBack(router, `${base}/profile`);

  if (isLoading || profile?.is_me) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className={`${buttonVariants({ variant: "outline" })} p-2`}
        >
          <ArrowLeft size={16} />
        </button>
        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-10 mt-4 text-center">
          <p className="text-base font-bold text-gray-900">This profile isn&apos;t available</p>
          <p className="text-sm text-gray-500 mt-1">{error || "The link may be broken or the account was removed."}</p>
        </div>
      </div>
    );
  }

  const initials = getInitials({
    firstName: profile.first_name,
    lastName: profile.last_name,
    username: profile.username,
  });
  const joined = joinedLabel(profile.joined_at);
  const demo = isDemoRole(profile.role);
  const postsCount = demo ? DEMO_POST_COUNT : profile.posts_count;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className={`${buttonVariants({ variant: "outline" })} p-2`}
        >
          <ArrowLeft size={16} />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="More options"
            aria-expanded={menuOpen}
            className={`w-9 h-9 ${buttonVariants({ variant: "bgcolor" })}`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-orange-100 p-1.5 z-20">
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:text-[#FF6B35] hover:bg-orange-50/80 rounded-xl transition-colors w-full text-left cursor-pointer"
                >
                  <Link2 className="w-4 h-4 text-[#FF6B35]" />
                  <span>Copy profile link</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-6 sm:p-8">
        {/* Header: avatar left, username / buttons / stats right */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-2 ring-orange-200 ring-offset-4 overflow-hidden bg-orange-100 flex items-center justify-center shrink-0">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={profile.full_name || profile.username} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-brand">{initials}</span>
            )}
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <h1 className="text-xl font-semibold text-gray-900 text-center sm:text-left">@{profile.username}</h1>

              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  disabled={followBusy}
                  onClick={() => (profile.is_following ? setConfirmUnfollow(true) : toggleFollow())}
                  className={`px-5 py-1.5 text-sm font-bold min-w-[104px] ${buttonVariants({
                    variant: profile.is_following ? "secondary" : "default",
                  })} disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {followBusy ? "…" : profile.is_following ? "Following" : profile.follows_you ? "Follow back" : "Follow"}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`${messagesBase}?user=${profile.user_id}`)}
                  className={`${buttonVariants({ variant: "outline" })} flex items-center gap-1.5 px-4 py-1 text-sm`}
                >
                  <MessageCircle size={14} />
                  Message
                </button>
              </div>
            </div>

            {/* Posts / Followers / Following */}
            <div className="flex justify-center sm:justify-start gap-8 mt-4">
              <div className="text-center sm:text-left">
                <span className="block text-base font-bold text-gray-900">{postsCount}</span>
                <span className="text-xs text-gray-500">Posts</span>
              </div>
              <button type="button" onClick={() => setListModalTab("followers")} className="text-center sm:text-left cursor-pointer">
                <span className="block text-base font-bold text-gray-900">{profile.followers_count}</span>
                <span className="text-xs text-gray-500">Followers</span>
              </button>
              <button type="button" onClick={() => setListModalTab("following")} className="text-center sm:text-left cursor-pointer">
                <span className="block text-base font-bold text-gray-900">{profile.following_count}</span>
                <span className="text-xs text-gray-500">Following</span>
              </button>
            </div>

            {/* Name + role + bio */}
            <div className="mt-5 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                <h2 className="font-bold text-gray-900">{profile.full_name}</h2>
                <span className="text-[11px] font-bold text-[#FF6B35] bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5">
                  {roleLabel(profile.role)}
                </span>
                {profile.follows_you && (
                  <span className="text-[11px] font-semibold text-gray-500 bg-[#FDEEE2] rounded-full px-2 py-0.5">
                    Follows you
                  </span>
                )}
              </div>
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

        {actionError && (
          <div className="p-3 mt-5 bg-red-50 text-red-600 text-xs rounded-xl text-center border border-red-100">
            {actionError}
          </div>
        )}
        {copied && (
          <div className="p-3 mt-5 bg-emerald-50 text-emerald-600 text-xs rounded-xl text-center border border-emerald-100">
            Profile link copied.
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden">
        <div className="flex border-b border-orange-100">
          {(
            [
              { id: "posts", label: "Posts", icon: <LayoutGrid className="w-4 h-4" /> },
              { id: "about", label: "About", icon: <Info className="w-4 h-4" /> },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors cursor-pointer ${
                tab === t.id ? "border-[#FF6B35] text-gray-900" : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {tab === "posts" && (
          <ProfilePosts
            username={profile.username}
            refreshKey={profile.posts_count}
            demoRole={demo ? profile.role : undefined}
            onChanged={refresh}
          />
        )}

        {tab === "about" && (
          <dl className="divide-y divide-orange-100 text-sm">
            <div className="flex justify-between gap-4 px-6 py-3.5">
              <dt className="font-semibold text-gray-500">Role</dt>
              <dd className="text-gray-900">{roleLabel(profile.role)}</dd>
            </div>
            {profile.location && (
              <div className="flex justify-between gap-4 px-6 py-3.5">
                <dt className="font-semibold text-gray-500">Location</dt>
                <dd className="text-gray-900 text-right">{profile.location}</dd>
              </div>
            )}
            {joined && (
              <div className="flex justify-between gap-4 px-6 py-3.5">
                <dt className="font-semibold text-gray-500">Joined</dt>
                <dd className="text-gray-900">{joined}</dd>
              </div>
            )}
          </dl>
        )}
      </div>

      {/* Unfollow confirmation (like Instagram) */}
      {confirmUnfollow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !followBusy && setConfirmUnfollow(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-bold text-gray-900">Unfollow @{profile.username}?</p>
            <p className="text-xs text-gray-500 mt-1">You can follow them again any time.</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmUnfollow(false)}
                disabled={followBusy}
                className={`${buttonVariants({ variant: "outline" })} flex-1 px-4 py-2 text-sm font-bold disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={toggleFollow}
                disabled={followBusy}
                className={`${buttonVariants({ variant: "destructive" })} flex-1 px-4 py-2 text-sm font-bold disabled:opacity-50`}
              >
                {followBusy ? "…" : "Unfollow"}
              </button>
            </div>
          </div>
        </div>
      )}

      {listModalTab && (
        <FollowListModal
          userId={profile.user_id}
          initialTab={listModalTab}
          onClose={() => setListModalTab(null)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}