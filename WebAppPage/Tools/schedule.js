/* ============================================================
   MADKHAL Mobile Schedule Tool — schedule.js
   ============================================================ */

const PERIODS = [
  { num: 1,  start: '07:00', end: '07:50' }, { num: 2,  start: '08:00', end: '08:50' },
  { num: 3,  start: '09:00', end: '09:50' }, { num: 4,  start: '10:00', end: '10:50' },
  { num: 5,  start: '11:00', end: '11:50' }, { num: 6,  start: '12:20', end: '13:10' }, 
  { num: 7,  start: '13:20', end: '14:10' }, { num: 8,  start: '14:20', end: '15:10' }, 
  { num: 9,  start: '15:30', end: '16:20' }, { num: 10, start: '16:30', end: '17:20' },
  { num: 11, start: '17:30', end: '18:20' }, { num: 12, start: '18:30', end: '19:20' },
  { num: 13, start: '19:30', end: '20:20' }, { num: 14, start: '20:30', end: '21:20' },
  { num: 15, start: '21:30', end: '22:20' },
];

const DAYS = [
  { key: 'Sun', ar: 'الأحد' }, { key: 'Mon', ar: 'الاثنين' },
  { key: 'Tue', ar: 'الثلاثاء' }, { key: 'Wed', ar: 'الأربعاء' }, { key: 'Thu', ar: 'الخميس' }
];

const PALETTE = ['#60a5fa','#a78bfa','#34d399','#f87171','#fbbf24','#38bdf8','#fb923c','#e879f9'];
function colourFor(idx) { return PALETTE[idx % PALETTE.length]; }

let courses = []; let courseSeq = 0; let sessionSeq = 0;

function newCourse(overrides = {}) {
  return { id: ++courseSeq, code: '', name: '', cr: '', colour: colourFor(courseSeq - 1), sessions: [], ...overrides };
}
function newSession(overrides = {}) {
  return {
    id: ++sessionSeq,
    type: 'Theoretical',
    day: '',
    periodStart: '',
    periodEnd: '',
    room: '',
    building: '',
    ...overrides
  };
}

function saveToStorage() { 
    localStorage.setItem('madkhal-mobile-schedule', JSON.stringify({ courses, courseSeq, sessionSeq })); 
    updateConflictUI(); // فحص التعارضات مع كل تعديل
}
function loadFromStorage() {
  try {
    const raw = localStorage.getItem('madkhal-mobile-schedule') || localStorage.getItem('madkhal-schedule-v2');
    if (!raw) return;
    const d = JSON.parse(raw);
    courses = d.courses || []; courseSeq = d.courseSeq || 0; sessionSeq = d.sessionSeq || 0;
  } catch (_) {}
}

function switchStep(step) {
    document.querySelectorAll('.sched-tab-btn').forEach(btn => {
        const active = btn.dataset.step === step;

        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
    });

    document.querySelectorAll('.sched-panel').forEach(panel => {
        const active = panel.id === `step-${step}`;

        panel.classList.toggle('active', active);
        panel.style.display = active ? 'block' : 'none';
    });

    if (step === 'view') {
        buildScheduleCards();
    }
}

/* --- CONFLICT DETECTION LOGIC --- */
function checkConflicts() {
  let conflicts = [];
  let allSessions = [];
  
  // تجميع كل الحصص مع معرفة المادة التابعة لها
  courses.forEach(c => {
    c.sessions.forEach(s => {
      if (s.day && s.periodStart) {
        allSessions.push({
          courseId: c.id,
          code: c.code || 'مادة بدون كود',
          day: s.day,
          start: parseInt(s.periodStart),
          end: parseInt(s.periodEnd || s.periodStart)
        });
      }
    });
  });

  // مقارنة كل حصة مع البقية
  for (let i = 0; i < allSessions.length; i++) {
    for (let j = i + 1; j < allSessions.length; j++) {
      let s1 = allSessions[i];
      let s2 = allSessions[j];
      
      // إذا كانوا في نفس اليوم ولمادتين مختلفتين
      if (s1.day === s2.day && s1.courseId !== s2.courseId) {
        // خوارزمية التداخل: إذا كانت بداية الأول أصغر/تساوي نهاية الثاني، وبداية الثاني أصغر/تساوي نهاية الأول
        if (s1.start <= s2.end && s2.start <= s1.end) {
          const dayAr = DAYS.find(d => d.key === s1.day)?.ar || s1.day;
          conflicts.push(`تعارض بين <strong>${s1.code}</strong> و <strong>${s2.code}</strong> (يوم ${dayAr})`);
        }
      }
    }
  }
  return [...new Set(conflicts)]; // إزالة التكرار
}

