"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";

interface LogoutConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmDialog({ open, onCancel, onConfirm }: LogoutConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Start on "Cancel" so an accidental Enter never logs the user out.
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open || typeof document === "undefined") return null;

  // Portal to <body>: the sticky navbar uses backdrop-blur, which would otherwise
  // trap a fixed overlay inside the header instead of covering the screen.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-xl border border-orange-100"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
          <LogOut className="h-5 w-5 text-red-500" />
        </div>

        <h2 id="logout-dialog-title" className="mt-4 text-lg font-bold text-gray-900">
          Log out?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          You&apos;ll need to sign in again to get back into your account.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-full bg-[#FFEAE2] py-3 text-sm font-medium text-gray-700 hover:bg-[#FCDCCB] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#FA7A22] py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-[#E06412] transition cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}