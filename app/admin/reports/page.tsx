"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Flag,
  AlertTriangle,
  Trash2,
  RotateCcw,
  UserX,
  UserCheck,
  Search,
  RefreshCw,
  Filter,
  User,
  CheckCircle,
  Clock,
  Shield,
  Loader2,
  Send,
  AlertCircle,
  X,
  Sparkles,
  Eye,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { storyService } from "@/services/Stories.service";
import type { AdminReportItem } from "@/types/Stories";

const WARNING_PRESETS = [
  {
    title: "Community Guidelines",
    type: "guidelines",
    text: "Your story violates Talk Tamila Community Guidelines. Continued violations may result in permanent suspension of your account.",
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
    text: "This story contains copyrighted material posted without authorization or proper licensing. Please remove it.",
  },
  {
    title: "Spam & Misleading",
    type: "spam",
    text: "Misleading promotions, deceptive links, or repetitive spam in stories are prohibited.",
  },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReasonFilter, setSelectedReasonFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "deleted" | "suspended">("all");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Story Inspector Modal
  const [previewReport, setPreviewReport] = useState<AdminReportItem | null>(null);

  // Warning Dialog State
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

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await storyService.getStoryReports(150, 0);
      setReports(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Failed to fetch reports:", err);
      showToast(err?.message || "Failed to load reports from server", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Story Moderation
  const handleDeleteStory = async (storyId: number, reportId: number) => {
    if (!confirm(`Are you sure you want to delete this story? It will be hidden immediately from the feed.`)) {
      return;
    }
    setActionLoadingId(reportId);
    try {
      await storyService.adminDeleteStory(storyId);
      showToast(`Story removed by admin.`);
      setReports((prev) =>
        prev.map((r) =>
          r.story_id === storyId && r.story
            ? { ...r, story: { ...r.story, is_deleted: true, is_active: false } }
            : r
        )
      );
      if (previewReport?.story_id === storyId && previewReport.story) {
        setPreviewReport({
          ...previewReport,
          story: { ...previewReport.story, is_deleted: true, is_active: false },
        });
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to delete story", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRestoreStory = async (storyId: number, reportId: number) => {
    setActionLoadingId(reportId);
    try {
      await storyService.adminRestoreStory(storyId);
      showToast(`Story restored to active status.`);
      setReports((prev) =>
        prev.map((r) =>
          r.story_id === storyId && r.story
            ? { ...r, story: { ...r.story, is_deleted: false, is_active: true } }
            : r
        )
      );
      if (previewReport?.story_id === storyId && previewReport.story) {
        setPreviewReport({
          ...previewReport,
          story: { ...previewReport.story, is_deleted: false, is_active: true },
        });
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to restore story", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // User Moderation: Suspend
  const handleBanUser = async (userId: number, username: string | undefined, reportId: number) => {
    if (
      !confirm(
        `Are you sure you want to suspend user ${
          username ? `@${username}` : "this creator"
        }? This will deactivate their account and prevent them from posting stories and interacting.`
      )
    ) {
      return;
    }
    setActionLoadingId(reportId);
    try {
      await storyService.adminBanUser(userId);
      showToast(`Creator ${username ? `@${username}` : ""} suspended successfully.`);
      setReports((prev) =>
        prev.map((r) => {
          if (r.story && (r.story.user_id === userId || r.story.user?.id === userId)) {
            return {
              ...r,
              story: {
                ...r.story,
                user: r.story.user ? { ...r.story.user, is_active: false } : undefined,
              },
            };
          }
          return r;
        })
      );
      if (
        previewReport?.story &&
        (previewReport.story.user_id === userId || previewReport.story.user?.id === userId)
      ) {
        setPreviewReport({
          ...previewReport,
          story: {
            ...previewReport.story,
            user: previewReport.story.user
              ? { ...previewReport.story.user, is_active: false }
              : undefined,
          },
        });
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to suspend user", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // User Moderation: Unban / Re-activate
  const handleUnbanUser = async (userId: number, username: string | undefined, reportId: number) => {
    if (
      !confirm(
        `Are you sure you want to unban and reactivate user ${
          username ? `@${username}` : "this creator"
        }?`
      )
    ) {
      return;
    }
    setActionLoadingId(reportId);
    try {
      await storyService.adminUnbanUser(userId);
      showToast(`Creator ${username ? `@${username}` : ""} unbanned and reactivated.`);
      setReports((prev) =>
        prev.map((r) => {
          if (r.story && (r.story.user_id === userId || r.story.user?.id === userId)) {
            return {
              ...r,
              story: {
                ...r.story,
                user: r.story.user ? { ...r.story.user, is_active: true } : undefined,
              },
            };
          }
          return r;
        })
      );
      if (
        previewReport?.story &&
        (previewReport.story.user_id === userId || previewReport.story.user?.id === userId)
      ) {
        setPreviewReport({
          ...previewReport,
          story: {
            ...previewReport.story,
            user: previewReport.story.user
              ? { ...previewReport.story.user, is_active: true }
              : undefined,
          },
        });
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to unban user", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Warning Modal Opener
  const openWarningModal = (report: AdminReportItem) => {
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

  // Send Warning Execution
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
          warningAlsoDelete ? " and story was removed." : "."
        }`
      );
      setWarningModal(null);
    } catch (err: any) {
      showToast(err?.message || "Failed to send warning message", "error");
    } finally {
      setIsSendingWarning(false);
    }
  };

  // Filtered reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.reason?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (report.details?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (report.reporter_username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (report.story?.user?.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      String(report.story_id).includes(searchQuery);

    const matchesReason =
      selectedReasonFilter === "all" ||
      report.reason.toLowerCase().includes(selectedReasonFilter.toLowerCase());

    const isDeleted = Boolean(report.story?.is_deleted);
    const isUserSuspended = report.story?.user?.is_active === false;

    let matchesStatus = true;
    if (statusFilter === "active") matchesStatus = !isDeleted;
    if (statusFilter === "deleted") matchesStatus = isDeleted;
    if (statusFilter === "suspended") matchesStatus = isUserSuspended;

    return matchesSearch && matchesReason && matchesStatus;
  });

  const uniqueReasons = Array.from(new Set(reports.map((r) => r.reason.split(" - ")[0]))).filter(Boolean);

  const totalReportsCount = reports.length;
  const deletedStoriesCount = reports.filter((r) => r.story?.is_deleted).length;
  const activeReportedCount = reports.filter((r) => r.story && !r.story.is_deleted).length;
  const suspendedCreatorsCount = reports.filter((r) => r.story?.user?.is_active === false).length;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] p-4 sm:p-6 md:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-bold transition-all animate-in slide-in-from-top-3 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/30"
              : "bg-rose-600 text-white shadow-rose-600/30"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-red-600 text-white flex items-center justify-center font-black shadow-md shadow-rose-500/20">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                Reported Stories Moderation
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                  Admin Panel
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                Investigate reports, take direct actions: Suspend accounts, Unban users, send Warning Messages, or Delete offending stories.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchReports}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Reports</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter("all")}
          className={`cursor-pointer bg-white p-5 rounded-3xl border transition-all shadow-sm flex items-center gap-4 ${
            statusFilter === "all" ? "border-rose-500 ring-2 ring-rose-500/20 shadow-md" : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flag size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{totalReportsCount}</div>
            <div className="text-xs font-semibold text-gray-400">Total Reports Submitted</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("active")}
          className={`cursor-pointer bg-white p-5 rounded-3xl border transition-all shadow-sm flex items-center gap-4 ${
            statusFilter === "active" ? "border-amber-500 ring-2 ring-amber-500/20 shadow-md" : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">{activeReportedCount}</div>
            <div className="text-xs font-semibold text-gray-400">Active Reported Stories</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("deleted")}
          className={`cursor-pointer bg-white p-5 rounded-3xl border transition-all shadow-sm flex items-center gap-4 ${
            statusFilter === "deleted" ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md" : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{deletedStoriesCount}</div>
            <div className="text-xs font-semibold text-gray-400">Removed / Actioned Stories</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("suspended")}
          className={`cursor-pointer bg-white p-5 rounded-3xl border transition-all shadow-sm flex items-center gap-4 ${
            statusFilter === "suspended" ? "border-purple-500 ring-2 ring-purple-500/20 shadow-md" : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <UserX size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-600">{suspendedCreatorsCount}</div>
            <div className="text-xs font-semibold text-gray-400">Suspended Creators</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reason, details, reporter username, or creator..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white rounded-2xl text-xs font-semibold text-gray-800 placeholder-gray-400 border border-gray-200/60 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Reason filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/60 rounded-2xl px-3 py-1.5">
            <Filter size={14} className="text-gray-400" />
            <select
              value={selectedReasonFilter}
              onChange={(e) => setSelectedReasonFilter(e.target.value)}
              className="bg-transparent text-gray-700 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="all">All Reasons ({reports.length})</option>
              {uniqueReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl">
            {(["all", "active", "deleted", "suspended"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === tab
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-gray-400 space-y-3">
          <Loader2 size={36} className="animate-spin text-rose-600" />
          <span className="text-sm font-bold text-gray-700">Loading reported stories...</span>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="py-20 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center p-6 space-y-3 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-lg font-black text-gray-900">No Reports Found</h3>
          <p className="text-xs text-gray-400 max-w-md">
            {searchQuery || selectedReasonFilter !== "all" || statusFilter !== "all"
              ? "No reported stories match your current filters. Try resetting the filters."
              : "Great job! All story reports have been resolved or no flags are currently pending review."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isStoryDeleted = Boolean(report.story?.is_deleted);
            const isLoadingAction = actionLoadingId === report.report_id;
            const creatorUsername = report.story?.user?.username || "Creator";
            const reporterDisplay = report.reporter_username || "User";
            const isUserSuspended = report.story?.user?.is_active === false;

            return (
              <div
                key={report.report_id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all shadow-sm hover:shadow-md ${
                  isStoryDeleted
                    ? "border-gray-200 bg-gray-50/60 opacity-90"
                    : "border-rose-100/90 hover:border-rose-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
                  {/* Left Column: Report Meta, Reporter, Creator & Reason */}
                  <div className="flex-1 space-y-4 w-full">
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold flex items-center gap-1.5">
                        <Flag size={12} />
                        Story Report
                      </span>

                      <span className="px-3 py-1 rounded-xl bg-gray-100 text-gray-600 text-xs font-semibold flex items-center gap-1.5">
                        <Clock size={12} />
                        {new Date(report.created_at).toLocaleString()}
                      </span>

                      {isStoryDeleted ? (
                        <span className="px-3 py-1 rounded-xl bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1">
                          <Trash2 size={12} />
                          Story Deleted by Admin
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                          <CheckCircle size={12} />
                          Active in Feed
                        </span>
                      )}

                      {isUserSuspended && (
                        <span className="px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-bold flex items-center gap-1">
                          <UserX size={12} />
                          Creator Suspended
                        </span>
                      )}
                    </div>

                    {/* Reporter & Creator Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/90 p-4 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                          Reporter
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                            <User size={13} />
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-gray-800">@{reporterDisplay}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
                          Reported Story Creator
                        </span>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs overflow-hidden relative">
                              {report.story?.user?.avatar || report.story?.user?.avatar_url ? (
                                <Image
                                  src={report.story.user.avatar || report.story.user.avatar_url!}
                                  alt="creator avatar"
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <User size={13} />
                              )}
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-gray-900">@{creatorUsername}</span>
                            </div>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                              isUserSuspended
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            }`}
                          >
                            {isUserSuspended ? "Suspended" : "Active"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reported Reason */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Violation Category / Reason
                      </span>
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                        <AlertTriangle size={15} />
                        <span>{report.reason}</span>
                      </div>
                    </div>

                    {/* Additional Context Details */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Reporter Context & Explanation
                      </span>
                      {report.details ? (
                        <div className="bg-amber-50/70 border border-amber-200/90 text-amber-950 p-3.5 rounded-2xl text-xs font-medium leading-relaxed">
                          <p className="whitespace-pre-wrap">{report.details}</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-100 text-gray-400 p-2.5 rounded-xl text-xs italic">
                          No additional details specified by reporter.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Story Preview & Moderation Actions */}
                  <div className="w-full lg:w-72 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6 shrink-0">
                    {/* Story Preview Card */}
                    {report.story ? (
                      <div className="bg-gray-900 rounded-3xl overflow-hidden text-white p-3 space-y-2 relative shadow-md group">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1 border-b border-white/10">
                          <span className="font-bold">Story Preview</span>
                          <span className="capitalize px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-semibold">
                            {report.story.media_type || "Image"}
                          </span>
                        </div>

                        {/* Thumbnail */}
                        <div
                          onClick={() => setPreviewReport(report)}
                          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center cursor-pointer group-hover:ring-2 group-hover:ring-rose-400 transition-all"
                        >
                          {report.story.media_url?.startsWith("http") || report.story.media_url?.startsWith("data:") ? (
                            report.story.media_type === "video" ? (
                              <video src={report.story.media_url} className="w-full h-full object-cover" muted />
                            ) : (
                              <Image
                                src={report.story.media_url}
                                alt="Reported story"
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            )
                          ) : (
                            <div className="p-3 text-center text-xs font-medium text-white/90">
                              {report.story.caption || report.story.content || "Text / Graphic Story"}
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="px-3 py-1.5 rounded-xl bg-white/90 text-gray-900 font-extrabold text-xs flex items-center gap-1 shadow-lg">
                              <Eye size={13} /> Inspect Story
                            </span>
                          </div>
                        </div>

                        {report.story.caption && (
                          <p className="text-[11px] text-gray-300 line-clamp-2 italic pt-1">
                            &ldquo;{report.story.caption}&rdquo;
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-2xl p-4 text-center text-xs text-gray-400">
                        Story media data unavailable.
                      </div>
                    )}

                    {/* Admin Action Button Group */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                        Admin Moderation Actions
                      </span>

                      <div className="flex flex-col gap-2">
                        {/* 1. Warning Button */}
                        <button
                          type="button"
                          onClick={() => openWarningModal(report)}
                          disabled={isLoadingAction}
                          className="w-full py-2.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm shadow-amber-500/20 cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <Send size={14} />
                          <span>Send Warning Message</span>
                        </button>

                        {/* 2. Suspend / Unban User Button */}
                        {report.story?.user_id && (
                          isUserSuspended ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleUnbanUser(
                                  report.story!.user_id,
                                  report.story?.user?.username,
                                  report.report_id
                                )
                              }
                              disabled={isLoadingAction}
                              className="w-full py-2 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                              <UserCheck size={14} />
                              <span>Unban / Reactivate Creator</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleBanUser(
                                  report.story!.user_id,
                                  report.story?.user?.username,
                                  report.report_id
                                )
                              }
                              disabled={isLoadingAction}
                              className="w-full py-2 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                            >
                              <UserX size={14} />
                              <span>Suspend Creator</span>
                            </button>
                          )
                        )}

                        {/* 3. Delete / Restore Story Button */}
                        {isStoryDeleted ? (
                          <button
                            type="button"
                            onClick={() => handleRestoreStory(report.story_id, report.report_id)}
                            disabled={isLoadingAction}
                            className="w-full py-2 px-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <RotateCcw size={14} />
                            <span>Restore Story</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteStory(report.story_id, report.report_id)}
                            disabled={isLoadingAction}
                            className="w-full py-2 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            {isLoadingAction ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            <span>Delete Story</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                    Send Warning to @{warningModal.creatorUsername}
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

            {/* Quick Presets */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500" />
                Quick Warning Presets (Click to autofill)
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

            {/* Message Area */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Warning Message Body
              </label>
              <textarea
                value={warningText}
                onChange={(e) => setWarningText(e.target.value)}
                rows={4}
                placeholder="Enter warning explanation sent directly to creator's notifications and inbox..."
                className="w-full p-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200/80 rounded-2xl text-xs font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-all leading-relaxed"
              />
              <div className="flex justify-between items-center text-[10px] text-gray-400 px-1 font-medium">
                <span>The creator will receive an official DM and high-priority notification.</span>
                <span>{warningText.length} chars</span>
              </div>
            </div>

            {/* Also Delete Checkbox */}
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

            {/* Modal Actions */}
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

      {/* Story Inspector Modal */}
      {previewReport && previewReport.story && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-gray-900 text-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-white/10 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  <Eye size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    Story Inspector
                  </h3>
                  <p className="text-xs text-gray-400">
                    Creator: @{previewReport.story.user?.username || "Creator"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Media Player */}
            <div className="relative w-full max-h-96 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {previewReport.story.media_type === "video" ? (
                <video
                  src={previewReport.story.media_url}
                  controls
                  autoPlay
                  className="max-h-96 w-full object-contain"
                />
              ) : (
                <div className="relative w-full h-80">
                  <Image
                    src={previewReport.story.media_url}
                    alt="Story preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>

            {/* Story Caption & Reason */}
            <div className="bg-white/5 p-4 rounded-2xl space-y-2 border border-white/10 text-xs">
              {previewReport.story.caption && (
                <div>
                  <span className="text-gray-400 font-bold block mb-0.5">Caption:</span>
                  <p className="text-gray-200">{previewReport.story.caption}</p>
                </div>
              )}
              <div>
                <span className="text-gray-400 font-bold block mb-0.5">Flagged Reason:</span>
                <span className="text-rose-400 font-extrabold">{previewReport.reason}</span>
              </div>
              {previewReport.details && (
                <div>
                  <span className="text-gray-400 font-bold block mb-0.5">Reporter Context:</span>
                  <p className="text-amber-200">{previewReport.details}</p>
                </div>
              )}
            </div>

            {/* Inspector Action Bar */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setPreviewReport(null);
                  openWarningModal(previewReport);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Send size={13} />
                <span>Send Warning</span>
              </button>

              {previewReport.story.user_id && (
                previewReport.story.user?.is_active === false ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleUnbanUser(
                        previewReport.story!.user_id,
                        previewReport.story?.user?.username,
                        previewReport.report_id
                      );
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck size={13} />
                    <span>Unban Creator</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleBanUser(
                        previewReport.story!.user_id,
                        previewReport.story?.user?.username,
                        previewReport.report_id
                      );
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserX size={13} />
                    <span>Suspend Creator</span>
                  </button>
                )
              )}

              {previewReport.story.is_deleted ? (
                <button
                  type="button"
                  onClick={() => handleRestoreStory(previewReport.story_id, previewReport.report_id)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Restore Story</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDeleteStory(previewReport.story_id, previewReport.report_id)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Delete Story</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
