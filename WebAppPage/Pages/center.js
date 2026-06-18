// =========================================
// سكربت التمرير التلقائي لشريط الصور
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('heroCarousel');
    const dots = document.querySelectorAll('.dot');
    
    if (!carousel || dots.length === 0) return; // حماية لو العناصر مو موجودة

    let currentIndex = 0;
    const totalSlides = dots.length;
    let autoScrollInterval;

    // دالة لتغيير الشريحة
    function goToSlide(index) {
        if (index >= totalSlides) index = 0; // إذا وصل الأخير يرجع للأول
        if (index < 0) index = totalSlides - 1;
        
        currentIndex = index;
        
        // استخدام scrollIntoView يضمن التمرير الدقيق ويدعم الـ RTL بدون مشاكل حسابية
        const targetSlide = carousel.children[currentIndex];
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

        updateDots();
    }

    // تحديث لون وشكل النقاط السفلية
    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }

    // تشغيل المؤقت
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 9000); // يلف كل 9 ثواني
    }

    // إيقاف المؤقت
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // ربط النقاط السفلية بالضغط اليدوي
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoScroll();
            goToSlide(index);
            startAutoScroll();
        });
    });

    // لو الطالب لمس الصور بيده يوقف التلقائي، وإذا شال يده يرجع يشتغل
    carousel.addEventListener('touchstart', stopAutoScroll);
    carousel.addEventListener('touchend', startAutoScroll);

    // إذا الطالب سحب الشاشة بيده، نحدث النقطة النشطة 
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const slideWidth = carousel.clientWidth;
            // Math.abs لأن التمرير في المواقع العربية (RTL) يكون قيمته بالسالب
            let newIndex = Math.round(Math.abs(carousel.scrollLeft) / slideWidth);
            
            if(newIndex !== currentIndex && newIndex < totalSlides) {
                currentIndex = newIndex;
                updateDots();
            }
        }, 150);
    });

    // تشغيل لأول مرة
    startAutoScroll();
});

// دالة لتشغيل وإطفاء الوضع الليلي من زر القائمة الجانبية
function toggleTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        // إذا كنت تستخدم data-theme حط هذي بعد:
        document.documentElement.setAttribute('data-theme', 'dark'); 
        localStorage.setItem('theme', 'dark'); // يحفظ خياره
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

// عشان أول ما تفتح الصفحة يقرا خياره القديم ويضبط زر السلايدر
document.addEventListener('DOMContentLoaded', () => {
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
        
        // مسح الخلفية الزرقاء الفاتحة (في الدارك مود واللايت مود)
        item.style.backgroundColor = 'transparent'; 
    });
}

// 3. إغلاق القائمة عند الضغط في أي مكان خارجها
document.addEventListener('click', (event) => {
    const notifPanel = document.getElementById('notifPanel');
    // حددنا الزر اللي يفتح الإشعارات بناءً على الـ onclick حقه
    const bellBtn = document.querySelector('[onclick="toggleNotif()"]'); 
    
    if(notifPanel && notifPanel.classList.contains('active')) {
        // إذا الضغطة ما كانت على القائمة ولا على زر الجرس.. قفلها
        if (!notifPanel.contains(event.target) && !bellBtn.contains(event.target)) {
            notifPanel.classList.remove('active');
        }
    }
});