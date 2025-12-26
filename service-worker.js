const CACHE_NAME = 'madkhal-app-v4-final'; 
const ASSETS_TO_CACHE = [
    // القائمة الصحيحة بناءً على مجلد GitHub
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
    './WebAppPage/logo.png', // تأكد إن اللوقو هنا أو داخل icons
    './WebAppPage/Images/person.png',
    
    // الخطوط والأيقونات الخارجية
    'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
    'https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css'
];

// 1. التثبيت
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache for WebAppPage');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. التفعيل وتنظيف القديم (ضروري جداً الآن)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache); // احذف أي كاش قديم
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
