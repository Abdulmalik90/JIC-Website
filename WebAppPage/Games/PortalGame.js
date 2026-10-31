(() => {
'use strict';

const STORAGE_KEY = 'madkhal_campus_iq_v1';
const EXPORT_IMAGE_PATH = '../Images/Logo22.png';

const WEEKS = Object.freeze([
  { week: 11, date: '2026-11-01' },
  { week: 12, date: '2026-11-08' },
  { week: 13, date: '2026-11-15' },
  { week: 14, date: '2026-11-29' },
  { week: 15, date: '2026-12-06' }
]);

const START_WEEK = 11;
const START_DATE = '2026-11-01';
const AUTUMN_BREAK_START = '2026-11-20';
const AUTUMN_BREAK_END = '2026-11-28';
const CHALLENGE_LAST_DAY = '2026-12-12';
const EXPORT_UNLOCK_DATE = '2026-12-13';
const POINTS_BY_QUESTION = Object.freeze({ 1: 60, 2: 120, 3: 175 });
const TOTAL_POSSIBLE_POINTS = WEEKS.length * 300;

const QUESTION_BANK = [
  { week: 11, questions: [
    { id: 'w11q1', tag: 'خدمات مدخل', question: 'وش المبادرة الطلابية اللي وفرت منصة رهيبه؟🚀', hint: 'من اربع حروف', answer: 'مدخل' },
    { id: 'w11q2', tag: 'حياة الجامعة', question: 'كم سعر وجبة الافطار الرمضاني بميز الكلية؟', hint: 'رقم بفواصل', answer: '2.30' },
    { id: 'w11q3', tag: 'حياة الجامعة', question: 'في اي فصل دراسي صار السكن بدون تأمين؟', hint: 'رقم فقط', answer: '471' }
  ]},
  { week: 12, questions: [
    { id: 'w12q1', tag: 'اختبارات', question: 'وش يسمون اختبار منتصف الفصل باللغة الطلابية؟', hint: 'ثلاث حروف', answer: 'ميد' },
    { id: 'w12q2', tag: 'خدمات مدخل', question: 'وش اسم قسم المستندات في منصة مدخل؟', hint: 'تبدا بـ ال', answer: 'الموسوعة' },
    { id: 'w12q3', tag: 'الطالبات', question: 'في اي فصل دراسي طبقوا اليونيفورم للبنات؟👧🏻', hint: 'رقم الفصل الدراسي', answer: '481' }
  ]},
  { week: 13, questions: [
    { id: 'w13q1', tag: 'تخرج', question: 'ايش اسم اخر مقرر قبل التخرج؟', hint: 'ماتاخذ شهادتك الا لما تخلصه', answer: 'التدريب التعاوني' },
    { id: 'w13q2', tag: 'حياة الجامعة', question: 'ايش هو اسم عميد الكلية ؟', hint: 'الاسم الاول فقط', answer: 'سرحان' },
    { id: 'w13q3', tag: 'الدراسة', question: 'حرفين اجنبية يخاف منها كل الطلاب؟👀', hint: 'من حرفين', answer: 'DN' }
  ]},
  { week: 14, questions: [
    { id: 'w14q1', tag: 'المجلس الطلابي', question: 'من هو رئيس المجلس الطلابي الحالي؟🏃🏻‍♀️', hint: 'الاسم الاول والاخير', answer: 'محمد حيدره' },
    { id: 'w14q2', tag: 'تحويل', question: 'كم هو ادنى معدل للتحويل من دبلوم هندسي لبكالوروس هندسي؟', hint: 'رقم بفواصل', answer: '3.75' },
    { id: 'w14q3', tag: 'مباني', question: 'كم هو عدد مباني الاسكان الفردية بالكلية؟', hint: 'رقم', answer: '3' }
  ]},
  { week: 15, questions: [
    { id: 'w15q1', tag: 'مدخل', question: 'اسم المصمم والمسؤول عن مبادرة مدخل الطلابية؟👀', hint: 'الاسم الاول والاخير', answer: 'رائد الزهراني' },
    { id: 'w15q2', tag: 'الدراسة', question: 'وش يسمون الطلاب الفصل الدراسي بالعادة؟', hint: 'مايبيلها هنتات', answer: 'سمستر' },
    { id: 'w15q3', tag: 'اندية طلابية', question: 'اكثر نادي نشيط في منصة مدخل؟', hint: 'نادي الـ؟', answer: 'فصل' }
  ]}
];

const REMARKS = [
  'شكلك مغبر 👀',
  'يا رهيب! 🔥',
  'شكلك معمر بالكلية🧓🏻',
  'ماتوقعتك تجيبها😮‍💨',
  'ماطفشت من الكلية؟',
  'اشوف لو تقدم لعمادة الكلية👀'
];

const $ = (id) => document.getElementById(id);
const shell = document.querySelector('.mg-shell');
if (!shell) return;

const allQuestions = QUESTION_BANK.flatMap(weekObj => weekObj.questions.map((q, i) => ({ ...q, week: weekObj.week, number: i + 1 })));
const questionById = new Map(allQuestions.map(q => [q.id, q]));

let profile = loadProfile();
let selectedQuestion = null;
let answerLocked = false;

function loadProfile() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      name: typeof raw.name === 'string' ? raw.name : '',
      results: raw.results && typeof raw.results === 'object' ? raw.results : {}
    };
  } catch {
    return { name: '', results: {} };
  }
}

