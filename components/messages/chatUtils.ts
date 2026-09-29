import type { ChatMessage, Conversation, MessageReaction } from "@/types/Messages";

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function clock(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function dayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (sameDay(d, now)) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/** Short time for the inbox list: clock today, weekday this week, else date. */
export function listTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (sameDay(d, now)) return clock(iso);
  const days = (now.getTime() - d.getTime()) / 86_400_000;
  if (days < 7) return d.toLocaleDateString(undefined, { weekday: "short" });
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

/** Keep the first message for each id (pending copies and polled copies can overlap). */
export function dedupe(list: ChatMessage[]): ChatMessage[] {
  const seen = new Set<number>();
  return list.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));
}

export function mergeById(prev: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const seen = new Set(prev.map((m) => m.id));
  const add = incoming.filter((m) => !seen.has(m.id));
  return add.length ? [...prev, ...add] : prev;
}

export function maxRealId(list: ChatMessage[]): number {
  return list.reduce((max, m) => (m.id > max ? m.id : max), 0);
}

export function minRealId(list: ChatMessage[]): number | undefined {
  let min: number | undefined;
  for (const m of list) if (m.id > 0 && (min === undefined || m.id < min)) min = m.id;
  return min;
}

export function sameReactions(a: MessageReaction[], b: MessageReaction[]): boolean {
  return a.length === b.length && a.every((r, i) => r.user_id === b[i].user_id && r.emoji === b[i].emoji);
}

/** One entry per distinct emoji, in first-seen order. `mine` = the current user used it. */
export function groupReactions(
  reactions: MessageReaction[],
  partnerId: number
): { emoji: string; count: number; mine: boolean }[] {
  const groups: { emoji: string; count: number; mine: boolean }[] = [];
  for (const r of reactions) {
    const g = groups.find((x) => x.emoji === r.emoji);
    const mine = r.user_id !== partnerId; // 1:1 chat: anyone who isn't the partner is me
    if (g) {
      g.count += 1;
      g.mine = g.mine || mine;
    } else {
      groups.push({ emoji: r.emoji, count: 1, mine });
    }
  }
  return groups;
}

/** Inbox one-liner for the last message in a conversation. */
export function previewText(last: Conversation["last_message"]): string {
  if (last.kind === "story_reaction") {
    return last.is_mine ? `You reacted ${last.body} to their story` : `Reacted ${last.body} to your story`;
  }
  if (last.kind === "story_reply") {
    return last.is_mine ? `You replied to their story: ${last.body}` : `Replied to your story: ${last.body}`;
  }
  return `${last.is_mine ? "You: " : ""}${last.body}`;
}