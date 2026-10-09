"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import PostModal from "@/components/post/PostModal";
import MusicsControl, { type MusicTrack } from "@/components/admin/dashboard/MusicsControl";
import { postService } from "@/services/post.service";
import { postMusicToTrack, trackToPostMusic } from "@/lib/postMusic";
import { POST_LIMITS, type EditPostInput, type Post } from "@/types/Posts";

function Switch({
  checked,
  onChange,
  title,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
    >
      <span>
        <span className="block text-[13px] font-semibold text-gray-900">{title}</span>
        <span className="block text-[11px] text-[#8E8E93]">{hint}</span>
      </span>
      <span
        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${checked ? "bg-[#FF6B35]" : "bg-gray-300"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

interface PostEditModalProps {
  post: Post;
  onClose: () => void;
  onSaved: (post: Post) => void;
}

export default function PostEditModal({ post, onClose, onSaved }: PostEditModalProps) {
  const [caption, setCaption] = useState(post.content || "");
  const [track, setTrack] = useState<MusicTrack | null>(post.music ? postMusicToTrack(post.music) : null);
  const [start, setStart] = useState(post.music?.start_time ?? 0);
  const [commentsOff, setCommentsOff] = useState(Boolean(post.comments_disabled));
  const [hideLikes, setHideLikes] = useState(Boolean(post.hide_like_count));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsText = post.post_type === "text" || post.post_type === "poll";
  const pollLocked = post.post_type === "poll" && (post.poll?.total_votes ?? 0) > 0;
  const canHaveMusic = post.post_type !== "video";
  const trimmed = caption.trim();
  const canSave = !saving && (!needsText || trimmed.length > 0);

  async function save() {
    if (!canSave) return;
    const input: EditPostInput = {};
    if (trimmed !== (post.content || "").trim()) input.content = trimmed;
    if (commentsOff !== Boolean(post.comments_disabled)) input.commentsDisabled = commentsOff;
    if (hideLikes !== Boolean(post.hide_like_count)) input.hideLikeCount = hideLikes;

    if (canHaveMusic) {
      if (!track && post.music) {
        input.removeMusic = true;
      } else if (track) {
        if (!track.previewUrl) {
          setError("That song has no playable preview. Pick another one.");
          return;
        }
        const next = trackToPostMusic(track, start);
        const old = post.music;
        if (!old || next.audio_url !== old.audio_url || Math.abs(next.start_time - old.start_time) > 0.05) {
          input.music = next;
        }
      }
    }

    if (Object.keys(input).length === 0) {
      onClose();
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await postService.edit(post.post_id, input);
      const item = res.items[0];
      if (item) onSaved(item);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your changes.");
      setSaving(false);
    }
  }

  return (
    <PostModal
      title="Edit post"
      onClose={onClose}
      dismissible={!saving}
      maxWidth="max-w-lg"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-full text-[13px] font-bold text-gray-600 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!canSave}
            className="min-w-[84px] flex items-center justify-center gap-2 px-5 py-2 rounded-full text-[13px] font-bold text-white bg-[linear-gradient(135deg,#E6703A,#FFA663)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save
          </button>
        </div>
      }
    >
      <div className="px-5 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="editCaption" className="text-[12px] font-bold text-gray-600">
            {post.post_type === "poll" ? "Poll question" : post.post_type === "text" ? "Post text" : "Caption"}
          </label>
          <textarea
            id="editCaption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={POST_LIMITS.contentLength}
            rows={4}
            disabled={pollLocked}
            className="w-full resize-none rounded-2xl border border-[#FFEFE0] bg-[#FFFDFB] p-3 text-[14px] text-gray-800 outline-none focus:border-[#FF6B35] disabled:opacity-60"
          />
          {pollLocked && (
            <p className="text-[11px] text-[#8E8E93]">The question can&apos;t be changed after people have voted.</p>
          )}
          <p className="text-[11px] text-[#8E8E93]">The photo, video, GIF and poll options can&apos;t be changed after posting.</p>
        </div>

        {canHaveMusic ? (
          <MusicsControl
            selectedTrack={track}
            musicStartTime={start}
            onTrackChange={setTrack}
            onStartTimeChange={setStart}
          />
        ) : (
          <p className="text-[11px] text-[#8E8E93]">Videos keep their own sound, so a song can&apos;t be added.</p>
        )}

        <div className="flex flex-col gap-3 rounded-2xl border border-[#FFEFE0] p-4">
          <Switch
            checked={hideLikes}
            onChange={setHideLikes}
            title="Hide like count"
            hint="Only you will see how many likes this post has."
          />
          <Switch
            checked={commentsOff}
            onChange={setCommentsOff}
            title="Turn off commenting"
            hint="People can't add comments and existing comments are hidden."
          />
        </div>

        {error && (
          <p role="alert" className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
      </div>
    </PostModal>
  );
}