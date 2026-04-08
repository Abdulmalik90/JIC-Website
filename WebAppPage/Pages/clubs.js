// =========================================
// برمجة صفحة الأندية (مربوطة بـ Google Sheets API)
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. حط رابط الـ Web App اللي نسخته من قوقل هنا:
    const API_URL = "https://script.google.com/macros/s/AKfycbxHHBPR8REbUz_IctezSmrSGjEAmteOLG6dV8_2UVNUbqOI1318R8uZFAFdtASYNGq_/exec"; 

    // 2. قاموس الأندية (عشان نتعرف على النادي ونعطيه أيقونة ولون تلقائي)
    const clubsDictionary = {
        "نادي الحاسب": { id: "CS", color: "var(--primary-text)" },
        "نادي الهندسة الكهربائية": { id: "EEC", color: "#ff475f" },
        "نادي ادارة الاعمال": { id: "BUS", color: "#9110b9" },
        "المجلس الطلابي": { id: "JIC", color: "#105fb9" },
        "نادي الاستدامة": { id: "Sustain", color: "#10b981" },
        "نادي The Bridge": { id: "Bridge", color: "#1059b9" },
        // تقدر تضيف أندية ثانية هنا مستقبلاً
    };

    const newsGrid = document.getElementById('newsGrid');
    const searchInput = document.getElementById('clubSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    let newsData = []; // بنحفظ فيها البيانات اللي تجي من قوقل

    // 3. دالة طباعة الكروت
    function renderNews(newsArray) {
        newsGrid.innerHTML = ''; 
        
        if (newsArray.length === 0) {
            newsGrid.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; color: var(--text-light);">
                    <i class="fi fi-rr-search-alt" style="font-size: 40px; margin-bottom: 10px; display: block;"></i>
                    <p style="font-family: 'Tajawal', sans-serif; font-weight: 700;">للحين ماحد نشر خبر هنا</p>
                </div>
            `;
            return;
        }

        newsArray.forEach(news => {
            // 1. الفئة المستهدفة (يسار فوق)
            let genderHTML = '';
            if (news.targetGender === 'طلاب') {
                genderHTML = `<div class="badge-gender-top-left"><i class="fi fi-rr-user icon-male"></i> <span class="gender-text" style="color: #3b82f6;">طلاب</span></div>`;
            } else if (news.targetGender === 'طالبات') {
                genderHTML = `<div class="badge-gender-top-left"><i class="fi fi-rr-user icon-female"></i> <span class="gender-text" style="color: #ec4899;">طالبات</span></div>`;
            } else {
                genderHTML = `<div class="badge-gender-top-left"><i class="fi fi-rr-user icon-male"></i><i class="fi fi-rr-user icon-female"></i> <span class="gender-text" style="color: #64748b;">للجميع</span></div>`;
            }

            // 2. الهيكل الجديد للكرت (بدون تاريخ)
            const cardHTML = `
                <a href="club-article.html?id=${news.id}" class="modern-news-card fade-in">
                    <div class="card-cover">
                        <img src="${news.image}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/800x400/103191/ffffff?text=لا+توجد+صورة'">
                        
                        <div class="badge-club-top-right" style="color: ${news.clubColor};">${news.clubName}</div>

                        ${genderHTML}
                    </div>
                    
                    <div class="card-info">
                        <h3 class="news-title">${news.title}</h3>
                        <p class="news-excerpt">${news.excerpt}</p>
                    </div>
                </a>
            `;
            newsGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

// 4. نظام المزامنة الذكي)
    async function syncNews() {
        const DB_KEY = "mdkhal_local_db";
        const localData = localStorage.getItem(DB_KEY);

        // 1. إذا عنده أخبار محفوظة بجهازه، اعرضها فوراً بدون أي انتظار!
        if (localData) {
            newsData = JSON.parse(localData);
            renderNews(newsData);
        } else {
            // ما نطلع رسالة التحميل إلا إذا كانت هذي أول مرة بحياته يفتح الموقع
            newsGrid.innerHTML = `
                <div style="text-align: center; padding: 50px; color: var(--primary-text);">
                    <i class="fi fi-rr-spinner-alt" style="font-size: 30px; display:inline-block; animation: spin 1s linear infinite;"></i>
                    <p style="font-family: 'Tajawal', font-weight: 700; margin-top: 10px;">جاري تحميل اخبار الاندية الطلابية</p>
                </div>
            `;
        }

        // 2. في الخلفية (بصمت)، نشيك مع قوقل إذا فيه أخبار جديدة
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            const freshNews = data.map((row, index) => {
                const clubName = row["اسم النادي"] || "نادي غير معروف";
                const clubInfo = clubsDictionary[clubName] || { id: "other", color: "#64748b" };
                const fullDate = row["طابع زمني"] || "";
                
                return {
                    id: index, 
                    title: row["عنوان الخبر"] || "بدون عنوان",
                    excerpt: row["تفاصيل الخبر"] || "لا توجد تفاصيل",
                    clubName: clubName,
                    clubId: clubInfo.id,
                    clubColor: clubInfo.color,
                    image: row["رابط صورة الغلاف"] || "https://via.placeholder.com/800x400/103191/ffffff?text=خبر+جديد",
                    date: fullDate.split(" ")[0],
                    externalLink: row["رابط الفعالية (اختياري)"] || "",
                    targetGender: row["الفئة المستهدفة"] || "الجميع" // السطر الجديد
                };
            });

            // 3. نحفظ الأخبار الجديدة في جهاز المستخدم
            localStorage.setItem(DB_KEY, JSON.stringify(freshNews));

            // 4. نحدث المتغير ونطبع الكروت من جديد (عشان لو فيه خبر جديد توه نزل يظهر له)
            newsData = freshNews;
            
            // عشان ما نسوي زحمة بالبحث، نحدث العرض بس إذا ما كان الطالب قاعد يبحث حالياً
            if (searchInput.value === '') {
                const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                if (activeFilter === 'all') {
                    renderNews(newsData);
                }
            }

        } catch (error) {
            console.log("الطالب يتصفح بدون إنترنت، أو قوقل فيه مشكلة. مستمرين على النسخة المحفوظة بالجهاز.");
        }
    }

    // نستدعي دالة المزامنة أول ما تفتح الصفحة
    syncNews();

    // 5. الفلاتر والبحث (زي ما هي ما تغيرت)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedClub = btn.getAttribute('data-filter');
            const searchTerm = searchInput.value.toLowerCase();

            let filteredNews = newsData;
            
            if (selectedClub !== 'all') {
                filteredNews = filteredNews.filter(news => news.clubId === selectedClub);
            }
            if (searchTerm !== '') {
                filteredNews = filteredNews.filter(news => 
                    news.title.toLowerCase().includes(searchTerm) || 
                    news.excerpt.toLowerCase().includes(searchTerm)
                );
            }
            renderNews(filteredNews);
        });
    });

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

            let searchedNews = newsData.filter(news => 
                news.title.toLowerCase().includes(searchTerm) || 
                news.excerpt.toLowerCase().includes(searchTerm)
            );

            if (activeFilter !== 'all') {
                searchedNews = searchedNews.filter(news => news.clubId === activeFilter);
            }
            renderNews(searchedNews);
        });
    }

    // تشغيل جلب البيانات أول ما تفتح الصفحة!
    fetchNews();
});
