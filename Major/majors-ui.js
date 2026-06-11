/* ============================================================
   MADKHAL — majors-ui.js
   Shared UI engine for bMajors / depMajors / JTImajors
   ============================================================
   HOW IT WORKS
   ─────────────
   Each page loads TWO scripts in order:
     1. majors-ui.js          ← this file (engine)
     2. [page]-data.js        ← your existing data file

   Your data file must call  initMajors(config, majors)
   at the end, passing the config object and majors array.
   See DATA CONTRACT section at the bottom for the shape.
   ============================================================ */

/* ══ THEME ══════════════════════════════════════════════════ */
const html          = document.documentElement;
const themeToggle   = document.getElementById('themeToggle');
const themeToggleMb = document.getElementById('themeToggleMobile');
const themeIcon     = document.getElementById('themeIcon');
const themeIconMb   = document.getElementById('themeIconMobile');
const themeLabel    = document.getElementById('themeLabel');

const THEME_ICONS  = { dark: '☀️', light: '🌙' };
const THEME_LABELS = { dark: 'التبديل للوضع النهاري', light: 'التبديل للوضع الليلي' };

let currentTheme = localStorage.getItem('madkhal-theme') || 'dark';
applyTheme(currentTheme, false);

function applyTheme(theme, animate = true) {
  currentTheme = theme;
  html.setAttribute('data-theme', theme);
  localStorage.setItem('madkhal-theme', theme);
  const icon = THEME_ICONS[theme];
  if (animate) {
    [themeIcon, themeIconMb].forEach(el => {
      el.style.transform = 'rotate(360deg) scale(0)';
      el.style.opacity   = '0';
    });
    setTimeout(() => {
      [themeIcon, themeIconMb].forEach(el => {
        el.textContent   = icon;
        el.style.cssText = 'transform:rotate(0)scale(1);opacity:1;transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .3s ease';
      });
    }, 200);
  } else {
    themeIcon.textContent   = icon;
    themeIconMb.textContent = icon;
  }
  if (themeLabel) themeLabel.textContent = THEME_LABELS[theme];
}
const toggleTheme = () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
themeToggle?.addEventListener('click', toggleTheme);
themeToggleMb?.addEventListener('click', toggleTheme);
document.addEventListener('keydown', e => { if (e.shiftKey && e.key === 'D') toggleTheme(); });

/* ══ HEADER SCROLL ══════════════════════════════════════════ */
const headerEl = document.getElementById('header');
window.addEventListener('scroll', () => {
  headerEl?.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

/* ══ BURGER ═════════════════════════════════════════════════ */
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

/* ══ REVEAL ═════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════════════════════
   CATEGORY MAP — icon + Arabic label
══════════════════════════════════════════════════════════ */
const CAT_META = {
  engineering: { icon: '⚙️', label: 'هندسة',         color: 'engineering' },
  it:          { icon: '💻', label: 'تقنية معلومات',  color: 'it'          },
  industrial:  { icon: '🔧', label: 'فني',          color: 'industrial'  },
  science:     { icon: '🧪', label: 'تطبيقي',   color: 'science'     },
  other:       { icon: '📋', label: 'أخرى',           color: 'other'       },
};

/* ══════════════════════════════════════════════════════════
   RENDER ENGINE
══════════════════════════════════════════════════════════ */
let allMajors   = [];
let activeFilter = 'all';
let searchQuery  = '';

/**
 * Entry point — called by your data file.
 * @param {Object} config  - page-level metadata
 * @param {Array}  majors  - array of major objects
 */
function initMajors(config, majors) {
  allMajors = majors;

  /* Hero sub-text override */
  const heroSub = document.getElementById('heroSub');
  if (heroSub && config.subtitle) heroSub.textContent = config.subtitle;

  /* Build stats chips */
  buildStats(majors, config);

  /* Build scroll strip */
  buildStrip(majors);

  /* Build filter buttons from unique categories in data */
  buildFilters(majors);

  /* Initial render */
  renderGrid(majors);

  /* Search */
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  searchInput?.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    searchClear?.classList.toggle('show', searchQuery.length > 0);
    renderGrid(filtered());
  });
  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.classList.remove('show');
    renderGrid(filtered());
    searchInput.focus();
  });

  /* Filter buttons */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.filter === activeFilter)
    );
    renderGrid(filtered());
  });
}

