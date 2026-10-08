"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { ContentSkeleton } from "@/components/ui/Skeletonloading";
import { onPostsChanged, postService } from "@/services/post.service";
import { endOfDay, errorMessage, formatWhen } from "@/lib/schedule";

interface Stats {
  total: number;
  dueToday: number;
  nextAt: string | null;
}

/** Replaces the old hard-coded "Active Campaigns" card with real numbers from the server. */
export default function ScheduleStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const now = new Date();
      const [all, today] = await Promise.all([
        postService.getScheduled({ limit: 1 }),
        postService.getScheduled({ limit: 1, fromAt: now.toISOString(), toAt: endOfDay(now).toISOString() }),
      ]);
      setStats({ total: all.total, dueToday: today.total, nextAt: all.items[0]?.scheduled_at ?? null });
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, []);

  useEffect(() => {
    load();
    return onPostsChanged(() => {
      load();
    });
  }, [load]);

  return (
    <div className="w-full bg-[#E5632A] rounded-[20px] sm:rounded-[32px] p-3 sm:p-5 text-white shadow-[0_8px_30px_rgba(229,99,42,0.18)] flex flex-col justify-between select-none min-w-0 gap-3">
      <div className="flex justify-between items-start gap-1">
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.12em] text-white/70 uppercase truncate">
            Waiting to go live
          </span>
          <h2 className="text-sm sm:text-lg md:text-xl font-extrabold text-white leading-tight mt-0.5 sm:mt-1">
            Scheduled Posts
          </h2>
        </div>
        <div className="bg-white/20 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shrink-0">
          <CalendarClock className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-white/90">{error}</p>
      ) : !stats ? (
        <ContentSkeleton count={1} />
      ) : (
        <>
          <div className="flex items-baseline">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black leading-none">{stats.total}</span>
            <span className="text-[10px] sm:text-xs text-white/90 uppercase tracking-widest ml-1.5 font-bold">
              {stats.total === 1 ? "post" : "posts"}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-[10px] sm:text-xs font-bold text-white/90 tracking-wide">
            <span>Due today: {stats.dueToday}</span>
            <span>{stats.nextAt ? `Next: ${formatWhen(stats.nextAt)}` : "Nothing scheduled yet"}</span>
          </div>
        </>
      )}
    </div>
  );
}