"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Bookmark, Heart, Loader2, MessageCircle, MoreHorizontal, Pin, Send } from "lucide-react";
import { notifyPostsChanged, postService } from "@/services/post.service";
import { userService } from "@/services/user.service";
import { getInitials, initialsAvatar } from "@/lib/avatar";
import { timeAgo } from "@/lib/timeAgo";
import { useProfileLink } from "@/hooks/useProfileLink";
import { useContenthook } from "@/hooks/useContent";
import PostModal from "@/components/post/PostModal";
import RichText from "@/components/post/RichText";
import PostMusicPlayer from "@/components/post/PostMusicPlayer";
import PostMoreMenu from "@/components/post/PostMoreMenu";
import PostComments from "@/components/post/PostComments";
import PostShareSheet from "@/components/post/PostShareSheet";
import PostEditModal from "@/components/post/PostEditModal";
import PostInsightsModal from "@/components/post/PostInsightsModal";
import PostCarousel from "@/components/post/PostCarousel";
import PostLikersModal from "@/components/post/PostLikersModal";
import { REPORT_REASONS, type FeedResponse, type Poll, type Post, type PostAuthor, type ReportReason } from "@/types/Posts";

interface PostCardProps {
  post: Post;
  author?: PostAuthor;
  onDeleted: (postId: number) => void;
  onPollUpdated: (postId: number, poll: Poll) => void;
  /** Called with the fresh post after a like, save, edit, pin and so on. */
  onUpdated?: (post: Post) => void;
  /** Called when the post leaves the list it is shown in (archived or restored). */
  onRemoved?: (postId: number) => void;
  defaultShowComments?: boolean;
}

type ModalName = "edit" | "share" | "insights" | "likers" | "report" | null;

// A view is counted once per person per page load.
const viewedPosts = new Set<number>();

const CAPTION_PREVIEW_CHARS = 140;

// Instagram-style numbers: 987, 1,234, 12.3K, 1.2M
function fmtCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toLocaleString();
}

// Instagram-style picture frame: it follows the picture's own shape, but is never
// taller than 4:5 and never wider than 1.91:1. Anything outside that is cropped.
const MIN_RATIO = 4 / 5;
const MAX_RATIO = 1.91;
function clampRatio(width: number, height: number): number {
  if (!width || !height) return 1;
  return Math.min(MAX_RATIO, Math.max(MIN_RATIO, width / height));
}

