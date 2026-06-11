/* ============================================================
   MADKHAL — news.js
   Shared script for news.html + article.html
   Data source: Google Sheets published as CSV
   ============================================================

   GOOGLE SHEET CSV SETUP (see bottom of file for instructions)
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   CONFIG — عدّل هنا فقط
══════════════════════════════════════════════════════════ */
const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSuoxkfsi2A0UA8P5C95MDgzfhsKWhGPscPmGmNsj7JGZESTOCSSik8yN8CfoUdnCT8exkcIAp7uZJt/pub?gid=695451602&single=true&output=csv';

/* ══════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════ */
const html          = document.documentElement;
const themeToggle   = document.getElementById('themeToggle');
const themeToggleMb = document.getElementById('themeToggleMobile');
const themeIcon     = document.getElementById('themeIcon');
const themeIconMb   = document.getElementById('themeIconMobile');
const themeLabel    = document.getElementById('themeLabel');
const T_ICONS  = { dark: '☀️', light: '🌙' };
const T_LABELS = { dark: 'التبديل للوضع النهاري', light: 'التبديل للوضع الليلي' };

let currentTheme = localStorage.getItem('madkhal-theme') || 'dark';
applyTheme(currentTheme, false);

function applyTheme(theme, animate = true) {
  currentTheme = theme;
  html.setAttribute('data-theme', theme);
  localStorage.setItem('madkhal-theme', theme);
  const icon = T_ICONS[theme];
  if (animate) {
    [themeIcon, themeIconMb].forEach(el => {
      if (!el) return;
      el.style.transform = 'rotate(360deg) scale(0)';
      el.style.opacity = '0';
    });
    setTimeout(() => {
      [themeIcon, themeIconMb].forEach(el => {
        if (!el) return;
        el.textContent = icon;
        el.style.cssText = 'transform:rotate(0)scale(1);opacity:1;transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .3s ease';
      });
    }, 200);
  } else {
    if (themeIcon)   themeIcon.textContent   = icon;
    if (themeIconMb) themeIconMb.textContent = icon;
  }
  if (themeLabel) themeLabel.textContent = T_LABELS[theme];
}
const toggleTheme = () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
themeToggle?.addEventListener('click', toggleTheme);
themeToggleMb?.addEventListener('click', toggleTheme);
document.addEventListener('keydown', e => { if (e.shiftKey && e.key === 'D') toggleTheme(); });

/* ══════════════════════════════════════════════════════════
   HEADER SCROLL
══════════════════════════════════════════════════════════ */
const headerEl = document.getElementById('header');
window.addEventListener('scroll', () => {
  headerEl?.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   BURGER
══════════════════════════════════════════════════════════ */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger?.addEventListener('click', () => {
  const open = burger.classList.toggle('is-open');
  mobileNav?.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', open);
});
mobileNav?.querySelectorAll('.mobile-nav__link').forEach(l => {
  l.addEventListener('click', () => {
    burger?.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
  });
});

/* ══════════════════════════════════════════════════════════
   REVEAL
══════════════════════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════════════════════════ */
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => btt?.classList.toggle('is-visible', window.scrollY > 400), { passive: true });
btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══════════════════════════════════════════════════════════
   CSV PARSER
   Handles quoted fields, commas inside quotes, newlines
══════════════════════════════════════════════════════════ */
function parseCSV(text) {
  const rows = [];
  const re   = /("(?:[^"]|"")*"|[^,\r\n]*)(,|\r?\n|$)/g;
  let row    = [];
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
  return rows.slice(1)
    .filter(r => r.some(c => c.trim()))
    .map(r => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (r[i] || '').trim(); });
      return obj;
    });
}

/* ══════════════════════════════════════════════════════════
   DATE FORMATTER (Arabic)
══════════════════════════════════════════════════════════ */
function formatDate(raw) {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleString('ar-SA', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
    hour12: true
  });
}

/* ══════════════════════════════════════════════════════════
   TAG → CSS CLASS
══════════════════════════════════════════════════════════ */
function tagClass(tag) {
  if (!tag) return 'tag--default';
  const t = tag.trim().toLowerCase();
  if (t === 'مدخل'   || t === 'news')     return 'tag--news';
  if (t === 'الكليات والمعاهد'   || t === 'rcjy')     return 'tag--rcjy';
  if (t === 'تنبيه' || t === 'alert')    return 'tag--alert';
  if (t === 'توعوي'   || t === 'awareness')     return 'tag--awareness';
  if (t === 'دعوة' || t === 'announce') return 'tag--announce';
  
  return 'tag--default';
}

