"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  MoreHorizontal,
  Phone,
  PhoneMissed,
  Search,
  Send,
  Smile,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { messageService } from "@/services/message.service";
import { buttonVariants } from "@/components/ui/Button";
import { useProfileLink } from "@/hooks/useProfileLink";
import { useCall } from "@/components/calls/CallProvider";
import UserAvatar from "./UserAvatar";
import ChatHeaderMenu from "./ChatHeaderMenu";
import RequestBar from "./RequestBar";
import {
  clock,
  dayLabel,
  dedupe,
  groupReactions,
  maxRealId,
  mergeById,
  minRealId,
  sameDay,
  sameReactions,
  callSummary,
} from "./chatUtils";
import type { ChatMessage, ChatUser, MessageReaction, RequestState } from "@/types/Messages";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const POLL_MS = 3000;

const QUICK_REACTIONS = ["❤️", "😂", "😮", "😢", "🙏", "👍"];

/** Shown above a story reply / reaction so the message has context. */
function StoryContextCard({ m }: { m: ChatMessage }) {
  const label =
    m.kind === "story_reply"
      ? m.is_mine
        ? "You replied to their story"
        : "Replied to your story"
      : m.is_mine
      ? "You reacted to their story"
      : "Reacted to your story";
  const kindLabel =
    m.story?.media_type === "video" ? "Video story" : m.story?.media_type === "text" ? "Text story" : "Photo story";
  const preview = !m.story || !m.story.available ? "Story no longer available" : m.story.caption || kindLabel;

  return (
    <div className={`mb-1 max-w-full ${m.is_mine ? "text-right" : "text-left"}`}>
      <p className="text-[11px] font-semibold text-gray-500 mb-0.5 px-1">{label}</p>
      <div
        className={`inline-block max-w-full rounded-xl border-l-4 border-[#FF6B35] bg-orange-50 px-3 py-1.5 text-xs text-left truncate ${
          m.story?.available ? "text-gray-700" : "text-gray-400 italic"
        }`}
      >
        {preview}
      </div>
    </div>
  );
}