function updateConflictUI() {
  const warningBox = document.getElementById('conflictWarning');
  if (!warningBox) return;
  const conflicts = checkConflicts();
  
  if (conflicts.length > 0) {
    warningBox.style.display = 'block';
    warningBox.innerHTML = `
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; padding: 12px 15px; border-radius: 14px; font-size: 13px;">
          <strong style="display:block; margin-bottom: 5px;"><i class="fi fi-rr-triangle-warning"></i> تنبيه: يوجد تعارض في الأوقات!</strong>
          <ul style="margin: 0; padding-right: 20px; line-height: 1.6;">
              ${conflicts.map(c => `<li>${c}</li>`).join('')}
          </ul>
      </div>`;
  } else {
    warningBox.style.display = 'none';
  }
}

/* Persistent warning: sessions with periods but no assigned weekday. */
function updateScheduleDayWarning() {
  const list = document.getElementById('coursesList');
  if (!list) return;
  let box = document.getElementById('scheduleMissingDaysWarning');
  if (!box) {
    box = document.createElement('div');
    box.id = 'scheduleMissingDaysWarning';
    box.setAttribute('role', 'alert');
    list.parentNode.insertBefore(box, list);
  }
  const missing = courses.flatMap(c => (c.sessions || [])
    .filter(s => s.periodStart && !s.day)
    .map(s => ({ code:c.code || 'مادة بدون كود', courseId:c.id, sessionId:s.id })));
  if (!missing.length) { box.hidden = true; box.replaceChildren(); return; }
  box.hidden = false;
  Object.assign(box.style, {
    padding:'14px', marginBottom:'15px', borderRadius:'14px',
    border:'1px solid #e5b451', background:'var(--surface-color, #fff)',
    color:'var(--text-dark, #202b40)', lineHeight:'1.8', fontSize:'13px'
  });
  box.replaceChildren();
  const title=document.createElement('strong');
  title.textContent = `⚠️ تنبيه: ${missing.length} حصة لم يتم تحديد يومها`;
  title.style.display='block';
  box.appendChild(title);
  const note=document.createElement('p');
  note.textContent='حدد اليوم لكل حصة قبل الاعتماد على عرض الجدول أو صاحب. لا يمكن معرفة اليوم من النص المنسوخ إذا اختفت خلايا الجدول الفارغة.';
  note.style.margin='5px 0 10px';
  box.appendChild(note);
  const codes=document.createElement('div');
  codes.textContent=[...new Set(missing.map(x=>x.code))].join('، ');
  codes.style.fontWeight='700';
  codes.style.marginBottom='10px';
  box.appendChild(codes);
  const btn=document.createElement('button');
  btn.type='button';
  btn.textContent='تحديد الأيام الناقصة';
  Object.assign(btn.style, {
    background:'linear-gradient(110deg,#0a0b4d,#007bc4)',color:'#fff',
    border:'0',borderRadius:'10px',padding:'10px 14px',fontWeight:'800',cursor:'pointer'
  });
  btn.addEventListener('click',()=>{
    switchStep('input');
    const first=missing[0];
    const row=list.querySelector(`.grade-row[data-id="${first.courseId}"]`);
    if (!row) return;
    const sel=[...row.querySelectorAll('.session-row')].find(r => {
      const input=r.querySelector('[data-field="day"]');
      return input && !input.value && r.querySelector('[data-field="periodStart"]')?.value;
    });
    (sel || row).scrollIntoView({behavior:'smooth',block:'center'});
    sel?.querySelector('[data-field="day"]')?.focus({preventScroll:true});
  });
  box.appendChild(btn);
}

