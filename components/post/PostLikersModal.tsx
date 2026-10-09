"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PostModal from "@/components/post/PostModal";
import { postService } from "@/services/post.service";
import { getInitials, initialsAvatar } from "@/lib/avatar";
import { useProfileLink } from "@/hooks/useProfileLink";
import type { PostUser } from "@/types/Posts";

export default function PostLikersModal({ postId, onClose }: { postId: number; onClose: () => void }) {
  const { openProfile } = useProfileLink();
  const [people, setPeople] = useState<PostUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    postService
      .getLikers(postId, 100, 0)
      .then((res) => {
        if (cancelled) return;
        setPeople(res.items);
        setTotal(res.total);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load the likes.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  return (
    <PostModal title={total ? `Likes · ${total.toLocaleString()}` : "Likes"} onClose={onClose}>
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF6B35]" />
        </div>
      ) : error ? (
        <p className="px-5 py-8 text-center text-sm text-red-600">{error}</p>
      ) : people.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-gray-500">No likes yet.</p>
      ) : (
        <ul className="py-1">
          {people.map((p) => (
            <li key={p.user_id}>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openProfile(p.username);
                }}
                className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-[#FFF6ED] text-left cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.avatar_url || initialsAvatar(getInitials({ name: p.name, username: p.username }))}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-[#FFEFE0] bg-gray-50"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-gray-900 truncate">{p.username}</span>
                  <span className="block text-xs text-gray-500 truncate">{p.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </PostModal>
  );
}