/* ══════════════════════════════════════════════════════════
   TAG EMOJI
══════════════════════════════════════════════════════════ */
function tagEmoji(tag) {
  if (!tag) return '📢';
  const t = tag.trim().toLowerCase();
  if (t === 'خبر'   || t === 'news')     return '📰';
  if (t === 'الكليات والمعاهد'   || t === 'rcjy')     return '🏛️';
  if (t === 'تنبيه' || t === 'alert')    return '⚠️';
  if (t === 'توعوي' || t === 'awareness') return '💡';
  if (t === 'دعوة' || t === 'announce') return '📣';
  return '📢';
}

/* ══════════════════════════════════════════════════════════
   FIRST LETTER AVATAR
══════════════════════════════════════════════════════════ */
function avatarLetter(name) {
  const trimmed = (name || 'م').trim();
  return trimmed.charAt(0);
}

/* ══════════════════════════════════════════════════════════
   SLUG  (used as URL param)
══════════════════════════════════════════════════════════ */
function makeSlug(index) {
  return String(index);
}

/* ══════════════════════════════════════════════════════════
   ARTICLE BODY: convert plain URLs to styled buttons
══════════════════════════════════════════════════════════ */
function linkifyBody(text) {
  if (!text) return '';
  // Convert newlines to <br>
  const withBreaks = text.replace(/\r?\n/g, '<br/>');
  // Replace URLs with button links
  const urlRegex = /(https?:\/\/[^\s<>"،؛]+)/g;
  return withBreaks.replace(urlRegex, url =>
    `<a href="${url}" class="article-link-btn" target="_blank" rel="noopener">
      🔗 اضغط للتفاصيل
    </a>`
  );
}

/* ══════════════════════════════════════════════════════════
   FETCH CSV DATA
══════════════════════════════════════════════════════════ */
let allArticles = [];

async function fetchNews() {
  try {
    const res = await fetch(CSV_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const rows = parseCSV(text);

    /* Map CSV rows → article objects
       Expected columns (case-insensitive):
       title | author | date | tag | body | cover | id (optional)
    */
    allArticles = rows
      .filter(r => r.title || r['العنوان'])
      .map((r, i) => ({
        id:      r.id     || r['id']       || String(i),
        index:   i,
        title:   r.title  || r['العنوان']  || '',
        author:  r.author || r['الكاتب']   || 'مَدخل',
        date:    r.date   || r['التاريخ']  || '',
        tag:     r.tag    || r['التاق']    || r['الوسم'] || '',
        body:    r.body   || r['الخبر']    || r['المحتوى'] || '',
        cover:   r.cover  || r['الصورة']   || '',
      }))
      .reverse(); /* newest first */

    return allArticles;
  } catch (err) {
    console.error('News fetch error:', err);
    return null;
  }
}

/* ══════════════════════════════════════════════════════════
   ── NEWS PAGE  (news.html)
══════════════════════════════════════════════════════════ */
const newsGrid = document.getElementById('newsGrid');

if (newsGrid) {
  initNewsPage();
}

async function initNewsPage() {
  const data = await fetchNews();

  /* Clear skeletons */
  newsGrid.innerHTML = '';

  if (!data) {
    newsGrid.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__icon">😕</p>
        <p class="empty-state__title">تعذّر تحميل الأخبار</p>
        <p style="font-size:.85rem;color:var(--muted)">تأكد من اتصالك بالإنترنت أو حاول لاحقاً.</p>
      </div>`;
    return;
  }
  if (!data.length) {
    newsGrid.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__icon">📭</p>
        <p class="empty-state__title">لا توجد أخبار حالياً</p>
      </div>`;
    return;
  }

  /* Build tag filter buttons */
  const tags = [...new Set(data.map(a => a.tag).filter(Boolean))];
  const tagFilters = document.getElementById('tagFilters');
  if (tagFilters) {
    tagFilters.innerHTML = tags.map(tag =>
      `<button class="filter-btn" data-tag="${tag}">${tagEmoji(tag)} ${tag}</button>`
    ).join('');
  }

  renderCards(data);

  /* Search */
  const searchInput = document.getElementById('searchInput');
  searchInput?.addEventListener('input', () => {
    applyFilters(searchInput.value, activeTag);
  });

  /* Tag filters */
  let activeTag = 'all';
  document.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeTag = btn.dataset.tag;
    document.querySelectorAll('.filter-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.tag === activeTag)
    );
    applyFilters(searchInput?.value || '', activeTag);
  });

  function applyFilters(query, tag) {
    const q = query.trim().toLowerCase();
    const filtered = allArticles.filter(a => {
      const matchTag    = tag === 'all' || a.tag === tag;
      const matchSearch = !q || `${a.title} ${a.body} ${a.author} ${a.tag}`.toLowerCase().includes(q);
      return matchTag && matchSearch;
    });
    renderCards(filtered);
  }
}

let activeTag = 'all';

function renderCards(articles) {
  const newsGrid = document.getElementById('newsGrid');
  const meta     = document.getElementById('resultsMeta');
  if (!newsGrid) return;

  newsGrid.innerHTML = '';

  if (meta) {
    meta.innerHTML = articles.length === allArticles.length
      ? `<strong>${allArticles.length}</strong> خبر`
      : `عرض <strong>${articles.length}</strong> من أصل <strong>${allArticles.length}</strong>`;
  }

  if (!articles.length) {
    newsGrid.innerHTML = `
      <div class="empty-state">
        <p class="empty-state__icon">🔍</p>
        <p class="empty-state__title">ما لقينا خبر بهذا البحث</p>
      </div>`;
    return;
  }

  articles.forEach((article, i) => {
    const card = buildCard(article, i === 0 && articles.length === allArticles.length);
    newsGrid.appendChild(card);
  });

  /* Stagger animation */
  newsGrid.querySelectorAll('.news-card').forEach((c, i) => {
    c.style.animationDelay = `${i * 0.05}s`;
  });
}

function buildCard(article, featured = false) {
  const card = document.createElement('a');
  card.className = 'news-card' + (featured ? ' news-card--featured' : '');
  card.href = `article.html?id=${encodeURIComponent(article.id)}&idx=${article.index}`;

  const hasCover = article.cover && article.cover.startsWith('http');
  const coverHtml = hasCover
    ? `<img class="news-card__cover" src="${article.cover}" alt="${article.title}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\'news-card__cover-placeholder\'>${tagEmoji(article.tag)}</div>'">`
    : `<div class="news-card__cover-placeholder">${tagEmoji(article.tag)}</div>`;

  const excerpt = article.body
    ? article.body.replace(/https?:\/\/[^\s]+/g, '').replace(/\n/g, ' ').slice(0, 160) + (article.body.length > 160 ? '…' : '')
    : '';

  card.innerHTML = `
    ${coverHtml}
    <div class="news-card__content">
      <div class="news-card__meta">
        <span class="tag ${tagClass(article.tag)}">${tagEmoji(article.tag)} ${article.tag || 'خبر'}</span>
        <span class="news-card__date">${formatDate(article.date)}</span>
      </div>
      <h2 class="news-card__title">${article.title}</h2>
      ${excerpt ? `<p class="news-card__excerpt">${excerpt}</p>` : ''}
      <div class="news-card__author">
        <div class="news-card__avatar">${avatarLetter(article.author)}</div>
        <span class="news-card__author-name">${article.author}</span>
        <span class="news-card__read-more">اقرأ أكثر ←</span>
      </div>
    </div>`;

  return card;
}

/* ══════════════════════════════════════════════════════════
   ── ARTICLE PAGE  (article.html)
══════════════════════════════════════════════════════════ */
const articleContainer = document.getElementById('articleContainer');

if (articleContainer) {
  initArticlePage();
}

async function initArticlePage() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  const idx    = parseInt(params.get('idx') || '0', 10);

  const data = await fetchNews();
  const loadingEl = document.getElementById('articleLoading');

  if (!data) {
    if (loadingEl) loadingEl.remove();
    articleContainer.innerHTML = buildErrorState('تعذّر تحميل الخبر', 'تأكد من اتصالك بالإنترنت.');
    return;
  }

  /* Find the article — by id first, fallback by index */
  let article = data.find(a => a.id === id);
  if (!article && !isNaN(idx)) article = data[idx];

  if (!loadingEl) return;
  loadingEl.remove();

  if (!article) {
    articleContainer.innerHTML = buildErrorState('الخبر غير موجود', 'ربما تم حذفه أو تغيّر رابطه.');
    return;
  }

  /* ── Update page title ── */
  document.title = `${article.title} | مَدخل`;

  /* ── Cover image in hero ── */
  const heroEl = document.getElementById('articleHero');
  if (heroEl) {
    if (article.cover && article.cover.startsWith('http')) {
      heroEl.innerHTML = `
        <img class="article-hero__cover" src="${article.cover}" alt="${article.title}"
          onerror="this.parentElement.innerHTML='<div class=\'article-hero__cover-placeholder\'>${tagEmoji(article.tag)}</div>'"/>
        <div class="article-hero__overlay"></div>`;
    } else {
      heroEl.innerHTML = `<div class="article-hero__cover-placeholder">${tagEmoji(article.tag)}</div>`;
    }
  }

  /* ── Find prev / next ── */
  const currentIdx = data.indexOf(article);
  const prevArt    = data[currentIdx - 1] || null;
  const nextArt    = data[currentIdx + 1] || null;

  /* ── Render article ── */
  const formattedBody = linkifyBody(article.body);
  const prevBtn = prevArt
    ? `<a href="article.html?id=${encodeURIComponent(prevArt.id)}&idx=${prevArt.index}" class="article-nav__btn">→ الخبر السابق</a>`
    : '<span></span>';
  const nextBtn = nextArt
    ? `<a href="article.html?id=${encodeURIComponent(nextArt.id)}&idx=${nextArt.index}" class="article-nav__btn article-nav__btn--primary">التالي ←</a>`
    : '<span></span>';

  articleContainer.innerHTML = `
    <a href="news.html" class="article-back">← العودة للمدونة</a>

    <div class="article-header">
      <div class="article-header__meta">
        <span class="tag ${tagClass(article.tag)}">${tagEmoji(article.tag)} ${article.tag || 'خبر'}</span>
      </div>
      <h1 class="article-header__title">${article.title}</h1>
      <div class="article-author">
        <div class="article-author__avatar">${avatarLetter(article.author)}</div>
        <div>
          <p class="article-author__name">${article.author}</p>
          <p class="article-author__datetime">${formatDate(article.date)}</p>
        </div>
      </div>
    </div>

    <div class="article-divider"></div>

    <div class="article-body">${formattedBody}</div>

    <div class="article-divider"></div>

    <nav class="article-nav" aria-label="التنقل بين الأخبار">
      ${prevBtn}
      ${nextBtn}
    </nav>`;
}