/* --- COURSE UI --- */
function renderCourseList() {
  const list = document.getElementById('coursesList');
  const empty = document.getElementById('emptyCourses');
  const count = document.getElementById('courseCount');
  const tplCourse = document.getElementById('courseRowTemplate');
  const tplSession = document.getElementById('sessionRowTemplate');
  
  if (!list || !tplCourse) return;
  list.innerHTML = '';
  if (empty) empty.style.display = courses.length ? 'none' : 'block';
  if (count) count.textContent = courses.length;

  courses.forEach(course => {
    const wrap = tplCourse.content.cloneNode(true);
    const row = wrap.querySelector('.grade-row');
    row.dataset.id = course.id;
    row.style.setProperty('--c', course.colour);

    const setVal = (f, v) => { const el = row.querySelector(`[data-field="${f}"]`); if(el) el.value = v||''; };
    setVal('code', course.code); setVal('cr', course.cr);

    row.querySelectorAll('[data-field]').forEach(inp => {
      inp.addEventListener('input', () => {
        const c = courses.find(x => x.id === course.id);
        if(c) { c[inp.dataset.field] = inp.value; saveToStorage(); }
      });
    });

    const sessWrap = row.querySelector('[data-sessions-wrap]');
    course.sessions.forEach(sess => sessWrap.appendChild(buildSessionRow(sess, course.id, tplSession)));

    row.querySelector('.add-session-btn')?.addEventListener('click', () => {
      const c = courses.find(x => x.id === course.id);
      if(c) {
          const newS = newSession(); c.sessions.push(newS);
          sessWrap.appendChild(buildSessionRow(newS, course.id, tplSession));
          saveToStorage();
          updateScheduleDayWarning();
      }
    });

    row.querySelector('.course-del-btn')?.addEventListener('click', () => {
      courses = courses.filter(c => c.id !== course.id);
      saveToStorage(); renderCourseList();
    });

    list.appendChild(row);
  });
  
  updateConflictUI(); // فحص عند التحميل
  updateScheduleDayWarning();
}

function buildSessionRow(sess, courseId, tpl) {
  const wrap = tpl.content.cloneNode(true);
  const row = wrap.querySelector('.session-row');
  
  const setVal = (f, v) => { const el = row.querySelector(`[data-field="${f}"]`); if(el) el.value = v||''; };
  setVal('day', sess.day); setVal('periodStart', sess.periodStart); 
setVal('periodEnd', sess.periodEnd);
setVal('type', sess.type);
setVal('room', sess.room);
setVal('building', sess.building);

  row.querySelectorAll('[data-field]').forEach(inp => {
    inp.addEventListener('change', (e) => updateSess(courseId, sess.id, inp.dataset.field, e.target.value));
    inp.addEventListener('input', (e) => updateSess(courseId, sess.id, inp.dataset.field, e.target.value));
  });

  row.querySelector('.session-del-btn')?.addEventListener('click', () => {
    const c = courses.find(x => x.id === courseId);
    if(c) { c.sessions = c.sessions.filter(s => s.id !== sess.id); saveToStorage(); row.remove(); updateScheduleDayWarning(); }
  });
  return row;
}

function updateSess(cId, sId, f, v) {
  const c = courses.find(x => x.id === cId);
  if(c) { const s = c.sessions.find(x => x.id === sId); if(s) { s[f] = v; saveToStorage(); if (f === "day" || f === "periodStart") updateScheduleDayWarning(); } }
}

/* --- BUILD MOBILE CARDS --- */
function periodsToTimeRange(startNum, endNum) {
  const s = PERIODS.find(x => x.num === Number(startNum));
  const e = PERIODS.find(x => x.num === Number(endNum || startNum));
  if (!s) return ''; return `${s.start} - ${e ? e.end : s.end}`;
}

function typeAr(type) { return type === 'Theoretical' ? 'نظري' : 'عملي'; }

/* --- BUILD MOBILE CARDS & PRINT TABLE --- */
function periodsToTimeRange(startNum, endNum) {
  const s = PERIODS.find(x => x.num === Number(startNum));
  const e = PERIODS.find(x => x.num === Number(endNum || startNum));
  if (!s) return ''; return `${s.start} - ${e ? e.end : s.end}`;
}

function typeAr(type) { return type === 'Theoretical' ? 'نظري' : 'عملي'; }

function buildScheduleCards() {
  const container = document.getElementById('dayCards');
  if(!container) return;

  const totalCR = courses.reduce((s, c) => s + (parseInt(c.cr) || 0), 0);
  document.getElementById('schedCoursesCount').textContent = courses.length;
  document.getElementById('schedTotalHrs').textContent = totalCR;

  container.innerHTML = '';
  
  // بناء كروت عرض الجوال
  DAYS.forEach(day => {
    const daySessions = [];
    courses.forEach(course => {
      course.sessions.forEach(sess => {
        if (sess.day === day.key && sess.periodStart) daySessions.push({ course, session: sess });
      });
    });
    daySessions.sort((a, b) => parseInt(a.session.periodStart) - parseInt(b.session.periodStart));

    const card = document.createElement('div');
    card.className = 'day-card';
    card.innerHTML = `<div class="day-card__header"><span>${day.ar}</span><span>${daySessions.length ? daySessions.length+' حصص' : ''}</span></div>`;
    
    if (!daySessions.length) {
      card.innerHTML += '<p class="day-card__empty">لا توجد حصص في هذا اليوم</p>';
    } else {
      daySessions.forEach(({ course, session }) => {
        const timeRange = periodsToTimeRange(session.periodStart, session.periodEnd);
        card.innerHTML += `
          <div class="day-session" style="border-right: 4px solid ${course.colour}">
            <div class="day-session__time">${timeRange}</div>
            <div class="day-session__info">
              <p class="day-session__name">${course.code || 'بدون كود'}</p>
              <p class="day-session__meta">
    ${typeAr(session.type)}
    ${session.room ? ` · قاعة ${session.room}` : ''}
</p>
            </div>
          </div>`;
      });
    }
    container.appendChild(card);
  });

  // بناء جدول الطباعة الاحترافي
  buildPrintTable(totalCR);
}

