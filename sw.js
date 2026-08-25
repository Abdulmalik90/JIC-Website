const CACHE_NAME = 'madkhal-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/WebAppPage/index.html',
  '/manifest.json',
  '/Images/apple-touch-icon.png',
  '/Images/favicon-32x32.png',
  '/Images/favicon-16x16.png',
  '/Images/favicon.ico',
  '/Images/favicon.svg',
  '/Images/web-app-manifest-192x192.png',
  '/Images/web-app-manifest-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
