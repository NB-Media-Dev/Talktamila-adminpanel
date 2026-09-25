"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import type { UserSuggestion } from "@/types/Auth";
import { buttonVariants } from "@/components/ui/Button";

interface FollowListModalProps {
  userId: number;
  initialTab: "followers" | "following";
  onClose: () => void;
  /** Called after a successful follow/unfollow so the profile counts can refresh. */
  onChanged?: () => void;
}

export default function FollowListModal({
  userId,
  initialTab,
  onClose,
  onChanged,
}: FollowListModalProps) {
  const [tab, setTab] = useState<"followers" | "following">(initialTab);
  const [list, setList] = useState<UserSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      setActionError(null);
      try {
        const data =
          tab === "followers"
            ? await userService.getFollowers(userId)
            : await userService.getFollowing(userId);
        if (!cancelled) setList(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load list.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tab, userId, reloadKey]);

  async function handleFollowToggle(user: UserSuggestion) {
    setActionError(null);
    setPendingIds((prev) => new Set(prev).add(user.user_id));
    try {
      const result = user.is_following
        ? await userService.unfollowUser(user.user_id)
        : await userService.followUser(user.user_id);

      // Keep the row in the list: after "Unfollow" it flips to "Follow", so it can be undone.
      setList((prev) =>
        prev.map((u) =>
          u.user_id === user.user_id
            ? { ...u, is_following: result.is_following, followers_count: result.followers_count }
            : u
        )
      );
      onChanged?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(user.user_id);
        return next;
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with tabs */}
        <div className="flex items-center justify-between border-b border-orange-100 px-4 pt-4">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setTab("followers")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                tab === "followers"
                  ? "border-[#FF6B35] text-gray-900"
                  : "border-transparent text-gray-400"
              }`}
            >
              Followers
            </button>
            <button
              type="button"
              onClick={() => setTab("following")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                tab === "following"
                  ? "border-[#FF6B35] text-gray-900"
                  : "border-transparent text-gray-400"
              }`}
            >
              Following
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="mb-3 text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-2 py-2">
          {actionError && (
            <div className="mx-2 mb-2 p-2 bg-red-50 text-red-600 text-xs rounded-lg text-center border border-red-100">
              {actionError}
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 text-brand animate-spin" />
            </div>
          )}

          {!isLoading && error && (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-gray-500">{error}</p>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className={`${buttonVariants({ variant: "outline" })} mt-3 px-3.5 py-1.5 text-xs font-bold`}
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !error && list.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-10">
              {tab === "followers" ? "No followers yet." : "Not following anyone yet."}
            </p>
          )}

          {!isLoading &&
            !error &&
            list.map((user) => {
              const isPending = pendingIds.has(user.user_id);
              const initials = (user.full_name || user.username || "?").charAt(0).toUpperCase();

              return (
                <div
                  key={user.user_id}
                  className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-orange-50/60"
                >
                  <div className="w-11 h-11 rounded-full ring-1 ring-orange-200 overflow-hidden bg-orange-100 flex items-center justify-center shrink-0">
                    {user.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar_url}
                        alt={user.full_name || user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-brand">{initials}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.full_name || `@${user.username}`}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.bio || `@${user.username}`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFollowToggle(user)}
                    disabled={isPending}
                    className={`px-3 py-1.5 text-xs font-bold shrink-0 ${buttonVariants({
                      variant: user.is_following ? "secondary" : "default",
                    })} disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {isPending ? "…" : user.is_following ? "Unfollow" : "Follow"}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}