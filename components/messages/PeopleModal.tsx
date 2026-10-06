"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MessageCircle, Search, X } from "lucide-react";
import { messageService } from "@/services/message.service";
import { userService } from "@/services/user.service";
import { useMessagesBase } from "@/hooks/useMessagesBase";
import { useProfileLink } from "@/hooks/useProfileLink";
import { buttonVariants } from "@/components/ui/Button";
import UserAvatar from "./UserAvatar";
import type { ChatUser } from "@/types/Messages";

const PAGE = 30;

function roleLabel(role?: string | null) {
  if (!role) return "";
  return role.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PeopleModal({
  open,
  onClose,
  mode,
  onPick,
  onFollowChange,
}: {
  open: boolean;
  onClose: () => void;
  mode: "discover" | "pick";
  onPick?: (user: ChatUser) => void;
  onFollowChange?: () => void;
}) {
  const router = useRouter();
  const base = useMessagesBase();
  const { openProfile } = useProfileLink();
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Set<number>>(new Set());
  const requestRef = useRef(0);

  // Lock page scroll while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const myRequest = ++requestRef.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await messageService.people(query, PAGE, 0);
        if (requestRef.current !== myRequest) return;
        setPeople(rows);
        setHasMore(rows.length === PAGE);
      } catch (err) {
        if (requestRef.current !== myRequest) return;
        setError(err instanceof Error ? err.message : "Could not load people.");
      } finally {
        if (requestRef.current === myRequest) setLoading(false);
      }
    }, query ? 300 : 0);
    return () => clearTimeout(timer);
  }, [open, query]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const rows = await messageService.people(query, PAGE, people.length);
      setPeople((prev) => {
        const seen = new Set(prev.map((p) => p.user_id));
        return [...prev, ...rows.filter((r) => !seen.has(r.user_id))];
      });
      setHasMore(rows.length === PAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load more.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function toggleFollow(user: ChatUser) {
    setPending((p) => new Set(p).add(user.user_id));
    try {
      const res = user.is_following
        ? await userService.unfollowUser(user.user_id)
        : await userService.followUser(user.user_id);
      setPeople((prev) =>
        prev.map((p) =>
          p.user_id === user.user_id
            ? { ...p, is_following: res.is_following, followers_count: res.followers_count }
            : p
        )
      );
      onFollowChange?.();
    } catch (err) {
      console.error("Follow/unfollow failed", err);
    } finally {
      setPending((p) => {
        const next = new Set(p);
        next.delete(user.user_id);
        return next;
      });
    }
  }

  function visitProfile(user: ChatUser) {
    onClose();
    openProfile(user.username);
  }

  function startChat(user: ChatUser) {
    onClose();
    if (onPick) onPick(user);
    else router.push(`${base}?user=${user.user_id}`);
  }

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-[2px] p-0 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "pick" ? "New message" : "Discover people"}
    >
      <div className="w-full sm:max-w-md h-[85dvh] sm:h-[600px] bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-base font-bold text-gray-900">
            {mode === "pick" ? "New message" : "Discover people"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-orange-50 hover:text-[#FF6B35] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or @username"
              className="w-full bg-[#FDEEE2] rounded-full pl-10 pr-4 py-2.5 text-sm outline-none border border-transparent focus:border-brand/35"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {loading && (
            <div className="space-y-2 px-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-orange-100/50 animate-pulse" />
              ))}
            </div>
          )}
          {!loading && error && <p className="text-center text-sm text-red-600 py-8 px-4">{error}</p>}
          {!loading && !error && people.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-10">No one found.</p>
          )}

          {!loading &&
            people.map((u) => {
              const busy = pending.has(u.user_id);
              return (
                <div
                  key={u.user_id}
                  onClick={mode === "pick" ? () => startChat(u) : undefined}
                  className={`flex items-center gap-3 px-2 py-2.5 rounded-2xl ${
                    mode === "pick" ? "hover:bg-orange-50/70 cursor-pointer" : ""
                  }`}
                >
                  <div
                    className={`flex items-center gap-3 min-w-0 flex-1 ${mode === "discover" ? "cursor-pointer" : ""}`}
                    onClick={mode === "discover" ? () => visitProfile(u) : undefined}
                  >
                  <UserAvatar user={u} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {u.full_name || `@${u.username}`}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      @{u.username}
                      {u.role ? <span className="text-[#FF6B35] font-semibold"> · {roleLabel(u.role)}</span> : null}
                    </p>
                  </div>
                  </div>

                  {mode === "discover" && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => startChat(u)}
                        aria-label={`Message ${u.username}`}
                        className={`w-8 h-8 ${buttonVariants({ variant: "bgcolor" })}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => toggleFollow(u)}
                        className={`px-3.5 py-1.5 text-xs font-bold min-w-[84px] ${buttonVariants({
                          variant: u.is_following ? "secondary" : "default",
                        })} disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {busy ? "…" : u.is_following ? "Following" : "Follow"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

          {!loading && hasMore && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="mx-auto mt-2 block text-xs font-semibold text-[#FF6B35] hover:underline disabled:opacity-60 cursor-pointer"
            >
              {loadingMore ? "Loading…" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}