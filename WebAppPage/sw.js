const CACHE_NAME = 'madkhal-app-v9';

const ASSETS_TO_CACHE = [
  '/WebAppPage/',
  '/WebAppPage/index.html',

  '/WebAppPage/style.css',
  '/WebAppPage/script.js',

  '/WebAppPage/tools.html',
  '/WebAppPage/toolstyle.css',
  '/WebAppPage/toolsjava.js',

  '/WebAppPage/library.html',
  '/WebAppPage/libstyle.css',
  '/WebAppPage/libscript.js',

  '/WebAppPage/news.html',
  '/WebAppPage/news-style.css',
  '/WebAppPage/news-script.js',

  '/WebAppPage/logo.png',
  '/WebAppPage/Images/person.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
