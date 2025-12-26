document.addEventListener("DOMContentLoaded", () => {
    const articleContainer = document.getElementById('articleContent');

    // 1. استخراج الـ ID من رابط الصفحة URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    // 2. التحقق من وجود البيانات
    if (typeof getNewsArticleById === 'undefined') {
        articleContainer.innerHTML = '<p style="text-align:center; margin-top:50px;">خطأ: قاعدة البيانات غير متصلة.</p>';
        return;
    }

    // 3. البحث عن الخبر
    // انتبه: الـ ID اللي يجي من الرابط يكون String، لازم نحوله أو الدالة تكون مجهزة
    const article = getNewsArticleById(articleId); 

    if (!article) {
        articleContainer.innerHTML = `
            <div style="text-align:center; margin-top:50px;">
                <i class="fi fi-rr-sad" style="font-size:50px; color:#ccc;"></i>
                <h3>الخبر غير موجود</h3>
                <p>ممكن تم حذفه أو الرابط خطأ.</p>
                <a href="news.html" style="color:var(--primary-color);">العودة للأخبار</a>
            </div>
        `;
        return;
    }

    // 4. عرض الخبر
    const dateObj = new Date(article.date);
    const dateString = dateObj.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    articleContainer.innerHTML = `
        <span class="article-meta">
            <span class="article-badge">${article.category}</span>
            <span>📅 ${dateString}</span>
        </span>

        <h1 style="font-size: 22px; font-weight: 800; margin: 10px 0 20px; color: #222;">${article.title}</h1>

        <img src="${article.image}" class="article-main-image" alt="${article.title}">

        <div class="article-body">
            ${article.content}
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #888; font-size: 12px;">
            ✍️ كتبه: ${article.author}
        </div>
    `;
});