function roleLabel(role?: string | null) {
  if (!role) return "";
  return role.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Mount this with key={userId} so switching chats starts from a clean state. */
export default function ChatThread({
  userId,
  onBack,
  onActivity,
}: {
  userId: number;
  onBack: () => void;
  /** Called after messages are read/sent so the inbox can refresh. */
  onActivity: () => void;
}) {
  const [partner, setPartner] = useState<ChatUser | null>(null);
  // Message-request status: are they asking to message me, or am I waiting on them?
  const [request, setRequest] = useState<RequestState | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [lastReadId, setLastReadId] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  // Which message has its reaction bar open, and whether the full emoji list is showing.
  const [reactFor, setReactFor] = useState<number | null>(null);
  const [reactFull, setReactFull] = useState(false);
  // Message actions (Copy / Unsend): which message has its menu open, and the unsend confirmation.
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const [confirmUnsendId, setConfirmUnsendId] = useState<number | null>(null);
  const [unsending, setUnsending] = useState(false);
  const { openProfile } = useProfileLink();
  const { startCall, inCall } = useCall();
  const [callError, setCallError] = useState<string | null>(null);
  // Header 3-dot menu: search-in-chat bar and a small dismissable notice.
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [matchIdx, setMatchIdx] = useState(0);
  const [notice, setNotice] = useState<{ tone: "info" | "error"; text: string } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stickRef = useRef(true);
  const prevHeightRef = useRef<number | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const loadedRef = useRef(false);
  // Messages with a reaction request in flight - polling must not overwrite these.
  const reactBusy = useRef<Set<number>>(new Set());
  // Long-press timer (touch screens) for opening a message's menu.
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // First page.
  useEffect(() => {
    let cancelled = false;
    messageService
      .thread(userId, { limit: 40 })
      .then((res) => {
        if (cancelled) return;
        setPartner(res.partner);
        setRequest(res.request ?? null);
        setMessages(res.messages);
        setHasMore(res.has_more);
        setLastReadId(res.last_read_by_other_id);
        stickRef.current = true;
        loadedRef.current = true;
        onActivity();
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not open this chat.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Live updates: poll for anything newer than what we have (pauses in background tabs).
  useEffect(() => {
    const id = setInterval(async () => {
      if (document.hidden || !loadedRef.current) return;
      try {
        const knownMax = maxRealId(messagesRef.current);
        const knownMin = minRealId(messagesRef.current);
        const res = await messageService.thread(userId, {
          afterId: knownMax,
          syncFromId: knownMin,
        });
        if (res.messages.length) {
          setMessages((prev) => mergeById(prev, res.messages));
          if (res.messages.some((m) => !m.is_mine)) onActivity();
        }
        // Reactions added/removed on messages we already have.
        const sync = res.reactions_sync;
        if (sync) {
          setMessages((prev) => {
            let changed = false;
            const next = prev.map((m) => {
              const fresh = sync[String(m.id)];
              if (!fresh || reactBusy.current.has(m.id) || sameReactions(m.reactions, fresh)) return m;
              changed = true;
              return { ...m, reactions: fresh };
            });
            return changed ? next : prev;
          });
        }
        // Messages unsent since the last check: anything we hold in the polled range
        // that the server no longer has. Newer / older ids are left alone.
        if (res.existing_ids && knownMin !== undefined) {
          const alive = new Set(res.existing_ids);
          setMessages((prev) => {
            const next = prev.filter(
              (m) => m.id <= 0 || m.id < knownMin || m.id > knownMax || alive.has(m.id)
            );
            return next.length === prev.length ? prev : next;
          });
        }
        setLastReadId(res.last_read_by_other_id);
        // Picks up "they accepted my request" / "I can send again" without a reload.
        if (res.request) setRequest(res.request);
      } catch {
        /* transient - try again next tick */
      }
    }, POLL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Keep the view pinned to the newest message, or hold position after loading older ones.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (prevHeightRef.current !== null) {
      el.scrollTop = el.scrollHeight - prevHeightRef.current;
      prevHeightRef.current = null;
      return;
    }
    if (stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const loadOlder = useCallback(async () => {
    const first = messagesRef.current.find((m) => m.id > 0);
    if (!first || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const res = await messageService.thread(userId, { beforeId: first.id, limit: 40 });
      prevHeightRef.current = scrollRef.current?.scrollHeight ?? null;
      setMessages((prev) => dedupe([...res.messages, ...prev]));
      setHasMore(res.has_more);
    } catch {
      /* leave the button so they can retry */
    } finally {
      setLoadingOlder(false);
    }
  }, [userId, loadingOlder]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const tempId = -Date.now();
    const optimistic: ChatMessage = {
      id: tempId,
      sender_id: 0,
      receiver_id: userId,
      body: text,
      kind: "text",
      story: null,
      reactions: [],
      created_at: new Date().toISOString(),
      read_at: null,
      is_mine: true,
      pending: true,
    };
    stickRef.current = true;
    setSendError(null);
    setEmojiOpen(false);
    setDraft("");
    setMessages((prev) => [...prev, optimistic]);
    inputRef.current?.focus();

    try {
      const saved = await messageService.send(userId, text);
      setMessages((prev) => dedupe(prev.map((m) => (m.id === tempId ? saved : m))));
      onActivity();
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setDraft(text);
      setSendError(err instanceof Error ? err.message : "Message failed to send.");
    }
  }

  /** In this 1:1 chat, any reaction from someone other than the partner is mine. */
  const withMyReaction = (list: MessageReaction[], emoji: string | null): MessageReaction[] => {
    const theirs = list.filter((r) => r.user_id === userId);
    return emoji ? [...theirs, { user_id: -1, emoji }] : theirs;
  };

  async function toggleReaction(m: ChatMessage, emoji: string) {
    if (m.id <= 0 || reactBusy.current.has(m.id)) return; // still sending, or a request is in flight
    const mine = m.reactions.find((r) => r.user_id !== userId)?.emoji ?? null;
    const next = mine === emoji ? null : emoji; // tapping my own emoji again removes it
    const before = m.reactions;
    const setReactions = (reactions: MessageReaction[]) =>
      setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, reactions } : x)));

    reactBusy.current.add(m.id);
    setReactFor(null);
    setReactFull(false);
    setReactions(withMyReaction(before, next));
    try {
      const res = next ? await messageService.react(m.id, next) : await messageService.unreact(m.id);
      setReactions(res.reactions);
    } catch {
      setReactions(before);
      setSendError("Couldn't update your reaction. Please try again.");
    } finally {
      reactBusy.current.delete(m.id);
    }
  }

  function startPress(m: ChatMessage) {
    if (m.id <= 0) return;
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      setReactFor(null);
      setReactFull(false);
      setMenuFor(m.id);
    }, 450);
  }

  function cancelPress() {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }

  async function copyMessage(m: ChatMessage) {
    setMenuFor(null);
    try {
      await navigator.clipboard.writeText(m.body);
    } catch {
      setSendError("Couldn't copy the message.");
    }
  }

  /** Unsend = delete for everyone. Only my own messages; the server double-checks. */
  async function confirmUnsend() {
    const id = confirmUnsendId;
    if (id === null || unsending) return;
    setUnsending(true);
    try {
      await messageService.unsend(id);
      setMessages((prev) => prev.filter((x) => x.id !== id));
      onActivity();
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "Couldn't unsend the message.");
    } finally {
      setUnsending(false);
      setConfirmUnsendId(null);
    }
  }

  async function placeCall(media: "audio" | "video") {
    if (!partner) return;
    setCallError(null);
    const err = await startCall(partner, media);
    if (err) setCallError(err);
  }

  const callBlocked = !!(partner?.blocked_by_me || partner?.blocked_me);
  const partnerName = partner ? partner.full_name || `@${partner.username}` : "this user";

  // ---- Search in chat: looks through the messages loaded in this chat ----
  const matchIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!searchOpen || !q) return [] as number[];
    return messages
      .filter((m) => m.kind !== "call" && m.body.toLowerCase().includes(q))
      .map((m) => m.id);
  }, [messages, query, searchOpen]);
  const activeIdx = matchIds.length ? Math.min(matchIdx, matchIds.length - 1) : -1;
  const activeMatchId = activeIdx >= 0 ? matchIds[activeIdx] : null;

  useEffect(() => {
    if (activeMatchId === null) return;
    document.getElementById(`msg-${activeMatchId}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeMatchId]);

  function stepMatch(dir: 1 | -1) {
    if (!matchIds.length) return;
    setMatchIdx((activeIdx + dir + matchIds.length) % matchIds.length);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  // ---- Header menu actions (each one throws on failure; the menu shows the error) ----
  async function toggleMute() {
    if (!partner) return;
    const next = !partner.muted;
    if (next) await messageService.mute(userId);
    else await messageService.unmute(userId);
    setPartner((p) => (p ? { ...p, muted: next } : p));
    onActivity();
    setNotice({
      tone: "info",
      text: next ? "Muted. This chat won't count in your unread badge." : "Unmuted.",
    });
  }

  async function toggleBlock() {
    if (!partner) return;
    const next = !partner.blocked_by_me;
    if (next) await messageService.block(userId);
    else await messageService.unblock(userId);
    setPartner((p) => (p ? { ...p, blocked_by_me: next } : p));
    setSendError(null);
  }

  async function reportPartner(reason: string) {
    await messageService.report(userId, reason);
  }

  async function deleteThisChat() {
    await messageService.deleteChat(userId);
    onActivity();
    onBack();
  }

  // ---- Message request actions (Accept / Delete / Block bar) ----
  async function acceptRequest() {
    await messageService.acceptRequest(userId);
    // Now a normal chat: show the composer right away and refresh the inbox.
    setRequest((r) => (r ? { ...r, is_request: false } : r));
    onActivity();
  }

  async function blockRequest() {
    await toggleBlock();
    onActivity();
  }

  const last = messages[messages.length - 1];
  const statusText = !last?.is_mine || last.kind === "call"
    ? null
    : last.pending
    ? "Sending…"
    : lastReadId !== null && last.id <= lastReadId
    ? "Seen"
    : "Sent";

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 sm:px-4 py-3 border-b border-[#FFEFE0] bg-white">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to chats"
          className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:bg-orange-50 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        {partner ? (
          <button
            type="button"
            onClick={() => openProfile(partner.username)}
            aria-label={`View ${partner.full_name || partner.username}'s profile`}
            className="flex items-center gap-3 min-w-0 text-left cursor-pointer"
          >
            <UserAvatar user={partner} size={38} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {partner.full_name || `@${partner.username}`}
              </p>
              <p className="text-[11px] text-gray-500 truncate">
                @{partner.username}
                {partner.role ? <span className="text-[#FF6B35] font-semibold"> · {roleLabel(partner.role)}</span> : null}
              </p>
            </div>
          </button>
        ) : (
          <div className="h-9 w-40 rounded-full bg-orange-100/60 animate-pulse" />
        )}

        {/* Voice and video call - available from the very first message */}
        <div className="ml-auto flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => placeCall("audio")}
            disabled={!partner || inCall || callBlocked}
            aria-label="Voice call"
            title="Voice call"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => placeCall("video")}
            disabled={!partner || inCall || callBlocked}
            aria-label="Video call"
            title="Video call"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer"
          >
            <Video className="w-5 h-5" />
          </button>
          <ChatHeaderMenu
            name={partnerName}
            muted={!!partner?.muted}
            blocked={!!partner?.blocked_by_me}
            disabled={!partner}
            onViewProfile={() => partner && openProfile(partner.username)}
            onSearch={() => setSearchOpen(true)}
            onToggleMute={toggleMute}
            onToggleBlock={toggleBlock}
            onReport={reportPartner}
            onDeleteChat={deleteThisChat}
            onError={(text) => setNotice({ tone: "error", text })}
            onNotice={(text) => setNotice({ tone: "info", text })}
          />
        </div>
      </div>

      {searchOpen && (
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 border-b border-[#FFEFE0] bg-white">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setMatchIdx(Number.MAX_SAFE_INTEGER); // a new search starts at the newest match
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                stepMatch(e.shiftKey ? -1 : 1);
              } else if (e.key === "Escape") {
                closeSearch();
              }
            }}
            placeholder="Search in this chat"
            aria-label="Search in this chat"
            className="flex-1 min-w-0 bg-[#FDEEE2] rounded-full px-3 py-1.5 text-sm outline-none border border-transparent focus:border-brand/35"
          />
          <span className="text-[11px] text-gray-500 tabular-nums shrink-0">
            {matchIds.length ? `${activeIdx + 1}/${matchIds.length}` : query.trim() ? "No results" : ""}
          </span>
          <button
            type="button"
            onClick={() => stepMatch(-1)}
            disabled={!matchIds.length}
            aria-label="Previous result"
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-orange-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => stepMatch(1)}
            disabled={!matchIds.length}
            aria-label="Next result"
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-orange-50 disabled:opacity-40 cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:bg-orange-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {searchOpen && hasMore && (
        <p className="px-4 py-1 text-[11px] text-gray-400 bg-white border-b border-[#FFEFE0]">
          Searching the messages loaded so far. Use &quot;Load earlier messages&quot; to search further back.
        </p>
      )}

      {notice && (
        <div
          className={`flex items-start gap-2 px-4 py-2 text-xs border-b ${
            notice.tone === "error"
              ? "text-red-600 bg-red-50 border-red-100"
              : "text-[#B34A1D] bg-orange-50 border-[#FFEFE0]"
          }`}
        >
          <p className="flex-1">{notice.text}</p>
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss"
            className="font-bold cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {callError && (
        <div className="flex items-start gap-2 px-4 py-2 text-xs text-red-600 bg-red-50 border-b border-red-100">
          <p className="flex-1">{callError}</p>
          <button
            type="button"
            onClick={() => setCallError(null)}
            aria-label="Dismiss"
            className="font-bold text-red-500 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
        }}
        className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-5 py-4 bg-[#FFF8F2]"
      >
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-9 rounded-2xl bg-orange-100/60 animate-pulse ${i % 2 ? "ml-auto w-1/2" : "w-2/5"}`}
              />
            ))}
          </div>
        )}

        {!loading && error && <p className="text-center text-sm text-red-600 py-10">{error}</p>}

        {!loading && !error && (
          <>
            {hasMore && (
              <button
                type="button"
                onClick={loadOlder}
                disabled={loadingOlder}
                className="mx-auto mb-3 block text-xs font-semibold text-[#FF6B35] hover:underline disabled:opacity-60 cursor-pointer"
              >
                {loadingOlder ? "Loading…" : "Load earlier messages"}
              </button>
            )}

            {messages.length === 0 && partner && (
              <div className="flex flex-col items-center text-center py-12">
                <UserAvatar user={partner} size={72} />
                <p className="mt-3 text-sm font-bold text-gray-900">{partner.full_name || `@${partner.username}`}</p>
                <p className="text-xs text-gray-500 mt-1">Say hi 👋 and start the conversation.</p>
              </div>
            )}

            {messages.map((m, i) => {
              const prev = messages[i - 1];
              const next = messages[i + 1];
              const d = new Date(m.created_at);
              const newDay = !prev || !sameDay(new Date(prev.created_at), d);
              const endOfGroup =
                !next || next.is_mine !== m.is_mine || !sameDay(new Date(next.created_at), d);
              const startOfGroup = !prev || prev.is_mine !== m.is_mine || newDay;

              if (m.kind === "call") {
                const c = callSummary(m.body, m.is_mine);
                return (
                  <div key={m.id}>
                    {newDay && (
                      <div className="flex justify-center my-3">
                        <span className="text-[11px] font-semibold text-gray-500 bg-white/80 border border-[#FFEFE0] rounded-full px-3 py-0.5">
                          {dayLabel(m.created_at)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-center my-2">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-xs font-semibold ${
                          c.missed ? "border-red-200 text-red-600" : "border-[#FFEFE0] text-gray-700"
                        }`}
                      >
                        {c.missed ? (
                          <PhoneMissed className="w-4 h-4" />
                        ) : c.media === "video" ? (
                          <Video className="w-4 h-4 text-[#FF6B35]" />
                        ) : (
                          <Phone className="w-4 h-4 text-[#FF6B35]" />
                        )}
                        <span>{c.title}</span>
                        {c.detail && <span className="font-normal text-gray-400">· {c.detail}</span>}
                        <span className="text-[10px] font-normal text-gray-400">{clock(m.created_at)}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              const isStoryMsg = m.kind === "story_reply" || m.kind === "story_reaction";
              const groups = groupReactions(m.reactions, userId);
              const canReact = m.id > 0;
              const barOpen = reactFor === m.id && !reactFull;
              const myEmoji = m.reactions.find((r) => r.user_id !== userId)?.emoji ?? null;

              const menuOpen = menuFor === m.id;

              // Long-press (touch) or right-click opens the message menu.
              const pressProps = canReact
                ? {
                    onTouchStart: () => startPress(m),
                    onTouchEnd: cancelPress,
                    onTouchMove: cancelPress,
                    onTouchCancel: cancelPress,
                    onContextMenu: (e: React.MouseEvent) => {
                      e.preventDefault();
                      setReactFor(null);
                      setReactFull(false);
                      setMenuFor(m.id);
                    },
                  }
                : {};

              const moreButton = canReact ? (
                <button
                  type="button"
                  onClick={() => {
                    setReactFor(null);
                    setReactFull(false);
                    setMenuFor((cur) => (cur === m.id ? null : m.id));
                  }}
                  aria-label="Message options"
                  aria-expanded={menuOpen}
                  className={`shrink-0 mb-1 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 transition-opacity cursor-pointer focus:opacity-100 [@media(hover:none)]:opacity-60 ${
                    menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              ) : null;

              const reactButton = canReact ? (
                <button
                  type="button"
                  onClick={() => {
                    setReactFull(false);
                    setReactFor((cur) => (cur === m.id ? null : m.id));
                  }}
                  aria-label="React to message"
                  aria-expanded={barOpen}
                  className={`shrink-0 mb-1 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF6B35] hover:bg-orange-50 transition-opacity cursor-pointer focus:opacity-100 [@media(hover:none)]:opacity-60 ${
                    barOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <Smile className="w-4 h-4" />
                </button>
              ) : null;

              return (
                <div
                  key={m.id}
                  id={`msg-${m.id}`}
                  className={activeMatchId === m.id ? "rounded-xl bg-amber-100/70" : undefined}
                >
                  {newDay && (
                    <div className="flex justify-center my-3">
                      <span className="text-[11px] font-semibold text-gray-500 bg-white/80 border border-[#FFEFE0] rounded-full px-3 py-0.5">
                        {dayLabel(m.created_at)}
                      </span>
                    </div>
                  )}
                  <div
                    className={`group flex items-end gap-1 ${m.is_mine ? "justify-end" : "justify-start"} ${
                      startOfGroup ? "mt-2" : "mt-0.5"
                    }`}
                  >
                    {m.is_mine && (
                      <>
                        {moreButton}
                        {reactButton}
                      </>
                    )}
                    <div className={`relative max-w-[78%] flex flex-col ${m.is_mine ? "items-end" : "items-start"}`}>
                      {isStoryMsg && <StoryContextCard m={m} />}

                      {m.kind === "story_reaction" ? (
                        <span
                          {...pressProps}
                          className={`text-4xl leading-none px-1 py-0.5 ${m.pending ? "opacity-70" : ""}`}
                          onDoubleClick={() => canReact && toggleReaction(m, "❤️")}
                        >
                          {m.body}
                        </span>
                      ) : (
                        <div
                          {...pressProps}
                          onDoubleClick={() => {
                            if (!canReact) return;
                            window.getSelection()?.removeAllRanges(); // double-click also selects a word
                            toggleReaction(m, "❤️");
                          }}
                          className={`px-3.5 py-2 text-sm whitespace-pre-wrap break-words rounded-2xl [touch-action:manipulation] ${
                            m.is_mine
                              ? `bg-[linear-gradient(135deg,#E6703A,#FFA663)] text-white ${endOfGroup ? "rounded-br-md" : ""} ${m.pending ? "opacity-70" : ""}`
                              : `bg-white text-gray-900 border border-[#FFEFE0] ${endOfGroup ? "rounded-bl-md" : ""}`
                          }`}
                        >
                          {m.body}
                        </div>
                      )}

                      {groups.length > 0 && (
                        <div className={`relative z-[1] -mt-1.5 flex gap-1 ${m.is_mine ? "justify-end" : "justify-start"}`}>
                          {groups.map((g) => (
                            <button
                              key={g.emoji}
                              type="button"
                              onClick={() => toggleReaction(m, g.emoji)}
                              aria-label={`${g.emoji} reaction${g.count > 1 ? `, ${g.count}` : ""}${g.mine ? ", yours" : ""}`}
                              aria-pressed={g.mine}
                              className={`flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-xs leading-none shadow-sm cursor-pointer active:scale-95 transition-transform ${
                                g.mine ? "border-[#FF6B35] bg-orange-50" : "border-[#FFEFE0] bg-white"
                              }`}
                            >
                              <span>{g.emoji}</span>
                              {g.count > 1 && <span className="text-[10px] font-semibold text-gray-600">{g.count}</span>}
                            </button>
                          ))}
                        </div>
                      )}

                      {endOfGroup && (
                        <span className="text-[10px] text-gray-400 mt-0.5 px-1">{clock(m.created_at)}</span>
                      )}

                      {barOpen && (
                        <>
                          <button
                            type="button"
                            aria-label="Close reactions"
                            onClick={() => setReactFor(null)}
                            className="fixed inset-0 z-10 cursor-default"
                          />
                          <div
                            className={`absolute z-20 flex items-center gap-0.5 rounded-full border border-[#FFEFE0] bg-white px-1.5 py-1 shadow-lg ${
                              i === 0 ? "top-full mt-1" : "bottom-full mb-1"
                            } ${m.is_mine ? "right-0" : "left-0"}`}
                          >
                            {QUICK_REACTIONS.map((emoji) => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => toggleReaction(m, emoji)}
                                aria-label={`React with ${emoji}`}
                                aria-pressed={myEmoji === emoji}
                                className={`w-8 h-8 rounded-full text-lg flex items-center justify-center hover:scale-125 transition-transform cursor-pointer ${
                                  myEmoji === emoji ? "bg-orange-100" : ""
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => setReactFull(true)}
                              aria-label="More reactions"
                              className="w-8 h-8 rounded-full text-lg font-bold text-gray-500 flex items-center justify-center hover:bg-orange-50 cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </>
                      )}

                      {menuOpen && (
                        <>
                          <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setMenuFor(null)}
                            className="fixed inset-0 z-10 cursor-default"
                          />
                          <div
                            className={`absolute z-20 min-w-[150px] rounded-2xl border border-[#FFEFE0] bg-white py-1 shadow-lg ${
                              i === 0 ? "top-full mt-1" : "bottom-full mb-1"
                            } ${m.is_mine ? "right-0" : "left-0"}`}
                          >
                            <button
                              type="button"
                              onClick={() => copyMessage(m)}
                              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#FF6B35] cursor-pointer"
                            >
                              <Copy className="w-4 h-4 text-[#FF6B35]" />
                              Copy
                            </button>
                            {m.is_mine && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMenuFor(null);
                                  setConfirmUnsendId(m.id);
                                }}
                                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                                Unsend
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    {!m.is_mine && (
                      <>
                        {reactButton}
                        {moreButton}
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {statusText && (
              <div className="flex justify-end items-center gap-1 pr-1 mt-0.5 text-[10px] font-semibold text-gray-400">
                {statusText === "Seen" ? (
                  <CheckCheck className="w-3 h-3 text-[#FF6B35]" />
                ) : (
                  <Check className="w-3 h-3" />
                )}
                <span className={statusText === "Seen" ? "text-[#FF6B35]" : ""}>{statusText}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full emoji list for reactions ("+" in the quick bar) */}
      {reactFor !== null && reactFull && (
        <div
          className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-black/25"
          onClick={() => {
            setReactFor(null);
            setReactFull(false);
          }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <EmojiPicker
              onEmojiClick={(d) => {
                const target = messagesRef.current.find((x) => x.id === reactFor);
                if (target) toggleReaction(target, d.emoji);
              }}
              width={320}
              height={380}
              lazyLoadEmojis
            />
          </div>
        </div>
      )}

      {/* Unsend confirmation (like Instagram) */}
      {confirmUnsendId !== null && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !unsending && setConfirmUnsendId(null)}
        >
          <div
            className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-bold text-gray-900">Unsend message?</p>
            <p className="text-xs text-gray-500 mt-1">
              This removes the message for everyone in the chat.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmUnsendId(null)}
                disabled={unsending}
                className={`${buttonVariants({ variant: "outline" })} flex-1 px-4 py-2 text-sm font-bold disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmUnsend}
                disabled={unsending}
                className={`${buttonVariants({ variant: "destructive" })} flex-1 px-4 py-2 text-sm font-bold disabled:opacity-50`}
              >
                {unsending ? "…" : "Unsend"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Composer */}
      {callBlocked ? (
        <div className="border-t border-[#FFEFE0] bg-white px-4 py-4 text-center">
          {partner?.blocked_by_me ? (
            <>
              <p className="text-sm font-semibold text-gray-900">You blocked {partnerName}</p>
              <p className="text-xs text-gray-500 mt-0.5">You can&apos;t message or call each other.</p>
              <button
                type="button"
                onClick={() =>
                  toggleBlock().catch((e) =>
                    setNotice({ tone: "error", text: e instanceof Error ? e.message : "Couldn't unblock." })
                  )
                }
                className="mt-2 text-sm font-bold text-[#FF6B35] hover:underline cursor-pointer"
              >
                Unblock
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-500">You can&apos;t send messages to this account.</p>
          )}
        </div>
      ) : request?.is_request ? (
        <RequestBar
          name={partnerName}
          onAccept={acceptRequest}
          onDelete={deleteThisChat}
          onBlock={blockRequest}
        />
      ) : request?.request_sent && !request.can_send ? (
        <div className="border-t border-[#FFEFE0] bg-white px-4 py-4 text-center">
          <p className="text-sm font-semibold text-gray-900">Message request sent</p>
          <p className="text-xs text-gray-500 mt-0.5">
            You can send more messages once {partnerName} accepts your request.
          </p>
        </div>
      ) : (
      <form onSubmit={handleSend} className="relative border-t border-[#FFEFE0] bg-white px-3 py-3">
        {request?.request_sent && (
          <p className="text-[11px] text-gray-500 mb-2 px-2">
            {partnerName} doesn&apos;t follow you back, so your message will go to their message requests.
          </p>
        )}
        {sendError && <p className="text-xs text-red-600 mb-2 px-2">{sendError}</p>}
        {emojiOpen && (
          <div className="absolute bottom-full left-3 mb-2 z-20 shadow-xl rounded-2xl overflow-hidden">
            <EmojiPicker
              onEmojiClick={(d) => {
                setDraft((v) => v + d.emoji);
                inputRef.current?.focus();
              }}
              width={300}
              height={360}
              lazyLoadEmojis
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEmojiOpen((v) => !v)}
            aria-label="Emoji"
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 cursor-pointer"
          >
            <Smile className="w-5 h-5" />
          </button>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={2000}
            placeholder="Message…"
            autoComplete="off"
            className="flex-1 min-w-0 bg-[#FDEEE2] rounded-full px-4 py-2.5 text-sm outline-none border border-transparent focus:border-brand/35"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send message"
            className="w-9 h-9 shrink-0 rounded-full bg-[linear-gradient(135deg,#E6703A,#FFA663)] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
      )}
    </div>
  );
}