"use client";

import React from "react";
import { FileText, ArrowRight } from "lucide-react";
import QuickNotes from "./QuickNotes";

interface DraftItem {
  id: number;
  title: string;
  type: string;
  time: string;
}

export default function SavedDrafts() {
  const drafts: DraftItem[] = [
    {
      id: 1,
      title: "Metro Phase II explainer",
      type: "Reel",
      time: "12m ago",
    },
    {
      id: 2,
      title: "Madurai food trail",
      type: "Carousel",
      time: "1h ago",
    },
    {
      id: 3,
      title: "Budget breakdown",
      type: "Article",
      time: "Yesterday",
    },
  ];

  return (
    <div className="w-full bg-white rounded-[32px] p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#FFEFE0] flex flex-col gap-4">
   
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FFF2EC] text-[#FF5A26]">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            Saved Drafts
          </h2>
        </div>
        <a
          href="#"
          className="text-xs sm:text-sm font-semibold text-[#FF6B35] hover:text-[#D9652B] transition-colors duration-200"
        >
          Open
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {drafts.map((item) => (
          <div
            key={item.id}
            className="w-full bg-[#FFF9F2] hover:bg-[#FDF0E2] transition-all duration-200 rounded-[20px] px-4.5 py-3.5 flex items-center justify-between cursor-pointer group hover:shadow-sm"
          >
            <div className="flex flex-col">
              <span className="text-sm  text-gray-800 group-hover:text-[#FF6B35] transition-colors duration-200">
                {item.title}
              </span>
              <span className="text-xs text-gray-400 mt-0.5 ">
                {item.type} • {item.time}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#FF6B35] transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        ))}
      </div>

      <div className="mt-1">
        <QuickNotes />
      </div>
    </div>
  );
}
