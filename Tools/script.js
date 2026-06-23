/* ============================================================
   MADKHAL — Tools Page script.js
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════ */
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
        el.textContent  = icon;
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

/* ══════════════════════════════════════════════════════════
   HEADER SCROLL
══════════════════════════════════════════════════════════ */
const headerEl = document.getElementById('header');
window.addEventListener('scroll', () => {
  headerEl?.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

/* ══════════════════════════════════════════════════════════
   BURGER / MOBILE NAV
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
   TAB SWITCHER
══════════════════════════════════════════════════════════ */
function switchTab(tabId) {
  document.querySelectorAll('.tool-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tabId)
  );
  document.querySelectorAll('.tool-panel').forEach(p =>
    p.classList.toggle('active', p.id === `${tabId}-panel`)
  );
  document.querySelector('.tool-tabs-wrap')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('[data-tab]').forEach(el => {
  el.addEventListener('click', e => {
    if (el.tagName === 'A') e.preventDefault();
    switchTab(el.dataset.tab);
    // close mobile nav if open
    burger?.classList.remove('is-open');
    mobileNav?.classList.remove('is-open');
  });
});

/* ══════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════ */
function showErr(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
}
function clearErr(elId) {
  const el = document.getElementById(elId);
  if (el) { el.textContent = ''; el.classList.remove('show'); }
}
function animateNum(elId, target, decimals = 2, duration = 1200) {
  const el = document.getElementById(elId);
  if (!el) return;
  const start = performance.now();
  const step  = now => {
    const p = Math.min((now - start) / duration, 1);
    const e = 1 - Math.pow(2, -10 * p);
    el.textContent = (e * target).toFixed(decimals);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(decimals);
  };
  requestAnimationFrame(step);
}

/* ══════════════════════════════════════════════════════════
   ── TOOL 1: GPA CALCULATOR ─────────────────────────────
   Supports scale 4.00 or 5.00
   Grade points follow JIC/JTI official table
══════════════════════════════════════════════════════════ */

/* ── Grade tables ─────────────────────────────────────── */
const GRADE_PTS_4 = {
  'A+': 4.00, 'A': 3.75,
  'B+': 3.50, 'B': 3.00,
  'C+': 2.50, 'C': 2.00,
  'D+': 1.50, 'D': 1.00,
  'F':  0.00
};

/* Scale-5 keeps same letter names, values proportionally mapped */
const GRADE_PTS_5 = {
  'A+': 5.00, 'A': 4.75,
  'B+': 4.50, 'B': 4.00,
  'C+': 3.50, 'C': 3.00,
  'D+': 2.50, 'D': 2.00,
  'F':  0.00
};

let currentScale   = 4;
let currentGradePts = { ...GRADE_PTS_4 };

/* ── Scale toggle ── */
document.getElementById('scaleToggle')?.addEventListener('click', e => {
  const btn = e.target.closest('.scale-btn');
  if (!btn) return;
  currentScale = parseInt(btn.dataset.scale);
  currentGradePts = currentScale === 5 ? { ...GRADE_PTS_5 } : { ...GRADE_PTS_4 };

  document.querySelectorAll('.scale-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.scale === String(currentScale))
  );
  document.getElementById('scaleHint').textContent =
    currentScale === 5
      ? 'نظام 5.00 — بعض البرامج وكليات خارج الهيئة الملكية'
      : 'نظام 4.00 — المستخدم في كليات ومعاهد الهيئة الملكية بالجبيل';
  document.getElementById('gpaRingUnit').textContent = `/ ${currentScale}.00`;

  /* Rebuild all grade dropdowns with new values */
  document.querySelectorAll('.course-grade-select').forEach(sel => {
    const current = sel.value;
    sel.innerHTML = buildGradeOptions(current);
  });

  /* Reset result */
  document.getElementById('gpaResult').classList.remove('show');
  document.getElementById('gpaRingFill').style.strokeDashoffset = 283;
  clearErr('gpaError');
});

/* ── Build grade <option> HTML ── */
function buildGradeOptions(selected = '') {
  return `<option value="" disabled ${!selected ? 'selected' : ''}>الدرجة</option>` +
    Object.entries(currentGradePts).map(([g, p]) =>
      `<option value="${g}" ${g === selected ? 'selected' : ''}>${g} (${p.toFixed(2)})</option>`
    ).join('');
}

/* ── Badge mapping ── */
function gradeBadge(gpa, scale) {
  const ratio = gpa / scale;
  if (ratio >= 0.94) return { cls: 'res-badge--a', text: '🏆 ممتاز',       note: 'أداء استثنائي! حافظ على هذا المستوى.' };
  if (ratio >= 0.75) return { cls: 'res-badge--b', text: '✅ جيد جداً',     note: 'أداء قوي، مزيد من الجهد يوصلك للتميز.' };
  if (ratio >= 0.50) return { cls: 'res-badge--c', text: '📈 جيد / مقبول',  note: 'أداء مقبول، حاول تحسين مادة أو اثنتين.' };
  return                    { cls: 'res-badge--d', text: '⚠️ بحاجة لتحسين', note: 'انتبه لشرط الاستمرارية، تواصل مع مرشدك.' };
}

/* ── Render result ── */
function renderGpaResult(semGpa, cumGpa, totalHrs) {
  const circ  = 283;
  const main  = cumGpa !== null ? cumGpa : semGpa;
  const capped = Math.min(main, currentScale);
  const offset = circ - (capped / currentScale) * circ;

  document.getElementById('gpaRingFill').style.strokeDashoffset = offset;
  document.getElementById('gpaRingUnit').textContent = `/ ${currentScale}.00`;
  animateNum('gpaRingVal', capped, 2);

  document.getElementById('gpaSemVal').textContent   = semGpa.toFixed(2);
  document.getElementById('gpaCumVal').textContent   = cumGpa !== null ? cumGpa.toFixed(2) : '—';
  document.getElementById('gpaTotalHrs').textContent = totalHrs ? `${totalHrs} س` : '—';

  const b = gradeBadge(main, currentScale);
  const badge = document.getElementById('gpaBadge');
  badge.className   = 'res-badge ' + b.cls;
  badge.textContent = b.text;
  document.getElementById('gpaNote').textContent = b.note;

  const block = document.getElementById('gpaResult');
  block.classList.add('show');
  block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ── Courses list ── */
const coursesList = document.getElementById('coursesList');
let courseCounter = 0;

function addCourse(name = '', hrs = '', grade = '') {
  courseCounter++;
  const row = document.createElement('div');
  row.className   = 'course-row';
  row.dataset.cid = courseCounter;
  row.innerHTML = `
    <input  type="text"   class="course-input"
            placeholder="اسم المادة (اختياري)" value="${name}"/>
    <input  type="number" class="course-input course-input--num"
            placeholder="ساعات" min="1" max="9" value="${hrs}" inputmode="numeric"/>
    <select class="course-grade-select">
      ${buildGradeOptions(grade)}
    </select>
    <button class="course-del" title="حذف" aria-label="حذف">🗑</button>`;
  row.querySelector('.course-del').addEventListener('click', () => row.remove());
  coursesList.appendChild(row);
}

/* Init 3 default rows */
addCourse('', '3', '');
addCourse('', '3', '');
addCourse('', '3', '');

document.getElementById('addCourseBtn').addEventListener('click', () => addCourse());

/* ── Carry-over toggle ── */
const carryOver = document.getElementById('carryOver');
document.getElementById('carryToggle')?.addEventListener('click', () => {
  carryOver.classList.toggle('is-open');
});

/* ── Calculate ── */
document.getElementById('calcGpaBtn').addEventListener('click', () => {
  clearErr('gpaError');

  /* 1. Collect courses */
  const rows = [...coursesList.querySelectorAll('.course-row')];
  if (!rows.length) { showErr('gpaError', 'أضف مادة واحدة على الأقل'); return; }

  let qpSum = 0, hrSum = 0, hasEmpty = false;
  rows.forEach(row => {
    const hrs   = parseFloat(row.querySelectorAll('input')[1].value);
    const grade = row.querySelector('select').value;
    if (!grade || isNaN(hrs) || hrs <= 0) { hasEmpty = true; return; }
    qpSum += hrs * currentGradePts[grade];
    hrSum += hrs;
  });

  if (hasEmpty || hrSum === 0) {
    showErr('gpaError', 'تأكد من إدخال الساعات والدرجة لكل مادة');
    return;
  }

  const semGpa = qpSum / hrSum;

  /* 2. Carry-over: prefer QP over GPA if both entered */
  const prevH  = parseFloat(document.getElementById('prevHours').value) || 0;
  const prevQP = parseFloat(document.getElementById('prevQP').value);
  const prevG  = parseFloat(document.getElementById('prevGPA').value);

  let cumGpa   = null;
  let totalHrs = hrSum;

  if (prevH > 0) {
    let prevQualityPoints = 0;

    if (!isNaN(prevQP) && prevQP >= 0) {
      /* Use raw QP directly */
      prevQualityPoints = prevQP;
    } else if (!isNaN(prevG) && prevG >= 0 && prevG <= currentScale) {
      /* Derive QP from GPA × hours */
      prevQualityPoints = prevG * prevH;
    } else {
      showErr('gpaError', 'أدخل المعدل التراكمي السابق أو مجموع نقاط الجودة مع الساعات السابقة');
      return;
    }

    totalHrs += prevH;
    cumGpa    = (qpSum + prevQualityPoints) / totalHrs;
  }

  renderGpaResult(semGpa, cumGpa, totalHrs);
});

/* ── GPA Reset ── */
document.getElementById('gpaResetBtn').addEventListener('click', () => {
  document.getElementById('gpaResult').classList.remove('show');
  document.getElementById('gpaRingFill').style.strokeDashoffset = 283;
});

/* ══════════════════════════════════════════════════════════
   ── TOOL 2: ABSENCE CALCULATOR ─────────────────────────
   Formula: floor( weeks × lecPerWeek × 0.20 )
   DN threshold = maxAbs + 1
══════════════════════════════════════════════════════════ */
document.getElementById('calcAbsBtn').addEventListener('click', () => {
  clearErr('absError');
  const lec   = parseInt(document.getElementById('absLec').value);
  const weeks = parseInt(document.getElementById('absWeeks').value) || 7;
  const curr  = parseInt(document.getElementById('absCurrent').value);

  if (isNaN(lec) || lec < 1) { showErr('absError', 'أدخل عدد المحاضرات أسبوعياً'); return; }

  const total  = weeks * lec;
  const maxAbs = Math.floor(total * 0.20);
  const dnAbs  = maxAbs + 1;

  document.getElementById('absMaxVal').textContent = maxAbs;
  document.getElementById('absDnVal').textContent  = dnAbs;

  const remainBox = document.getElementById('absRemainBox');
  const overBox   = document.getElementById('absOverBox');
  const progressW = document.getElementById('absProgressWrap');

  remainBox.style.display = 'none';
  overBox.style.display   = 'none';
  progressW.style.display = 'none';

  if (!isNaN(curr) && curr >= 0) {
    const remaining = maxAbs - curr;
    progressW.style.display = '';
    document.getElementById('absProgressLabel').textContent = `${curr} / ${maxAbs}`;
    const pct  = Math.min((curr / maxAbs) * 100, 100);
    const fill = document.getElementById('absProgressFill');
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = pct + '%'; }, 50);
    fill.classList.toggle('is-danger', pct >= 100);
    fill.classList.toggle('is-warn',   pct >= 75 && pct < 100);

    if (remaining >= 0) {
      document.getElementById('absRemainVal').textContent = remaining;
      remainBox.style.display = '';
      remainBox.className = 'abs-stat ' + (remaining <= 2 ? 'abs-stat--danger' : (remaining <= 4 ? 'abs-stat--warn' : 'abs-stat--accent'));
    } else {
      document.getElementById('absOverVal').textContent = Math.abs(remaining);
      overBox.style.display = '';
    }
  }

  const block = document.getElementById('absResult');
  block.classList.add('show');
  block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.getElementById('absResetBtn').addEventListener('click', () => {
  document.getElementById('absResult').classList.remove('show');
  document.getElementById('absLec').value = '';
  document.getElementById('absCurrent').value = '';
  document.getElementById('absWeeks').value = '15';
});

/* ══════════════════════════════════════════════════════════
   ── TOOL 3: SCORE CONVERTER ─────────────────────────────
   Formula: (score / outOf) × realMax
══════════════════════════════════════════════════════════ */
function calcConv() {
  clearErr('convError');
  const score   = parseFloat(document.getElementById('convScore').value);
  const outOf   = parseFloat(document.getElementById('convOutOf').value);
  const realMax = parseFloat(document.getElementById('convRealMax').value);

  if (isNaN(score) || isNaN(outOf) || isNaN(realMax)) {
    showErr('convError', 'الرجاء تعبئة جميع الحقول الثلاثة'); return;
  }
  if (outOf <= 0 || realMax <= 0) {
    showErr('convError', 'الدرجة الكاملة والدرجة الحقيقية يجب أن تكونا أكبر من صفر'); return;
  }
  if (score < 0) {
    showErr('convError', 'العلامة لا يمكن أن تكون سالبة'); return;
  }
  if (score > outOf) {
    showErr('convError', 'علامتك لا يمكن أن تتجاوز الدرجة الكاملة'); return;
  }

  const real        = (score / outOf) * realMax;
  const realRounded = Math.round(real * 1000) / 1000;

  document.getElementById('convResScore').textContent   = score;
  document.getElementById('convResOutOf').textContent   = outOf;
  document.getElementById('convResBig').textContent     = realRounded;
  document.getElementById('convResRealMax').textContent = realMax;
  document.getElementById('convFormulaTxt').textContent =
    `(${score} ÷ ${outOf}) × ${realMax} = ${realRounded}`;

  const block = document.getElementById('convResult');
  block.classList.add('show');
  block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('calcConvBtn').addEventListener('click', calcConv);

/* Also calc on Enter */
['convScore', 'convOutOf', 'convRealMax'].forEach(id => {
  document.getElementById(id)?.addEventListener('keydown', e => {
    if (e.key === 'Enter') calcConv();
  });
});

/* ── Presets ── */
document.querySelectorAll('.conv-preset').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.conv-preset').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('convOutOf').value   = btn.dataset.out;
    document.getElementById('convRealMax').value = btn.dataset.real;
    if (document.getElementById('convScore').value) calcConv();
  });
});

/* ── Batch multi-score ── */
document.getElementById('addBatchBtn').addEventListener('click', () => {
  const outOf   = parseFloat(document.getElementById('convOutOf').value);
  const realMax = parseFloat(document.getElementById('convRealMax').value);

  const list = document.getElementById('batchList');
  const row  = document.createElement('div');
  row.className = 'batch-row';
  row.innerHTML = `
    <input type="number" class="batch-score-input" placeholder="أدخل علامة…" min="0" step="0.01" inputmode="decimal"/>
    <span class="batch-result-tag">— من ${isNaN(realMax) ? '?' : realMax}%</span>
    <button class="course-del" title="حذف" aria-label="حذف">🗑</button>`;

  const input  = row.querySelector('.batch-score-input');
  const result = row.querySelector('.batch-result-tag');

  input.addEventListener('input', () => {
    const s  = parseFloat(input.value);
    const o  = parseFloat(document.getElementById('convOutOf').value);
    const r  = parseFloat(document.getElementById('convRealMax').value);
    if (!isNaN(s) && !isNaN(o) && !isNaN(r) && o > 0 && r > 0 && s >= 0 && s <= o) {
      result.textContent = `${((s / o) * r).toFixed(3)} من ${r}%`;
    } else {
      result.textContent = `— من ${isNaN(r) ? '?' : r}%`;
    }
  });

  row.querySelector('.course-del').addEventListener('click', () => row.remove());
  list.appendChild(row);
  input.focus();
});

/* ── Converter Reset ── */
document.getElementById('convResetBtn').addEventListener('click', () => {
  document.getElementById('convResult').classList.remove('show');
  document.getElementById('batchList').innerHTML = '';
  document.querySelectorAll('.conv-preset').forEach(b => b.classList.remove('active'));
  ['convScore', 'convOutOf', 'convRealMax'].forEach(id => {
    document.getElementById(id).value = '';
  });
});
