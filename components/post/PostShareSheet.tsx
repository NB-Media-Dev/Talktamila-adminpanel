"use client";

import React, { useEffect, useState } from "react";
import { Check, Link2, Loader2, Search, Send } from "lucide-react";
import PostModal from "@/components/post/PostModal";
import { messageService } from "@/services/message.service";
import { postService } from "@/services/post.service";
import { getInitials, initialsAvatar } from "@/lib/avatar";
import type { ChatUser } from "@/types/Messages";
import type { Post } from "@/types/Posts";

const MAX_RECIPIENTS = 10;

interface PostShareSheetProps {
  post: Post;
  onClose: () => void;
  /** Called with the new share count after something was shared. */
  onShared?: (shareCount: number) => void;
}

export default function PostShareSheet({ post, onClose, onShared }: PostShareSheetProps) {
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<number, ChatUser>>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const link = postService.shareLink(post.post_id);
  const selectedList = Object.values(selected);
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(
      async () => {
        try {
          const list = await messageService.people(query, 30, 0);
          if (!cancelled) setPeople(list.filter((u) => !u.blocked_by_me && !u.blocked_me));
        } catch (e) {
          if (!cancelled) setError(e instanceof Error ? e.message : "Could not load people.");
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      query ? 300 : 0
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function toggle(u: ChatUser) {
    setError(null);
    setSelected((prev) => {
      if (prev[u.user_id]) {
        const next = { ...prev };
        delete next[u.user_id];
        return next;
      }
      if (Object.keys(prev).length >= MAX_RECIPIENTS) {
        setError(`You can send to ${MAX_RECIPIENTS} people at a time.`);
        return prev;
      }
      return { ...prev, [u.user_id]: u };
    });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      postService
        .recordShare(post.post_id, "link")
        .then((s) => onShared?.(s.share_count))
        .catch(() => {});
    } catch {
      setError("Couldn't copy the link.");
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ url: link, text: "Check out this post on Talk Tamila" });
      postService
        .recordShare(post.post_id, "other")
        .then((s) => onShared?.(s.share_count))
        .catch(() => {});
    } catch {
      /* the person closed the share sheet */
    }
  }

  async function send() {
    if (selectedList.length === 0 || sending) return;
    setSending(true);
    setError(null);
    setResult(null);
    const body = `${message.trim() ? `${message.trim()}\n` : ""}${link}`;
    const outcomes = await Promise.allSettled(selectedList.map((u) => messageService.send(u.user_id, body)));
    const failed: string[] = [];
    let ok = 0;
    outcomes.forEach((o, i) => {
      if (o.status === "fulfilled") ok += 1;
      else {
        const reason = o.reason instanceof Error ? o.reason.message : "failed";
        failed.push(`@${selectedList[i].username}: ${reason}`);
      }
    });
    if (ok > 0) {
      try {
        const s = await postService.recordShare(post.post_id, "dm", ok);
        onShared?.(s.share_count);
      } catch {
        /* the messages went out, the counter can wait */
      }
    }
    setSending(false);
    if (failed.length === 0) {
      setResult(`Sent to ${ok} ${ok === 1 ? "person" : "people"}.`);
      setSelected({});
      setMessage("");
    } else {
      setSelected((prev) => {
        const next: Record<number, ChatUser> = {};
        selectedList.forEach((u, i) => {
          if (outcomes[i].status === "rejected" && prev[u.user_id]) next[u.user_id] = u;
        });
        return next;
      });
      setError(`${ok ? `Sent to ${ok}. ` : ""}Could not send to: ${failed.join("; ")}`);
    }
  }

  return (
    <PostModal
      title="Share"
      onClose={onClose}
      dismissible={!sending}
      footer={
        <div className="flex flex-col gap-2.5">
          {selectedList.length > 0 && (
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={300}
              placeholder="Write a message…"
              className="w-full border border-[#FFEFE0] bg-[#FFFDFB] rounded-full px-4 py-2 text-[13px] outline-none focus:border-[#FF6B35]"
            />
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#FFEFE0] text-[12px] font-bold text-[#9b4811] hover:bg-[#FFF6ED] cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              {copied ? "Copied" : "Copy link"}
            </button>
            {canNativeShare && (
              <button
                type="button"
                onClick={nativeShare}
                className="px-3.5 py-2 rounded-full border border-[#FFEFE0] text-[12px] font-bold text-[#9b4811] hover:bg-[#FFF6ED] cursor-pointer"
              >
                More…
              </button>
            )}
            <button
              type="button"
              onClick={send}
              disabled={selectedList.length === 0 || sending}
              className="ml-auto flex items-center gap-1.5 px-5 py-2 rounded-full text-[13px] font-bold text-white bg-[linear-gradient(135deg,#E6703A,#FFA663)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {selectedList.length > 1 ? `Send (${selectedList.length})` : "Send"}
            </button>
          </div>
        </div>
      }
    >
      <div className="px-5 pt-3 pb-1">
        <div className="flex items-center gap-2 bg-[#FFF6ED] border border-[#FFEFE0] rounded-full px-3 py-2">
          <Search className="w-4 h-4 text-[#8E8E93] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 placeholder:text-[#8E8E93]"
          />
        </div>
        {error && <p role="alert" className="mt-2 text-[12px] text-red-600">{error}</p>}
        {result && <p className="mt-2 text-[12px] text-emerald-600">{result}</p>}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF6B35]" />
        </div>
      ) : people.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-500">No one found.</p>
      ) : (
        <ul className="py-1">
          {people.map((u) => {
            const on = Boolean(selected[u.user_id]);
            return (
              <li key={u.user_id}>
                <button
                  type="button"
                  onClick={() => toggle(u)}
                  aria-pressed={on}
                  className="w-full flex items-center gap-3 px-5 py-2 hover:bg-[#FFF6ED] text-left cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={u.avatar_url || initialsAvatar(getInitials({ name: u.full_name, username: u.username }))}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-[#FFEFE0] bg-gray-50"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-gray-900 truncate">{u.username}</span>
                    <span className="block text-xs text-gray-500 truncate">{u.full_name}</span>
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      on ? "bg-[#FF6B35] border-[#FF6B35] text-white" : "border-[#D9D9DE]"
                    }`}
                  >
                    {on && <Check className="w-3 h-3" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </PostModal>
  );
}