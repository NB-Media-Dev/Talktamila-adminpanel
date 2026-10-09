import { useSyncExternalStore } from "react";
import type { PostType } from "@/types/Posts";

// thought written in the Share Your Thoughts card (stays in the browser, not sent anywhere)
export interface Thought {
  kind: PostType; // text | image | video | gif | poll
  text: string;
  // image / video picked by the user
  file?: File;
  // preview url for the file
  mediaUrl?: string;
  gifUrl?: string;
  pollOptions?: string[];
}

export type ThoughtInput = Omit<Thought, "mediaUrl">;

let current: Thought | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function saveThought(input: ThoughtInput): void {
  if (current?.mediaUrl) URL.revokeObjectURL(current.mediaUrl);
  current = { ...input, mediaUrl: input.file ? URL.createObjectURL(input.file) : undefined };
  emit();
}

export function clearThought(): void {
  if (current?.mediaUrl) URL.revokeObjectURL(current.mediaUrl);
  current = null;
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useThought(): Thought | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null
  );
}