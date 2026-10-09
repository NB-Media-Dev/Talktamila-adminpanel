// Tiny "message bus" so the bottom Home button can talk to the feed
// without the two components knowing about each other.

export const FEED_REFRESH_EVENT = "tt:feed-refresh";
export const FEED_SCROLL_TOP_EVENT = "tt:feed-scroll-top";

export function emitFeedRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FEED_REFRESH_EVENT));
}

export function emitFeedScrollTop() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FEED_SCROLL_TOP_EVENT));
}

export function onFeedRefresh(cb: () => void) {
  window.addEventListener(FEED_REFRESH_EVENT, cb);
  return () => window.removeEventListener(FEED_REFRESH_EVENT, cb);
}

export function onFeedScrollTop(cb: () => void) {
  window.addEventListener(FEED_SCROLL_TOP_EVENT, cb);
  return () => window.removeEventListener(FEED_SCROLL_TOP_EVENT, cb);
}