/* ── Stats row ── */
function buildStats(majors, config) {
  const row = document.getElementById('statsRow');
  if (!row) return;

  const cats = [...new Set(majors.map(m => m.category))].length;
  const chips = [
    { icon: '🎓', label: 'تخصص', value: majors.length },
    { icon: '🗂️', label: 'تصنيف', value: cats },
  ];
  if (config.degreeLabel) chips.push({ icon: '📜', label: 'الدرجة', value: config.degreeLabel });
  if (config.institute)   chips.push({ icon: '🏛️', label: '',        value: config.institute });

  row.innerHTML = chips.map(c =>
    `<div class="stat-chip"><span>${c.icon}</span><strong>${c.value}</strong>${c.label ? `<span>${c.label}</span>` : ''}</div>`
  ).join('');
}

/* ── Scroll strip ── */
function buildStrip(majors) {
  const inner = document.getElementById('stripInner');
  if (!inner) return;
  const items = majors.map(m => `<span>${CAT_META[m.category]?.icon || '📋'} ${m.name}</span>`).join('');
  inner.innerHTML = items + items; /* duplicate for seamless loop */
}

/* ── Filter buttons ── */
function buildFilters(majors) {
  const container = document.getElementById('filterBtns');
  if (!container) return;
  const cats = [...new Set(majors.map(m => m.category))];
  container.innerHTML = cats.map(cat => {
    const meta = CAT_META[cat] || { icon: '📋', label: cat };
    return `<button class="filter-btn" data-filter="${cat}">${meta.icon} ${meta.label}</button>`;
  }).join('');
}

/* ── Filter + search ── */
function filtered() {
  return allMajors.filter(m => {
    const matchCat    = activeFilter === 'all' || m.category === activeFilter;
    const searchTarget = `${m.name} ${m.nameEn || ''} ${m.description || ''} ${m.tags?.join(' ') || ''}`.toLowerCase();
    const matchSearch  = !searchQuery || searchTarget.includes(searchQuery);
    return matchCat && matchSearch;
  });
}

/* ── Render grid ── */
function renderGrid(majors) {
  const grid     = document.getElementById('majorsGrid');
  const noResults = document.getElementById('noResults');
  const meta      = document.getElementById('resultsMeta');
  if (!grid) return;

  /* Remove skeletons + old cards (keep noResults) */
  [...grid.querySelectorAll('.major-card, .skeleton')].forEach(el => el.remove());
  noResults?.classList.toggle('show', majors.length === 0);

  if (meta) {
    const total = allMajors.length;
    meta.innerHTML = majors.length === total
      ? `عرض <strong>${total}</strong> تخصص`
      : `عرض <strong>${majors.length}</strong> من أصل <strong>${total}</strong> تخصص`;
  }

  majors.forEach((major, i) => {
    const card = buildCard(major, i);
    grid.insertBefore(card, noResults);
  });

  /* Stagger animation */
  grid.querySelectorAll('.major-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.05}s`;
  });
}

