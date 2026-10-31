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
      }
    });

    row.querySelector('.course-del-btn')?.addEventListener('click', () => {
      courses = courses.filter(c => c.id !== course.id);
      saveToStorage(); renderCourseList();
    });

    list.appendChild(row);
  });
  
  updateConflictUI(); // فحص عند التحميل
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
    if(c) { c.sessions = c.sessions.filter(s => s.id !== sess.id); saveToStorage(); row.remove(); }
  });
  return row;
}

function updateSess(cId, sId, f, v) {
  const c = courses.find(x => x.id === cId);
  if(c) { const s = c.sessions.find(x => x.id === sId); if(s) { s[f] = v; saveToStorage(); } }
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

document.getElementById('parseBtn')?.addEventListener('click', () => {
    const input = document.getElementById('pasteInput');
    const text = input?.value.trim();

    if (!text) {
        alert('الصق الجدول أولاً');
        return;
    }

    try {
        // توحيد شكل النص والأرقام
        const normalized = text
            .replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
            .replace(/\u00A0/g, ' ')
            .replace(/\r/g, '');

        // العثور على بداية كل مادة / شعبة
        const rowPattern =
            /^\s*([A-Z]{2,4})\s+(\d{3,4})\s+(.+?)\s+(Theoretical|Practical|Lab)\b/gmi;

        const matches = [...normalized.matchAll(rowPattern)];
        const imported = new Map();

        const dayMap = {
            sun: 'Sun',
            mon: 'Mon',
            tue: 'Tue',
            wed: 'Wed',
            thu: 'Thu',
            'الأحد': 'Sun',
            'الاثنين': 'Mon',
            'الثلاثاء': 'Tue',
            'الأربعاء': 'Wed',
            'الخميس': 'Thu'
        };

        matches.forEach((match, index) => {
            const code = `${match[1].toUpperCase()} ${match[2]}`;
            const name = match[3].trim();
            const type = /practical|lab/i.test(match[4])
                ? 'Practical'
                : 'Theoretical';

            const start = match.index + match[0].length;
            const end = index + 1 < matches.length
                ? matches[index + 1].index
                : normalized.length;

            // محتوى السطر مع الأسطر المكملة له
            const rawDetails = normalized.slice(start, end);

            // تحديد بداية بيانات المبنى
            const buildingPattern =
                /\b(?:Wing\s*\d+|FIELD-GYM|Blackboard|MIT\s+First\s+Floor)\b/i;

            const buildingMatch = buildingPattern.exec(rawDetails);

            const beforeBuilding = buildingMatch
                ? rawDetails.slice(0, buildingMatch.index)
                : rawDetails.split('\n')[0];

            const locationDetails = buildingMatch
                ? rawDetails.slice(buildingMatch.index)
                : '';

            // استخراج الفترات فقط قبل المبنى
            const periodsText = beforeBuilding
                .replace(/[ \t]+/g, ' ')
                .trim();

            const sessions = [];

            // يدعم اليوم الصريح عند وجوده بالنص
            const labeledPattern =
                /(Sun|Mon|Tue|Wed|Thu|الأحد|الاثنين|الثلاثاء|الأربعاء|الخميس)\s*:?\s*(\d{1,2}(?:,\d{1,2})*)/gi;

            const labeled = [...periodsText.matchAll(labeledPattern)];

            if (labeled.length) {
                labeled.forEach(item => {
                    const nums = item[2]
                        .split(',')
                        .map(Number)
                        .filter(n => n >= 1 && n <= 15)
                        .sort((a, b) => a - b);

                    if (!nums.length) return;

                    sessions.push({
                        type,
                        day: dayMap[item[1].toLowerCase()] || '',
                        periodStart: String(nums[0]),
                        periodEnd: String(nums[nums.length - 1])
                    });
                });
            } else {
                // فترات بلا يوم محدد: لا نخمن اليوم
                const groups = periodsText
                    .split(/\s+/)
                    .filter(token => /^\d{1,2}(?:,\d{1,2})*$/.test(token));

                groups.forEach(group => {
                    const nums = group
                        .split(',')
                        .map(Number)
                        .filter(n => n >= 1 && n <= 15)
                        .sort((a, b) => a - b);

                    if (!nums.length) return;

                    sessions.push({
                        type,
                        day: '',
                        periodStart: String(nums[0]),
                        periodEnd: String(nums[nums.length - 1])
                    });
                });
            }

            // استخراج المبنى والقاعة
            let building = '';
            let room = '';
            let cr = '';

            if (locationDetails) {
                const location = locationDetails
                    .replace(/\s*\n\s*/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                let remaining = location;

                const patterns = [
                    /^(Wing\s*\d+\s*-\s*Ground\s*Floor)\b/i,
                    /^(Blackboard\s*-\s*Blackboard)\b/i,
                    /^(MIT\s+First\s+Floor)\b/i,
                    /^(FIELD-GYM)\b/i
                ];

                for (const pattern of patterns) {
                    const found = remaining.match(pattern);

                    if (found) {
                        building = found[1].trim();
                        remaining = remaining.slice(found[0].length).trim();
                        break;
                    }
                }

                // Room ثم Sec ثم Seq ثم CR ثم CT
                const locationMatch = remaining.match(
                    /^([A-Z]?\d{1,5})\s+(\d+)\s+(\d+)(?:\s+(\d+))?(?:\s+(\d+))?(?=\s|$)/i
                );

                if (locationMatch) {
                    room = locationMatch[1];

                    const firstTrailing = locationMatch[4];
                    const secondTrailing = locationMatch[5];

                    // وجود CR و CT معاً
                    // إذا ظهر رقم واحد فقط بعد Sec/Seq
                    // فلا نفترض أنه CR لأنه قد يكون CT
                    if (firstTrailing && secondTrailing) {
                        const possibleCR = Number(firstTrailing);

                        if (possibleCR >= 1 && possibleCR <= 6) {
                            cr = String(possibleCR);
                        }
                    }
                }
            }

            if (!imported.has(code)) {
                imported.set(code, {
                    code,
                    name,
                    cr: '',
                    sessions: []
                });
            }

            const course = imported.get(code);

            if (cr && !course.cr) {
                course.cr = cr;
            }

            sessions.forEach(session => {
                course.sessions.push({
                    ...session,
                    room,
                    building
                });
            });
        });

        if (!imported.size) {
            alert('لم يتم التعرف على المواد. تأكد من نسخ الجدول بشكل صحيح.');
            return;
        }

        imported.forEach(entry => {
            const course = newCourse({
                code: entry.code,
                name: entry.name,
                cr: entry.cr
            });

            entry.sessions.forEach(session => {
                course.sessions.push(newSession(session));
            });

            if (!course.sessions.length) {
                course.sessions.push(newSession());
            }

            courses.push(course);
        });

        saveToStorage();
        renderCourseList();

        input.value = '';

        const missingCR = [...imported.values()]
            .filter(course => !course.cr).length;

        const message = [
            `تم استخراج ${imported.size} مادة بنجاح.`,
            missingCR
                ? `${missingCR} مادة تحتاج مراجعة الساعات المعتمدة.`
                : 'تم استخراج الساعات المعتمدة.',
            'راجع أيام المحاضرات وحددها قبل بناء الجدول.'
        ].join('\n');

        if (typeof showAlert === 'function') {
            showAlert('تم استخراج الجدول', message, '✅');
        } else {
            alert(message);
        }

    } catch (error) {
        console.error('Schedule Parser Error:', error);
        alert('حدث خطأ أثناء تحليل الجدول.');
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
