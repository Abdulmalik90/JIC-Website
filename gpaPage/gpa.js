
// add more inputs for subjects grades
const SubjectNameDiv = document.getElementById("sub-name-part")
const hoursDiv = document.getElementById("hours-part")
const gradesDiv = document.getElementById("grade-part")
let numberOfSub = 1
document.getElementById("add-sub-button").addEventListener("click", function() {

    // adding the input of the name of the subject
    const newSubjectName = document.createElement("input")
    newSubjectName.id = `subName-input${numberOfSub}`
    newSubjectName.style = "border-radius: 10px 10px 10px 10px;"
    newSubjectName.setAttribute("required", "")
    newSubjectName.type = "text"
    newSubjectName.placeholder = "رياضيات"
    SubjectNameDiv.appendChild(newSubjectName)

    // adding the input of the credit of the subject
    const newCredit = document.createElement("input")
    newCredit.id = `cridet-input${numberOfSub}`
    newCredit.style = "border-radius: 10px;"
    newCredit.setAttribute("required", "")
    newCredit.type = "number"
    newCredit.placeholder = "الكريدت"
    newCredit.max = "10"
    newCredit.min = "0"
    hoursDiv.appendChild(newCredit)

    // adding the selector for grades
    const grades = ["اضغط هنا", "A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"]
    const newSelector = document.createElement("select")
    newSelector.id = `grad-select${numberOfSub}`
    for(let i = 0; i < grades.length; i++){
        let newOption = document.createElement("option")
        newOption.textContent = grades[i]
        if(i == 0) {
            newOption.setAttribute("disabled", "")
            newOption.setAttribute("selected", "")
        }
        newSelector.appendChild(newOption)
    }
    newSelector.style = "min-width:200px; height:28px; border-radius:20px 10px 10px 10px;"
    newSelector.setAttribute("required", "")
    gradesDiv.appendChild(newSelector)
    numberOfSub++
})







// showing the GPA
document.getElementById("show-gpa-button").addEventListener("click", (e) => {
    e.preventDefault();

    // Semester GPA
    let subjectsGrades = []
    let subjectCount = SubjectNameDiv.querySelectorAll('input').length;
    let totalHours = 0;
    let isValid = true;

    for(let i = 0; i < subjectCount; i++){
        let tempHours = parseFloat(document.getElementById(`cridet-input${i}`).value) || 0;
        let tempGrade = document.getElementById(`grad-select${i}`).value;

        if(isNaN(tempHours)) {
            alert(`الرجاء إدخال ساعات صحيحة للمادة ${i+1}`);
            isValid = false;
            break;
        }
        
        if(!tempGrade) {
            alert(`الرجاء اختيار درجة للمادة ${i+1}`);
            isValid = false;
            break;
        }
        totalHours += tempHours

        let gradePoint;
        switch(tempGrade){
            case 'A+': gradePoint = 4.0; break;
            case 'A': gradePoint = 3.75; break;
            case "B+": gradePoint = 3.5; break;
            case "B": gradePoint = 3.0; break;
            case "C+": gradePoint = 2.5; break;
            case "C": gradePoint = 2.0; break;
            case "D+": gradePoint = 1.5; break;
            case "D": gradePoint = 1.0; break;
            case "F": gradePoint = 0.0; break;
            default: gradePoint = 0.0
        }
        subjectsGrades.push(gradePoint * tempHours)
    }

    if(!isValid) return;

    let totalPoints = subjectsGrades.reduce((sum, grade) => sum + grade, 0);
    let semesterGPA = totalPoints / totalHours;

    // Total GPA
    let oldHours = parseFloat(document.getElementById("hours-input").value) || 0;
    let oldGrade = parseFloat(document.getElementById("gpa-input").value) || 0;
    let totalGPA = (oldHours + totalHours) > 0 
        ? ((oldGrade * oldHours) + (semesterGPA * totalHours)) / (oldHours + totalHours): 0;

    document.getElementById("new-total-gpa").value = totalGPA.toFixed(2)
    document.getElementById("semester-gpa").value = semesterGPA.toFixed(2)


})