function buildPrintTable(totalCR) {
  const tableHead = document.getElementById('printTableHeader');
  const tableBody = document.getElementById('printTableBody');
  if (!tableHead || !tableBody) return;
  
  document.getElementById('printCourseCount').textContent = courses.length;
  document.getElementById('printTotalHrs').textContent = totalCR;
  
  // 1. بناء رأس الجدول (أرقام الفترات)
  let thHtml = '<th class="day-col">اليوم</th>';
  PERIODS.forEach(p => {
      thHtml += `
    <th>
        <span class="period-number">الفترة ${p.num}</span>
        <span class="period-time">${p.start}</span>
    </th>
`;
  });
  tableHead.innerHTML = thHtml;
  
  // 2. بناء صفوف الأيام
  let trHtml = '';
  DAYS.forEach(day => {
      trHtml += `<tr><th>${day.ar}</th>`;
      
      let currentPeriod = 1;
      while (currentPeriod <= 15) {
          let foundSession = null;
          let parentCourse = null;
          
          for (let c of courses) {
              const s = c.sessions.find(x => x.day === day.key && parseInt(x.periodStart) === currentPeriod);
              if (s) { foundSession = s; parentCourse = c; break; }
          }
          
          if (foundSession) {
              const start = parseInt(foundSession.periodStart);
              const end = parseInt(foundSession.periodEnd || foundSession.periodStart);
              const colspan = (end - start) + 1;
              
              trHtml += `<td class="filled-slot" colspan="${colspan}" style="background-color: ${parentCourse.colour} !important;">
                 ${parentCourse.code || 'مادة'}
<span class="slot-type">
    ${typeAr(foundSession.type)}
    ${foundSession.room ? ` | ${foundSession.room}` : ''}
</span>
              </td>`;
              currentPeriod += colspan; // القفز بعدد ساعات المادة
          } else {
              trHtml += `<td class="empty-slot"></td>`;
              currentPeriod++;
          }
      }
      trHtml += `</tr>`;
  });
  tableBody.innerHTML = trHtml;
}

/* ============================================================
   ATTACH ALL EVENT LISTENERS AFTER DOM LOADS
   ============================================================ */

/* =========================================
   MADKHAL — SMART EDUGATE PARSER
   ========================================= */


/* =============================
   MADKHAL EDUGATE PARSER V2
   Supports pasted HTML table + plain copied text.
   No department/building hardcoded allowlist.
   ============================= */
let edugatePastedTable = null;

function edugateClean(value) {
    return String(value || '')
        .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
        .replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/[\u200e\u200f\u00a0]/g, ' ')
        .replace(/\s+/g, ' ').trim();
}

const EDUGATE_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
const EDUGATE_DAY_LABELS = { sun:'Sun', mon:'Mon', tue:'Tue', wed:'Wed', thu:'Thu',
    'الأحد':'Sun','الاثنين':'Mon','الثلاثاء':'Tue','الأربعاء':'Wed','الخميس':'Thu' };

function edugatePeriods(raw) {
    const nums = String(raw || '').replace(/\s+/g, '').split(',')
        .map(Number).filter(n => Number.isInteger(n) && n >= 1 && n <= 15);
    if (!nums.length) return null;
    return { periodStart: String(Math.min(...nums)), periodEnd: String(Math.max(...nums)) };
}

function edugateCode(value) {
    const found = edugateClean(value).match(/^([A-Z]{2,6})\s*(\d{3,4}[A-Z]?)\b/i);
    return found ? `${found[1].toUpperCase()} ${found[2].toUpperCase()}` : '';
}

function edugateGroup(entries) {
    const map = new Map();
    for (const item of entries) {
        if (!item.code) continue;
        if (!map.has(item.code)) map.set(item.code, {
            code:item.code, name:item.name || '', cr:item.cr || '', sessions:[]
        });
        const dest = map.get(item.code);
        if (!dest.name && item.name) dest.name = item.name;
        if (!dest.cr && item.cr) dest.cr = item.cr;
        for (const session of item.sessions || []) {
            if (!dest.sessions.some(old =>
                old.day === session.day &&
                old.periodStart === session.periodStart &&
                old.periodEnd === session.periodEnd &&
                old.type === session.type &&
                old.room === session.room
            )) dest.sessions.push(session);
        }
    }
    return [...map.values()];
}

