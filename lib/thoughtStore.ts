import { useSyncExternalStore } from "react";
import type { PostType } from "@/types/Posts";

/**
 * The thought / photo / video / poll the user wrote in the "Share Your Thoughts" card.
 * It stays in the card - nothing is sent to the server and nothing appears in the feed.
 *
 * It lives here (not inside the card) because the dashboard mounts the card more than once
 * (one per screen size) and every copy must show the same thing. It is kept while the user moves
 * between pages, and cleared when the page is refreshed.
 */
export interface Thought {
  kind: PostType; // text | image | video | gif | poll
  text: string;
  /** image / video the user picked */
  file?: File;
  /** browser-local preview address for `file` (created and freed by this store) */
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