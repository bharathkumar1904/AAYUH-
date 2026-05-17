const CACHE_NAME = "aayuh-cache-v1";
const urlsToCache = [
  "index.html",
  "home.html",
  "dashboard.html",
  "manifest.json",
  "icons/icon-192x192.png",
  "icons/icon-512x512.png"
];

// Install Service Worker and Cache Files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
  console.log("Service Worker installed ✅");
});

// Activate Service Worker
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME)
      .map(key => caches.delete(key)))
    )
  );
  console.log("Service Worker activated ✅");
});

// Fetch Cached Files
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
