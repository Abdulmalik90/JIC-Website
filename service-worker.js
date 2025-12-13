// 1. **مفتاح الكاش الإجباري (Cache Name)**
// 🚨🚨 هام: قم بتغيير رقم الإصدار (v1.0.0) إلى رقم جديد (مثل v1.0.1) في كل مرة تحدث فيها الموقع.
// هذا التغيير هو ما يجبر الـ Service Worker على التنصيب مجدداً وحذف الكاش القديم.
const CACHE_NAME = 'mySiteStaticCache-v2.0.0';

// قائمة بالملفات الثابتة الأساسية التي يجب تخزينها فوراً عند التنصيب
const ASSETS_TO_CACHE = [
    '/', // الصفحة الرئيسية
    '/index.html',
    '/mainstyle.css',
    '/script.js',
    '/404.html' // مثال لملف صورة
    // أضف جميع ملفاتك الأساسية هنا
];

// ======================================================================
// 🛠️ مرحلة التنصيب (Install Event)
// ======================================================================
// يتم تشغيل هذا الحدث مرة واحدة عند تسجيل الـ SW لأول مرة أو عند تغيير CACHE_NAME.
self.addEventListener('install', event => {
    console.log('[Service Worker] Install Event: New version is installing.');
    // انتظار الانتهاء من تخزين جميع الملفات الأساسية في الكاش الجديد
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log(`[Service Worker] Caching shell assets to ${CACHE_NAME}`);
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('[Service Worker] Caching failed:', error);
            })
    );
    // إجبار الـ SW الجديد على الانتقال فوراً إلى مرحلة التفعيل دون انتظار إغلاق الصفحات القديمة (اختياري)
    self.skipWaiting(); 
});

// ======================================================================
// 🧹 مرحلة التفعيل (Activate Event) - تنظيف الكاشات القديمة
// ======================================================================
// يتم تشغيل هذا الحدث بعد التنصيب بنجاح، ومهمته الأساسية هي إزالة الكاشات القديمة.
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate Event: Cleaning up old caches.');
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        // جلب جميع أسماء الكاشات المخزنة حالياً
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // إذا كان اسم الكاش لا يطابق اسم الكاش الجديد، فقم بحذفه
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        // التأكد من أن الـ SW الجديد يسيطر فوراً على جميع الصفحات المفتوحة
        .then(() => self.clients.claim())
    );
});

// ======================================================================
// 🌐 مرحلة الجلب (Fetch Event) - تحديد استراتيجيات الكاش
// ======================================================================
self.addEventListener('fetch', event => {
    // تجاهل الطلبات التي ليست HTTP (مثل chrome-extension://)
    if (!event.request.url.startsWith('http')) return;
    
    // استراتيجية للملفات الأساسية (Cache then Network fallback)
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجد الكاش، أعده فوراً
                if (response) {
                    return response;
                }
                
                // إذا لم يوجد، اذهب إلى الشبكة
                return fetch(event.request).catch(error => {
                    console.error('[Service Worker] Fetch failed; returning offline page if available.', error);
                    // يمكنك هنا إرجاع صفحة "أنت غير متصل" (Offline Page) إذا كان الطلب للصفحة الرئيسية
                });
            })
    );
});
