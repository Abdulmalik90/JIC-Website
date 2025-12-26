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

// دالة حساب المعدل
document.getElementById('show-gpa-button').addEventListener('click', () => {
    let oldHours = parseFloat(document.getElementById('hours-input').value) || 0;
    let oldGpa = parseFloat(document.getElementById('gpa-input').value) || 0;
    
    let currentPoints = 0;
    let currentHours = 0;

    for (let i = 0; i < subjectCount; i++) {
        let creditInput = document.getElementById(`cridet-input${i}`);
        let gradeSelect = document.getElementById(`grad-select${i}`);

        if (creditInput && gradeSelect && gradeSelect.value !== "") {
            let hours = parseFloat(creditInput.value);
            let weight = parseFloat(gradeSelect.value);
            if (!isNaN(hours)) {
                currentHours += hours;
                currentPoints += (hours * weight);
            }
        }
    }

    if (currentHours === 0) {
        alert("لطفاً أدخل ساعات المواد الحالية");
        return;
    }

    let semesterGpa = currentPoints / currentHours;
    let totalPoints = (oldGpa * oldHours) + currentPoints;
    let totalHours = oldHours + currentHours;
    let cumulativeGpa = totalPoints / totalHours;

    // عرض النتائج
    document.getElementById('semester-gpa-val').innerText = semesterGpa.toFixed(2);
    document.getElementById('new-total-gpa-val').innerText = cumulativeGpa.toFixed(2);
    document.getElementById('gpa-result-card').style.display = 'block';
});

function calculateWeight() {
    const studentMark = parseFloat(document.getElementById('studentMark').value);
    const examTotal = parseFloat(document.getElementById('examTotal').value);
    const realWeight = parseFloat(document.getElementById('realWeight').value);

    // التحقق من المدخلات
    if (isNaN(studentMark) || isNaN(examTotal) || isNaN(realWeight)) {
        alert("تأكد انك عبيت كل الخانات");
        return;
    }

    if (examTotal === 0) {
        alert("الدرجة الكلية للاختبار مستحيل تكون صفر");
        return;
    }

    // المعادلة: (الدرجة / المجموع) * الوزن
    let result = (studentMark / examTotal) * realWeight;
    
    // إظهار النتيجة
    const resultCard = document.getElementById('resultCard');
    const finalResult = document.getElementById('finalResult');
    const weightTotalVal = document.getElementById('weightTotalVal');

    finalResult.innerText = result.toFixed(2);
    weightTotalVal.innerText = realWeight;
    
    resultCard.style.display = 'flex';
    
    // حركة انيميشن بسيطة عند الظهور
    resultCard.style.animation = 'slideUp 0.4s ease';
}