/* Clipboard HTML preserves empty day cells, unlike copied plain text. */
function edugateFromHTML(html) {
    if (!html || !/<table[\s>]/i.test(html)) return [];
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const candidates = [];
    for (const table of doc.querySelectorAll('table')) {
        const rows = [...table.querySelectorAll('tr')];
        let headerIndex = -1, index = {};
        for (let i = 0; i < rows.length; i++) {
            const labels = [...rows[i].children].filter(x => /^(TD|TH)$/i.test(x.tagName))
                .map(x => edugateClean(x.textContent).toLowerCase());
            const lookup = {
                code: labels.findIndex(x => /course\s*code/.test(x)),
                name: labels.findIndex(x => /course\s*name/.test(x)),
                activity: labels.findIndex(x => /^activity$/.test(x)),
                sun: labels.findIndex(x => /^sun$/.test(x)),
                mon: labels.findIndex(x => /^mon$/.test(x)),
                tue: labels.findIndex(x => /^tue$/.test(x)),
                wed: labels.findIndex(x => /^wed$/.test(x)),
                thu: labels.findIndex(x => /^thu$/.test(x)),
                room: labels.findIndex(x => /^room$/.test(x)),
                building: labels.findIndex(x => /^building$/.test(x)),
                cr: labels.findIndex(x => /^cr$/.test(x))
            };
            if (lookup.code >= 0 && lookup.activity >= 0) {
                headerIndex = i; index = lookup; break;
            }
            // Edugate commonly uses 2-row headers, and the second header omits Code/Name.
            if (labels.includes('activity') && labels.includes('sun') && labels.includes('room')) {
                index = { code:0,name:1,cr:2,activity:6,sun:7,mon:8,tue:9,wed:10,thu:11,building:12,room:13 };
                headerIndex = i; break;
            }
        }
        if (headerIndex < 0) continue;
        for (const tr of rows.slice(headerIndex + 1)) {
            const cols = [...tr.children].filter(x => /^(TD|TH)$/i.test(x.tagName))
                .map(x => edugateClean(x.textContent));
            const value = k => index[k] >= 0 ? (cols[index[k]] || '') : '';
            const code = edugateCode(value('code'));
            if (!code) continue;
            const type = /practical|lab/i.test(value('activity')) ? 'Practical' : 'Theoretical';
            const sessions = [];
            for (const day of EDUGATE_DAYS) {
                const slot = edugatePeriods(value(day.toLowerCase()));
                if (slot) sessions.push({ ...slot, day, type, room:value('room'),building:value('building') });
            }
            candidates.push({
                code, name:value('name'),
                cr: /^[1-6]$/.test(value('cr')) ? value('cr') : '',
                sessions
            });
        }
    }
    return edugateGroup(candidates);
}

