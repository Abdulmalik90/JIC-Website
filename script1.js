/* ============================================================
   MADKHAL — Home Page script.js
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   RENDER: NEWS (Horizontal Cards)
   ══════════════════════════════════════════════════════════ */
function renderNews() {
  const track = document.getElementById("news-track");
  if (!track) return;
  track.innerHTML = "";

  // جلب آخر 3 أخبار فقط
  const latestNews = NEWS_DATA.slice(0, 3);

  latestNews.forEach(item => {
    const el = document.createElement("div");
    el.className = "card-horizontal";
    el.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.2rem;">
        <span class="news-item__tag" style="margin:0;">${item.tag}</span>
        <span style="font-size: 1.5rem;">${item.icon}</span>
      </div>
      <h3 class="tool-card__title" style="font-size: 1rem;">${item.title}</h3>
      <p class="tool-card__body" style="font-size: 0.85rem;">${item.body}</p>
      <p class="news-item__meta" style="margin-top:auto; font-size:0.75rem;">${item.meta}</p>
    `;
    track.appendChild(el);
  });
}

/* ══════════════════════════════════════════════════════════
   RENDER: NEWS (Clickable Cards)
   ══════════════════════════════════════════════════════════ */
function renderNews() {
  const track = document.getElementById("news-track");
  if (!track) return;
  track.innerHTML = "";

  let latestNews = [];
  if (typeof getAllNewsArticles === 'function') {
      latestNews = getAllNewsArticles().slice(0, 3);
  } else {
      console.warn("تأكد من استدعاء ملف news-data.js");
      return;
  }

  latestNews.forEach(article => {
    const el = document.createElement("div");
    el.className = "card-horizontal";
    el.style.cursor = "pointer"; // يخلي المؤشر (يد) عشان يبين إنه ينضغط
    
    // حدث الضغط: يحفظ الآي دي ويحولك للخبر
    el.onclick = () => {
        localStorage.setItem('currentArticleId', article.id);
        window.location.href = './newsPage/news.html';
    };
    
    const dateObj = new Date(article.date);
    const formattedDate = dateObj.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    const imgSrc = article.image ? article.image : ''; 
    const imgHtml = imgSrc ? `<img src="${imgSrc}" alt="${article.title}" class="card-news-img">` : `<div class="card-news-img" style="display:flex; align-items:center; justify-content:center; color:var(--clr-text-faint);">لا توجد صورة</div>`;

    el.innerHTML = `
      ${imgHtml}
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.2rem;">
        <span class="news-item__tag" style="margin:0;">${article.category || 'خبر'}</span>
      </div>
      <h3 class="tool-card__title" style="font-size: 1rem;">${article.title}</h3>
      <p class="tool-card__body" style="font-size: 0.85rem;">${article.content.substring(0, 75)}...</p>
      <p class="news-item__meta" style="margin-top:auto; font-size:0.75rem;">${formattedDate}</p>
    `;
    track.appendChild(el);
  });
}

/* ══════════════════════════════════════════════════════════
   RENDER: CALENDAR EVENTS (Safe Date Fix + Adjusted Spacing)
   ══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   RENDER: CALENDAR EVENTS (Fix Spacing Issue)
   ══════════════════════════════════════════════════════════ */
function renderCalendarEvents() {
  const oldContainer = document.getElementById("calender-events");
  if (oldContainer) oldContainer.remove(); 

  const track = document.getElementById("events-track");
  if (!track) return;
  track.innerHTML = "";

  let latestEvents = [];
  if (typeof getAllEvents === 'function') {
      const allEvents = getAllEvents();
      const now = new Date();
      
      const upcomingEvents = allEvents.filter(event => {
          if (!event.date) return true; 
          const dateString = String(event.date).replace(/-/g, '/').replace('T', ' ');
          const targetDate = new Date(dateString);
          if (isNaN(targetDate.getTime())) return true; 
          return (targetDate - now) > -(24 * 60 * 60 * 1000); 
      });
      latestEvents = upcomingEvents.slice(0, 3);
  } else {
      return;
  }

  if (latestEvents.length === 0) {
      track.innerHTML = '<p style="text-align: center; width: 100%; color: var(--clr-text-muted); padding: 2rem;">لا توجد أحداث قادمة حالياً</p>';
      return;
  }

  latestEvents.forEach(ev => {
    let targetDate = new Date().getTime(); 
    let simpleDate = "تاريخ غير محدد";
    
    if(ev.date) {
        const safeDateString = String(ev.date).replace(/-/g, '/').replace('T', ' ');
        targetDate = new Date(safeDateString).getTime();
        simpleDate = String(ev.date).substring(0, 10);
    }
    
    const el = document.createElement("div");
    el.className = "card-horizontal";
    
    // حطينا اليوم والتاريخ داخل div واحد مع flex: 1 عشان يدف العداد لتحت ويلصقون ببعض
    el.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <h3 class="tool-card__title" style="font-size: 1.05rem; color: var(--clr-accent); margin:0;">${ev.title || 'حدث قادم'}</h3>
        <span class="event-item__dot"></span>
      </div>
      
      <div style="margin-top: -0.3rem; flex: 1;">
        <p style="font-size:0.75rem; color:var(--clr-text-faint); margin: 0 0 0.1rem 0;">يوم ${ev.day || ''}</p>
        <p style="font-size: 0.85rem; color: var(--clr-text-muted); margin: 0;">${simpleDate}</p>
      </div>
      
      <div class="countdown-timer" data-date="${targetDate}">
        <div class="cd-box"><span class="cd-num days">00</span><span class="cd-label">يوم</span></div>
        <div class="cd-box"><span class="cd-num hours">00</span><span class="cd-label">ساعة</span></div>
        <div class="cd-box"><span class="cd-num minutes">00</span><span class="cd-label">دقيقة</span></div>
      </div>
    `;
    track.appendChild(el);
  });

  startCountdowns();
}

