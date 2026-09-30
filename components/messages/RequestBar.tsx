"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * Shown at the bottom of a chat that is still a message request (the other person is
 * not a mutual follow and you have not accepted yet). Same idea as Instagram:
 * you can read the message, but nothing is sent back and they can't see that you
 * looked until you tap Accept.
 */
export default function RequestBar({
  name,
  onAccept,
  onDelete,
  onBlock,
}: {
  name: string;
  onAccept: () => Promise<void>;
  onDelete: () => Promise<void>;
  onBlock: () => Promise<void>;
}) {
  const [busy, setBusy] = useState<"accept" | "delete" | "block" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(kind: "accept" | "delete" | "block", fn: () => Promise<void>) {
    if (busy) return;
    setBusy(kind);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="border-t border-[#FFEFE0] bg-white px-4 py-4 text-center">
      <p className="text-sm font-semibold text-gray-900">
        Accept message request from {name}?
      </p>
      <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
        If you accept, they will also be able to call you and see when you&apos;re active.
        They won&apos;t know you&apos;ve seen their message until you accept.
      </p>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      <div className="mt-3 flex items-center justify-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => run("block", onBlock)}
          disabled={!!busy}
          className="flex-1 max-w-[9rem] rounded-full border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
        >
          {busy === "block" ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Block"}
        </button>
        <button
          type="button"
          onClick={() => run("delete", onDelete)}
          disabled={!!busy}
          className="flex-1 max-w-[9rem] rounded-full border border-[#FFD9BF] px-4 py-2 text-sm font-bold text-gray-700 hover:bg-orange-50 disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
        >
          {busy === "delete" ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete"}
        </button>
        <button
          type="button"
          onClick={() => run("accept", onAccept)}
          disabled={!!busy}
          className="flex-1 max-w-[9rem] rounded-full bg-[linear-gradient(135deg,#E6703A,#FFA663)] px-4 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer active:scale-95 transition-all"
        >
          {busy === "accept" ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Accept"}
        </button>
      </div>
    </div>
  );
}