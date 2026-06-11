/* ============================================================
   MADKHAL — regulations.js
   ============================================================ */

/* ── THEME ── */
const html=document.documentElement;
const themeToggle=document.getElementById('themeToggle');
const themeToggleMb=document.getElementById('themeToggleMobile');
const themeIcon=document.getElementById('themeIcon');
const themeIconMb=document.getElementById('themeIconMobile');
const themeLabel=document.getElementById('themeLabel');
const ICONS={dark:'☀️',light:'🌙'};
const LABELS={dark:'التبديل للوضع النهاري',light:'التبديل للوضع الليلي'};
let currentTheme=localStorage.getItem('madkhal-theme')||'dark';
applyTheme(currentTheme,false);
function applyTheme(theme,animate=true){
  currentTheme=theme;html.setAttribute('data-theme',theme);localStorage.setItem('madkhal-theme',theme);
  const icon=ICONS[theme];
  if(animate){
    [themeIcon,themeIconMb].forEach(el=>{el.style.transform='rotate(360deg) scale(0)';el.style.opacity='0';});
    setTimeout(()=>{[themeIcon,themeIconMb].forEach(el=>{el.textContent=icon;el.style.cssText='transform:rotate(0)scale(1);opacity:1;transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .3s ease';});},200);
  } else {themeIcon.textContent=icon;themeIconMb.textContent=icon;}
  if(themeLabel)themeLabel.textContent=LABELS[theme];
}
const toggleTheme=()=>applyTheme(currentTheme==='dark'?'light':'dark');
themeToggle?.addEventListener('click',toggleTheme);
themeToggleMb?.addEventListener('click',toggleTheme);
document.addEventListener('keydown',e=>{if(e.shiftKey&&e.key==='D')toggleTheme();});

/* ── HEADER SCROLL ── */
const headerEl=document.getElementById('header');
window.addEventListener('scroll',()=>headerEl?.classList.toggle('is-scrolled',window.scrollY>40),{passive:true});

/* ── BURGER ── */
const burger=document.getElementById('burger');
const mobileNav=document.getElementById('mobileNav');
burger?.addEventListener('click',()=>{
  const open=burger.classList.toggle('is-open');
  mobileNav?.classList.toggle('is-open',open);
  burger.setAttribute('aria-expanded',open);
});
mobileNav?.querySelectorAll('.mobile-nav__link').forEach(l=>l.addEventListener('click',()=>{
  burger?.classList.remove('is-open');mobileNav.classList.remove('is-open');
}));

/* ── REVEAL ── */
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObs.unobserve(e.target);}});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

/* ── SMOOTH ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-84,behavior:'smooth'});}
  });
});

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const item=btn.closest('.faq-item');
    const isOpen=item.classList.contains('is-open');
    // close all
    document.querySelectorAll('.faq-item.is-open').forEach(i=>i.classList.remove('is-open'));
    if(!isOpen) item.classList.add('is-open');
    btn.setAttribute('aria-expanded',item.classList.contains('is-open'));
  });
});

/* ── FAQ SEARCH ── */
document.getElementById('faqSearch')?.addEventListener('input',function(){
  const q=this.value.trim().toLowerCase();
  document.querySelectorAll('.faq-item').forEach(item=>{
    const text=item.textContent.toLowerCase();
    item.classList.toggle('is-hidden',q.length>0&&!text.includes(q));
  });
});

/* ── BACK TO TOP ── */
const btt=document.getElementById('backToTop');
window.addEventListener('scroll',()=>btt?.classList.toggle('is-visible',window.scrollY>400),{passive:true});
btt?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
