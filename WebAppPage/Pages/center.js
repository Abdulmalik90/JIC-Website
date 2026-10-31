// =========================================
// center.js - نسخة الواجهة الجديدة (Dashboard)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. عرض التاريخ الحالي في الواجهة (الهجري/الميلادي حسب لغة جهاز الطالب)
    const dateDisplay = document.getElementById('currentDateDisplay');
    if (dateDisplay) {
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        dateDisplay.textContent = new Date().toLocaleDateString('ar-SA', options); 
    }

    // 2. قراءة خيار الوضع الليلي المحفوظ عند فتح الصفحة
    const savedTheme = localStorage.getItem('theme');
    const themeCheckbox = document.getElementById('sidebar-theme-checkbox');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark');
        if(themeCheckbox) themeCheckbox.checked = true;
    }
});

// =========================================
// نظام الإشعارات (Notifications System)
// =========================================

// 1. دالة فتح وإغلاق قائمة الإشعارات
function toggleNotif() {
    const notifPanel = document.getElementById('notifPanel');
    if(notifPanel) {
        notifPanel.classList.toggle('active');
    }
}

// 2. دالة "تحديد الكل كمقروء"
function markAllRead() {
    // إخفاء النقطة الحمراء من الجرس الرئيسي في الهيدر
    const mainDot = document.querySelector('.notif-dot');
    if(mainDot) mainDot.style.display = 'none';

    // إزالة كلاس 'unread' والنقاط الحمراء من كل الإشعارات في القائمة
    const unreadItems = document.querySelectorAll('.notif-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
        // مسح النقطة الحمراء الصغيرة داخل الإشعار
        const itemDot = item.querySelector('.item-unread-dot');
        if(itemDot) itemDot.style.display = 'none';
        
        // مسح الخلفية المميزة
        item.style.backgroundColor = 'transparent'; 
    });
}

// 3. إغلاق القائمة عند الضغط في أي مكان خارجها
document.addEventListener('click', (event) => {
    const notifPanel = document.getElementById('notifPanel');
    const bellBtn = document.querySelector('[onclick="toggleNotif()"]'); 
    
    if(notifPanel && notifPanel.classList.contains('active')) {
        // إذا الضغطة ما كانت على القائمة ولا على زر الجرس.. قفلها
        if (!notifPanel.contains(event.target) && bellBtn && !bellBtn.contains(event.target)) {
            notifPanel.classList.remove('active');
        }
    }
});

// =========================================
// نظام الوضع الليلي (من القائمة الجانبية القديمة إن وجدت)
// =========================================
function toggleTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-theme', 'dark'); 
        localStorage.setItem('theme', 'dark'); 
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// =========================================
// سكربت التمرير التلقائي لشريط الإعلانات (الجديد)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const wrapper = document.getElementById('carouselWrapper');
    const dots = document.querySelectorAll('#carouselDots .dot');
    
    if (!wrapper || dots.length === 0) return;

    let currentIndex = 0;
    const totalSlides = dots.length;
    let autoScrollInterval;

    function goToSlide(index) {
        if (index >= totalSlides) index = 0;
        if (index < 0) index = totalSlides - 1;
        currentIndex = index;
        
        // التمرير الدقيق للبطاقة المطلوبة ويدعم الـ RTL
        const targetSlide = wrapper.children[currentIndex];
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        updateDots();
    }

    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000); // تمرير كل 5 ثواني
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // ربط النقاط بالضغط
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoScroll();
            goToSlide(index);
            startAutoScroll();
        });
    });

    // إيقاف التمرير عند لمس الشاشة والسحب
    wrapper.addEventListener('touchstart', stopAutoScroll);
    wrapper.addEventListener('touchend', startAutoScroll);

    // تحديث النقطة النشطة عند السحب اليدوي
    let scrollTimeout;
    wrapper.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const slideWidth = wrapper.clientWidth;
            let newIndex = Math.round(Math.abs(wrapper.scrollLeft) / slideWidth);
            if(newIndex !== currentIndex && newIndex < totalSlides) {
                currentIndex = newIndex;
                updateDots();
            }
        }, 150);
    });
    

    startAutoScroll();
});

// =========================================
// نظام حساب الأسبوع الدراسي الحالي
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    
    function calculateAcademicWeek() {
        const weekDisplay = document.getElementById('currentWeekDisplay');
        if (!weekDisplay) return;

        /* 
           قائمة الأسابيع: ضع تاريخ "أول يوم" في كل أسبوع (عادة يوم الأحد).
           صيغة التاريخ: YYYY-MM-DD
           الميزة: تقدر تسمي فترات مخصصة مثل "إجازة منتصف الفصل" وراح تظهر للطالب!
        */
        const schedule = [
            { date: '2026-10-25', label: 'الأسبوع العاشر' },
            { date: '2026-11-01', label: 'الأسبوع الحادي عشر' },
            { date: '2026-11-08', label: 'الأسبوع الثاني عشر' },
            { date: '2026-11-15', label: 'الأسبوع الثالث عشر' }, // مثال لتخصيص نص
            { date: '2026-11-22', label: 'إجازة الخريف 🍂' },    // مثال لإجازة
            { date: '2026-11-29', label: 'الأسبوع الرابع عشر' },
            { date: '2026-12-06', label: 'الأسبوع الخامس عشر' },
            { date: '2026-11-29', label: 'الاختبارات النهائية' },
            { date: '2026-12-06', label: 'الاختبارات النهائية' },
            // ... (أكمل القائمة حسب التقويم الأكاديمي للكلية)
        ];

        // ضبط الوقت الحالي بدون ساعات ليطابق تاريخ القائمة بدقة
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        let currentLabel = "إجازة نهاية الفصل"; // النص الافتراضي لو خلصت التواريخ

        for (let i = 0; i < schedule.length; i++) {
            const weekDate = new Date(schedule[i].date);
            weekDate.setHours(0, 0, 0, 0);
            
            // إذا كان تاريخ اليوم أكبر أو يساوي بداية الأسبوع
            if (now >= weekDate) {
                currentLabel = schedule[i].label;
            } else {
                // إذا وصلنا لأول تاريخ في المستقبل، نوقف اللوب لأننا وجدنا الأسبوع الحالي في الدورة السابقة
                break;
            }
        }

        weekDisplay.textContent = currentLabel;
    }

    calculateAcademicWeek();
});

