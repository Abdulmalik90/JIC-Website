// =========================================
// news-script.js
// جلب الأخبار من Google Sheets (CSV) وتطبيقها على التصميم القديم
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    const newsGrid = document.getElementById('newsGrid');
    const searchInput = document.getElementById('general-search'); // تم التعديل ليتطابق مع الـ ID في news.html
    let allArticles = [];

    // رابط CSV حق قوقل شيت (نفسه اللي تستخدمه)
    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoxkfsi2A0UA8P5C95MDgzfhsKWhGPscPmGmNsj7JGZESTOCSSik8yN8CfoUdnCT8exkcIAp7uZJt/pub?gid=695451602&single=true&output=csv';

    // 1. دالة معالجة وتحليل نص الـ CSV
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

    // 2. دالة جلب البيانات من قوقل شيت
    async function fetchNews() {
        try {
            const res = await fetch(CSV_URL, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const rows = parseCSV(text);

            // تحويل صفوف الـ CSV إلى مصفوفة بيانات تناسب الكود القديم
            allArticles = rows
                .filter(r => r.title || r['العنوان'])
                .map((r, i) => ({
                    id: r.id || r['id'] || String(i),
                    title: r.title || r['العنوان'] || '',
                    author: r.author || r['الكاتب'] || 'مَدخل',
                    date: r.date || r['التاريخ'] || '',
                    category: r.tag || r['التاق'] || r['الوسم'] || 'خبر', // نستخدم category ليتطابق مع تصميمك القديم
                    content: r.body || r['الخبر'] || r['المحتوى'] || '', // تم تغيير اسم المتغير إلى content
                    image: r.cover || r['الصورة'] || '', // تم تغيير اسم المتغير إلى image
                })).reverse(); // الأحدث أولاً

            // بعد ما نجيب الداتا، نطبعها
            renderNews(allArticles);

        } catch (err) {
            console.error('News fetch error:', err);
            if (newsGrid) {
                newsGrid.innerHTML = '<p style="color:red; text-align:center;">خطأ في تحميل البيانات من الخادم</p>';
            }
        }
    }

    // 3. دالة طباعة الأخبار على الشاشة (باستخدام نفس كلاسات التصميم القديم)
    function renderNews(articles) {
        if (!newsGrid) return;
        newsGrid.innerHTML = ''; 

        if (articles.length === 0) {
            newsGrid.innerHTML = '<p style="text-align:center; width:100%; color:#999;">لا توجد أخبار</p>';
            return;
        }

        articles.forEach(article => {
            // تنسيق التاريخ
            const dateObj = new Date(article.date);
            let dateString = article.date; // نعرض النص الأصلي في حال فشل التحويل
            if (!isNaN(dateObj)) {
               dateString = dateObj.toLocaleDateString('ar-SA');
            }

            // تنظيف النص للعرض المختصر
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = article.content;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const excerpt = plainText.substring(0, 80) + "...";

            // إنشاء الكرت بنفس كلاساتك القديمة (blog-card)
            const card = document.createElement('a');
            card.className = 'blog-card';
            
            // نمرر الـ ID في الرابط عشان صفحة المقال تقدر تقراه
            card.href = `article.html?id=${encodeURIComponent(article.id)}`;

            // صورة احتياطية في حال مافيه رابط صورة
            const imgSrc = (article.image && article.image.startsWith('http')) 
                           ? article.image 
                           : 'https://via.placeholder.com/400x200/1a60bb/ffffff?text=خبر+جديد';

            card.innerHTML = `
                <div class="blog-img-wrapper">
                    <span class="blog-category-badge">${article.category}</span>
                    <img src="${imgSrc}" alt="${article.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x200/1a60bb/ffffff?text=خطأ+بالصورة'">
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

    // 4. تشغيل جلب البيانات أول ما تفتح الصفحة
    if (newsGrid) {
       fetchNews();
    }

    // 5. تفعيل البحث (إن وجد)
    if(searchInput){
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allArticles.filter(a => 
                a.title.toLowerCase().includes(term) || 
                a.content.toLowerCase().includes(term)
            );
            renderNews(filtered);
        });
    }
});

// دالة التبديل بين الأقسام (الأخبار والعروض) - باقية زي ما هي
function switchSection(sectionId, btnElement) {
    document.querySelectorAll('.switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    btnElement.classList.add('active');
    document.getElementById('newsGrid').style.display = 'none';
    document.getElementById('offersGrid').style.display = 'none';
    const targetSection = document.getElementById(sectionId + 'Grid');
    targetSection.style.display = 'grid'; 
    targetSection.classList.remove('fade-in');
    void targetSection.offsetWidth; 
    targetSection.classList.add('fade-in');
}

// دالة تصفية المحتوى (باقية زي ما هي للحفاظ على عملك)
function filterContent() {
    const input = document.getElementById('general-search');
    if(!input) return;
    const filter = input.value.trim().toUpperCase(); 
    const newsGrid = document.getElementById('newsGrid');
    const offersGrid = document.getElementById('offersGrid');
    
    let activeGrid;
    if (newsGrid && newsGrid.style.display !== 'none') {
        activeGrid = newsGrid;
    } else {
        activeGrid = offersGrid;
    }
    if (!activeGrid) return; 
    const cards = activeGrid.children;
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (card.classList.contains('loading-spinner') || card.id === 'offers-loader') {
            continue;
        }
        const cardText = card.textContent || card.innerText;
        if (cardText.toUpperCase().indexOf(filter) > -1) {
            card.style.display = ""; 
        } else {
            card.style.display = "none"; 
        }
    }
}