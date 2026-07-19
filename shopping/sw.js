const CACHE_NAME = "grupowa-lista-2026.07.19.21";
const APP_SHELL = [
  "./",
  "index.html",
  "style.css",
  "app.js",
  "supabase-config.js",
  "supabase-service.js",
  "manifest.webmanifest",
  "ikon-192.png",
  "ikon-512.png",
  "ikon.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.endsWith("/version.json")) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === "navigate") return caches.match("index.html");
        throw new Error("Brak połączenia i brak pliku w pamięci PWA.");
      })
  );
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data?.json() || {};
  } catch {
    payload = { body: event.data?.text() || "Lista zakupów została zaktualizowana." };
  }
  const options = {
    icon: "ikon-192.png",
    tag: payload.tag || "shopping-list-update",
    renotify: true,
    data: { url: payload.url || "./" }
  };
  if (payload.body) options.body = payload.body;
  event.waitUntil(self.registration.showNotification(payload.title || "Lista Zakupów", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "./", self.location.href).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(async (windows) => {
    const existing = windows.find((client) => new URL(client.url).origin === new URL(targetUrl).origin);
    if (existing) {
      if ("navigate" in existing) await existing.navigate(targetUrl);
      return existing.focus();
    }
    return self.clients.openWindow(targetUrl);
  }));
});
