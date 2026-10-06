"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Heart,
  MessageSquare,
  MessageCircle,
  Layers,
  AtSign,
  UserPlus,
  Share2,
  Smile,
  Tv,
  Bell,
  BellOff,
  RefreshCw,
  CheckCheck,
  Star,
  ExternalLink,
} from "lucide-react";
import { notificationService, NotificationItem } from "@/services/notification.service";
import { useAuthRole } from "@/hooks/useAuthRole";

// ─── Type config registry ────────────────────────────────────────────────────
// Covers ALL backend types: story_like, story_reply, story_share, story_react,
// follow, comment, like, story — plus a fallback for unknown types.

interface TypeConfig {
  icon: React.ReactNode;
  label: string;       // verb phrase used in message fallback
  tab: "all" | "mentions" | "requests" | "reactions";
  color: string;       // tailwind text colour for the badge icon
  bg: string;          // tailwind bg colour for the badge icon ring
}

const TYPE_MAP: Record<string, TypeConfig> = {
  story_like: {
    icon: <Heart className="w-3 h-3 fill-current" />,
    label: "liked your story",
    tab: "reactions",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  like: {
    icon: <Heart className="w-3 h-3 fill-current" />,
    label: "liked your post",
    tab: "reactions",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  story_reply: {
    icon: <MessageSquare className="w-3 h-3" />,
    label: "replied to your story",
    tab: "mentions",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  comment: {
    icon: <MessageSquare className="w-3 h-3" />,
    label: "commented on your post",
    tab: "mentions",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  new_message: {
    icon: <MessageCircle className="w-3 h-3 fill-current" />,
    label: "sent you a message",
    tab: "mentions",
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  message_react: {
    icon: <Smile className="w-3 h-3" />,
    label: "reacted to your message",
    tab: "reactions",
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  story_share: {
    icon: <Share2 className="w-3 h-3" />,
    label: "shared a story with you",
    tab: "all",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  story_react: {
    icon: <Smile className="w-3 h-3" />,
    label: "reacted to your story",
    tab: "reactions",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  follow: {
    icon: <UserPlus className="w-3 h-3" />,
    label: "started following you",
    tab: "requests",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  story: {
    icon: <Tv className="w-3 h-3" />,
    label: "shared a new story",
    tab: "all",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  STORY_MENTION: {
    icon: <AtSign className="w-3 h-3" />,
    label: "mentioned you in their story",
    tab: "mentions",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  story_mention: {
    icon: <AtSign className="w-3 h-3" />,
    label: "mentioned you in their story",
    tab: "mentions",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  STORY_SHARED: {
    icon: <Share2 className="w-3 h-3" />,
    label: "shared your story",
    tab: "all",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  story_shared: {
    icon: <Share2 className="w-3 h-3" />,
    label: "shared your story",
    tab: "all",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
};

const FALLBACK_CONFIG: TypeConfig = {
  icon: <Star className="w-3 h-3" />,
  label: "sent you a notification",
  tab: "all",
  color: "text-gray-400",
  bg: "bg-gray-50",
};

function getConfig(type: string): TypeConfig {
  return TYPE_MAP[type] ?? FALLBACK_CONFIG;
}


// ─── Navigation URL resolver ──────────────────────────────────────────────────
/**
 * Returns the URL to navigate to when a notification row is clicked.
 * Routing pattern (role-aware):
 *   story_reply / story_react / story_like / story_share  → /{role}?open_story={story_id}
 *   new_message / message_react                           → /{role}/messages?user={actor_id}
 *   follow                                                → /{role}/u/{actor_username}
 */
function resolveNavUrl(
  notif: NotificationItem,
  base: string  // '/influencer' | '/freelancer' | '/admin'
): string | null {
  const { type, actor_id, actor_username, reference_id } = notif;

  switch (type) {
    // ── Direct messages ──────────────────────────────────────────────────────
    case "new_message":
    case "message_react":
      if (actor_id) return `${base}/messages?user=${actor_id}`;
      break;

    // ── Story reply → open the exact story that was replied to ───────────────
    case "story_reply":
      if (reference_id) return `${base}?open_story=${reference_id}`;
      if (actor_id) return `${base}/messages?user=${actor_id}`;
      break;

    // ── Story reactions / likes / shares / mentions → open the story ───────────────────
    case "story_react":
    case "story_like":
    case "story_share":
    case "STORY_SHARED":
    case "story_shared":
    case "STORY_MENTION":
    case "story_mention":
      if (reference_id) return `${base}?open_story=${reference_id}`;
      if (actor_id) return `${base}/messages?user=${actor_id}`;
      break;

    // ── Comment / mention ────────────────────────────────────────────────────
    case "comment":
    case "mention":
      if (actor_username) return `${base}/u/${encodeURIComponent(actor_username)}`;
      if (actor_id) return `${base}/messages?user=${actor_id}`;
      break;

    // ── Follow → open their profile ──────────────────────────────────────────
    case "follow":
    case "request":
      if (actor_username) return `${base}/u/${encodeURIComponent(actor_username)}`;
      break;

    // ── Generic story / like ─────────────────────────────────────────────────
    case "like":
    case "story":
      if (reference_id) return `${base}?open_story=${reference_id}`;
      if (actor_username) return `${base}/u/${encodeURIComponent(actor_username)}`;
      break;

    default:
      if (actor_username) return `${base}/u/${encodeURIComponent(actor_username)}`;
      if (actor_id) return `${base}/messages?user=${actor_id}`;
  }

  return null;
}



// ─── Avatar initials ──────────────────────────────────────────────────────────
function extractInitial(message: string | null, type: string): string {
  if (message) {
    const match = message.match(/^([A-Za-z0-9_]+)/);
    if (match) return match[1][0].toUpperCase();
  }
  return type[0]?.toUpperCase() ?? "N";
}

// ─── Relative time ─────────────────────────────────────────────────────────────
function formatRelativeTime(isoString: string): string {
  if (!isoString) return "Just now";
  let normalized = isoString.trim();
  // Ensure UTC indicator if no timezone offset is present in backend datetime string
  if (!normalized.endsWith("Z") && !/[+-]\d{2}:\d{2}$/.test(normalized)) {
    normalized += "Z";
  }
  const now = new Date();
  const past = new Date(normalized);
  if (isNaN(past.getTime())) return "Just now";

  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - past.getTime()) / 1000));
  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return past.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = "all" | "mentions" | "reactions" | "requests";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "all",       label: "All",       icon: <Layers className="w-3.5 h-3.5" /> },
  { id: "mentions",  label: "Mentions",  icon: <AtSign className="w-3.5 h-3.5" /> },
  { id: "reactions", label: "Reactions", icon: <Heart className="w-3.5 h-3.5" /> },
  { id: "requests",  label: "Requests",  icon: <UserPlus className="w-3.5 h-3.5" /> },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface NotificationBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAllClick?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="p-4 flex gap-3 animate-pulse border-b border-orange-50/30">
      <div className="w-10 h-10 rounded-full bg-orange-100/50 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-orange-100/50 rounded-full w-4/5" />
        <div className="h-2.5 bg-orange-100/30 rounded-full w-2/5" />
      </div>
    </div>
  );
}

// ─── Single notification row ──────────────────────────────────────────────────
interface RowProps {
  notif: NotificationItem;
  isRemoving: boolean;
  isMounted: boolean;
  onRead: (id: number) => void;
  onRemove: (id: number) => void;
  onNavigate: (notif: NotificationItem) => void;
}

function NotifRow({ notif, isRemoving, isMounted, onRead, onRemove, onNavigate }: RowProps) {
  const cfg = getConfig(notif.type);
  const initial = extractInitial(notif.message, notif.type);

  const handleClick = () => {
    if (!notif.is_read) onRead(notif.id);
    onNavigate(notif);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative px-4 py-3.5 flex gap-3 group transition-all duration-300 ease-in-out cursor-pointer border-b border-orange-50/30 last:border-none
        ${!notif.is_read ? "bg-orange-50/25" : "hover:bg-gray-50/60"}
        ${isRemoving ? "translate-x-full opacity-0 max-h-0 py-0 border-none overflow-hidden" : "translate-x-0 opacity-100 max-h-40"}
      `}
    >
      {/* Unread dot */}
      {!notif.is_read && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full" />
      )}

      {/* Avatar */}
      <div className="relative flex-shrink-0 w-10 h-10">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center border border-orange-100/60 shadow-sm font-bold text-sm ${cfg.bg} ${cfg.color}`}
        >
          {initial}
        </div>
        {/* Type badge */}
        <span className={`absolute -bottom-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full ${cfg.bg} ${cfg.color} ring-2 ring-white shadow-sm z-10`}>
          {cfg.icon}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-700 leading-snug">
          {notif.message ? (
            notif.message
          ) : (
            <>
              <span className="font-semibold text-gray-900 capitalize">{notif.type.replace(/_/g, " ")}</span>
              {" "}{cfg.label}
            </>
          )}
        </p>

        <div className="flex items-center gap-1.5 mt-1">
          {/* Type chip */}
          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
            {notif.type.replace(/_/g, " ")}
          </span>
          {/* Timestamp */}
          {isMounted && (
            <span className="text-[10px] text-gray-400 whitespace-nowrap">
              {formatRelativeTime(notif.created_at)}
            </span>
          )}
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(notif.id); }}
        className="self-start mt-0.5 p-0.5 rounded-md text-gray-300 hover:text-orange-500 hover:bg-orange-50 transition-all duration-150 opacity-0 group-hover:opacity-100 flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TalkTamilaNotifications({
  isOpen,
  onClose,
  onViewAllClick,
  onUnreadCountChange,
}: NotificationBoxProps) {
  const router = useRouter();
  const { isInfluencer, isFreelancer } = useAuthRole();
  const roleBase = isInfluencer ? "/influencer" : isFreelancer ? "/freelancer" : "/admin";

  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [removingIds, setRemovingIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const onUnreadRef = useRef(onUnreadCountChange);
  useEffect(() => {
    onUnreadRef.current = onUnreadCountChange;
  }, [onUnreadCountChange]);

  useEffect(() => { setIsMounted(true); }, []);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications(50);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  // ── derived ────────────────────────────────────────────────────────────────
  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    return getConfig(n.type).tab === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Sync unread count to parent safely in an effect (after commit)
  useEffect(() => {
    onUnreadRef.current?.(unreadCount);
  }, [unreadCount]);

  // Tab badge counts
  const tabCounts: Record<Tab, number> = {
    all:       notifications.filter((n) => !n.is_read).length,
    mentions:  notifications.filter((n) => !n.is_read && getConfig(n.type).tab === "mentions").length,
    reactions: notifications.filter((n) => !n.is_read && getConfig(n.type).tab === "reactions").length,
    requests:  notifications.filter((n) => !n.is_read && getConfig(n.type).tab === "requests").length,
  };

  // ── actions ────────────────────────────────────────────────────────────────
  const handleRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    // Negative IDs are synthetic (unread DMs) — no real Notification row to mark
    if (id > 0) {
      try { await notificationService.markRead(id); } catch { /* ignore */ }
    }
  };

  const handleRemove = async (id: number) => {
    setRemovingIds((prev) => [...prev, id]);
    // Only attempt server delete for real Notification rows (positive id)
    if (id > 0) {
      try { await notificationService.deleteNotification(id); } catch { /* ignore */ }
    }
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setRemovingIds((prev) => prev.filter((x) => x !== id));
    }, 300);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try { await notificationService.markAllRead(); } catch { /* ignore */ }
  };

  // ── navigate on click ───────────────────────────────────────────────────────────
  const handleNavigate = useCallback((notif: NotificationItem) => {
    const url = resolveNavUrl(notif, roleBase);
    if (!url) return;            // no deep-link available yet
    onClose();                   // close the panel
    router.push(url);
  }, [roleBase, router, onClose]);

  if (!isOpen) return null;

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="absolute -right-3 top-[80px] w-[360px] sm:w-[420px] bg-white rounded-[24px] border border-orange-100 shadow-[0_20px_60px_rgba(249,115,22,0.16)] z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between bg-gradient-to-b from-orange-50/40 to-transparent border-b border-orange-50/70">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" />
          <h2 className="text-sm font-bold text-gray-800 tracking-wide">Notifications</h2>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full leading-none min-w-[18px] text-center">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="p-1.5 rounded-xl text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="p-1.5 rounded-xl text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="px-3 py-2 flex gap-1 bg-white border-b border-gray-50 overflow-x-auto no-scrollbar">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === id
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/20"
                : "text-gray-500 hover:bg-orange-50/60 hover:text-orange-500"
            }`}
          >
            {icon}
            {label}
            {tabCounts[id] > 0 && (
              <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full leading-none ${
                activeTab === id ? "bg-white/30 text-white" : "bg-orange-100 text-orange-600"
              }`}>
                {tabCounts[id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Feed ── */}
      <div className="max-h-[360px] overflow-y-auto overflow-x-hidden">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : error ? (
          <div className="p-8 text-center flex flex-col items-center gap-2">
            <BellOff className="w-9 h-9 text-orange-200" />
            <p className="text-xs text-gray-400 italic max-w-[220px]">{error}</p>
            <button
              onClick={fetchNotifications}
              className="mt-1 text-xs text-orange-500 hover:text-orange-600 font-bold hover:underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center gap-2">
            <Bell className="w-9 h-9 text-orange-100" />
            <p className="text-xs text-gray-400 font-medium">No {activeTab === "all" ? "" : activeTab + " "}notifications yet</p>
            <p className="text-[10px] text-gray-300">We'll notify you when something happens</p>
          </div>
        ) : (
          filtered.map((notif) => (
            <NotifRow
              key={notif.id}
              notif={notif}
              isRemoving={removingIds.includes(notif.id)}
              isMounted={isMounted}
              onRead={handleRead}
              onRemove={handleRemove}
              onNavigate={handleNavigate}
            />
          ))
        )}
      </div>

      {/* ── Footer ── */}
      <div className="p-3 border-t border-gray-50 bg-gradient-to-t from-orange-50/10 to-white text-center">
        <button
          onClick={() => { onClose(); onViewAllClick?.(); }}
          className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors py-1 px-4 inline-block hover:underline underline-offset-4 tracking-wide"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
