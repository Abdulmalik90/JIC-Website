/* =========================================
   نظام الخطط الدراسية - plans.js
   (محدث بالكامل لدعم الداتا الجديدة والتحضيري)
   ========================================= */

// =========================================
// 1. بيانات السنة التحضيرية
// =========================================
const JTI_Prep_Data = {
    id: 'jti_prep',
    name: 'السنة التحضيرية',
    arabicName: 'السنة التحضيرية - المعهد',
    degree: 'السنة التحضيرية',
    years: 1,
    track: 'بنين وبنات', 
    icon: 'fi-rr-book',
    semesters: [ 
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

const JIC_Prep_Data = {
    id: 'jic_prep',
    name: 'السنة التحضيرية',
    arabicName: 'السنة التحضيرية - الكلية',
    degree: 'السنة التحضيرية',
    years: 1,
    track: 'بنين وبنات',
    icon: 'fi-rr-book-alt',
    semesters: [
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

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetSource = urlParams.get('source'); 
    const targetFilter = urlParams.get('filter'); 

    if (targetSource && targetFilter) {
        switchPlanSource(targetSource);
        setTimeout(() => { filterMajors(targetFilter); }, 50);
    } else {
        switchPlanSource('college');
    }
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    switchPlanSource('college');
}

function switchPlanSource(source) {
    currentSource = source;
    document.querySelectorAll('.plan-tab').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(source));
    });

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

    if (filters.length > 0) filterMajors(filters[0].id);
}

function getMajorsList(source, filterId) {
    if (source === 'college' && filterId === 'prep') return [ JIC_Prep_Data ];
    if (source === 'institute' && filterId === 'prep') return [ JTI_Prep_Data ];
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
                <p style="color: var(--text-light);">لا توجد تخصصات مضافة حالياً.</p>
            </div>`;
        return;
    }

    list.forEach(major => {
        const card = document.createElement('div');
        card.className = 'major-card-btn';
        
        // هنا يتم استدعاء دالة الفتح عند الضغط
        card.onclick = function() { loadMajorPlanData(major); };
        
        let iconClass = 'fi-rr-document';
        if (major.category === 'engineering') iconClass = "fi-rr-settings";
        else if (major.category === 'it') iconClass = "fi-rr-laptop";
        else if (major.category === 'industrial') iconClass = "fi-rr-wrench-simple";
        else if (major.category === 'science') iconClass = "fi-rr-test-tube";
        else if (major.category === 'other') iconClass = "fi-rr-chart-histogram";
        
        if (major.icon) iconClass = major.icon;

        const majorName = major.name || major.arabicName;

        card.innerHTML = `<i class="fi ${iconClass}"></i><span>${majorName}</span>`;
        grid.appendChild(card);
    });

    closePlanView();
}

// =========================================
// هذي الدوال اللي انمسحت عندك بالغلط
// =========================================

// دالة تحميل تفاصيل الخطة وفتح الشاشة
function loadMajorPlanData(majorData) {
    document.getElementById('plans-main-tabs').style.display = 'none';
    document.getElementById('sub-filters-container').style.display = 'none';
    document.getElementById('majors-grid').style.display = 'none';
    document.getElementById('plan-detail-view').style.display = 'block';

    renderPlanDetails(majorData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// دالة زر الرجوع للتخصصات
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

// =========================================
// محرك رسم الجداول
// =========================================
function renderPlanDetails(majorData) {
    if (!majorData) return;

    const majorName = majorData.arabicName || majorData.name;
    document.getElementById("portal-greating").textContent = majorName;
    document.getElementById("majorDegree").textContent = majorData.degree || 'غير محدد';
    document.getElementById("majorYears").textContent = majorData.years ? majorData.years + " سنوات" : 'سنة واحدة';
    document.getElementById("majorGender").textContent = majorData.track || majorData.genders || 'الجميع';

    const container = document.getElementById("courseTableContainer");
    container.innerHTML = '';

    let totalPlanHours = 0;

    const semestersList = majorData.semesters || majorData.courses;

    if (Array.isArray(semestersList) && semestersList.length > 0) {
        
        semestersList.forEach(sem => {
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
            table.innerHTML = `<thead><tr><th>المادة</th><th>ساعات</th><th>نظري</th><th>عملي</th><th>مُتطلب</th></tr></thead>`;

            const tbody = document.createElement("tbody");
            let semHours = 0;

            if(Array.isArray(sem.courses)){
                sem.courses.forEach(course => {
                    const [title, credits, lec, lab, prereqs] = course;
                    const row = document.createElement("tr");
                    let prereqText = (Array.isArray(prereqs) && prereqs.length > 0) ? prereqs.join(', ') : '-';
                    
                    const creditsNum = parseInt(credits, 10) || 0;

                    row.innerHTML = `
                        <td style="font-weight:bold">${title}</td>
                        <td>${credits}</td>
                        <td>${lec}</td>
                        <td>${lab}</td>
                        <td style="font-size:11px; color:var(--text-light)">${prereqText}</td>
                    `;
                    tbody.appendChild(row);
                    semHours += creditsNum;
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

        const optionalSem = semestersList.find(s => s.semester === 0);
        
        if (optionalSem && optionalSem.courses && optionalSem.courses.length > 0) {
            const divider = document.createElement("div");
            divider.style.cssText = "margin: 30px 0 15px 0; border-top: 2px dashed var(--border-color); position: relative;";
            divider.innerHTML = `<span style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--bg-color); padding: 0 10px; color: var(--text-light); font-size: 12px;">نهاية الخطة الأساسية</span>`;
            container.appendChild(divider);

            const card = document.createElement("div");
            card.classList.add("semester-card", "optional-semester"); 

            const header = document.createElement("div");
            header.classList.add("semester-header");
            header.innerHTML = `<h2>المواد الاختيارية (Electives)</h2>`;
            card.appendChild(header);

            const tableWrapper = document.createElement("div");
            tableWrapper.classList.add("course-table-wrapper");

            const table = document.createElement("table");
            table.classList.add("course-table");
            table.innerHTML = `<thead><tr><th>المادة</th><th>ساعات</th><th>نظري</th><th>عملي</th><th>مُتطلب</th></tr></thead>`;

            const tbody = document.createElement("tbody");

            optionalSem.courses.forEach(course => {
                const [title, credits, lec, lab, prereqs] = course;
                const row = document.createElement("tr");
                let prereqText = (Array.isArray(prereqs) && prereqs.length > 0) ? prereqs.join(', ') : '-';
                
                row.innerHTML = `
                    <td style="font-weight:bold">${title}</td>
                    <td>${credits}</td>
                    <td>${lec}</td>
                    <td>${lab}</td>
                    <td style="font-size:11px; color:var(--text-light)">${prereqText}</td>
                `;
                tbody.appendChild(row);
            });

            table.appendChild(tbody);
            tableWrapper.appendChild(table);
            card.appendChild(tableWrapper);
            container.appendChild(card);
        }
    } else {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-light);">الخطة غير متوفرة حالياً.</div>`;
    }

    const totalBox = document.getElementById('total-hours-container');
    if(totalBox) totalBox.innerHTML = `<div class="total-plan-box" style="margin-top: 15px; font-weight: bold; background: rgba(0, 123, 196, 0.1); color: var(--primary-text); padding: 10px; border-radius: 12px; text-align: center;">إجمالي ساعات الخطة الأساسية: ${totalPlanHours}</div>`;
}