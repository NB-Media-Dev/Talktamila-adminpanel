"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface PostModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Close when the dark area outside is clicked (default true). Turn off while saving. */
  dismissible?: boolean;
  maxWidth?: string;
}

/**
 * Shared pop-up for the post features. It sits above the post viewer, closes with Escape
 * (without also closing the viewer underneath) and keeps the page behind from scrolling.
 */
export default function PostModal({
  title,
  onClose,
  children,
  footer,
  dismissible = true,
  maxWidth = "max-w-md",
}: PostModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopImmediatePropagation();
      if (dismissible) onClose();
    };
    // Capture phase, so this runs before the post viewer's own Escape handler.
    window.addEventListener("keydown", onKey, true);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = previous;
    };
  }, [onClose, dismissible]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
      onMouseDown={(e) => {
        if (dismissible && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full ${maxWidth} max-h-[90vh] flex flex-col bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl border border-[#FFEFE0] overflow-hidden`}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#FFEFE0] shrink-0">
          <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={!dismissible}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#FFF6ED] text-[#E05D24] flex items-center justify-center hover:bg-[#FFEFE0] cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-3 border-t border-[#FFEFE0] shrink-0">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}