document.addEventListener("DOMContentLoaded", () => {
    
    // 1. نظام التبويبات (Tabs)
    const tabs = document.querySelectorAll('.tab-item');
    const views = document.querySelectorAll('.lib-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));

            tab.classList.add('active');

            const targetId = `${tab.getAttribute('data-target')}-lib`;
            const targetView = document.getElementById(targetId);
            if(targetView) targetView.classList.add('active');
        });
    });

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
