"use client";

import React from "react";
import {
  Archive,
  BarChart3,
  Bookmark,
  EyeOff,
  Flag,
  Link2,
  MessageCircle,
  Pencil,
  Pin,
  Send,
  Trash2,
  UserMinus,
  UserPlus,
} from "lucide-react";
import type { Post } from "@/types/Posts";

export interface PostMenuActions {
  save: () => void;
  share: () => void;
  copyLink: () => void;
  goToProfile: () => void;
  toggleFollow: () => void;
  report: () => void;
  edit: () => void;
  analytics: () => void;
  toggleArchive: () => void;
  togglePin: () => void;
  toggleHideLikes: () => void;
  toggleComments: () => void;
  remove: () => void;
}

interface Item {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface PostMoreMenuProps {
  post: Post;
  authorUsername?: string;
  actions: PostMenuActions;
  onClose: () => void;
}

/** The "..." menu. Owners and viewers see different things, like on Instagram. */
export default function PostMoreMenu({ post, authorUsername, actions, onClose }: PostMoreMenuProps) {
  const isOwner = Boolean(post.is_owner);
  const published = post.status === "published";
  const archived = post.status === "archived";
  const scheduled = post.status === "scheduled";
  const icon = "w-4 h-4";
  const items: Item[] = [];

  if (isOwner) {
    if (published) {
      items.push({
        key: "pin",
        label: post.is_pinned ? "Unpin from profile" : "Pin to your profile",
        icon: <Pin className={icon} />,
        onClick: actions.togglePin,
      });
    }
    if (published || archived) {
      items.push({
        key: "archive",
        label: archived ? "Show on profile" : "Archive",
        icon: <Archive className={icon} />,
        onClick: actions.toggleArchive,
      });
    }
    items.push({ key: "edit", label: "Edit", icon: <Pencil className={icon} />, onClick: actions.edit });
    if (!scheduled) {
      items.push({
        key: "hide",
        label: post.hide_like_count ? "Show like count" : "Hide like count",
        icon: <EyeOff className={icon} />,
        onClick: actions.toggleHideLikes,
      });
      items.push({
        key: "comments",
        label: post.comments_disabled ? "Turn on commenting" : "Turn off commenting",
        icon: <MessageCircle className={icon} />,
        onClick: actions.toggleComments,
      });
      items.push({ key: "analytics", label: "Analytics", icon: <BarChart3 className={icon} />, onClick: actions.analytics });
    }
    if (published) {
      items.push({ key: "share", label: "Share to…", icon: <Send className={icon} />, onClick: actions.share });
      items.push({ key: "copy", label: "Copy link", icon: <Link2 className={icon} />, onClick: actions.copyLink });
    }
  } else if (published) {
    items.push({
      key: "save",
      label: post.saved_by_me ? "Remove from saved" : "Save",
      icon: <Bookmark className={`${icon} ${post.saved_by_me ? "fill-current" : ""}`} />,
      onClick: actions.save,
    });
    items.push({ key: "share", label: "Share to…", icon: <Send className={icon} />, onClick: actions.share });
    items.push({ key: "copy", label: "Copy link", icon: <Link2 className={icon} />, onClick: actions.copyLink });
    if (authorUsername) {
      items.push({
        key: "follow",
        label: post.following_author ? `Unfollow @${authorUsername}` : `Follow @${authorUsername}`,
        icon: post.following_author ? <UserMinus className={icon} /> : <UserPlus className={icon} />,
        onClick: actions.toggleFollow,
        danger: Boolean(post.following_author),
      });
      items.push({ key: "profile", label: "Go to profile", icon: <UserPlus className={icon} />, onClick: actions.goToProfile });
    }
    items.push({ key: "report", label: "Report…", icon: <Flag className={icon} />, onClick: actions.report, danger: true });
  }

  // Owners already have Delete below. Admins get it for moderation, owners always get it.
  if (post.can_delete) {
    items.push({
      key: "delete",
      label: scheduled ? "Cancel scheduled post" : isOwner ? "Delete" : "Delete (admin)",
      icon: <Trash2 className={icon} />,
      onClick: actions.remove,
      danger: true,
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="fixed inset-0 z-10 cursor-default"
      />
      <div
        role="menu"
        className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-2xl shadow-xl border border-[#FFEFE0] p-1.5 z-20"
      >
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            role="menuitem"
            onClick={() => {
              onClose();
              it.onClick();
            }}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-left text-[13px] font-semibold transition-colors cursor-pointer ${
              it.danger
                ? "text-red-600 hover:bg-red-50"
                : "text-gray-700 hover:text-[#FF6B35] hover:bg-orange-50/80"
            }`}
          >
            <span className={it.danger ? "text-red-500" : "text-[#FF6B35]"}>{it.icon}</span>
            {it.label}
          </button>
        ))}
        {items.length === 0 && <p className="px-3 py-2 text-xs text-gray-500">No actions available.</p>}
      </div>
    </>
  );
}