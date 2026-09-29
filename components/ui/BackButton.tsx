"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

type Props = {
  fallbackHref?: string; // used if the user opened this page directly (no history)
  label?: string;
  className?: string;
};

export default function BackButton({
  fallbackHref = "/",
  label = "Back",
  className = "",
}: Props) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back(); // real "back", like Instagram
    } else {
      router.replace(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      className={`inline-flex h-10 items-center gap-1 rounded-full px-2 text-sm text-white/90 active:bg-white/10 ${className}`}
    >
      <ChevronLeft className="h-6 w-6" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}