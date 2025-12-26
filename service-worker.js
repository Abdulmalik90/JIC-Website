// 1. **مفتاح الكاش الإجباري (Cache Name)**
// 🚨🚨 قم بتغيير رقم الإصدار (v1.0.1) إلى رقم جديد في كل مرة تحدث فيها ملفات CSS/JS الثابتة.
const CACHE_NAME = 'mySiteStaticCache-v2.0.1';

// قائمة بالملفات الثابتة التي يجب تخزينها فوراً (App Shell).
// 💡 تم استبعاد الصفحة الرئيسية وملفات HTML الديناميكية من هذه القائمة.
const ASSETS_TO_CACHE = [
    './', 
    './WebAppPage/index.html',        // 👈 لازم نذكر اسم المجلد
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
    './WebAppPage/logo.png',          // تأكد وين مكان اللوقو بالضبط
    './WebAppPage/Images/person.png',
    // أضف ملفات CSS و JS الثابتة فقط هنا
];

// اسم الكاش الخاص بالصفحات الديناميكية أو البيانات (اختياري)
const DYNAMIC_CACHE_NAME = 'mySiteDynamicCache';

// ======================================================================
// 🛠️ مرحلة التنصيب (Install Event)
// ======================================================================
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing new version.');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log(`[Service Worker] Caching static assets to ${CACHE_NAME}`);
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('[Service Worker] Static caching failed:', error);
            })
    );
    self.skipWaiting(); 
});

// ======================================================================
// 🧹 مرحلة التفعيل (Activate Event) - تنظيف الكاشات القديمة
// ======================================================================
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating and cleaning old caches.');
    const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE_NAME]; // حافظ على أسماء الكاشات الحديثة

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// ======================================================================
// 🌐 مرحلة الجلب (Fetch Event) - تحديد استراتيجيات الكاش
// ======================================================================
self.addEventListener('fetch', event => {
    
    const requestUrl = new URL(event.request.url);

    // 1. استراتيجية Network First للملفات التي تتحدث باستمرار (مثل HTML)
    // هذا يضمن أن يتم محاولة جلب أحدث نسخة من الشبكة أولاً
    if (event.request.mode === 'navigate' || requestUrl.pathname === '/') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // الرد من الشبكة ناجح، قم بتخزين نسخة احتياطية في الكاش قبل إرجاعها
                    return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
                .catch(() => {
                    // في حال فشل الاتصال بالشبكة (وضع عدم الاتصال)، أعد آخر نسخة محفوظة
                    return caches.match(event.request);
                })
        );
        return; // إنهاء معالجة الطلب
    }


    // 2. استراتيجية Cache First للملفات الثابتة (CSS, JS)
    // هذا يحسن الأداء بجلب الملفات الثابتة فوراً من الكاش
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجد الكاش، أعده فوراً
                if (response) {
                    return response;
                }
                
                // إذا لم يوجد، اذهب إلى الشبكة
                return fetch(event.request);
            })
    );
});
