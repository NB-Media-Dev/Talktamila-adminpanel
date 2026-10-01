"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Flag,
  AlertTriangle,
  Trash2,
  RotateCcw,
  UserX,
  Search,
  RefreshCw,
  Filter,
  Calendar,
  User,
  MessageSquare,
  CheckCircle,
  Clock,
  Eye,
  Shield,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { storyService } from "@/services/Stories.service";
import type { AdminReportItem } from "@/types/Stories";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReasonFilter, setSelectedReasonFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [previewStory, setPreviewStory] = useState<AdminReportItem | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await storyService.getStoryReports(100, 0);
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

  // Handle Admin Actions
  const handleDeleteStory = async (storyId: number, reportId: number) => {
    if (!confirm(`Are you sure you want to delete story #${storyId}? This will remove it from the public feed.`)) {
      return;
    }
    setActionLoadingId(reportId);
    try {
      await storyService.adminDeleteStory(storyId);
      showToast(`Story #${storyId} deleted successfully.`);
      // Update local state
      setReports((prev) =>
        prev.map((r) =>
          r.story_id === storyId && r.story ? { ...r, story: { ...r.story, is_deleted: true, is_active: false } } : r
        )
      );
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
      showToast(`Story #${storyId} restored successfully.`);
      setReports((prev) =>
        prev.map((r) =>
          r.story_id === storyId && r.story ? { ...r, story: { ...r.story, is_deleted: false, is_active: true } } : r
        )
      );
    } catch (err: any) {
      showToast(err?.message || "Failed to restore story", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBanUser = async (userId: number, username: string | undefined, reportId: number) => {
    if (!confirm(`Are you sure you want to suspend user ${username ? `@${username}` : `#${userId}`}?`)) {
      return;
    }
    setActionLoadingId(reportId);
    try {
      await storyService.adminBanUser(userId);
      showToast(`User ${username ? `@${username}` : `#${userId}`} has been suspended.`);
    } catch (err: any) {
      showToast(err?.message || "Failed to suspend user", "error");
    } finally {
      setActionLoadingId(null);
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

    return matchesSearch && matchesReason;
  });

  const uniqueReasons = Array.from(new Set(reports.map((r) => r.reason.split(" - ")[0]))).filter(Boolean);

  const totalReportsCount = reports.length;
  const deletedStoriesCount = reports.filter((r) => r.story?.is_deleted).length;
  const activeReportedCount = reports.filter((r) => r.story && !r.story.is_deleted).length;

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] p-4 sm:p-6 md:p-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-semibold transition-all animate-in slide-in-from-top-2 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : "bg-rose-600 text-white shadow-rose-600/20"
          }`}
        >
          {toastMessage.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Flag size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Reported Stories Moderation
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Review user-submitted reports with reasons, additional details, and take swift moderation actions.
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flag size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">{totalReportsCount}</div>
            <div className="text-xs font-semibold text-gray-400">Total Reports Submitted</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">{activeReportedCount}</div>
            <div className="text-xs font-semibold text-gray-400">Active Reported Stories</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Shield size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">{deletedStoriesCount}</div>
            <div className="text-xs font-semibold text-gray-400">Removed / Actioned Stories</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reason, details, reporter, creator or story ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-gray-100/80 focus:bg-white rounded-xl text-xs font-medium text-gray-800 placeholder-gray-400 border border-gray-200/60 focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-gray-400 shrink-0" />
          <select
            value={selectedReasonFilter}
            onChange={(e) => setSelectedReasonFilter(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border border-gray-200/60 text-gray-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-gray-900 cursor-pointer"
          >
            <option value="all">All Reasons ({reports.length})</option>
            {uniqueReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-3">
          <Loader2 size={32} className="animate-spin text-gray-900" />
          <span className="text-xs font-semibold">Loading story reports...</span>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="py-16 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center p-6 space-y-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
            <CheckCircle size={28} />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Reports Found</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            {searchQuery || selectedReasonFilter !== "all"
              ? "No story reports matched your current search filters."
              : "Great job! There are currently no reported stories requiring admin action."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isStoryDeleted = report.story?.is_deleted;
            const isLoadingAction = actionLoadingId === report.report_id;
            const creatorUsername = report.story?.user?.username || `User #${report.story?.user_id || "Unknown"}`;
            const reporterDisplay = report.reporter_username || `User #${report.user_id}`;

            return (
              <div
                key={report.report_id}
                className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all shadow-sm hover:shadow-md ${
                  isStoryDeleted ? "border-gray-200/60 bg-gray-50/50 opacity-80" : "border-rose-100/80 hover:border-rose-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6 justify-between">
                  {/* Left Column: Report Details & Reason */}
                  <div className="flex-1 space-y-4">
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-red-100/70 text-red-700 text-[11px] font-bold flex items-center gap-1.5">
                        <Flag size={12} />
                        Report #{report.report_id}
                      </span>

                      <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-[11px] font-semibold flex items-center gap-1.5">
                        <Clock size={12} />
                        {new Date(report.created_at).toLocaleString()}
                      </span>

                      {isStoryDeleted && (
                        <span className="px-2.5 py-1 rounded-lg bg-gray-200 text-gray-700 text-[11px] font-bold">
                          Story Deleted
                        </span>
                      )}
                    </div>

                    {/* Reporter & Creator Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Reported By
                        </span>
                        <div className="flex items-center gap-1.5 font-bold text-gray-800">
                          <User size={13} className="text-gray-500" />
                          <span>@{reporterDisplay}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider mb-0.5">
                          Story Creator
                        </span>
                        <div className="flex items-center gap-1.5 font-bold text-gray-800">
                          <User size={13} className="text-gray-500" />
                          <span>@{creatorUsername}</span>
                          <span className="text-[10px] text-gray-400 font-normal">
                            (ID: {report.story?.user_id || report.story?.author_id || "N/A"})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Selected Reason
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
                        <AlertTriangle size={13} />
                        <span>{report.reason}</span>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        User-Provided Details & Context
                      </span>
                      {report.details ? (
                        <div className="bg-amber-50/60 border border-amber-200/80 text-amber-950 p-3.5 rounded-2xl text-xs font-medium leading-relaxed">
                          <p className="whitespace-pre-wrap">{report.details}</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-100 text-gray-400 p-2.5 rounded-xl text-xs italic">
                          No additional details provided by reporter.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Story Preview & Admin Moderation Actions */}
                  <div className="w-full lg:w-72 flex flex-col justify-between space-y-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                    {/* Story Preview Card */}
                    {report.story ? (
                      <div className="bg-gray-900 rounded-2xl overflow-hidden text-white p-3 space-y-2 relative shadow-md">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 pb-1 border-b border-white/10">
                          <span>Story #{report.story_id}</span>
                          <span className="capitalize">{report.story.media_type || "Image"}</span>
                        </div>

                        {/* Thumbnail / Media Container */}
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-black flex items-center justify-center">
                          {report.story.media_url?.startsWith("http") || report.story.media_url?.startsWith("data:") ? (
                            report.story.media_type === "video" ? (
                              <video src={report.story.media_url} className="w-full h-full object-cover" controls />
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
                              {report.story.caption || report.story.content || "Text / Gradient Story"}
                            </div>
                          )}
                        </div>

                        {report.story.caption && (
                          <p className="text-xs text-gray-300 line-clamp-2 italic pt-1">
                            &ldquo;{report.story.caption}&rdquo;
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-2xl p-4 text-center text-xs text-gray-400">
                        Story media data no longer available.
                      </div>
                    )}

                    {/* Admin Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Admin Actions
                      </span>

                      <div className="flex flex-col gap-2">
                        {isStoryDeleted ? (
                          <button
                            type="button"
                            onClick={() => handleRestoreStory(report.story_id, report.report_id)}
                            disabled={isLoadingAction}
                            className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <RotateCcw size={14} />
                            <span>Restore Story</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteStory(report.story_id, report.report_id)}
                            disabled={isLoadingAction}
                            className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            {isLoadingAction ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            <span>Delete Story</span>
                          </button>
                        )}

                        {report.story?.user_id && (
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
                            className="w-full py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <UserX size={13} />
                            <span>Suspend Creator</span>
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
    </div>
  );
}
