/* =========================================
   نظام الخطط الدراسية - plans.js
   (محدث ببيانات التحضيري)
   ========================================= */

// =========================================
// 1. بيانات السنة التحضيرية (تم نقلها هنا لضمان العمل الفوري)
// =========================================

// بيانات تحضيري المعهد (JTI)
const JTI_Prep_Data = {
    id: 'jti_prep',
    name: 'السنة التحضيرية', // الاسم الظاهر في الزر
    arabicName: 'السنة التحضيرية - المعهد',
    degree: 'السنة التحضيرية',
    years: 1,
    genders: 'بنين وبنات',
    icon: 'fi-rr-book', // أيقونة الكتاب
    isStatic: false, // الآن أصبحت بيانات حقيقية وليست وهمية
    courses: [
        {
            semester: 1,
            courses: [
                ["Technical Drawing", 2, 1, 2, []],
                ["Introduction to Safety", 2, 2, 0, []],
                ["Occupational Health and Safety", 4, 4, 0, []],
                ["Computer Application", 2, 1, 2, []],
                ["English I", 8, 20, 1, []]
            ]
        },
        {
            semester: 2,
            courses: [
                ["Industrial Plant Safety", 4, 3, 2, []],
                ["Workshop Skills Safety", 3, 2, 2, []],
                ["Technical Mathematics", 3, 3, 0, []],
                ["English II", 8, 20, 1, ["English I"]]
            ]
        }
    ]
};

// بيانات تحضيري الكلية (JIC)
const JIC_Prep_Data = {
    id: 'jic_prep',
    name: 'السنة التحضيرية', // الاسم الظاهر في الزر
    arabicName: 'السنة التحضيرية - الكلية',
    degree: 'السنة التحضيرية',
    years: 1,
    genders: 'بنين وبنات',
    icon: 'fi-rr-book-alt',
    isStatic: false,
    courses: [
        {
            semester: 1,
            courses: [
                ["English I (Reading and writing)", 8, 10, 0, []],
                ["English I (Listening & Speaking)", 0, 6, 0, []],
                ["English I (E-Learning)", 0, 0, 2, []],
                ["English I (ESP)", 0, 3, 0, []],
                ["Preparatory Math I", 4, 4, 0, []],
                ["Introduction to Computer", 1, 1, 0, []]
            ]
        },
        {
            semester: 2,
            courses: [
                ["English II (Reading and writing)", 8, 10, 0, ["English I (Reading and writing)"]],
                ["English II (Listening & Speaking)", 0, 6, 0, ["English I (Listening & Speaking)"]],
                ["English II (E-Learning)", 0, 0, 2, ["English II (E-Learning)"]],
                ["English II (ESP)", 0, 3, 0, ["English II (ESP)"]],
                ["Preparatory Math II", 4, 4, 0, ["Preparatory Math I"]],
                ["Study Skills", 1, 1, 0, []]
            ]
        }
    ]
};


// =========================================
// 2. إعدادات الهيكل والتصفية
// =========================================

const plansStructure = {
    college: {
        filters: [
            { id: 'prep', name: 'السنة التحضيرية' },
            { id: 'bachelor', name: 'البكالوريوس' },
            { id: 'diploma', name: 'الدبلوم' }
        ]
    },
    institute: {
        filters: [
            { id: 'prep', name: 'السنة التحضيرية' },
            { id: 'diploma', name: 'الدبلوم' }
        ]
    }
};

let currentSource = 'college'; 
let currentFilter = 'prep';    

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // 1. قراءة الرابط لمعرفة القسم المطلوب (من الصفحة الرئيسية)
    const urlParams = new URLSearchParams(window.location.search);
    const targetSource = urlParams.get('source'); // college أو institute
    const targetFilter = urlParams.get('filter'); // prep, bachelor, diploma

    // 2. إذا فيه تعليمات في الرابط، نفذها
    if (targetSource && targetFilter) {
        // تفعيل المصدر (كلية/معهد)
        switchPlanSource(targetSource);
        
        // تفعيل الفلتر (دبلوم/بكالوريوس..) مع تأخير بسيط جداً لضمان بناء الأزرار
        setTimeout(() => {
            filterMajors(targetFilter);
        }, 50);
        
    } else {
        // 3. الوضع الافتراضي (إذا دخل الصفحة بدون روابط)
        switchPlanSource('college');
    }
});

// في حال تأخر تحميل السكربت قليلاً
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    switchPlanSource('college');
}

// دالة التبديل بين الكلية والمعهد
function switchPlanSource(source) {
    currentSource = source;
    
    // تحديث التابات
    document.querySelectorAll('.plan-tab').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(source));
    });

    // بناء الفلاتر
    const filtersContainer = document.getElementById('sub-filters-container');
    if (!filtersContainer) return;
    filtersContainer.innerHTML = '';
    
    const filters = plansStructure[source].filters;
    filters.forEach((f, index) => {
        const btn = document.createElement('button');
        btn.className = `sub-filter-btn ${index === 0 ? 'active' : ''}`;
        btn.innerText = f.name;
        btn.onclick = () => filterMajors(f.id, btn);
        filtersContainer.appendChild(btn);
    });

    // تشغيل أول فلتر
    if (filters.length > 0) filterMajors(filters[0].id);
}

