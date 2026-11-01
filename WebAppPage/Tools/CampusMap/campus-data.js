/* ==========================================================================
   Sahib Campus Map — campus-data.js
   Building metadata for the Jubail Industrial College campus map.

   • Geometry  → comes from File A (shape PDF) and lives in campus-map.svg
   • Names     → public Arabic names follow the names reference (File B) / the request
   • Every entry's `id` equals the `data-id` of its <g class="cm-building"> in the SVG.

   Fields
     id              unique id (matches the SVG group)
     name            public Arabic name shown in the UI
     sub             one-line subtitle (shown in the list)
     type            category key (see typeMeta in campus-map.js)
     description     short description (shown in the floating card)
     tags            small chips / extra search words
     aliases         extra names that search + openBuilding() understand
     scheduleAliases names used by the timetable (rooms/buildings) that map to this entry
   ========================================================================== */
window.SahibCampusData = Object.freeze({
  version: 3,
  campus: 'jubail-industrial-college',

  /* Filter chips (type → chip). `types` are matched against entry.type */
  filters: [
    { id: 'all',      label: 'الكل',     types: null },
    { id: 'academic', label: 'تعليمي',   types: ['academic'] },
    { id: 'admin',    label: 'إدارة',    types: ['admin'] },
    { id: 'service',  label: 'خدمات',    types: ['service', 'restaurant', 'commercial', 'health'] },
    { id: 'sports',   label: 'رياضة',    types: ['sports'] },
    { id: 'religious',label: 'مساجد',    types: ['religious'] },
    { id: 'housing',  label: 'السكن',    types: ['dorm-old', 'dorm-new'] },
    { id: 'gate',     label: 'بوابات',   types: ['gate'] }
  ],

  /* ----------------------------------------------------------------------
     Text labels drawn on the map.
       ids  : buildings the label belongs to (dims/highlights with them)
       x,y  : position in map units (same space as the SVG viewBox 0 0 826 758)
       size : font size in map units at normal zoom
       rot  : rotation (deg)       anchor: 'middle' | 'start' | 'end'
       pri  : 1 = always visible · 2 = visible when zoomed in a little · 3 = zoomed in
       minK : optional — hide while the map is smaller than this many screen px per map unit (declutters phones)
       Use '\n' for a second line.
     ---------------------------------------------------------------------- */
  labels: [
    { ids: ['stadium'],              text: 'الملعب',                 x: 543, y: 162, size: 13,  pri: 1 },
    { ids: ['electricity-building'], text: 'مبنى الكهرباء',          x: 428, y: 190, size: 11,  pri: 1 },
    { ids: ['chemistry-building'],   text: 'مبنى الكيمياء',          x: 350, y: 216, size: 11,  pri: 1 },
    { ids: ['computer-building'],    text: 'مبنى الحاسب',            x: 426, y: 250, size: 11,  pri: 1 },
    { ids: ['library'],              text: 'المكتبة',                x: 384, y: 275, size: 10,  pri: 1, minK: 0.6 },
    { ids: ['english-institute'],    text: 'معهد الإنجليزي',         x: 326, y: 296, size: 12,  pri: 1, rot: -3 },
    { ids: ['restaurant'],           text: 'مطعم الكلية',            x: 424, y: 397, size: 11,  pri: 1 },
    { ids: ['old-dorm'],             text: 'السكن الطلابي\nالقديم',  x: 536, y: 364, size: 13,  pri: 1 },
    { ids: ['gym'],                  text: 'الصالة الرياضية',        x: 242, y: 421, size: 8.5, pri: 1 },
    { ids: ['wings'],                text: 'الأجنحة',                x: 374, y: 512, size: 15,  pri: 1, rot: -3 },
    { ids: ['student-affairs'],      text: 'الإدارة وشؤون\nالطلاب',  x: 520, y: 498, size: 9.5, pri: 1 },
    { ids: ['prince-saud'],          text: 'مبنى الأمير\nسعود',      x: 466, y: 626, size: 10,  pri: 1 },
    { ids: ['west-gate'],            text: 'البوابة الغربية',        x: 173, y: 323, size: 8.5, pri: 1 },
    { ids: ['main-gate'],            text: 'البوابة الرئيسية',       x: 598, y: 589, size: 8.5, pri: 1 },
    { ids: ['new-dorm-1','new-dorm-2','new-dorm-3','new-dorm-4','new-dorm-5','new-dorm-6','new-dorm-7',
            'new-dorm-8','new-dorm-9','new-dorm-10','new-dorm-11','new-dorm-12','new-dorm-13'],
                                     text: 'السكن الطلابي الجديد',   x: 700, y: 458, size: 10,  pri: 1 },
    { ids: ['old-mosque'],           text: 'المسجد القديم',          x: 482, y: 486, size: 6.5, pri: 2 },
    { ids: ['new-mosque'],           text: 'المسجد الجديد',          x: 726, y: 333, size: 7,   pri: 2 },
    { ids: ['clinic'],               text: 'العيادة',                x: 619, y: 326, size: 6.5, pri: 3, anchor: 'end' },
    { ids: ['housing-dept'],         text: 'قسم الإسكان',            x: 630, y: 350, size: 6.5, pri: 3, anchor: 'end' },
    { ids: ['shops-1'],              text: 'محلات تجارية',           x: 575, y: 272, size: 6,   pri: 3, rot: 28 },
    { ids: ['shops-2','shops-3','shops-4'],
                                     text: 'محلات تجارية',           x: 611, y: 396, size: 6,   pri: 3, rot: 75, anchor: 'middle' }
  ],

  college: [
    /* ---------------- gates ---------------- */
    {
      id: 'west-gate', name: 'البوابة الغربية', sub: 'مدخل غربي للحرم', type: 'gate',
      description: 'البوابة الغربية للكلية، تقع على الطرف الغربي من الحرم.',
      tags: ['بوابة', 'مدخل'],
      aliases: ['البوابة الغربية', 'West Gate', 'بوابة غربية']
    },
    {
      id: 'main-gate', name: 'البوابة الرئيسية', sub: 'المدخل الرئيسي', type: 'gate',
      // TODO(geometry): File A has the label and the entrance road but no gate footprint;
      // the clickable bar is a small marker placed across the entrance road (see tools/build_map.py).
      description: 'المدخل الرئيسي للكلية من الجهة الجنوبية، ويؤدي إلى قلب الحرم.',
      tags: ['بوابة', 'مدخل رئيسي'],
      aliases: ['البوابة الرئيسية', 'Main Gate', 'البوابة الجنوبية']
    },

    /* ---------------- academic ---------------- */
    {
      id: 'english-institute', name: 'معهد الإنجليزي', sub: 'مركز اللغة الإنجليزية', type: 'academic',
      description: 'مبنى معهد اللغة الإنجليزية (English Language Center) في الجهة الغربية من القلب الأكاديمي.',
      tags: ['تعليمي', 'لغة إنجليزية', 'ELC'],
      aliases: ['معهد الانجليزي', 'معهد اللغة الإنجليزية', 'مركز اللغة الإنجليزية', 'English Institute', 'English Language Center', 'ELC']
    },
    {
      id: 'electricity-building', name: 'مبنى الكهرباء', sub: 'قسم تقنية الهندسة الكهربائية', type: 'academic',
      description: 'مبنى قسم تقنية الهندسة الكهربائية والإلكترونية (ELET).',
      tags: ['تعليمي', 'كهرباء', 'ELET'],
      aliases: ['مبنى الكهرباء', 'الكهرباء', 'Electrical Building', 'ELET']
    },
    {
      id: 'chemistry-building', name: 'مبنى الكيمياء', sub: 'قسم تقنية الهندسة الكيميائية', type: 'academic',
      description: 'مبنى قسم تقنية الهندسة الكيميائية والمعالجة الصناعية (CHET).',
      tags: ['تعليمي', 'كيمياء', 'CHET'],
      aliases: ['مبنى الكيمياء', 'الكيمياء', 'Chemistry Building', 'CHET']
    },
    {
      id: 'computer-building', name: 'مبنى الحاسب', sub: 'قسم الإدارة وتقنية المعلومات', type: 'academic',
      description: 'مبنى الحاسب، ويضم قسم الإدارة وتقنية المعلومات (MIT).',
      tags: ['تعليمي', 'حاسب', 'MIT'],
      aliases: ['مبنى الحاسب', 'الحاسب', 'مبنى الحاسوب', 'Computer Building', 'MIT']
    },
    {
      id: 'wings', name: 'الأجنحة', sub: 'مجمع Wings', type: 'academic',
      description: 'مجمع الأجنحة التعليمية (Wings): قاعات ومعامل ومكاتب أقسام الكلية. تُربط به كل أجنحة الجدول.',
      tags: ['تعليمي', 'Wings', 'قاعات'],
      aliases: ['الأجنحة', 'الاجنحة', 'مبنى الأجنحة', 'Wings'],
      // All timetable names below resolve to this single complex (individual wings are NOT shown in the UI).
      // Wing 6 / Wing 7 are extras: they exist in the names reference (File B).
      scheduleAliases: [
        'Wing 1', 'Wing 2', 'Wing 3', 'Wing 4', 'Wing 5', 'Wing 6', 'Wing 7',
        'Wing 1 -Ground Floor', 'Wing 2 -Ground Floor', 'Wing 3 -Ground Floor', 'Wing 4 -Ground Floor', 'Wing 5 -Ground Floor',
        'Wing 6 -Ground Floor', 'Wing 7 -Ground Floor'
      ]
    },

    /* ---------------- services ---------------- */
    {
      id: 'library', name: 'المكتبة', sub: 'مركز مصادر التعلم', type: 'service',
      description: 'المكتبة ومركز مصادر التعلم (Library and Learning Resources Center).',
      tags: ['خدمات أكاديمية', 'مصادر تعلم'],
      aliases: ['المكتبة', 'مكتبة', 'مركز مصادر التعلم', 'Library', 'LRC']
    },
    {
      id: 'restaurant', name: 'مطعم الكلية', sub: 'خدمة طلابية', type: 'restaurant',
      description: 'مطعم الكلية، في الساحة الوسطى بين الأجنحة والسكن الطلابي القديم.',
      tags: ['مطعم', 'خدمة طلابية'],
      aliases: ['مطعم الكلية', 'المطعم', 'Restaurant', 'Cafeteria']
    },
    {
      id: 'clinic', name: 'عيادة الكلية', sub: 'خدمة صحية', type: 'health',
      description: 'عيادة الكلية، بجانب مجمع السكن الطلابي.',
      tags: ['عيادة', 'صحة'],
      aliases: ['عيادة الكلية', 'العيادة', 'Clinic']
    },
    {
      id: 'shops-1', name: 'محلات تجارية', sub: 'خدمة طلابية', type: 'commercial',
      description: 'محلات تجارية تخدم الطلاب في محيط حلقة السكن القديم.',
      tags: ['محلات', 'تجارية'], aliases: ['محلات تجارية', 'المحلات', 'Shops']
    },
    {
      id: 'shops-2', name: 'محلات تجارية', sub: 'خدمة طلابية', type: 'commercial',
      description: 'محلات تجارية تخدم الطلاب في محيط حلقة السكن القديم.',
      tags: ['محلات', 'تجارية'], aliases: ['محلات تجارية', 'المحلات', 'Shops']
    },
    {
      id: 'shops-3', name: 'محلات تجارية', sub: 'خدمة طلابية', type: 'commercial',
      description: 'محلات تجارية تخدم الطلاب في محيط حلقة السكن القديم.',
      tags: ['محلات', 'تجارية'], aliases: ['محلات تجارية', 'المحلات', 'Shops']
    },
    {
      id: 'shops-4', name: 'محلات تجارية', sub: 'خدمة طلابية', type: 'commercial',
      description: 'محلات تجارية تخدم الطلاب في محيط حلقة السكن القديم.',
      tags: ['محلات', 'تجارية'], aliases: ['محلات تجارية', 'المحلات', 'Shops']
    },

    /* ---------------- administration ---------------- */
    {
      id: 'student-affairs', name: 'الإدارة وشؤون الطلاب', sub: 'مبنى إداري', type: 'admin',
      description: 'مبنى الإدارة وشؤون الطلاب، ويضم أيضًا المسرح ومركز مصادر الإعلام والمطبعة.',
      tags: ['إدارة', 'شؤون الطلاب', 'مسرح'],
      aliases: ['الإدارة وشؤون الطلاب', 'الادارة وشؤون الطلاب', 'الإدارة', 'شؤون الطلاب', 'المسرح', 'Admin', 'Admin Building', 'Student Affairs']
    },
    {
      id: 'housing-dept', name: 'قسم الإسكان', sub: 'مبنى إداري', type: 'admin',
      description: 'قسم الإسكان، قرب مجمع السكن الطلابي الجديد.',
      tags: ['إسكان', 'إدارة'],
      aliases: ['قسم الإسكان', 'إدارة السكن', 'الإسكان', 'Housing']
    },
    {
      id: 'prince-saud', name: 'مبنى الأمير سعود', sub: 'مبنى خدمي', type: 'admin',
      // TODO(identity): the names reference (File B) lists this same footprint as
      // "مركز التدريب / Training Center". The name "مبنى الأمير سعود" is kept because it is
      // the requested name and is printed on File A.  Confirm with the college before publishing
      // a functional description.
      description: 'مبنى الأمير سعود، جنوب المنطقة الإدارية قرب البوابة الرئيسية.',
      tags: ['مبنى الأمير سعود'],
      aliases: ['مبنى الأمير سعود', 'الأمير سعود', 'مركز التدريب', 'Training Center', 'Prince Saud']
    },

    /* ---------------- sports ---------------- */
    {
      id: 'stadium', name: 'الملعب', sub: 'مرفق رياضي', type: 'sports',
      description: 'ملعب الكلية الرئيسي في الجهة الشمالية من الحرم، بجانب مواقف الملعب.',
      tags: ['رياضة', 'ملعب'],
      aliases: ['الملعب', 'ملعب الكلية', 'Stadium', 'Soccer field', 'Field']
    },
    {
      id: 'gym', name: 'الصالة الرياضية', sub: 'القاعة متعددة الأغراض', type: 'sports',
      description: 'الصالة الرياضية والقاعة متعددة الأغراض (MPH + GYM) في الجهة الغربية من الحرم.',
      tags: ['رياضة', 'صالة', 'MPH'],
      aliases: ['الصالة الرياضية', 'الصاله الرياضيه', 'القاعة متعددة الأغراض', 'Gym', 'MPH']
    },

    /* ---------------- mosques ---------------- */
    {
      id: 'old-mosque', name: 'المسجد القديم', sub: 'مرفق ديني', type: 'religious',
      description: 'المسجد القديم في المحور الأوسط للحرم، شمال الإدارة وجنوب السكن القديم.',
      tags: ['مسجد'], aliases: ['المسجد القديم', 'مسجد', 'Old Mosque', 'Mosque']
    },
    {
      id: 'new-mosque', name: 'المسجد الجديد', sub: 'مرفق ديني', type: 'religious',
      // Extra: printed on File A ("المسجد الجديد") and drawn in File B; not in the required list.
      description: 'المسجد الجديد في منطقة السكن الطلابي الجديد.',
      tags: ['مسجد'], aliases: ['المسجد الجديد', 'مسجد', 'New Mosque', 'Mosque']
    },

    /* ---------------- student housing ---------------- */
    {
      id: 'old-dorm', name: 'السكن الطلابي القديم', sub: 'مجمع سكني', type: 'dorm-old',
      description: 'مجمع السكن الطلابي القديم، حلقة سكنية دائرية في قلب الحرم.',
      tags: ['سكن', 'قديم'],
      aliases: ['السكن القديم', 'السكن الطلابي القديم', 'سكن الطلاب القديم', 'Old Dorm', 'Old Housing']
    },
    /* 13 separate buildings — all share the same public name (as requested). */
    ...Array.from({ length: 13 }, (_, i) => ({
      id: 'new-dorm-' + (i + 1),
      name: 'السكن الطلابي الجديد',
      sub: 'مبنى سكني',
      type: 'dorm-new',
      description: 'أحد مباني مجمع السكن الطلابي الجديد شرق الحرم.',
      tags: ['سكن', 'جديد'],
      aliases: ['السكن الجديد', 'السكن الطلابي الجديد', 'سكن الطلاب الجديد', 'New Dorm', 'New Housing']
    }))
  ]
});
