"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock,
  Film,
  FileText,
  Image as ImageIcon,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { MetricsSkeleton } from "@/components/ui/Skeletonloading";
import { getAuthToken } from "@/lib/cookies";
import { notifyPostsChanged, onPostsChanged, postService } from "@/services/post.service";
import type { Post } from "@/types/Posts";
import {
  endOfDay,
  errorMessage,
  formatWhen,
  isoToLocalInput,
  localInputToIso,
  maxLocalInput,
  minLocalInput,
  startOfDay,
  validateLocalInput,
} from "@/lib/schedule";

const PAGE_SIZE = 3;

interface QueueProps {
  /** Only show posts due on this day. null = every scheduled post. */
  filterDate: Date | null;
  onClearFilter: () => void;
}

function postTitle(post: Post): string {
  const firstLine = (post.content || "").trim().split("\n")[0];
  if (firstLine) return firstLine;
  if (post.post_type === "gif") return "GIF post";
  if (post.post_type === "image") return "Image post";
  if (post.post_type === "video") return "Video post";
  return "Untitled post";
}

function postKind(post: Post): string {
  const labels: Record<string, string> = {
    text: "Text post",
    image: "Image",
    video: "Video",
    gif: "GIF",
    poll: "Poll",
  };
  return labels[post.post_type] ?? post.post_type;
}

/** Scheduled media is private, so an <img> tag cannot load it. We fetch it with the login token instead. */
function Thumb({ post }: { post: Post }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (post.post_type === "gif" && post.gif_url) {
      setSrc(post.gif_url);
      return;
    }
    if (post.media_type !== "image" || !post.media_url) {
      setSrc(null);
      return;
    }
    let objectUrl: string | null = null;
    let cancelled = false;
    const token = getAuthToken();
    fetch(postService.mediaSrc(post.media_url), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("no media"))))
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [post.post_id, post.post_type, post.media_type, post.media_url, post.gif_url]);

  const box =
    "w-16 h-16 sm:w-20 sm:h-20 rounded-[16px] sm:rounded-[20px] shrink-0 border border-gray-100/60 shadow-sm";
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element -- blob/remote URLs, so next/image cannot optimise them
    return <img src={src} alt="" className={`${box} object-cover`} />;
  }
  const Icon =
    post.post_type === "video" ? Film : post.post_type === "poll" ? BarChart3 : post.post_type === "image" ? ImageIcon : FileText;
  return (
    <div className={`${box} bg-[#F5EBE1] flex items-center justify-center`}>
      <Icon className="w-6 h-6 text-[#9E3B0B]" />
    </div>
  );
}

interface QueueCardProps {
  post: Post;
  busy: boolean;
  onEdit: (post: Post) => void;
  onPublishNow: (post: Post) => void;
  onDelete: (post: Post) => void;
}

