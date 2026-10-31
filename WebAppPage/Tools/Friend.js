/* Madkhal | Rafiq beta — schedule companion, independent module */
(() => {
 'use strict';
 const SCHEDULE_KEY='madkhal-mobile-schedule', OLD_SCHEDULE_KEY='madkhal-schedule-v2', KEY='madkhal-rafiq-v1';
 const DAYS=['Sun','Mon','Tue','Wed','Thu'];
 const NAMES=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
 const PERIODS=[['07:00','07:50'],['08:00','08:50'],['09:00','09:50'],['10:00','10:50'],['11:00','11:50'],['12:20','13:10'],['13:20','14:10'],['14:20','15:10'],['15:30','16:20'],['16:30','17:20'],['17:30','18:20'],['18:30','19:20'],['19:30','20:20'],['20:30','21:20'],['21:30','22:20']];
 const $=id=>document.getElementById(id);
 const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const mins=t=>{const [h,m]=t.split(':').map(Number);return h*60+m;};
 const clock=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
 const remaining=m=>m>=60?`${Math.floor(m/60)} ساعة${m%60?` و${m%60} دقيقة`:''}`:`${m} دقيقة`;
 const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
 let state={semesterStart:'',entries:[],exams:{}}, mounted=false, lastScheduleFingerprint='';
 const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
 function hydrate(){
  const old=read(KEY)||{};
  state.semesterStart=typeof old.semesterStart==='string'?old.semesterStart:'';
  state.exams=old.exams&&typeof old.exams==='object'?old.exams:{};
  if(Array.isArray(old.entries)) state.entries=old.entries;
  else {
   // Migration: preserve existing tasks + notes from previous Rafiq version
   state.entries=[...(Array.isArray(old.tasks)?old.tasks:[]).map(x=>({...x,kind:'task'})),...(Array.isArray(old.notes)?old.notes:[]).map(x=>({...x,kind:'note'}))];
   if(state.entries.length) save();
  }
 }
 function getRawSchedule(){
  const primary=read(SCHEDULE_KEY), fallback=read(OLD_SCHEDULE_KEY);
  if(Array.isArray(primary?.courses)&&primary.courses.length) return primary.courses;
  if(Array.isArray(fallback?.courses)) return fallback.courses;
  return Array.isArray(primary?.courses)?primary.courses:[];
 }
 function allSessions(){
  const result=[];let missingDay=0,invalidPeriod=0;
  for(const course of getRawSchedule()) for(const s of (Array.isArray(course.sessions)?course.sessions:[])){
   const start=Number(s.periodStart), end=Number(s.periodEnd||s.periodStart);
   if(!Number.isInteger(start)||start<1||start>15){invalidPeriod++;continue;}
   if(!DAYS.includes(s.day)){missingDay++;continue;}
   const last=Number.isInteger(end)&&end>=start&&end<=15?end:start;
   result.push({day:s.day,code:String(course.code||'مادة'),name:String(course.name||''),type:s.type==='Theoretical'?'نظري':'عملي',room:String(s.room||''),building:String(s.building||''),start:mins(PERIODS[start-1][0]),end:mins(PERIODS[last-1][1]),colour:/^#[0-9a-f]{6}$/i.test(course.colour)?course.colour:'#007bc4'});
  }
  result.sort((a,b)=>DAYS.indexOf(a.day)-DAYS.indexOf(b.day)||a.start-b.start);
  return {result,missingDay,invalidPeriod};
 }
 function nextSession(now,sessions){
  const today=now.getDay(), minute=now.getHours()*60+now.getMinutes();
  const candidates=[];
  for(let offset=0;offset<8;offset++){
   const targetDay=(today+offset)%7, dayKey=DAYS[targetDay];if(!dayKey)continue;
   for(const s of sessions){if(s.day!==dayKey)continue;
    if(offset===0 && s.end<=minute)continue;
    candidates.push({...s,offset,minutesUntil:offset*1440+s.start-minute});
   }
  }
  return candidates.sort((a,b)=>a.offset-b.offset||a.start-b.start)[0]||null;
 }
 function localDate(d){return new Date(d+'T00:00:00');}
 function localDayKey(now){return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
 function dateShort(d){return localDate(d).toLocaleDateString('ar-SA-u-ca-gregory',{day:'numeric',month:'short'});}
 function calendarPeriod(now){
  const date=localDayKey(now),terms=window.SahibAcademicCalendar?.terms||[];
  for(const term of terms){
   const holidays=term.holidays||[],exams=term.exams||[];
   // Final exams and holidays override normal teaching weeks. Midterms override lectures during week 8.
   const holiday=holidays.find(e=>date>=e.start&&date<=e.end);
   if(holiday)return {kind:'holiday',term,holiday};
   const exam=exams.find(e=>date>=e.start&&date<=e.end);
   if(exam)return {kind:'exam',term,exam};
   const index=term.weeks.findIndex(start=>{ const end=localDate(start); end.setDate(end.getDate()+6); return date>=start&&date<=localDayKey(end); });
   if(index>=0)return {kind:'week',term,index};
  }
  return {kind:'outside'};
 }
 function showWeek(now){
  const number=$('rfWeekNumber'),fill=$('rfWeekFill'),caption=$('rfWeekCaption');
  const period=calendarPeriod(now),holder=$('rfWeekPanel');
  if(!number||!fill||!caption)return period;
  holder?.classList.toggle('rf-week-holiday',period.kind==='holiday');
  holder?.classList.toggle('rf-week-exam',period.kind==='exam');
  if(period.kind==='holiday'){
   number.textContent=period.holiday.name;number.classList.add('rf-week-name');fill.style.width='0%';
   caption.textContent=`تنتهي ${dateShort(period.holiday.end)}`;
  }else if(period.kind==='exam'){
   number.classList.add('rf-week-name');number.textContent=period.exam.name;
   fill.style.width='100%';caption.textContent=`حتى ${dateShort(period.exam.end)} • ${period.term.name}`;
  }else if(period.kind==='week'){
   number.classList.remove('rf-week-name');number.textContent=`${period.index+1} / 16`;
   fill.style.width=`${(period.index+1)/16*100}%`;
   caption.textContent=`${period.term.name} • الأسبوع ${period.index+1}`;
  }else{
   number.classList.remove('rf-week-name');number.textContent='— / 16';fill.style.width='0%';
   const first=window.SahibAcademicCalendar?.terms?.[0]?.weeks?.[0];
   caption.textContent=first&&localDayKey(now)<first?'لم يبدأ العام الدراسي بعد':'خارج الأسابيع المعتمدة';
  }
  return period;
 }
 function examStoreKey(period){return `${period.term.id}-${period.exam.kind}`;}
 function getExams(period){return Array.isArray(state.exams?.[examStoreKey(period)])?state.exams[examStoreKey(period)]:[];}
 function showExamMode(period){
  const now=new Date(),today=localDayKey(now),exams=getExams(period);
  const current=exams.filter(e=>e.day>=today).sort((a,b)=>a.day.localeCompare(b.day)||a.start.localeCompare(b.start));
  $('rfTodayCount').textContent=String(exams.filter(e=>e.day===today).length);
  const h=$('rfClassHero'),list=$('rfTodayList');
  const next=current[0];
  const display=e=>`${escapeHTML(e.code)}${e.name?' — '+escapeHTML(e.name):''}`;
  h.innerHTML=next?`<span class="rf-status">${escapeHTML(period.exam.name)}</span><h3>${display(next)}</h3><div class="rf-meta"><span>📆 ${dateShort(next.day)}</span><span>🕒 <b dir="ltr">${escapeHTML(next.start)}${next.end?' - '+escapeHTML(next.end):''}</b></span><span>📍 ${escapeHTML(next.location||'القاعة غير محددة')}</span></div><div class="rf-hero-hint">اختبارك القادم • بالتوفيق ✨</div>`:
    `<span class="rf-status">${escapeHTML(period.exam.name)}</span><h3>رتب اختباراتك مع صاحب</h3><p>استخدم زر «تعديل» لإضافة مواعيد اختباراتك ومواقع قاعاتها.</p>`;
  list.innerHTML=exams.length?exams.slice().sort((a,b)=>a.day.localeCompare(b.day)||a.start.localeCompare(b.start)).map(e=>`<article class="rf-session" style="--rf-course-color:#4c91c3"><div class="rf-session-time">${dateShort(e.day)}<span dir="ltr">${escapeHTML(e.start)}</span></div><div class="rf-session-data"><b>${display(e)}</b><small>${e.end?'ينتهي '+escapeHTML(e.end)+' • ':''}${escapeHTML(e.location||'لم تحدد القاعة')}</small></div></article>`).join(''):'<div class="rf-empty">ما أضفت اختبارات بعد. افتح «تعديل» لترتيبها.</div>';
 }
 function openExamEditor(){
  const period=calendarPeriod(new Date());if(period.kind!=='exam')return;
  $('rfExamDialog').hidden=false;renderExamEditor(period);
 }
 function renderExamEditor(period){
  const root=$('rfExamExisting'),exams=getExams(period);
  root.innerHTML=exams.map(e=>`<div class="rf-exam-item"><div><b>${escapeHTML(e.code)}</b><small>${dateShort(e.day)} • ${escapeHTML(e.start)} • ${escapeHTML(e.location||'لا توجد قاعة')}</small></div><button type="button" data-id="${escapeHTML(e.id)}" data-exam-action="edit" aria-label="تعديل">✎</button><button type="button" data-id="${escapeHTML(e.id)}" data-exam-action="delete" aria-label="حذف">×</button></div>`).join('')||'<p class="rf-muted">لا توجد اختبارات مسجلة.</p>';
 }
 function initExamEditor(){
  const dialog=$('rfExamDialog'),form=$('rfExamForm');if(!dialog||!form)return;
  $('rfExamClose')?.addEventListener('click',()=>dialog.hidden=true);
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.hidden=true;});
  $('rfExamExisting')?.addEventListener('click',e=>{
   const btn=e.target.closest('[data-exam-action]');if(!btn)return;
   const period=calendarPeriod(new Date());if(period.kind!=='exam')return;
   const items=getExams(period),index=items.findIndex(x=>x.id===btn.dataset.id);if(index<0)return;
   if(btn.dataset.examAction==='delete'){
    if(!confirm('حذف هذا الاختبار؟'))return;items.splice(index,1);save();renderExamEditor(period);refresh();return;
   }
   const exam=items[index];form.dataset.editId=exam.id;
   $('rfExamCode').value=exam.code;$('rfExamName').value=exam.name||'';
   $('rfExamDay').value=exam.day;$('rfExamTime').value=exam.start;
   $('rfExamEnd').value=exam.end||'';$('rfExamLocation').value=exam.location||'';
  });
  form.addEventListener('submit',e=>{
   e.preventDefault();const period=calendarPeriod(new Date());if(period.kind!=='exam')return;
   const day=$('rfExamDay').value;if(day<period.exam.start||day>period.exam.end){alert('اختر يومًا داخل فترة الاختبارات.');return;}
   const code=$('rfExamCode').value.trim(),start=$('rfExamTime').value,end=$('rfExamEnd').value;
   if(!code||!start)return;if(end&&end<=start){alert('وقت النهاية يجب أن يكون بعد البداية.');return;}
   state.exams ||= {};const key=examStoreKey(period);state.exams[key] ||= [];
   const id=form.dataset.editId||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
   const item={id,code,name:$('rfExamName').value.trim(),day,start,end,location:$('rfExamLocation').value.trim()};
   const index=state.exams[key].findIndex(x=>x.id===id);
   if(index>=0)state.exams[key][index]=item;else state.exams[key].push(item);
   save();form.reset();delete form.dataset.editId;renderExamEditor(period);refresh();
  });
 }
 function renderSchedule(){
  const now=new Date(), day=DAYS[now.getDay()], currentMinute=now.getHours()*60+now.getMinutes();
  const raw=getRawSchedule(),{result,missingDay}=allSessions();
  const today=result.filter(s=>s.day===day).sort((a,b)=>a.start-b.start);
  $('rfTodayCount').textContent=String(today.length);
  $('rfDate').textContent=new Intl.DateTimeFormat('ar-SA-u-ca-gregory',{weekday:'long',day:'numeric',month:'long'}).format(now);
  const hero=$('rfClassHero'),active=today.find(s=>s.start<=currentMinute&&currentMinute<s.end);
  const future=today.find(s=>s.start>currentMinute),soon=active&&active.end-currentMinute<=10;
  const chosen=soon&&future?future:(active||future);
  const upcoming=chosen||nextSession(now,result);
  let status='',hint='';
  if(!raw.length){status='أضف جدولك';hint='ابدأ من أداة صمم جدولك واحفظ المواد والأيام';}
  else if(!result.length){status='جدولك محفوظ';hint='لم تُحدد أيام الحصص بعد. افتح صمم جدولك وحدد الأيام لكل حصة.';}
  else if(!upcoming){status='خلصت محاضراتك';hint='لا توجد محاضرات مجدولة قادمة';}
  else if(chosen){status=(soon&&future)||!active?'المحاضرة القادمة':'المحاضرة الحالية';hint=soon&&future?`تنتهي محاضرتك الحالية خلال ${remaining(active.end-currentMinute)}`:active?`تنتهي خلال ${remaining(active.end-currentMinute)}`:`تبدأ بعد ${remaining(chosen.start-currentMinute)}`;}
  else {status='أقرب محاضرة قادمة';hint=`يوم ${NAMES[DAYS.indexOf(upcoming.day)]} • ${clock(upcoming.start)}`;}
  hero.innerHTML=upcoming?`<span class="rf-status">${status}</span><h3>${escapeHTML(upcoming.code)} <small>${escapeHTML(upcoming.type)}</small></h3>${upcoming.name?`<p>${escapeHTML(upcoming.name)}</p>`:''}<div class="rf-meta"><span>🕒 <b dir="ltr">${clock(upcoming.start)} – ${clock(upcoming.end)}</b></span><span>🚪 ${upcoming.room?'قاعة '+escapeHTML(upcoming.room):'القاعة غير محددة'}</span><span>📍 ${upcoming.building?escapeHTML(upcoming.building):'المبنى غير محدد'}</span></div><div class="rf-hero-hint">${hint}</div>`:`<span class="rf-status">${status}</span><h3>${raw.length?'جدولك يحتاج يوم المحاضرة':'حياك في رفيق! 🌟'}</h3><p>${hint}</p><button id="rfGoSchedule" type="button" class="rf-small-btn">فتح صمم جدولك</button>`;
  $('rfGoSchedule')?.addEventListener('click',()=>document.querySelector('.tool-menu-card[data-target="schedule"]')?.click());
  const root=$('rfTodayList');
  const notice=missingDay?`<div class="rf-empty rf-warning">⚠️ ${missingDay} حصة محفوظة بدون يوم محدد؛ حدد أيامها في «صمم جدولك» لتظهر هنا.</div>`:'';
  if(!today.length){
   const msg=!raw.length?'ستظهر محاضراتك هنا بعد إعداد جدولك':!day?'اليوم إجازة أسبوعية، وتظهر أقرب محاضرة في البطاقة أعلاه.':result.length?'لا توجد محاضرات مجدولة لهذا اليوم.':'حدد أيام الحصص في صمم جدولك.';
   root.innerHTML=`<div class="rf-empty">${msg}</div>${notice}`;return;
  }
  root.innerHTML=today.map(s=>`<article class="rf-session ${currentMinute>=s.start&&currentMinute<s.end?'is-current':''}" style="--rf-course-color:${s.colour}"><div class="rf-session-time" dir="ltr">${clock(s.start)}<span>${clock(s.end)}</span></div><div class="rf-session-data"><b>${escapeHTML(s.code)}</b><small>${escapeHTML(s.type)} ${s.room?' • قاعة '+escapeHTML(s.room):''}</small>${s.building?`<small>${escapeHTML(s.building)}</small>`:''}</div>${currentMinute>=s.start&&currentMinute<s.end?'<span class="rf-now-dot"></span>':''}</article>`).join('')+notice;
 }
 function renderEntries(){
  const root=$('rfEntryList');if(!root)return;
  root.innerHTML=state.entries.length?state.entries.map(x=>`<div class="rf-entry ${x.done?'rf-done':''}" data-id="${escapeHTML(x.id)}"><input class="rf-check" data-action="toggle" type="checkbox" aria-label="اكتمال" ${x.done?'checked':''}><div class="rf-entry-text"><b>${escapeHTML(x.text)}</b><small>${x.kind==='note'?'ملاحظة':'مهمة'}${x.date?' • '+escapeHTML(x.date):''}</small></div><button type="button" class="rf-icon-btn" data-action="edit" aria-label="تعديل">✎</button><button type="button" class="rf-icon-btn rf-delete" data-action="delete" aria-label="حذف">×</button></div>`).join(''):'<div class="rf-empty">لا توجد مهام أو ملاحظات بعد. أضف أول واحدة ✨</div>';
 }
 function edit(id=''){
  const item=state.entries.find(x=>x.id===id);
  $('rfEditor').dataset.editId=id;
  $('rfDialogTitle').textContent=item?'تعديل':'إضافة مهمة أو ملاحظة';
  $('rfEntryText').value=item?.text||'';
  $('rfEntryDate').value=item?.date||'';
  $('rfEntryKind').value=item?.kind||'task';
  $('rfDateRow').hidden=$('rfEntryKind').value!=='task';
  $('rfEditor').hidden=false;$('rfEntryText').focus();
 }
 function init(){
  if(mounted||!$('friend-tool'))return;mounted=true;hydrate();
  $('rfAddEntry')?.addEventListener('click',()=>edit());
  $('rfRefresh')?.addEventListener('click',openExamEditor);
  initExamEditor();
  $('rfEntryKind')?.addEventListener('change',e=>$('rfDateRow').hidden=e.target.value!=='task');
  $('rfCancelEditor')?.addEventListener('click',()=>$('rfEditor').hidden=true);
  $('rfEditor')?.addEventListener('click',e=>{if(e.target===$('rfEditor'))$('rfEditor').hidden=true;});
  $('rfEditorForm')?.addEventListener('submit',e=>{
   e.preventDefault();const value=$('rfEntryText').value.trim();if(!value)return;
   const id=$('rfEditor').dataset.editId,kind=$('rfEntryKind').value==='note'?'note':'task',date=kind==='task'?$('rfEntryDate').value:'';
   if(id){const item=state.entries.find(x=>x.id===id);if(item)Object.assign(item,{text:value,kind,date});}
   else state.entries.unshift({id:`${Date.now()}-${Math.random().toString(36).slice(2)}`,text:value,kind,date,done:false});
   save();renderEntries();$('rfEditor').hidden=true;
  });
  $('rfEntryList')?.addEventListener('click',e=>{
   const action=e.target.closest('[data-action]')?.dataset.action,id=e.target.closest('[data-id]')?.dataset.id;
   if(!action||!id)return;
   if(action==='edit')return edit(id);
   if(action==='delete'){if(!confirm('هل تريد حذف العنصر؟'))return;state.entries=state.entries.filter(x=>x.id!==id);}
   if(action==='toggle'){const item=state.entries.find(x=>x.id===id);if(item)item.done=e.target.checked;}
   save();renderEntries();
  });
  window.addEventListener('storage',e=>{if([SCHEDULE_KEY,OLD_SCHEDULE_KEY,KEY].includes(e.key)){if(e.key===KEY){hydrate();renderEntries();}refresh();}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
  // Refresh each time the existing tool card is opened.
  document.querySelector('.tool-menu-card[data-target="friend"]')?.addEventListener('click',()=>setTimeout(refresh,0));
  renderEntries();refresh();
  setInterval(()=>{if(!document.hidden&&$('friend-tool').classList.contains('active'))refresh();},30000);
 }
 function refresh(){if(!mounted)return;const period=showWeek(new Date());const edit=$('rfRefresh');if(edit){edit.textContent='✎ تعديل';edit.hidden=period.kind!=='exam';edit.disabled=period.kind!=='exam';}
  const label=$('rfTodayLabel');if(label)label.textContent=period.kind==='exam'?'اختبارات اليوم':'محاضرات اليوم';
  const title=$('rfListTitle');if(title)title.textContent=period.kind==='exam'?'جدول الاختبارات':'محاضرات اليوم';
  if(period.kind==='exam')showExamMode(period);else if(period.kind==='holiday'){const holiday=period.holiday;$('rfTodayCount').textContent='0';$('rfClassHero').innerHTML=`<span class="rf-status">إجازة</span><h3>${escapeHTML(holiday.name)}</h3><p>تستمر حتى ${dateShort(holiday.end)} • استمتع بإجازتك 🌿</p>`;$('rfTodayList').innerHTML='<div class="rf-empty">لا توجد محاضرات خلال الإجازة.</div>';}else renderSchedule();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
