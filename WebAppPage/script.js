document.addEventListener("DOMContentLoaded", () => {
    

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


// ============================================
// دالة عرض الأخبار (News Renderer) - متصلة بالفورم
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Script.js: جاري تشغيل نظام الأخبار من الفورم...");

    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoxkfsi2A0UA8P5C95MDgzfhsKWhGPscPmGmNsj7JGZESTOCSSik8yN8CfoUdnCT8exkcIAp7uZJt/pub?gid=695451602&single=true&output=csv';

    // 1. دالة تحليل الـ CSV (نفس المستخدمة في صفحة الأخبار)
    function parseCSV(text) {
        const rows = [];
        const re = /("(?:[^"]|"")*"|[^,\r\n]*)(,|\r?\n|$)/g;
        let row = [];
        let match;
        while ((match = re.exec(text)) !== null) {
            let val = match[1];
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1).replace(/""/g, '"');
            }
            row.push(val.trim());
            if (match[2] !== ',') {
                rows.push(row);
                row = [];
                if (match[2] === '') break;
            }
        }
        if (!rows.length) return [];
        const headers = rows[0].map(h => h.toLowerCase().trim());
        return rows.slice(1).filter(r => r.some(c => c.trim())).map(r => {
            const obj = {};
            headers.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
            return obj;
        });
    }

    // 2. دالة جلب وعرض الأخبار
    async function renderNews() {
        const newsContainer = document.getElementById('news');
        if (!newsContainer) return;

        // إظهار أنميشن التحميل
        newsContainer.innerHTML = '<div style="width: 100%; text-align: center; padding: 20px; color: var(--text-light);"><i class="fi fi-rr-spinner-alt" style="animation: spin 1s linear infinite; font-size: 24px;"></i></div>';

        try {
            // جلب البيانات من قوقل شيت
            const res = await fetch(CSV_URL, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const rows = parseCSV(text);

            // تصفية وتجهيز البيانات
            const articles = rows
                .filter(r => r.title || r['العنوان'])
                .map((r, i) => ({
                    id: r.id || r['id'] || String(i),
                    title: r.title || r['العنوان'] || 'بدون عنوان',
                    author: r.author || r['الكاتب'] || 'مَدخل',
                    date: r.date || r['التاريخ'] || '',
                    category: r.tag || r['التاق'] || r['الوسم'] || 'خبر',
                    image: r.cover || r['الصورة'] || 'https://via.placeholder.com/400x200/1a60bb/ffffff?text=خبر+جديد'
                })).reverse(); // الأحدث يظهر أولاً

            newsContainer.innerHTML = ''; // تنظيف الحاوية بعد التحميل

            articles.forEach((article, index) => {
                // --------------------------------------------------------
                // كرت الخبر (نفس التصميم القديم بالضبط)
                // --------------------------------------------------------
                let dateString = article.date;
                const dateObj = new Date(article.date);
                if (!isNaN(dateObj)) {
                    dateString = dateObj.toLocaleDateString('en-GB'); 
                }

                const card = document.createElement('a');
                card.className = 'news-card';
                // توجيه الطالب لقراءة الخبر كامل، عدل المسار إذا اختلف
                card.href = `./Pages/article.html?id=${encodeURIComponent(article.id)}`; 
                
                card.innerHTML = `
                    <div class="news-category">${article.category}</div>
                    <img src="${article.image}" alt="${article.title}" class="news-card-img" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200/1a60bb/ffffff?text=خبر+جديد'">
                    <div class="news-card-content">
                        <h3 class="news-card-title">${article.title}</h3>
                        <div class="news-card-date">
                            📅 ${dateString} • ${article.author}
                        </div>
                    </div>
                `;

                newsContainer.appendChild(card);

                // --------------------------------------------------------
                // حقن الإعلانات (نفس نظامك القديم بدون أي تغيير)
                // --------------------------------------------------------
                if ((index + 1) % 2 === 0) {
                    if (window.AdsManager) {
                        const ad = window.AdsManager.getAd('news_feed');
                        
                        if (ad) {
                            const adCard = document.createElement('a');
                            adCard.className = 'news-card ad-unit dynamic-ad-unit'; 
                            adCard.href = ad.link;
                            adCard.target = "_blank";
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

        } catch (err) {
            console.error("News fetch error:", err);
            newsContainer.innerHTML = '<p style="text-align:center; width:100%; color:#ef4444; font-size: 12px;">تعذر تحميل الأخبار من الخادم.</p>';
        }
    }

    // --------------------------------------------------------
    // نظام التحديث التلقائي للإعلانات (كل 7 ثواني)
    // --------------------------------------------------------
    function updateAds() {
        if (!window.AdsManager) return;
        const adUnits = document.querySelectorAll('.dynamic-ad-unit');

        adUnits.forEach(unit => {
            const newAd = window.AdsManager.getAd('news_feed');
            if (newAd) {
                const img = unit.querySelector('.dynamic-ad-img');
                img.style.opacity = '0';
                setTimeout(() => {
                    unit.href = newAd.link;
                    img.src = newAd.image;
                    img.style.opacity = '1';
                }, 500);
            }
        });
    }

    // تشغيل الأخبار
    renderNews();
    setInterval(updateAds, 7000);
});

document.addEventListener("DOMContentLoaded", () => {
    let deferredPrompt;
const pwaPopup = document.getElementById('pwa-install-banner'); // تغير الـ ID هنا
    const installBtn = document.getElementById('pwa-install-btn');
    const closeBtn = document.getElementById('close-pwa-banner'); // تغير الـ ID هنا
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
   نظام الوضع الليلي + تغيير الشعار والأيقونة
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const appLogo = document.querySelector('.hub-logo'); 
    const currentTheme = localStorage.getItem('theme');

    function updateThemeUI(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if(themeIcon) {
                themeIcon.classList.remove('fi-rr-moon');
                themeIcon.classList.add('fi-rr-sun');
            }
            // تعديل المسار هنا
            if (appLogo) appLogo.src = './Images/logo-dark.webp'; 
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if(themeIcon) {
                themeIcon.classList.remove('fi-rr-sun');
                themeIcon.classList.add('fi-rr-moon');
            }
            // وتعديل المسار هنا
            if (appLogo) appLogo.src = './Images/logo.webp'; 
        }
    }

    // فحص الثيم عند فتح التطبيق
    if (currentTheme) {
        updateThemeUI(currentTheme);
    }

    // تغيير الثيم عند الضغط على الزر
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            updateThemeUI(newTheme);
        });
    }
});