// دالة جلب البيانات (تم التحديث لربط التحضيري)
function getMajorsList(source, filterId) {
    // 1. تحضيري الكلية (نرجع المتغير اللي عرفناه فوق)
    if (source === 'college' && filterId === 'prep') {
        return [ JIC_Prep_Data ];
    }
    
    // 2. تحضيري المعهد (نرجع المتغير اللي عرفناه فوق)
    if (source === 'institute' && filterId === 'prep') {
        return [ JTI_Prep_Data ];
    }

    // 3. باقي التخصصات (تأتي من الملفات الخارجية عبر HTML)
    if (source === 'college' && filterId === 'bachelor') return window.JIC_Bachelor_List || [];
    if (source === 'college' && filterId === 'diploma') return window.JIC_Diploma_List || [];
    if (source === 'institute' && filterId === 'diploma') return window.JTI_Diploma_List || [];

    return [];
}

// تصفية وعرض الكروت
function filterMajors(filterId, clickedBtn = null) {
    currentFilter = filterId;

    if (clickedBtn) {
        document.querySelectorAll('.sub-filter-btn').forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');
    } else {
        const btns = document.querySelectorAll('.sub-filter-btn');
        if(btns.length > 0) btns[0].classList.add('active');
    }

    const grid = document.getElementById('majors-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const list = getMajorsList(currentSource, filterId);

    if (list.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fi fi-rr-sad-tear" style="font-size: 40px; color: #ccc; margin-bottom:10px; display:block;"></i>
                <p style="color: var(--text-sub);">لا توجد تخصصات مضافة حالياً.</p>
            </div>`;
        return;
    }

    list.forEach(major => {
        const card = document.createElement('div');
        card.className = 'major-card-btn';
        card.onclick = function() { loadMajorPlanData(major); };
        
        const iconClass = major.icon || 'fi-rr-document';
        card.innerHTML = `<i class="fi ${iconClass}"></i><span>${major.name}</span>`;
        grid.appendChild(card);
    });

    closePlanView();
}

// تحميل تفاصيل الخطة
function loadMajorPlanData(majorData) {
    // إذا كانت البيانات لا تزال "ثابتة" (للاحتياط)
    if(majorData.isStatic) {
        if(typeof showAlert === 'function') showAlert('قريباً', 'سيتم إضافة الجداول قريباً.', '⏳');
        else alert('قريباً..');
        return;
    }

    document.getElementById('plans-main-tabs').style.display = 'none';
    document.getElementById('sub-filters-container').style.display = 'none';
    document.getElementById('majors-grid').style.display = 'none';
    document.getElementById('plan-detail-view').style.display = 'block';

    renderPlanDetails(majorData);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// زر الرجوع
function closePlanView() {
    const detailView = document.getElementById('plan-detail-view');
    const tabs = document.getElementById('plans-main-tabs');
    const filters = document.getElementById('sub-filters-container');
    const grid = document.getElementById('majors-grid');

    if (detailView) detailView.style.display = 'none';
    if (tabs) tabs.style.display = 'flex';
    if (filters) filters.style.display = 'flex';
    if (grid) grid.style.display = 'grid';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// محرك رسم الجداول
function renderPlanDetails(majorData) {
    if (!majorData) return;

    document.getElementById("portal-greating").textContent = majorData.arabicName;
    document.getElementById("majorDegree").textContent = majorData.degree;
    document.getElementById("majorYears").textContent = majorData.years + " سنوات";
    document.getElementById("majorGender").textContent = majorData.genders;

    const container = document.getElementById("courseTableContainer");
    container.innerHTML = '';

    let totalPlanHours = 0;

    if (Array.isArray(majorData.courses)) {
        majorData.courses.forEach(sem => {
            if (sem.semester === 0) return;

            const card = document.createElement("div");
            card.classList.add("semester-card");

            const header = document.createElement("div");
            header.classList.add("semester-header");
            header.innerHTML = `<h2>الفصل الدراسي ${sem.semester}</h2>`;
            card.appendChild(header);

            const tableWrapper = document.createElement("div");
            tableWrapper.classList.add("course-table-wrapper");

            const table = document.createElement("table");
            table.classList.add("course-table");
            table.innerHTML = `<thead><tr><th>المادة</th><th>ساعات</th><th>نظري</th><th>عملي</th><th>سابق</th></tr></thead>`;

            const tbody = document.createElement("tbody");
            let semHours = 0;

            if(Array.isArray(sem.courses)){
                sem.courses.forEach(course => {
                    const [title, credits, lec, lab, prereqs] = course;
                    const row = document.createElement("tr");
                    let prereqText = (Array.isArray(prereqs) && prereqs.length > 0) ? prereqs.join(', ') : '-';
                    
                    row.innerHTML = `
                        <td style="font-weight:bold">${title}</td>
                        <td>${credits}</td>
                        <td>${lec}</td>
                        <td>${lab}</td>
                        <td style="font-size:11px; color:var(--text-sub)">${prereqText}</td>
                    `;
                    tbody.appendChild(row);
                    semHours += credits;
                });
            }

            const totalRow = document.createElement("tr");
            totalRow.className = "total-row";
            totalRow.innerHTML = `<td class="total-title">مجموع الساعات</td><td>${semHours}</td><td colspan="3"></td>`;
            tbody.appendChild(totalRow);

            totalPlanHours += semHours;
            table.appendChild(tbody);
            tableWrapper.appendChild(table);
            card.appendChild(tableWrapper);
            container.appendChild(card);
        });
    }

    const totalBox = document.getElementById('total-hours-container');
    if(totalBox) totalBox.innerHTML = `<div class="total-plan-box">إجمالي ساعات الخطة: ${totalPlanHours}</div>`;
}