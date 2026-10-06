"use client";

import { useEffect, useRef, useState } from "react";
import {
  Ban,
  Bell,
  BellOff,
  EllipsisVertical,
  Flag,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

type Dialog = "block" | "report" | "delete" | null;

const REPORT_REASONS = [
  "Spam or scam",
  "Harassment or bullying",
  "Inappropriate content",
  "Pretending to be someone else",
  "Something else",
];

export default function ChatHeaderMenu({
  name,
  muted,
  blocked,
  disabled,
  onViewProfile,
  onSearch,
  onToggleMute,
  onToggleBlock,
  onReport,
  onDeleteChat,
  onError,
  onNotice,
}: {
  name: string;
  muted: boolean;
  blocked: boolean;
  disabled?: boolean;
  onViewProfile: () => void;
  onSearch: () => void;
  onToggleMute: () => Promise<void>;
  onToggleBlock: () => Promise<void>;
  onReport: (reason: string) => Promise<void>;
  onDeleteChat: () => Promise<void>;
  onError: (message: string) => void;
  onNotice: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [busy, setBusy] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent | TouchEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openDialog(d: Exclude<Dialog, null>) {
    setOpen(false);
    setDialogError(null);
    setReason(REPORT_REASONS[0]);
    setDialog(d);
  }

  async function quick(fn: () => Promise<void>) {
    setOpen(false);
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDialog(fn: () => Promise<void>, doneNotice?: string) {
    if (busy) return;
    setBusy(true);
    setDialogError(null);
    try {
      await fn();
      setDialog(null);
      if (doneNotice) onNotice(doneNotice);
    } catch (e) {
      setDialogError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const item =
    "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-gray-800 hover:bg-orange-50 cursor-pointer disabled:opacity-50";

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-label="Chat options"
        aria-haspopup="menu"
        aria-expanded={open}
        title="More"
        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-[#FF6B35] hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer"
      >
        <EllipsisVertical className="w-5 h-5" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-11 z-40 w-56 overflow-hidden rounded-2xl border border-[#FFEFE0] bg-white py-1 shadow-xl"
        >
          <button
            type="button"
            role="menuitem"
            className={item}
            onClick={() => {
              setOpen(false);
              onViewProfile();
            }}
          >
            <UserRound className="w-4 h-4 text-gray-500" />
            View profile
          </button>
          <button
            type="button"
            role="menuitem"
            className={item}
            onClick={() => {
              setOpen(false);
              onSearch();
            }}
          >
            <Search className="w-4 h-4 text-gray-500" />
            Search in chat
          </button>
          <button type="button" role="menuitem" className={item} onClick={() => quick(onToggleMute)}>
            {muted ? <Bell className="w-4 h-4 text-gray-500" /> : <BellOff className="w-4 h-4 text-gray-500" />}
            {muted ? "Unmute messages" : "Mute messages"}
          </button>
          <div className="my-1 h-px bg-[#FFEFE0]" />
          {blocked ? (
            <button type="button" role="menuitem" className={item} onClick={() => quick(onToggleBlock)}>
              <Ban className="w-4 h-4 text-gray-500" />
              Unblock
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              className={`${item} !text-red-600`}
              onClick={() => openDialog("block")}
            >
              <Ban className="w-4 h-4" />
              Block
            </button>
          )}
          <button
            type="button"
            role="menuitem"
            className={`${item} !text-red-600`}
            onClick={() => openDialog("report")}
          >
            <Flag className="w-4 h-4" />
            Report
          </button>
          <button
            type="button"
            role="menuitem"
            className={`${item} !text-red-600`}
            onClick={() => openDialog("delete")}
          >
            <Trash2 className="w-4 h-4" />
            Delete chat
          </button>
        </div>
      )}

      {dialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !busy && setDialog(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {dialog === "block" && (
              <>
                <p className="text-base font-bold text-gray-900">Block {name}?</p>
                <p className="text-xs text-gray-500 mt-1">
                  You won&apos;t be able to message or call each other. You can unblock them anytime from this chat.
                </p>
              </>
            )}
            {dialog === "delete" && (
              <>
                <p className="text-base font-bold text-gray-900">Delete this chat?</p>
                <p className="text-xs text-gray-500 mt-1">
                  This removes the conversation from your inbox only. {name} keeps their copy.
                </p>
              </>
            )}
            {dialog === "report" && (
              <>
                <p className="text-base font-bold text-gray-900">Report {name}</p>
                <p className="text-xs text-gray-500 mt-1">Why are you reporting this account?</p>
                <div className="mt-3 space-y-1 text-left">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer ${
                        reason === r
                          ? "bg-orange-50 text-[#FF6B35] font-semibold"
                          : "text-gray-700 hover:bg-orange-50/60"
                      }`}
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="accent-[#FF6B35]"
                      />
                      {r}
                    </label>
                  ))}
                </div>
              </>
            )}

            {dialogError && <p className="mt-3 text-xs text-red-600">{dialogError}</p>}

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setDialog(null)}
                disabled={busy}
                className={`${buttonVariants({ variant: "outline" })} flex-1 px-4 py-2 text-sm font-bold disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  if (dialog === "block") confirmDialog(onToggleBlock);
                  else if (dialog === "delete") confirmDialog(onDeleteChat);
                  else confirmDialog(() => onReport(reason), "Thanks - your report was sent.");
                }}
                className={`${buttonVariants({ variant: "destructive" })} flex-1 px-4 py-2 text-sm font-bold disabled:opacity-50`}
              >
                {busy ? "…" : dialog === "block" ? "Block" : dialog === "delete" ? "Delete" : "Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}