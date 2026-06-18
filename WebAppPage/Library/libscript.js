document.addEventListener("DOMContentLoaded", () => {
    
    // 1. نظام التبويبات (Tabs)
    const tabs = document.querySelectorAll('.tab-item');
    const views = document.querySelectorAll('.lib-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            tab.classList.add('active');

            const targetId = `${tab.getAttribute('data-target')}-lib`;
            const targetView = document.getElementById(targetId);
            if(targetView) targetView.classList.add('active');
        });
    });

    // 2. نظام الأسئلة الشائعة (FAQ)
    const faqContainer = document.getElementById('faq-lib');
    if (faqContainer) {
        faqContainer.addEventListener('click', (e) => {
            const questionBtn = e.target.closest('.faq-question');
            if (!questionBtn) return;

            const item = questionBtn.parentElement;
            item.classList.toggle('open');
        });
    }
});
// ========================================================
// نظام بنر المكتبة الإعلاني (Library Banner System)
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // دالة تهيئة بنر المكتبة
    function initLibraryBanner() {
        const adContainer = document.getElementById('library-ad-banner');

        // حماية: إذا الحاوية غير موجودة (لسنا في صفحة المكتبة) أو المدير غير موجود
        if (!adContainer || !window.AdsManager) return;


        // دالة التبديل التلقائي (تختلف قليلاً عن السابق لأننا نغير المحتوى بالكامل هنا أو الصورة فقط)
        function rotateBanner() {
            const currentImg = document.querySelector('.lib-ad-img');
            const currentLink = document.querySelector('.dynamic-lib-ad a');
            
            const newAd = window.AdsManager.getAd('library_banner');
            
            if (newAd && currentImg) {
                // إخفاء
                currentImg.style.opacity = '0';
                
                setTimeout(() => {
                    // تحديث البيانات
                    currentImg.src = newAd.image;
                    if(currentLink) currentLink.href = newAd.link;
                    
                    // إظهار
                    currentImg.style.opacity = '1';
                }, 500);
            }
        }

        // 1. تشغيل البنر لأول مرة
        renderBanner();

        // 2. تفعيل المؤقت (كل 7 ثواني)
        setInterval(rotateBanner, 7000);
    }

    // استدعاء الدالة
    initLibraryBanner();
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("📚 Library Multi-Banner: جاري تشغيل النظام...");

    // دالة الرسم الأولية
    function initLibraryBanners() {
        // نستخدم querySelectorAll عشان نجيب "الكل" مو بس واحد
        const containers = document.querySelectorAll('.library-ad-placeholder');

        if (containers.length === 0) return;

        if (typeof window.AdsManager === 'undefined') {
            console.error("❌ ملف AdsManager غير موجود!");
            return;
        }

        // نلف على كل حاوية ونحط فيها إعلان
        containers.forEach(container => {
            // نطلب إعلان جديد (بدون استثناء في البداية)
            const ad = window.AdsManager.getAd('library_banner');

            if (ad) {
                container.innerHTML = `
                <div class="dynamic-lib-ad-unit" data-ad-id="${ad.id}" style="cursor:pointer;  border-radius: 20px; overflow: hidden; position: relative; height: 140px; background: #111111;">
                    <a href="${ad.link}" target="_blank" style="display:block; height:100%; width:100%; text-decoration: none;">
                        <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 4px; z-index: 2;">إعلان</span>
                        <img class="lib-ad-img" src="${ad.image}" 
                             style="width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.5s ease;" 
                             alt="${ad.client}">
                    </a>
                </div>
                `;
            }
        });
    }

    // دالة التحديث المستمر (كل 7 ثواني)
    function rotateLibraryBanners() {
        if (!window.AdsManager) return;

        // نجيب كل وحدات الإعلانات اللي زرعناها
        const units = document.querySelectorAll('.dynamic-lib-ad-unit');

        units.forEach(unit => {
            // 1. نجيب رقم الإعلان الحالي عشان ما نكرره
            const currentId = parseInt(unit.getAttribute('data-ad-id'));

            // 2. نطلب إعلان جديد غير الحالي
            const newAd = window.AdsManager.getAd('library_banner', currentId);

            // 3. نطبق التغيير إذا فيه إعلان جديد ومختلف
            if (newAd && newAd.id !== currentId) {
                const img = unit.querySelector('.lib-ad-img');
                const link = unit.querySelector('a');

                // إخفاء
                img.style.opacity = '0';

                setTimeout(() => {
                    // تحديث
                    img.src = newAd.image;
                    link.href = newAd.link;
                    unit.setAttribute('data-ad-id', newAd.id); // تحديث الآيدي
                    // إظهار
                    img.style.opacity = '1';
                }, 500);
            }
        });
    }

    // التشغيل
    initLibraryBanners(); // أول مرة
    setInterval(rotateLibraryBanners, 7000); // المؤقت
});