export default function PostCard({
  post,
  author,
  onDeleted,
  onPollUpdated,
  onUpdated,
  onRemoved,
  defaultShowComments = false,
}: PostCardProps) {
  const { openProfile } = useProfileLink();
  const content = useContext(useContenthook);
  const [p, setP] = useState<Post>(post);
  const pRef = useRef<Post>(post);
  const onUpdatedRef = useRef(onUpdated);
  const rootRef = useRef<HTMLElement | null>(null);
  const likeBusy = useRef(false);
  const saveBusy = useRef(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<ModalName>(null);

  // Opens the same Analytics popup for every post (the page that already exists).
  // If the page has no popup host, fall back to the post's own insights popup.
  const openAnalytics = () => {
    if (content) content.setAnalyticsState(true);
    else setModal("insights");
  };
  const [showComments, setShowComments] = useState(defaultShowComments);
  const [captionOpen, setCaptionOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [burst, setBurst] = useState(0);
  const [mediaRatio, setMediaRatio] = useState(1);
  const [reportReason, setReportReason] = useState<ReportReason | null>(null);
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    onUpdatedRef.current = onUpdated;
  }, [onUpdated]);

  // Follow the parent's copy of the post, but only when it really changed.
  const signature = JSON.stringify(post);
  useEffect(() => {
    setP(post);
    pRef.current = post;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  useEffect(
    () => () => {
      if (noticeTimer.current) clearTimeout(noticeTimer.current);
    },
    []
  );

  const patch = useCallback((partial: Partial<Post>) => {
    const next = { ...pRef.current, ...partial };
    pRef.current = next;
    setP(next);
    onUpdatedRef.current?.(next);
  }, []);

  const applyServer = useCallback((res: FeedResponse) => {
    const item = res.items[0];
    if (!item) return;
    pRef.current = item;
    setP(item);
    onUpdatedRef.current?.(item);
  }, []);

  const flash = useCallback((text: string) => {
    setNotice(text);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 2200);
  }, []);

  const fail = (e: unknown, fallback: string) => setMessage(e instanceof Error ? e.message : fallback);

  const interactive = p.status === "published";
  const isOwner = Boolean(p.is_owner);
  const name = author?.name || author?.username || "Unknown";
  const username = author?.username;
  const avatar =
    author?.avatar_url || initialsAvatar(getInitials({ name: author?.name, username: author?.username }));

  // Count a view when at least half of the card has been on screen for a second.
  useEffect(() => {
    if (isOwner || p.status !== "published" || viewedPosts.has(p.post_id)) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            viewedPosts.add(p.post_id);
            postService.recordView(p.post_id).catch(() => {});
            io.disconnect();
          }, 1000);
        } else if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [p.post_id, p.status, isOwner]);

  // ------------------------------------------------------------------ like
  const toggleLike = async (forceLike = false) => {
    const cur = pRef.current;
    if (cur.status !== "published" || likeBusy.current) return;
    if (forceLike && cur.liked_by_me) return;
    const willLike = forceLike ? true : !cur.liked_by_me;
    likeBusy.current = true;
    setMessage(null);
    patch({
      liked_by_me: willLike,
      like_count: cur.like_count == null ? null : Math.max(0, cur.like_count + (willLike ? 1 : -1)),
    });
    try {
      const res = willLike ? await postService.like(cur.post_id) : await postService.unlike(cur.post_id);
      patch({ liked_by_me: res.liked, like_count: res.like_count });
    } catch (e) {
      patch({ liked_by_me: cur.liked_by_me, like_count: cur.like_count });
      fail(e, "Could not update your like.");
    } finally {
      likeBusy.current = false;
    }
  };

  const onDoubleTap = () => {
    if (!interactive) return;
    setBurst(Date.now());
    setTimeout(() => setBurst(0), 850);
    toggleLike(true);
  };

  // ------------------------------------------------------------------ save
  const toggleSave = async () => {
    const cur = pRef.current;
    if (cur.status !== "published" || saveBusy.current) return;
    saveBusy.current = true;
    setMessage(null);
    const willSave = !cur.saved_by_me;
    patch({ saved_by_me: willSave });
    try {
      if (willSave) await postService.save(cur.post_id);
      else await postService.unsave(cur.post_id);
      flash(willSave ? "Saved" : "Removed from saved");
    } catch (e) {
      patch({ saved_by_me: cur.saved_by_me });
      fail(e, "Could not update your saved posts.");
    } finally {
      saveBusy.current = false;
    }
  };

  // ------------------------------------------------------------- menu items
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postService.shareLink(p.post_id));
      flash("Link copied");
      postService
        .recordShare(p.post_id, "link")
        .then((s) => patch({ share_count: s.share_count }))
        .catch(() => {});
    } catch {
      setMessage("Couldn't copy the link.");
    }
  };

  const toggleFollow = async () => {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = p.following_author
        ? await userService.unfollowUser(p.author_id)
        : await userService.followUser(p.author_id);
      patch({ following_author: res.is_following });
      flash(res.is_following ? `Following @${username}` : `Unfollowed @${username}`);
    } catch (e) {
      fail(e, "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const runOwnerAction = async (fn: () => Promise<FeedResponse>, done?: string) => {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const res = await fn();
      applyServer(res);
      if (done) flash(done);
      return res;
    } catch (e) {
      fail(e, "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const toggleHideLikes = () =>
    runOwnerAction(() => postService.edit(p.post_id, { hideLikeCount: !p.hide_like_count }), p.hide_like_count ? "Like count is visible" : "Like count hidden");

  const toggleComments = () =>
    runOwnerAction(
      () => postService.edit(p.post_id, { commentsDisabled: !p.comments_disabled }),
      p.comments_disabled ? "Commenting is on" : "Commenting is off"
    );

  const togglePin = async () => {
    const res = await runOwnerAction(
      () => (p.is_pinned ? postService.unpin(p.post_id) : postService.pin(p.post_id)),
      p.is_pinned ? "Unpinned" : "Pinned to your profile"
    );
    if (res) notifyPostsChanged();
  };

  const toggleArchive = async () => {
    if (busy) return;
    const archiving = p.status === "published";
    setBusy(true);
    setMessage(null);
    try {
      if (archiving) await postService.archive(p.post_id);
      else await postService.restore(p.post_id);
      notifyPostsChanged();
      onRemoved?.(p.post_id);
      if (!onRemoved) {
        patch({ status: archiving ? "archived" : "published", is_pinned: false });
        flash(archiving ? "Archived. Only you can see it." : "Back on your profile");
      }
    } catch (e) {
      fail(e, "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    const text =
      p.status === "scheduled"
        ? "Cancel this scheduled post?"
        : "Delete this post? This cannot be undone.";
    if (deleting || !window.confirm(text)) return;
    setDeleting(true);
    setMessage(null);
    try {
      await postService.remove(p.post_id);
      onDeleted(p.post_id);
    } catch (e) {
      setDeleting(false);
      fail(e, "Could not delete the post.");
    }
  };

  const submitReport = async () => {
    if (!reportReason || reporting) return;
    setReporting(true);
    try {
      await postService.report(p.post_id, reportReason);
      setModal(null);
      setReportReason(null);
      flash("Thanks for letting us know");
    } catch (e) {
      setModal(null);
      fail(e, "Could not send your report.");
    } finally {
      setReporting(false);
    }
  };

  const handleVote = async (optionId: number) => {
    if (voting || !p.poll || p.poll.my_vote_option_id !== null) return;
    setVoting(true);
    setMessage(null);
    try {
      const poll = await postService.vote(p.post_id, optionId);
      patch({ poll });
      onPollUpdated(p.post_id, poll);
    } catch (e) {
      fail(e, "Could not record your vote.");
    } finally {
      setVoting(false);
    }
  };

  // -------------------------------------------------------------- rendering
  const poll = p.poll;
  const hasVoted = poll ? poll.my_vote_option_id !== null : false;
  const likeCount = p.like_count;
  const preview = p.liked_by_preview;
  const canSeeLikers = isOwner || !p.likes_hidden;
  const caption = p.content || "";
  const isLongCaption = caption.length > CAPTION_PREVIEW_CHARS || caption.split("\n").length > 3;
  const shownCaption = !captionOpen && isLongCaption ? `${caption.slice(0, CAPTION_PREVIEW_CHARS).trimEnd()}…` : caption;
  const commentCount = p.comment_count ?? 0;

  const likesLine = () => {
    if (likeCount == null) {
      return preview ? (
        <span>
          Liked by <b className="font-bold text-gray-900">{preview.username}</b> and others
        </span>
      ) : null;
    }
    if (likeCount === 0) return isOwner ? <span className="text-[#8E8E93]">No likes yet</span> : <span>Be the first to like this</span>;
    const button = (content: React.ReactNode) =>
      canSeeLikers ? (
        <button type="button" onClick={() => setModal("likers")} className="cursor-pointer text-left">
          {content}
        </button>
      ) : (
        <span>{content}</span>
      );
    if (preview && likeCount > 1) {
      return button(
        <>
          Liked by <b className="font-bold text-gray-900">{preview.username}</b> and{" "}
          <b className="font-bold text-gray-900">{(likeCount - 1).toLocaleString()} {likeCount - 1 === 1 ? "other" : "others"}</b>
        </>
      );
    }
    if (preview) {
      return button(
        <>
          Liked by <b className="font-bold text-gray-900">{preview.username}</b>
        </>
      );
    }
    // Plain "N likes" is shown beside the heart, like Instagram.
    return null;
  };
  const likesNode = interactive ? likesLine() : null;

  const body = (
    <>
      {p.post_type === "text" && caption && (
        <div className="bg-[#FFFDFB] rounded-[20px] p-4 border border-[#FFEFE0] text-[0.84375rem] text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
          <RichText text={caption} />
        </div>
      )}

      {p.post_type === "image" && p.media_url && (p.media_urls?.length ?? 0) > 1 && (
        <PostCarousel urls={p.media_urls!.map((u) => postService.mediaSrc(u))} alt="Post picture" />
      )}

      {p.post_type === "image" && p.media_url && (p.media_urls?.length ?? 0) <= 1 && (
        <div
          className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-gray-900/5"
          style={{ aspectRatio: mediaRatio }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={postService.mediaSrc(p.media_url)}
            alt="Post image"
            loading="lazy"
            draggable={false}
            onLoad={(e) => setMediaRatio(clampRatio(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight))}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {p.post_type === "video" && p.media_url && (
        <div
          className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-black"
          style={{ aspectRatio: mediaRatio }}
        >
          <video
            src={postService.mediaSrc(p.media_url)}
            controls
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => setMediaRatio(clampRatio(e.currentTarget.videoWidth, e.currentTarget.videoHeight))}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {p.post_type === "gif" && p.gif_url && (
        <div
          className="w-full rounded-[24px] overflow-hidden border border-[#FFEFE0] bg-gray-900/5"
          style={{ aspectRatio: mediaRatio }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.gif_url}
            alt="GIF"
            loading="lazy"
            draggable={false}
            onLoad={(e) => setMediaRatio(clampRatio(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight))}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  );

  return (
    <article
      ref={rootRef}
      className="w-full max-w-[540px] mx-auto bg-white rounded-[24px] sm:rounded-[32px] p-3.5 xs:p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-3 sm:gap-3.5"
    >
      <style>{`@keyframes ttHeart{0%{transform:scale(.2);opacity:0}25%{transform:scale(1.25);opacity:1}60%{transform:scale(1);opacity:1}100%{transform:scale(1.1);opacity:0}}`}</style>

      {/* header */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => username && openProfile(username)}
          className="flex items-center gap-3 min-w-0 text-left cursor-pointer"
        >
          <div className="w-11 h-11 rounded-full overflow-hidden relative border border-[#FFEFE0] bg-gray-50 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={avatar} alt={`${name} avatar`} className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-sm text-gray-900 leading-none truncate">{name}</span>
              {username && <span className="text-[#8E8E93] text-xs font-normal truncate">@{username}</span>}
            </div>
            <span className="text-[0.6875rem] text-[#8E8E93] mt-0.5">
              {timeAgo(p.published_at || p.created_at)}
              {p.edited_at ? " · Edited" : ""}
              {p.status === "scheduled" ? " · Scheduled" : ""}
            </span>
          </div>
        </button>

        <div className="relative flex items-center gap-1.5 shrink-0">
          {p.is_pinned && <Pin className="w-4 h-4 text-[#FF6B35] fill-current" aria-label="Pinned" />}
          {p.status === "archived" && (
            <span className="bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5 text-[0.5625rem] font-bold tracking-wider uppercase">
              Archived
            </span>
          )}
          {(p.post_type === "poll" || p.post_type === "gif") && (
            <span className="bg-[#FFF6ED] text-[#E05D24] border border-[#FFEFE0] rounded-full px-2.5 py-0.5 text-[0.5625rem] font-bold tracking-wider uppercase">
              {p.post_type === "poll" ? "Poll" : "GIF"}
            </span>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="More options"
            aria-expanded={menuOpen}
            disabled={deleting}
            className="p-2 rounded-full text-gray-500 hover:text-[#FF6B35] hover:bg-orange-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            {deleting || busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <MoreHorizontal className="w-5 h-5" />}
          </button>
          {menuOpen && (
            <PostMoreMenu
              post={p}
              authorUsername={username}
              onClose={() => setMenuOpen(false)}
              actions={{
                save: toggleSave,
                share: () => setModal("share"),
                copyLink,
                goToProfile: () => username && openProfile(username),
                toggleFollow,
                report: () => setModal("report"),
                edit: () => setModal("edit"),
                analytics: openAnalytics,
                toggleArchive,
                togglePin,
                toggleHideLikes,
                toggleComments,
                remove: handleDelete,
              }}
            />
          )}
        </div>
      </div>

      {/* song */}
      {p.music && (
        <div className="-mt-1">
          <PostMusicPlayer music={p.music} compact />
        </div>
      )}

      {/* caption above the media is only for text posts; other captions go under the buttons */}
      <div className="relative select-none" onDoubleClick={onDoubleTap} style={{ touchAction: "manipulation" }}>
        <div className="flex flex-col gap-3">{body}</div>
        {burst > 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Heart
              key={burst}
              className="w-24 h-24 text-white fill-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
              style={{ animation: "ttHeart 0.85s ease-out forwards" }}
            />
          </div>
        )}
      </div>

      {/* poll */}
      {poll && (
        <div className="flex flex-col gap-2.5 my-1">
          {poll.options.map((opt) => {
            const pct = poll.total_votes > 0 ? Math.round((opt.votes / poll.total_votes) * 100) : 0;
            const selected = poll.my_vote_option_id === opt.option_id;
            const style = !hasVoted
              ? "border-[#FFEFE0] bg-white hover:border-[#FF6B35] hover:shadow-sm"
              : selected
                ? "border-[#FF6B35] bg-orange-50/10"
                : "border-[#FFEFE0] bg-gray-50/30";
            return (
              <button
                key={opt.option_id}
                type="button"
                onClick={() => handleVote(opt.option_id)}
                disabled={hasVoted || voting || !interactive}
                className={`w-full relative min-h-12 rounded-full overflow-hidden text-left border transition-all duration-300 flex items-center justify-between gap-3 px-5 py-2 select-none group ${
                  hasVoted || !interactive ? "cursor-default" : "cursor-pointer active:scale-[0.98]"
                } ${style}`}
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ease-out ${
                    selected ? "bg-gradient-to-r from-[#FCE6D4] to-[#FCE3CC]" : "bg-[#FFF6ED]"
                  }`}
                  style={{ width: `${pct}%` }}
                />
                <span
                  className={`relative z-10 text-[0.78125rem] break-words min-w-0 ${
                    selected ? "text-[#E05D24] font-bold" : "text-gray-800 font-medium group-hover:text-[#E05D24]"
                  }`}
                >
                  {opt.text}
                </span>
                <span className="relative z-10 text-[0.78125rem] font-bold text-gray-900 shrink-0">{pct}%</span>
              </button>
            );
          })}
          <span className="text-[0.625rem] text-[#8E8E93] text-right px-1 mt-0.5 font-medium">
            {poll.total_votes.toLocaleString()} {poll.total_votes === 1 ? "vote" : "votes"}
            {hasVoted ? " • You voted" : interactive ? " • Tap an option to vote" : ""}
          </span>
        </div>
      )}

      {/* action row: each icon has its number beside it, like Instagram */}
      {interactive ? (
        <div className="flex items-center gap-3 -mx-1">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => toggleLike()}
              aria-label={p.liked_by_me ? "Unlike" : "Like"}
              aria-pressed={Boolean(p.liked_by_me)}
              className="p-1.5 rounded-full hover:bg-orange-50 transition-transform active:scale-90 cursor-pointer"
            >
              <Heart className={`w-6 h-6 ${p.liked_by_me ? "fill-red-500 text-red-500" : "text-gray-800"}`} />
            </button>
            {likeCount != null && likeCount > 0 && (
              <button
                type="button"
                onClick={() => canSeeLikers && setModal("likers")}
                aria-label={`${likeCount} ${likeCount === 1 ? "like" : "likes"}`}
                className={`-ml-0.5 text-[13px] font-semibold text-gray-900 ${canSeeLikers ? "cursor-pointer" : "cursor-default"}`}
              >
                {fmtCount(likeCount)}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            aria-label="Comments"
            aria-expanded={showComments}
            className="flex items-center rounded-full cursor-pointer"
          >
            <span className="p-1.5 rounded-full hover:bg-orange-50">
              <MessageCircle className={`w-6 h-6 ${showComments ? "text-[#FF6B35]" : "text-gray-800"}`} />
            </span>
            {!p.comments_disabled && commentCount > 0 && (
              <span className="-ml-0.5 text-[13px] font-semibold text-gray-900">{fmtCount(commentCount)}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setModal("share")}
            aria-label="Share"
            className="flex items-center rounded-full cursor-pointer"
          >
            <span className="p-1.5 rounded-full hover:bg-orange-50">
              <Send className="w-6 h-6 text-gray-800" />
            </span>
            {(p.share_count ?? 0) > 0 && (
              <span className="-ml-0.5 text-[13px] font-semibold text-gray-900">{fmtCount(p.share_count ?? 0)}</span>
            )}
          </button>
          {!isOwner && (
            <button
              type="button"
              onClick={toggleSave}
              aria-label={p.saved_by_me ? "Remove from saved" : "Save"}
              aria-pressed={Boolean(p.saved_by_me)}
              className="ml-auto p-1.5 rounded-full hover:bg-orange-50 cursor-pointer"
            >
              <Bookmark className={`w-6 h-6 ${p.saved_by_me ? "fill-gray-900 text-gray-900" : "text-gray-800"}`} />
            </button>
          )}
          {isOwner && (
            <button
              type="button"
              onClick={openAnalytics}
              className="ml-auto px-3 py-1 rounded-full border border-[#FFEFE0] text-[11px] font-bold text-[#9b4811] hover:bg-[#FFF6ED] cursor-pointer"
            >
              Analytics
            </button>
          )}
        </div>
      ) : (
        <p className="text-[12px] text-[#8E8E93] bg-[#FFFDFB] border border-[#FFEFE0] rounded-xl px-3 py-2">
          {p.status === "archived"
            ? "Archived. Only you can see this post. Likes and comments are paused until you show it on your profile."
            : "Scheduled. It goes live at its scheduled time."}
        </p>
      )}

      {/* likes + caption */}
      <div className="flex flex-col gap-1 text-[13px] text-gray-700 leading-snug">
        {interactive && likesNode && <div>{likesNode}</div>}
        {isOwner && p.hide_like_count && likeCount != null && (
          <span className="text-[11px] text-[#8E8E93]">Like count is hidden from other people.</span>
        )}
        {caption && p.post_type !== "text" && p.post_type !== "poll" && (
          <p className="break-words whitespace-pre-wrap">
            {username && <b className="font-bold text-gray-900 mr-1.5">{username}</b>}
            <RichText text={shownCaption} />
            {isLongCaption && (
              <button
                type="button"
                onClick={() => setCaptionOpen((v) => !v)}
                className="ml-1 text-[#8E8E93] font-semibold cursor-pointer"
              >
                {captionOpen ? "less" : "more"}
              </button>
            )}
          </p>
        )}
        {caption && p.post_type === "poll" && (
          <p className="break-words whitespace-pre-wrap">
            <RichText text={caption} />
          </p>
        )}
        {interactive &&
          (p.comments_disabled ? (
            <span className="text-[12px] text-[#8E8E93]">Comments are turned off.</span>
          ) : (
            !showComments &&
            commentCount > 0 && (
              <button
                type="button"
                onClick={() => setShowComments(true)}
                className="self-start text-[12px] text-[#8E8E93] hover:text-gray-700 cursor-pointer"
              >
                View all {commentCount.toLocaleString()} {commentCount === 1 ? "comment" : "comments"}
              </button>
            )
          ))}
      </div>

      {interactive && showComments && !p.comments_disabled && (
        <PostComments post={p} autoFocus onCountChange={(n) => patch({ comment_count: n })} />
      )}

      {notice && (
        <p role="status" className="text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
          {notice}
        </p>
      )}
      {message && (
        <p role="alert" className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          {message}
        </p>
      )}

      {/* pop-ups */}
      {modal === "edit" && (
        <PostEditModal
          post={p}
          onClose={() => setModal(null)}
          onSaved={(next) => {
            pRef.current = next;
            setP(next);
            onUpdatedRef.current?.(next);
            flash("Post updated");
          }}
        />
      )}
      {modal === "share" && (
        <PostShareSheet
          post={p}
          onClose={() => setModal(null)}
          onShared={(count) => patch({ share_count: count })}
        />
      )}
      {modal === "insights" && <PostInsightsModal postId={p.post_id} onClose={() => setModal(null)} />}
      {modal === "likers" && <PostLikersModal postId={p.post_id} onClose={() => setModal(null)} />}
      {modal === "report" && (
        <PostModal
          title="Report post"
          onClose={() => setModal(null)}
          dismissible={!reporting}
          footer={
            <button
              type="button"
              onClick={submitReport}
              disabled={!reportReason || reporting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-bold text-white bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {reporting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit report
            </button>
          }
        >
          <p className="px-5 pt-3 text-[12px] text-[#8E8E93]">Why are you reporting this post? Your report is private.</p>
          <ul className="py-1">
            {REPORT_REASONS.map((r) => (
              <li key={r.id}>
                <label className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#FFF6ED] cursor-pointer text-[13px] text-gray-800">
                  <input
                    type="radio"
                    name={`report-${p.post_id}`}
                    checked={reportReason === r.id}
                    onChange={() => setReportReason(r.id)}
                    className="accent-[#FF6B35]"
                  />
                  {r.label}
                </label>
              </li>
            ))}
          </ul>
        </PostModal>
      )}
    </article>
  );
}