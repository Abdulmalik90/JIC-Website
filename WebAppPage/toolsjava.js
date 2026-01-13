document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('.tab-item');
    const views = document.querySelectorAll('.tool-view');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 1. تغيير الـ Tab النشط
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 2. إظهار المحتوى المناسب
            const target = tab.getAttribute('data-target');
            views.forEach(view => {
                view.classList.remove('active');
                if (view.id === `${target}-tool`) {
                    view.classList.add('active');
                }
            });
        });
    });
});

document.getElementById("result-button").addEventListener("click", () => {
    let inputField = document.getElementById("lectures-count-input");
    let classPerWeek = Number(inputField.value);
    let resultContainer = document.getElementById("abs-result-container");

    if (!classPerWeek || classPerWeek <= 0) {
        alert("عذراً، يرجى إدخال عدد الساعات بشكل صحيح");
        return;
    }

    // المعادلة حقتك (15 أسبوع، 20%)
    let totalAbs = classPerWeek * 15 * 0.20;
    let allowedAbs = Math.floor(totalAbs);

    // إذا كانت النسبة بالضبط عدد صحيح، ننقص واحد للمسموح حسب منطقك
    if (totalAbs === allowedAbs && totalAbs > 0) {
        allowedAbs -= 1;
    }

    // عرض النتائج في الـ UI
    document.getElementById("allowed-abs-val").innerText = allowedAbs;
    document.getElementById("notallowed-abs-val").innerText = Math.ceil(totalAbs);

    // إظهار القسم مع تأثير
    resultContainer.style.display = "grid";
});
let subjectCount = 1;

// دالة إضافة مادة جديدة
document.getElementById('add-sub-button').addEventListener('click', () => {
    const container = document.getElementById('gpa-current-info');
    const newRow = document.createElement('div');
    newRow.className = `subject-card row-${subjectCount}`;
    newRow.innerHTML = `
        <div class="sub-header">
            <span class="sub-number">مادة ${subjectCount + 1}</span>
            <button class="remove-sub" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
        <div class="sub-body-grid">
            <input id="subName-input${subjectCount}" type="text" placeholder="اسم المادة" class="full-width">
            <input id="cridet-input${subjectCount}" type="number" placeholder="الساعات">
            <select id="grad-select${subjectCount}">
                <option value="" disabled selected>التقدير</option>
                <option value="4.00">A+</option>
                <option value="3.75">A</option>
                <option value="3.50">B+</option>
                <option value="3.00">B</option>
                <option value="2.50">C+</option>
                <option value="2.00">C</option>
                <option value="1.50">D+</option>
                <option value="1.00">D</option>
                <option value="0.00">F</option>
            </select>
        </div>
    `;
    container.appendChild(newRow);
    subjectCount++;
});

