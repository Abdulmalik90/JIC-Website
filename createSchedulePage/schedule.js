class Subjects{
    constructor(name, code, teacher, color, times){
        this.name = name;
        this.code = code;
        this.teacher = teacher;
        this.color = color;
        this.times = times;
    }

}







// add events for days checkbox
let modalPeriods = document.getElementById("modal-periods-containre");

function craetingPeriodsCheckboxs(day, arabicDay, container){   
        container.innerHTML = `
            <hr/>
            <label class="day-label form-lb">يوم ${arabicDay}:</label>

            <div class="periods-box-container">
    
                <input type="checkbox" id="${day}-1-checkbox" class="checkbox-input-period">
                <label for="${day}-1-checkbox" class="checkbox-label">1</label>

                <input type="checkbox" id="${day}-2-checkbox" class="checkbox-input-period">
                <label for="${day}-2-checkbox" class="checkbox-label">2</label>

                <input type="checkbox" id="${day}-3-checkbox" class="checkbox-input-period">
                <label for="${day}-3-checkbox" class="checkbox-label">3</label>

                <input type="checkbox" id="${day}-4-checkbox" class="checkbox-input-period">
                <label for="${day}-4-checkbox" class="checkbox-label">4</label>

                <input type="checkbox" id="${day}-5-checkbox" class="checkbox-input-period">
                <label for="${day}-5-checkbox" class="checkbox-label">5</label>

                <input type="checkbox" id="${day}-6-checkbox" class="checkbox-input-period">
                <label for="${day}-6-checkbox" class="checkbox-label">6</label>

                <input type="checkbox" id="${day}-7-checkbox" class="checkbox-input-period">
                <label for="${day}-7-checkbox" class="checkbox-label">7</label>

                <input type="checkbox" id="${day}-8-checkbox" class="checkbox-input-period">
                <label for="${day}-8-checkbox" class="checkbox-label">8</label>

                <input type="checkbox" id="${day}-9-checkbox" class="checkbox-input-period">
                <label for="${day}-9-checkbox" class="checkbox-label">9</label>

                <input type="checkbox" id="${day}-10-checkbox" class="checkbox-input-period">
                <label for="${day}-10-checkbox" class="checkbox-label">10</label>

                <input type="checkbox" id="${day}-11-checkbox" class="checkbox-input-period">
                <label for="${day}-11-checkbox" class="checkbox-label">11</label>

                <input type="checkbox" id="${day}-12-checkbox" class="checkbox-input-period">
                <label for="${day}-12-checkbox" class="checkbox-label">12</label>

                <input type="checkbox" id="${day}-13-checkbox" class="checkbox-input-period">
                <label for="${day}-13-checkbox" class="checkbox-label">13</label>
            </div>
        `
}

    // sunday
const sunDayBox = document.getElementById("sun-checkbox");
let sunPeriods = document.getElementById("periods-container-sun");
sunDayBox.addEventListener("change", ()=>{
    
    if (event.target.checked) {
        craetingPeriodsCheckboxs("sun", "الأحد", sunPeriods)
    } else {
        sunPeriods.innerHTML = ``
    }
})

    // monday
const monDayBox = document.getElementById("mon-checkbox");
let monPeriods = document.getElementById("periods-container-mon");
monDayBox.addEventListener("change", ()=>{
    
    if (event.target.checked) {
        craetingPeriodsCheckboxs("mon", "الإثنين", monPeriods)
    } else {
        monPeriods.innerHTML = ``
    }
})

    //tuesday
const tuesDayBox = document.getElementById("tues-checkbox");
let tuesPeriods = document.getElementById("periods-container-tues");
tuesDayBox.addEventListener("change", ()=>{
    
    if (event.target.checked) {
        craetingPeriodsCheckboxs("tues", "الثلاثاء", tuesPeriods)
    } else {
        tuesPeriods.innerHTML = ``
    }
})

    //wednsday
