/* Madkhal article formatter — Markdown + automatic legacy link buttons. */
(function () {
  'use strict';
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const DEFAULT_LINK_LABEL = 'اضغط للتفاصيل';
  const linkRegex = /\[([^\]\n]*)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+)/g;

  function safeUrl(raw) {
    try {
      const url = new URL(raw);
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch (_) { return null; }
  }

  function formatBold(text) {
    return escapeHTML(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function inline(raw) {
    const source = String(raw);
    const output = [];
    let index = 0;
    linkRegex.lastIndex = 0;
    for (const match of source.matchAll(linkRegex)) {
      const start = match.index;
      output.push(formatBold(source.slice(index, start)));
      const markdown = match[2] !== undefined;
      const linkText = markdown ? match[1].trim() : '';
      let rawUrl = markdown ? match[2] : match[3];
      let trailing = '';
      if (!markdown) {
        // Preserve punctuation following standalone URLs.
        const cleaned = rawUrl.replace(/[.,،؛!?؟]+$/, '');
        trailing = rawUrl.slice(cleaned.length);
        rawUrl = cleaned;
      }
      const url = safeUrl(rawUrl);
      if (url) {
        output.push(`<a class="inline-action-btn madkhal-link-button" href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">↗</span> ${formatBold(linkText || DEFAULT_LINK_LABEL)}</a>${escapeHTML(trailing)}`);
      } else {
        output.push(formatBold(match[0]));
      }
      index = start + match[0].length;
    }
    output.push(formatBold(source.slice(index)));
    return output.join('');
  }

  function formatArticle(value) {
    const lines = String(value ?? '').replace(/\r\n?/g, '\n').split('\n');
    const result = [];
    let paragraph = [], list = [], listType = null;
    const flushParagraph = () => {
      if (paragraph.length) {
        result.push(`<p>${paragraph.map(inline).join('<br>')}</p>`);
        paragraph = [];
      }
    };
    const flushList = () => {
      if (list.length) {
        result.push(`<${listType}>${list.map(item => `<li>${inline(item)}</li>`).join('')}</${listType}>`);
        list = [];
        listType = null;
      }
    };
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) { flushParagraph(); flushList(); continue; }
      const heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
      const bullet = trimmed.match(/^[-*]\s+(.+)$/);
      const numbered = trimmed.match(/^\d+[.)]\s+(.+)$/);
      if (heading) {
        flushParagraph(); flushList();
        result.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);
      } else if (bullet || numbered) {
        flushParagraph();
        const type = bullet ? 'ul' : 'ol';
        if (listType && listType !== type) flushList();
        listType = type;
        list.push((bullet || numbered)[1]);
      } else {
        flushList(); paragraph.push(trimmed);
      }
    }
    flushParagraph(); flushList();
    return result.join('\n');
  }

  // Inject once so the buttons work even when older article pages don't import new CSS.
  if (!document.getElementById('madkhal-link-button-style')) {
    const style = document.createElement('style');
    style.id = 'madkhal-link-button-style';
    style.textContent = `
      .article-body a.madkhal-link-button, #articleBody a.madkhal-link-button {
        display: inline-flex; align-items: center; gap: .45em;
        max-width: 100%; vertical-align: middle; text-align: center;
        padding: .65em 1.15em; margin: .25em .1em;
        border-radius: 11px; text-decoration: none;
        background: var(--primary-color, #1769aa); color: white;
        font-weight: 800; line-height: 1.5; overflow-wrap: anywhere;
        transition: filter .15s ease, transform .15s ease;
      }
      .article-body a.madkhal-link-button:hover, #articleBody a.madkhal-link-button:hover {
        filter: brightness(1.14); transform: translateY(-1px);
      }
    `;
    document.head.append(style);
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