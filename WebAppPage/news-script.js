document.addEventListener("DOMContentLoaded", () => {
    const newsGrid = document.getElementById('newsGrid');
    const searchInput = document.getElementById('news-search');
    let allArticles = [];

    function renderNews(articles) {
        newsGrid.innerHTML = ''; 

        if (articles.length === 0) {
            newsGrid.innerHTML = '<p style="text-align:center; width:100%; color:#999;">لا توجد أخبار</p>';
            return;
        }

        articles.forEach(article => {
            const dateObj = new Date(article.date);
            const dateString = dateObj.toLocaleDateString('ar-SA');

            // تنظيف النص للعرض المختصر
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = article.content;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const excerpt = plainText.substring(0, 80) + "...";

            // إنشاء الكرت
            const card = document.createElement('a');
            card.className = 'blog-card';
            
            // 🚨 هنا الحركة المهمة: نمرر الـ ID في الرابط
            card.href = `article.html?id=${article.id}`;

            card.innerHTML = `
                <div class="blog-img-wrapper">
                    <span class="blog-category-badge">${article.category}</span>
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
                <div class="blog-content">
                    <div class="blog-date">📅 ${dateString}</div>
                    <h3 class="blog-title">${article.title}</h3>
                    <p class="blog-excerpt">${excerpt}</p>
                </div>
            `;
            newsGrid.appendChild(card);
        });
    }

    // جلب البيانات
    if (typeof getAllNewsArticles !== 'undefined') {
        allArticles = getAllNewsArticles();
        renderNews(allArticles);
    } else {
        newsGrid.innerHTML = '<p style="color:red; text-align:center;">خطأ في تحميل البيانات</p>';
    }

    // البحث
    if(searchInput){
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allArticles.filter(a => a.title.toLowerCase().includes(term));
            renderNews(filtered);
        });
    }
});

// دالة التبديل بين الأقسام
function switchSection(sectionId, btnElement) {
    // 1. إزالة كلاس active من جميع الأزرار
    document.querySelectorAll('.switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 2. إضافة كلاس active للزر المضغوط
    btnElement.classList.add('active');

    // 3. إخفاء جميع الأقسام
    document.getElementById('newsGrid').style.display = 'none';
    document.getElementById('offersGrid').style.display = 'none';

    // 4. إظهار القسم المطلوب مع التأكد من إعادة تشغيل الأنميشن
    const targetSection = document.getElementById(sectionId + 'Grid');
    targetSection.style.display = 'grid'; // أو block حسب تنسيقك
    
    // إعادة تعيين الأنميشن
    targetSection.classList.remove('fade-in');
    void targetSection.offsetWidth; // حيلة لإجبار المتصفح على إعادة الرسم
    targetSection.classList.add('fade-in');
}



function filterContent() {
    // 1. مسك النص المكتوب
    const input = document.getElementById('general-search');
    const filter = input.value.trim().toUpperCase(); // trim عشان المسافات الزايدة

    // 2. تحديد القسم النشط حالياً (أخبار ولا عروض؟)
    const newsGrid = document.getElementById('newsGrid');
    const offersGrid = document.getElementById('offersGrid');
    
    // نشوف مين اللي الـ display حقه مو none
    let activeGrid;
    if (newsGrid && newsGrid.style.display !== 'none') {
        activeGrid = newsGrid;
    } else {
        activeGrid = offersGrid;
    }

    // 3. مسك جميع البطاقات داخل القسم النشط
    // نستخدم children عشان نمسك كل العناصر المباشرة (البطاقات) بغض النظر عن الكلاس حقها
    if (!activeGrid) return; // حماية لو القسم مو موجود
    const cards = activeGrid.children;

    // 4. الدوران على كل بطاقة والبحث
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        // نتجاهل عنصر "جاري التحميل" عشان ما يختفي
        if (card.classList.contains('loading-spinner') || card.id === 'offers-loader') {
            continue;
        }

        // نمسك كل النصوص الموجودة داخل البطاقة
        const cardText = card.textContent || card.innerText;

        // المقارنة
        if (cardText.toUpperCase().indexOf(filter) > -1) {
            card.style.display = ""; // إظهار
        } else {
            card.style.display = "none"; // إخفاء
        }
    }
}