// دالة حساب المعدل (مع التنبيهات الجديدة)
document.getElementById('show-gpa-button').addEventListener('click', () => {
    let oldHours = parseFloat(document.getElementById('hours-input').value) || 0;
    let oldGpa = parseFloat(document.getElementById('gpa-input').value) || 0;
    
    // تحقق بسيط من المعدل السابق
    if (oldGpa > 4.00) {
        showAlert('تنبيه', 'المعدل التراكمي السابق لا يمكن أن يتجاوز 4.00!', '⚠️');
        return;
    }

    let currentPoints = 0;
    let currentHours = 0;

    // ملاحظة: تأكد أن المتغير subjectCount معرف عندك في الكود العام
    for (let i = 0; i < subjectCount; i++) {
        // استخدمت نفس أسماء الآيديز اللي في كودك (cridet-input)
        let creditInput = document.getElementById(`cridet-input${i}`);
        let gradeSelect = document.getElementById(`grad-select${i}`);

        if (creditInput && gradeSelect && gradeSelect.value !== "") {
            let hours = parseFloat(creditInput.value);
            let weight = parseFloat(gradeSelect.value);
            
            // التحقق من صحة المدخلات داخل اللوب
            if (!isNaN(hours) && hours > 0) {
                currentHours += hours;
                currentPoints += (hours * weight);
            }
        }
    }

    if (currentHours === 0) {
        // هنا استبدلنا الـ alert بالتنبيه الجديد
        showAlert('بيانات ناقصة', 'لطفاً أدخل ساعات ودرجات المواد الحالية.', '✍️');
        return;
    }

    let semesterGpa = currentPoints / currentHours;
    let totalPoints = (oldGpa * oldHours) + currentPoints;
    let totalHours = oldHours + currentHours;
    let cumulativeGpa = totalPoints / totalHours;

    // تصحيح الأرقام لو تجاوزت 4 بالخطأ الحسابي
    if (cumulativeGpa > 4.00) cumulativeGpa = 4.00;
    if (semesterGpa > 4.00) semesterGpa = 4.00;

    // عرض النتائج
    document.getElementById('semester-gpa-val').innerText = semesterGpa.toFixed(2);
    document.getElementById('new-total-gpa-val').innerText = cumulativeGpa.toFixed(2);
    
    const resultCard = document.getElementById('gpa-result-card');
    resultCard.style.display = 'block';
    
    // سكرول ناعم للنتيجة عشان يشوفها المستخدم
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

function calculateWeight() {
    const studentMark = parseFloat(document.getElementById('studentMark').value);
    const examTotal = parseFloat(document.getElementById('examTotal').value);
    const realWeight = parseFloat(document.getElementById('realWeight').value);

    // 1. التحقق من المدخلات (استبدال alert بـ showAlert)
    if (isNaN(studentMark) || isNaN(examTotal) || isNaN(realWeight)) {
        // التنبيه الجديد
        showAlert('بيانات ناقصة', 'تأكد انك عبيت كل الخانات بالأرقام.', '✍️');
        return;
    }

    // 2. التحقق من الصفر
    if (examTotal === 0) {
        // التنبيه الجديد
        showAlert('خطأ رياضي', 'الدرجة الكلية للاختبار مستحيل تكون صفر.', '➗');
        return;
    }

    // 3. التحقق المنطقي (إضافة اختيارية)
    if (studentMark > examTotal) {
        showAlert('خطأ في القيم', `درجتك (${studentMark}) ما يصير تكون أعلى من درجة الاختبار (${examTotal}).`, '❌');
        return;
    }

    // المعادلة: (الدرجة / المجموع) * الوزن
    let result = (studentMark / examTotal) * realWeight;
    
    // إظهار النتيجة (نفس كودك القديم)
    const resultCard = document.getElementById('resultCard');
    const finalResult = document.getElementById('finalResult');
    const weightTotalVal = document.getElementById('weightTotalVal');

    finalResult.innerText = result.toFixed(2);
    weightTotalVal.innerText = realWeight;
    
    resultCard.style.display = 'flex';
    
    // حركة انيميشن بسيطة عند الظهور
    resultCard.style.animation = 'slideUp 0.4s ease';
}

/* =========================================
   برمجة أداة حساب الدرجات + التنبيهات المخصصة
   ========================================= */

const assessmentTypes = [
    "HW 1", "HW 2", "Quiz 1", "Quiz 2", 
    "Midterm", "Project", "Lab", "Final", "أخرى/تعديل"
];

let savedCourses = JSON.parse(localStorage.getItem('my_grades_list')) || [];
let currentResult = { score: 0, max: 0, percent: 0, grade: '-' };

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('course-calc-card')) {
        addRow(); addRow(); addRow();
        
        document.getElementById('add-row-btn').addEventListener('click', addRow);
        document.getElementById('calculate-btn').addEventListener('click', calculateResult);
        document.getElementById('save-result-btn').addEventListener('click', saveCourseToStorage);
        document.getElementById('clear-all-btn').addEventListener('click', clearAllCourses);
        
        renderSavedCourses();
    }
});

/* =========================================
   🔥 دوال التنبيهات الجديدة (Popup System)
   ========================================= */

// دالة إظهار رسالة تنبيه عادية (بديل alert)
document.addEventListener('DOMContentLoaded', () => {

    window.showAlert = function (title, message, icon = '🔔') {
        const overlay = document.getElementById('custom-popup-overlay3');
        const cancelBtn = document.getElementById('popup-cancel-btn3');
        const confirmBtn = document.getElementById('popup-confirm-btn3');

        if (!overlay || !confirmBtn) return;

        document.getElementById('popup-icon3').textContent = icon;
        document.getElementById('popup-title3').textContent = title;
        document.getElementById('popup-message3').textContent = message;

        cancelBtn.style.display = 'none';
        confirmBtn.textContent = 'موافق';
        confirmBtn.onclick = closePopup;

        overlay.classList.add('active');
    };

    window.closePopup = function () {
        document.getElementById('custom-popup-overlay3')?.classList.remove('active');
    };

});

/* =========================================
   باقي دوال التطبيق (محدثة لتستخدم التنبيهات)
   ========================================= */

