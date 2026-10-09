"use client";

import { useEffect, useState } from "react";
import { getInitials } from "@/lib/avatar";
import { userService } from "@/services/user.service";
import { useProfileLink } from "@/hooks/useProfileLink";
import type { UserSuggestion } from "@/types/Auth";
import { buttonVariants } from "@/components/ui/Button";
import { Avatarloading } from "@/components/ui/Skeletonloading";
import PeopleModal from "@/components/messages/PeopleModal";

const LIMIT = 5;

// 1200 -> "1.2K", 2500000 -> "2.5M"
function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function Avatar({ user, size }: { user: UserSuggestion; size: string }) {
  const initials = getInitials({ name: user.full_name, username: user.username });
  return (
    <div
      className={`${size} rounded-full overflow-hidden border border-[#FFEFE0] bg-orange-100 flex items-center justify-center shrink-0`}
    >
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
  );
}

// Real follow suggestions (same source as "Discover people" on the profile page).
export default function TopCreators() {
  const { openProfile } = useProfileLink();
  const [people, setPeople] = useState<UserSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    userService
      .getSuggestions(LIMIT)
      .then((data) => {
        if (!cancelled) setPeople(data);
      })
      .catch((err) => {
        console.error("Failed to load suggestions", err);
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleFollow(user: UserSuggestion) {
    if (pendingIds.has(user.user_id)) return;
    setPendingIds((prev) => new Set(prev).add(user.user_id));
    try {
      const result = user.is_following
        ? await userService.unfollowUser(user.user_id)
        : await userService.followUser(user.user_id);
      setPeople((prev) =>
        prev.map((p) =>
          p.user_id === user.user_id
            ? { ...p, is_following: result.is_following, followers_count: result.followers_count }
            : p
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

  // Nothing real to show -> hide the card instead of showing fake people.
  if (!isLoading && (failed || people.length === 0)) return null;

  return (
    <div className="@container w-full max-w-full bg-white rounded-[32px] p-4 @xs:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B35] lg:hidden" />
          <h2 className="text-xs sm:text-sm lg:text-base font-extrabold lg:font-bold text-gray-900 tracking-wider lg:tracking-tight uppercase lg:normal-case">
            Discover people
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="text-xs font-extrabold lg:font-bold text-gray-400 lg:text-[#FF5A26] hover:text-[#FF6B35] lg:hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {isLoading ? (
        <Avatarloading />
      ) : (
        <div>
          {/* Small screens: horizontal cards */}
          <div className="flex lg:hidden items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {people.map((user) => {
              const busy = pendingIds.has(user.user_id);
              return (
                <div
                  key={user.user_id}
                  className="w-[140px] sm:w-[150px] bg-white rounded-[24px] border border-[#FFEFE0] p-4 flex flex-col items-center text-center gap-3 shrink-0 shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => openProfile(user.username)}
                    className="flex flex-col items-center gap-3 w-full cursor-pointer"
                  >
                    <Avatar user={user} size="w-16 h-16" />
                    <div className="flex flex-col gap-0.5 w-full">
                      <h3 className="text-xs font-extrabold text-gray-900 truncate">
                        {user.full_name || `@${user.username}`}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold">
                        {compact(user.followers_count)} Followers
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => toggleFollow(user)}
                    className={`w-full py-1.5 text-[10px] font-extrabold rounded-full transition-all cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                      user.is_following
                        ? "bg-[#FFEFE0] text-gray-500 border border-transparent"
                        : "bg-white border border-[#FF6B35]/30 text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                    }`}
                  >
                    {busy ? "…" : user.is_following ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Large screens: vertical list */}
          <div className="hidden lg:flex flex-col gap-3.5">
            {people.map((user) => {
              const busy = pendingIds.has(user.user_id);
              return (
                <div key={user.user_id} className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openProfile(user.username)}
                    className="flex items-center gap-3 min-w-0 text-left cursor-pointer"
                  >
                    <Avatar user={user} size="w-10 h-10" />
                    <div className="min-w-0">
                      <h3 className="text-xs text-gray-900 truncate">
                        {user.full_name || `@${user.username}`}
                      </h3>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {compact(user.followers_count)} Followers
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => toggleFollow(user)}
                    className={`px-4 py-1.5 text-[10px] font-black rounded-full transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                      user.is_following
                        ? buttonVariants({ variant: "secondary" })
                        : `border border-[#FF5A26]/30 text-[#FF5A26] ${buttonVariants({ variant: "hoverButton" })}`
                    }`}
                  >
                    {busy ? "…" : user.is_following ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <PeopleModal open={showAll} onClose={() => setShowAll(false)} mode="discover" />
    </div>
  );
}