/* ── Build a single card ── */
function buildCard(m, index) {
  const cat   = CAT_META[m.category] || { icon: '📋', label: m.category, color: 'other' };
  const card  = document.createElement('div');
  card.className    = 'major-card';
  card.dataset.cat  = m.category || 'other';

  /* Info chips */
  const chips = [];
  if (m.hours)    chips.push(`<span class="info-chip"><span class="info-chip__icon">⏱️</span>${m.hours} ساعة</span>`);
  if (m.years)    chips.push(`<span class="info-chip"><span class="info-chip__icon">📅</span>${m.years} سنوات</span>`);
  
  const semCount = Array.isArray(m.semesters) ? m.semesters.filter(s => s.semester > 0).length : m.semesters;
  if (semCount)   chips.push(`<span class="info-chip"><span class="info-chip__icon">📆</span>${semCount} فصول</span>`);
  
  if (m.track)    chips.push(`<span class="info-chip"><span class="info-chip__icon">🛤️</span>${m.track}</span>`);
  if (m.language) chips.push(`<span class="info-chip"><span class="info-chip__icon">🌐</span>${m.language}</span>`);

  /* Badges */
  const badges = [
    m.degree  ? `<span class="tag tag--degree">${m.degree}</span>` : '',
    `<span class="tag tag--cat">${cat.icon} ${cat.label}</span>`,
    m.isNew   ? `<span class="tag tag--new">✨ جديد</span>` : '',
  ].filter(Boolean).join('');

  /* Action buttons */
  const planBtn = m.planUrl
    ? `<a href="${m.planUrl}" class="btn-plan" target="_blank" rel="noopener">📄 الخطة الدراسية</a>`
    : '';
  
  // إذا فيه مصفوفة فصول، يفتح صفحة الجدول، وإلا يفتح الرابط الافتراضي
  const moreBtn = Array.isArray(m.semesters)
    ? `<button class="btn-plan btn-plan--ghost view-courses-btn" style="cursor:pointer;">📋 تفاصيل المواد</button>`
    : (m.detailUrl ? `<a href="${m.detailUrl}" class="btn-plan btn-plan--ghost" target="_blank" rel="noopener">تفاصيل</a>` : '');

  card.innerHTML = `
    <div class="major-card__bar"></div>
    <div class="major-card__head">
      <div class="major-card__icon">${cat.icon}</div>
      <div class="major-card__badges">${badges}</div>
    </div>
    <div class="major-card__body">
      <h3 class="major-card__name">${m.name}</h3>
      ${m.nameEn ? `<p class="major-card__name-en">${m.nameEn}</p>` : ''}
      ${m.description ? `<p class="major-card__desc">${m.description}</p>` : ''}
      ${chips.length ? `<div class="major-card__info">${chips.join('')}</div>` : ''}
    </div>
    ${(planBtn || moreBtn) ? `<div class="major-card__footer">${planBtn}${moreBtn}</div>` : ''}`;

  /* حدث الضغط ونقل البيانات للجلسة */
 /* حدث الضغط لفتح النافذة المنبثقة بدال الانتقال لصفحة ثانية */
  if (Array.isArray(m.semesters)) {
    setTimeout(() => {
      card.querySelector('.view-courses-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        openMajorModal(m); // نستدعي دالة النافذة
      });
    }, 0);
  }

  return card;
}
/* ── دالة النافذة المنبثقة (Modal) لعرض المواد ── */
function openMajorModal(major) {
  let modal = document.getElementById('majorModalOverlay');
  
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'majorModalOverlay';
    modal.className = 'major-modal-overlay';
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // حساب مجموع الساعات (تتجاهل الفصل 0)
  let totalHours = 0;
  if (major.semesters && major.semesters.length) {
    totalHours = major.semesters
      .filter(sem => sem.semester !== 0)
      .reduce((total, sem) => {
        const semHours = sem.courses.reduce((sum, course) => {
          const credits = Number(course[1]) || 0; // نتأكد إنها رقم
          return sum + credits;
        }, 0);
        return total + semHours;
      }, 0);
  }

  // بناء الهيدر مع التاجات الجديدة
  let htmlContent = `
    <div class="major-modal-content">
      <button class="major-modal-close" onclick="closeModal()">✖</button>
      
      <div class="major-modal-header">
        <h2>${major.name}</h2>
        ${major.nameEn ? `<p>${major.nameEn}</p>` : ''}
        <div style="display: flex; gap: 8px; justify-content: center; margin-top: 12px; flex-wrap: wrap;">
          <span class="tag tag--degree">${major.degree}</span>
          ${totalHours > 0 ? `<span class="tag tag--cat">⏱️ مجموع الساعات: ${totalHours}</span>` : ''}
          ${major.lastUpdated ? `<span class="tag tag--cat">📅 آخر تحديث للخطة: ${major.lastUpdated}</span>` : ''}
        </div>
      </div>
  `;

  if (!major.semesters || !major.semesters.length) {
    htmlContent += `<div style="text-align: center; padding: 2rem; color: var(--muted);">لا توجد خطة مواد متوفرة حالياً.</div>`;
  } else {
    major.semesters.forEach(sem => {
      const title = sem.semester === 0 ? "المواد الاختيارية (Electives)" : `الفصل الدراسي ${sem.semester}`;
      
      htmlContent += `
        <div class="major-modal-section">
          <h3>${title}</h3>
          <div class="major-modal-table-wrap">
            <table class="major-modal-table">
              <thead>
                <tr>
                  <th>اسم المادة (Course)</th>
                  <th style="text-align: center;">الساعات</th>
                  <th>المتطلب السابق</th>
                </tr>
              </thead>
              <tbody>
                ${sem.courses.map(course => `
                  <tr>
                    <td>${course[0]}</td>
                    <td class="credits">${course[1]}</td>
                    <td class="prereq">${(course[4] && course[4].length) ? course[4].join(', ') : '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    });
  }

  htmlContent += `</div>`;
  modal.innerHTML = htmlContent;

  setTimeout(() => {
    modal.classList.add('is-active');
  }, 10);
}

function closeModal() {
  const modal = document.getElementById('majorModalOverlay');
  if (modal) modal.classList.remove('is-active');
}

/* ══════════════════════════════════════════════════════════
   DATA CONTRACT
   ════════════════════════════════════════════════════════

   Your data file (e.g. bMajors-data.js) must call:

     initMajors(config, majors);

   ── config object ──────────────────────────────────────
   {
     subtitle:     "جميع تخصصات كلية الجبيل الصناعية …",  // optional hero sub override
     degreeLabel:  "بكالوريوس",                             // shown in stats chip
     institute:    "كلية الجبيل الصناعية"                   // shown in stats chip
   }

   ── majors array (each item) ───────────────────────────
   {
     name:        "هندسة الميكانيكا التطبيقية",   // REQUIRED — Arabic name
     nameEn:      "Applied Mechanical Engineering", // optional English name
     category:    "engineering",                    // REQUIRED — see categories below
     degree:      "بكالوريوس",                      // shown as badge
     description: "وصف مختصر للتخصص…",             // optional
     hours:       132,                              // optional — credit hours
     years:       4,                                // optional — programme years
     semesters:   8,                                // optional — number of semesters
     track:       "هندسة",                          // optional — track / pathway name
     language:    "الإنجليزية",                     // optional — language of instruction
     planUrl:     "https://…",                      // optional — study plan PDF/page
     detailUrl:   "https://…",                      // optional — major detail page
     isNew:       false                             // optional — show "جديد" badge
   }

   ── valid categories ───────────────────────────────────
   "engineering"  →  ⚙️  هندسة
   "it"           →  💻  تقنية معلومات
   "industrial"   →  🔧  صناعي
   "science"      →  🧪  علوم تطبيقية
   "other"        →  📋  أخرى

   You can add new categories by editing CAT_META in majors-ui.js.

   ── Minimal example data file ──────────────────────────

   initMajors(
     {
       degreeLabel: "بكالوريوس",
       institute:   "كلية الجبيل الصناعية"
     },
     [
       {
         name:        "هندسة ميكانيكا تطبيقية",
         nameEn:      "Applied Mechanical Engineering",
         category:    "engineering",
         degree:      "بكالوريوس",
         description: "يُعنى بتصميم الأنظمة الميكانيكية وتحليلها في البيئات الصناعية.",
         hours:       132,
         years:       4,
         planUrl:     "https://juportal.online/…/plan.pdf"
       },
       {
         name:     "تقنية المعلومات",
         nameEn:   "Information Technology",
         category: "it",
         degree:   "بكالوريوس",
         hours:    128,
         years:    4
       }
     ]
   );

══════════════════════════════════════════════════════════ */