function addRow() {
    const container = document.getElementById('rows-container');
    const row = document.createElement('div');
    row.className = 'grade-row';
    
    let options = `<option value="" disabled selected>نوع التقييم</option>`;
    assessmentTypes.forEach(type => options += `<option value="${type}">${type}</option>`);

    row.innerHTML = `
        <button class="delete-btn" onclick="removeRow(this)">×</button>
        <div class="row-top">
            <div style="width:100%"><select class="assess-type" onchange="handleTypeChange(this)">${options}</select></div>
        </div>
        <div class="row-bottom">
            <div style="flex:1"><input type="number" class="student-score" placeholder="درجتك" min="0"></div>
            <div style="flex:1"><input type="number" class="total-weight" placeholder="من كم؟" min="0"></div>
        </div>
    `;
    container.appendChild(row);
}

function removeRow(btn) {
    const rows = document.querySelectorAll('.grade-row');
    if (rows.length > 1) {
        btn.parentElement.remove();
    } else {
        // استبدال alert بـ showAlert
        showAlert('تنبيه', 'لازم يكون فيه صف واحد على الأقل!', '🚫');
    }
}

function handleTypeChange(selectElem) {
    if (selectElem.value === "أخرى/تعديل") {
        const input = document.createElement('input');
        input.type = 'text'; input.placeholder = 'اسم التقييم...';
        input.className = 'custom-input-title'; 
        selectElem.replaceWith(input);
        input.focus();
    }
}

function calculateResult() {
    const rows = document.querySelectorAll('.grade-row');
    let totalScore = 0; let totalMax = 0;
    let isValid = true; let hasData = false;

    document.querySelectorAll('.grade-row input').forEach(inp => inp.classList.remove('input-error'));

    // استخدام for loop عشان نقدر نسوي return ونوقف الدالة
    for (const row of rows) {
        const scoreInput = row.querySelector('.student-score');
        const weightInput = row.querySelector('.total-weight');
        if (!scoreInput.value && !weightInput.value) continue;

        const score = parseFloat(scoreInput.value);
        const max = parseFloat(weightInput.value);

        if (isNaN(score) || isNaN(max)) { isValid = false; break; }

        if (score > max) {
            scoreInput.classList.add('input-error');
            // استبدال alert بـ showAlert
            showAlert('خطأ في القيم', `درجتك (${score}) أعلى من الدرجة الكلية (${max})!`, '❌');
            isValid = false; 
            return; // خروج مباشر
        }
        totalScore += score; totalMax += max; hasData = true;
    }

    if (!isValid || !hasData) return; // لا تظهر رسالة هنا عشان ما تزعج المستخدم إذا بس الخانات فاضية

    if (totalMax > 100) {
        // استبدال alert بـ showAlert
        showAlert('تجاوز الحد', `مجموع الأوزان (${totalMax}) تجاوز 100!`, '⚠️');
        return;
    }

    const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
    const grade = getGradeLetter(percentage);
    
    document.querySelector('.grade-res-card').style.background = getGradeColor(grade);
    document.getElementById('final-result').style.display = 'flex';
    document.getElementById('save-result-btn').style.display = 'block';
    
    document.getElementById('total-score-display').textContent = `${totalScore} / ${totalMax}`;
    document.getElementById('total-percentage-display').textContent = `${percentage.toFixed(2)}%`;
    document.getElementById('final-grade-display').textContent = grade;
    
    document.getElementById('final-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    currentResult = { score: totalScore, max: totalMax, percent: percentage, grade: grade };
}

function saveCourseToStorage() {
    const nameInput = document.getElementById('course-name');
    const courseName = nameInput.value.trim() || `مادة (${savedCourses.length + 1})`;

    const newCourse = {
        id: Date.now(), name: courseName, ...currentResult, color: getGradeColor(currentResult.grade)
    };

    savedCourses.unshift(newCourse);
    localStorage.setItem('my_grades_list', JSON.stringify(savedCourses));
    renderSavedCourses();
    
    // تأكيد الحفظ بستايل جديد
    showAlert('تم الحفظ', 'تمت إضافة المادة إلى السجل بنجاح.', '✅');
    document.getElementById('saved-courses-section').scrollIntoView({ behavior: 'smooth' });
}

function renderSavedCourses() {
    const container = document.getElementById('saved-list-container');
    const section = document.getElementById('saved-courses-section');
    container.innerHTML = '';
    
    if (savedCourses.length === 0) { section.style.display = 'none'; return; }
    section.style.display = 'block';

    savedCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'saved-card';
        card.style.setProperty('--grade-color', course.color);
        card.innerHTML = `
            <button class="del-saved-btn" onclick="deleteSavedCourse(${course.id})">🗑️</button>
            <div class="saved-info"><h4>${course.name}</h4><p>${course.score} / ${course.max}</p></div>
            <div class="saved-grade"><span class="letter">${course.grade}</span><span class="percent">%${course.percent.toFixed(1)}</span></div>
        `;
        container.appendChild(card);
    });
}

