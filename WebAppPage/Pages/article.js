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


// =========================================
// قراءة تفاصيل الخبر من جهاز المستخدم مباشرة (بدون إنترنت)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const titleEl = document.getElementById('articleTitle');
    const bodyEl = document.getElementById('articleBody');
    const imageEl = document.getElementById('articleImage');
    const clubEl = document.getElementById('articleClub');
    const dateEl = document.getElementById('articleDate');
    const genderEl = document.getElementById('articleGender');
    const linkBtn = document.getElementById('articleLinkBtn'); 

    if (!articleId) {
        titleEl.textContent = "افاا صار خطأ";
        bodyEl.innerHTML = "<p>معليش الظاهر فيه مشكلة او ان المقالة محذوفة</p>";
        return;
    }

    // 1. نسحب قاعدة البيانات اللي حفظناها بجهاز الطالب
    const DB_KEY = "mdkhal_local_db";
    const localData = localStorage.getItem(DB_KEY);

    if (localData) {
        const db = JSON.parse(localData);
        
        // 2. نبحث عن الخبر بناءً على الـ ID
        const newsItem = db.find(item => item.id == articleId);

        if (newsItem) {
// 1. العنوان والصورة
            titleEl.textContent = newsItem.title;
            imageEl.src = newsItem.image;

            // 2. معالجة النص بدون مسافات دبل (CSS بيتولى المهمة)
            bodyEl.innerHTML = MadkhalArticleFormatter.format(newsItem.excerpt); 
            
            // تفعيل معاينة الصور
            setupImagePreview(); // <-- أضف هذا السطر هنا

            // 3. بادج النادي
            clubEl.className = 'unified-badge';
            clubEl.style.color = newsItem.clubColor || "var(--primary-text)";
            // حركة جمالية: نخلي لون خلفية النادي خفيفة من نفس لونه
            clubEl.style.backgroundColor = `${newsItem.clubColor}15`; 
            clubEl.style.borderColor = `${newsItem.clubColor}30`;
            clubEl.innerHTML = `${newsItem.clubName}`;

            // 4. بادج الفئة المستهدفة
            const safeGender = (newsItem.targetGender || "الجميع").trim();
            genderEl.className = 'unified-badge';
            if (safeGender === 'طلاب') {
                genderEl.innerHTML = `<i class="fi fi-rr-user" style="color: #3b82f6;"></i> طلاب`;
            } else if (safeGender === 'طالبات') {
                genderEl.innerHTML = `<i class="fi fi-rr-user" style="color: #ec4899;"></i> طالبات`;
            } else {
                genderEl.innerHTML = `<i class="fi fi-rr-users" style="color: #64748b;"></i> الجميع`;
            }

            // 5. بادج التاريخ
            dateEl.className = 'unified-badge';
            dateEl.innerHTML = `<i class="fi fi-rr-calendar"></i> ${newsItem.date}`;

            // 6. زر الرابط الخارجي
            if (newsItem.externalLink && newsItem.externalLink.trim() !== "") {
                linkBtn.href = newsItem.externalLink; 
                linkBtn.style.display = 'block'; 
            } else {
                linkBtn.style.display = 'none'; 
            }

            // =====================================
            // برمجة زر المشاركة (Web Share API)
            // =====================================
            const shareBtn = document.querySelector('.share-btn');
            
            if (shareBtn) {
                shareBtn.addEventListener('click', async (e) => {
                    e.preventDefault(); // نمنع الزر من تحديث الصفحة
                    
                    // نجهز البيانات اللي بتنرسل بالواتساب أو غيره
                    const shareData = {
                        title: newsItem.title,
                        text: `شيك هذا الخبر من ${newsItem.clubName} على تطبيق مدخل! 🔥\n\n${newsItem.title}\n\n`,
                        url: window.location.href // ياخذ الرابط الحالي حق الخبر بالضبط
                    };

                    try {
                        // إذا جوال الطالب يدعم قائمة المشاركة الأصلية
                        if (navigator.share) {
                            await navigator.share(shareData);
                        } else {
                            // إذا كمبيوتر أو متصفح ما يدعم، ننسخ الرابط للحافظة
                            await navigator.clipboard.writeText(window.location.href);
                            alert('تم نسخ رابط الخبر بنجاح! تقدر تلصقه بأي مكان.'); 
                        }
                    } catch (err) {
                        console.log('تم إلغاء المشاركة أو حدث خطأ', err);
                    }
                });
            }
            // زر الرابط
            if (newsItem.externalLink && newsItem.externalLink.trim() !== "") {
                linkBtn.href = newsItem.externalLink; 
                linkBtn.style.display = 'block'; 
            } else {
                linkBtn.style.display = 'none'; 
            }

        } else {
            titleEl.textContent = "الخبر ماهو موجود";
            bodyEl.innerHTML = "<p>ممكن يكون هذا الخبر محذوف أو ما تمت مزامنته للحين.</p>";
        }
    } else {
        // لو بالغلط دخل الصفحة وجهازه ما فيه بيانات
        titleEl.textContent = "مافيه بيانات";
        bodyEl.innerHTML = "<p>ياليت تفتح صفحة اخبار الاندية أول عشان جهازك يستوعب البيانات.</p>";
    }

    // دالة تفعيل معاينة الصور لأخبار الأندية
    function setupImagePreview() {
       let modal = document.getElementById('image-preview-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'image-preview-modal';
            modal.className = 'img-preview-overlay';
            // تحديث الهيكلة هنا لدعم الحاوية المرنة
            modal.innerHTML = `
                <div class="img-preview-close">&times;</div>
                <div class="img-preview-wrapper" id="preview-wrapper">
                    <img class="img-preview-content" id="preview-img">
                </div>
            `;
            document.body.appendChild(modal);

            // الإغلاق عند الضغط في المساحة الفارغة
            const wrapper = document.getElementById('preview-wrapper');
            wrapper.addEventListener('click', (e) => {
                if (e.target === wrapper) {
                    modal.classList.remove('show');
                }
            });
            
            // زر الإغلاق 
            modal.querySelector('.img-preview-close').addEventListener('click', () => {
                modal.classList.remove('show');
            });
        }

        const previewImg = document.getElementById('preview-img');
        // استهداف صورة الغلاف والصور داخل نص الخبر الخاص بالنادي
        const images = document.querySelectorAll('#articleImage, .article-body img');
        
        images.forEach(img => {
            img.addEventListener('click', () => {
                previewImg.src = img.src;
                modal.classList.add('show');
            });
        });
    }
});