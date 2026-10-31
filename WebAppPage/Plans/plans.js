/* =========================================
   محرك الخطط والتخصصات المطور - plans.js
   ========================================= */

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
    switchPlanSource('college');
});

function switchPlanSource(source) {
    currentSource = source;
    
    // تحديث الأزرار الرئيسية
    const btns = document.querySelectorAll('.segmented-btn');
    btns.forEach(btn => {
        const isCollege = btn.getAttribute('onclick').includes('college') && source === 'college';
        const isInstitute = btn.getAttribute('onclick').includes('institute') && source === 'institute';
        btn.classList.toggle('active', isCollege || isInstitute);
    });

    // رسم الرقاقات الفرعية
    const filtersContainer = document.getElementById('sub-filters-container');
    if (!filtersContainer) return;
    filtersContainer.innerHTML = '';
    
    const filters = plansStructure[source].filters;
    filters.forEach((f, index) => {
        const chip = document.createElement('button');
        chip.className = `sub-chip-btn ${index === 0 ? 'active' : ''}`;
        chip.innerText = f.name;
        chip.onclick = () => filterMajors(f.id, chip);
        filtersContainer.appendChild(chip);
    });

    if (filters.length > 0) filterMajors(filters[0].id);
}

function getMajorsList(source, filterId) {
    if (source === 'college' && filterId === 'prep') return [ window.JIC_Prep_Data || JIC_Prep_Data ];
    if (source === 'institute' && filterId === 'prep') return [ window.JTI_Prep_Data || JTI_Prep_Data ];
    if (source === 'college' && filterId === 'bachelor') return window.JIC_Bachelor_List || [];
    if (source === 'college' && filterId === 'diploma') return window.JIC_Diploma_List || [];
    if (source === 'institute' && filterId === 'diploma') return window.JTI_Diploma_List || [];
    return [];
}

