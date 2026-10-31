// =========================================
// برمجة صفحة الأندية (مربوطة بـ Google Sheets API)
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    // 🔴 أضف هذا السطر هنا برابط الـ Web App الخاص بك 🔴
    const API_URL = "https://script.google.com/macros/s/AKfycbxHHBPR8REbUz_IctezSmrSGjEAmteOLG6dV8_2UVNUbqOI1318R8uZFAFdtASYNGq_/exec";

// 1. تحديث القاموس (أضف بقية أنديتك بنفس الهيكلة)
    const DEFAULT_AVATAR = "https://via.placeholder.com/400x400/f1f5f9/821091?text=LOGO";
    const DEFAULT_HEADER = "https://via.placeholder.com/1200x400/f1f5f9/821091?text=JIC+Clubs";

    const clubsDictionary = {
        "نادي الحاسب": { id: "CS", color: "var(--primary-text)", username: "@CS_JIC", rank: 2, 
        desc: "نادي يهتم بتطوير المهارات التقنية والبرمجية لطلاب الجبيل من خلال ورش العمل.", whatsapp: "https://chat.whatsapp.com/XXXXX", 
        avatar: "clubs-icon/CS.webp", header: "" },
        "نادي الاستدامة": { id: "Sustain", color: "#10b981", username: "@Sustain_JIC", rank: 1,
            desc: "", whatsapp: "https://chat.whatsapp.com/I3pdflYDW2w2RfIsELM8yZ", avatar: "clubs-icon/Sustain.webp", header: "" },

        "نادي الهندسة الكهربائية": { 
            id: "EEC", 
            color: "#ff475f", 
            username: "@EEC_JIC", 
            desc: "نادي يجمع المهتمين بالهندسة الكهربائية والطاقة وتطبيقاتها الحديثة.", 
            whatsapp: "", 
            avatar: "clubs-icon/EEC.webp", 
            header: "",
            gradient: "linear-gradient(135deg, #b91c1c 0%, #ef4444 50%, #f97316 100%)",
            badges: [
                
            ]
        },
        "المجلس الطلابي": { 
            id: "JIC", 
            color: "#105fb9", 
            username: "@JIC_Council", 
            desc: "مجلس يمثل حلقة الوصل بين الطلاب وإدارة الكلية والمعهد لمتابعة الملاحظات والخدمات والمبادرات الطلابية.", 
            whatsapp: "", 
            avatar: "clubs-icon/JIC.webp", 
            header: "",
            gradient: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
            badges: [
                { title: "🏛️ ممثل الطلاب الرسمي", type: "gold" }
            ]
        },
        "نادي The Bridge": { 
            id: "Bridge", 
            color: "#45484d", 
            username: "@Bridge_JIC", 
            desc: "نادي يُعنى بصناعة المحتوى وإبراز أصوات الطلاب والنشرة الصحفية لتوثيق التجارب الإبداعية.", 
            whatsapp: "https://chat.whatsapp.com/KJyDf3vI62e39ZFq9BTc81", 
            avatar: "clubs-icon/Bridge.webp", 
            header: "",
            gradient: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #9ca3af 100%)",
            badges: [
                
            ]
        },
        "النادي الرياضي للطالبات": { 
            id: "FS", 
            color: "#9110b9", 
            username: "@FS_JIC", 
            desc: "يهدف إلى تعزيز النشاط البدني ونشر ثقافة الرياضة بين الطالبات وتنظيم البطولات واكتشاف المواهب.", 
            whatsapp: "https://chat.whatsapp.com/E72wbHNbOPmA1Qpyio7xko", 
            avatar: "clubs-icon/FS.webp", 
            header: "",
            gradient: "linear-gradient(135deg, #831843 0%, #be185d 50%, #f43f5e 100%)",
            badges: [
               
            ]
        },
        "نادي الهندسة المدنية": { 
            id: "CE", 
            color: "#b97510", 
            username: "@CE_JIC", 
            desc: "نادي تخصصي يجمع طلاب الهندسة المدنية لإثراء معارفهم الأكاديمية والمهنية وتنمية مهاراتهم.", 
            whatsapp: "https://chat.whatsapp.com/FoBAehjlzTlJZaC8jeu1up", 
            avatar: "clubs-icon/CE.webp", 
            header: "",
            gradient: "linear-gradient(135deg, #78350f 0%, #d97706 50%, #f59e0b 100%)",
            badges: [
                
            ]
        },
                "نادي الهندسة الميكانيكية": { 
        id: "ME", color: "#1075b9", username: "@ME_JIC", 
        desc: "نادي يهدف لتطوير المهارات الميكانيكية والصناعية لطلاب الهندسة.", whatsapp: "", 
        avatar: "clubs-icon/ME.webp", header: "", gradient: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)", 
        badges: [

        ] 
    },
        "نادي الهندسة الكيميائية": { 
            id: "CHEM", 
            color: "#b93710", 
            username: "@CHEM_JIC", 
            desc: "يهتم بتطوير مهارات الطلاب في تخصصات الهندسة الكيميائية والبوليمرات والكيمياء الصناعية.", 
            whatsapp: "https://chat.whatsapp.com/IXbVFUFO94OF0bLl8wo33A", 
            avatar: "clubs-icon/CHEM.webp", 
            header: "",
            gradient: "linear-gradient(135deg, #9a3412 0%, #ea580c 50%, #f97316 100%)",
            badges: [

            ]
        },
        "نادي همه التطوعي": { 
        id: "HMH", 
        color: "#1091b9", 
        username: "@HMH_JIC", 
        desc: "نادي تطوعي يسعى لخدمة المجتمع الجامعي والمحلي وتنظيم المبادرات والأنشطة الإنسانية.", 
        whatsapp: "", 
        avatar: "clubs-icon/HMH.webp", 
        header: "", 
        gradient: "linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)", 
        badges: [
            { title: "🤝 العطاء التطوعي", type: "gold" }
            ] 
        },
        "النادي الثقافي الاجتماعي للطالبات": { 
        id: "CF", color: "#b96210", username: "@CF_JIC", 
        desc: "نادي يهدف لتعزيز الأنشطة الثقافية والاجتماعية وتنمية المهارات الشخصية والقيادية للطالبات.", whatsapp: "", 
        avatar: "clubs-icon/CF.webp", header: "", gradient: "linear-gradient(135deg, #c2410c 0%, #f97316 100%)", 
        badges: [
            
        ] 
    },
        "نادي الحاسب للطالبات": { 
        id: "CSF", color: "#b910ab", username: "@CSF_JIC", 
        desc: "نادي يختص بدعم وتطوير طالبات قسم الحاسب وتقنية المعلومات وإقامة الورش التقنية.", whatsapp: "", 
        avatar: "clubs-icon/CSF.webp", header: "", gradient: "linear-gradient(135deg, #a21caf 0%, #e879f9 100%)", 
        badges: [
           
        ] 
    },
        "نادي ادارة الاعمال للطالبات": { 
        id: "BSF", color: "#b910ab", username: "@BSF_JIC", 
        desc: "نادي يعنى بتعزيز المفاهيم الإدارية والمالية وريادة الأعمال لربط الطالبات بسوق العمل.", whatsapp: "", 
        avatar: "clubs-icon/BSF.webp", header: "", gradient: "linear-gradient(135deg, #7e22ce 0%, #c084fc 100%)", 
        badges: [
            
        ] }
    };
    // --- (أبقِ كود جلب الأخبار والفلاتر الخاص بك كما هو) ---

    // 2. أضف هذا الكود في نهاية الملف (قبل إغلاق DOMContentLoaded)
    
    // نظام التبويبات
    const tabBtns = document.querySelectorAll('.club-tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(btn.getAttribute('data-target')).classList.add('active');
        });
    });

  // 1. أضف خاصية rank يدوياً للأندية التي تريد تمييزها بالقاموس (مثال):
    // "نادي الحاسب": { id: "CS", rank: 1, ... }
    // "نادي الاستدامة": { id: "Sustain", rank: 2, ... }

    // 2. توليد كروت الأندية الأنيقة (Bento Modern Grid)
    const clubsListContainer = document.getElementById('clubsListContainer');
    if (clubsListContainer) {
        clubsListContainer.innerHTML = '';
        for (const [name, data] of Object.entries(clubsDictionary)) {
            const avatarImg = data.avatar ? data.avatar : DEFAULT_AVATAR;
            const clubDesc = data.desc ? data.desc : "نادي طلابي تابع لكلية الجبيل الصناعية.";
            const handle = data.username || `@${data.id}_JIC`;
            
            // تحديد وسام المركز الأول أو الثاني يدوياً
            let rankBadgeHTML = '';
            if (data.rank === 1) {
                rankBadgeHTML = `<div class="rank-badge gold"><i class="fi fi-sr-trophy"></i> TOP 1</div>`;
            } else if (data.rank === 2) {
                rankBadgeHTML = `<div class="rank-badge silver"><i class="fi fi-sr-medal"></i> TOP 2</div>`;
            }

            const cardHTML = `
                <a href="club-profile.html?id=${data.id}" class="bento-club-card fade-in ${data.rank ? 'ranked-card' : ''}">
                    ${rankBadgeHTML}
                    <div class="bento-club-top">
                        <div class="bento-avatar-box">
                            <img src="${avatarImg}" alt="${name}" onerror="this.src='${DEFAULT_AVATAR}'">
                        </div>
                        <div class="bento-action-badge">
                            <i class="fi fi-rr-arrow-left"></i>
                        </div>
                    </div>
                    <div class="bento-club-info">
                        <h3>${name}</h3>
                        <span class="bento-handle">${handle}</span>
                        <p>${clubDesc}</p>
                    </div>
                </a>
            `;
            clubsListContainer.insertAdjacentHTML('beforeend', cardHTML);
        }
    
    }

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
            const clubName = (row["اسم النادي"] || "نادي غير معروف").trim();

// بحث ذكي يتجاهل المسافات الزائدة
let clubInfo = { id: "other", color: "#64748b" };
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

   const searchInput = document.getElementById('clubSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // تفعيل محرك البحث المباشر
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const activeFilterBtn = document.querySelector('.filter-btn.active');
            const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

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

    // تفعيل أزرار فلاتر الأندية
    if(filterBtns) {
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
    }

    // تشغيل جلب البيانات أول ما تفتح الصفحة!
    fetchNews();
});

