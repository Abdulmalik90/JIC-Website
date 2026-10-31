// =============================================================
// AdsEngine: ads-manager.js (نظام البنرات الدوارة والإعلانات المنبثقة)
// =============================================================

(function() {
    // 1. قاعدة البيانات الشاملة للإعلانات
    const ADS_DB = [
        // --- إعلان المنبثق الشهري (Popup) ---
        { id: 1, type: "popup_ad", adId: "sponsor_nov_26", client: "الراعي الرسمي", image: "https://i.postimg.cc/MH4JhcRJ/Popup1-aʿlanat-alakhbar-1-copy-4.webp", link: "./Games/game.html", active: true },
        
        // --- إعلانات الأخبار والأحداث (Feeds) ---
        { id: 101, type: "news_feed", client: "مساحة إعلانية", image: "https://i.postimg.cc/N0PLcDV2/ADS-News.webp", link: "./Pages/clubs.html", active: true },
        { id: 102, type: "news_feed", client: "مساحة إعلانية", image: "https://i.postimg.cc/0QMj2mR5/ADS-News2.webp", link: "https://wa.me/966503502885", active: true },
        { id: 201, type: "event_feed", client: "مساحة إعلانية", image: "https://i.postimg.cc/hG3hBswJ/ADS-Events1.webp", link: "./Pages/clubs.html", active: true },
        { id: 202, type: "event_feed", client: "مساحة إعلانية", image: "https://i.postimg.cc/Wb763J8M/ADS-Events2.webp", link: "https://wa.me/966503502885", active: true },

        // --- بنرات الإعلانات الدوارة (تستخدم في المكتبة، الأدوات، الواجهة) ---
        { id: 301, type: "banner_ad", client: "إعلان 1", image: "https://i.postimg.cc/vmSDshjG/ADS-Banner1.webp", link: "https://juportal.online/WebAppPage/Pages/clubs.html", active: true },
        { id: 302, type: "banner_ad", client: "إعلان 2", image: "https://i.postimg.cc/XvDXbLhG/ADS-Banner2.webp", link: "https://wa.me/966503502885", active: true },
        { id: 303, type: "banner_ad", client: "إعلان 3", image: "https://via.placeholder.com/1200x350/821091/ffffff?text=ADS+3", link: "#", active: false } // معطل للتجربة
    ];

    window.AdsManager = {
        // جلب إعلان عشوائي غير مكرر (للأخبار والأحداث)
        getAd: function(type) {
            const candidates = ADS_DB.filter(ad => ad.type === type && ad.active);
            if (candidates.length === 0) return null;
            return candidates[Math.floor(Math.random() * candidates.length)];
        },

        // تشغيل الإعلان المنبثق
        initPopupAd: function() {
            const popupAd = ADS_DB.find(ad => ad.type === "popup_ad" && ad.active);
            if (!popupAd) return;
            const storageKey = `mdkhal_popup_${popupAd.adId}`;
            if (!localStorage.getItem(storageKey)) {
                setTimeout(() => this.renderPopupModal(popupAd, storageKey), 2000);
            }
        },

        renderPopupModal: function(ad, storageKey) {
            const overlay = document.createElement('div');
            overlay.className = 'ad-popup-overlay';
            overlay.innerHTML = `
                <div class="ad-popup-card full-image-popup">
                    <button class="ad-popup-close" id="closeAdPopupModal">&times;</button>
                    <div class="ad-popup-badge">تـرويــج</div>
                    <a href="${ad.link}" class="ad-popup-link">
                        <img src="${ad.image}" alt="${ad.client}" class="ad-popup-full-img">
                    </a>
                </div>
            `;
            document.body.appendChild(overlay);
            setTimeout(() => overlay.classList.add('show'), 50);

            const handleClose = () => {
                overlay.classList.remove('show');
                localStorage.setItem(storageKey, 'true');
                setTimeout(() => overlay.remove(), 300);
            };

            overlay.querySelector('#closeAdPopupModal').addEventListener('click', handleClose);
            overlay.addEventListener('click', (e) => { if (e.target === overlay) handleClose(); });
        }
    };

    // =============================================================
    // الوسم الذكي <ad-banner> (بنر عريض دوار كل 7 ثوانٍ)
    // =============================================================
    class DynamicSliderBanner extends HTMLElement {
        connectedCallback() {
            // جلب جميع البنرات الفعالة
            const activeBanners = ADS_DB.filter(ad => ad.type === "banner_ad" && ad.active);
            
            // إذا لم يوجد أي إعلان مفعل، اخفِ الوسم بالكامل
            if (activeBanners.length === 0) {
                this.style.display = 'none';
                return;
            }

            // بناء الحاوية
            const container = document.createElement('div');
            container.className = 'ad-slider-container';

            // إنشاء شرائح الإعلانات
            activeBanners.forEach((ad, index) => {
                const slide = document.createElement('a');
                slide.href = ad.link;
                slide.target = "_blank";
                // الشريحة الأولى تكون ظاهرة (active) افتراضياً
                slide.className = `ad-slide-item ${index === 0 ? 'active' : ''}`;
                
                slide.innerHTML = `
                    <span class="ad-slider-badge">إعلان</span>
                    <img src="${ad.image}" alt="${ad.client}">
                `;
                container.appendChild(slide);
            });

            this.appendChild(container);

            // تفعيل التبديل التلقائي إذا كان هناك أكثر من إعلان
            if (activeBanners.length > 1) {
                let currentIndex = 0;
                const slides = container.querySelectorAll('.ad-slide-item');
                
                setInterval(() => {
                    slides[currentIndex].classList.remove('active'); // إخفاء الحالي
                    currentIndex = (currentIndex + 1) % slides.length; // الانتقال للتالي
                    slides[currentIndex].classList.add('active'); // إظهار الجديد
                }, 7000); // 7000 ملي ثانية = 7 ثوانٍ
            }
        }
    }

    // تسجيل الوسم في المتصفح
    if (!customElements.get('ad-banner')) {
        customElements.define('ad-banner', DynamicSliderBanner);
    }

    // تشغيل الـ Popup عند تحميل الصفحة
    document.addEventListener("DOMContentLoaded", () => {
        window.AdsManager.initPopupAd();
    });

})();