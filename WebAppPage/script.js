document.addEventListener("DOMContentLoaded", () => {
    
    /* =========================================
   إخفاء شاشة التحميل عند اكتمال الصفحة
   ========================================= */

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // تأخير بسيط جداً (نص ثانية) عشان يمدي المستخدم يشوف اللوقو والحركة الحلوة
        setTimeout(() => {
            preloader.classList.add('fade-out');
            
            // نحذفه من الصفحة نهائياً بعد ما تختفي الحركة عشان ما يثقل الجهاز
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // نفس مدة الـ transition في الـ CSS
        }, 500); 
    }
});
    
    // ============================================
    // أكواد تعمل أول ما الصفحة تشتغل (مثل الإيموجي والقائمة)
    // ============================================

    // 1. تشغيل القائمة الجانبية
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.close-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    if(menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if(overlay) overlay.addEventListener('click', toggleMenu);


    // 2. توليد خلفية الإيموجي
    const emojis = ["📚", "✏️", "🎓", "💡", "📅", "⚙️", "📐", "🔬"];
    const container = document.getElementById('emoji-background');
    if (container) { // تأكدنا ان العنصر موجود عشان ما يطلع خطأ
        const emojiCount = 15;
        for (let i = 0; i < emojiCount; i++) {
            const span = document.createElement('span');
            span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            span.classList.add('emoji-bg-item');
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const rotate = Math.floor(Math.random() * 360);
            const scale = 0.8 + Math.random() * 0.5;
            span.style.left = `${x}%`;
            span.style.top = `${y}%`;
            span.style.transform = `rotate(${rotate}deg) scale(${scale})`;
            container.appendChild(span);
        }
    }

}); // <--- 🛑 انتبه: القوس هذا يقفل كود الـ DOMContentLoaded هنا

document.addEventListener("DOMContentLoaded", () => {
    
    // --- (أكوادك السابقة حقت القائمة والايموجي خلها زي ما هي فوق) ---


    // ============================================
    // زر التخصصات 
    // ============================================

    const modal = document.getElementById('majorsModal');
    const openBtn = document.getElementById('btn-majors'); // الزر اللي عطيناه آيدي تو
    const closeBtn = document.querySelector('.modal-close-btn');
    const overlay = document.querySelector('.modal-overlay');

    // 1. وظيفة الفتح
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault(); // عشان لو كان رابط ما يغير الصفحة
            console.log('تم ضغط زر التخصصات!'); // فحص
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // نمنع السكرول الخلفي
        });
    } else {
        console.error('زر التخصصات غير موجود! تأكد من الـ ID في HTML');
    }

    // 2. وظيفة الإغلاق (زر الإكس)
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    // 3. وظيفة الإغلاق (الضغط في الخلفية)
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            // نتأكد انه ضغط عالفراغ مو داخل الصندوق
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    // دالة الإغلاق الموحدة
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

});

// ============================================
// دالة عرض الأخبار (News Renderer)
// ============================================
// ========================================================
// ملف: WebAppPage/script.js
// الوظيفة: تصميم الأخبار القديم + إعلانات صور كاملة + تبديل تلقائي (7 ثواني)
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Script.js: جاري تشغيل نظام الأخبار...");

    // دالة عرض الأخبار
    function renderNews() {
        const newsContainer = document.getElementById('news');

        // حماية
        if (!newsContainer) return;
        if (typeof getAllNewsArticles === 'undefined') {
            console.warn('News data not found');
            return;
        }

        const articles = getAllNewsArticles(); 
        newsContainer.innerHTML = ''; // تنظيف

        articles.forEach((article, index) => {
            // --------------------------------------------------------
            // 1. كرت الخبر (تصميمك القديم بالحرف - لم نلمسه)
            // --------------------------------------------------------
            const dateObj = new Date(article.date);
            const dateString = dateObj.toLocaleDateString('en-GB'); 

            const card = document.createElement('a');
            card.className = 'news-card';
            card.href = './news.html'; 
            
            card.innerHTML = `
                <div class="news-category">${article.category}</div>
                <img src="${article.image}" alt="${article.title}" class="news-card-img" loading="lazy">
                <div class="news-card-content">
                    <h3 class="news-card-title">${article.title}</h3>
                    <div class="news-card-date">
                        📅 ${dateString} • ${article.author}
                    </div>
                </div>
            `;

            newsContainer.appendChild(card);

            // --------------------------------------------------------
            // 2. حقن الإعلان (صورة كاملة + قابلية للتغيير)
            // --------------------------------------------------------
            if ((index + 1) % 3 === 0) {
                if (window.AdsManager) {
                    const ad = window.AdsManager.getAd('news_feed');
                    
                    if (ad) {
                        const adCard = document.createElement('a');
                        
                        // أضفنا كلاس 'dynamic-ad-unit' عشان نقدر نمسكه بعدين ونغيره
                        adCard.className = 'news-card ad-unit dynamic-ad-unit'; 
                        adCard.href = ad.link;
                        adCard.target = "_blank";
                        
                        // ستايل الإعلان (صورة كاملة تغطي الكرت)
                        adCard.style.cssText = "position: relative; overflow: hidden; display: block; border-radius:22px";

                        adCard.innerHTML = `
                            <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 4px; z-index: 2;">إعلان</span>
                            
                            <img class="dynamic-ad-img" src="${ad.image}" alt="${ad.client}"
                                 style="width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.5s ease;" />
                        `;
                        
                        newsContainer.appendChild(adCard);
                    }
                }
            }
        });
    }

    // --------------------------------------------------------
    // 3. نظام التحديث التلقائي (كل 7 ثواني) 🔄
    // --------------------------------------------------------
    function updateAds() {
        // إذا المحرك مو موجود نوقف
        if (!window.AdsManager) return;

        // نجيب كل كروت الإعلانات اللي زرعناها فوق
        const adUnits = document.querySelectorAll('.dynamic-ad-unit');

        adUnits.forEach(unit => {
            // نطلب إعلان جديد
            const newAd = window.AdsManager.getAd('news_feed');
            
            if (newAd) {
                const img = unit.querySelector('.dynamic-ad-img');
                
                // حركة بسيطة: نخفي الصورة
                img.style.opacity = '0';

                // ننتظر نص ثانية (500ms) لين تختفي، ثم نغير الرابط والصورة ونظهرها
                setTimeout(() => {
                    unit.href = newAd.link;     // تغيير الرابط
                    img.src = newAd.image;      // تغيير الصورة
                    img.style.opacity = '1';    // إظهار
                }, 500);
            }
        });
    }

    // تشغيل الأخبار أول مرة
    renderNews();

    // تشغيل المؤقت: ينادي دالة updateAds كل 7000 ملي ثانية (7 ثواني)
    setInterval(updateAds, 7000);
});