function buildErrorState(title, sub) {
  return `
    <a href="news.html" class="article-back">← العودة للمدونة</a>
    <div class="empty-state" style="display:block">
      <p class="empty-state__icon">😕</p>
      <p class="empty-state__title">${title}</p>
      <p style="font-size:.85rem;color:var(--muted);margin-top:.5rem">${sub}</p>
    </div>`;
}

/* ══════════════════════════════════════════════════════════
   ════════════════════════════════════════════════════════
   INSTRUCTIONS: ربط Google Form → Google Sheets → CSV
   ════════════════════════════════════════════════════════

   STEP 1 — أنشئ Google Form بهذه الحقول (بالضبط):
   ┌──────────────┬─────────────────────────────────────────┐
   │  اسم الحقل   │  ملاحظات                                │
   ├──────────────┼─────────────────────────────────────────┤
   │  العنوان     │  Short answer — إلزامي                  │
   │  الكاتب      │  Short answer — مثال: رائد الزهراني     │
   │  التاريخ     │  Short answer أو Date — مثال: 2026-06-10 │
   │  التاق       │  Dropdown: خبر / إعلان / تنبيه          │
   │  الخبر       │  Paragraph — النص الكامل للخبر          │
   │  الصورة      │  Short answer — رابط postimages مباشر   │
   └──────────────┴─────────────────────────────────────────┘

   STEP 2 — اربط الـ Form بـ Google Sheet:
     في الـ Form → Responses tab → اضغط "Link to Sheets"
     سيُنشئ Sheet بنفس أسماء الأعمدة تلقائياً.

   STEP 3 — انشر الـ Sheet كـ CSV:
     في الـ Sheet:
       File → Share → Publish to web
       اختر: Sheet1  |  Comma-separated values (.csv)
       اضغط Publish وانسخ الرابط.

   STEP 4 — ضع الرابط في المتغير CSV_URL أعلى الملف:
     const CSV_URL = 'https://docs.google.com/spreadsheets/d/XXXX/pub?gid=0&single=true&output=csv';

   STEP 5 — صور الغلاف (postimages):
     1. ارفع الصورة على https://postimages.org
     2. انسخ "Direct link" (ينتهي بـ .jpg أو .png)
     3. ضعه في حقل "الصورة" في الـ Form.

   NOTES:
   ─ البيانات الجديدة تظهر فوراً عند إعادة تحميل الصفحة.
   ─ الأخبار تُرتَّب من الأحدث للأقدم (آخر إدخال في الأعلى).
   ─ إذا لم يكن هناك صورة يظهر emoji الـ tag بدلاً عنها.
   ─ أي رابط داخل نص الخبر يتحول لزر "اضغط للتفاصيل" تلقائياً.

   ════════════════════════════════════════════════════════ */
