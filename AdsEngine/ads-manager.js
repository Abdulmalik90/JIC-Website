// =============================================================
// AdsEngine: ad-manager.js محرك الاعلانات
// =============================================================

(function() {
    const ADS_DB = [
        // --- أخبار ---
        { id: 101, type: "news_feed", client: "مساحة اعلانية", image: "https://i.postimg.cc/yxTLnC1P/alaʿlanat-aʿlanat-alakhbar.png", link: "../WebAppPage/Tools.html", active: true },
        { id: 102, type: "news_feed", client: "مساحة اعلانية", image: "https://i.postimg.cc/RhTgGxSG/alaʿlanat-aʿlanat-alakhbar-copy.png", link: "../WebAppPage/news.html", active: true },
        { id: 103, type: "news_feed", client: "مساحة اعلانية", image: "https://i.postimg.cc/TPzq1ssZ/original-news.png", link: "../WebAppPage/index.html", active: false },

        // --- أحداث ---
        { id: 201, type: "event_feed", client: " مساحة اعلانية ", image: "https://i.postimg.cc/ZqBxTmfY/original-events.png", link: "../WebAppPage/index.html", active: false },
        { id: 202, type: "event_feed", client: "مساحة اعلانية", image: "https://i.postimg.cc/h409ZP5N/ADS-aʿlanat-alahdath-mʿaydt-2.png", link: "../WebAppPage/library.html", active: false },
        { id: 203, type: "event_feed", client: "مساحة اعلانية", image: "https://i.postimg.cc/gJqkcwRg/1212-aʿlanat-alahdath-mʿaydt-2.webp", link: "../WebAppPage/Pages/center.html", active: true },

        // --- مكتبة ---
        { id: 301, type: "library_banner", client: "مساحة اعلانية", image: "https://i.postimg.cc/76MYPC79/1212-albar-mʿaydt.webp", link: "../WebAppPage/Pages/center.html", active: true },
        { id: 302, type: "library_banner", client: "مساحة اعلانية", image: "https://i.postimg.cc/85BPkFWw/1212-albar-mʿaydt-copy.webp", link: "#", active: true }
    ];

    window.AdsManager = {
        /**
         * جلب إعلان مع استبعاد إعلان محدد (لتفادي التكرار)
         * @param {string} type - نوع الإعلان
         * @param {number} excludedId - (اختياري) رقم الإعلان الحالي عشان ما نختاره مرة ثانية
         */
        getAd: function(type, excludedId = null) {
            // 1. نجيب كل الإعلانات الصالحة لهذا النوع
            let candidates = ADS_DB.filter(ad => ad.type === type && ad.active);
            
            // 2. إذا فيه إعلان نبي نستبعده (والليست فيها أكثر من خيار)، نحذفه من القائمة
            if (excludedId && candidates.length > 1) {
                candidates = candidates.filter(ad => ad.id !== excludedId);
            }

            if (candidates.length === 0) return null;

            // 3. نختار واحد عشوائي من "الباقين"
            const randomIndex = Math.floor(Math.random() * candidates.length);
            return candidates[randomIndex];
        }
    };

    console.log("🚀 AdsManager: جاهز بنظام عدم التكرار.");
})();
