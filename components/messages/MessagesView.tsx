"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { goBack as historyBack } from "@/lib/navigation";
import { MessageCircle, Plus, Search } from "lucide-react";
import { messageService } from "@/services/message.service";
import { useMessagesBase } from "@/hooks/useMessagesBase";
import ChatThread from "./ChatThread";
import PeopleModal from "./PeopleModal";
import UserAvatar from "./UserAvatar";
import { listTime, previewText } from "./chatUtils";
import type { Conversation, MessageSummary } from "@/types/Messages";

export default function MessagesView() {
  const router = useRouter();
  const params = useSearchParams();
  const base = useMessagesBase();

  const activeId = useMemo(() => {
    const v = Number(params.get("user"));
    return Number.isInteger(v) && v > 0 ? v : null;
  }, [params]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const summaryRef = useRef<MessageSummary | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setConversations(await messageService.conversations());
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Inbox: load once, then poll the tiny summary and only refetch when something changed.
  useEffect(() => {
    loadConversations();
    const tick = async () => {
      if (document.hidden) return;
      try {
        const s = await messageService.summary();
        const prev = summaryRef.current;
        summaryRef.current = s;
        if (
          prev &&
          (prev.latest_message_id !== s.latest_message_id ||
            prev.unread_conversations !== s.unread_conversations)
        ) {
          loadConversations();
        }
      } catch {
        /* try again next tick */
      }
    };
    tick();
    const id = setInterval(tick, 6000);
    return () => clearInterval(id);
  }, [loadConversations]);

  const openChat = (id: number) => router.push(`${base}?user=${id}`);

  const visible = conversations.filter((c) => {
    const q = filter.trim().toLowerCase().replace(/^@/, "");
    if (!q) return true;
    return (
      c.partner.username.toLowerCase().includes(q) ||
      (c.partner.full_name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex w-full max-w-5xl mx-auto h-[calc(100dvh-11rem)] min-h-[440px] bg-white rounded-[32px] border border-[#FFEFE0] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
      {/* Inbox */}
      <aside
        className={`${activeId ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 shrink-0 flex-col border-r border-[#FFEFE0]`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Messages</h1>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            aria-label="New message"
            title="New message"
            className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#E6703A,#FFA663)] text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search chats"
              className="w-full bg-[#FDEEE2] rounded-full pl-10 pr-4 py-2 text-sm outline-none border border-transparent focus:border-brand/35"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {loading && (
            <div className="space-y-2 px-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 rounded-2xl bg-orange-100/50 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && conversations.length === 0 && (
            <div className="text-center px-6 py-14">
              <p className="text-sm font-semibold text-gray-900">No chats yet</p>
              <p className="text-xs text-gray-500 mt-1">Tap + to message someone.</p>
            </div>
          )}

          {!loading && conversations.length > 0 && visible.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-10">No chats match “{filter}”.</p>
          )}

          {visible.map((c) => {
            const unread = c.unread_count > 0;
            const active = activeId === c.partner.user_id;
            return (
              <button
                key={c.partner.user_id}
                type="button"
                onClick={() => openChat(c.partner.user_id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-colors cursor-pointer ${
                  active ? "bg-[#FDEEE2]" : "hover:bg-orange-50/70"
                }`}
              >
                <UserAvatar user={c.partner} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`text-sm truncate ${unread ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                      {c.partner.full_name || `@${c.partner.username}`}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0">{listTime(c.last_message.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${unread ? "font-semibold text-gray-900" : "text-gray-500"}`}>
                      {previewText(c.last_message)}
                    </p>
                    {unread && (
                      <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF6B35] text-white text-[10px] font-bold leading-[18px] text-center">
                        {c.unread_count > 9 ? "9+" : c.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Thread */}
      <section className={`${activeId ? "flex" : "hidden md:flex"} flex-1 min-w-0 flex-col`}>
        {activeId ? (
          <ChatThread
            key={activeId}
            userId={activeId}
            onBack={() => historyBack(router, base)}
            onActivity={loadConversations}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-[#FFF8F2]">
            <div className="w-16 h-16 rounded-full border-2 border-[#FF6B35] text-[#FF6B35] flex items-center justify-center">
              <MessageCircle className="w-8 h-8" />
            </div>
            <p className="mt-4 text-base font-bold text-gray-900">Your messages</p>
            <p className="text-sm text-gray-500 mt-1">Chat privately with creators and freelancers.</p>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="mt-4 px-5 py-2 rounded-full text-sm font-bold text-white bg-[linear-gradient(135deg,#E6703A,#FFA663)] active:scale-95 transition-all cursor-pointer"
            >
              Send message
            </button>
          </div>
        )}
      </section>

      <PeopleModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        mode="pick"
        onPick={(u) => openChat(u.user_id)}
      />
    </div>
  );
}