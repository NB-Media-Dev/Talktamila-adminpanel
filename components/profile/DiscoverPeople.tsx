"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { userService } from "@/services/user.service";
import type { UserSuggestion } from "@/types/Auth";
import { Cardlayout } from "@/components/ui/Cardlayout";
import { buttonVariants } from "@/components/ui/Button";

/**
 * "Discover people" strip for the profile page — built on the existing
 * Cardlayout / Button / color-token pattern already used across the
 * dashboard, so it sits visually in line with the rest of the app.
 *
 * Depends on:
 *   GET    /api/v1/stories/suggestions   <- does NOT exist yet, will 404
 *   POST   /api/v1/stories/follow/{id}   <- exists (StoryService.follow_user)
 *   DELETE /api/v1/stories/follow/{id}   <- exists (StoryService.unfollow_user)
 */
export default function DiscoverPeople() {
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await userService.getSuggestions(10);
        if (!cancelled) setSuggestions(data);
      } catch (err) {
        console.error("Failed to load suggestions", err);
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "Failed to load suggestions.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = suggestions.filter((s) => !dismissedIds.has(s.user_id));

  async function handleFollowToggle(user: UserSuggestion) {
    setPendingIds((prev) => new Set(prev).add(user.user_id));
    try {
      const result = user.is_following
        ? await userService.unfollowUser(user.user_id)
        : await userService.followUser(user.user_id);

      setSuggestions((prev) =>
        prev.map((s) =>
          s.user_id === user.user_id
            ? { ...s, is_following: result.is_following, followers_count: result.followers_count }
            : s
        )
      );
    } catch (err) {
      console.error("Follow/unfollow failed", err);
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(user.user_id);
        return next;
      });
    }
  }

  function handleDismiss(userId: number) {
    setDismissedIds((prev) => new Set(prev).add(userId));
  }

  // Nothing to suggest, an error, and not loading — don't take up space.
  if (!isLoading && (loadError || visible.length === 0)) return null;

  return (
    <Cardlayout
      title="Discover people"
      icon={<Users className="w-4 h-4 text-[#FF6B35]" />}
      action="See all"
      isLoading={isLoading}
      skeleton={
        <div className="flex gap-3 overflow-x-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-32 h-40 rounded-2xl bg-orange-100/50 shrink-0 animate-pulse" />
          ))}
        </div>
      }
    >
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {visible.map((user) => {
          const isPending = pendingIds.has(user.user_id);
          const initials =
            (user.full_name || user.username || "?").charAt(0).toUpperCase();

          return (
            <div
              key={user.user_id}
              className="relative shrink-0 w-32 bg-white rounded-2xl border border-[#FFEFE0] p-3 flex flex-col items-center text-center"
            >
              <button
                type="button"
                onClick={() => handleDismiss(user.user_id)}
                aria-label="Dismiss suggestion"
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-[#E05D24] hover:bg-orange-50 transition-colors text-xs cursor-pointer"
              >
                ✕
              </button>

              <div className="w-14 h-14 rounded-full ring-2 ring-orange-200 ring-offset-2 overflow-hidden bg-orange-100 flex items-center justify-center shrink-0 mb-2">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-brand">{initials}</span>
                )}
              </div>

              <p className="text-sm font-semibold text-gray-900 truncate w-full">
                {user.full_name || `@${user.username}`}
              </p>
              <p className="text-xs text-gray-400 truncate w-full mb-3">
                {user.bio || user.role}
              </p>

              <button
                type="button"
                onClick={() => handleFollowToggle(user)}
                disabled={isPending}
                className={`w-full px-2 py-1.5 text-xs font-bold ${buttonVariants({
                  variant: user.is_following ? "secondary" : "default",
                })} disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {isPending ? "…" : user.is_following ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </Cardlayout>
  );
}