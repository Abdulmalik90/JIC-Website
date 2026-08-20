document.addEventListener("DOMContentLoaded", () => {
    const articleContainer = document.getElementById('articleContent');
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoxkfsi2A0UA8P5C95MDgzfhsKWhGPscPmGmNsj7JGZESTOCSSik8yN8CfoUdnCT8exkcIAp7uZJt/pub?gid=695451602&single=true&output=csv';

    function parseCSV(text) {
        const rows = [];
        const re = /("(?:[^"]|"")*"|[^,\r\n]*)(,|\r?\n|$)/g;
        let row = [];
        let match;
        while ((match = re.exec(text)) !== null) {
            let val = match[1];
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.slice(1, -1).replace(/""/g, '"');
            }
            row.push(val.trim());
            if (match[2] !== ',') {
                rows.push(row);
                row = [];
                if (match[2] === '') break;
            }
        }
        if (!rows.length) return [];
        const headers = rows[0].map(h => h.toLowerCase().trim());
        return rows.slice(1).filter(r => r.some(c => c.trim())).map(r => {
            const obj = {};
            headers.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
            return obj;
        });
    }

    async function loadArticle() {
        if (!articleId) {
            showError("الخبر غير موجود (لم يتم تمرير المعرف)");
            return;
        }

        try {
            const res = await fetch(CSV_URL, { cache: 'no-cache' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const rows = parseCSV(text);

            const articles = rows
                .filter(r => r.title || r['العنوان'])
                .map((r, i) => ({
                    id: r.id || r['id'] || String(i),
                    title: r.title || r['العنوان'] || '',
                    author: r.author || r['الكاتب'] || 'مَدخل',
                    date: r.date || r['التاريخ'] || '',
                    category: r.tag || r['التاق'] || r['الوسم'] || 'خبر',
                    content: r.body || r['الخبر'] || r['المحتوى'] || '',
                    image: r.cover || r['الصورة'] || '',
                })).reverse();

            const article = articles.find(a => a.id === articleId);

            if (!article) {
                showError("الخبر غير موجود. ربما تم حذفه.");
                return;
            }

            renderArticle(article);

        } catch (err) {
            console.error('Error fetching article:', err);
            showError("خطأ في الاتصال بقاعدة البيانات.");
        }
    }

    function showError(msg) {
        articleContainer.innerHTML = `
            <div style="text-align:center; margin-top:50px;">
                <i class="fi fi-rr-sad" style="font-size:50px; color:#ccc;"></i>
                <h3>عذراً</h3>
                <p>${msg}</p>
                <a href="news.html" style="color:var(--primary-color);">العودة للأخبار</a>
            </div>
        `;
    }

    function renderArticle(article) {
        // تنسيق التاريخ
        const dateObj = new Date(article.date);
        let dateString = article.date; 
        if (!isNaN(dateObj)) {
            dateString = dateObj.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }

        // معالجة الروابط في نص الخبر
        const formattedContent = article.content.replace(/(https?:\/\/[^\s]+)/g, function(url) {
            return `<br><a href="${url}" target="_blank" style="color:var(--primary-color); font-weight:bold;"><i class="fi fi-rr-link-alt"></i> اضغط هنا</a><br>`;
        });
        
        const imgSrc = (article.image && article.image.startsWith('http')) ? article.image : 'https://via.placeholder.com/800x400/1a60bb/ffffff?text=خبر+جديد';

        // نفس الـ HTML الداخلي اللي كنت تستخدمه في الكود القديم بالضبط
        articleContainer.innerHTML = `
            <span class="article-meta">
                <span class="article-badge">${article.category}</span>
                <span>📅 ${dateString}</span>
            </span>

            <h1 style="font-size: 22px; font-weight: 800; margin: 10px 0 20px; color: var(--text-dark);">${article.title}</h1>

            <img src="${imgSrc}" class="article-main-image" alt="${article.title}">

            <div class="article-body">
                ${formattedContent}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-color); color: var(--text-light); font-size: 12px;">
                ✍️ بكتابة: ${article.author}
            </div>
        `;
    }

    // تشغيل الجلب
    loadArticle();
});