function filterMajors(filterId, clickedBtn = null) {
    currentFilter = filterId;

    if (clickedBtn) {
        document.querySelectorAll('.sub-chip-btn').forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');
    }

    const grid = document.getElementById('majors-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const list = getMajorsList(currentSource, filterId);

    if (list.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fi fi-rr-document-signed" style="font-size: 36px; color: var(--text-light); margin-bottom:8px; display:block;"></i>
                <p style="color: var(--text-light); font-size:12px;">لا توجد تخصصات مضافة حالياً لهذا القسم.</p>
            </div>`;
        return;
    }

    list.forEach(major => {
        const card = document.createElement('div');
        card.className = 'bento-major-card';
        card.onclick = function() { loadMajorPlanData(major); };

        // ضمان أيقونات شغالّة وتظهر دائماً
        let iconClass = 'fi-rr-graduation-cap';
        if (major.category === 'engineering') iconClass = "fi-rr-settings";
        else if (major.category === 'it') iconClass = "fi-rr-laptop";
        else if (major.category === 'industrial') iconClass = "fi-rr-wrench-simple";
        else if (major.category === 'science') iconClass = "fi-rr-flask";
        if (major.icon) iconClass = major.icon;

        const majorName = major.arabicName || major.name;

        card.innerHTML = `
            <div class="bento-card-icon"><i class="fi ${iconClass}"></i></div>
            <div class="bento-card-title">${majorName}</div>
            <i class="fi fi-rr-arrow-left bento-card-arrow"></i>
        `;
        grid.appendChild(card);
    });

    closePlanView();
}

function loadMajorPlanData(majorData) {
    document.getElementById('plansHero').style.display = 'none';
    document.getElementById('plansControls').style.display = 'none';
    document.getElementById('majors-grid').style.display = 'none';
    document.getElementById('plan-detail-view').style.display = 'block';

    renderPlanDetails(majorData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePlanView() {
    document.getElementById('plan-detail-view').style.display = 'none';
    document.getElementById('plansHero').style.display = 'block';
    document.getElementById('plansControls').style.display = 'block';
    document.getElementById('majors-grid').style.display = 'grid';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// رسم الخطة والجداول مع كافة التفاصيل والمواد الاختيارية
function renderPlanDetails(majorData) {
    if (!majorData) return;

    const majorName = majorData.arabicName || majorData.name;
    document.getElementById("portal-greating").textContent = majorName;
    document.getElementById("majorDegreeBadge").textContent = majorData.degree || 'التخصص';
    document.getElementById("majorYears").textContent = majorData.years ? majorData.years + " سنوات" : 'سنة واحدة';
    document.getElementById("majorGender").textContent = majorData.track || majorData.genders || 'الجميع';

    const container = document.getElementById("courseTableContainer");
    container.innerHTML = '';

    let totalPlanHours = 0;
    const semestersList = majorData.semesters || majorData.courses;

    if (Array.isArray(semestersList) && semestersList.length > 0) {
        
        // 1. رسم الفصول الأساسية (semester > 0)
        semestersList.forEach(sem => {
            if (sem.semester === 0) return;

            const block = document.createElement("div");
            block.className = "semester-block";

            let semHours = 0;
            let rowsHTML = '';

            if (Array.isArray(sem.courses)) {
                sem.courses.forEach(course => {
                    const [title, credits, lec, lab, prereqs] = course;
                    const prereqText = (Array.isArray(prereqs) && prereqs.length > 0) ? prereqs.join(', ') : '-';
                    const creditsNum = parseInt(credits, 10) || 0;
                    semHours += creditsNum;

                    rowsHTML += `
                        <tr>
                            <td class="course-name-td">${title}</td>
                            <td class="badge-td"><span class="badge-pill">${credits}</span></td>
                            <td>${lec}</td>
                            <td>${lab}</td>
                            <td class="prereq-td">${prereqText}</td>
                        </tr>
                    `;
                });
            }

            totalPlanHours += semHours;

            block.innerHTML = `
                <div class="semester-title-bar">
                    <h3>الفصل الدراسي ${sem.semester}</h3>
                    <span class="semester-hours-tag">مجموع الساعات: ${semHours}</span>
                </div>
                <div class="course-table-wrapper">
                    <table class="modern-course-table">
                        <thead>
                            <tr>
                                <th>المادة</th>
                                <th>ساعات</th>
                                <th>نظري</th>
                                <th>عملي</th>
                                <th>المتطلب</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHTML}</tbody>
                    </table>
                </div>
            `;
            container.appendChild(block);
        });

        // 2. رسم المواد الاختيارية (semester === 0)
        const optionalSem = semestersList.find(s => s.semester === 0);
        if (optionalSem && optionalSem.courses && optionalSem.courses.length > 0) {
            
            const optionalBlock = document.createElement("div");
            optionalBlock.className = "semester-block optional-block";

            let optionalRows = '';
            optionalSem.courses.forEach(course => {
                const [title, credits, lec, lab, prereqs] = course;
                const prereqText = (Array.isArray(prereqs) && prereqs.length > 0) ? prereqs.join(', ') : '-';

                optionalRows += `
                    <tr>
                        <td class="course-name-td">${title}</td>
                        <td class="badge-td"><span class="badge-pill">${credits}</span></td>
                        <td>${lec}</td>
                        <td>${lab}</td>
                        <td class="prereq-td">${prereqText}</td>
                    </tr>
                `;
            });

            optionalBlock.innerHTML = `
                <div class="semester-title-bar optional-header">
                    <h3>المواد الاختيارية (Electives) 🎯</h3>
                </div>
                <div class="course-table-wrapper">
                    <table class="modern-course-table">
                        <thead>
                            <tr>
                                <th>المادة</th>
                                <th>ساعات</th>
                                <th>نظري</th>
                                <th>عملي</th>
                                <th>المتطلب</th>
                            </tr>
                        </thead>
                        <tbody>${optionalRows}</tbody>
                    </table>
                </div>
            `;
            container.appendChild(optionalBlock);
        }

    } else {
        container.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-light);">الخطة غير متوفرة حالياً.</div>`;
    }

    document.getElementById('total-hours-val').textContent = `${totalPlanHours} ساعة`;
}