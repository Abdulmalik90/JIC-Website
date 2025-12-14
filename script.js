class Majors{
    constructor(major, arabicName, icon, degree, years, imgs, genders, courses){
        this.major = major;
        this.arabicName = arabicName;
        this.icon = icon;
        this.degree = degree;
        this.years = years;
        this.imgs = imgs;
        this.genders = genders;
        this.courses = courses;
    }
}

// modle choosing major
const major_button = document.getElementById("major-button");
const major_modal = document.getElementById("modal-container-major");
const major_close_modal = document.getElementById("close-btn");

major_button.addEventListener("click", () => {
    major_modal.classList.add("show");
});

major_close_modal.addEventListener("click", () => {
    major_modal.classList.remove("show");
});

// jti preparatory year 
const preparatoryYearJTI = new Majors("Basic Skills", "السنة التحضيرية", "book_3", "السنة التحضيرية", 1, "", "بنين وبنات", [
    {
        semester: 1,
        courses: [
            ["Technical Drawing", 2, 1, 2, []],
            ["Introduction to Safety", 2, 2, 0, []],
            ["Occupational Health and Safety", 4, 4, 0, []],
            ["Computer Application", 2, 1, 2, []],
            ["English I", 8, 20, 1, []]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Industrial Plant Safety", 4, 3, 2, []],
            ["Workshop Skills Safety", 3, 2, 2, []],
            ["Technical Mathematics", 3, 3, 0, []],
            ["English II", 8, 20, 1, ["English I"]]
        ]
    }
] )

// jic proparatory year
const preparatoryYearJIC = new Majors("Preparatory Year", "السنة التحضيرية", "book_3", "السنة التحضيرية", 1, "", "بنين وبنات", [
    {
        semester: 1,
        courses: [
            ["English I (Reading and writing)", 8, 10, 0, []],
            ["English I (Listening & Speaking)", 0, 6, 0, []],
            ["English I (E-Learning)", 0, 0, 2, []],
            ["English I (ESP)", 0, 3, 0, []],
            ["Preparatory Math I", 4, 4, 0, []],
            ["Introduction to Computer", 1, 1, 0, []]
        ]
    },
    {
        semester: 2,
        courses: [
            ["English II (Reading and writing)", 8, 10, 0, ["English I (Reading and writing)"]],
            ["English II (Listening & Speaking)", 0, 6, 0, ["English I (Listening & Speaking)"]],
            ["English II (E-Learning)", 0, 0, 2, ["English II (E-Learning)"]],
            ["English II (ESP)", 0, 3, 0, ["English II (ESP)"]],
            ["Preparatory Math II", 4, 4, 0, ["Preparatory Math I"]],
            ["Study Skills", 1, 1, 0, []]
        ]
    }
] )

document.getElementById("prep-year-btn-jic").addEventListener("click", ()=>{
    localStorage.setItem("selectedMajor", JSON.stringify(preparatoryYearJIC));
    window.location.href = "./MajorPage/majorInfo.html"
})

document.getElementById("prep-year-btn-jti").addEventListener("click", ()=>{
    localStorage.setItem("selectedMajor", JSON.stringify(preparatoryYearJTI));
    window.location.href = "./MajorPage/majorInfo.html"
})



// home-news.js
class HomeNews {
    constructor() {
        this.articles = [];
    }

    // جلب آخر 3 أخبار
    getLatestNews() {
        if (typeof getAllNewsArticles === 'function') {
            const allArticles = getAllNewsArticles();
            return allArticles.slice(0, 3); // آخر 3 أخبار
        } else {
            return this.getFallbackNews();
        }
    }

    // أخبار افتراضية للطوارئ
    getFallbackNews() {
        return [
            {
                id: 1,
                title: "فتح التجسير لطلاب الكلية 471",
                content: "كلية الجبيل الصناعية تفتح ابوابها لاستقبال طلبات الخريجين الراغبين في التجسير للسنة الدراسية الحاليـة",
                image: "./newsPage/newsImages/EnglishBooks471.jpeg",
                date: "2025-08-24T14:34:00",
                category: "أخبار الكلية"
            },
            {
                id: 2,
                title: "التقويم الاكاديمي الرسمي 2025",
                content: "تقويم كليات ومعاهد الهيئة الملكية بالجبيل وينبع الرسمي للسنة الحالية 2025 م",
                image: "https://via.placeholder.com/300x200/28a745/ffffff?text=التقويم",
                date: "2024-01-10T09:00:00",
                category: "أخبار عامة"
            },
            {
                id: 3,
                title: "توزيع الأسابيع الدراسية 2025",
                content: "توزيع الاسابيع الدراسية للعام الحالي وبتصميم واضح وجميل , جهد طلابي غير رسمي.",
                image: "https://via.placeholder.com/300x200/007bff/ffffff?text=الأسابيع",
                date: "2024-01-05T11:30:00",
                category: "خدمات طلابية"
            }
        ];
    }

