"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { messageService } from "@/services/message.service";
import { useMessagesBase } from "@/hooks/useMessagesBase";

/** Navbar chat button with an unread badge. Pass the same classes the old button used. */
export default function MessageButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const base = useMessagesBase();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let alive = true;
    const check = async () => {
      if (document.hidden) return;
      try {
        const s = await messageService.summary();
        if (alive) setUnread(s.unread_conversations);
      } catch {
        /* badge is best-effort */
      }
    };
    check();
    const id = setInterval(check, 15000);
    document.addEventListener("visibilitychange", check);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", check);
    };
  }, [pathname]);

  return (
    <button
      type="button"
      onClick={() => router.push(base)}
      title="Messages"
      aria-label={unread > 0 ? `Messages, ${unread} unread` : "Messages"}
      className={`relative active:scale-95 transition-all ${className}`}
    >
      <MessageCircle className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.8} />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold leading-4 text-center">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}