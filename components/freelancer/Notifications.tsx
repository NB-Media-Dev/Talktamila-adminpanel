"use client";

import React, { useState } from "react";

export interface NotificationItem {
  id: string;
  title: string;
  time: string;
  unread?: boolean;
}

export interface NotificationsProps {
  title?: string;
  markReadText?: string;
  notifications?: NotificationItem[];
  onMarkRead?: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  className?: string;
}

const defaultNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "New reel approved: IPL 2024 Highlights",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    title: "You earned ₹156.80 from impressions",
    time: "15m ago",
    unread: false,
  },
];

export default function Notifications({
  title = "Notifications",
  markReadText = "Mark Read",
  notifications: initialNotifications,
  onMarkRead,
  onNotificationClick,
  className = "",
}: NotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    initialNotifications || defaultNotifications
  );

  const handleMarkAllRead = () => {
    if (onMarkRead) {
      onMarkRead();
    } else {
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, unread: false }))
      );
    }
  };

  return (
    <div
      className={`w-full max-w-sm bg-white rounded-[28px] p-4 sm:p-6 border border-gray-100/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] select-none ${className}`}
    >
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </h3>
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="text-xs sm:text-sm font-semibold text-[#B84218] hover:text-[#9A3412] active:scale-95 transition-all cursor-pointer"
        >
          {markReadText}
        </button>
      </div>

      
      <div className="flex flex-col gap-4">
        {notifications.map((item) => (
          <div
            key={item.id}
            onClick={() => onNotificationClick?.(item)}
            className="flex items-start gap-2.5 group cursor-pointer"
          >
            
            <div className="pt-1.5 shrink-0 w-2.5 flex justify-center">
              {item.unread ? (
                <span className="w-2 h-2 rounded-full bg-[#B84218] inline-block transition-transform group-hover:scale-125" />
              ) : (
                <span className="w-2 h-2 inline-block" />
              )}
            </div>

          
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-gray-900 transition-colors">
                {item.title}
              </p>
              <span className="text-xs text-gray-400 font-normal mt-0.5 block">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
