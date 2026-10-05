import { apiClient, getBaseUrl } from "@/services/api-client";

/**
 * Instagram-style message notifications (Web Push).
 *
 * Flow: the person taps "Turn on" -> the browser asks permission -> we register
 * /sw.js -> the browser gives us a private address -> we send it to the backend.
 * From then on the backend pushes a notification whenever a chat message arrives.
 */

const ENDPOINT_KEY = "tt_push_endpoint";
const DISMISSED_KEY = "tt_push_prompt_dismissed_at";
const DISABLED_KEY = "tt_push_disabled_by_user"; // set when the person switches notifications off in Settings
const ASK_AGAIN_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

/** This browser's own notification address (sent with every message so we are not notified of our own messages). */
export function getStoredPushEndpoint(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ENDPOINT_KEY);
  } catch {
    return null;
  }
}

export type EnableResult = "on" | "blocked" | "unavailable" | "unsupported" | "error";

export function pushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

function keyToBytes(base64Url: string): Uint8Array {
  const padded = base64Url + "=".repeat((4 - (base64Url.length % 4)) % 4);
  const raw = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

function bytesToKey(buf: ArrayBuffer | null): string {
  if (!buf) return "";
  let s = "";
  new Uint8Array(buf).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function fetchServerKey(): Promise<{ enabled: boolean; public_key: string }> {
  return apiClient<{ enabled: boolean; public_key: string }>("/api/v1/messages/push/public-key", {
    method: "GET",
  });
}

/** Registers this browser with the backend for the person who is logged in right now. */
async function registerThisBrowser(publicKey: string): Promise<void> {
  await navigator.serviceWorker.register("/sw.js");
  const reg = await navigator.serviceWorker.ready;

  let sub = await reg.pushManager.getSubscription();
  // The server keys changed since this browser subscribed -> start fresh.
  if (sub && bytesToKey(sub.options.applicationServerKey) !== publicKey) {
    await sub.unsubscribe();
    sub = null;
  }
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: keyToBytes(publicKey).buffer as ArrayBuffer,
    });
  }

  const json = sub.toJSON();
  await apiClient("/api/v1/messages/push/subscribe", {
    method: "POST",
    body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
  });
  try {
    localStorage.setItem(ENDPOINT_KEY, sub.endpoint);
  } catch {
    /* private mode: logout cleanup is then best-effort */
  }
}

/**
 * Call after login / on every page load. If the person already allowed notifications,
 * this keeps this browser attached to whoever is logged in now. Never asks anything.
 */
export async function syncPushIfAllowed(): Promise<void> {
  if (!pushSupported() || Notification.permission !== "granted") return;
  if (isDisabledByUser()) return; // they switched it off in Settings: do not quietly turn it back on
  try {
    const server = await fetchServerKey();
    if (server.enabled && server.public_key) await registerThisBrowser(server.public_key);
  } catch (err) {
    console.warn("Could not refresh message notifications", err);
  }
}

/** Only ask when it can work: supported, not decided yet, switched on in the backend. */
export async function shouldShowPrompt(): Promise<boolean> {
  if (!pushSupported() || Notification.permission !== "default") return false;
  try {
    const last = Number(localStorage.getItem(DISMISSED_KEY) || 0);
    if (last && Date.now() - last < ASK_AGAIN_AFTER_MS) return false;
  } catch {
    /* ignore */
  }
  try {
    return (await fetchServerKey()).enabled;
  } catch {
    return false;
  }
}

export function dismissPrompt(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

/** The "Turn on" button. Must run from a tap, because browsers require that. */
export async function enablePush(): Promise<EnableResult> {
  if (!pushSupported()) return "unsupported";
  try {
    localStorage.removeItem(DISABLED_KEY);
  } catch {
    /* ignore */
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === "denied") return "blocked";
    if (permission !== "granted") return "error";
    const server = await fetchServerKey();
    if (!server.enabled || !server.public_key) return "unavailable";
    await registerThisBrowser(server.public_key);
    return "on";
  } catch (err) {
    console.error("Could not turn on message notifications", err);
    return "error";
  }
}

function isDisabledByUser(): boolean {
  try {
    return localStorage.getItem(DISABLED_KEY) === "1";
  } catch {
    return false;
  }
}

export type PushStatus = "unsupported" | "blocked" | "unavailable" | "on" | "off";

async function currentSubscription(): Promise<PushSubscription | null> {
  const reg = await navigator.serviceWorker.getRegistration();
  return reg ? await reg.pushManager.getSubscription() : null;
}

/** What the Settings switch should show for THIS browser. */
export async function getPushStatus(): Promise<PushStatus> {
  if (!pushSupported()) return "unsupported";
  if (Notification.permission === "denied") return "blocked";
  try {
    const server = await fetchServerKey();
    if (!server.enabled || !server.public_key) return "unavailable";
  } catch {
    return "unavailable";
  }
  if (Notification.permission !== "granted" || isDisabledByUser()) return "off";
  try {
    let sub = await currentSubscription();
    if (!sub) {
      await syncPushIfAllowed(); // page just loaded: let it finish registering
      sub = await currentSubscription();
    }
    return sub ? "on" : "off";
  } catch {
    return "off";
  }
}

/** The Settings switch turned OFF: forget this browser on the server and in the browser. */
export async function disablePush(): Promise<boolean> {
  try {
    localStorage.setItem(DISABLED_KEY, "1");
  } catch {
    /* ignore */
  }
  try {
    const sub = await currentSubscription();
    if (sub) {
      try {
        await apiClient("/api/v1/messages/push/unsubscribe", {
          method: "POST",
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
      } catch {
        /* the server forgets a dead address on its own the next time it tries it */
      }
      await sub.unsubscribe();
    }
    try {
      localStorage.removeItem(ENDPOINT_KEY);
    } catch {
      /* ignore */
    }
    return true;
  } catch (err) {
    console.error("Could not turn off message notifications", err);
    return false;
  }
}

/**
 * Logout: tell the backend to stop sending this person's messages to this browser.
 * Uses sendBeacon so it still goes out while the page is being left.
 */
export function forgetPushOnLogout(): void {
  if (typeof window === "undefined") return;
  let endpoint: string | null = null;
  try {
    endpoint = localStorage.getItem(ENDPOINT_KEY);
    localStorage.removeItem(ENDPOINT_KEY);
  } catch {
    return;
  }
  if (!endpoint) return;

  const url = `${getBaseUrl()}/api/v1/messages/push/unsubscribe`;
  const body = JSON.stringify({ endpoint });
  try {
    // text/plain keeps this a "simple" request, so the browser sends it with no pre-check.
    const queued = navigator.sendBeacon?.(url, new Blob([body], { type: "text/plain" }));
    if (!queued) void fetch(url, { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {
    /* best effort */
  }
}