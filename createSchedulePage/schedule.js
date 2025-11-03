// Modal script
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const addSubModule = document.getElementById('add-subject-button');
    const closeModalBtn = document.querySelector('#header-modal span');
    
    // Function to open modal
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    
    // Event listeners
    addSubModule.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Example actions for the buttons
    preparatoryButton.addEventListener('click', function(){
        localStorage.setItem("selectedMajor", JSON.stringify(PreparatoryYear));
        window.location.href = "../MajorPage/majorInfo.html";
    })

    diplomeButton.addEventListener('click', function() {
        window.location.href = "./JTImajors/JTImajors.html"
    });
});




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