const EDUGATE_ROW =
    /\b([A-Z]{2,6})\s+(\d{3,4}[A-Z]?)\s+([A-Za-z][A-Za-z0-9 ()&.,/'-]{1,110}?)\s+(Theoretical|Practical|Laboratory|Lab)\b/gi;

function edugateFromText(raw) {
    const normalized = edugateClean(raw);
    const found = [...normalized.matchAll(EDUGATE_ROW)];
    const entries = [], warnings = [];
    for (let i = 0; i < found.length; i++) {
        const m = found[i], code = `${m[1].toUpperCase()} ${m[2].toUpperCase()}`;
        const details = normalized.slice(m.index + m[0].length,
            i + 1 < found.length ? found[i+1].index : normalized.length);
        const type = /practical|lab/i.test(m[4]) ? 'Practical' : 'Theoretical';
        // Only the leading part after Activity can contain the period groups.
        // Everything after the first building phrase belongs to location/staff metadata.
        const buildingAt = details.search(/\b(?:Wing\s*\d+|EE\s*Building|[A-Z]{2,5}\s+Building|Blackboard|FIELD[\s-]*GYM|MIT\s+First|Building\s+(?:Ground|First|Second)|Ground\s*Floor|First\s*Floor)\b/i);
        const beforeLocation = (buildingAt >= 0 ? details.slice(0,buildingAt) : details).trim();
        // When column breaks collapse into spaces, Sec+Seq can occur before Building.
        // Do not mistake CR/CT numbers after Sec+Seq for additional lecture periods.
        const secSeq = /(?:^|\s)\d{1,2}\s+\d{2,4}(?=\s|$)/.exec(beforeLocation);
        const periodArea = (secSeq ? beforeLocation.slice(0,secSeq.index) : beforeLocation).trim();
        const location = buildingAt >= 0 ? details.slice(buildingAt) : '';
        const sessions = [];
        const labeled = [...periodArea.matchAll(/\b(Sun|Mon|Tue|Wed|Thu|الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس)\s*:?\s*(\d{1,2}(?:\s*,\s*\d{1,2})*)/gi)];
        if (labeled.length) {
            for (const label of labeled) {
                const period = edugatePeriods(label[2]);
                if (period) sessions.push({ ...period, day:EDUGATE_DAY_LABELS[label[1].toLowerCase()] || '', type });
            }
        } else {
            // Plain text has already lost the blank Sun/Mon/Tue cells: no reliable day can be deduced.
            for (const token of periodArea.split(/\s+/)) {
                if (!/^\d{1,2}(?:,\d{1,2})*$/.test(token)) continue;
                const period = edugatePeriods(token);
                if (period) sessions.push({ ...period, day:'', type });
            }
        }
        let building = '', room = '', cr = '';
        if (location) {
            const buildingMatch = location.match(/^(Wing\s*\d+\s*-\s*(?:Ground|First|Second)\s*Floor|EE\s*Building\s*(?:Ground|First|Second)?\s*(?:Floor)?|[A-Z]{2,5}\s+Building\s*(?:Ground|First|Second)?\s*(?:Floor)?|Blackboard\s*-\s*Blackboard|FIELD[\s-]*GYM|MIT\s+First\s+Floor|Building\s+(?:Ground|First|Second)\s*Floor)/i);
            building = buildingMatch ? edugateClean(buildingMatch[1]) : '';
            // Room may occur after Floor or be pushed after the lecturer's name.
            const roomAfterFloor = location.match(/\bFloor\s+([A-Z]{1,3}\d{2,5}|\d{3,5}|Blackboard)\b/i);
            const alphanumericRoom = location.match(/\b([A-Z]{1,3}\d{2,5})\b/i);
            const numericRoom = location.match(/^(?:[\s\S]*?\bFloor)\s+(\d{3,5})\b/i);
            room = roomAfterFloor?.[1] || alphanumericRoom?.[1] || numericRoom?.[1] || '';
            // Text copy often reorders CR/CT and Sec/Seq near building/room.
            // Extract only if the 2-column CR/CT pair is unambiguous.
            const cleanLoc = location.replace(/\b(?:[A-Z]{1,3}\d{2,5})\b/g,' ')
                .replace(/\bFloor\b/ig,' ');
            const numbers = cleanLoc.match(/\b\d{1,4}\b/g) || [];
            const sectionSeq = numbers.findIndex((n,j) => j+2 < numbers.length &&
                Number(n) >= 1 && Number(n) <= 30 &&
                Number(numbers[j+1]) >= 40 && Number(numbers[j+1]) <= 2000 &&
                Number(numbers[j+2]) >= 1 && Number(numbers[j+2]) <= 6);
            if (sectionSeq >= 0 && sectionSeq + 3 < numbers.length &&
                Number(numbers[sectionSeq+3]) >= 1 && Number(numbers[sectionSeq+3]) <= 6) {
                cr = numbers[sectionSeq+2];
            }
        }
        if (!sessions.length) warnings.push(`${code}: لم تُعرف فترات المحاضرة`);
        else if (sessions.some(s => !s.day)) warnings.push(`${code}: يلزم تحديد يوم المحاضرة`);
        entries.push({code,name:edugateClean(m[3]),cr,sessions:sessions.map(s=>({...s,room,building}))});
    }
    return { courses:edugateGroup(entries), warnings };
}

function edugateImport(entries, warnings = []) {
    if (!entries.length) {
        alert('لم يتم التعرف على المواد. تأكد أنك نسخت جدول الإيدوقيت كاملًا.');
        return;
    }
    const existing = new Set(courses.map(c => c.code));
    const additions = entries.filter(c => !existing.has(c.code));
    for (const item of additions) {
        const course = newCourse({ code:item.code,name:item.name,cr:item.cr });
        for (const s of item.sessions) course.sessions.push(newSession(s));
        if (!course.sessions.length) course.sessions.push(newSession());
        courses.push(course);
    }
    saveToStorage();
    renderCourseList();
    const missingDays = additions.reduce((count, c) => count + c.sessions.filter(s=>!s.day).length, 0);
    const missingCR = additions.filter(c=>!c.cr).length;
    const message = [
        `تم التعرف على ${entries.length} مادة، وإضافة ${additions.length} مادة جديدة.`,
        missingDays ? `${missingDays} حصة تحتاج تحديد اليوم من القائمة.` : 'تم استخراج أيام المحاضرات.',
        missingCR ? `${missingCR} مادة تحتاج مراجعة الساعات المعتمدة.` : '',
        warnings.length ? 'راجع القاعات والمباني قبل الاعتماد النهائي.' : ''
    ].filter(Boolean).join('\n');
    if (typeof showAlert === 'function') showAlert('نتيجة استيراد الجدول',message,'✅');
    else alert(message);
}

document.getElementById('pasteInput')?.addEventListener('paste', event => {
    const html = event.clipboardData?.getData('text/html') || '';
    edugatePastedTable = html.includes('<table') ? html : null;
});

document.getElementById('pasteInput')?.addEventListener('input', event => {
    if (!event.inputType?.startsWith('insertFromPaste')) edugatePastedTable = null;
});

document.getElementById('parseBtn')?.addEventListener('click', () => {
    const input = document.getElementById('pasteInput');
    const raw = input?.value || '';
    if (!raw.trim()) { alert('الصق الجدول أولًا'); return; }
    try {
        let entries = edugatePastedTable ? edugateFromHTML(edugatePastedTable) : [];
        const warnings = [];
        if (!entries.length) {
            const plain = edugateFromText(raw);
            entries = plain.courses;
            warnings.push(...plain.warnings);
        }
        edugateImport(entries,warnings);
        if (entries.length) { input.value=''; edugatePastedTable=null; }
    } catch (error) {
        console.error('EDUGATE v2 parse failed',error);
        alert('تعذر استخراج الجدول. تحقق من صيغة النسخ أو أرسل النص للدعم.');
    }
});


/* =========================================
   MADKHAL — RESTORE SCHEDULE CONTROLS
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // استعادة المواد المحفوظة
    loadFromStorage();
    renderCourseList();

// ربط التبويبات العلوية بالدالة الأساسية
document.querySelectorAll('.sched-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchStep(btn.dataset.step);
    });
});

// ضبط حالة التبويبات عند فتح الصفحة
switchStep('input');

    // بناء الجدول والانتقال إليه
    document.getElementById('buildScheduleBtn')
        ?.addEventListener('click', () => {
            switchStep('view');
        });

    // الرجوع من الجدول إلى إدخال المواد
    document.getElementById('backToInputBtn')
        ?.addEventListener('click', () => {
            switchStep('input');
        });

    // إضافة مادة يدويًا
    document.getElementById('addCourseBtn')
        ?.addEventListener('click', () => {
            const course = newCourse();
            course.sessions.push(newSession());

            courses.push(course);
            saveToStorage();
            renderCourseList();
        });

    // حذف جميع المواد
    document.getElementById('clearAllBtn')
        ?.addEventListener('click', () => {

            if (!courses.length) return;

            if (!confirm('هل تريد حذف جميع المواد من الجدول؟')) {
                return;
            }

            courses = [];
            courseSeq = 0;
            sessionSeq = 0;

            saveToStorage();
            renderCourseList();
            buildScheduleCards();
        });

});


/* =========================================
   MADKHAL — FIXED IMAGE SHARE SYSTEM
   ========================================= */

document.getElementById('exportScheduleBtn')
?.addEventListener('click', async () => {

    const btn = document.getElementById('exportScheduleBtn');
    if (btn.disabled) return;

    const originalHTML = btn.innerHTML;
    let capture = null;

    try {
        btn.disabled = true;
        btn.textContent = 'جاري تجهيز الجدول...';

        if (typeof html2canvas !== 'function') {
            throw new Error('مكتبة html2canvas غير محملة');
        }

        buildScheduleCards();

        const source = document.getElementById('printLayout');
        if (!source) {
            throw new Error('لم يتم العثور على قالب الجدول');
        }

        // إنشاء نسخة مستقلة قابلة للتصوير
        capture = document.createElement('div');
        capture.className = 'schedule-capture';
        capture.innerHTML = source.innerHTML;

        Object.assign(capture.style, {
            position: 'fixed',
            left: '0px',
            top: '0px',
            width: '1320px',
            minWidth: '1320px',
            display: 'block',
            visibility: 'visible',
            opacity: '1',
            zIndex: '-1',
            pointerEvents: 'none',
            background: '#ffffff'
        });

        document.body.appendChild(capture);

        if (document.fonts?.ready) {
            await document.fonts.ready;
        }

        // انتظار الصور دون تعليق التصدير للأبد
        await Promise.all(
            Array.from(capture.querySelectorAll('img')).map(img => {
                if (img.complete) return Promise.resolve();

                return Promise.race([
                    new Promise(resolve => {
                        img.addEventListener('load', resolve, { once: true });
                        img.addEventListener('error', resolve, { once: true });
                    }),
                    new Promise(resolve => setTimeout(resolve, 3000))
                ]);
            })
        );

        const canvas = await html2canvas(capture, {
            backgroundColor: '#ffffff',
            scale: 2,
            width: 1320,
            windowWidth: 1400,
            scrollX: 0,
            scrollY: 0,
            useCORS: true,
            logging: false
        });

        const blob = await new Promise((resolve, reject) => {
            canvas.toBlob(
                result => result
                    ? resolve(result)
                    : reject(new Error('تعذر تحويل الجدول لصورة')),
                'image/png'
            );
        });

        const file = new File(
            [blob],
            'Madkhal-Schedule.png',
            { type: 'image/png' }
        );

        // إظهار نافذة المعاينة
        showScheduleSharePreview(blob, file);

    } catch (error) {
        console.error('Schedule export:', error);

        if (typeof showAlert === 'function') {
            showAlert(
                'تعذر إنشاء الصورة',
                'تحقق من اتصال الإنترنت أو أعد المحاولة.',
                '⚠️'
            );
        } else {
            alert('تعذر تجهيز صورة الجدول.');
        }

    } finally {
        capture?.remove();
        btn.disabled = false;
        btn.innerHTML = originalHTML;
    }
});


/* =========================================
   IMAGE PREVIEW + NATIVE SHARE
   ========================================= */

function showScheduleSharePreview(blob, file) {

    // منع تكرار المعاينة
    document.getElementById('madkhalShareOverlay')?.remove();

    const imageURL = URL.createObjectURL(blob);

    const overlay = document.createElement('div');
    overlay.id = 'madkhalShareOverlay';
    overlay.className = 'schedule-share-overlay';

    overlay.innerHTML = `
        <div class="schedule-share-panel">

            <div class="schedule-share-heading">
                <div>
                    <h3>جدولك جاهز! 🎉</h3>
                    <p>تقدر تحفظ الصورة أو تشاركها مع زملائك</p>
                </div>

                <button type="button"
                    id="closeScheduleShare"
                    class="schedule-share-close">
                    ✕
                </button>
            </div>

            <div class="schedule-share-image">
                <img id="schedulePreviewImage"
                    alt="صورة الجدول الدراسي">
            </div>

            <div class="schedule-share-actions">
                <button type="button"
                    id="nativeScheduleShare"
                    class="schedule-native-share">
                    <i class="fi fi-rr-share"></i>
                    مشاركة الصورة
                </button>

                <button type="button"
                    id="downloadScheduleImage"
                    class="schedule-download-btn">
                    <i class="fi fi-rr-download"></i>
                    حفظ الصورة
                </button>
            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('#schedulePreviewImage').src = imageURL;

    const close = () => {
        overlay.remove();
        URL.revokeObjectURL(imageURL);
    };

    overlay.querySelector('#closeScheduleShare')
        .addEventListener('click', close);

    // الاستدعاء مباشرة عند الضغط دون await قبله
    overlay.querySelector('#nativeScheduleShare')
        .addEventListener('click', () => {

            if (
                typeof navigator.share === 'function' &&
                typeof navigator.canShare === 'function' &&
                navigator.canShare({ files: [file] })
            ) {
                navigator.share({
                    files: [file],
                    title: 'جدولي الدراسي | منصة مدخل'
                }).catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error('Native share failed:', error);
                        alert('المشاركة غير متاحة. استخدم حفظ الصورة.');
                    }
                });

            } else {
                alert(
                    'المشاركة المباشرة غير مدعومة في هذا المتصفح. استخدم حفظ الصورة.'
                );
            }
        });

    // تحميل الصورة أو عرضها للحفظ على الآيفون
    overlay.querySelector('#downloadScheduleImage')
        .addEventListener('click', () => {

            const isIOS =
                /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (
                    navigator.platform === 'MacIntel' &&
                    navigator.maxTouchPoints > 1
                );

            if (isIOS) {
                const preview = window.open(imageURL, '_blank');

                if (!preview) {
                    alert(
                        'اضغط مطولاً على صورة الجدول بالأعلى ثم اختر حفظ في الصور.'
                    );
                }
                return;
            }

            const a = document.createElement('a');
            a.href = imageURL;
            a.download = 'Madkhal-Schedule.png';

            document.body.appendChild(a);
            a.click();
            a.remove();
        });
}
