/* Talk Tamila - message notifications (service worker).
 *
 * The browser wakes this file up when the server pushes a notification, even when
 * the website is closed. It shows "Name: message" like Instagram, and opens that chat
 * when you tap it.
 */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Talk Tamila";
  const options = {
    body: data.body || "You have a new message",
    icon: data.icon || "/icons/icon-192.png",
    badge: data.badge || "/icons/badge-96.png",
    // Same tag = a newer message from the same person replaces the older pop-up.
    tag: data.tag || "tt-message",
    renotify: true,
    data: { url: data.url || "/" },
  };

  event.waitUntil(
    (async () => {
      // If you are looking at the app right now, skip the pop-up (the red dot is enough).
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const lookingAtApp = windows.some((w) => w.visibilityState === "visible" && w.focused);
      if (lookingAtApp) return;
      await self.registration.showNotification(title, options);
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || "/", self.location.origin).href;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const w of windows) {
        if (new URL(w.url).origin !== self.location.origin) continue;
        try {
          await w.focus();
          if ("navigate" in w) await w.navigate(target);
          return;
        } catch (e) {
          /* try the next window, or open a new one */
        }
      }
      await self.clients.openWindow(target);
    })()
  );
});