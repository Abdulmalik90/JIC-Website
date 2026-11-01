/* ==========================================================================
   Sahib Campus Map — campus-map.js   (vanilla JS, no dependencies)

   • Loads campus-map.svg (real building outlines traced from the PDF, one <g> per building)
   • Pan (drag) · zoom (wheel / pinch / buttons / double-tap) · touch friendly
   • Clicking a building outline highlights it and shows a floating card anchored above it
   • Search by Arabic name, aliases, tags and timetable aliases (Wing 1 … → الأجنحة)
   • No tiles, no GPS, no geolocation, no network except fetching campus-map.svg

   Public API (window.SahibCampusMap)
     openBuilding(aliasOrId)  → true | false   select + focus (accepts schedule aliases)
     findBuilding(aliasOrId)  → [entries]      resolve only, no UI
     search(query)            filter the list/map
     clearSelection() · resetView() · zoomIn() · zoomOut()
     getSelected()            → [ids]
     ready                    → Promise resolved when the SVG is on screen
   Event on #sahibCampusMap:  'sahib-campus-map:select'  detail = { ids, name, type }
   ========================================================================== */
(() => {
  'use strict';

  const SCRIPT_SRC = document.currentScript && document.currentScript.src;
  const root = document.getElementById('sahibCampusMap');
  if (!root || root.dataset.loaded) return;
  root.dataset.loaded = 'true';

  const DATA = window.SahibCampusData || { college: [], labels: [], filters: [] };
  const items = DATA.college;
  const byId = new Map(items.map((x) => [x.id, x]));

  /* ----------------------------------------------------------------- helpers */
  const typeMeta = {
    academic:   'مبنى تعليمي',
    admin:      'إدارة وخدمات',
    service:    'خدمات أكاديمية',
    restaurant: 'خدمة طلابية',
    commercial: 'خدمة طلابية',
    health:     'خدمة صحية',
    sports:     'مرفق رياضي',
    religious:  'مسجد',
    'dorm-old': 'سكن طلابي',
    'dorm-new': 'سكن طلابي',
    gate:       'بوابة'
  };
  const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
  const norm = (v) => String(v == null ? '' : v).toLowerCase()
    .replace(/[٠-٩]/g, (d) => AR_DIGITS.indexOf(d))
    .replace(/[ً-ٰٟـ]/g, '')       // tashkeel + tatweel
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .replace(/[‐-―_\-]+/g, ' ').replace(/\s+/g, ' ').trim();
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const $ = (s) => root.querySelector(s);
  const SVGNS = 'http://www.w3.org/2000/svg';

  // search index
  const index = items.map((it) => ({
    it,
    keys: new Set([it.id, it.name, ...(it.aliases || []), ...(it.scheduleAliases || [])].map(norm)),
    hay: norm([it.name, it.sub, ...(it.aliases || []), ...(it.scheduleAliases || []), ...(it.tags || [])].join(' | '))
  }));
  const groupKey = (it) => it.name;                                   // same public name ⇒ one group
  function groupsOf(entries) {
    const m = new Map();
    entries.forEach((it) => { const k = groupKey(it); if (!m.has(k)) m.set(k, []); m.get(k).push(it); });
    return [...m.values()];
  }
  function resolve(alias) {
    const q = norm(alias);
    if (!q) return [];
    let hit = index.filter((e) => e.keys.has(q)).map((e) => e.it);
    if (hit.length) {
      // exact key shared by several names (e.g. "مسجد") → keep only the first group
      return groupsOf(hit)[0];
    }
    if (/^wing\s*\d/.test(q)) hit = items.filter((x) => x.id === 'wings');        // any "Wing N …" from the timetable
    if (hit.length) return hit;
    const toks = q.split(' ');
    hit = index.filter((e) => toks.every((t) => e.hay.includes(t))).map((e) => e.it);
    const g = groupsOf(hit);
    return g.length === 1 ? g[0] : [];
  }

  /* ----------------------------------------------------------------- state */
  const state = { campus: 'college', query: '', filter: 'all', selected: [], listActive: '' };
  let MAP = { x: 0, y: 0, w: 826, h: 758 };
  let svg = null, frame, wrap, popover, listBody, countEl, searchInput, labelLayer;
  let view = { cx: 413, cy: 379, z: 1 };           // center (map units) + zoom ratio (1 = fit)
  let cw = 1, ch = 1, k0 = 1;                       // frame size (px) and fit scale (px / map unit)
  const Z_MIN = 1, Z_MAX = 10;
  let rafPop = 0, flight = 0, ready = false;
  const pending = [];
  let resolveReady;
  const readyPromise = new Promise((r) => { resolveReady = r; });

  const ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    plus:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    minus:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>',
    home:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'
  };

  /* ----------------------------------------------------------------- UI shell */
  root.innerHTML = `
    <div class="cm-shell">
      <div class="cm-heading">
        <div>
          <div class="cm-title">خريطة صاحب <small>BETA</small></div>
          <div class="cm-sub">اضغط على أي مبنى لعرض معلوماته، أو ابحث بالاسم.</div>
        </div>
      </div>

      <div class="cm-switch" role="tablist" aria-label="اختيار الموقع">
        <button type="button" role="tab" class="is-active" data-campus="college" aria-selected="true">الكلية الصناعية</button>
        <button type="button" role="tab" data-campus="institute" aria-selected="false">المعهد <span class="cm-soon">قريبًا</span></button>
      </div>

      <section class="cm-college">
        <div class="cm-tools">
          <label class="cm-search">
            ${ICON.search}
            <input id="cmSearch" type="search" placeholder="ابحث عن مبنى أو مرفق…  (مثال: Wing 3، المكتبة)" autocomplete="off" enterkeyhint="search" aria-label="ابحث في مباني الكلية">
            <button type="button" class="cm-clear" id="cmClear" aria-label="مسح البحث" hidden>×</button>
          </label>
          <div class="cm-chips" role="group" aria-label="تصنيف المباني"></div>
        </div>

        <div class="cm-layout">
          <div class="cm-map-frame" id="cmFrame">
            <div class="cm-map-wrap" id="cmMapWrap"><div class="cm-loading">جارٍ تحميل الخريطة…</div></div>
            <div class="cm-controls">
              <button type="button" data-zoom="in"    aria-label="تكبير">${ICON.plus}</button>
              <button type="button" data-zoom="out"   aria-label="تصغير">${ICON.minus}</button>
              <button type="button" data-zoom="reset" aria-label="إعادة ضبط الخريطة">${ICON.home}</button>
            </div>
            <div class="cm-hint">اسحب للتحريك · اقرص للتكبير · اضغط على المبنى</div>
            <div class="cm-popover" id="cmPopover" hidden role="status" aria-live="polite"></div>
          </div>

          <div class="cm-panel">
            <div class="cm-panel-head"><h4>المباني والمرافق</h4><span class="cm-count" id="cmCount"></span></div>
            <div class="cm-list" id="cmList"></div>
          </div>
        </div>
      </section>

      <section class="cm-institute" hidden>
        <h3>خريطة المعهد</h3>
        <p>قريبًا ستُضاف خريطة تفاعلية مستقلة للمعهد بنفس أسلوب خريطة الكلية.</p>
      </section>
    </div>`;

  frame = $('#cmFrame'); wrap = $('#cmMapWrap'); popover = $('#cmPopover');
  listBody = $('#cmList'); countEl = $('#cmCount'); searchInput = $('#cmSearch');
  const clearBtn = $('#cmClear');
  const chipsBox = $('.cm-chips');

  (DATA.filters || []).forEach((f, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.filter = f.id; b.textContent = f.label;
    if (i === 0) b.classList.add('is-active');
    chipsBox.appendChild(b);
  });

  /* ----------------------------------------------------------------- theme */
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const forcedTheme = ['light', 'dark'].includes(root.getAttribute('data-theme')) ? root.getAttribute('data-theme') : '';
  function hostTheme() {
    const els = [document.documentElement, document.body];
    for (const el of els) {
      if (!el) continue;
      const attr = el.getAttribute('data-theme') || el.getAttribute('data-bs-theme') || el.getAttribute('data-color-scheme');
      if (attr === 'dark' || attr === 'light') return attr;
      const c = el.classList;
      if (c.contains('dark') || c.contains('dark-mode') || c.contains('dark-theme') || c.contains('theme-dark')) return 'dark';
      if (c.contains('light') || c.contains('light-mode') || c.contains('light-theme') || c.contains('theme-light')) return 'light';
    }
    return mq && mq.matches ? 'dark' : 'light';
  }
  function applyTheme() { root.setAttribute('data-theme', forcedTheme || hostTheme()); }
  applyTheme();
  if (!forcedTheme) {
    const mo = new MutationObserver(applyTheme);
    [document.documentElement, document.body].forEach((el) => el && mo.observe(el, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-bs-theme', 'data-color-scheme'] }));
    if (mq && mq.addEventListener) mq.addEventListener('change', applyTheme);
  }

  /* ----------------------------------------------------------------- SVG loading */
  function svgSource() {
    if (typeof window.SahibCampusSVG === 'string' && window.SahibCampusSVG.includes('<svg')) return Promise.resolve(window.SahibCampusSVG);
    const url = root.dataset.svg || (SCRIPT_SRC ? new URL('campus-map.svg', SCRIPT_SRC).href : 'campus-map.svg');
    return fetch(url).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); });
  }

  function mount(text) {
    wrap.innerHTML = text;
    svg = wrap.querySelector('svg');
    if (!svg) throw new Error('no <svg>');
    const vb = (svg.getAttribute('viewBox') || '0 0 826 758').split(/\s+/).map(Number);
    MAP = { x: vb[0], y: vb[1], w: vb[2], h: vb[3] };
    view = { cx: MAP.x + MAP.w / 2, cy: MAP.y + MAP.h / 2, z: 1 };
    labelLayer = svg.querySelector('#cm-labels');
    svg.querySelectorAll('.cm-building').forEach((g) => {
      const it = byId.get(g.dataset.id);
      if (it) g.setAttribute('aria-label', it.name + ' — ' + (typeMeta[it.type] || ''));
      else console.warn('[SahibCampusMap] SVG building without data entry:', g.dataset.id);
    });
    items.forEach((it) => { if (!svg.querySelector('[data-id="' + it.id + '"]')) console.warn('[SahibCampusMap] data entry without SVG shape:', it.id); });
    buildLabels();
    bindMap();
    measure(true);
    refresh();
  }

  /* ----------------------------------------------------------------- labels */
  let labelEls = [];
  function buildLabels() {
    labelEls = [];
    (DATA.labels || []).forEach((L) => {
      const t = document.createElementNS(SVGNS, 'text');
      t.setAttribute('class', 'cm-label');
      t.setAttribute('x', L.x); t.setAttribute('y', L.y);
      t.setAttribute('text-anchor', L.anchor || 'middle');
      const lines = String(L.text).split('\n');
      lines.forEach((ln, i) => {
        const s = document.createElementNS(SVGNS, 'tspan');
        s.setAttribute('x', L.x);
        s.setAttribute('dy', i === 0 ? (-(lines.length - 1) * 0.55 + 0.35) + 'em' : '1.1em');
        s.textContent = ln;
        t.appendChild(s);
      });
      labelLayer.appendChild(t);
      labelEls.push({ el: t, L });
    });
  }
  function updateLabels() {
    if (!labelEls.length) return;
    const k = k0 * view.z;
    labelEls.forEach(({ el, L }) => {
      const minZ = L.pri === 3 ? 2.6 : L.pri === 2 ? 1.5 : 0;
      const show = view.z >= minZ && k >= (L.minK || 0);
      el.classList.toggle('is-off', !show);
      if (!show) return;
      const fs = L.size * clamp(9.5 / (L.size * k), 1, 1.7);     // never smaller than ~9.5 px on screen
      el.setAttribute('font-size', fs.toFixed(2));
      el.setAttribute('stroke-width', (fs * 0.3).toFixed(2));
      if (L.rot) el.setAttribute('transform', `rotate(${L.rot} ${L.x} ${L.y})`);
    });
  }

  /* ----------------------------------------------------------------- view / camera */
  function measure(first) {
    const r = frame.getBoundingClientRect();
    cw = Math.max(1, r.width); ch = Math.max(1, r.height);
    k0 = Math.min(cw / MAP.w, ch / MAP.h);
    applyView();
    if (first) updateLabels();
  }
  function clampView() {
    view.z = clamp(view.z, Z_MIN, Z_MAX);
    const k = k0 * view.z, vw = cw / k, vh = ch / k;
    view.cx = vw >= MAP.w ? MAP.x + MAP.w / 2 : clamp(view.cx, MAP.x + vw / 2, MAP.x + MAP.w - vw / 2);
    view.cy = vh >= MAP.h ? MAP.y + MAP.h / 2 : clamp(view.cy, MAP.y + vh / 2, MAP.y + MAP.h - vh / 2);
  }
  function applyView() {
    if (!svg) return;
    clampView();
    const k = k0 * view.z, vw = cw / k, vh = ch / k;
    svg.setAttribute('viewBox', `${(view.cx - vw / 2).toFixed(2)} ${(view.cy - vh / 2).toFixed(2)} ${vw.toFixed(2)} ${vh.toFixed(2)}`);
    svg.style.setProperty('--cm-sw', (2.4 / k).toFixed(3) + 'px');
    svg.style.setProperty('--cm-hit', Math.min(10 / k, 5).toFixed(2) + 'px');
    updateLabels();
    schedulePopover();
  }
  const toWorld = (px, py) => {            // px,py relative to frame
    const k = k0 * view.z;
    return { x: view.cx + (px - cw / 2) / k, y: view.cy + (py - ch / 2) / k };
  };
  function zoomAt(factor, px, py) {
    const a = toWorld(px, py);
    view.z = clamp(view.z * factor, Z_MIN, Z_MAX);
    const k = k0 * view.z;
    view.cx = a.x - (px - cw / 2) / k;
    view.cy = a.y - (py - ch / 2) / k;
    applyView();
  }
  function flyTo(target, ms = 420) {
    cancelAnimationFrame(flight);
    const from = { ...view };
    const to = { cx: target.cx, cy: target.cy, z: clamp(target.z, Z_MIN, Z_MAX) };
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || ms <= 0) { view = to; applyView(); return; }
    const t0 = performance.now();
    const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / ms), e = ease(t);
      // interpolate zoom in log space so the motion feels even
      view.z = Math.exp(Math.log(from.z) + (Math.log(to.z) - Math.log(from.z)) * e);
      view.cx = from.cx + (to.cx - from.cx) * e;
      view.cy = from.cy + (to.cy - from.cy) * e;
      applyView();
      if (t < 1) flight = requestAnimationFrame(step);
    };
    flight = requestAnimationFrame(step);
  }
  function groupBox(ids) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    ids.forEach((id) => {
      const g = svg.querySelector('[data-id="' + id + '"]');
      if (!g) return;
      const b = g.getBBox();
      x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
    });
    return x0 === Infinity ? null : { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  function focusIds(ids) {
    const b = groupBox(ids);
    if (!b) return;
    const size = Math.max(b.w, b.h, 12);
    const wanted = (Math.min(cw, ch) * 0.46) / size;            // building ≈ 46 % of the short side
    const z = clamp(wanted / k0, 2.2, 6.5);
    const k = k0 * z;
    // shift the camera so the building sits a bit below the middle → the card has room above it
    flyTo({ cx: b.x + b.w / 2, cy: b.y + b.h / 2 - (ch * 0.13) / k, z });
  }

  /* ----------------------------------------------------------------- pointer handling */
  function bindMap() {
    const pts = new Map();
    let drag = null, pinch = null, moved = false;
    const rel = (e) => { const r = frame.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };

    svg.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      cancelAnimationFrame(flight);
      frame.classList.add('is-touched');
      pts.set(e.pointerId, rel(e));
      if (pts.size === 1) {
        moved = false;
        drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, cx: view.cx, cy: view.cy, on: false };
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: view.z, anchor: toWorld(mid.x, mid.y) };
        drag = null; moved = true;
      }
    });
    svg.addEventListener('pointermove', (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, rel(e));
      if (pinch && pts.size >= 2) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        view.z = clamp(pinch.z * (d / pinch.d), Z_MIN, Z_MAX);
        const k = k0 * view.z;
        view.cx = pinch.anchor.x - (mid.x - cw / 2) / k;
        view.cy = pinch.anchor.y - (mid.y - ch / 2) / k;
        applyView();
        return;
      }
      if (!drag || drag.id !== e.pointerId) return;
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.on) {
        if (Math.hypot(dx, dy) < (e.pointerType === 'mouse' ? 4 : 8)) return;
        drag.on = true; moved = true;
        try { svg.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
        svg.classList.add('is-dragging');
      }
      const k = k0 * view.z;
      view.cx = drag.cx - dx / k;
      view.cy = drag.cy - dy / k;
      applyView();
    });
    const end = (e) => {
      pts.delete(e.pointerId);
      if (drag && drag.id === e.pointerId) { drag = null; svg.classList.remove('is-dragging'); }
      if (pts.size < 2) pinch = null;
      if (pts.size === 1 && moved) {                    // finger lifted from a pinch → continue as a drag
        const [[id, p]] = [...pts.entries()];
        const r = frame.getBoundingClientRect();
        drag = { id, sx: p.x + r.left, sy: p.y + r.top, cx: view.cx, cy: view.cy, on: true };
      }
    };
    svg.addEventListener('pointerup', end);
    svg.addEventListener('pointercancel', end);
    svg.addEventListener('lostpointercapture', end);

    // selection comes from the native click so keyboard + assistive tech work as well
    svg.addEventListener('click', (e) => {
      if (moved) { moved = false; e.stopPropagation(); return; }
      const g = e.target.closest && e.target.closest('.cm-building');
      if (g) selectIds([g.dataset.id], { focus: false, from: 'map' });
      else if (state.selected.length) clearSelection();
    }, true);
    svg.addEventListener('keydown', (e) => {
      const g = e.target.closest && e.target.closest('.cm-building');
      if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectIds([g.dataset.id], { focus: true, from: 'map' }); }
    });
    svg.addEventListener('dblclick', (e) => {
      e.preventDefault();
      const p = rel(e);
      zoomAt(1.9, p.x, p.y);
    });
    frame.addEventListener('wheel', (e) => {
      if (popover.contains(e.target)) return;
      e.preventDefault();
      cancelAnimationFrame(flight);
      const p = rel(e);
      const speed = e.ctrlKey ? 0.012 : 0.0016;
      zoomAt(Math.exp(-e.deltaY * speed), p.x, p.y);
    }, { passive: false });
  }

  root.querySelectorAll('[data-zoom]').forEach((btn) => btn.addEventListener('click', () => {
    const m = btn.dataset.zoom;
    if (!svg) return;
    if (m === 'reset') resetView(); else { cancelAnimationFrame(flight); zoomAt(m === 'in' ? 1.5 : 1 / 1.5, cw / 2, ch / 2); }
  }));

  if (window.ResizeObserver) new ResizeObserver(() => { if (svg) measure(false); }).observe(frame);
  else window.addEventListener('resize', () => svg && measure(false));

  /* ----------------------------------------------------------------- selection + popup */
  function selectIds(ids, opts = {}) {
    if (!svg || !ids.length) return;
    state.selected = ids.slice();
    state.listActive = groupKey(byId.get(ids[0]) || {});
    if (opts.focus) focusIds(ids);
    refresh();
    const it = byId.get(ids[0]);
    if (it) root.dispatchEvent(new CustomEvent('sahib-campus-map:select', { bubbles: true, detail: { ids: ids.slice(), name: it.name, type: it.type } }));
  }
  function clearSelection() {
    state.selected = []; state.listActive = '';
    refresh();
  }
  function resetView() {
    state.selected = []; state.listActive = '';
    flyTo({ cx: MAP.x + MAP.w / 2, cy: MAP.y + MAP.h / 2, z: 1 }, 380);
    refresh();
  }

  function renderPopover() {
    const it = byId.get(state.selected[0]);
    if (!it || !svg) { popover.hidden = true; return; }
    const g = svg.querySelector('[data-id="' + it.id + '"]');
    const color = g ? g.style.getPropertyValue('--c') : '';
    const n = state.selected.length;
    const tags = (it.tags || []).slice(0, 3).map((t) => `<span>${esc(t)}</span>`).join('') + (n > 1 ? `<span>${n} مبانٍ</span>` : '');
    popover.style.setProperty('--c', color || 'var(--cm-accent)');
    popover.innerHTML = `
      <button type="button" class="cm-pop-close" aria-label="إغلاق">×</button>
      <div class="cm-pop-type"><i class="cm-pop-dot"></i>${esc(typeMeta[it.type] || 'مرفق')}</div>
      <h3>${esc(it.name)}</h3>
      <p>${esc(it.description || it.sub || '')}</p>
      ${tags ? `<div class="cm-pop-tags">${tags}</div>` : ''}`;
    popover.hidden = false;
    popover.querySelector('.cm-pop-close').addEventListener('click', (e) => { e.stopPropagation(); clearSelection(); });
    positionPopover();
  }
  function schedulePopover() {
    if (rafPop || popover.hidden) return;
    rafPop = requestAnimationFrame(() => { rafPop = 0; positionPopover(); });
  }
  function positionPopover() {
    if (popover.hidden || !svg || !state.selected.length) return;
    const fr = frame.getBoundingClientRect();
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    state.selected.forEach((id) => {
      const g = svg.querySelector('[data-id="' + id + '"]');
      if (!g) return;
      const r = g.getBoundingClientRect();
      if (!r.width && !r.height) return;
      x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
    });
    if (x0 === Infinity) return;
    const pw = popover.offsetWidth, ph = popover.offsetHeight, gap = 12, pad = 8;
    const ax = (x0 + x1) / 2 - fr.left, top = y0 - fr.top, bottom = y1 - fr.top;
    let side = 'above', y = top - ph - gap;
    if (y < pad) { side = 'below'; y = bottom + gap; }
    if (side === 'below' && y + ph > ch - pad) { side = 'above'; y = Math.max(pad, top - ph - gap); }
    const left = clamp(ax - pw / 2, pad, Math.max(pad, cw - pw - pad));
    popover.dataset.side = side;
    popover.style.setProperty('--arrow-x', clamp(ax - left, 22, pw - 22) + 'px');
    popover.style.transform = `translate(${left.toFixed(1)}px, ${y.toFixed(1)}px)`;
  }

  /* ----------------------------------------------------------------- search / filter / list */
  function activeTypes() {
    const f = (DATA.filters || []).find((x) => x.id === state.filter);
    return f && f.types ? new Set(f.types) : null;
  }
  function matching() {
    const types = activeTypes();
    const toks = norm(state.query).split(' ').filter(Boolean);
    return index.filter((e) => (!types || types.has(e.it.type)) && toks.every((t) => e.hay.includes(t))).map((e) => e.it);
  }
  function refresh() {
    const matched = matching();
    const ids = new Set(matched.map((x) => x.id));
    const filtering = !!state.query.trim() || state.filter !== 'all';

    if (svg) {
      svg.classList.toggle('has-selection', state.selected.length > 0);
      svg.classList.toggle('has-query', filtering);
      svg.querySelectorAll('.cm-building').forEach((g) => {
        const id = g.dataset.id;
        g.classList.toggle('is-selected', state.selected.includes(id));
        g.classList.toggle('is-hit', filtering && ids.has(id));
        g.classList.toggle('is-miss', filtering && !ids.has(id));
      });
      labelEls.forEach(({ el, L }) => {
        const related = L.ids.some((id) => state.selected.includes(id));
        const hit = L.ids.some((id) => ids.has(id));
        el.classList.toggle('is-dim', (state.selected.length > 0 && !related) || (filtering && !hit));
      });
    }

    // list (one row per public name; the 13 new dorms collapse into one row)
    const groups = groupsOf(matched);
    countEl.textContent = groups.length + ' ' + (groups.length === 1 ? 'نتيجة' : 'نتائج');
    listBody.innerHTML = '';
    if (!groups.length) listBody.innerHTML = '<div class="cm-empty">لا توجد نتائج مطابقة لبحثك.</div>';
    groups.forEach((g) => {
      const it = g[0];
      const node = svg && svg.querySelector('[data-id="' + it.id + '"]');
      const color = (node && node.style.getPropertyValue('--c')) || 'var(--cm-accent)';
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cm-item' + (state.listActive === groupKey(it) ? ' is-active' : '');
      b.style.setProperty('--c', color);
      b.innerHTML = `<span class="cm-item-dot"><i></i></span><span class="cm-item-text"><strong>${esc(it.name)}</strong><small>${esc(g.length > 1 ? typeMeta[it.type] : (it.sub || typeMeta[it.type] || ''))}</small></span>${g.length > 1 ? `<span class="cm-item-n">${g.length}</span>` : ''}`;
      b.addEventListener('click', () => {
        selectIds(g.map((x) => x.id), { focus: true, from: 'list' });
        if (frame.scrollIntoView && window.innerWidth < 860) frame.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
      listBody.appendChild(b);
    });

    clearBtn.hidden = !state.query;
    renderPopover();
  }

  searchInput.addEventListener('input', () => { state.query = searchInput.value; refresh(); });
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const g = groupsOf(matching())[0];
      if (g) { selectIds(g.map((x) => x.id), { focus: true, from: 'search' }); searchInput.blur(); }
    } else if (e.key === 'Escape') { searchInput.value = ''; state.query = ''; refresh(); }
  });
  clearBtn.addEventListener('click', () => { searchInput.value = ''; state.query = ''; refresh(); searchInput.focus(); });
  chipsBox.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-filter]');
    if (!b) return;
    state.filter = b.dataset.filter;
    chipsBox.querySelectorAll('button').forEach((x) => x.classList.toggle('is-active', x === b));
    refresh();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.selected.length && root.contains(document.activeElement || root)) clearSelection();
  });

  root.querySelectorAll('[data-campus]').forEach((btn) => btn.addEventListener('click', () => {
    state.campus = btn.dataset.campus;
    root.querySelectorAll('[data-campus]').forEach((b) => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
    $('.cm-college').hidden = state.campus !== 'college';
    $('.cm-institute').hidden = state.campus === 'college';
    if (state.campus === 'college' && svg) requestAnimationFrame(() => measure(false));
  }));

  /* ----------------------------------------------------------------- public API */
  function openNow(entries) {
    const tab = root.querySelector('[data-campus="college"]');
    if (state.campus !== 'college') tab.click();
    state.query = ''; state.filter = 'all'; searchInput.value = '';
    chipsBox.querySelectorAll('button').forEach((x) => x.classList.toggle('is-active', x.dataset.filter === 'all'));
    measure(false);
    selectIds(entries.map((x) => x.id), { focus: true, from: 'api' });
  }
  window.SahibCampusMap = {
    version: DATA.version || 3,
    ready: readyPromise,
    findBuilding(alias) { return resolve(alias).slice(); },
    openBuilding(alias) {
      const entries = resolve(alias);
      if (!entries.length) return false;
      if (!ready) pending.push(entries); else openNow(entries);
      return true;
    },
    search(q) { state.query = String(q || ''); searchInput.value = state.query; refresh(); },
    clearSelection, resetView,
    zoomIn()  { if (svg) zoomAt(1.5, cw / 2, ch / 2); },
    zoomOut() { if (svg) zoomAt(1 / 1.5, cw / 2, ch / 2); },
    getSelected() { return state.selected.slice(); }
  };

  // The map starts inside a hidden tool view: re-measure after opening it.
  const campusResizeObserver = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(() => {
      if (svg && frame.getBoundingClientRect().width > 0) measure(false);
    }) : null;
  campusResizeObserver?.observe(frame);
  document.querySelector('.tool-menu-card[data-target="friend"]')
    ?.addEventListener('click', () => requestAnimationFrame(() => {
      if (svg && frame.getBoundingClientRect().width > 0) measure(false);
    }));
  /* ----------------------------------------------------------------- go */
  svgSource().then(mount).then(() => {
    ready = true; resolveReady(true);
    if (pending.length) openNow(pending.pop());
    pending.length = 0;
  }).catch((err) => {
    console.error('[SahibCampusMap] could not load the map drawing', err);
    wrap.innerHTML = '<div class="cm-loading">تعذّر تحميل رسم الخريطة. تأكد من وجود campus-map.svg بجانب campus-map.js.</div>';
    refresh();
  });
  refresh();
})();
