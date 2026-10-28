/* Bump VERSION whenever a bundled asset changes before deployment. */
const VERSION = "2026-10-28-guide-v4";
const APP_FILES = [
  "./index.html",
  "./styles.css",
  "./schedule.css",
  "./guide.css",
  "./app.js",
  "./ui/schedule.js",
  "./ui/preparation.js",
  "./data/events.js",
  "./data/stages.js",
  "./data/activities.js",
  "./data/summary.js",
  "./data/apps.js",
  "./data/transport.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./fonts/guide-serif-zh.woff",
  "./fonts/guide-serif-ja.woff",
  "./assets/maps/aeon.c1bab500.jpg",
  "./assets/maps/messe_entire.f6fe34fd.jpg",
  "./assets/maps/messe_hall1-3.0be2c736.jpg",
  "./assets/maps/messe_hall4-6.66cd19f4.jpg",
  "./assets/maps/messe_hall7.ea20eeaa.jpg",
  "./assets/maps/toyosuna.07bce888.jpg",
  "./assets/summary/README.md",
  "./assets/summary/summary-ja.html",
  "./assets/summary/summary-ja.png",
  "./assets/summary/summary-zh.html",
  "./assets/summary/summary-zh.png",
];
const SCOPE = self.registration.scope;
const CACHE_PREFIX = `fanfest-guide:${SCOPE}:`;
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;
const urls = APP_FILES.map((path) => new URL(path, SCOPE).href);

async function cacheStatus() {
  const cache = await caches.open(CACHE_NAME);
  const entries = await Promise.all(urls.map((url) => cache.match(url)));
  return {
    type: "CACHE_READY",
    ready: entries.every(Boolean),
    version: VERSION,
    files: urls.length,
  };
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // addAll rejects if any required file fails; an incomplete download never
      // activates and therefore cannot advertise offline readiness.
      await cache.addAll(
        urls.map((url) => new Request(url, { cache: "reload" })),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(
            (name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME,
          )
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
      const status = await cacheStatus();
      for (const client of await self.clients.matchAll({ type: "window" }))
        client.postMessage(status);
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_STATUS") return;
  event.waitUntil(
    cacheStatus().then((status) => {
      if (event.ports[0]) event.ports[0].postMessage(status);
      else event.source?.postMessage(status);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requested = new URL(event.request.url);
  if (!requested.href.startsWith(SCOPE)) return;
  requested.search = "";
  requested.hash = "";
  const normalized =
    requested.href === SCOPE
      ? new URL("./index.html", SCOPE).href
      : requested.href;
  if (!urls.includes(normalized)) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(normalized);
      return cached || fetch(event.request);
    })(),
  );
});
