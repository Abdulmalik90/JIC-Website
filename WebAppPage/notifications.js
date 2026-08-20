// =========================================
// نظام الإشعارات المركزي (Central Notifications)
// =========================================

// 1. كود الـ HTML للإشعارات كـ String
const notifHTML = `
    <div class="notif-panel" id="notifPanel">
        <div class="notif-header">
            <h3>الإشعارات</h3>
            <button class="mark-read-btn" onclick="markAllRead()">تحديد كـ مقروء</button>
        </div>

        <div class="notif-list">
            <div class="notif-item unread">
                <div class="notif-icon" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                    <i class="fi fi-rr-rocket"></i>
                </div>
                <div class="notif-content">
                    <h4>إطلاق تحديث جديد لتطبيق مدخل!</h4>
                    <p>جـاهزين للسنة الجديدة بكل شغف وحماس</p>
                    <span class="notif-time">اللحين</span>
                </div>
                <div class="item-unread-dot"></div>
            </div>

            <div class="notif-item unread">
                <div class="notif-icon" style="background: rgba(0, 82, 204, 0.1); color: #005fcc;">
                    <i class="fi fi-rr-calendar"></i>
                </div>
                <div class="notif-content">
                    <h4>اخبار الاندية الطلابية وصلت !</h4>
                    <p>تعاون جديد يجمع مابين مبادرة مدخل و الاندية الطلابية لعرض اخبار الاندية بمكان واحد !</p>
                    <span class="notif-time">قبل شهور</span>
                </div>
                <div class="item-unread-dot"></div>
            </div>
        </div>
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