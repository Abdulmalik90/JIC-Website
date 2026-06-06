/* ============================================================
   MADKHAL × JIC — script.js
   ============================================================ */

/* ── THEME SYSTEM ────────────────────────────────────────── */
const html          = document.documentElement;
const themeToggle   = document.getElementById('themeToggle');
const themeToggleMb = document.getElementById('themeToggleMobile');
const themeIcon     = document.getElementById('themeIcon');
const themeIconMb   = document.getElementById('themeIconMobile');
const themeLabel    = document.getElementById('themeLabel');

const ICONS  = { dark: '☀️', light: '🌙' };
const LABELS = { dark: 'التبديل للوضع النهاري', light: 'التبديل للوضع الليلي' };

// Persist preference
let currentTheme = localStorage.getItem('jic-theme') || 'dark';
applyTheme(currentTheme, false);

function applyTheme(theme, animate = true) {
  currentTheme = theme;
  html.setAttribute('data-theme', theme);
  localStorage.setItem('jic-theme', theme);

  const icon  = ICONS[theme];
  const label = LABELS[theme];

  if (animate) {
    // Spin animation on icon
    [themeIcon, themeIconMb].forEach(el => {
      el.style.transform = 'rotate(360deg) scale(0)';
      el.style.opacity   = '0';
    });
    setTimeout(() => {
      [themeIcon, themeIconMb].forEach(el => {
        el.textContent     = icon;
        el.style.transform = 'rotate(0deg) scale(1)';
        el.style.opacity   = '1';
        el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease';
      });
    }, 200);
  } else {
    themeIcon.textContent   = icon;
    themeIconMb.textContent = icon;
  }

  themeLabel.textContent = label;
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

themeToggle.addEventListener('click', toggleTheme);
themeToggleMb.addEventListener('click', toggleTheme);

// Keyboard shortcut: Shift + D
document.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.key === 'D') toggleTheme();
});

/* ── HEADER SCROLL ───────────────────────────────────────── */
const header = document.getElementById('header');

const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── MOBILE BURGER ───────────────────────────────────────── */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  const isOpen = burger.classList.toggle('is-open');
  mobileNav.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  burger.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
});

mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'فتح القائمة');
  });
});

/* ── ACTIVE NAV ON SCROLL ────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const activateNavLink = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href').replace('#','') === current);
  });
};
window.addEventListener('scroll', activateNavLink, { passive: true });

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── COUNTER ANIMATION ───────────────────────────────────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-card__number').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start    = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ── CALCULATOR ──────────────────────────────────────────── */
const calcForm   = document.getElementById('calcForm');
const calcResult = document.getElementById('calcResult');
const calcError  = document.getElementById('calcError');
const calcBtn    = document.getElementById('calcBtn');
const resetBtn   = document.getElementById('resetBtn');
const resultScore = document.getElementById('resultScore');
const resultArc   = document.getElementById('resultArc');
const resultBadge = document.getElementById('resultBadge');
const resultNote  = document.getElementById('resultNote');
const gpaInput     = document.getElementById('gpa');
const qudratInput  = document.getElementById('qudrat');
const tahsiliInput = document.getElementById('tahsili');

const CIRCUMFERENCE = 2 * Math.PI * 50; // ≈ 314.16

function calculate() {
  hideError();
  [gpaInput, qudratInput, tahsiliInput].forEach(i => i.classList.remove('is-error'));

  const gpa     = parseFloat(gpaInput.value);
  const qudrat  = parseFloat(qudratInput.value);
  const tahsili = parseFloat(tahsiliInput.value);

  // Empty check
  if (isNaN(gpa) || isNaN(qudrat) || isNaN(tahsili)) {
    showError('⚠️ الرجاء تعبئة جميع الحقول قبل الحساب.');
    if (isNaN(gpa))     gpaInput.classList.add('is-error');
    if (isNaN(qudrat))  qudratInput.classList.add('is-error');
    if (isNaN(tahsili)) tahsiliInput.classList.add('is-error');
    return;
  }

  // Range check
  const bad = [
    { val: gpa,     label: 'الثانوية',  el: gpaInput     },
    { val: qudrat,  label: 'القدرات',   el: qudratInput  },
    { val: tahsili, label: 'التحصيلي', el: tahsiliInput },
  ].filter(f => f.val < 0 || f.val > 100);

  if (bad.length) {
    showError(`⚠️ القيمة المدخلة لـ (${bad.map(f => f.label).join(' و ')}) خارج النطاق 0–100.`);
    bad.forEach(f => f.el.classList.add('is-error'));
    return;
  }

  const weighted = (gpa * 0.20) + (qudrat * 0.30) + (tahsili * 0.50);
  showResult(Math.round(weighted * 100) / 100);
}

function showResult(score) {
  resultArc.style.strokeDashoffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
  animateScoreText(score);
  updateBadge(score);

  calcForm.style.display = 'none';
  calcResult.hidden = false;
  calcResult.style.opacity = '0';
  calcResult.style.transform = 'scale(0.95)';
  requestAnimationFrame(() => {
    calcResult.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    calcResult.style.opacity = '1';
    calcResult.style.transform = 'scale(1)';
  });
}

function animateScoreText(target) {
  const duration = 1200;
  const start    = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(2, -10 * progress);
    resultScore.textContent = (eased * target).toFixed(progress < 1 ? 0 : 2);
    if (progress < 1) requestAnimationFrame(step);
    else resultScore.textContent = target.toFixed(2);
  };
  requestAnimationFrame(step);
}

function updateBadge(score) {
  resultBadge.className = 'result-meta__badge';
  if (score >= 86) {
    resultBadge.classList.add('badge--excellent');
    resultBadge.textContent = '🏆 ممتاز';
    resultNote.textContent  = 'ممتـاز ! عندك فرصة كبيرة تنقبل بالكلية فالك التوفيق ياصاحبي.';
  } else if (score >= 67) {
    resultBadge.classList.add('badge--good');
    resultBadge.textContent = '✅ جيد';
    resultNote.textContent  = 'درجتك جيـدة. فرصتـك في القبول اعلى لو انك من خريجي الجبيل الصناعية.';
  } else {
    resultBadge.classList.add('badge--low');
    resultBadge.textContent = '📈 بحاجة لتحسين';
    resultNote.textContent  = 'فالك التوفيق بالقبول ! حاول ترفع درجاتك بالقدرات والتحصيلي لو فيه وقت.';
  }
}

function resetCalculator() {
  [gpaInput, qudratInput, tahsiliInput].forEach(i => { i.value = ''; i.classList.remove('is-error'); });
  resultArc.style.strokeDashoffset = CIRCUMFERENCE;
  resultScore.textContent = '—';
  calcResult.hidden = true;
  calcForm.style.display = '';
  hideError();
}

function showError(msg) { calcError.textContent = msg; calcError.hidden = false; }
function hideError()    { calcError.textContent = '';  calcError.hidden = true;  }

calcBtn.addEventListener('click', calculate);
resetBtn.addEventListener('click', resetCalculator);

[gpaInput, qudratInput, tahsiliInput].forEach(input => {
  input.addEventListener('keydown', e => { if (e.key === 'Enter') calculate(); });
  input.addEventListener('input',   () => {
    const v = parseFloat(input.value);
    if (!isNaN(v) && v >= 0 && v <= 100) input.classList.remove('is-error');
  });
});

/* ── SMOOTH ANCHORS ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});
