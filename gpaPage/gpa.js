// 1. تعريف نظام النقاط
const gradePoints = {
    "A+": 4.00,
    "A": 3.75,
    "B+": 3.50,
    "B": 3.00,
    "C+": 2.50,
    "C": 2.00,
    "D+": 1.50,
    "D": 1.00,
    "F": 0.00
};

let numberOfSub = 1;

// ==========================================
// 1. إضافة مادة جديدة
// ==========================================
document.getElementById("add-sub-button").addEventListener("click", function() {
    const container = document.getElementById('gpa-current-info');
    const buttonDiv = document.getElementById('add-button-div');
    
    const firstRow = container.querySelector('.subject-row');
    
    if (firstRow) {
        const newRow = firstRow.cloneNode(true);
        
        const nameInput = newRow.querySelector('.name-part input');
        const hoursInput = newRow.querySelector('.hours-part input');
        const gradeSelect = newRow.querySelector('.grade-part select');

        if(nameInput) { 
            nameInput.value = ''; 
            nameInput.id = `subName-input${numberOfSub}`;
        }
        
        if(hoursInput) { 
            hoursInput.value = ''; 
            hoursInput.id = `cridet-input${numberOfSub}`; 
        }
        
        if(gradeSelect) { 
            gradeSelect.selectedIndex = 0; 
            gradeSelect.id = `grad-select${numberOfSub}`; 
        }

        container.insertBefore(newRow, buttonDiv);
        numberOfSub++;
    }
});


// ==========================================
// 2. زر حساب المعدل (مع الشروط الجديدة) 🛡️
// ==========================================
document.getElementById("show-gpa-button").addEventListener("click", (e) => {
    e.preventDefault();

    // --- (الشرط الأول) التحقق من المعدل التراكمي السابق ---
    let oldGPA = parseFloat(document.getElementById("gpa-input").value) || 0;
    
    if (oldGPA > 4.00) {
        alert("تأكد من معدلك التراكمي الحالي، لا يمكن أن يتجاوز 4.00!");
        return; // يوقف الكود هنا وما يكمل
    }
    if (oldGPA < 0) {
        alert("المعدل لا يمكن أن يكون بالسالب!");
        return;
    }

    // متغيرات الحساب
    let currentSemesterPoints = 0; 
    let currentSemesterHours = 0;  
    let isValid = true;            

    const rows = document.querySelectorAll('.subject-row');

    // اللوب على المواد
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        
        let hoursInput = row.querySelector('.hours-part input');
        let gradeSelect = row.querySelector('.grade-part select');
        
        let tempHours = parseFloat(hoursInput.value);
        let tempGrade = gradeSelect.value;

        // --- التحقق من الساعات ---
        if (isNaN(tempHours)) {
            // اذا الخانة فاضية نتجاهلها، اذا فيها كلام غير الأرقام نوقف
            if(hoursInput.value !== "") { 
                 alert(`الرجاء إدخال رقم صحيح للساعات في المادة رقم ${i + 1}`);
                 isValid = false; break;
            } else {
                continue; 
            }
        }

        // --- (الشرط الثاني) التحقق ان الساعات ما تتجاوز 10 ---
        if (tempHours > 10) {
            alert(`عدد الساعات في المادة رقم ${i + 1} كبير جداً (أكثر من 10)! تأكد من الرقم.`);
            isValid = false; 
            break; // يوقف اللوب
        }
        
        if (tempHours < 0) {
            alert(`عدد الساعات في المادة رقم ${i + 1} لا يمكن أن يكون بالسالب.`);
            isValid = false; 
            break;
        }

        // --- التحقق من الدرجة ---
        if (!tempGrade || tempGrade === "اضغط هنا" || tempGrade === "اختر") {
             alert(`الرجاء اختيار درجة للمادة رقم ${i + 1}`);
             isValid = false;
             break;
        }

        // الحسابات
        currentSemesterHours += tempHours;
        let points = gradePoints[tempGrade];
        if (points === undefined) points = 0;
        currentSemesterPoints += (points * tempHours);
    }

    if (!isValid) return; // اذا فيه أي خطأ نوقف

    // --- النتائج النهائية ---

    // 1. المعدل الفصلي
    let semesterGPA = 0;
    if (currentSemesterHours > 0) {
        semesterGPA = currentSemesterPoints / currentSemesterHours;
    }

    // 2. المعدل التراكمي
    let oldHours = parseFloat(document.getElementById("hours-input").value) || 0;
    
    let totalPointsAll = (oldGPA * oldHours) + currentSemesterPoints;
    let totalHoursAll = oldHours + currentSemesterHours;
    
    let totalGPA = 0;
    if (totalHoursAll > 0) {
        totalGPA = totalPointsAll / totalHoursAll;
    }
    
    // شرط أخير: لو المعدل الجديد تجاوز 4 (بسبب خطأ حسابي نادر) نرجعه 4
    if (totalGPA > 4.00) totalGPA = 4.00;
    if (semesterGPA > 4.00) semesterGPA = 4.00;

    // عرض النتائج
    document.getElementById("new-total-gpa").value = totalGPA.toFixed(2);
    document.getElementById("semester-gpa").value = semesterGPA.toFixed(2);
    
    document.getElementById("gpa-result").scrollIntoView({ behavior: 'smooth' });
});