import { StoryActivityData } from "@/types/Stories";
import { Heart, X } from "lucide-react";
import { useMemo } from "react";
import { formatTimeAgo } from "./Previewstories";

const formatSeenTime = (dateStr?: string | null): string => {
  return formatTimeAgo(dateStr, "Seen");
};

export function ActivitySheet({
  activityData,
  loading,
  fallbackViews,
  fallbackLikes,
  onClose,
}: {
  activityData: StoryActivityData | null;
  loading: boolean;
  fallbackViews: number;
  fallbackLikes: number;
  onClose: () => void;
}) {
  const combinedList = useMemo(() => {
    const likerIds = new Set((activityData?.likers || []).map((l) => l.user_id));
    const viewers = (activityData?.viewers || []).map((v) => ({
      ...v,
      liked: likerIds.has(v.user_id),
    }));
    const likersOnly = (activityData?.likers || [])
      .filter((l) => !viewers.some((v) => v.user_id === l.user_id))
      .map((l) => ({ ...l, liked: true, viewed_at: undefined }));

    return [...viewers, ...likersOnly].sort((a, b) => (b.liked ? 1 : 0) - (a.liked ? 1 : 0));
  }, [activityData]);

  const totalViews = activityData?.total_views ?? fallbackViews;
  const totalLikes = activityData?.total_likes ?? fallbackLikes;

  return (
    <div className="absolute inset-x-0 bottom-0 top-16 bg-[#18181b]/95 backdrop-blur-md z-30 rounded-t-[24px] p-4 flex flex-col border-t border-white/20 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-wide">Seen by</span>
          <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
            {totalViews}
          </span>
          {totalLikes > 0 && (
            <span className="text-[10px] bg-rose-500/20 text-rose-400 font-bold px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
              <Heart size={10} className="fill-rose-500 text-rose-500" />
              {totalLikes}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors"
          aria-label="Close activity"
        >
          <X size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-3 flex flex-col gap-2.5">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-xs text-gray-400">
            Loading activity...
          </div>
        ) : combinedList.length > 0 ? (
          combinedList.map((viewer, idx) => (
            <div
              key={`viewer-${viewer.user_id}-${idx}`}
              className="flex items-center justify-between py-1 px-1 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-full ${
                    viewer.liked
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-orange-500/20 text-orange-400"
                  } font-bold flex items-center justify-center text-[10px] overflow-hidden shrink-0`}
                >
                  {viewer.avatar_url ? (
                    <img src={viewer.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    viewer.username.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">{viewer.username}</span>
                  {viewer.full_name && (
                    <span className="text-[9px] text-gray-400 leading-tight mt-0.5">{viewer.full_name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {viewer.liked && <Heart size={14} className="fill-rose-500 text-rose-500 shrink-0" />}
                {viewer.viewed_at && (
                  <span className="text-[10px] text-gray-400 font-medium">
                    {formatSeenTime(viewer.viewed_at)}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-xs text-gray-400">No viewers yet for this slide.</div>
        )}
      </div>
    </div>
  );
}