"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { postService } from "@/services/post.service";
import { userService } from "@/services/user.service";

/**
 * The link people share: /post/<id>.
 * It sends each person to the author's profile in their own area (admin, influencer or
 * freelancer) with the post opened. Not logged in? The API client sends them to /login.
 */
export default function SharedPostPage() {
  const params = useParams<{ postId: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const raw = Array.isArray(params.postId) ? params.postId[0] : params.postId;
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) {
      setError("This link isn't valid.");
      return;
    }
    (async () => {
      try {
        const [me, res] = await Promise.all([userService.getProfile(), postService.getOne(id)]);
        const item = res.items[0];
        const author = item ? res.authors[String(item.author_id)] : undefined;
        if (!item || !author) throw new Error("This post isn't available.");
        const base = `/${me.role}`;
        const target = item.is_owner
          ? `${base}/profile?post=${id}`
          : `${base}/u/${encodeURIComponent(author.username)}?post=${id}`;
        if (!cancelled) router.replace(target);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "This post isn't available.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.postId, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-sm text-center bg-white rounded-3xl border border-orange-100 shadow-sm p-8">
          <p className="text-base font-bold text-gray-900">This post isn&apos;t available</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-[#FF6B35] animate-spin" />
    </div>
  );
}