function saveProfile() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

function localToday() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date());
  const obj = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${obj.year}-${obj.month}-${obj.day}`;
}

function normalize(text) {
  return String(text || '')
    .trim()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function weekDate(weekNumber) {
  return WEEKS.find(w => w.week === weekNumber)?.date || '';
}

function hasStarted() {
  return localToday() >= START_DATE;
}

function isAutumnBreak() {
  const today = localToday();
  return today >= AUTUMN_BREAK_START && today <= AUTUMN_BREAK_END;
}

function challengeEnded() {
  return localToday() > CHALLENGE_LAST_DAY;
}

function exportUnlocked() {
  return localToday() >= EXPORT_UNLOCK_DATE;
}

function currentWeek() {
  const today = localToday();
  const opened = WEEKS.filter(w => w.date <= today);
  return opened.length ? opened[opened.length - 1].week : START_WEEK - 1;
}

function getResult(id) {
  return profile.results[id] || null;
}

function attempts(id) {
  const result = getResult(id);
  if (!result) return 0;
  return Math.max(0, Math.min(3, Number(result.attempts) || 0));
}

function status(question) {
  const result = getResult(question.id);
  if (result?.correct) return 'solved';
  if (attempts(question.id) >= 3) return 'failed';
  return 'open';
}

function reward(question) {
  return POINTS_BY_QUESTION[question.number] || 0;
}

function solvedQuestions() {
  return allQuestions.filter(q => getResult(q.id)?.correct);
}

function totalPoints() {
  return solvedQuestions().reduce((sum, q) => sum + reward(q), 0);
}

function percentage() {
  return (totalPoints() / TOTAL_POSSIBLE_POINTS) * 100;
}

function rank() {
  const pct = percentage();
  if (pct >= 99) return 'عميد الكلية';
  if (pct >= 70) return 'خريج';
  if (pct >= 50) return 'مغبر بالكلية';
  if (pct >= 40) return 'فرشمان';
  if (pct >= 30) return 'جونيور';
  if (pct >= 20) return 'رئيس التحضيري';
  return 'تحضيري';
}

function formatPercent(value) {
  const rounded = Number(value.toFixed(1));
  return `${String(rounded).replace(/\.0$/, '')}٪`;
}

function availableQuestionsCount() {
  const today = localToday();
  return allQuestions.filter(q => weekDate(q.week) <= today).length;
}

function questionOpenByDate(question) {
  return hasStarted() && localToday() >= weekDate(question.week) && !challengeEnded();
}

function updateExportButton() {
  const button = $('mgExportCard');
  const note = $('mgExportNote');
  if (!button || !note) return;
  const open = exportUnlocked();
  button.disabled = !open;
  button.setAttribute('aria-disabled', String(!open));
  button.textContent = open ? 'حفظ صورة التهنئة' : '🔒 متاح بعد نهاية الأسبوع 15';
  note.textContent = open
    ? 'جاهزة للحفظ على جهازك ومشاركتها.'
    : 'يتفعّل التصدير ابتداءً من ١٣ ديسمبر ٢٠٢٦ بعد انتهاء الأسبوع الخامس عشر.';
}

function screen(name) {
  shell.querySelectorAll('.mg-view').forEach(view => {
    view.hidden = view.dataset.view !== name;
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startGame() {
  const field = $('mgPlayerName');
  const name = field.value.trim().replace(/\s+/g, ' ');
  if (name.length < 2) {
    $('mgNameError').textContent = 'اكتب اسمًا من حرفين على الأقل.';
    return;
  }
  $('mgNameError').textContent = '';
  profile.name = name.slice(0, 24);
  saveProfile();
  renderHub();
}

function renderHub() {
  $('mgDisplayName').textContent = profile.name;
  $('mgTotalScore').textContent = totalPoints().toLocaleString('en-US');
  $('mgSolved').textContent = solvedQuestions().length;
  $('mgAvailableCount').textContent = `من ${availableQuestionsCount()}`;
  $('mgRank').textContent = rank();
  $('mgPercentage').textContent = `${formatPercent(percentage())} من ${TOTAL_POSSIBLE_POINTS} نقطة`;

  const currentWeekBadge = $('mgWeekNow');
  if (!hasStarted()) currentWeekBadge.textContent = 'لم يبدأ التحدي';
  else if (challengeEnded()) currentWeekBadge.textContent = 'انتهى التحدي';
  else if (isAutumnBreak()) currentWeekBadge.textContent = '🍂 بريك الخريف';
  else currentWeekBadge.textContent = `الأسبوع ${currentWeek()}`;

  updateExportButton();

  const container = $('mgWeeks');
  container.replaceChildren();

  QUESTION_BANK.forEach(weekObj => {
    if (weekObj.week === 14) {
      container.append(createBreakCard());
    }
    container.append(createWeekCard(weekObj));
  });

  const nextText = $('mgNextUnlock');
  if (!hasStarted()) {
    nextText.textContent = `بداية التحدي يوم ${START_DATE}، وتُفتح 3 ألغاز جديدة كل أسبوع.`;
  } else if (challengeEnded()) {
    nextText.textContent = 'انتهى وقت الإجابات. الآن تقدر تستعرض نتائجك وتحفظ بطاقة التهنئة بعد فتح التصدير.';
  } else if (isAutumnBreak()) {
    nextText.textContent = 'نحن في اجازة الخريف. لا توجد ألغاز جديدة خلال الإجازة، لكن تقدر ترجع للأسابيع السابقة.';
  } else {
    const nextWeek = WEEKS.find(w => w.date > localToday());
    nextText.textContent = nextWeek
      ? `الأسبوع القادم يفتح يوم ${nextWeek.date} بتوقيت السعودية.`
      : `آخر أسبوع نشط الآن هو الأسبوع 15، وآخر يوم للإجابات هو ${CHALLENGE_LAST_DAY}.`;
  }

  screen('hub');
}

function createBreakCard() {
  const article = document.createElement('article');
  article.className = 'mg-week-card mg-break-card';

  const icon = document.createElement('span');
  icon.className = 'mg-break-icon';
  icon.textContent = '🍂';

  const textWrap = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = 'اجازة الخريف';
  const note = document.createElement('small');
  note.textContent = 'من 20 إلى 28 نوفمبر — بدون ألغاز جديدة';

  textWrap.append(title, note);
  article.append(icon, textWrap);
  return article;
}

function createWeekCard(weekObj) {
  const weekOpened = hasStarted() && localToday() >= weekDate(weekObj.week);
  const completed = weekObj.questions.filter(q => status(q) === 'solved').length;

  const article = document.createElement('article');
  article.className = `mg-week-card${weekOpened ? '' : ' mg-locked-week'}`;

  const head = document.createElement('div');
  head.className = 'mg-week-card-head';

  const info = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = `الأسبوع ${weekObj.week}`;
  const sub = document.createElement('small');
  sub.textContent = weekOpened
    ? `فتح ${weekDate(weekObj.week)} • ${completed}/3 صحيحة`
    : `يفتح ${weekDate(weekObj.week)}`;
  info.append(title, sub);

  const count = document.createElement('span');
  count.className = 'mg-week-count';
  count.textContent = weekOpened ? `${completed}/3` : '🔒 مغلق';

  head.append(info, count);

  const list = document.createElement('div');
  list.className = 'mg-question-list';

  weekObj.questions.forEach((question, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'mg-question-link';

    const questionStatus = status(question);
    const usableNow = questionOpenByDate(question) || questionStatus === 'solved' || questionStatus === 'failed';
    button.disabled = !usableNow;

    if (questionStatus === 'solved') button.classList.add('mg-done');
    if (questionStatus === 'failed') button.classList.add('mg-failed');

    const main = document.createElement('span');
    main.textContent = `لغز ${index + 1}`;

    const small = document.createElement('small');
    if (!weekOpened) small.textContent = 'مغلق';
    else if (questionStatus === 'solved') small.textContent = `✓ ${reward(question)} نقطة`;
    else if (questionStatus === 'failed') small.textContent = '✕ انتهت المحاولات';
    else if (challengeEnded()) small.textContent = 'انتهى الوقت';
    else small.textContent = `${3 - attempts(question.id)} محاولات`;

    button.append(main, small);
    button.addEventListener('click', () => openQuestion(question.id));
    list.append(button);
  });

  article.append(head, list);
  return article;
}

function openQuestion(questionId) {
  const question = questionById.get(questionId);
  if (!question) return;

  const state = status(question);
  if (!questionOpenByDate(question) && state === 'open') return;

  selectedQuestion = question;
  answerLocked = false;

  if (state === 'solved') {
    renderReveal(true, reward(question), true);
    return;
  }

  if (state === 'failed') {
    renderReveal(false, 0, true);
    return;
  }

  showQuestion();
}

function showQuestion() {
  $('mgQuestionWeek').textContent = `الأسبوع ${selectedQuestion.week} / اللغز ${selectedQuestion.number}`;
  $('mgQuestionTag').textContent = selectedQuestion.tag;
  $('mgQuestionText').textContent = selectedQuestion.question;
  $('mgQuestionHint').textContent = selectedQuestion.hint ? `تلميح: ${selectedQuestion.hint}` : '';
  $('mgQuestionPoints').textContent = `${reward(selectedQuestion)} نقطة`;
  $('mgFeedback').textContent = '';
  $('mgAttempts').textContent = `المحاولات المتبقية: ${3 - attempts(selectedQuestion.id)} من 3`;
  const input = $('mgAnswerInput');
  input.value = '';
  input.disabled = challengeEnded();
  input.focus();
  screen('play');
}

function shakeInput() {
  const input = $('mgAnswerInput');
  input.classList.remove('mg-shake');
  void input.offsetWidth;
  input.classList.add('mg-shake');
  window.setTimeout(() => input.classList.remove('mg-shake'), 450);
}

function submitAnswer() {
  if (!selectedQuestion || answerLocked) return;
  if (challengeEnded()) {
    $('mgFeedback').textContent = 'انتهى وقت التحدي.';
    return;
  }

  const input = $('mgAnswerInput');
  const typed = input.value;
  if (!typed.trim()) {
    $('mgFeedback').textContent = 'اكتب إجابتك أول.';
    input.focus();
    return;
  }

  if (normalize(typed) === normalize(selectedQuestion.answer)) {
    answerLocked = true;
    profile.results[selectedQuestion.id] = {
      attempts: attempts(selectedQuestion.id) + 1,
      correct: true,
      points: reward(selectedQuestion)
    };
    saveProfile();
    input.blur();
    renderReveal(true, reward(selectedQuestion), false);
    return;
  }

  const used = attempts(selectedQuestion.id) + 1;
  profile.results[selectedQuestion.id] = { attempts: used, correct: false, points: 0 };
  saveProfile();
  shakeInput();
  input.value = '';
  $('mgAttempts').textContent = `المحاولات المتبقية: ${3 - used} من 3`;

  if (used >= 3) {
    answerLocked = true;
    input.disabled = true;
    $('mgFeedback').textContent = 'خلصت المحاولات.';
    window.setTimeout(() => {
      if (selectedQuestion) renderReveal(false, 0, false);
    }, 500);
  } else {
    $('mgFeedback').textContent = `مو صحيحة! باقي لك ${3 - used} ${3 - used === 1 ? 'محاولة' : 'محاولات'}.`;
    input.focus();
  }
}

function renderReveal(correct, points, revisit) {
  const seed = selectedQuestion?.id || 'x';
  const remark = REMARKS[Math.abs(Array.from(seed).reduce((sum, ch) => sum + ch.charCodeAt(0), 0)) % REMARKS.length];

  $('mgRevealKicker').textContent = correct ? 'إجابة صحيحة' : 'انتهت المحاولات';
  $('mgRevealSymbol').textContent = correct ? '✳' : '✕';
  $('mgRevealTitle').textContent = correct ? (revisit ? 'جاوبتها من قبل' : remark) : (revisit ? 'محسوبة من قبل' : 'خلصت محاولاتك');
  $('mgRevealDetail').textContent = correct
    ? `أحسنت! الجواب صحيح، ورصيدك الحالي ${totalPoints()} نقطة.`
    : `الجواب الصحيح: ${selectedQuestion.answer}. خذها معلومة للجولة الجاية.`;
  $('mgRevealPoints').textContent = correct ? `+${points} نقطة` : '0 نقطة';
  screen('reveal');
}

async function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawSoftShape(ctx, x, y, radius, color) {
  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEmoji(ctx, emoji, x, y, size, alpha, rotate) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotate);
  ctx.globalAlpha = alpha;
  ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, 0, 0);
  ctx.restore();
}

async function exportCard() {
  if (!exportUnlocked()) return;

  const button = $('mgExportCard');
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = 'جاري تجهيز الصورة...';

  try {
    await document.fonts.ready;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#fafdff');
    gradient.addColorStop(1, '#eef8ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawSoftShape(ctx, 150, 170, 170, '#9ddcff');
    drawSoftShape(ctx, 950, 210, 120, '#d0ecff');
    drawSoftShape(ctx, 900, 1170, 190, '#bfe5ff');
    drawSoftShape(ctx, 140, 1120, 110, '#e4f5ff');

    drawEmoji(ctx, '🎓', 920, 110, 84, 0.12, 0.2);
    drawEmoji(ctx, '📚', 150, 1020, 92, 0.10, -0.2);
    drawEmoji(ctx, '🧩', 940, 1210, 86, 0.08, 0.15);
    drawEmoji(ctx, '✨', 200, 260, 70, 0.08, -0.1);

    roundedRect(ctx, 95, 100, 890, 1140, 42);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.shadowColor = 'rgba(14, 80, 130, 0.12)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 10;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    const logo = await loadImage(EXPORT_IMAGE_PATH);
    if (logo) {
      const maxLogoWidth = 210;
      const scale = Math.min(maxLogoWidth / logo.width, 90 / logo.height);
      const w = logo.width * scale;
      const h = logo.height * scale;
      ctx.drawImage(logo, (canvas.width - w) / 2, 150, w, h);
    }

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f3153';

    ctx.font = '700 34px Tajawal, sans-serif';
    ctx.fillText('بطاقة تهنئة', 540, 290);

    ctx.font = '900 66px Tajawal, sans-serif';
    ctx.fillStyle = '#087bc4';
    ctx.fillText('قد إيش تعرف الكلية؟', 540, 390);

    ctx.font = '700 28px Tajawal, sans-serif';
    ctx.fillStyle = '#5d7791';
    ctx.fillText('مبروك وصولك لنهاية تحدي مدخل', 540, 450);

    roundedRect(ctx, 180, 515, 720, 470, 36);
    ctx.fillStyle = '#f7fbff';
    ctx.strokeStyle = '#d8ebf8';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#7a92a8';
    ctx.font = '700 28px Tajawal, sans-serif';
    ctx.fillText(profile.name || 'لاعب مدخل', 540, 610);

    ctx.fillStyle = '#133a60';
    ctx.font = '900 92px Tajawal, sans-serif';
    ctx.fillText(rank(), 540, 760);

    ctx.fillStyle = '#087bc4';
    ctx.font = '900 42px Tajawal, sans-serif';
    ctx.fillText(`${totalPoints().toLocaleString('en-US')} نقطة`, 540, 840);

    ctx.fillStyle = '#7d94aa';
    ctx.font = '700 24px Tajawal, sans-serif';
    ctx.fillText(`نسبة الإنجاز ${formatPercent(percentage())}`, 540, 895);

    roundedRect(ctx, 240, 1030, 600, 96, 24);
    ctx.fillStyle = '#0d74bb';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 30px Tajawal, sans-serif';
    ctx.fillText('منصة مدخل', 540, 1088);

    ctx.fillStyle = '#68829b';
    ctx.font = '700 22px Tajawal, sans-serif';
    ctx.fillText('الفصل الأول 481', 540, 1178);
    ctx.fillText('juportal.online', 540, 1218);

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('no_blob');

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `تهنئة-مدخل-${(profile.name || 'player').replace(/[\\/:*?"<>|]/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('صار خطأ أثناء تجهيز صورة التهنئة.');
  } finally {
    button.disabled = !exportUnlocked();
    button.textContent = exportUnlocked() ? originalText : '🔒 متاح بعد نهاية الأسبوع 15';
  }
}

function bindEvents() {
  $('mgBegin')?.addEventListener('click', startGame);
  $('mgPlayerName')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') startGame();
  });
  $('mgChangeName')?.addEventListener('click', () => {
    $('mgPlayerName').value = profile.name;
    screen('welcome');
  });
  $('mgBack')?.addEventListener('click', renderHub);
  $('mgSkip')?.addEventListener('click', renderHub);
  $('mgSubmit')?.addEventListener('click', submitAnswer);
  $('mgNext')?.addEventListener('click', renderHub);
  $('mgExportCard')?.addEventListener('click', exportCard);
  $('mgAnswerInput')?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitAnswer();
    }
  });
}

function init() {
  bindEvents();
  if ($('mgPlayerName')) $('mgPlayerName').value = profile.name;
  if (profile.name) renderHub();
  else screen('welcome');
}

init();
})();