// دالة الحذف (تستخدم showConfirm)
function deleteSavedCourse(id) {
    showConfirm('حذف مادة', 'هل أنت متأكد من حذف هذه المادة من السجل؟', () => {
        // هذا الكود يتنفذ فقط اذا ضغط "نعم"
        savedCourses = savedCourses.filter(c => c.id !== id);
        localStorage.setItem('my_grades_list', JSON.stringify(savedCourses));
        renderSavedCourses();
    }, '🗑️');
}

// دالة حذف الكل (تستخدم showConfirm)
function clearAllCourses() {
    showConfirm('حذف السجل', 'هل أنت متأكد من حذف جميع المواد المحفوظة؟ لا يمكن التراجع.', () => {
        savedCourses = [];
        localStorage.removeItem('my_grades_list');
        renderSavedCourses();
        showAlert('تم الحذف', 'تم تنظيف السجل بالكامل.', '🧹');
    }, '⚠️');
}

function getGradeLetter(p) {
    if (p >= 95) return 'A+'; if (p >= 90) return 'A'; if (p >= 85) return 'B+'; if (p >= 80) return 'B';
    if (p >= 75) return 'C+'; if (p >= 70) return 'C'; if (p >= 65) return 'D+'; if (p >= 60) return 'D'; return 'F';
}
function getGradeColor(grade) {
    switch(grade) {
        case 'A+': case 'A': return '#198754'; case 'B+': case 'B': return '#85c226';
        case 'C+': case 'C': return '#ffc107'; case 'D+': case 'D': return '#fd7e14';
        case 'F': return '#dc3545'; default: return 'var(--primary-color)';
    }
}

// الستارة للصيانة

    // ==========================================
    // ⚙️ إعدادات الصيانة الطارئة
    // ==========================================
    
    // 1. تبي تقفل الصفحة؟ حط true .. تبي تفتحها؟ حط false
    const IS_MAINTENANCE_MODE = false; 

    // 2. رسالة التنبيه اللي بتظهر للطلاب
    const MAINTENANCE_MSG = {
        title: "الادوات تحت الصيانة ",
        desc: "جالسين نضبط كم شغلة ونرجع لكم أفضل من أول!",
        btnText: "الرجوع للرئيسية"
    };

    // ==========================================
    // 🛑 لا تعدل شي تحت هذا الخط
    // ==========================================
    
    (function() {
        // حيلة سرية لك: لو كتبت في الرابط ?admin=1 بيفتح لك الصفحة عشان تشتغل عليها
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === '1') return;

        if (IS_MAINTENANCE_MODE) {
            // 1. تجميد الصفحة (عشان ما يقدر يسوي سكرول)
            document.body.style.overflow = "hidden";
            
            // 2. إنشاء الستارة
            const overlay = document.createElement('div');
            overlay.id = "maintenance-curtain";
            
            // 3. ستايل الستارة (CSS داخل JS)
            overlay.style.cssText = `
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: #ffffff;
                z-index: 99; /* أعلى طبقة ممكنة */
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                font-family: inherit;
                color: #333;
            `;

            // 4. محتوى الصفحة
            overlay.innerHTML = `
                <div style="padding: 20px; max-width: 500px;">
                    <div style="font-size: 60px; margin-bottom: 20px;">⚙️</div>
                    <h2 style="margin-bottom: 10px; font-size: 24px;">${MAINTENANCE_MSG.title}</h2>
                    <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">${MAINTENANCE_MSG.desc}</p>
                    
                    <a href="index.html" style="
                        background: linear-gradient(90deg, #103191, #106091);
                        color: white; 
                        text-decoration: none; 
                        padding: 12px 25px; 
                        border-radius: 13px; 
                        font-weight: bold;
                        display: inline-block;
                        transition: 0.2s;
                    ">${MAINTENANCE_MSG.btnText}</a>
                </div>
            `;

            // 5. إضافة الستارة للصفحة
            document.body.appendChild(overlay);
        }
    })();