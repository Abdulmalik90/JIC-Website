document.addEventListener("DOMContentLoaded", () => {
    
    // 1. نظام التنقل الجديد بستايل الأدوات
    const libMainMenu = document.getElementById('libMainMenu');
    const libActiveContainer = document.getElementById('libActiveContainer');
    const libCards = document.querySelectorAll('.lib-menu-card');
    const libViews = document.querySelectorAll('.lib-view');
    const backBtn = document.getElementById('backToLibBtn');
    const activeLibTitle = document.getElementById('activeLibTitle');

    // عند الضغط على بطاقة قسم
    libCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const title = card.querySelector('h3').innerText;

            // إخفاء القائمة الرئيسية وإظهار الحاوية الداخلية
            libMainMenu.style.display = 'none';
            libActiveContainer.style.display = 'block';
            
            // تحديث عنوان القسم
            activeLibTitle.innerText = title;

            // إظهار القسم المحدد فقط
            libViews.forEach(view => {
                view.classList.remove('active');
                if (view.id === `${targetId}-lib`) {
                    view.classList.add('active');
                }
            });
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // عند الضغط على زر الرجوع
    if(backBtn) {
        backBtn.addEventListener('click', () => {
            libActiveContainer.style.display = 'none';
            libMainMenu.style.display = 'block';
            
            libViews.forEach(view => {
                view.classList.remove('active');
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2. نظام الأسئلة الشائعة (FAQ)
    const faqContainer = document.getElementById('faq-lib');
    if (faqContainer) {
        faqContainer.addEventListener('click', (e) => {
            const questionBtn = e.target.closest('.faq-question');
            if (!questionBtn) return;
            const item = questionBtn.parentElement;
            item.classList.toggle('open');
        });
    }
});

// [هنا يبقى كود نظام بروفايل الأعضاء المنبثق كما هو بدون تعديل]


// =========================================
// نظام بروفايل الأعضاء المنبثق (Profile Modal System)
// =========================================

window.openProfileModal = function(member) {
    const modal = document.getElementById('profileModal');
    if (!modal) return;

    // تعبئة البيانات
    document.getElementById('modalName').innerText = member.name;
    document.getElementById('modalRole').innerText = member.role;
    document.getElementById('modalMajor').innerText = member.major;
    document.getElementById('modalBio').innerText = member.bio;
    document.getElementById('modalAvatar').src = member.avatar;
    
    // تعيين خلفية الهيدر (يمكن وضع صورة افتراضية أو لون تدرجي لو لم تتوفر صورة هيدر)
    const headerBg = document.getElementById('modalHeaderBg');
    if (member.header) {
        headerBg.style.backgroundImage = `url('${member.header}')`;
    } else {
        headerBg.style.backgroundImage = 'linear-gradient(135deg, #0a0b4d 0%, #007bc4 100%)';
    }

    // روابط السوشيال
    document.getElementById('modalLinkedin').href = member.linkedin || '#';
    document.getElementById('modalTwitter').href = member.twitter || '#';
    document.getElementById('modalWhatsapp').href = member.whatsapp || '#';
    document.getElementById('modalEmail').href = `mailto:${member.email || ''}`;

    // إظهار النافذة
    modal.classList.add('active');
};

window.closeProfileModal = function() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.classList.remove('active');
    }
};

// إغلاق المودال عند النقر خارج الصندوق
document.addEventListener('click', (e) => {
    const modal = document.getElementById('profileModal');
    if (e.target === modal) {
        closeProfileModal();
    }
});

