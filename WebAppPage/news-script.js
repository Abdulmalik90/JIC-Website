document.addEventListener("DOMContentLoaded", () => {
    const newsGrid = document.getElementById('newsGrid');
    const searchInput = document.getElementById('news-search');
    let allArticles = [];

    function renderNews(articles) {
        newsGrid.innerHTML = ''; 

        if (articles.length === 0) {
            newsGrid.innerHTML = '<p style="text-align:center; width:100%; color:#999;">لا توجد أخبار</p>';
            return;
        }

        articles.forEach(article => {
            const dateObj = new Date(article.date);
            const dateString = dateObj.toLocaleDateString('ar-SA');

            // تنظيف النص للعرض المختصر
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = article.content;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const excerpt = plainText.substring(0, 80) + "...";

            // إنشاء الكرت
            const card = document.createElement('a');
            card.className = 'blog-card';
            
            // 🚨 هنا الحركة المهمة: نمرر الـ ID في الرابط
            card.href = `article.html?id=${article.id}`;

            card.innerHTML = `
                <div class="blog-img-wrapper">
                    <span class="blog-category-badge">${article.category}</span>
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
                <div class="blog-content">
                    <div class="blog-date">📅 ${dateString}</div>
                    <h3 class="blog-title">${article.title}</h3>
                    <p class="blog-excerpt">${excerpt}</p>
                </div>
            `;
            newsGrid.appendChild(card);
        });
    }

    // جلب البيانات
    if (typeof getAllNewsArticles !== 'undefined') {
        allArticles = getAllNewsArticles();
        renderNews(allArticles);
    } else {
        newsGrid.innerHTML = '<p style="color:red; text-align:center;">خطأ في تحميل البيانات</p>';
    }

    // البحث
    if(searchInput){
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allArticles.filter(a => a.title.toLowerCase().includes(term));
            renderNews(filtered);
        });
    }
});