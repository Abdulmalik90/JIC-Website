// home-news.js
class HomeNews {
    constructor() {
        this.articles = [];
    }

    // جلب آخر 3 أخبار
    getLatestNews() {
        if (typeof getAllNewsArticles === 'function') {
            const allArticles = getAllNewsArticles();
            return allArticles.slice(0, 3); // آخر 3 أخبار
        } else {
            return this.getFallbackNews();
        }
    }

    // أخبار افتراضية للطوارئ
    getFallbackNews() {
        return [
            {
                id: 1,
                title: "فتح التجسير لطلاب الكلية 471",
                content: "كلية الجبيل الصناعية تفتح ابوابها لاستقبال طلبات الخريجين الراغبين في التجسير للسنة الدراسية الحاليـة",
                image: "./newsPage/newsImages/EnglishBooks471.jpeg",
                date: "2025-08-24T14:34:00",
                category: "أخبار الكلية"
            },
            {
                id: 2,
                title: "التقويم الاكاديمي الرسمي 2025",
                content: "تقويم كليات ومعاهد الهيئة الملكية بالجبيل وينبع الرسمي للسنة الحالية 2025 م",
                image: "https://via.placeholder.com/300x200/28a745/ffffff?text=التقويم",
                date: "2024-01-10T09:00:00",
                category: "أخبار عامة"
            },
            {
                id: 3,
                title: "توزيع الأسابيع الدراسية 2025",
                content: "توزيع الاسابيع الدراسية للعام الحالي وبتصميم واضح وجميل , جهد طلابي غير رسمي.",
                image: "https://via.placeholder.com/300x200/007bff/ffffff?text=الأسابيع",
                date: "2024-01-05T11:30:00",
                category: "خدمات طلابية"
            }
        ];
    }

    // إنشاء بطاقة خبر للصفحة الرئيسية
    createNewsCard(article) {
        const formattedDate = new Date(article.date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
        <div class="news-post" id="news${article.id}">
            ${article.image ? `
                <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
            ` : ''}
            <div>
                <h2>${article.title}</h2>
                <p>${article.content.substring(0, 100)}...</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <span style="color: #666; font-size: 0.9em;">${formattedDate}</span>
                    <span style="background: #007bff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.8em;">
                        ${article.category}
                    </span>
                </div>
            </div>
            <button onclick="openNewsArticle(${article.id})" style="margin-top: 15px;">قراءة المزيد</button>
        </div>
        `;
    }

    // عرض الأخبار في الصفحة الرئيسية
    renderHomeNews() {
        const newsContainer = document.getElementById('news');
        if (!newsContainer) return;

        const latestNews = this.getLatestNews();
        
        if (latestNews.length === 0) {
            newsContainer.innerHTML = '<p style="text-align: center; color: #666;">لا توجد أخبار متاحة حالياً</p>';
            return;
        }

        const newsHTML = latestNews.map(article => 
            this.createNewsCard(article)
        ).join('');

        newsContainer.innerHTML = newsHTML;
    }
}

// فتح صفحة الخبر
function openNewsArticle(articleId) {
    // حفظ ID الخبر للوصول إليه في صفحة المقال
    localStorage.setItem('currentArticleId', articleId);
    
    // الانتقال إلى صفحة الأخبار
    window.location.href = './newsPage/news.html';
}

// تهيئة الأخبار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const homeNews = new HomeNews();
    homeNews.renderHomeNews();
});