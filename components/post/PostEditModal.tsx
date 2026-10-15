"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { POST_LIMITS, type EditPostInput, type Post } from "@/types/Posts";
import { postService } from "@/services/post.service";

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
  currentContent: string;
  currentHideLikeCount: boolean;
  currentCommentsDisabled: boolean;
  onClose: () => void;
  onSaved: (content: string, hideLikeCount: boolean, commentsDisabled: boolean) => void;
}

export default function PostEditModal({
  post,
  currentContent,
  currentHideLikeCount,
  currentCommentsDisabled,
  onClose,
  onSaved,
}: PostEditModalProps) {
  const [caption, setCaption] = useState(currentContent);
  const [hideLikes, setHideLikes] = useState(currentHideLikeCount);
  const [commentsOff, setCommentsOff] = useState(currentCommentsDisabled);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsText = post.post_type === "text";
  const trimmed = caption.trim();
  const canSave = !saving && (!needsText || trimmed.length > 0);

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    setError(null);

    const input: EditPostInput = {
      content: trimmed,
      hideLikeCount: hideLikes,
      commentsDisabled: commentsOff,
    };

    try {
      await postService.edit(post.post_id, input);
      onSaved(trimmed, hideLikes, commentsOff);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save changes.");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (!saving && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Edit post"
        className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#FFEFE0] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#FFEFE0]">
          <h3 className="text-base font-bold text-gray-900">Edit post</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="w-8 h-8 rounded-full bg-[#FFF6ED] text-[#E05D24] flex items-center justify-center hover:bg-[#FFEFE0] transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="editCaption" className="text-xs font-bold text-gray-700">
              {post.post_type === "poll" ? "Poll Question" : post.post_type === "text" ? "Post Text" : "Caption"}
            </label>
            <textarea
              id="editCaption"
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={POST_LIMITS.contentLength}
              placeholder="Write a caption..."
              className="w-full p-3 rounded-2xl border border-[#FFEFE0] bg-[#FFFDFB] text-sm text-gray-800 outline-none focus:border-[#FF6B35] resize-none"
            />
            <div className="flex justify-between items-center text-[11px] text-[#8E8E93]">
              <span>Media cannot be replaced after posting.</span>
              <span>{caption.length}/{POST_LIMITS.contentLength}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-[#FFEFE0] p-4 bg-[#FFFDFB]">
            <Switch
              checked={hideLikes}
              onChange={setHideLikes}
              title="Hide like count"
              hint="Only you will see the total number of likes on this post."
            />
            <div className="h-px bg-[#FFEFE0]" />
            <Switch
              checked={commentsOff}
              onChange={setCommentsOff}
              title="Turn off commenting"
              hint="People can't add comments and existing comments are hidden."
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 border-t border-[#FFEFE0] bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[linear-gradient(135deg,#E6703A,#FFA663)] hover:brightness-105 active:scale-95 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
