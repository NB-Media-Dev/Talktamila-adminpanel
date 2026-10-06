"use client";

import { Suspense } from "react";
import MessagesView from "./MessagesView";

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-5xl mx-auto h-[60dvh] rounded-[32px] bg-orange-100/40 animate-pulse" />}>
      <MessagesView />
    </Suspense>
  );
}