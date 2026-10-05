"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { dismissPrompt, enablePush, shouldShowPrompt, syncPushIfAllowed } from "@/lib/push";

/**
 * Instagram-style message notifications.
 * - Already allowed: quietly keeps this browser registered for the logged-in person.
 * - Not decided yet: shows a small "Turn on notifications" card once in a while.
 * Renders nothing when the browser can't do notifications.
 */
export default function MessageNotifications() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      await syncPushIfAllowed();
      if (alive && (await shouldShowPrompt())) setShowPrompt(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!showPrompt) return null;

  const close = () => {
    dismissPrompt();
    setShowPrompt(false);
  };

  const turnOn = async () => {
    setBusy(true);
    setNote(null);
    const result = await enablePush();
    setBusy(false);
    if (result === "on") {
      setShowPrompt(false);
    } else if (result === "blocked") {
      setNote("Notifications are blocked. Allow them for this site in your browser settings.");
    } else {
      setNote("Couldn't turn on notifications right now. Please try again later.");
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Turn on message notifications"
      className="fixed z-40 bottom-24 left-3 right-3 sm:left-auto sm:right-6 sm:w-[22rem] rounded-2xl border border-[#FFEFE0] bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Not now"
        className="absolute right-2.5 top-2.5 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-[#FF6B35] cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="shrink-0 w-10 h-10 rounded-full bg-[linear-gradient(135deg,#E6703A,#FFA663)] text-white flex items-center justify-center">
          <Bell className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900">Turn on notifications</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Get notified when someone sends you a message, even when Talk Tamila is closed.
          </p>
        </div>
      </div>

      {note && <p className="mt-2 text-xs text-red-600">{note}</p>}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={close}
          disabled={busy}
          className="flex-1 rounded-full border border-[#FFEFE0] px-4 py-2 text-xs font-bold text-gray-600 hover:bg-orange-50 disabled:opacity-50 cursor-pointer"
        >
          Not now
        </button>
        <button
          type="button"
          onClick={turnOn}
          disabled={busy}
          className="flex-1 rounded-full bg-[linear-gradient(135deg,#E6703A,#FFA663)] px-4 py-2 text-xs font-bold text-white active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
        >
          {busy ? "…" : "Turn on"}
        </button>
      </div>
    </div>
  );
}