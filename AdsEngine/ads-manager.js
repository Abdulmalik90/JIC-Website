// =============================================================
// AdsEngine: ad-manager.js محرك الاعلانات
// =============================================================

(function() {
    const ADS_DB = [
        // --- أخبار ---
        { id: 101, type: "news_feed", client: "مطعم الجامعة", image: "https://placehold.co/1080x1350/0052cc/white?text=Burger", link: "#", active: true },
        { id: 102, type: "news_feed", client: "نون", image: "https://placehold.co/1080x1350/F6C000/black?text=Noon", link: "#", active: true },
        { id: 103, type: "news_feed", client: "جرير", image: "https://placehold.co/1080x1350/e11d48/white?text=Jarir", link: "#", active: true },

        // --- أحداث ---
        { id: 201, type: "event_feed", client: "نادي الحاسب", image: "https://placehold.co/1200x700/e11d48/white?text=Club", link: "#", active: true },
        { id: 202, type: "event_feed", client: "ستاربكس", image: "https://placehold.co/1200x700/00704A/white?text=Coffee", link: "#", active: true },
        { id: 203, type: "event_feed", client: "دانكن", image: "https://placehold.co/1200x700/DD6E42/white?text=hughk", link: "#", active: true },

        // --- مكتبة ---
        { id: 301, type: "library_banner", client: "جرير", image: "https://placehold.co/1200x300/e11d48/white?text=Jarir", link: "#", active: true },
        { id: 302, type: "library_banner", client: "إكسترا", image: "https://placehold.co/1200x300/2d2d2d/white?text=Extra", link: "#", active: true }
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