// =========================================
// جلب أحدث 3 أخبار للواجهة الرئيسية (Home Feed) - مدمجة مع قوقل
// =========================================

document.addEventListener('DOMContentLoaded', async () => {
    
    const homeNewsContainer = document.getElementById('homeLatestNews');
    if (!homeNewsContainer) return;

    // رابط الـ Web App الخاص بك في Google Apps Script
    const API_URL = "https://script.google.com/macros/s/AKfycbxHHBPR8REbUz_IctezSmrSGjEAmteOLG6dV8_2UVNUbqOI1318R8uZFAFdtASYNGq_/exec"; 
    const DB_KEY = "mdkhal_local_db";

    const clubsDictionary = {
        "نادي الحاسب": { color: "var(--primary-text)" },
        "نادي الاستدامة": { color: "#10b981" },
        "نادي الهندسة الكهربائية": { color: "#ff475f" },
        "المجلس الطلابي": { color: "#105fb9" },
        "نادي The Bridge": { color: "#45484d" },
        "النادي الرياضي للطالبات": { color: "#9110b9" },
        "نادي الهندسة المدنية": { color: "#b97510" },
        "نادي الهندسة الميكانيكية": { color: "#1075b9" },
        "نادي الهندسة الكيميائية": { color: "#b93710" },
        "نادي همه التطوعي": { color: "#1091b9" },
        "النادي الثقافي الاجتماعي للطالبات": { color: "#b96210" },
        "نادي الحاسب للطالبات": { color: "#b910ab" },
        "نادي ادارة الاعمال للطالبات": { color: "#b910ab" }
    };

    // دالة طباعة الـ 3 كروت المصغرة
    function renderHomeNews(newsArray) {
        homeNewsContainer.innerHTML = '';
        
        // ناخذ أول 3 أخبار فقط
        const top3News = newsArray.slice(0, 3);

        if (top3News.length === 0) {
            homeNewsContainer.innerHTML = '<p style="color: var(--text-light); font-size: 12px; padding: 10px;">لا توجد أخبار حالياً.</p>';
            return;
        }

        top3News.forEach(news => {
            const articleLink = `./Pages/club-article.html?id=${news.id}`; 

            const cardHTML = `
                <a href="${articleLink}" class="home-mini-card">
                    <div class="mini-card-cover">
                        <img src="${news.image}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/400x200/103191/ffffff?text=خبر+جديد'">
                        <span class="mini-badge" style="color: ${news.clubColor};">${news.clubName}</span>
                    </div>
                    <div class="mini-card-info">
                        <h4 class="mini-card-title">${news.title}</h4>
                        <span class="mini-card-date"><i class="fi fi-rr-calendar"></i> ${news.date}</span>
                    </div>
                </a>
            `;
            homeNewsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    // دالة المزامنة وجلب البيانات
    async function syncHomeNews() {
        const localData = localStorage.getItem(DB_KEY);

        // 1. عرض البيانات المحفوظة محلياً فوراً (إن وجدت) لسرعة الأداء
        if (localData) {
            renderHomeNews(JSON.parse(localData));
        }

        // 2. التحقق من وجود أخبار جديدة في الخلفية
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            const freshNews = data.map((row, index) => {
                const clubName = (row["اسم النادي"] || "نادي غير معروف").trim();
                
                let clubInfo = { color: "#64748b" };
                for (const [key, value] of Object.entries(clubsDictionary)) {
                    if (clubName.includes(key) || key.includes(clubName)) {
                        clubInfo = value;
                        break;
                    }
                }

                const fullDate = row["طابع زمني"] || "";
                
                return {
                    id: index,
                    title: row["عنوان الخبر"] || "بدون عنوان",
                    excerpt: row["تفاصيل الخبر"] || "",
                    clubName: clubName,
                    clubColor: clubInfo.color,
                    image: row["رابط صورة الغلاف"] || "https://via.placeholder.com/800x400/103191/ffffff?text=خبر+جديد",
                    date: fullDate.split(" ")[0]
                };
            });

            // 3. تحديث التخزين المحلي والواجهة
            localStorage.setItem(DB_KEY, JSON.stringify(freshNews));
            renderHomeNews(freshNews);

        } catch (error) {
            console.error("فشل جلب أخبار الواجهة:", error);
            if (!localData) {
                 homeNewsContainer.innerHTML = '<p style="color: var(--text-light); font-size: 12px; padding: 10px;">لا يمكن الاتصال بالخادم حالياً.</p>';
            }
        }
    }

    syncHomeNews();
});

// =========================================
// الهيدر العصري المطور (Center Logo + Modern Icons)
// =========================================

window.toggleAppTheme = function(basePath) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    const icon = document.getElementById('theme-icon');
    const logo = document.getElementById('main-hub-logo');

    if (newTheme === 'dark') {
        if (icon) { icon.className = 'fi fi-rr-sun'; }
        if (logo) logo.src = basePath + 'Images/Logo22-dark.png';
    } else {
        if (icon) { icon.className = 'fi fi-rr-moon-stars'; }
        if (logo) logo.src = basePath + 'Images/Logo22.png';
    }
};

class AppHeader extends HTMLElement {
    connectedCallback() {
        const basePath = this.getAttribute('base-path') || '../';
        const currentTheme = localStorage.getItem('theme') || 'light';
        const initialIcon = currentTheme === 'dark' ? 'fi-rr-sun' : 'fi-rr-moon-stars';
        const initialLogo = currentTheme === 'dark' ? 'Logo22-dark.png' : 'Logo22.png';

        this.innerHTML = `
            <header class="elegant-header">
                <div class="elegant-header-inner">
                    <!-- زر الإشعارات المطور -->
                    <button class="header-action-btn" onclick="toggleNotif()" aria-label="الإشعارات">
                        <i class="fi fi-rr-bell-ring"></i>
                        <span class="notif-dot-elegant"></span>
                    </button>

                    <!-- الشعار في المنتصف بالضبط -->
                    <div class="header-logo-center">
                        <a href="${basePath}index.html">
                            <img src="${basePath}Images/${initialLogo}" alt="مدخل" id="main-hub-logo" class="app-wordmark-logo">
                        </a>
                    </div>
                    
                    <!-- زر تغيير الثيم المطور -->
                    <button class="header-action-btn" onclick="toggleAppTheme('${basePath}')" aria-label="تغيير المظهر">
                        <i class="fi ${initialIcon}" id="theme-icon"></i>
                    </button>
                </div>
            </header>
        `;

        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
}

if (!customElements.get('app-header')) {
    customElements.define('app-header', AppHeader);
}

document.addEventListener("DOMContentLoaded", () => {
    const bannerContainer = document.querySelector('.library-ad-placeholder');
    
    if (bannerContainer && window.AdsManager) {
        // جلب إعلان بنر المكتبة من المحرك
        const bannerAd = window.AdsManager.getAd('library_banner');
        
        if (bannerAd) {
            bannerContainer.innerHTML = `
                <a href="${bannerAd.link}" target="_blank" class="promo-banner-link" style="display: block; width: 100%; border-radius: 20px; overflow: hidden; position: relative; box-shadow: 0 4px 15px var(--shadow-color);">
                    <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: #fff; font-size: 10px; padding: 3px 8px; border-radius: 8px; z-index: 2; font-family: 'Tajawal';">رعاية</span>
                    <img src="${bannerAd.image}" alt="${bannerAd.client}" style="width: 100%; height: auto; display: block; object-fit: cover; max-height: 160px; border-radius: 20px;">
                </a>
            `;
        }
    }
});