const wednDayBox = document.getElementById("wedn-checkbox");
let wednPeriods = document.getElementById("periods-container-wedn");
wednDayBox.addEventListener("change", ()=>{
    
    if (event.target.checked) {
        craetingPeriodsCheckboxs("wedn", "الأربعاء", wednPeriods)
    } else {
        wednPeriods.innerHTML = ``
    }
})


    //Thursday
const thurDayBox = document.getElementById("thur-checkbox");
let thurPeriods = document.getElementById("periods-container-thur");
thurDayBox.addEventListener("change", ()=>{
    
    if (event.target.checked) {
        craetingPeriodsCheckboxs("thur", "الخميس", thurPeriods)
    } else {
        thurPeriods.innerHTML = ``
    }
})

// adding the subject
function getCheckedPeriodsForDay(day) {
    
    const checkboxes = document.querySelectorAll(`input[id^="${day}-"][type="checkbox"]`);

    
    let checked = [];
    checkboxes.forEach(box => {
        if (box.checked) {
            // Extract the number from the ID (e.g. "sun-3-checkbox" → 3)
            const periodNumber = parseInt(box.id.split('-')[1]);
            checked.push(periodNumber);
        }
    });

    return checked;
}

function saveSubjectToLocalStorage(subject) {
    let savedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    savedSubjects.push(subject);
    localStorage.setItem("subjects", JSON.stringify(savedSubjects));
}