    // إنشاء بطاقة خبر للصفحة الرئيسية
    createNewsCard(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
        <div class="news-post" id="news${article.id}">
            ${article.image ? `
                <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
            ` : ''}
            <div>
                <h2>${article.title}</h2>
                <p>${article.content.substring(0, 100)}...</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span style="color: var(--text); font-size: 0.9em;">${formattedDate}</span>
                    <span style="background: #086bad; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">
                        ${article.category}
                    </span>
                </div>
            </div>
            <button onclick="openNewsArticle(${article.id})" style="margin-top: 15px;">قراءة المزيد</button>
        </div>
        `;
    }

    // عرض الأخبار في الصفحة الرئيسية
    renderHomeNews() {
        const newsContainer = document.getElementById('news');
        if (!newsContainer) return;

        const latestNews = this.getLatestNews();
        
        if (latestNews.length === 0) {
            newsContainer.innerHTML = '<p style="text-align: center; color: #666;">لا توجد أخبار متاحة حالياً</p>';
            return;
        }

        const newsHTML = latestNews.map(article => 
            this.createNewsCard(article)
        ).join('');

        newsContainer.innerHTML = newsHTML;
    }
}

// فتح صفحة الخبر
function openNewsArticle(articleId) {
    // حفظ ID الخبر للوصول إليه في صفحة المقال
    localStorage.setItem('currentArticleId', articleId);
    
    // الانتقال إلى صفحة الأخبار
    window.location.href = './newsPage/news.html';
}

// Calender script section =====================================================================
class HomeEvents {
    constructor() {
        // constructor is not needed for this
    }

    // getting last 3 events
    getLatestEvents(){
        if(typeof getAllEvents == "function"){
            const allEvents = getAllEvents();
            
            const now = new Date();
            const upcomingEvents = allEvents.filter(event => {
                const targetDate = new Date(event.date);
                const diff = targetDate - now;
                return diff > - (24 * 60 * 60 * 1000); 
            });

            return upcomingEvents.slice(0, 3); 
        } else {
            return this.getFallbackEvents();
        }
    }

    getFallbackEvents(){
        return [
            {title: "حدث تجريبي", id:1, date:"2030-01-01T00:00:00", day:"غير معلوم"},
            {title: "حدث تجريبي", id:2, date:"2030-01-02T00:00:00", day:"غير معلوم"},
            {title: "حدث تجريبي", id:3, date:"2030-01-03T00:00:00", day:"غير معلوم"}
        ]
    }

    createEventsCard(event){
        const simpleDate = event.date.substring(0, 10); 

        // --- NEW LOGIC START: Check if the event is today ---
        const eventDate = new Date(event.date);
        const now = new Date();

        // use toDateString() to compare strictly based on Local Date (Day/Month/Year)
        // This ignores the time and timezone offsets
        function normalize(dateStr) {
            const d = new Date(dateStr);
            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }

        const isToday =
            normalize(event.date).getTime() === normalize(Date.now()).getTime();

        // If it is today, add the 'active-today' class
        const specialClass = isToday ? "active-today" : "";
        // --- NEW LOGIC END ---

        return `
            <div class="event-post ${specialClass}" id="home-event-${event.id}">
                <h2 class="event-title">${event.title}</h2>
                <p class="p-event-date">${simpleDate} | يوم ${event.day}</p>
                <div class="event-timer">
                    <div class="time-section time-sectoin-day">
                        <h1 class="time-day">...</h1>
                        <p class="day-string"></p>
                    </div>

                    <div class="time-section time-sectoin-hour">
                        <h1 class="time-hour"></h1>
                        <p class="hour-string"></p>
                    </div>

                    <div class="time-section time-sectoin-min">   
                        <h1 class="time-minute">...</h1>
                        <p class="minute-string"></p>
                    </div>

                </div>
            </div>`;
    }

    renderHomeEvents(){
        const eventContainer = document.getElementById("calender-events");
        if(!eventContainer) return; 

        const latestEvents = this.getLatestEvents();

        if(latestEvents.length === 0){
            eventContainer.innerHTML = `<p style="text-align: center; color: var(--text);">لا توجد أحداث قادمة حالياً</p>`;
            return;
        }

        const eventHTML = latestEvents.map(anEvent => 
            this.createEventsCard(anEvent)
        ).join('');

        eventContainer.innerHTML = eventHTML;

        if (typeof startCountdown === "function") {
            latestEvents.forEach(event => {
                const element = document.getElementById(`home-event-${event.id}`);
                if (element) {
                    startCountdown(event.date, element);
                }
            });
        } else {
            console.error("startCountdown function not found.");
        }
    }
}


// ===== Slider Arrows Functionality =====
function initSliders() {
    const arrows = document.querySelectorAll(".arrow-btn");
    arrows.forEach(arrow => {
        const targetSelector = arrow.getAttribute("data-target");
        const target = document.querySelector(targetSelector);
        if (!target) return;

        arrow.addEventListener("click", () => {
        const scrollAmount = target.clientWidth * 0.8;
        if (arrow.classList.contains("left")) {
            target.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        } else {
            target.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
        });
    });
}

// activate only when screen width ≤1235px
window.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth <= 1235) initSliders();
});
window.addEventListener("resize", () => {
    if (window.innerWidth <= 1235) initSliders();
});


// تهيئة الأخبار والأحداث عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // Run Home News
    const homeNews = new HomeNews();
    homeNews.renderHomeNews();

    // ADDED: Run Home Events
    const homeEvents = new HomeEvents();
    homeEvents.renderHomeEvents();
});