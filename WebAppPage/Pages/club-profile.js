document.addEventListener('DOMContentLoaded', () => {
    const API_URL = "https://script.google.com/macros/s/AKfycbxHHBPR8REbUz_IctezSmrSGjEAmteOLG6dV8_2UVNUbqOI1318R8uZFAFdtASYNGq_/exec";
    const DEFAULT_AVATAR = "../Images/logo.webp";

    // القاموس الشامل لجميع الأندية (مدعوم بالتاقات والتدرجات)
    const clubsDictionary = {
        "نادي الحاسب": { 
            id: "CS", 
            color: "var(--primary-text)", 
            username: "@CS_JIC", 
            desc: "نادي يهتم بتطوير المهارات التقنية والبرمجية لطلاب الجبيل من خلال ورش العمل.", 
            whatsapp: "https://chat.whatsapp.com/XXXXX", 
            avatar: "clubs-icon/CS.webp", 
            header: "",
            gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #007bc4 100%)",
            badges: [
                { title: "🏆 الأكثر تفاعلاً 2026", type: "gold" },
                { title: "⚡ نادي متميز", type: "blue" }
            ]
        },
        "نادي الاستدامة": { 
            id: "Sustain", 
            color: "#10b981", 
            username: "@Sustain_JIC", 
            desc: "نادي الاستدامة يسعى إلى تعزيز ثقافة الاستدامة والوعي البيئي والمجتمعي من خلال المبادرات والفعاليات والبرامج التوعوية.", 
            whatsapp: "https://chat.whatsapp.com/I3pdflYDW2w2RfIsELM8yZ", 
            avatar: "clubs-icon/Sustain.webp", 
            header: "clubs-icon/SC-Banner.webp",
            badges: [
                { title: "🏆 الأكثر تفاعلاً 2026", type: "gold" },
                { title: "♻️ صديق البيئة", type: "blue" }
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
        "نادي الهندسة الميكانيكية": { 
        id: "ME", color: "#1075b9", username: "@ME_JIC", 
        desc: "نادي يهدف لتطوير المهارات الميكانيكية والصناعية لطلاب الهندسة.", whatsapp: "", 
        avatar: "clubs-icon/ME.webp", header: "", gradient: "linear-gradient(135deg, #0369a1 0%, #0284c7 100%)", 
        badges: [

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

    const urlParams = new URLSearchParams(window.location.search);
    const targetClubId = urlParams.get('id');
    
    let currentClub = null;
    let currentClubName = "";
    
    for (const [name, data] of Object.entries(clubsDictionary)) {
        if (data.id === targetClubId) {
            currentClub = data;
            currentClubName = name;
            break;
        }
    }

    if (!currentClub) {
        document.querySelector('.club-profile-container').innerHTML = "<p style='text-align:center; padding:80px 20px; color:var(--text-light);'>عذراً، النادي المطلوب غير موجود.</p>";
        return;
    }

    // 1. تطبيق الهيدر (صورة أو تدرج ملون أنيق)
    const heroCanvas = document.getElementById('profileHeaderCanvas');
    const headerImg = document.getElementById('profileHeaderImg');
    
    if (currentClub.header && currentClub.header.trim() !== "") {
        headerImg.src = currentClub.header;
        headerImg.style.display = 'block';
    } else {
        headerImg.style.display = 'none';
        heroCanvas.style.background = currentClub.gradient || "linear-gradient(135deg, #0a0b4d 0%, #007bc4 50%, #10b981 100%)";
    }

    // 2. تعبئة الأفاتار والأسماء والوصف
    document.getElementById('profileAvatarImg').src = currentClub.avatar || DEFAULT_AVATAR;
    document.getElementById('profileName').textContent = currentClubName;
    document.getElementById('profileUsername').textContent = currentClub.username;
    document.getElementById('profileBio').textContent = currentClub.desc || "حساب النادي الرسمي في منصة مدخل.";
    
    // 3. زر الانضمام عبر الواتساب
    const waBtn = document.getElementById('profileWhatsappBtn');
    if (waBtn) {
        if (currentClub.whatsapp && currentClub.whatsapp.trim() !== "") {
            waBtn.href = currentClub.whatsapp;
            waBtn.style.display = "inline-flex";
        } else {
            waBtn.style.display = "none";
        }
    }

    // 4. توليد تاقات الأوسمة والجوائز ديناميكياً
    const badgesContainer = document.getElementById('clubBadgesContainer');
    if (badgesContainer) {
        badgesContainer.innerHTML = '';
        if (currentClub.badges && currentClub.badges.length > 0) {
            currentClub.badges.forEach(b => {
                const chip = document.createElement('span');
                chip.className = `award-badge-chip ${b.type || 'blue'}`;
                chip.innerHTML = b.title;
                badgesContainer.appendChild(chip);
            });
        }
    }

    // 5. فلترة ورسم أخبار النادي
    const newsGrid = document.getElementById('profileNewsGrid');
    const DB_KEY = "mdkhal_local_db"; 
    
    function renderProfileNews(newsArray) {
        newsGrid.innerHTML = '';
        const clubNews = newsArray.filter(news => news.clubId === targetClubId);

        if (clubNews.length === 0) {
            newsGrid.innerHTML = `<p style="text-align: center; color: var(--text-light); padding: 40px 20px; font-size:13px;">لا توجد فعاليات أو أخبار منشور حالياً لهذا النادي.</p>`;
            return;
        }

        clubNews.forEach(news => {
            const cardHTML = `
                <a href="club-article.html?id=${news.id}" class="modern-news-card fade-in">
                    <div class="card-cover">
                        <img src="${news.image}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/800x400/007bc4/ffffff?text=مدخل'">
                        <div class="badge-club-top-right" style="color: ${news.clubColor};">${news.clubName}</div>
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

    // الاعتماد على البيانات المحلية ثم المزامنة
    const localData = localStorage.getItem(DB_KEY);
    if (localData) {
        renderProfileNews(JSON.parse(localData));
    } else {
        fetch(API_URL).then(res => res.json()).then(data => {
            const freshNews = data.map((row, index) => {
                const clubName = row["اسم النادي"];
                const clubInfo = clubsDictionary[clubName] || { id: "other", color: "#64748b" };
                return {
                    id: index, 
                    title: row["عنوان الخبر"] || "بدون عنوان", 
                    excerpt: row["تفاصيل الخبر"],
                    clubName: clubName, 
                    clubId: clubInfo.id, 
                    clubColor: clubInfo.color, 
                    image: row["رابط صورة الغلاف"]
                };
            });
            localStorage.setItem(DB_KEY, JSON.stringify(freshNews));
            renderProfileNews(freshNews);
        }).catch(err => {
            console.error("فشل جلب الأخبار:", err);
            newsGrid.innerHTML = `<p style="text-align: center; color: var(--text-light); padding: 30px;">فشل تحميل الأخبار حالياً.</p>`;
        });
    }
});