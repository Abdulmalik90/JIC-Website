/** Madkhal Publisher — Apps Script backend. Deploy as web app: execute as ME.
 * Set Script Properties: SHEET_ID, GOOGLE_CLIENT_ID.
 * Sheet 'Publishers': email | role | active (admin/publisher, TRUE).
 * Sheet news headers must match existing Google Forms headers.
 */
const NEWS_HEADERS = ['طابع زمني','اسم النادي','عنوان الخبر','تفاصيل الخبر','رابط صورة الغلاف','رابط الفعالية (اختياري)','الفئة المستهدفة'];
const CLUBS = ['نادي الحاسب','نادي الاستدامة','نادي الهندسة الكهربائية','المجلس الطلابي','نادي The Bridge','النادي الرياضي للطالبات','نادي الهندسة المدنية','نادي الهندسة الميكانيكية','نادي الهندسة الكيميائية','نادي همه التطوعي','النادي الثقافي الاجتماعي للطالبات','نادي ادارة الاعمال للطالبات'];
function doGet(e) {
  if (e && e.parameter && e.parameter.api === 'news') return getNewsJson_();
  return HtmlService.createHtmlOutputFromFile('Index').setTitle('مدخل | بوابة النشر').addMetaTag('viewport','width=device-width,initial-scale=1');
}
function getNewsJson_() {
  const sh = newsSheet_(), rows=sh.getDataRange().getDisplayValues(), headers=rows.shift()||[];
  const data=rows.map(row=>Object.fromEntries(headers.map((h,i)=>[h,row[i]||'']))).filter(x=>x['عنوان الخبر']).reverse();
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function newsSheet_() {
  const ss=SpreadsheetApp.openById(property_('SHEET_ID'));
  const name=PropertiesService.getScriptProperties().getProperty('NEWS_SHEET_NAME');
  const sh=name?ss.getSheetByName(name):ss.getSheets()[0];
  if(!sh) throw new Error('ورقة الأخبار غير موجودة');
  return sh;
}
function property_(key){const value=PropertiesService.getScriptProperties().getProperty(key);if(!value)throw new Error('إعداد ناقص: '+key);return value;}
function verify_(idToken){
  if(typeof idToken!=='string'||idToken.length<100||idToken.length>10000)throw new Error('يجب تسجيل الدخول أولًا');
  const url='https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(idToken);
  const response=UrlFetchApp.fetch(url,{muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw new Error('تعذر التحقق من حساب Google');
  const user=JSON.parse(response.getContentText());
  if(user.aud!==property_('GOOGLE_CLIENT_ID')||String(user.email_verified)!=='true'||!user.email)throw new Error('هوية Google غير موثوقة');
  const email=user.email.toLowerCase().trim();
  const sh=SpreadsheetApp.openById(property_('SHEET_ID')).getSheetByName('Publishers');
  if(!sh)throw new Error('أنشئ ورقة Publishers أولًا');
  const rows=sh.getDataRange().getDisplayValues();
  const headers=rows.shift().map(s=>s.toLowerCase().trim());
  const e=headers.indexOf('email'),c=headers.indexOf('role'),a=headers.indexOf('active');
  if([e,c,a].some(x=>x<0))throw new Error('أعمدة Publishers يجب أن تكون email, role, active');
  const row=rows.find(r=>r[e].toLowerCase().trim()===email&&['true','yes','1','نعم'].includes(r[a].toLowerCase().trim()));
  if(!row)throw new Error('هذا الحساب غير مصرح له بالنشر');
  const role=(row[c]||'').toLowerCase().trim();
  if(!['admin','publisher'].includes(role))throw new Error('دور الحساب غير معتمد');
  return {email,role,clubs:CLUBS.slice()};
}
function getPublisherProfile(idToken){return verify_(idToken);}
function publishArticle(idToken, article){
  const user=verify_(idToken); // verify again on EVERY write
  if(!article||typeof article!=='object')throw new Error('بيانات الخبر غير صحيحة');
  const clean=k=>typeof article[k]==='string'?article[k].trim():'';
  const club=clean('club'),title=clean('title'),body=clean('body'),image=clean('imageUrl'),event=clean('eventUrl'),target=clean('target');
  if(!user.clubs.includes(club))throw new Error('ليس لديك صلاحية النشر باسم هذا النادي');
  if(title.length<5||title.length>180||body.length<10||body.length>15000)throw new Error('راجع طول العنوان أو تفاصيل الخبر');
  if(!/^https:\/\/i\.postimg\.cc\/[a-zA-Z0-9/_%.\-]+\.(png|jpe?g|webp|gif)(\?[^\s]*)?$/i.test(image))throw new Error('رابط الغلاف يجب أن يكون صورة مباشرة من Postimages');
  if(event&&!/^https:\/\//i.test(event))throw new Error('رابط الفعالية يجب أن يبدأ بـ https://');
  if(!['الجميع','طلاب','طالبات'].includes(target))throw new Error('الفئة المستهدفة غير صحيحة');
  const sh=newsSheet_();
  const lock=LockService.getScriptLock();lock.waitLock(20000);
  try {
    const headers=sh.getRange(1,1,1,sh.getLastColumn()).getDisplayValues()[0];
    for(const h of NEWS_HEADERS)if(!headers.includes(h))throw new Error('عمود مفقود في شيت الأخبار: '+h);
    const values={'طابع زمني':Utilities.formatDate(new Date(),Session.getScriptTimeZone(),'dd/MM/yyyy HH:mm:ss'),'اسم النادي':club,'عنوان الخبر':title,'تفاصيل الخبر':body,'رابط صورة الغلاف':image,'رابط الفعالية (اختياري)':event,'الفئة المستهدفة':target};
    const row=headers.map(h=>values[h]!==undefined?safeCell_(values[h]):'');
    sh.appendRow(row);
    return {ok:true,message:'تم نشر الخبر بنجاح',publisher:user.email};
  } finally {lock.releaseLock();}
}
function safeCell_(s){return /^[=+\-@]/.test(s)?"'"+s:s;}
