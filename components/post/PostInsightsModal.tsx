"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PostModal from "@/components/post/PostModal";
import { postService } from "@/services/post.service";
import type { PostInsights } from "@/types/Posts";

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#FFEFE0] bg-[#FFFDFB] px-3 py-3 text-center">
      <p className="text-lg font-extrabold text-gray-900">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#8E8E93] mt-0.5">{label}</p>
    </div>
  );
}

export default function PostInsightsModal({ postId, onClose }: { postId: number; onClose: () => void }) {
  const [data, setData] = useState<PostInsights | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    postService
      .getInsights(postId)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load the insights.");
      });
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const n = (v: number) => v.toLocaleString();
  const maxDay = data ? Math.max(1, ...data.daily.map((d) => d.likes + d.comments)) : 1;
  const followersPct =
    data && data.reach > 0 ? Math.round((data.followers_reach / data.reach) * 100) : 0;

  return (
    <PostModal title="Post insights" onClose={onClose} maxWidth="max-w-lg">
      {error ? (
        <p className="px-5 py-10 text-center text-sm text-red-600">{error}</p>
      ) : !data ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF6B35]" />
        </div>
      ) : (
        <div className="px-5 py-4 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-2.5">
            <Tile label="Reach" value={n(data.reach)} />
            <Tile label="Likes" value={n(data.likes)} />
            <Tile label="Comments" value={n(data.comments)} />
            <Tile label="Shares" value={n(data.shares)} />
            <Tile label="Saves" value={n(data.saves)} />
            <Tile
              label="Engagement"
              value={data.engagement_rate === null ? "—" : `${data.engagement_rate}%`}
            />
          </div>

          {data.poll_votes !== null && (
            <p className="text-[13px] text-gray-700">
              <span className="font-bold">{n(data.poll_votes)}</span> {data.poll_votes === 1 ? "vote" : "votes"} on this poll
            </p>
          )}

          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-2">Who saw it</p>
            {data.reach === 0 ? (
              <p className="text-[12px] text-[#8E8E93]">Nobody has seen this post yet. You are not counted.</p>
            ) : (
              <>
                <div className="h-2.5 rounded-full bg-[#FCE3CC] overflow-hidden">
                  <div className="h-full bg-[#FF6B35]" style={{ width: `${followersPct}%` }} />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-[#8E8E93]">
                  <span>Followers · {n(data.followers_reach)}</span>
                  <span>Non-followers · {n(data.non_followers_reach)}</span>
                </div>
              </>
            )}
          </div>

          <div>
            <p className="text-[12px] font-bold text-gray-700 mb-2">Last 7 days</p>
            <div className="flex items-end gap-2 h-28">
              {data.daily.map((d) => {
                const total = d.likes + d.comments;
                const h = Math.round((total / maxDay) * 100);
                const label = new Date(`${d.date}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" });
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] text-[#8E8E93]">{total || ""}</span>
                    <div
                      title={`${d.likes} likes, ${d.comments} comments`}
                      className="w-full rounded-t-md bg-[linear-gradient(180deg,#FFA663,#E6703A)]"
                      style={{ height: `${Math.max(total ? h : 3, 3)}%`, opacity: total ? 1 : 0.25 }}
                    />
                    <span className="text-[10px] text-[#8E8E93]">{label}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-1.5 text-[10px] text-[#8E8E93]">Likes and comments per day.</p>
          </div>

          <p className="text-[11px] text-[#8E8E93]">
            Reach counts each person who saw the post once. Engagement is likes, comments, shares and saves divided by reach.
          </p>
        </div>
      )}
    </PostModal>
  );
}