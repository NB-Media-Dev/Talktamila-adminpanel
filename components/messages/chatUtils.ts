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

export interface CallLog {
  media: "audio" | "video";
  outcome: "completed" | "missed" | "declined" | "busy";
  seconds: number;
}

/** The body of a "call" message is a small JSON blob written by the backend. */
export function parseCallLog(body: string): CallLog {
  try {
    const o = JSON.parse(body) as Partial<CallLog>;
    return {
      media: o.media === "video" ? "video" : "audio",
      outcome:
        o.outcome === "completed" || o.outcome === "declined" || o.outcome === "busy" ? o.outcome : "missed",
      seconds: typeof o.seconds === "number" && o.seconds > 0 ? Math.floor(o.seconds) : 0,
    };
  } catch {
    return { media: "audio", outcome: "missed", seconds: 0 };
  }
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/** Text for a call entry, from the point of view of the viewer (`isMine` = I made the call). */
export function callSummary(
  body: string,
  isMine: boolean
): { media: "audio" | "video"; title: string; detail: string | null; missed: boolean } {
  const log = parseCallLog(body);
  const kind = log.media === "video" ? "video" : "voice";
  const Kind = log.media === "video" ? "Video" : "Voice";
  switch (log.outcome) {
    case "completed":
      return { media: log.media, title: `${Kind} call`, detail: formatDuration(log.seconds), missed: false };
    case "declined":
      return {
        media: log.media,
        title: isMine ? "Call declined" : "You declined the call",
        detail: null,
        missed: false,
      };
    case "busy":
      return isMine
        ? { media: log.media, title: "Line busy", detail: null, missed: false }
        : { media: log.media, title: `Missed ${kind} call`, detail: null, missed: true };
    default:
      return isMine
        ? { media: log.media, title: "No answer", detail: null, missed: false }
        : { media: log.media, title: `Missed ${kind} call`, detail: null, missed: true };
  }
}

/** Inbox one-liner for the last message in a conversation. */
export function previewText(last: Conversation["last_message"]): string {
  if (last.kind === "call") {
    const c = callSummary(last.body, last.is_mine);
    return c.detail ? `${c.title} · ${c.detail}` : c.title;
  }
  if (last.kind === "story_reaction") {
    return last.is_mine ? `You reacted ${last.body} to their story` : `Reacted ${last.body} to your story`;
  }
  if (last.kind === "story_reply") {
    return last.is_mine ? `You replied to their story: ${last.body}` : `Replied to your story: ${last.body}`;
  }
  return `${last.is_mine ? "You: " : ""}${last.body}`;
}