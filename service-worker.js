const CACHE_NAME = 'madkhal-app-v2'; // غيرنا الرقم عشان يجبر المتصفح يحدث
const ASSETS_TO_CACHE = [
    // لاحظ: شلنا './' لأن ما عندك صفحة رئيسية في الروت
    './WebAppPage/index.html',       
    './WebAppPage/style.css',
    './WebAppPage/script.js',
    './WebAppPage/tools.html',
    './WebAppPage/toolstyle.css',
    './WebAppPage/toolsjava.js',
    './WebAppPage/library.html',
    './WebAppPage/libstyle.css',
    './WebAppPage/libscript.js',
    './WebAppPage/news.html',
    './WebAppPage/news-style.css',
    './WebAppPage/news-script.js',
    './WebAppPage/logo.png',
    './WebAppPage/Images/person.png',
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
    'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css'
];

// 1. التثبيت
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. التفعيل وتنظيف القديم
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

// 3. جلب البيانات (الشبكة أولاً، ثم الكاش)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