document.addEventListener("DOMContentLoaded", () => {
    let deferredPrompt;
    const pwaPopup = document.getElementById('pwa-install-popup');
    const installBtn = document.getElementById('pwa-install-btn');
    const closeBtn = document.getElementById('close-pwa-popup');
    const iosInstructions = document.getElementById('ios-instructions');

    // التأكد من أن المستخدم لم يقم بإغلاق النافذة سابقاً
    const isDismissed = localStorage.getItem('pwa-popup-dismissed');

    // 1. التعامل مع الأندرويد والكمبيوتر (حدث beforeinstallprompt)
    window.addEventListener('beforeinstallprompt', (e) => {
        // منع ظهور النافذة الافتراضية للمتصفح فوراً
        e.preventDefault();
        deferredPrompt = e;

        // إذا لم يكن المستخدم قد أغلق النافذة سابقاً، أظهرها
        if (!isDismissed) {
            showPopup('android');
        }
    });

    // 2. التعامل مع الآيفون (iOS)
    // نتحقق إذا كان الجهاز iOS وأنه ليس في وضع "Standalone" (أي يعمل داخل المتصفح)
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);

    if (isIos && !isInStandaloneMode && !isDismissed) {
        showPopup('ios');
    }

    // دالة إظهار النافذة
    function showPopup(platform) {
        if (platform === 'android') {
            installBtn.style.display = 'block';
            iosInstructions.style.display = 'none';
        } else if (platform === 'ios') {
            installBtn.style.display = 'none';
            iosInstructions.style.display = 'block';
        }
        
        // تأخير بسيط للظهور الجمالي
        setTimeout(() => {
            pwaPopup.classList.add('show');
        }, 3000); // تظهر بعد 3 ثواني من فتح الموقع
    }

    // عند الضغط على زر التثبيت (للأندرويد)
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            deferredPrompt = null;
            pwaPopup.classList.remove('show');
        }
    });

    // إغلاق النافذة وحفظ الاختيار
    closeBtn.addEventListener('click', () => {
        pwaPopup.classList.remove('show');
        // حفظ في الذاكرة عشان ما تطلع له مرة ثانية لمدة معينة (أو للأبد)
    });
});

/* =========================================
   نظام الوضع الليلي + تغيير الشعار
   ========================================= */

const toggleSwitch = document.querySelector('#checkbox');
const currentTheme = localStorage.getItem('theme');
const appLogo = document.querySelector('.logo-container img'); // مسكنا الشعار

// دالة تحديث الشعار
function updateLogo(theme) {
    if (appLogo) {
        if (theme === 'dark') {
            // هنا حط اسم ملف شعار الدارك
            appLogo.src = 'logo-dark.png'; 
        } else {
            // هنا حط اسم ملف الشعار الأصلي
            appLogo.src = 'logo.png'; 
        }
    }
}

// 1. عند فتح التطبيق
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateLogo(currentTheme); // نحدث الشعار مباشرة

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

// 2. عند ضغط الزر
function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateLogo('dark'); // اقلب الشعار لدارك
        console.log("Dark Mode ON 🌙");
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateLogo('light'); // رجع الشعار الأصلي
        console.log("Dark Mode OFF ☀️");
    }
}

if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme, false);
}

document.addEventListener("DOMContentLoaded", () => {
    // نحدد اسم مفتاح الجلسة (عشان المتصفح يتذكر)
    const POPUP_KEY = 'portal_popup_v1';
    
    // إذا ما قد شافه في هذي الجلسة
    if (!localStorage.getItem(POPUP_KEY)) {
        setTimeout(() => {
            document.getElementById('custom-popup1').classList.add('active');
        }, 1000); // يطلع بعد ثانية وحدة من دخول الموقع
    }
});

function closePopup() {
    const popup = document.getElementById('custom-popup1');
    const POPUP_KEY = 'portal_popup_v1';
    
    // إخفاء النافذة
    popup.classList.remove('active');
    
    // حفظ في الذاكرة أنه شافه خلاص
    localStorage.setItem(POPUP_KEY, 'true');
}


