// news.js
class NewsManager {
    constructor() {
        this.articles = getAllNewsArticles();
    }

    createArticleCard(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `
        <div class="news-card" data-id="${article.id}">
            ${article.image ? `
                <div class="news-image">
                    <img src="${article.image}" alt="${article.title}" loading="lazy">
                </div>
            ` : ''}
            <div class="news-content">
                <h3 class="news-title">${article.title}</h3>
                <div class="news-meta">
                    <span class="news-date">${formattedDate}</span>
                    <span class="news-category">${article.category}</span>
                </div>
                <p class="news-excerpt">${article.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                <button class="read-more-btn" onclick="openArticle(${article.id})">
                    قراءة المزيد
                </button>
            </div>
        </div>
        `;
    }

    renderNewsGrid(containerId) {
        const container = document.getElementById(containerId);
        
        if (this.articles.length === 0) {
            container.innerHTML = '<p class="no-news">لا توجد أخبار متاحة</p>';
            return;
        }

        const newsGrid = this.articles.map(article => 
            this.createArticleCard(article)
        ).join('');

        container.innerHTML = newsGrid;
    }
}

const newsManager = new NewsManager();

// فتح صفحة المقال مع تمرير ID الخبر
function openArticle(articleId) {
    // حفظ ID الخبر في localStorage للوصول إليه في article.html
    localStorage.setItem('currentArticleId', articleId);
    
    // الانتقال إلى صفحة المقال
    window.location.href = './artical.html';
}

// عرض الأخبار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    newsManager.renderNewsGrid('newsGrid');
});