/* ══════════════════════════════════════════════════════════
   COUNTDOWN TIMER LOGIC (Fix)
   ══════════════════════════════════════════════════════════ */
function startCountdowns() {
  const timers = document.querySelectorAll('.countdown-timer');
  if (timers.length === 0) return;

  function updateAllTimers() {
    const now = new Date().getTime();
    timers.forEach(timer => {
      const targetDate = parseInt(timer.getAttribute('data-date'));
      if (isNaN(targetDate)) return;

      const distance = targetDate - now;

      // إذا انتهى الوقت
      if (distance < 0) {
        timer.innerHTML = '<div class="cd-box"><span class="cd-num" style="color:var(--clr-success); font-size:1rem;">تم الحدث ✓</span></div>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      const daysEl = timer.querySelector('.days');
      const hoursEl = timer.querySelector('.hours');
      const minutesEl = timer.querySelector('.minutes');

      if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
    });
  }

  // تشغيلها فوراً أول مرة عشان ما تصفر
  updateAllTimers();
  // وبعدين تحدث كل ثانية
  setInterval(updateAllTimers, 1000);
}

/* ══════════════════════════════════════════════════════════
   THEME SYSTEM
   ══════════════════════════════════════════════════════════ */
const html           = document.documentElement;
const themeToggle    = document.getElementById("themeToggle");
const themeToggleMb  = document.getElementById("themeToggleMobile");
const themeIcon      = document.getElementById("themeIcon");
const themeIconMb    = document.getElementById("themeIconMobile");
const themeLabel     = document.getElementById("themeLabel");

const THEME_ICONS  = { dark: "☀️", light: "🌙" };
const THEME_LABELS = { dark: "التبديل للوضع النهاري", light: "التبديل للوضع الليلي" };

let currentTheme = localStorage.getItem("madkhal-theme") || "dark";
applyTheme(currentTheme, false);

function applyTheme(theme, animate = true) {
  currentTheme = theme;
  html.setAttribute("data-theme", theme);
  localStorage.setItem("madkhal-theme", theme);

  const icon  = THEME_ICONS[theme];
  const label = THEME_LABELS[theme];

  if (animate) {
    [themeIcon, themeIconMb].forEach(el => {
      el.style.transform = "rotate(360deg) scale(0)";
      el.style.opacity   = "0";
    });
    setTimeout(() => {
      [themeIcon, themeIconMb].forEach(el => {
        el.textContent  = icon;
        el.style.cssText = "transform:rotate(0deg) scale(1); opacity:1; transition: transform .4s cubic-bezier(.34,1.56,.64,1), opacity .3s ease;";
      });
    }, 200);
  } else {
    themeIcon.textContent   = icon;
    themeIconMb.textContent = icon;
  }

  if (themeLabel) themeLabel.textContent = label;
}

function toggleTheme() { applyTheme(currentTheme === "dark" ? "light" : "dark"); }
themeToggle?.addEventListener("click", toggleTheme);
themeToggleMb?.addEventListener("click", toggleTheme);
document.addEventListener("keydown", e => { if (e.shiftKey && e.key === "D") toggleTheme(); });

/* ══════════════════════════════════════════════════════════
   HEADER SCROLL
   ══════════════════════════════════════════════════════════ */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 40);
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   BURGER / MOBILE NAV
   ══════════════════════════════════════════════════════════ */
