"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { goBack as historyBack } from "@/lib/navigation";
import { Mail, MailOpen, MessageCircle, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react";
import { messageService } from "@/services/message.service";
import { useMessagesBase } from "@/hooks/useMessagesBase";
import { buttonVariants } from "@/components/ui/Button";
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
  // 3-dot menu on an inbox row (fixed position so the scrolling list can't clip it).
  const [menu, setMenu] = useState<{ id: number; top: number; right: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Conversation["partner"] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    e.stopPropagation();
    if (menu?.id === id) {
      setMenu(null);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    const MENU_H = 104;
    const top = r.bottom + 4 + MENU_H > window.innerHeight ? Math.max(8, r.top - MENU_H - 4) : r.bottom + 4;
    setMenu({ id, top, right: Math.max(8, window.innerWidth - r.right) });
  };

  const menuConversation = menu ? conversations.find((c) => c.partner.user_id === menu.id) ?? null : null;

  async function toggleRead(c: Conversation) {
    const id = c.partner.user_id;
    const makeUnread = !(c.is_unread ?? c.unread_count > 0);
    setMenu(null);
    setActionError(null);
    // Update the row right away; put it back if the server says no.
    setConversations((prev) =>
      prev.map((x) =>
        x.partner.user_id === id
          ? { ...x, is_unread: makeUnread, unread_count: makeUnread ? x.unread_count : 0 }
          : x
      )
    );
    try {
      if (makeUnread) await messageService.markUnread(id);
      else await messageService.markRead(id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Couldn't update the chat.");
      loadConversations();
    }
  }

  async function confirmDeleteChat() {
    const target = confirmDelete;
    if (!target || deleting) return;
    setDeleting(true);
    setActionError(null);
    try {
      await messageService.deleteChat(target.user_id);
      setConversations((prev) => prev.filter((x) => x.partner.user_id !== target.user_id));
      if (activeId === target.user_id) router.replace(base);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Couldn't delete the chat.");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  }

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

        {actionError && <p className="px-5 pb-2 text-xs text-red-600">{actionError}</p>}

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
            const unread = c.is_unread ?? c.unread_count > 0;
            const active = activeId === c.partner.user_id;
            const menuOpen = menu?.id === c.partner.user_id;
            return (
              <div key={c.partner.user_id} className="group relative">
                <button
                  type="button"
                  onClick={() => openChat(c.partner.user_id)}
                  className={`w-full flex items-center gap-3 pl-3 pr-11 py-2.5 rounded-2xl text-left transition-colors cursor-pointer ${
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
                      {unread &&
                        (c.unread_count > 0 ? (
                          <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF6B35] text-white text-[10px] font-bold leading-[18px] text-center">
                            {c.unread_count > 9 ? "9+" : c.unread_count}
                          </span>
                        ) : (
                          <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-[#FF6B35]" aria-label="Marked as unread" />
                        ))}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => openMenu(e, c.partner.user_id)}
                  aria-label={`Options for ${c.partner.full_name || c.partner.username}`}
                  aria-expanded={menuOpen}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF6B35] hover:bg-orange-100/70 transition-opacity cursor-pointer focus:opacity-100 [@media(hover:none)]:opacity-70 ${
                    menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
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

      {/* 3-dot menu for an inbox row */}
      {menu && menuConversation && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenu(null)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            style={{ top: menu.top, right: menu.right }}
            className="fixed z-50 min-w-[180px] rounded-2xl border border-[#FFEFE0] bg-white py-1 shadow-lg"
          >
            <button
              type="button"
              onClick={() => toggleRead(menuConversation)}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#FF6B35] cursor-pointer"
            >
              {(menuConversation.is_unread ?? menuConversation.unread_count > 0) ? (
                <>
                  <MailOpen className="w-4 h-4 text-[#FF6B35]" />
                  Mark as read
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 text-[#FF6B35]" />
                  Mark as unread
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(menuConversation.partner);
                setMenu(null);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete chat
            </button>
          </div>
        </>
      )}

      {/* Delete chat: confirmed once, deletes for me only (the other person keeps their copy) */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => !deleting && setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-bold text-gray-900">Delete chat?</p>
            <p className="text-xs text-gray-500 mt-1">
              This removes the chat from your inbox only. {confirmDelete.full_name || `@${confirmDelete.username}`} will
              still have their copy.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting}
                className={`${buttonVariants({ variant: "outline" })} flex-1 px-4 py-2 text-sm font-bold disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteChat}
                disabled={deleting}
                className={`${buttonVariants({ variant: "destructive" })} flex-1 px-4 py-2 text-sm font-bold disabled:opacity-50`}
              >
                {deleting ? "…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <PeopleModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        mode="pick"
        onPick={(u) => openChat(u.user_id)}
      />
    </div>
  );
}