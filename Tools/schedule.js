/* ============================================================
   MADKHAL — schedule.js
   ============================================================ */

/* ══════════════════════════════════════════════════════════
   PERIODS TABLE — Royal Commission / JIC / JTI official
   Source: verified from student schedule PDF
══════════════════════════════════════════════════════════ */
const PERIODS = [
  { num: 1,  start: '07:00', end: '07:50' },
  { num: 2,  start: '08:00', end: '08:50' },
  { num: 3,  start: '09:00', end: '09:50' },
  { num: 4,  start: '10:00', end: '10:50' },
  { num: 5,  start: '11:00', end: '11:50' },
  { num: 6,  start: '12:20', end: '13:10' }, /* after Dhuhr break */
  { num: 7,  start: '13:20', end: '14:10' },
  { num: 8,  start: '14:20', end: '15:10' }, /* after Asar break */
  { num: 9,  start: '15:30', end: '16:20' },
  { num: 10, start: '16:30', end: '17:20' },
  { num: 11, start: '17:30', end: '18:20' },
  { num: 12, start: '18:30', end: '19:20' },
  { num: 13, start: '19:30', end: '20:20' },
  { num: 14, start: '20:30', end: '21:20' },
  { num: 15, start: '21:30', end: '22:20' },
];
/* break indicator: between period 5 and 6 */
const BREAK_AFTER = 5;

const DAYS = [
  { key: 'Sun', ar: 'الأحد'    },
  { key: 'Mon', ar: 'الاثنين'  },
  { key: 'Tue', ar: 'الثلاثاء' },
  { key: 'Wed', ar: 'الأربعاء' },
  { key: 'Thu', ar: 'الخميس'   },
];

/* Colour palette — one colour per course (cycles) */
const PALETTE = [
  '#60a5fa','#a78bfa','#34d399','#f87171',
  '#fbbf24','#38bdf8','#fb923c','#e879f9',
  '#4ade80','#f472b6','#94a3b8','#facc15',
];
function colourFor(idx) { return PALETTE[idx % PALETTE.length]; }

/* ══════════════════════════════════════════════════════════
   THEME
══════════════════════════════════════════════════════════ */
const html          = document.documentElement;
const themeToggle   = document.getElementById('themeToggle');
const themeToggleMb = document.getElementById('themeToggleMobile');
const themeIcon     = document.getElementById('themeIcon');
const themeIconMb   = document.getElementById('themeIconMobile');
const themeLabel    = document.getElementById('themeLabel');
const TI = { dark:'☀️', light:'🌙' };
const TL = { dark:'التبديل للوضع النهاري', light:'التبديل للوضع الليلي' };
let currentTheme = localStorage.getItem('madkhal-theme') || 'dark';
applyTheme(currentTheme, false);
function applyTheme(t, animate = true) {
  currentTheme = t; html.setAttribute('data-theme', t); localStorage.setItem('madkhal-theme', t);
  const icon = TI[t];
  if (animate) {
    [themeIcon, themeIconMb].forEach(el => { if (!el) return; el.style.transform = 'rotate(360deg) scale(0)'; el.style.opacity = '0'; });
    setTimeout(() => { [themeIcon, themeIconMb].forEach(el => { if (!el) return; el.textContent = icon; el.style.cssText = 'transform:rotate(0)scale(1);opacity:1;transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .3s ease'; }); }, 200);
  } else { if (themeIcon) themeIcon.textContent = icon; if (themeIconMb) themeIconMb.textContent = icon; }
  if (themeLabel) themeLabel.textContent = TL[t];
}
const toggleTheme = () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
themeToggle?.addEventListener('click', toggleTheme);
themeToggleMb?.addEventListener('click', toggleTheme);
document.addEventListener('keydown', e => { if (e.shiftKey && e.key === 'D') toggleTheme(); });

/* ── Header scroll ── */
const headerEl = document.getElementById('header');
window.addEventListener('scroll', () => headerEl?.classList.toggle('is-scrolled', window.scrollY > 40), { passive: true });

/* ── Burger ── */
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
burger?.addEventListener('click', () => { const open = burger.classList.toggle('is-open'); mobileNav?.classList.toggle('is-open', open); burger.setAttribute('aria-expanded', open); });
mobileNav?.querySelectorAll('.mobile-nav__link').forEach(l => l.addEventListener('click', () => { burger?.classList.remove('is-open'); mobileNav.classList.remove('is-open'); }));

