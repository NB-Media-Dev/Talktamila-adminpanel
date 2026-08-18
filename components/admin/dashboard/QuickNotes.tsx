"use client";

import React, { useState } from "react";
import { File } from "lucide-react";

export default function QuickNotes() {
  const [note, setNote] = useState("");

  return (
    <div className="w-full rounded-[24px] border-2 border-dashed border-[#FFE2C9] p-4.5 bg-[#FFFDFB]/40 hover:bg-[#FFFDFB]/80 hover:border-[#FFCBB0] transition-all duration-300">
  
      <div className="flex items-center gap-2 mb-2">
        <File className="w-4 h-4 text-[#FF6B35]" />
        <h3 className="text-xs sm:text-sm font-bold text-gray-700">
          Quick Notes
        </h3>
      </div>


      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot an idea before it disappears..."
        className="w-full bg-transparent border-0 outline-none text-sm text-gray-600 placeholder-gray-400 resize-none h-14 focus:ring-0 p-0 leading-relaxed"
      />
    </div>
  );
}
