"use client";

import React from "react";

const TOKEN = /([#@][\p{L}\p{M}\p{N}_]+(?:\.[\p{L}\p{M}\p{N}_]+)*)/gu;

/** Shows #hashtags and @mentions in colour. Everything else stays plain text. */
export default function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-[#FF6B35] font-semibold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}