/* ── Reveal ── */
const revealObs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); } }); }, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ══════════════════════════════════════════════════════════
   BUILD PERIOD REFERENCE CHIPS
══════════════════════════════════════════════════════════ */
const refGrid = document.getElementById('periodRefGrid');
PERIODS.forEach(p => {
  const chip = document.createElement('div');
  chip.className = 'period-chip';
  chip.innerHTML = `
    <span class="period-chip__num">${p.num}</span>
    <div>
      <div class="period-chip__time">${p.start} – ${p.end}</div>
      ${p.num === BREAK_AFTER ? '<div class="period-chip__break">↓ استراحة الظهر</div>' : ''}
    </div>`;
  refGrid?.appendChild(chip);
});

/* ══════════════════════════════════════════════════════════
   DATA MODEL
══════════════════════════════════════════════════════════ */
let courses   = []; /* array of course objects */
let courseSeq = 0;
let sessionSeq = 0;

function newCourse(overrides = {}) {
  return {
    id:       ++courseSeq,
    code:     '',
    name:     '',
    cr:       '',
    colour:   colourFor(courseSeq - 1),
    sessions: [],
    ...overrides
  };
}
function newSession(overrides = {}) {
  return {
    id:          ++sessionSeq,
    type:        'Theoretical',
    day:         '',
    periodStart: '',
    periodEnd:   '',
    room:        '',
    ...overrides
  };
}

/* Persistence */
function saveToStorage() {
  localStorage.setItem('madkhal-schedule-v2', JSON.stringify({ courses, courseSeq, sessionSeq }));
}
function loadFromStorage() {
  try {
    const raw = localStorage.getItem('madkhal-schedule-v2');
    if (!raw) return;
    const d = JSON.parse(raw);
    courses    = d.courses    || [];
    courseSeq  = d.courseSeq  || 0;
    sessionSeq = d.sessionSeq || 0;
  } catch (_) {}
}

/* ══════════════════════════════════════════════════════════
   STEP TABS
══════════════════════════════════════════════════════════ */
function switchStep(step) {
  document.querySelectorAll('.step-tab').forEach(t => t.classList.toggle('active', t.dataset.step === step));
  document.querySelectorAll('.step-panel').forEach(p => p.classList.toggle('active', p.id === `step-${step}`));
  if (step === 'view') buildScheduleGrid();
}
document.querySelectorAll('.step-tab').forEach(t => t.addEventListener('click', () => switchStep(t.dataset.step)));
document.getElementById('backToInputBtn')?.addEventListener('click', () => switchStep('input'));
document.getElementById('buildScheduleBtn')?.addEventListener('click', () => switchStep('view'));

/* ══════════════════════════════════════════════════════════
   COURSE LIST UI
══════════════════════════════════════════════════════════ */
const coursesList = document.getElementById('coursesList');
const emptyCourses = document.getElementById('emptyCourses');
const courseRowTpl  = document.getElementById('courseRowTemplate');
const sessionRowTpl = document.getElementById('sessionRowTemplate');

