"use client";
import React, { useState, useEffect } from 'react';
import { X, Heart, MessageSquare, Layers, AtSign, UserPlus, Tv } from 'lucide-react';
import avatar4 from "@/public/Images/avatar4.png";
import avatar5 from "@/public/Images/avatar5.png";
import movie from "@/public/Images/maduari.webp";
import Image, { StaticImageData } from "next/image";

interface SocialNotification {
  id: string;
  type: 'like' | 'comment' | 'story';
  user: string;
  avatar: StaticImageData;
  timestamp: string;
  commentText?: string;
  storyPreview?: string | StaticImageData;  
}

const TALK_TAMILA_NOTIFICATIONS: SocialNotification[] = [
  {
    id: "notif_1",
    type: "story",
    user: "Sarah J.",
    avatar: avatar4,
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    storyPreview: movie
  },
  {
    id: "notif_2",
    type: "comment",
    user: "Alex Rivera",
    avatar: avatar5,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    commentText: "சென்னை கடற்கரை புதிய மெட்ரோ திட்டம் சூப்பர்! 🚇🔥"
  },
  {
    id: "notif_3",
    type: "like",
    user: "Ammar_Design",
    avatar: avatar4,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  }
];

interface NotificationBoxProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAllClick?: () => void;
}

function formatRelativeTime(isoString: string): string {
  const now = new Date();
  const past = new Date(isoString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function TalkTamilaNotifications({ isOpen, onClose, onViewAllClick }: NotificationBoxProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'mentions' | 'requests'>('all');
  const [notifications, setNotifications] = useState<SocialNotification[]>(TALK_TAMILA_NOTIFICATIONS);
  const [removingIds, setRemovingIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemove = (id: string) => {
    setRemovingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setRemovingIds((prev) => prev.filter((item) => item !== id));
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute -right-3 top-[80px] w-[360px] sm:w-[400px] bg-white rounded-[24px] border border-orange-100 shadow-[0_20px_50px_rgba(249,115,22,0.14)] z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
      
      {/* Header Block Panel */}
      <div className="p-4 pb-2 flex items-center justify-between border-b border-orange-50/60 bg-gradient-to-b from-orange-50/30 to-transparent">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide">Recent Updates</h2>
        <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Pill Filters */}
      <div className="px-4 py-2.5 flex gap-1.5 bg-white border-b border-gray-50">
        <button onClick={() => setActiveTab('all')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'all' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/10' : 'text-gray-500 hover:bg-gray-50'}`}>
          <Layers className="w-3.5 h-3.5" /> All
        </button>
        <button onClick={() => setActiveTab('mentions')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'mentions' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/10' : 'text-gray-500 hover:bg-gray-50'}`}>
          <AtSign className="w-3.5 h-3.5" /> Mentions
        </button>
        <button onClick={() => setActiveTab('requests')} className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${activeTab === 'requests' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/10' : 'text-gray-500 hover:bg-gray-50'}`}>
          <UserPlus className="w-3.5 h-3.5" /> Requests
        </button>
      </div>

      {/* Feed Scroller Area */}
      <div className="max-h-[320px] overflow-y-auto divide-y divide-orange-50/30 overflow-x-hidden bg-gray-50/20">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs italic">No activity logs found.</div>
        ) : (
          notifications.map((notif) => {
            const isRemoving = removingIds.includes(notif.id);

            return (
              <div 
                key={notif.id} 
                className={`p-4 flex gap-3 hover:bg-orange-50/10 relative group transition-all duration-300 ease-in-out ${
                  isRemoving ? 'translate-x-full opacity-0 max-h-0 p-0 border-none overflow-hidden' : 'translate-x-0 opacity-100'
                }`}
              >
                {/* 1. Left Avatar Layout */}
                <div className="relative flex-shrink-0 w-10 h-10">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative border border-orange-100/60 shadow-sm">
                    <Image src={notif.avatar} alt={notif.user} fill sizes="40px" className="object-cover" />
                  </div>
                  
                  <div className="absolute -bottom-1 -right-1 rounded-md p-0.5 bg-white shadow-sm ring-1 ring-orange-50 z-10">
                    {notif.type === 'story' && <Tv className="w-2.5 h-2.5 text-amber-500" />}
                    {notif.type === 'comment' && <MessageSquare className="w-2.5 h-2.5 text-orange-500 fill-orange-50/20" />}
                    {notif.type === 'like' && <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />}
                  </div>
                </div>

                {/* 2. Middle Content Description */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-xs text-gray-600 leading-normal flex-1">
                      <span className="font-bold text-gray-900">@{notif.user.toLowerCase().replace(" ", "")}</span>{' '}
                      {notif.type === 'story' && 'shared a new update to Today\'s Stories'}
                      {notif.type === 'comment' && 'commented on your timeline update'}
                      {notif.type === 'like' && 'liked your trending post'}
                    </p>
                    
                    <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                      {isMounted && (
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {formatRelativeTime(notif.timestamp)}
                        </span>
                      )}
                      
                      <button
                        onClick={() => handleRemove(notif.id)}
                        className="p-0.5 rounded-md text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 ease-in-out opacity-0 max-w-0 scale-75 pointer-events-none group-hover:opacity-100 group-hover:max-w-[20px] group-hover:scale-100 group-hover:pointer-events-auto"
                        aria-label="Remove item"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {notif.type === 'comment' && notif.commentText && (
                    <p className="mt-2 p-2 bg-white rounded-xl text-xs text-gray-700 border border-orange-100/50 font-medium break-words leading-relaxed shadow-sm">
                      {notif.commentText}
                    </p>
                  )}
                </div>

                {/* 3. Right Native Next.js Image Thumbnail Preview */}
                {notif.type === 'story' && notif.storyPreview && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative flex-shrink-0 border border-orange-100/50 shadow-sm">
                    <Image 
                      src={notif.storyPreview} 
                      alt="Story preview" 
                      fill 
                      sizes="40px" 
                      className="object-cover"
                    />
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Footer View All Action */}
      <div className="p-3 bg-gradient-to-t from-orange-50/20 to-white border-t border-gray-50 text-center">
        <button 
          onClick={() => {
            onClose();
            if (onViewAllClick) onViewAllClick();
          }}
          className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors tracking-wide py-1 px-4 inline-block hover:underline underline-offset-4"
        >
          View all notifications
        </button>
      </div>

    </div>
  );
}