function displaySubjectInTable(subject) {
    for (let day in subject.times) {
        subject.times[day].forEach(period => {
            const cellId = `${day}-${period}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                cell.style.backgroundColor = subject.color;
                cell.innerHTML = `
                    <strong>${subject.name}</strong><br>
                    <small>${subject.code}</small><br>
                    <small>${subject.teacher}</small>
                `;
            }
        });
    }
}

document.getElementById("add-button").addEventListener("click", ()=>{
    if(sunDayBox.checked || monDayBox.checked || tuesDayBox.checked || wednDayBox.checked || thurDayBox.checked){
        const modal = document.getElementById('modal');
        let subName = document.getElementById("subject-name-input");
        let subCode = document.getElementById("subject-code-input");
        let subTeacher = document.getElementById("subject-teacher-input");
        let subColor = document.getElementById("subject-color-input");

        let times = {};

        if (sunDayBox.checked) times.sun = getCheckedPeriodsForDay("sun");
        if (monDayBox.checked) times.mon = getCheckedPeriodsForDay("mon");
        if (tuesDayBox.checked) times.tues = getCheckedPeriodsForDay("tues");
        if (wednDayBox.checked) times.wedn = getCheckedPeriodsForDay("wedn");
        if (thurDayBox.checked) times.thur = getCheckedPeriodsForDay("thur");

        let subjectInfo = new Subjects(subName.value, subCode.value, subTeacher.value, subColor.value, times);
        saveSubjectToLocalStorage(subjectInfo);
        displaySubjectInTable(subjectInfo);
        
        subName.value = "";
        subCode.value = "";
        subTeacher.value = "";
        subColor.value = "";

        sunPeriods.innerHTML = ``;
        monPeriods.innerHTML = ``;
        tuesPeriods.innerHTML = ``;
        wednPeriods.innerHTML = ``;
        thurPeriods.innerHTML = ``;
        sunDayBox.checked = false;
        monDayBox.checked = false;
        tuesDayBox.checked = false;
        wednDayBox.checked = false;
        thurDayBox.checked = false;
        
        const deleteModal = document.getElementById("modal");
        deleteModal.classList.remove("active");
        deleteModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    } else {
        
        alert("يبدو لي انك ماحددت الوقت زين")
    }
})

window.addEventListener("DOMContentLoaded", () => {
    const savedSubjects = JSON.parse(localStorage.getItem("subjects")) || [];
    savedSubjects.forEach(subject => {
        displaySubjectInTable(subject);
    });
});


document.getElementById("clear-table-button").addEventListener("click", ()=>{
    localStorage.removeItem("subjects");
    document.querySelectorAll(".table-subjects").forEach(cell => {
        cell.innerHTML = "";
        cell.style.backgroundColor = "rgb(174, 174, 174)";
    });
    alert("ابشرك! انحذف الجدول بالكامل");
});


// Delete Subject Modal Logic
document.addEventListener('DOMContentLoaded', function() {
    // ========== Add Subject Modal ==========
    const modal = document.getElementById('modal');
    const addSubModule = document.getElementById('add-subject-button');
    const closeModalBtn = document.querySelector('#header-modal span');

    function openModal() {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    addSubModule.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });


    // ========== Delete Subject Modal ==========
    const deleteModal = document.getElementById("delete-modal");
    const deleteSubButton = document.getElementById("delete-subject-button");
    const closeDeleteModalBtn = document.getElementById("close-delete-modal");
    const subjectsList = document.getElementById("subjects-list");

    function openDeleteModal() {
        updateSubjectsList();
        deleteModal.classList.add("active");
        deleteModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }
    function closeDeleteModal() {
        deleteModal.classList.remove("active");
        deleteModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    }

    deleteSubButton.addEventListener("click", openDeleteModal);
    closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
    deleteModal.addEventListener("click", (e) => { 
        if (e.target === deleteModal) closeDeleteModal(); 
    });

    function updateSubjectsList() {
        subjectsList.innerHTML = "";
        const subs = JSON.parse(localStorage.getItem("subjects")) || [];
        if (subs.length === 0) {
            subjectsList.innerHTML = `<p style="text-align:center;">مافيه مواد عشان تحذفها اصلاً</p>`;
            return;
        }

        subs.forEach((subject, index) => {
            const li = document.createElement("li");
            li.className = 'subject-item';
            li.innerHTML = `
                <span><strong>${subject.name}</strong> (${subject.code || ''}) - ${subject.teacher || ''}</span>
                <button data-index="${index}" class="delete-subject-btn">حذف</button>
            `;
            subjectsList.appendChild(li);
        });

        subjectsList.querySelectorAll(".delete-subject-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = Number(e.currentTarget.getAttribute("data-index"));
                deleteSubject(idx);
            });
        });
    }

    function deleteSubject(index) {
        const subs = JSON.parse(localStorage.getItem("subjects")) || [];
        if (index < 0 || index >= subs.length) return;
        const toDelete = subs[index];
        subs.splice(index, 1);
        localStorage.setItem("subjects", JSON.stringify(subs));

        // Clear table for this subject
        for (let day in toDelete.times) {
            toDelete.times[day].forEach(period => {
                const cell = document.getElementById(`${day}-${period}`);
                if (cell) {
                    cell.innerHTML = "";
                    cell.style.backgroundColor = "rgb(174, 174, 174)";
                }
            });
        }

        updateSubjectsList();
        if (subs.length === 0) closeDeleteModal();
    }
});


// exporting the schadule

// png
document.getElementById("export-png-btn").addEventListener("click", ()=>{
    const element = document.getElementById('schedule-table-contianer');
    html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.download = 'الجدول الدراسي.png';
        link.href = canvas.toDataURL();
        link.click();
    });
})

// pdf
document.getElementById("export-pdf-btn").addEventListener("click", async () => {
    const element = document.getElementById('schedule-table-contianer');

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf; // هذه هي الطريقة الصحيحة للوصول إلى jsPDF
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('الجدول الدراسي.pdf');
});


// excel
document.getElementById("export-excel-btn").addEventListener("click", () => {
    
    const table = document.querySelector("#schedule-table");
    if (!table) {
        alert("لم يتم العثور على الجدول!");
        return;
    }

    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.table_to_sheet(table);

    
    XLSX.utils.book_append_sheet(workbook, worksheet, "الجدول الدراسي");

    
    XLSX.writeFile(workbook, "الجدول الدراسي.xlsx");
});
