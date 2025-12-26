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

document.addEventListener("DOMContentLoaded", () => {
    
    // --- (أكوادك السابقة حقت القائمة والايموجي خلها زي ما هي فوق) ---


    // ============================================
    // حل مشكلة زر التخصصات (الطريقة المضمونة) 🛠️
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
function renderNews() {
    const newsContainer = document.getElementById('news');

    // تأكد ان الكونتينر موجود + البيانات موجودة
    if (!newsContainer || typeof getAllNewsArticles === 'undefined') {
        console.warn('News container or data not found');
        return;
    }

    // نجيب أحدث 5 أخبار بس عشان ما نثقل الصفحة
    const articles = getAllNewsArticles().slice(0, 5);

    newsContainer.innerHTML = ''; // تنظيف

    articles.forEach(article => {
        // تنسيق التاريخ ليكون مقروء (مثال: 2025/12/22)
        const dateObj = new Date(article.date);
        const dateString = dateObj.toLocaleDateString('en-GB'); // يوم/شهر/سنة

        // إنشاء الكرت
        const card = document.createElement('a');
        card.className = 'news-card';
        // هنا الرابط يوديك لصفحة التفاصيل (عدلها حسب نظام موقعك)
        // إذا تبيها تفتح تفاصيل الخبر، ممكن تحتاج صفحة news-details.html?id=...
        card.href = '../newsPage/news.html'; 
        
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
    });
}

// تشغيل الدالة
renderNews();