function QueueCard({ post, busy, onEdit, onPublishNow, onDelete }: QueueCardProps) {
  const overdue = !!post.scheduled_at && new Date(post.scheduled_at).getTime() <= Date.now();

  return (
    <div className="flex flex-col bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.01)] border border-[#FFEFE0] gap-3 transition-all duration-300 hover:shadow-[0_8px_40px_rgba(255,90,38,0.04)] w-full">
      <div className="flex items-center justify-between w-full gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 bg-[#F5EBE1]">
            <Clock className="w-5 h-5 text-gray-700" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-gray-900 text-xs sm:text-sm font-semibold truncate">{formatWhen(post.scheduled_at)}</span>
            <span className="text-[0.6875rem] sm:text-xs leading-none mt-1 text-gray-400">
              {overdue ? "Publishing…" : "Scheduled"}
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-[0.6875rem] sm:text-xs font-semibold text-gray-700 bg-[#FFF0E6] shrink-0">
          Talk Tamila
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 py-1 min-w-0">
        <Thumb post={post} />
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm sm:text-[1.0625rem] leading-tight tracking-tight line-clamp-2">
            {postTitle(post)}
          </h3>
          <span className="text-gray-500 text-[0.6875rem] sm:text-xs font-semibold">{postKind(post)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full mt-auto">
        <button
          disabled={busy}
          onClick={() => onEdit(post)}
          className="flex-1 py-3 px-4 rounded-[20px] text-xs sm:text-sm text-center bg-[#9E3B0B] hover:bg-[#8F3204] text-white transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reschedule
        </button>
        <button
          disabled={busy}
          onClick={() => onPublishNow(post)}
          className="border border-gray-200 hover:border-[#F27D42] hover:bg-[#FFF2EC] text-gray-500 hover:text-[#F27D42] p-3 rounded-[20px] transition-all duration-200 cursor-pointer shrink-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Publish now"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
        <button
          disabled={busy}
          onClick={() => onDelete(post)}
          className="border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-600 p-3 rounded-[20px] transition-all duration-200 cursor-pointer shrink-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Cancel this scheduled post"
        >
          <Trash2 className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

function RescheduleDialog({
  post,
  onClose,
  onSaved,
}: {
  post: Post;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [value, setValue] = useState(() => isoToLocalInput(post.scheduled_at));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const problem = validateLocalInput(value);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await postService.reschedule(post.post_id, localInputToIso(value));
      onSaved();
    } catch (e) {
      setError(errorMessage(e));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Reschedule post"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold text-gray-900">Reschedule post</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{postTitle(post)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 cursor-pointer" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-bold text-gray-600">
          New date and time
          <input
            type="datetime-local"
            value={value}
            min={minLocalInput()}
            max={maxLocalInput()}
            onChange={(e) => setValue(e.target.value)}
            className="h-10 px-3 rounded-xl border border-gray-200 outline-none text-sm font-medium text-gray-800 focus:border-[#ef8b54]"
          />
        </label>

        {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 py-2.5 rounded-2xl bg-[#9E3B0B] hover:bg-[#8F3204] text-white text-sm font-bold cursor-pointer disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Queue({ filterDate, onClearFilter }: QueueProps) {
  const [items, setItems] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Post | null>(null);

  const filterMs = filterDate ? startOfDay(filterDate).getTime() : null;

  const load = useCallback(async () => {
    try {
      const res = await postService.getScheduled({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        fromAt: filterMs !== null ? new Date(filterMs).toISOString() : undefined,
        toAt: filterMs !== null ? endOfDay(new Date(filterMs)).toISOString() : undefined,
      });
      // The last item on a page was just removed: step back one page.
      if (res.items.length === 0 && res.total > 0 && page > 1) {
        setPage(Math.max(1, Math.ceil(res.total / PAGE_SIZE)));
        return;
      }
      setItems(res.items);
      setTotal(res.total);
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }, [page, filterMs]);

  useEffect(() => {
    load();
    return onPostsChanged(() => {
      load();
    });
  }, [load]);

  const run = async (post: Post, action: () => Promise<unknown>) => {
    setBusyId(post.post_id);
    setError(null);
    try {
      await action();
      notifyPostsChanged();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = (post: Post) => {
    if (!window.confirm("Cancel this scheduled post? It will not be published.")) return;
    run(post, () => postService.remove(post.post_id));
  };

  const handlePublishNow = (post: Post) => {
    if (!window.confirm("Publish this post right now?")) return;
    run(post, () => postService.publishNow(post.post_id));
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(activePage * PAGE_SIZE, total);

  let content;
  if (isLoading) {
    content = <MetricsSkeleton count={3} columns={3} />;
  } else if (items.length === 0) {
    content = (
      <div className="w-full bg-white rounded-[32px] p-12 text-center border border-[#FFEFE0] shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
        <p className="text-gray-500 font-medium">
          {filterDate ? "Nothing is scheduled for this day." : "Your queue is empty. Create a post and choose Schedule."}
        </p>
      </div>
    );
  } else {
    content = (
      <>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-6 bg-white rounded-2xl border border-[#FFEFE0] shadow-[0_4px_30px_rgba(0,0,0,0.01)] w-full">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Showing <span className="text-gray-900 font-semibold">{from}</span> to{" "}
            <span className="text-gray-900 font-semibold">{to}</span> of{" "}
            <span className="text-gray-900 font-semibold">{total}</span> items
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={activePage === 1}
              className="p-2 rounded-xl border border-[#FFEFE0] text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activePage === n
                    ? "bg-[#9E3B0B] text-white shadow-md shadow-[#9E3B0B]/10"
                    : "border border-[#FFEFE0] text-[#4A5568] hover:bg-[#F5EBE1] hover:text-gray-950"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={activePage === totalPages}
              className="p-2 rounded-xl border border-[#FFEFE0] text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((post) => (
            <QueueCard
              key={post.post_id}
              post={post}
              busy={busyId === post.post_id}
              onEdit={setEditing}
              onPublishNow={handlePublishNow}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 mb-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-xl sm:text-2xl text-gray-900 tracking-tight">Queue</h2>
          <span className="bg-[#EAEFF5] text-[#2C3E50]/70 text-[0.625rem] sm:text-xs font-bold py-1 px-3 rounded-full tracking-wider">
            {total} {total === 1 ? "ITEM" : "ITEMS"}
          </span>
          {filterDate && (
            <button
              onClick={onClearFilter}
              className="flex items-center gap-1 bg-[#FFF2EC] text-[#E5632A] text-[0.625rem] sm:text-xs font-bold py-1 px-3 rounded-full cursor-pointer hover:bg-[#FFE6D9]"
            >
              {filterDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs sm:text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {content}

      {editing && (
        <RescheduleDialog
          post={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            notifyPostsChanged();
          }}
        />
      )}
    </div>
  );
}