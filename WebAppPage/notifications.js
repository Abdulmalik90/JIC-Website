// =========================================
// نظام الإشعارات المركزي (Central Notifications)
// =========================================

// 1. كود الـ HTML للإشعارات كـ String
const notifHTML = `
    <div class="notif-panel" id="notifPanel">
        <div class="notif-header">
            <h3>الإعلامات</h3>
            <button class="mark-read-btn" onclick="markAllRead()">تحديد كـ مقروء</button>
        </div>

        <div class="notif-list">
            <div class="notif-item unread">
                <div class="notif-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                    <i class="fi fi-rr-rocket"></i>
                </div>
                <div class="notif-content">
                    <h4>صار للاندية الطلابية بروفايلات!</h4>
                    <p>تحديث جديد يشمل بروفايلات للاندية الطلابية!</p>
                    <span class="notif-time">اللحين</span>
                </div>
                <div class="item-unread-dot"></div>
            </div>

            <div class="notif-item unread">
                <div class="notif-icon" style="background: rgba(0, 82, 204, 0.1); color: #005fcc;">
                    <i class="fi fi-rr-baby"></i>
                </div>
                <div class="notif-content">
                    <h4>عمر مدخل صار سنة 🥳</h4>
                    <p>مدخل يكمل سنة كاملة منذ الاطلاق التجريبي</p>
                    <span class="notif-time">1 نوفمبر</span>
                </div>
                <div class="item-unread-dot"></div>
            </div>
        </div>

        <!-- شريط الإبلاغ والاقتراحات (ثابت بالأسفل) -->
        <a href="https://forms.gle/2RZeq72DEdFRUAoz5" target="_blank" style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            gap: 10px; 
            padding: 15px; 
            background: var(--bg-color); 
            color: var(--text-dark); 
            text-decoration: none; 
            font-size: 13px; 
            font-weight: 700; 
            border-top: 1px solid var(--border-color);
            transition: background 0.2s ease;
        " onmouseover="this.style.background='var(--surface-color)'" onmouseout="this.style.background='var(--bg-color)'">
            <i class="fi fi-rr-headset" style="color: var(--primary-text); font-size: 18px;"></i>
            عندك اقتراح أو واجهتك مشكلة؟
        </a>
    </div>
`;

// 2. زرع الإشعارات في الصفحة أول ما تحمل (مع تنظيف أي بقايا)
document.addEventListener('DOMContentLoaded', () => {
    // 1. نبحث إذا فيه أي حاوية إشعارات قديمة منسية في الـ HTML
    const oldPanel = document.getElementById('notifPanel');
    
    // 2. إذا لقيناها، نحذفها بالقوة من جذورها
    if (oldPanel) {
        oldPanel.remove();
    }
    
    // 3. نزرع الكود النظيف والكامل حقنا
    document.body.insertAdjacentHTML('beforeend', notifHTML);
});

// 3. دوال التشغيل (خليناها Window عشان يقراها زر الهيدر onclick)
window.toggleNotif = function() {
    const notifPanel = document.getElementById('notifPanel');
    if(notifPanel) {
        notifPanel.classList.toggle('active');
    }
};

window.markAllRead = function() {
    const mainDot = document.querySelector('.notif-dot');
    if(mainDot) mainDot.style.display = 'none';

    const unreadItems = document.querySelectorAll('.notif-item.unread');
    unreadItems.forEach(item => {
        item.classList.remove('unread');
        const itemDot = item.querySelector('.item-unread-dot');
        if(itemDot) itemDot.style.display = 'none';
        item.style.backgroundColor = 'transparent'; 
    });
};

// 4. إغلاق القائمة عند الضغط بالخارج
document.addEventListener('click', (event) => {
    const notifPanel = document.getElementById('notifPanel');
    const bellBtn = document.querySelector('[onclick="toggleNotif()"]'); 
    
    if(notifPanel && notifPanel.classList.contains('active')) {
        if (!notifPanel.contains(event.target) && bellBtn && !bellBtn.contains(event.target)) {
            notifPanel.classList.remove('active');
        }
    }
});