function renderCourseList() {
  coursesList.innerHTML = '';
  emptyCourses.style.display = courses.length ? 'none' : 'flex';
  document.getElementById('courseCount').textContent = `${courses.length} مادة مضافة`;

  courses.forEach(course => {
    const wrap = courseRowTpl.content.cloneNode(true);
    const row  = wrap.querySelector('.course-row');
    row.dataset.id = course.id;
    row.querySelector('.course-row__color-dot').style.background = course.colour;

    /* Fields */
    const setField = (field, val) => {
      const el = row.querySelector(`[data-field="${field}"]`);
      if (el) el.value = val || '';
    };
    setField('code', course.code);
    setField('name', course.name);
    setField('cr',   course.cr);

    /* Input listeners */
    row.querySelectorAll('[data-field]').forEach(inp => {
      inp.addEventListener('input', () => {
        const c = getCourseById(course.id);
        if (!c) return;
        c[inp.dataset.field] = inp.value;
        saveToStorage();
        document.getElementById('courseCount').textContent = `${courses.length} مادة مضافة`;
      });
    });

    /* Sessions */
    const sessWrap = row.querySelector('[data-sessions-wrap]');
    course.sessions.forEach(sess => {
      sessWrap.appendChild(buildSessionRow(course.id, sess));
    });

    /* Add session btn */
    row.querySelector('.add-session-btn').addEventListener('click', () => {
      const c    = getCourseById(course.id);
      const sess = newSession();
      c.sessions.push(sess);
      sessWrap.appendChild(buildSessionRow(course.id, sess));
      saveToStorage();
    });

    /* Delete course */
    row.querySelector('.course-del-btn').addEventListener('click', () => {
      courses = courses.filter(c => c.id !== course.id);
      saveToStorage();
      renderCourseList();
    });

    coursesList.appendChild(row);
  });

  /* re-observe reveals */
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

function buildSessionRow(courseId, sess) {
  const wrap = sessionRowTpl.content.cloneNode(true);
  const row  = wrap.querySelector('.session-row');
  row.dataset.sessionId = sess.id;

  const setVal = (field, val) => {
    const el = row.querySelector(`[data-field="${field}"]`);
    if (!el) return;
    el.value = val || '';
  };
  setVal('type',        sess.type);
  setVal('day',         sess.day);
  setVal('periodStart', sess.periodStart);
  setVal('periodEnd',   sess.periodEnd);
  setVal('room',        sess.room);

  row.querySelectorAll('[data-field]').forEach(inp => {
    inp.addEventListener('change', () => updateSession(courseId, sess.id, inp.dataset.field, inp.value));
    inp.addEventListener('input',  () => updateSession(courseId, sess.id, inp.dataset.field, inp.value));
  });

  row.querySelector('.session-del-btn').addEventListener('click', () => {
    const c = getCourseById(courseId);
    if (!c) return;
    c.sessions = c.sessions.filter(s => s.id !== sess.id);
    row.remove();
    saveToStorage();
  });

  return row;
}

function updateSession(courseId, sessId, field, val) {
  const c = getCourseById(courseId);
  if (!c) return;
  const s = c.sessions.find(s => s.id === sessId);
  if (!s) return;
  s[field] = val;
  saveToStorage();
}

function getCourseById(id) { return courses.find(c => c.id === id); }

/* ── ADD COURSE ── */
document.getElementById('addCourseBtn').addEventListener('click', () => {
  const course = newCourse();
  course.sessions.push(newSession());
  courses.push(course);
  saveToStorage();
  renderCourseList();
  /* scroll to new row */
  coursesList.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* ── CLEAR ALL ── */
document.getElementById('clearAllBtn').addEventListener('click', () => {
  if (!courses.length || confirm('مسح جميع المواد؟')) {
    courses = [];
    saveToStorage();
    renderCourseList();
  }
});

/* ══════════════════════════════════════════════════════════
   AUTO-PARSE PASTED TEXT
══════════════════════════════════════════════════════════ */
// ربط الأزرار (تأكد إن هالسطرين موجودة عشان الزر يشتغل)
document.getElementById('parseBtn')?.addEventListener('click', parsePastedText);
document.getElementById('clearPasteBtn')?.addEventListener('click', () => {
  document.getElementById('pasteInput').value = '';
});

function parsePastedText() {
  const raw = document.getElementById('pasteInput').value.trim();
  if (!raw) {
    alert("المربع فاضي! انسخ جدولك من الإيدوقيت والصقه أولاً.");
    return;
  }

  try {
    const DAY_MAP = {
      sun:'Sun', sunday:'Sun',    'الأحد':'Sun',
      mon:'Mon', monday:'Mon',    'الاثنين':'Mon',
      tue:'Tue', tuesday:'Tue',   'الثلاثاء':'Tue',
      wed:'Wed', wednesday:'Wed', 'الأربعاء':'Wed',
      thu:'Thu', thursday:'Thu',  'الخميس':'Thu',
    };
    const TYPE_MAP = {
      theoretical:'Theoretical', نظري:'Theoretical',
      practical:'Practical',     عملي:'Practical',
      lab:'Lab',                 مختبر:'Lab',
    };

    const lines = raw.split(/\r?\n/).filter(l => l.trim());
    const parsed = [];
    const codeMap = {};

    lines.forEach(line => {
      // 1. استخراج الكود (مثل MME 133)
      const codeMatch = line.match(/\b([A-Z]{2,4})\s*(\d{3,})\b/);
      const code      = codeMatch ? `${codeMatch[1]} ${codeMatch[2]}` : null;

      // 2. استخراج اليوم إذا كان مكتوب صراحة
      let explicitDay = null;
      const dayMatch = line.match(/\b(Sun|Mon|Tue|Wed|Thu|Sunday|Monday|Tuesday|Wednesday|Thursday|الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس)\b/i);
      if (dayMatch) explicitDay = DAY_MAP[dayMatch[1].toLowerCase()] || DAY_MAP[dayMatch[1]];

      // 3. استخراج نوع المادة
      let type = 'Theoretical';
      const typeMatch = line.match(/\b(Theoretical|Practical|Lab|theoretical|practical|lab|نظري|عملي|مختبر)\b/i);
      if (typeMatch) type = TYPE_MAP[typeMatch[1].toLowerCase()] || TYPE_MAP[typeMatch[1]];

      // 4. استخراج الاسم (ما بين الكود ونوع المادة)
      let name = '';
      let cr = '';
      
      if (codeMatch) {
        const afterCode = line.slice(line.indexOf(codeMatch[0]) + codeMatch[0].length).trim();
        const nameEnd   = afterCode.search(/\b(Theoretical|Practical|Lab|نظري|عملي|مختبر|Sun|Mon|Tue|Wed|Thu|الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس)\b/i);
        let rawName = nameEnd > 0 ? afterCode.slice(0, nameEnd).trim() : afterCode.slice(0, 60).trim();

        // سحب الساعات المعتمدة إذا كانت موجودة بنهاية الاسم
        const crMatch = rawName.match(/\s+(\d)(?:\s+\d)?\s*$/);
        if (crMatch) {
          cr = crMatch[1];
          rawName = rawName.slice(0, crMatch.index).trim();
        }
        name = rawName.replace(/\d+/g, '').replace(/[-_]/g, ' ').trim();
      }

      let sessionsToAdd = [];
      
      // 5. الخوارزمية الذكية: قراءة أرقام الفترات اللي تجي بعد كلمة نظري/عملي مباشرة
      if (typeMatch) {
          const afterType = line.slice(typeMatch.index + typeMatch[0].length).trim();
          // التقاط تجمعات الأرقام (مثل: "1,3,2" أو "5,4 7,6")
          const periodsMatch = afterType.match(/^((?:\d+(?:,\d+)*\s*)+)/);
          if (periodsMatch) {
              const chunks = periodsMatch[1].trim().split(/\s+/);
              chunks.forEach(chunk => {
                  sessionsToAdd.push({ day: explicitDay || '', pStr: chunk });
              });
          }
      }

      // طريقة بديلة لو السطر فيه يوم وأرقام بدون نوع المادة
      if (sessionsToAdd.length === 0 && !typeMatch && explicitDay) {
         const explicitPeriod = line.match(/(?:Sun|Mon|Tue|Wed|Thu|الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس)\s*:?\s*((?:\d+(?:,\d+)*\s*)+)/i);
         if (explicitPeriod) {
             const chunks = explicitPeriod[1].trim().split(/\s+/);
             chunks.forEach(chunk => {
                 sessionsToAdd.push({ day: explicitDay, pStr: chunk });
             });
         }
      }

      // تجاوز الأسطر الفارغة أو غير المفيدة
      if (!code && sessionsToAdd.length === 0) return;

      // 6. ترتيب وتحويل الأرقام لحصص فعلية
      const finalSessions = sessionsToAdd.map(s => {
          const nums = s.pStr.match(/\d+/g).map(Number).sort((a,b) => a-b);
          return {
              type,
              day: s.day,
              periodStart: nums[0],
              periodEnd: nums[nums.length - 1]
          };
      });

      // 7. دمج وتجميع الحصص تحت المادة المناسبة
      if (code) {
        if (!codeMap[code]) {
          codeMap[code] = { code, name: name || code, cr: cr || '', sessions: [] };
        }
        if (name && !codeMap[code].name) codeMap[code].name = name;
        if (cr && !codeMap[code].cr) codeMap[code].cr = cr;
        
        finalSessions.forEach(fs => {
            codeMap[code].sessions.push({
                type: fs.type,
                day: fs.day,
                periodStart: String(fs.periodStart),
                periodEnd: String(fs.periodEnd)
            });
        });
      } else if (finalSessions.length > 0) {
        // حصص بدون مادة واضحة (يتم إضافتها كمادة مجهولة مؤقتاً لتعديلها لاحقاً)
        parsed.push({
            code: '', name: '', cr: '',
            sessions: finalSessions.map(fs => ({
                type: fs.type, day: fs.day,
                periodStart: String(fs.periodStart), periodEnd: String(fs.periodEnd)
            }))
        });
      }
    });

    Object.values(codeMap).forEach(entry => parsed.unshift(entry));

    if (!parsed.length) {
      alert('⚠️ ما قدرنا نستخرج مواد من هذا النص. تأكد إن النسخ من الإيدوقيت تم بشكل سليم.');
      return;
    }

    parsed.forEach((entry, idx) => {
      const course = newCourse({
        code:   entry.code,
        name:   entry.name,
        cr:     entry.cr,
        colour: colourFor(courses.length),
      });
      entry.sessions.forEach(s => {
        course.sessions.push(newSession({
          type:        s.type,
          day:         s.day,
          periodStart: String(s.periodStart),
          periodEnd:   String(s.periodEnd || s.periodStart),
          room:        '',
        }));
      });
      // إزالة الحصة الفارغة الافتراضية اللي تجي مع إنشاء المادة الجديدة
      if (course.sessions.length > 0 && !course.sessions[0].periodStart && course.sessions.length > 1) {
          course.sessions.shift();
      }
      if (!course.sessions.length) course.sessions.push(newSession());
      courses.push(course);
    });

    saveToStorage();
    renderCourseList();
    document.getElementById('pasteInput').value = '';
    alert(`✅ تم استخراج ${parsed.length} مادة بنجاح!`);

  } catch (err) {
    alert('حدث خطأ أثناء قراءة الجدول: ' + err.message);
    console.error(err);
  }
}

/* ══════════════════════════════════════════════════════════
   PERIOD → TIME HELPERS
══════════════════════════════════════════════════════════ */
function periodToTime(num) {
  const p = PERIODS.find(x => x.num === Number(num));
  return p ? { start: p.start, end: p.end } : null;
}

function periodsToTimeRange(startNum, endNum) {
  const s = PERIODS.find(x => x.num === Number(startNum));
  const e = PERIODS.find(x => x.num === Number(endNum || startNum));
  if (!s) return '';
  return `${s.start}${e && e !== s ? ' – ' + e.end : ' – ' + s.end}`;
}

/* ══════════════════════════════════════════════════════════
   BUILD WEEKLY GRID
══════════════════════════════════════════════════════════ */
function buildScheduleGrid() {
  const grid    = document.getElementById('schedGrid');
  const dayCards = document.getElementById('dayCards');
  const legend  = document.getElementById('schedLegend');
  if (!grid) return;

  /* Stats */
  const totalCR    = courses.reduce((s, c) => s + (parseInt(c.cr) || 0), 0);
  const totalSlots = courses.reduce((s, c) => s + c.sessions.length, 0);
  document.getElementById('schedCoursesCount').textContent = `${courses.length} مادة`;
  document.getElementById('schedTotalHrs').textContent     = `${totalCR} ساعة معتمدة`;
  document.getElementById('schedTotalSlots').textContent   = `${totalSlots} حصة أسبوعياً`;

  /* ── DESKTOP GRID ──
     Layout approach: explicit grid-row / grid-column placement.
     Row 1 = header. Rows 2..N+1 = period rows.
     Columns: 1 = time, 2=Sun, 3=Mon, 4=Tue, 5=Wed, 6=Thu
     Spanned sessions use grid-row: span N so they visually
     cover multiple period rows without breaking the grid flow.
  ── */
  grid.innerHTML = '';

  const DAY_COL = { Sun: 2, Mon: 3, Tue: 4, Wed: 5, Thu: 6 };
  const N_ROWS  = PERIODS.length; /* 9 */

  /* ── Set explicit grid template ── */
  grid.style.gridTemplateColumns = '80px repeat(5, 1fr)';
  grid.style.gridTemplateRows    = `40px repeat(${N_ROWS}, 72px)`;

  /* ── HEADER ROW (row 1) ── */
  /* Empty corner */
  const corner = document.createElement('div');
  corner.className = 'sched-col-head';
  corner.style.gridRow = '1';
  corner.style.gridColumn = '1';
  grid.appendChild(corner);

  DAYS.forEach((d, i) => {
    const h = document.createElement('div');
    h.className = 'sched-col-head';
    h.textContent = d.ar;
    h.style.gridRow    = '1';
    h.style.gridColumn = String(i + 2);
    grid.appendChild(h);
  });

  /* ── TIME COLUMN (col 1, rows 2..N+1) ── */
  PERIODS.forEach((period, i) => {
    const tc = document.createElement('div');
    tc.className = 'sched-time-cell';
    tc.style.gridRow    = String(i + 2);
    tc.style.gridColumn = '1';
    tc.innerHTML = `
      <span class="sched-period-num">${period.num}</span>
      <span class="sched-period-time">${period.start} – ${period.end}</span>
      ${period.num === BREAK_AFTER ? '<span class="sched-period-break">↕ ظهر</span>' : ''}`;
    grid.appendChild(tc);
  });

  /* ── EMPTY BACKGROUND CELLS (every day × every period) ── */
  PERIODS.forEach((period, pi) => {
    DAYS.forEach((day, di) => {
      const bg = document.createElement('div');
      bg.className = 'sched-cell';
      bg.style.gridRow    = String(pi + 2);
      bg.style.gridColumn = String(di + 2);
      grid.appendChild(bg);
    });
  });

  /* ── BUILD slotMap: day-startPeriod → { course, session, span } ── */
  const slotMap = {};
  courses.forEach(course => {
    course.sessions.forEach(sess => {
      if (!sess.day || !sess.periodStart) return;
      const start = parseInt(sess.periodStart);
      const end   = Math.max(start, parseInt(sess.periodEnd || sess.periodStart));
      const span  = end - start + 1;
      const key   = `${sess.day}-${start}`;
      /* If two sessions overlap same slot, keep first */
      if (!slotMap[key]) slotMap[key] = { course, session: sess, start, span };
    });
  });

  /* ── PLACE SESSION BLOCKS using explicit grid placement ── */
  Object.values(slotMap).forEach(({ course, session, start, span }) => {
    const col = DAY_COL[session.day];
    if (!col) return;
    const row = start + 1; /* +1 because row 1 is header */

    const block = document.createElement('div');
    block.className = 'sched-slot';
    block.style.gridRow    = `${row} / span ${span}`;
    block.style.gridColumn = String(col);
    block.style.margin     = '2px';
    block.style.cssText   += `;background:${course.colour}22;border-right:3px solid ${course.colour};color:${course.colour};z-index:2`;
    block.innerHTML = `
      <span class="sched-slot__code">${course.code}</span>
      <span class="sched-slot__name">${course.name || course.code}</span>
      <span class="sched-slot__type">${typeAr(session.type)}</span>
      ${session.room ? `<span class="sched-slot__room">📍 ${session.room}</span>` : ''}`;
    grid.appendChild(block);
  });

  /* ── MOBILE DAY CARDS ── */
  dayCards.innerHTML = '';
  DAYS.forEach(day => {
    const daySessions = [];
    courses.forEach(course => {
      course.sessions.forEach(sess => {
        if (sess.day === day.key && sess.periodStart) {
          daySessions.push({ course, session: sess });
        }
      });
    });
    daySessions.sort((a, b) => parseInt(a.session.periodStart) - parseInt(b.session.periodStart));

    const card = document.createElement('div');
    card.className = 'day-card';
    const count = daySessions.length ? `${daySessions.length} حصة` : 'لا توجد حصص';
    card.innerHTML = `
      <div class="day-card__header">
        <span>${day.ar}</span>
        <span>${count}</span>
      </div>
      <div class="day-card__sessions" id="dc-${day.key}"></div>`;

    const sessContainer = card.querySelector(`#dc-${day.key}`);
    if (!daySessions.length) {
      sessContainer.innerHTML = '<p class="day-card__empty">لا توجد حصص هذا اليوم</p>';
    } else {
      daySessions.forEach(({ course, session }) => {
        const timeRange = periodsToTimeRange(session.periodStart, session.periodEnd);
        const s = document.createElement('div');
        s.className = 'day-session';
        s.style.cssText = `background:${course.colour}18;border-right-color:${course.colour}`;
        s.innerHTML = `
          <div class="day-session__time">${timeRange}</div>
          <div class="day-session__info">
            <p class="day-session__name">${course.name || course.code}</p>
            <p class="day-session__meta">${course.code} · ${typeAr(session.type)}${session.room ? ' · ' + session.room : ''}</p>
          </div>`;
        sessContainer.appendChild(s);
      });
    }
    dayCards.appendChild(card);
  });

  /* ── LEGEND ── */
  legend.innerHTML = `<p class="sched-legend__title">المواد المسجّلة</p><div class="sched-legend__grid" id="legendGrid"></div>`;
  const legendGrid = legend.querySelector('#legendGrid');
  courses.forEach(c => {
    if (!c.name && !c.code) return;
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <div class="legend-dot" style="background:${c.colour}"></div>
      <span class="legend-label">${c.name || c.code}</span>
      ${c.cr ? `<span class="legend-cr">${c.cr} س</span>` : ''}`;
    legendGrid.appendChild(item);
  });
}

function typeAr(type) {
  if (!type) return '';
  const map = { Theoretical: 'نظري', Practical: 'عملي' };
  return map[type] || type;
}

/* ══════════════════════════════════════════════════════════
   PRINT & CUSTOMIZATION
══════════════════════════════════════════════════════════ */
const printPanel = document.getElementById('printPanel');

// 1. زر الطباعة الرئيسي يفتح النافذة بدلاً من الطباعة المباشرة
document.getElementById('printBtn')?.addEventListener('click', () => {
  if (!document.getElementById('step-view').classList.contains('active')) {
    buildScheduleGrid();
    document.querySelectorAll('.step-panel').forEach(p => p.classList.toggle('active', p.id === 'step-view'));
    document.querySelectorAll('.step-tab').forEach(t => t.classList.toggle('active', t.dataset.step === 'view'));
  }
  printPanel.removeAttribute('hidden'); // إظهار نافذة التخصيص
});

// 2. إغلاق النافذة
document.getElementById('printPanelClose')?.addEventListener('click', () => printPanel.setAttribute('hidden', ''));
document.getElementById('printPanelClose2')?.addEventListener('click', () => printPanel.setAttribute('hidden', ''));

// 3. زر "طباعة الآن" يقرأ التخصيصات ويطبع
document.getElementById('doPrintBtn')?.addEventListener('click', () => {
  const el = id => document.getElementById(id);
  
  /* ── تعبئة بيانات هيدر الطباعة ── */
  const totalCR = courses.reduce((s, c) => s + (parseInt(c.cr) || 0), 0);
  const now = new Date();
  const dateStr = now.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });

  if (el('printCoursesCount')) el('printCoursesCount').textContent = courses.length;
  if (el('printCrCount')) el('printCrCount').textContent = totalCR;

  const meta = el('printMeta');
  if (meta) {
    const codes = courses.filter(c => c.code || c.name).map(c => c.code || c.name).join(' · ');
    meta.textContent = codes ? `${codes} · ${dateStr}` : dateStr;
  }

  const customTitle = el('ptCustomTitle')?.value.trim();
  if (el('printTitle')) el('printTitle').textContent = customTitle || 'الجدول الدراسي الأسبوعي';

  /* ── هنا السر: قراءة التوجلز وإضافة كلاسات الإخفاء للـ Body ── */
  document.body.classList.toggle('hide-p-code',   !el('ptShowCode').checked);
  document.body.classList.toggle('hide-p-room',   !el('ptShowRoom').checked);
  document.body.classList.toggle('hide-p-legend', !el('ptShowLegend').checked);
  document.body.classList.toggle('hide-p-time',   !el('ptShowTime').checked);

  /* إغلاق النافذة والطباعة */
  document.getElementById('printPanel').setAttribute('hidden', '');
  requestAnimationFrame(() => setTimeout(() => window.print(), 200));
});

// 4. تفعيل أزرار اختيار الثيم داخل النافذة
document.querySelectorAll('.print-theme-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.print-theme-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // تطبيق الثيم المختار
    document.documentElement.setAttribute('data-print-theme', e.currentTarget.dataset.printTheme);
    
    const themeLabel = e.currentTarget.querySelector('span:nth-child(2)').textContent;
    if (document.getElementById('printThemeLabel')) {
      document.getElementById('printThemeLabel').textContent = themeLabel;
    }
  });
});

// 5. تفعيل أزرار حجم الخط داخل النافذة
document.querySelectorAll('.print-size-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.print-size-btn').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // تطبيق الحجم المختار
    document.documentElement.setAttribute('data-print-size', e.currentTarget.dataset.fontSize);
    
    const sizeLabel = e.currentTarget.textContent;
    if (document.getElementById('printSizeLabel')) {
      document.getElementById('printSizeLabel').textContent = sizeLabel;
    }
  });
});

/* ══════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════ */
loadFromStorage();
renderCourseList();

/* Reveal observer */
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


