/* Madkhal article formatter: safe plain text + limited Markdown, no dependencies. */
(function () {
  'use strict';
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function inline(raw) {
    let s = escapeHTML(raw);
    const links = [];
    s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, url) => {
      const token = `MADKHAL_LINK_TOKEN_${links.length}_END`;
      links.push(`<a href="${url.replace(/&amp;/g, '&amp;')}" target="_blank" rel="noopener noreferrer">${label}</a>`);
      return token;
    });
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|\s)(https?:\/\/[^\s<]+)/g, (_, pre, url) => {
      const punctuation = /[.,،؛!?؟]$/.test(url) ? url.slice(-1) : '';
      const clean = punctuation ? url.slice(0, -1) : url;
      return `${pre}<a href="${clean}" target="_blank" rel="noopener noreferrer">اضغط هنا</a>${punctuation}`;
    });
    links.forEach((link, i) => { s = s.replace(`MADKHAL_LINK_TOKEN_${i}_END`, link); });
    return s;
  }
  function formatArticle(value) {
    const lines = String(value ?? '').replace(/\r\n?/g, '\n').split('\n');
    const result = [];
    let paragraph = [], list = [], listType = null;
    const flushParagraph = () => { if (paragraph.length) { result.push(`<p>${paragraph.map(inline).join('<br>')}</p>`); paragraph = []; } };
    const flushList = () => { if (list.length) { result.push(`<${listType}>${list.map(x => `<li>${inline(x)}</li>`).join('')}</${listType}>`); list = []; listType = null; } };
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) { flushParagraph(); flushList(); continue; }
      const heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
      const bullet = trimmed.match(/^[-*]\s+(.+)$/);
      const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
      if (heading) { flushParagraph(); flushList(); result.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); }
      else if (bullet || numbered) {
        flushParagraph();
        const type = bullet ? 'ul' : 'ol';
        if (listType && listType !== type) flushList();
        listType = type;
        list.push((bullet || numbered)[1]);
      } else { flushList(); paragraph.push(trimmed); }
    }
    flushParagraph(); flushList();
    return result.join('\n');
  }
  window.MadkhalArticleFormatter = { format: formatArticle };
})();


const MadkhalArticleFormatter = window.MadkhalArticleFormatter;

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
        const dateObj = new Date(article.date);
        let dateString = article.date; 
        if (!isNaN(dateObj)) {
            dateString = dateObj.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }

        const formattedContent = MadkhalArticleFormatter.format(article.content);
        const escapeHTML = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const safeImage = (article.image || '').trim();
        const imageURL = /^https?:\/\//i.test(safeImage) ? safeImage : '';

        const imgSrc = imageURL || 'https://via.placeholder.com/800x400/1a60bb/ffffff?text=خبر+جديد';

        articleContainer.innerHTML = `
            <span class="article-meta">
                <span class="article-badge">${escapeHTML(article.category)}</span>
                <span>📅 ${escapeHTML(dateString)}</span>
            </span>
            <h1 style="font-size: 22px; font-weight: 800; margin: 10px 0 20px; color: var(--text-dark);">${escapeHTML(article.title)}</h1>
            <img src="${escapeHTML(imgSrc)}" class="article-main-image" alt="${escapeHTML(article.title)}">
            <div class="article-body">
                ${formattedContent}
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-color); color: var(--text-light); font-size: 12px;">
                ✍️ بكتابة: ${escapeHTML(article.author)}
            </div>
        `;

        setupImagePreview(); // هنا يتم الاستدعاء بشكل صحيح بعد طباعة المحتوى
    }

    // دالة تفعيل معاينة الصور
    function setupImagePreview() {
        // إنشاء نافذة المعاينة إذا لم تكن موجودة
        let modal = document.getElementById('image-preview-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'image-preview-modal';
            modal.className = 'img-preview-overlay';
            modal.innerHTML = `
                <div class="img-preview-close">&times;</div>
                <img class="img-preview-content" id="preview-img">
            `;
            document.body.appendChild(modal);

            // إغلاق النافذة عند الضغط عليها أو على زر الإغلاق
            modal.addEventListener('click', (e) => {
                if (e.target !== document.getElementById('preview-img')) {
                    modal.classList.remove('show');
                }
            });
        }

        const previewImg = document.getElementById('preview-img');
        // استهداف صورة الغلاف والصور داخل نص الخبر
        const images = document.querySelectorAll('.article-main-image, .article-body img');
        
        images.forEach(img => {
            img.addEventListener('click', () => {
                previewImg.src = img.src;
                modal.classList.add('show');
            });
        });
    }

    // تشغيل الجلب
    loadArticle();
});