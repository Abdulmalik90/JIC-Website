const CACHE_NAME = 'madkhal-app-v8-local';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './tools.html',
    './toolstyle.css',
    './toolsjava.js',
    './library.html',
    './libstyle.css',
    './libscript.js',
    './news.html',
    './news-style.css',
    './news-script.js',
    './logo.png',
    './Images/person.png',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
    'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
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
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
