/* Bump VERSION whenever a bundled asset changes before deployment. */
const VERSION = "2026-10-28-goods-v5";
const APP_FILES = [
  "./index.html",
  "./styles.css",
  "./schedule.css",
  "./guide.css",
  "./goods.css",
  "./app.js",
  "./ui/schedule.js",
  "./ui/preparation.js",
  "./ui/goods.js",
  "./data/events.js",
  "./data/stages.js",
  "./data/activities.js",
  "./data/summary.js",
  "./data/apps.js",
  "./data/transport.js",
  "./data/goods.js",
  "./data/goods-catalog.js",
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
  "./assets/goods/calendar-set.webp",
  "./assets/goods/eorzea-travel-guide.webp",
  "./assets/goods/fanfest-pamphlet.webp",
  "./assets/goods/ffxiv-bomber-jacket.webp",
  "./assets/goods/ffxiv-calyx-plush.webp",
  "./assets/goods/ffxiv-clear-keychain-elidibus-crystal.webp",
  "./assets/goods/ffxiv-clear-keychain-fandaniel-crystal.webp",
  "./assets/goods/ffxiv-eau-de-toilette.webp",
  "./assets/goods/ffxiv-energy-drink-gummy-gg.webp",
  "./assets/goods/ffxiv-fake-leather-charm-moogle.webp",
  "./assets/goods/ffxiv-fanfest2026-muffler-towel.webp",
  "./assets/goods/ffxiv-fat-chocobo-curry.webp",
  "./assets/goods/ffxiv-glass-plate-collection-vol1.webp",
  "./assets/goods/ffxiv-karuta-vol1.webp",
  "./assets/goods/ffxiv-living-memory-stole.webp",
  "./assets/goods/ffxiv-mini-puppet-plush-collection-vol3.webp",
  "./assets/goods/ffxiv-miniature-figure-collection-vol3.webp",
  "./assets/goods/ffxiv-moogle-pen-light.webp",
  "./assets/goods/ffxiv-neon-light-moogle.webp",
  "./assets/goods/ffxiv-neon-parasol.webp",
  "./assets/goods/ffxiv-orgel-living-memory.webp",
  "./assets/goods/ffxiv-plush-alpaca.webp",
  "./assets/goods/ffxiv-rubber-magnet-collection-vol3.webp",
  "./assets/goods/ffxiv-silver-earrings-emet-selch.webp",
  "./assets/goods/ffxiv-sticky-notes-field-marker.webp",
  "./assets/goods/ffxiv-t-shirt-souvenir-of-strayborough.webp",
  "./assets/goods/ffxiv-usowoso-backpack.webp",
  "./assets/goods/lit-baff-apt-pullover-hoodie.webp",
  "./assets/goods/lit-baff-apt-sweatshirt.webp",
  "./assets/goods/lit-baff-apt-t-shirt.webp",
  "./assets/goods/music-piano-arrange.webp",
  "./assets/goods/music-pulse3.webp",
  "./assets/goods/postcard-book-2.webp",
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
