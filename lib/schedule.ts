import { postService } from "@/services/post.service";
import type { Post } from "@/types/Posts";

// The server accepts 1 minute to 365 days ahead. We stay a little inside that.
export const MIN_LEAD_MINUTES = 2;
export const MAX_LEAD_DAYS = 364;

const pad = (n: number) => String(n).padStart(2, "0");

/** Date -> value for <input type="datetime-local"> (local time, no timezone). */
export function toLocalInputValue(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** The earliest time the picker should allow (changes every call, so call it when rendering). */
export function minLocalInput(): string {
  return toLocalInputValue(new Date(Date.now() + MIN_LEAD_MINUTES * 60_000));
}

export function maxLocalInput(): string {
  return toLocalInputValue(new Date(Date.now() + MAX_LEAD_DAYS * 24 * 60 * 60_000));
}

/** Returns an error message, or null when the chosen time is allowed. */
export function validateLocalInput(value: string): string | null {
  if (!value) return "Pick a date and time first.";
  const when = new Date(value);
  if (Number.isNaN(when.getTime())) return "That date and time is not valid.";
  if (when.getTime() < Date.now() + 65_000) {
    return "That time has already passed. Pick a time a couple of minutes from now or later.";
  }
  if (when.getTime() > Date.now() + 365 * 24 * 60 * 60_000) {
    return "Posts can be scheduled at most 365 days ahead.";
  }
  return null;
}

/** "2026-10-10T18:30" (what the person picked, in their time) -> ISO string with Z for the server. */
export function localInputToIso(value: string): string {
  return new Date(value).toISOString();
}

/** ISO string from the server -> value for the picker, never earlier than the allowed minimum. */
export function isoToLocalInput(iso?: string | null): string {
  const min = minLocalInput();
  if (!iso) return min;
  const local = toLocalInputValue(new Date(iso));
  return local < min ? min : local;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function endOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
}

/** "2026-10-08" in the person's local time. Used to match posts to calendar cells. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return dayKey(a) === dayKey(b);
}

/** "Today, 09:30 AM" / "Tomorrow, 02:00 PM" / "Oct 21, 10:00 AM" */
export function formatWhen(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const time = d
    .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
    .toUpperCase();
  const dayDiff = Math.round((startOfDay(d).getTime() - startOfDay(new Date()).getTime()) / 86_400_000);
  if (dayDiff === 0) return `Today, ${time}`;
  if (dayDiff === 1) return `Tomorrow, ${time}`;
  const sameYear = d.getFullYear() === new Date().getFullYear();
  const date = d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  });
  return `${date}, ${time}`;
}

/** Loads every scheduled post in a time range (the server returns at most 100 per request). */
export async function fetchAllScheduled(from?: Date, to?: Date): Promise<Post[]> {
  const all: Post[] = [];
  const pageSize = 100;
  for (let page = 0; page < 5; page++) {
    const res = await postService.getScheduled({
      limit: pageSize,
      offset: page * pageSize,
      fromAt: from?.toISOString(),
      toAt: to?.toISOString(),
    });
    all.push(...res.items);
    if (all.length >= res.total || res.items.length === 0) break;
  }
  return all;
}

export function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Something went wrong. Please try again.";
}