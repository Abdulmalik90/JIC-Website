// artical.js
class ArticleRenderer {
    constructor() {
        this.currentArticle = null;
    }

    loadArticle() {
        console.log('Loading article...');
        
        // الحصول على ID الخبر من localStorage
        const articleId = localStorage.getItem('currentArticleId');
        console.log('Article ID from storage:', articleId);
        
        if (!articleId) {
            this.showError('مالقينا اللي تدور عنه, متاكد من الرابط؟');
            return;
        }

        // التحقق من وجود الدالة
        if (typeof getNewsArticleById !== 'function') {
            this.showError('نظام الأخبار معلق اللحين');
            return;
        }

        // الحصول على بيانات الخبر
        this.currentArticle = getNewsArticleById(parseInt(articleId));
        console.log('Found article:', this.currentArticle);
        
        if (!this.currentArticle) {
            this.showError('الظاهر ان الخبر انحذف او فيه مشكلة صايرة');
            return;
        }

        this.renderArticle();
    }

    renderArticle() {
        const formattedDate = new Date(this.currentArticle.date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const articleHTML = `
            <div class="article-container">
                <h1 class="article-title">${this.currentArticle.title}</h1>
                <div class="article-meta">
                    <span>بكتـابـة : ${this.currentArticle.author} </span>
                    <span> | </span>
                    <span> ${formattedDate} </span>
                    <span> | </span>
                    <span class="article-category">${this.currentArticle.category}</span>
                </div>
                ${this.currentArticle.image ? `
                    <div class="article-image-container">
                        <img src="${this.currentArticle.image}" alt="${this.currentArticle.title}" class="article-image">
                    </div>
                ` : ''}
                <div class="article-content">
                    ${this.currentArticle.content}
                </div>
                <div class="article-actions">
                    <button onclick="window.history.back()" class="back-btn">
                        📰 العودة إلى الأخبار
                    </button>
                    <button onclick="shareArticle()" class="share-btn">
                        📤 شـارك الخبر
                    </button>
                </div>
            </div>
        `;

        const articleContent = document.getElementById('articleContent');
        if (articleContent) {
            articleContent.innerHTML = articleHTML;
        } else {
            console.error('Element #articleContent not found');
        }
        
        // تحديث title الصفحة
        document.title = this.currentArticle.title + ' - أخبارنا';
    }

    showError(message) {
        const articleContent = document.getElementById('articleContent');
        if (articleContent) {
            articleContent.innerHTML = `
                <div class="error-container">
                    <h2>⚠️ ${message}</h2>
                    <button onclick="window.location.href='./news.html'" class="back-btn">
                        العودة إلى الأخبار
                    </button>
                </div>
            `;
        } else {
            document.body.innerHTML = `
                <div style="padding: 50px; text-align: center;">
                    <h2>⚠️ ${message}</h2>
                    <button onclick="window.location.href='./news.html'" style="padding: 10px 20px; margin: 20px;">
                        العودة إلى الأخبار
                    </button>
                </div>
            `;
        }
    }
}

// دالة المشاركة
function shareArticle() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'شوف هالخبر في منصة مدخل',
            url: window.location.href
        });
    } else {
        alert('المشاركة غير متاحة في هذا المتصفح. لكن تقدر تنسخ الرابط يدوياً.');
    }
}

// تهيئة المقال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing article renderer...');
    const articleRenderer = new ArticleRenderer();
    articleRenderer.loadArticle();
});