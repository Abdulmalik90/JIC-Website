document.addEventListener("DOMContentLoaded", () => {
    const toolsMainMenu = document.getElementById('toolsMainMenu');
    const toolActiveContainer = document.getElementById('toolActiveContainer');
    const toolCards = document.querySelectorAll('.tool-menu-card:not(.external)');
    const toolViews = document.querySelectorAll('.tool-view');
    const backBtn = document.getElementById('backToToolsBtn');
    const activeToolTitle = document.getElementById('activeToolTitle');

    // عند الضغط على بطاقة أداة
    toolCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetId = card.getAttribute('data-target');
            const title = card.querySelector('h3').innerText;

            toolsMainMenu.style.display = 'none';
            toolActiveContainer.style.display = 'block';
            activeToolTitle.innerText = title;

            toolViews.forEach(view => {
                view.classList.remove('active');
                if (view.id === `${targetId}-tool`) {
                    view.classList.add('active');
                }
            });
             window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // عند الضغط على زر الرجوع
    if(backBtn) {
        backBtn.addEventListener('click', () => {
            toolActiveContainer.style.display = 'none';
            toolsMainMenu.style.display = 'block';
             toolViews.forEach(view => {
                view.classList.remove('active');
            });
             window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

/* =========================================
   حاسبة الغياب
   ========================================= */
const resultBtn = document.getElementById("result-button");
if (resultBtn) {
    resultBtn.addEventListener("click", () => {
        let inputField = document.getElementById("lectures-count-input");
        let classPerWeek = Number(inputField.value);
        let resultContainer = document.getElementById("abs-result-container");
        let advancedTracker = document.getElementById("advanced-tracker"); 

        if (!classPerWeek || classPerWeek <= 0) {
            showAlert("خطأ إدخال", "عذراً، يرجى إدخال عدد الساعات بشكل صحيح", "⚠️");
            return;
        }

        function parseArabicNumbers(val) {
            if (!val) return 0;
            let englishNumbers = String(val).replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
            return Number(englishNumbers) || 0;
        }

        let totalClassesSemester = classPerWeek * 16; 
        let exactDNThreshold = Number((totalClassesSemester * 0.20).toFixed(1)); 
        let safeAllowedAbs = Math.floor(exactDNThreshold);
        
        document.getElementById("allowed-abs-val").innerText = safeAllowedAbs;
        document.getElementById("notallowed-abs-val").innerText = "+" + safeAllowedAbs;
        
        let singleAbsPercent = (1 / totalClassesSemester) * 100;
        document.getElementById("single-abs-percent").innerText = singleAbsPercent.toFixed(1);

        resultContainer.style.display = "grid";
        advancedTracker.style.display = "block"; 

        const currentAbsInput = document.getElementById("current-abs");
        const currentLateInput = document.getElementById("current-late");
        const progressFill = document.getElementById("dn-progress-fill");
        const progressText = document.getElementById("progress-text");
        const progressPercentText = document.getElementById("progress-percent");

        function updateAdvancedTracker() {
            let absHours = parseArabicNumbers(currentAbsInput.value);
            let lateCount = parseArabicNumbers(currentLateInput.value);

            let lateToAbsHours = Math.floor(lateCount / 3); 
            let totalCurrentAbs = absHours + lateToAbsHours;
            let displayRemaining = safeAllowedAbs - totalCurrentAbs; 

            let actualAbsencePercent = (totalCurrentAbs / totalClassesSemester) * 100;
            let visualBarFill = (totalCurrentAbs / exactDNThreshold) * 100;
            if (visualBarFill > 100) visualBarFill = 100;

            if (displayRemaining > 0) {
                progressText.innerText = `باقي لك ${displayRemaining} ساعات وتدخل في الحرمان`;
                progressText.style.color = "#334155";
            } else if (displayRemaining === 0) {
                progressText.innerText = `⚠️ انتبه تغيب الحرمان قريب`;
                progressText.style.color = "#ea580c"; 
            } else {
                progressText.innerText = `🚨 حرمان DN`;
                progressText.style.color = "#ef4444";
            }

            progressPercentText.innerHTML = `${Number(actualAbsencePercent.toFixed(1))}% <span>/ 20%</span>`;
            progressFill.style.width = `${visualBarFill}%`;

            if (visualBarFill < 50) progressFill.style.background = "#22c55e"; 
            else if (visualBarFill >= 50 && visualBarFill < 99) progressFill.style.background = "#eab308"; 
            else progressFill.style.background = "#ef4444"; 
        }

        currentAbsInput.addEventListener("input", updateAdvancedTracker);
        currentLateInput.addEventListener("input", updateAdvancedTracker);
        updateAdvancedTracker();
    });
}

/* =========================================
   حاسبة المعدل
   ========================================= */
let subjectCount = 1;
const addSubBtn = document.getElementById('add-sub-button');
if(addSubBtn) {
    addSubBtn.addEventListener('click', () => {
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
                    <option value="4.00">A+</option><option value="3.75">A</option><option value="3.50">B+</option>
                    <option value="3.00">B</option><option value="2.50">C+</option><option value="2.00">C</option>
                    <option value="1.50">D+</option><option value="1.00">D</option><option value="0.00">F</option>
                </select>
            </div>
        `;
        container.appendChild(newRow);
        subjectCount++;
    });
}

const showGpaBtn = document.getElementById('show-gpa-button');
if(showGpaBtn) {
    showGpaBtn.addEventListener('click', () => {
        let oldHours = parseFloat(document.getElementById('hours-input').value) || 0;
        let oldGpa = parseFloat(document.getElementById('gpa-input').value) || 0;
        
        if (oldGpa > 4.00) {
            showAlert('تنبيه', 'المعدل التراكمي السابق لا يمكن أن يتجاوز 4.00!', '⚠️');
            return;
        }

        let currentPoints = 0; let currentHours = 0;

        for (let i = 0; i < subjectCount; i++) {
            let creditInput = document.getElementById(`cridet-input${i}`);
            let gradeSelect = document.getElementById(`grad-select${i}`);

            if (creditInput && gradeSelect && gradeSelect.value !== "") {
                let hours = parseFloat(creditInput.value);
                let weight = parseFloat(gradeSelect.value);
                if (!isNaN(hours) && hours > 0) {
                    currentHours += hours;
                    currentPoints += (hours * weight);
                }
            }
        }

        if (currentHours === 0) {
            showAlert('بيانات ناقصة', 'لطفاً أدخل ساعات ودرجات المواد الحالية.', '✍️');
            return;
        }

        let semesterGpa = currentPoints / currentHours;
        let totalPoints = (oldGpa * oldHours) + currentPoints;
        let totalHours = oldHours + currentHours;
        let cumulativeGpa = totalPoints / totalHours;

        if (cumulativeGpa > 4.00) cumulativeGpa = 4.00;
        if (semesterGpa > 4.00) semesterGpa = 4.00;

        document.getElementById('semester-gpa-val').innerText = semesterGpa.toFixed(2);
        document.getElementById('new-total-gpa-val').innerText = cumulativeGpa.toFixed(2);
        
        const resultCard = document.getElementById('gpa-result-card');
        resultCard.style.display = 'block';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

/* =========================================
   الوزن النسبي (جزء من أداة الدرجات)
   ========================================= */
function calculateWeight() {
    const studentMark = parseFloat(document.getElementById('studentMark').value);
    const examTotal = parseFloat(document.getElementById('examTotal').value);
    const realWeight = parseFloat(document.getElementById('realWeight').value);

    if (isNaN(studentMark) || isNaN(examTotal) || isNaN(realWeight)) {
        showAlert('بيانات ناقصة', 'تأكد انك عبيت كل الخانات بالأرقام.', '✍️'); return;
    }
    if (examTotal === 0) {
        showAlert('خطأ رياضي', 'الدرجة الكلية للاختبار مستحيل تكون صفر.', '➗'); return;
    }
    if (studentMark > examTotal) {
        showAlert('خطأ في القيم', `درجتك (${studentMark}) ما يصير تكون أعلى من درجة الاختبار (${examTotal}).`, '❌'); return;
    }

    let result = (studentMark / examTotal) * realWeight;
    
    document.getElementById('finalResult').innerText = result.toFixed(2);
    document.getElementById('weightTotalVal').innerText = realWeight;
    const resultCard = document.getElementById('resultCard');
    resultCard.style.display = 'flex';
    resultCard.style.animation = 'slideUp 0.4s ease';
}

/* =========================================
   أداة حساب درجات المادة (المشكلة التي تم حلها)
   ========================================= */
const assessmentTypes = ["HW 1", "HW 2", "Quiz 1", "Quiz 2", "Midterm", "Project", "Lab", "Final", "أخرى/تعديل"];
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

/* --- دوال التنبيهات (Popup System) والتوكيد (Confirm) --- */
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

window.showConfirm = function(title, message, onConfirm, icon = '❓') {
    const overlay = document.getElementById('custom-popup-overlay3');
    const cancelBtn = document.getElementById('popup-cancel-btn3');
    const confirmBtn = document.getElementById('popup-confirm-btn3');
    if (!overlay || !confirmBtn) return;

    document.getElementById('popup-icon3').textContent = icon;
    document.getElementById('popup-title3').textContent = title;
    document.getElementById('popup-message3').textContent = message;
    
    cancelBtn.style.display = 'block';
    cancelBtn.textContent = 'إلغاء';
    cancelBtn.onclick = closePopup;
    
    confirmBtn.textContent = 'نعم، أوافق';
    confirmBtn.onclick = () => { onConfirm(); closePopup(); };
    overlay.classList.add('active');
};

window.closePopup = function () {
    document.getElementById('custom-popup-overlay3')?.classList.remove('active');
};

/* --- دوال صفوف الدرجات --- */
function addRow() {
    const container = document.getElementById('rows-container');
    const row = document.createElement('div');
    row.className = 'grade-row';
    let options = `<option value="" disabled selected>نوع التقييم</option>`;
    assessmentTypes.forEach(type => options += `<option value="${type}">${type}</option>`);

    row.innerHTML = `
        <button class="delete-btn" onclick="removeRow(this)">×</button>
        <div class="row-top"><div style="width:100%"><select class="assess-type" onchange="handleTypeChange(this)">${options}</select></div></div>
        <div class="row-bottom">
            <div style="flex:1"><input type="number" class="student-score" placeholder="درجتك" min="0"></div>
            <div style="flex:1"><input type="number" class="total-weight" placeholder="من كم؟" min="0"></div>
        </div>
    `;
    container.appendChild(row);
}

/* --- دوال صفوف الدرجات (محدثة لحل التداخل) --- */

function removeRow(btn) {
    // التعديل هنا: البحث داخل حاوية الدرجات فقط
    const container = document.getElementById('rows-container');
    if (!container) return;
    
    const rows = container.querySelectorAll('.grade-row');
    if (rows.length > 1) {
        btn.parentElement.remove();
    } else {
        showAlert('تنبيه', 'لازم يكون فيه صف واحد على الأقل!', '🚫');
    }
}

function calculateResult() {
    // التعديل هنا: قصر البحث على حاوية الدرجات لمنع التداخل مع منشئ الجداول
    const container = document.getElementById('rows-container');
    if (!container) return;
    
    const rows = container.querySelectorAll('.grade-row');
    let totalScore = 0; let totalMax = 0;
    let isValid = true; let hasData = false;

    container.querySelectorAll('input').forEach(inp => inp.classList.remove('input-error'));

    for (const row of rows) {
        const scoreInput = row.querySelector('.student-score');
        const weightInput = row.querySelector('.total-weight');
        
        // التحقق من وجود الحقول فعلياً لتجنب خطأ null
        if (!scoreInput || !weightInput) continue;
        
        if (!scoreInput.value && !weightInput.value) continue;

        const score = parseFloat(scoreInput.value);
        const max = parseFloat(weightInput.value);

        if (isNaN(score) || isNaN(max)) { isValid = false; break; }

        if (score > max) {
            scoreInput.classList.add('input-error');
            showAlert('خطأ في القيم', `درجتك (${score}) أعلى من الدرجة الكلية (${max})!`, '❌');
            isValid = false; return;
        }
        totalScore += score; totalMax += max; hasData = true;
    }

    if (!isValid || !hasData) return;

    if (totalMax > 100) {
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

    const newCourse = { id: Date.now(), name: courseName, ...currentResult, color: getGradeColor(currentResult.grade) };

    savedCourses.unshift(newCourse);
    localStorage.setItem('my_grades_list', JSON.stringify(savedCourses));
    renderSavedCourses();
    
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

window.deleteSavedCourse = function(id) {
    showConfirm('حذف مادة', 'هل أنت متأكد من حذف هذه المادة من السجل؟', () => {
        savedCourses = savedCourses.filter(c => c.id !== id);
        localStorage.setItem('my_grades_list', JSON.stringify(savedCourses));
        renderSavedCourses();
    }, '🗑️');
};

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