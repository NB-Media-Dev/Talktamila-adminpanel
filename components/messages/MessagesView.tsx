"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { goBack as historyBack } from "@/lib/navigation";
import {
  Check,
  Mail,
  MailOpen,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Flag,
  AlertTriangle,
  RotateCcw,
  UserX,
  UserCheck,
  Send,
  AlertCircle,
  X,
  Sparkles,
  Eye,
  Shield,
  Loader2,
  CheckCircle,
  Clock,
  User,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { messageService } from "@/services/message.service";
import { storyService } from "@/services/Stories.service";
import { useMessagesBase } from "@/hooks/useMessagesBase";
import { useAuthRole } from "@/hooks/useAuthRole";
import { buttonVariants } from "@/components/ui/Button";
import ChatThread from "./ChatThread";
import PeopleModal from "./PeopleModal";
import UserAvatar from "./UserAvatar";
import { listTime, previewText } from "./chatUtils";
import type { Conversation, MessageSummary } from "@/types/Messages";
import type { AdminReportItem } from "@/types/Stories";

type Tab = "messages" | "requests" | "reports";

const WARNING_PRESETS = [
  {
    title: "Community Guidelines",
    type: "guidelines",
    text: "Your story violates Talk Tamila Community Guidelines. Continued violations may result in suspension.",
  },
  {
    title: "Inappropriate Content",
    type: "nsfw",
    text: "Your story was flagged for inappropriate or explicit media. Please ensure all shared content follows our platform safety rules.",
  },
  {
    title: "Harassment & Bullying",
    type: "harassment",
    text: "Harassment, abusive behavior, and targeted bullying are strictly prohibited. Immediate compliance is required.",
  },
  {
    title: "Hate Speech",
    type: "hate_speech",
    text: "Hate speech, discrimination, and offensive remarks are zero-tolerance violations on Talk Tamila.",
  },
  {
    title: "Copyright Infringement",
    type: "copyright",
    text: "This story contains copyrighted material posted without authorization. Please remove it immediately.",
  },
  {
    title: "Spam & Misleading",
    type: "spam",
    text: "Misleading promotions, deceptive links, or repetitive spam in stories are prohibited.",
  },
];

export default function MessagesView() {
  const router = useRouter();
  const params = useSearchParams();
  const base = useMessagesBase();
  const { isAdmin } = useAuthRole();

  const activeId = useMemo(() => {
    const v = Number(params.get("user"));
    return Number.isInteger(v) && v > 0 ? v : null;
  }, [params]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [tab, setTab] = useState<Tab>("messages");
  const [pickerOpen, setPickerOpen] = useState(false);
  const summaryRef = useRef<MessageSummary | null>(null);
  const tabInitRef = useRef(false);
  const [menu, setMenu] = useState<{ id: number; top: number; right: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Conversation["partner"] | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Reports state
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [reportActionLoading, setReportActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Warning Modal in MessagesView
  const [warningModal, setWarningModal] = useState<{
    isOpen: boolean;
    storyId: number;
    creatorId: number;
    creatorUsername: string;
    reportId: number;
  } | null>(null);
  const [warningText, setWarningText] = useState("");
  const [warningType, setWarningType] = useState("warning");
  const [warningAlsoDelete, setWarningAlsoDelete] = useState(false);
  const [isSendingWarning, setIsSendingWarning] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadConversations = useCallback(async () => {
    try {
      setConversations(await messageService.conversations());
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const data = await storyService.getStoryReports(100, 0);
      const arr = Array.isArray(data) ? data : [];
      setReports(arr);
      if (arr.length > 0 && selectedReportId === null) {
        setSelectedReportId(arr[0].report_id);
      }
    } catch (err: any) {
      console.error("Failed to load reports in messages view:", err);
    } finally {
      setReportsLoading(false);
    }
  }, [selectedReportId]);

  useEffect(() => {
    loadConversations();
    if (isAdmin) {
      loadReports();
    }
    const tick = async () => {
      if (document.hidden) return;
      try {
        const s = await messageService.summary();
        const prev = summaryRef.current;
        summaryRef.current = s;
        if (
          prev &&
          (prev.latest_message_id !== s.latest_message_id ||
            prev.unread_conversations !== s.unread_conversations ||
            (prev.request_unread ?? 0) !== (s.request_unread ?? 0))
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
  }, [loadConversations, loadReports, isAdmin]);

  const primary = useMemo(() => conversations.filter((c) => !c.is_request), [conversations]);
  const requests = useMemo(() => conversations.filter((c) => !!c.is_request), [conversations]);
  const requestsUnread = requests.some((c) => c.is_unread ?? c.unread_count > 0);

  const activeConversation = useMemo(
    () => (activeId ? conversations.find((c) => c.partner.user_id === activeId) ?? null : null),
    [conversations, activeId]
  );

  const selectedReport = useMemo(() => {
    if (!selectedReportId) return reports[0] ?? null;
    return reports.find((r) => r.report_id === selectedReportId) ?? null;
  }, [reports, selectedReportId]);

  useEffect(() => {
    if (loading) return;
    if (!tabInitRef.current) {
      tabInitRef.current = true;
      if (activeConversation?.is_request) setTab("requests");
      return;
    }
    if (tab === "requests" && activeConversation && !activeConversation.is_request) {
      setTab("messages");
    }
  }, [loading, activeConversation, tab]);

  const openChat = (id: number) => {
    if (tab === "reports") setTab("messages");
    router.push(`${base}?user=${id}`);
  };

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

  async function acceptFromMenu(c: Conversation) {
    const id = c.partner.user_id;
    setMenu(null);
    setActionError(null);
    setConversations((prev) =>
      prev.map((x) => (x.partner.user_id === id ? { ...x, is_request: false } : x))
    );
    try {
      await messageService.acceptRequest(id);
      loadConversations();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Couldn't accept the request.");
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

  // Admin Report Moderation Actions
  const handleSuspendUser = async (userId: number, username?: string) => {
    if (!confirm(`Are you sure you want to suspend @${username || userId}? This will disable their account.`)) {
      return;
    }
    setReportActionLoading(true);
    try {
      await storyService.adminBanUser(userId);
      showToast(`User @${username || userId} suspended successfully.`);
      setReports((prev) =>
        prev.map((r) =>
          r.story && (r.story.user_id === userId || r.story.user?.id === userId)
            ? { ...r, story: { ...r.story, user: r.story.user ? { ...r.story.user, is_active: false } : undefined } }
            : r
        )
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to suspend user", "error");
    } finally {
      setReportActionLoading(false);
    }
  };

  const handleUnbanUser = async (userId: number, username?: string) => {
    if (!confirm(`Are you sure you want to unban and reactivate @${username || userId}?`)) {
      return;
    }
    setReportActionLoading(true);
    try {
      await storyService.adminUnbanUser(userId);
      showToast(`User @${username || userId} unbanned and reactivated.`);
      setReports((prev) =>
        prev.map((r) =>
          r.story && (r.story.user_id === userId || r.story.user?.id === userId)
            ? { ...r, story: { ...r.story, user: r.story.user ? { ...r.story.user, is_active: true } : undefined } }
            : r
        )
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to unban user", "error");
    } finally {
      setReportActionLoading(false);
    }
  };

  const handleDeleteReportedStory = async (storyId: number) => {
    if (!confirm("Are you sure you want to delete this reported story? It will be hidden from the feed.")) {
      return;
    }
    setReportActionLoading(true);
    try {
      await storyService.adminDeleteStory(storyId);
      showToast("Story deleted from feed successfully.");
      setReports((prev) =>
        prev.map((r) =>
          r.story_id === storyId && r.story
            ? { ...r, story: { ...r.story, is_deleted: true, is_active: false } }
            : r
        )
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to delete story", "error");
    } finally {
      setReportActionLoading(false);
    }
  };

  const handleRestoreReportedStory = async (storyId: number) => {
    setReportActionLoading(true);
    try {
      await storyService.adminRestoreStory(storyId);
      showToast("Story restored to feed successfully.");
      setReports((prev) =>
        prev.map((r) =>
          r.story_id === storyId && r.story
            ? { ...r, story: { ...r.story, is_deleted: false, is_active: true } }
            : r
        )
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to restore story", "error");
    } finally {
      setReportActionLoading(false);
    }
  };

  const openWarningFromReport = (report: AdminReportItem) => {
    const creatorId = report.story?.user_id || report.story?.author_id || 0;
    const creatorUsername = report.story?.user?.username || "Creator";
    setWarningModal({
      isOpen: true,
      storyId: report.story_id,
      creatorId,
      creatorUsername,
      reportId: report.report_id,
    });
    setWarningText(
      `Your story was reported for "${report.reason}". Please review our platform community guidelines.`
    );
    setWarningType("warning");
    setWarningAlsoDelete(false);
  };


  const handleSendWarning = async () => {
    if (!warningModal) return;
    if (!warningText.trim()) {
      showToast("Please enter a warning message.", "error");
      return;
    }

    setIsSendingWarning(true);
    try {
      await storyService.adminWarnStoryCreator(
        warningModal.storyId,
        warningText.trim(),
        warningModal.creatorId,
        warningType
      );

      if (warningAlsoDelete) {
        await storyService.adminDeleteStory(warningModal.storyId);
        setReports((prev) =>
          prev.map((r) =>
            r.story_id === warningModal.storyId && r.story
              ? { ...r, story: { ...r.story, is_deleted: true, is_active: false } }
              : r
          )
        );
      }

      showToast(
        `Official warning sent to @${warningModal.creatorUsername}${
          warningAlsoDelete ? " and story was deleted." : "."
        }`
      );
      setWarningModal(null);
    } catch (err: any) {
      showToast(err?.message || "Failed to send warning message", "error");
    } finally {
      setIsSendingWarning(false);
    }
  };

  const list = tab === "requests" ? requests : primary;
  const visible = list.filter((c) => {
    const q = filter.trim().toLowerCase().replace(/^@/, "");
    if (!q) return true;
    return (
      c.partner.username.toLowerCase().includes(q) ||
      (c.partner.full_name ?? "").toLowerCase().includes(q)
    );
  });

  const visibleReports = reports.filter((r) => {
    const q = filter.trim().toLowerCase().replace(/^@/, "");
    if (!q) return true;
    return (
      r.reason.toLowerCase().includes(q) ||
      (r.details ?? "").toLowerCase().includes(q) ||
      (r.reporter_username ?? "").toLowerCase().includes(q) ||
      (r.story?.user?.username ?? "").toLowerCase().includes(q) ||
      String(r.story_id).includes(q) ||
      String(r.report_id).includes(q)
    );
  });

  const isViewingReportOnMobile = tab === "reports" && selectedReportId !== null;

  return (
    <div className="flex w-full h-[calc(100dvh-11rem)] min-h-[480px] bg-white rounded-[32px] border border-[#FFEFE0] shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-[80] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-bold transition-all animate-in slide-in-from-top-3 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/30"
              : "bg-rose-600 text-white shadow-rose-600/30"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Inbox / Sidebar List */}
      <aside
        className={`${
          activeId || isViewingReportOnMobile ? "hidden md:flex" : "flex"
        } w-full md:w-[22rem] lg:w-[26rem] xl:w-[28rem] shrink-0 flex-col border-r border-[#FFEFE0]`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Messages</h1>
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
              placeholder={tab === "reports" ? "Search reported stories & users..." : "Search"}
              className="w-full bg-[#FDEEE2] rounded-full pl-10 pr-4 py-2.5 text-sm outline-none border border-transparent focus:border-brand/35"
            />
          </div>
        </div>

        {/* Messages | Requests | Reports */}
        <div className="flex items-center justify-between px-5 pb-2" role="tablist" aria-label="Inbox">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "messages"}
            onClick={() => {
              setTab("messages");
              setSelectedReportId(null);
            }}
            className={`text-base font-bold cursor-pointer transition-colors ${
              tab === "messages" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Messages
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "requests"}
              onClick={() => {
                setTab("requests");
                setSelectedReportId(null);
              }}
              className={`flex items-center gap-1.5 text-sm font-bold cursor-pointer transition-colors ${
                tab === "requests" ? "text-gray-900" : "text-[#FF6B35] hover:underline"
              }`}
            >
              Requests
              {requests.length > 0 && (
                <span
                  className={`min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold leading-[18px] text-center ${
                    requestsUnread ? "bg-[#FF6B35]" : "bg-gray-400"
                  }`}
                >
                  {requests.length > 9 ? "9+" : requests.length}
                </span>
              )}
            </button>

            {/* Admin Reports Option */}
            {isAdmin && (
              <button
                type="button"
                role="tab"
                aria-selected={tab === "reports"}
                onClick={() => {
                  setTab("reports");
                  if (activeId) router.replace(base);
                  if (reports.length > 0 && !selectedReportId) {
                    setSelectedReportId(reports[0].report_id);
                  }
                }}
                className={`flex items-center gap-1.5 text-sm font-bold cursor-pointer transition-colors ${
                  tab === "reports" ? "text-rose-600 font-extrabold" : "text-rose-500 hover:text-rose-700"
                }`}
              >
                <Flag className="w-3.5 h-3.5 text-rose-500" />
                Reports
                {reports.length > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-rose-600 text-white text-[10px] font-bold leading-[18px] text-center">
                    {reports.length > 9 ? "9+" : reports.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {tab === "requests" && (
          <p className="px-5 pb-2 text-xs text-gray-500">
            These are from people you don&apos;t follow each other with. Open one to read it — they
            won&apos;t know you&apos;ve seen it until you accept.
          </p>
        )}

        {tab === "reports" && (
          <p className="px-5 pb-2 text-xs text-rose-600 font-semibold flex items-center justify-between">
            <span>Reported stories flagged for admin moderation.</span>
            <button
              type="button"
              onClick={loadReports}
              disabled={reportsLoading}
              className="text-[11px] font-bold text-gray-500 hover:text-gray-900 underline cursor-pointer"
            >
              Refresh
            </button>
          </p>
        )}

        {actionError && <p className="px-5 pb-2 text-xs text-red-600">{actionError}</p>}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {tab === "reports" ? (
            /* REPORTS LIST */
            reportsLoading ? (
              <div className="space-y-2 px-2 py-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-rose-50/60 animate-pulse" />
                ))}
              </div>
            ) : visibleReports.length === 0 ? (
              <div className="text-center px-6 py-16 text-gray-400">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-800">No Reports Pending</p>
                <p className="text-xs text-gray-400 mt-1">
                  {filter ? `No reports matched “${filter}”.` : "All reported stories are clear!"}
                </p>
              </div>
            ) : (
              visibleReports.map((report) => {
                const isSelected = selectedReportId === report.report_id;
                const creatorName = report.story?.user?.username || "Creator";
                const isDeleted = Boolean(report.story?.is_deleted);
                const isSuspended = report.story?.user?.is_active === false;

                return (
                  <button
                    key={report.report_id}
                    type="button"
                    onClick={() => setSelectedReportId(report.report_id)}
                    className={`w-full flex items-start gap-3 p-3 mb-1.5 rounded-2xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-rose-50 border-rose-200 shadow-sm"
                        : "border-transparent hover:bg-gray-50 hover:border-gray-100"
                    }`}
                  >
                    {/* Thumbnail / Avatar */}
                    <div className="w-12 h-12 rounded-xl bg-gray-900 overflow-hidden relative shrink-0 flex items-center justify-center text-white">
                      {report.story?.media_url?.startsWith("http") || report.story?.media_url?.startsWith("data:") ? (
                        report.story.media_type === "video" ? (
                          <video src={report.story.media_url} className="w-full h-full object-cover" muted />
                        ) : (
                          <Image
                            src={report.story.media_url}
                            alt="Story thumbnail"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )
                      ) : (
                        <Flag className="w-5 h-5 text-rose-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[13px] font-extrabold text-gray-900 truncate">
                          @{creatorName}
                        </p>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-0.5 rounded-md bg-rose-100/70 text-rose-700 text-[10px] font-bold truncate max-w-full">
                        <AlertTriangle size={10} />
                        <span className="truncate">{report.reason}</span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        {isSuspended && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-600 text-white">
                            Suspended
                          </span>
                        )}
                        {isDeleted && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-gray-200 text-gray-700">
                            Deleted
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400 truncate">
                          by @{report.reporter_username || "User"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )
          ) : (
            /* CONVERSATIONS LIST */
            <>
              {loading && (
                <div className="space-y-2 px-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="h-[72px] rounded-2xl bg-orange-100/50 animate-pulse" />
                  ))}
                </div>
              )}

              {!loading && list.length === 0 && (
                <div className="text-center px-6 py-16">
                  {tab === "requests" ? (
                    <>
                      <p className="text-sm font-semibold text-gray-900">No message requests</p>
                      <p className="text-xs text-gray-500 mt-1">
                        When someone who isn&apos;t a mutual follow messages you, it shows up here.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-gray-900">No chats yet</p>
                      <p className="text-xs text-gray-500 mt-1">Tap + to message someone.</p>
                    </>
                  )}
                </div>
              )}

              {!loading && list.length > 0 && visible.length === 0 && (
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
                      className={`w-full flex items-center gap-3.5 pl-3 pr-12 py-3 rounded-2xl text-left transition-colors cursor-pointer ${
                        active ? "bg-[#FDEEE2]" : "hover:bg-orange-50/70"
                      }`}
                    >
                      <UserAvatar user={c.partner} size={56} />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[15px] truncate ${
                            unread ? "font-bold text-gray-900" : "font-semibold text-gray-800"
                          }`}
                        >
                          {c.partner.full_name || `@${c.partner.username}`}
                        </p>
                        <p
                          className={`text-[13px] truncate mt-0.5 ${
                            unread ? "font-semibold text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {previewText(c.last_message)}
                          <span className="text-gray-400 font-normal"> · {listTime(c.last_message.created_at)}</span>
                        </p>
                      </div>
                      {unread &&
                        (c.unread_count > 0 ? (
                          <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#FF6B35] text-white text-[11px] font-bold leading-5 text-center">
                            {c.unread_count > 9 ? "9+" : c.unread_count}
                          </span>
                        ) : (
                          <span className="shrink-0 w-2.5 h-2.5 rounded-full bg-[#FF6B35]" aria-label="Marked as unread" />
                        ))}
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
            </>
          )}
        </div>
      </aside>

      {/* Main Content Pane: Either ChatThread OR Report Moderation Inspector */}
      <section
        className={`${
          activeId || isViewingReportOnMobile ? "flex" : "hidden md:flex"
        } flex-1 min-w-0 flex-col bg-[#FFFBF8] overflow-y-auto`}
      >
        {tab === "reports" ? (
          /* REPORT MODERATION INSPECTOR VIEW */
          selectedReport ? (
            <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#FFEFE0]">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedReportId(null)}
                    className="md:hidden w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">
                      Reported Content
                    </h2>
                    <p className="text-xs text-gray-400">
                      Reported on {new Date(selectedReport.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedReport.story?.is_deleted ? (
                    <span className="px-3 py-1 rounded-xl bg-gray-200 text-gray-700 text-xs font-bold">
                      Story Deleted
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      Active Story
                    </span>
                  )}
                  {selectedReport.story?.user?.is_active === false && (
                    <span className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold">
                      Suspended User
                    </span>
                  )}
                </div>
              </div>

              {/* Story Media Preview & Info */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Story Media Player */}
                <div className="lg:col-span-6 bg-gray-950 rounded-3xl overflow-hidden p-3 shadow-md">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    {selectedReport.story?.media_url?.startsWith("http") || selectedReport.story?.media_url?.startsWith("data:") ? (
                      selectedReport.story.media_type === "video" ? (
                        <video src={selectedReport.story.media_url} controls className="w-full h-full object-contain" />
                      ) : (
                        <Image
                          src={selectedReport.story.media_url}
                          alt="Reported story"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      )
                    ) : (
                      <div className="p-4 text-center text-xs font-medium text-white/90">
                        {selectedReport.story?.caption || selectedReport.story?.content || "Text / Graphic Story"}
                      </div>
                    )}
                  </div>
                  {selectedReport.story?.caption && (
                    <p className="text-xs text-gray-300 p-2 italic">
                      &ldquo;{selectedReport.story.caption}&rdquo;
                    </p>
                  )}
                </div>

                {/* Report Details, Creator Info & Options */}
                <div className="lg:col-span-6 space-y-4">
                  {/* Creator Card */}
                  <div className="bg-white p-4 rounded-3xl border border-[#FFEFE0] shadow-sm space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                      Reported Story Creator
                    </span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold overflow-hidden relative">
                          {selectedReport.story?.user?.avatar || selectedReport.story?.user?.avatar_url ? (
                            <Image
                              src={selectedReport.story.user.avatar || selectedReport.story.user.avatar_url!}
                              alt="creator avatar"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <User size={18} />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-gray-900">
                            {selectedReport.story?.user?.full_name || `@${selectedReport.story?.user?.username || "Creator"}`}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            @{selectedReport.story?.user?.username || "Creator"}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                          selectedReport.story?.user?.is_active === false
                            ? "bg-rose-100 text-rose-700 border border-rose-200"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {selectedReport.story?.user?.is_active === false ? "Suspended" : "Active"}
                      </span>
                    </div>
                  </div>

                  {/* Reporter & Reason Card */}
                  <div className="bg-white p-4 rounded-3xl border border-[#FFEFE0] shadow-sm space-y-2.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                      Flag Reason & Context
                    </span>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                      <AlertTriangle size={14} />
                      <span>{selectedReport.reason}</span>
                    </div>

                    {selectedReport.details ? (
                      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs font-medium text-amber-950">
                        {selectedReport.details}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 italic">No extra comments provided by reporter.</div>
                    )}

                    <div className="text-[11px] text-gray-500 pt-1">
                      Reported by <span className="font-bold text-gray-800">@{selectedReport.reporter_username || "User"}</span>
                    </div>
                  </div>


                  {/* MODERATION ACTION OPTIONS (Warning Msg, Suspend, Unban, Delete) */}
                  <div className="bg-white p-5 rounded-3xl border border-rose-100 shadow-md space-y-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-700 block flex items-center gap-1.5">
                      <Shield size={14} className="text-rose-600" />
                      Moderation Actions (Select an action below)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Option 1: Warning Message */}
                      <button
                        type="button"
                        onClick={() => openWarningFromReport(selectedReport)}
                        disabled={reportActionLoading}
                        className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm shadow-amber-500/25 cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        <Send size={15} />
                        <span>Warning Msg</span>
                      </button>

                      {/* Option 2 & 3: Suspend / Unban */}
                      {selectedReport.story?.user_id && (
                        selectedReport.story.user?.is_active === false ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleUnbanUser(
                                selectedReport.story!.user_id,
                                selectedReport.story?.user?.username
                              )
                            }
                            disabled={reportActionLoading}
                            className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            {reportActionLoading ? <Loader2 size={15} className="animate-spin" /> : <UserCheck size={15} />}
                            <span>Unban User</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              handleSuspendUser(
                                selectedReport.story!.user_id,
                                selectedReport.story?.user?.username
                              )
                            }
                            disabled={reportActionLoading}
                            className="py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            {reportActionLoading ? <Loader2 size={15} className="animate-spin" /> : <UserX size={15} />}
                            <span>Suspend User</span>
                          </button>
                        )
                      )}

                      {/* Option 4: Delete Story / Restore Story */}
                      {selectedReport.story?.is_deleted ? (
                        <button
                          type="button"
                          onClick={() => handleRestoreReportedStory(selectedReport.story_id)}
                          disabled={reportActionLoading}
                          className="sm:col-span-2 py-2.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <RotateCcw size={14} />
                          <span>Restore Story to Feed</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteReportedStory(selectedReport.story_id)}
                          disabled={reportActionLoading}
                          className="sm:col-span-2 py-2.5 px-4 rounded-2xl bg-gray-100 hover:bg-rose-50 text-rose-700 hover:text-rose-800 border border-gray-200 hover:border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          <span>Delete Story from Feed</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 text-gray-400">
              <ShieldAlert className="w-16 h-16 text-rose-300 mb-3" />
              <p className="text-base font-bold text-gray-800">Select a report</p>
              <p className="text-xs text-gray-400 mt-1">
                Choose a reported story from the list on the left to inspect and moderate.
              </p>
            </div>
          )
        ) : (
          /* NORMAL CHAT THREAD VIEW */
          activeId ? (
            <ChatThread
              key={activeId}
              userId={activeId}
              onBack={() => historyBack(router, base)}
              onActivity={loadConversations}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-[#FFF8F2]">
              <div className="w-20 h-20 rounded-full border-2 border-[#FF6B35] text-[#FF6B35] flex items-center justify-center">
                <MessageCircle className="w-10 h-10" />
              </div>
              <p className="mt-4 text-lg font-bold text-gray-900">Your messages</p>
              <p className="text-sm text-gray-500 mt-1">Chat privately with creators and freelancers.</p>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mt-4 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-[linear-gradient(135deg,#E6703A,#FFA663)] active:scale-95 transition-all cursor-pointer"
              >
                Send message
              </button>
            </div>
          )
        )}
      </section>

      {/* Warning Modal */}
      {warningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                  <AlertCircle size={22} />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    Send Warning Msg to @{warningModal.creatorUsername}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">
                    Creator: @{warningModal.creatorUsername}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWarningModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500" />
                Quick Warning Templates
              </span>
              <div className="grid grid-cols-2 gap-2">
                {WARNING_PRESETS.map((preset) => (
                  <button
                    key={preset.type}
                    type="button"
                    onClick={() => {
                      setWarningText(preset.text);
                      setWarningType(preset.type);
                    }}
                    className="p-2.5 rounded-2xl text-left bg-gray-50 hover:bg-amber-50 border border-gray-200/70 hover:border-amber-300 text-gray-700 hover:text-amber-900 transition-all cursor-pointer group"
                  >
                    <div className="text-[11px] font-extrabold group-hover:text-amber-700">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-gray-400 line-clamp-1 group-hover:text-amber-600">
                      {preset.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Warning Message Body
              </label>
              <textarea
                value={warningText}
                onChange={(e) => setWarningText(e.target.value)}
                rows={4}
                placeholder="Enter warning message sent to creator..."
                className="w-full p-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-all leading-relaxed"
              />
              <div className="flex justify-between items-center text-[10px] text-gray-400 px-1 font-medium">
                <span>Direct warning DM and notification will be delivered.</span>
                <span>{warningText.length} chars</span>
              </div>
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 cursor-pointer">
              <input
                type="checkbox"
                checked={warningAlsoDelete}
                onChange={(e) => setWarningAlsoDelete(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-gray-300 cursor-pointer"
              />
              <span className="text-xs font-bold text-rose-900">
                Also remove / delete this story immediately from public feed
              </span>
            </label>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setWarningModal(null)}
                disabled={isSendingWarning}
                className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendWarning}
                disabled={isSendingWarning || !warningText.trim()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-extrabold transition-all flex items-center gap-2 shadow-md shadow-amber-500/25 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSendingWarning ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>Send Warning</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
            {menuConversation.is_request ? (
              <button
                type="button"
                onClick={() => acceptFromMenu(menuConversation)}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#FF6B35] cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#FF6B35]" />
                Accept request
              </button>
            ) : (
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
            )}
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(menuConversation.partner);
                setMenu(null);
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              {menuConversation.is_request ? "Delete request" : "Delete chat"}
            </button>
          </div>
        </>
      )}

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