const burger    = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

burger?.addEventListener("click", () => {
  const open = burger.classList.toggle("is-open");
  mobileNav?.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
});

mobileNav?.querySelectorAll(".mobile-nav__link").forEach(link => {
  link.addEventListener("click", () => {
    burger?.classList.remove("is-open");
    mobileNav.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  });
});

/* ══════════════════════════════════════════════════════════
   DROPDOWN MENUS (desktop keyboard + touch support)
   ══════════════════════════════════════════════════════════ */
document.querySelectorAll(".nav-dropdown").forEach(dd => {
  const btn = dd.querySelector(".nav-link--dropdown");
  btn?.addEventListener("click", () => {
    const isOpen = dd.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", isOpen);
    // Close siblings
    document.querySelectorAll(".nav-dropdown").forEach(other => {
      if (other !== dd) {
        other.classList.remove("is-open");
        other.querySelector(".nav-link--dropdown")?.setAttribute("aria-expanded", "false");
      }
    });
  });
});
document.addEventListener("click", e => {
  if (!e.target.closest(".nav-dropdown")) {
    document.querySelectorAll(".nav-dropdown").forEach(dd => dd.classList.remove("is-open"));
  }
});

/* ══════════════════════════════════════════════════════════
   ACTIVE NAV ON SCROLL
   ══════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link:not(.nav-link--dropdown)");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 130) current = s.id;
  });
  navLinks.forEach(link => {
    const href = (link.getAttribute("href") || "").replace("#", "");
    link.classList.toggle("active", href === current);
  });
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   REVEAL ON SCROLL
   ══════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════════════════════
   COUNTER ANIMATION
   ══════════════════════════════════════════════════════════ */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stats-card__number").forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur    = 1800;
  const start  = performance.now();
  const step   = now => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(2, -10 * p);
    el.textContent = Math.round(e * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

/* ══════════════════════════════════════════════════════════
   TABS (Majors section)
   ══════════════════════════════════════════════════════════ */
document.querySelectorAll(".majors-card").forEach(card => {
  const tabs   = card.querySelectorAll(".tab-btn");
  const panels = card.querySelectorAll(".tab-panel");

  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("tab-btn--active"));
      panels.forEach(p => p.classList.remove("tab-panel--active"));
      btn.classList.add("tab-btn--active");
      const target = card.querySelector(`#${btn.dataset.target}`);
      target?.classList.add("tab-panel--active");
    });
  });
});

/* ══════════════════════════════════════════════════════════
   COOKIE NOTICE
   ══════════════════════════════════════════════════════════ */
(function initCookie() {
  const notice = document.getElementById("cookieNotice");
  const btn    = document.getElementById("cookieAccept");
  if (!notice) return;
  if (localStorage.getItem("madkhal-cookie-ok")) {
    notice.classList.add("is-hidden");
    return;
  }
  btn?.addEventListener("click", () => {
    localStorage.setItem("madkhal-cookie-ok", "1");
    notice.style.transition = "opacity .4s ease, transform .4s ease";
    notice.style.opacity    = "0";
    notice.style.transform  = "translateY(10px)";
    setTimeout(() => notice.classList.add("is-hidden"), 420);
  });
})();

/* ══════════════════════════════════════════════════════════
   BACK TO TOP
   ══════════════════════════════════════════════════════════ */
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  backToTop?.classList.toggle("is-visible", window.scrollY > 400);
}, { passive: true });
backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ══════════════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL
   ══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }
  });
});

/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  renderNews();
  renderCalendarEvents();
});
