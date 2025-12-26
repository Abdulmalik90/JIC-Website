const CACHE_NAME = 'madkhal-app-v3'; // غيرنا الإصدار عشان يحدث الكاش
const ASSETS_TO_CACHE = [
    // شلنا './' لأن ما فيه ملف في الروت، وركزنا على المجلد WepAppPage
    './WepAppPage/index.html',       
    './WepAppPage/style.css',
    './WepAppPage/script.js',
    './WepAppPage/tools.html',
    './WepAppPage/toolstyle.css',
    './WepAppPage/toolsjava.js',
    './WepAppPage/library.html',
    './WepAppPage/libstyle.css',
    './WepAppPage/libscript.js',
    './WepAppPage/news.html',
    './WepAppPage/news-style.css',
    './WepAppPage/news-script.js',
    './WepAppPage/logo.png',
    './WepAppPage/Images/person.png',
    // الروابط الخارجية تبقى كما هي
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
    'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css'
];

// 1. التثبيت
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache for WepAppPage assets');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. التفعيل وتنظيف الكاش القديم
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

// 3. الجلب
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
