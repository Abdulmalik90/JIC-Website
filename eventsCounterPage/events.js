const events = [
    
    {title: "حساب المواطن", id: 1, date: "2025-11-10T00:30:00", day:"الإثنين"},
    {title: "إجازة الخريف", id: 2, date: "2025-11-21T00:00:00", day:"الجمعة"},
    {title:"نهاية إجازة الخريف", id: 3, date: "2025-11-29T00:00:00", day:"السبت"},
    {title: "حساب المواطن", id:4, date: "2025-12-10T00:30:00", day:"الأربعاء"},
    {title: "نهاية فترة طلبات التخصص وتغييره", id:5, date: "2025-12-10T23:59:59", day:"الخميس"},
    {title: "بداية الإختبارات النهائية", id: 6, date: "2025-12-21T09:00:00", day:"الأحد"},
    {title: "المكافأة الجامعية", id: 7, date: "2025-12-28T00:30:00", day:"الأحد"},
    {title: "نهاية الإختبارات النهائية", id: 8, date: "2025-12-28T14:30:00", day:"الأحد"},
    {title: "بداية إجازة بين الفصلين", id: 9, date: "2025-12-28T14:30:01", day:"الأحد"}
]

function startCountdown(targetDateStr, element) {
    const targetDate = new Date(targetDateStr);

    const timer = setInterval(() => {
        const now = new Date();
        const diff = targetDate - now;

        const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

        // Event passed more than a day ago → hide it
        if (diff < -24 * 60 * 60 * 1000) {
            clearInterval(timer);
            element.style.display = "none";
            return;
        }

        // If the event is today → show "اليوم"
        if (
            targetDate.getDate() === now.getDate() &&
            targetDate.getMonth() === now.getMonth() &&
            targetDate.getFullYear() === now.getFullYear()
        ) {
            clearInterval(timer);
            element.querySelector(".time").textContent = "اليوم";
            element.classList.add("today-event");
            return;
        }

        // Future event → show countdown
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            
            if(hours == 1){
                element.querySelector(".time").innerHTML =
                `${days} أيام : ساعة : ${minutes} دقائق : ${seconds} ثواني <br>
                ${targetDate.getFullYear()}/${targetDate.getMonth() +1}/${targetDate.getDate()}`;
            }else if(hours == 2){
                element.querySelector(".time").innerHTML =
                `${days} أيام : ساعتين : ${minutes} دقائق : ${seconds} ثواني <br>
                ${targetDate.getFullYear()}/${targetDate.getMonth() +1}/${targetDate.getDate()}`;
            } else {

                element.querySelector(".time").innerHTML =
                    `${days} أيام : ${hours} ساعات : ${minutes} دقائق : ${seconds} ثواني <br>
                    ${targetDate.getFullYear()}/${targetDate.getMonth() +1}/${targetDate.getDate()}`;
            }
            
        }
    }, 1000);
}

const container = document.getElementById("events-container");

// Create HTML for each event
events.forEach(event => {
    
    const div = document.createElement("div");
    div.className = "event";
    div.innerHTML = `
        <h1>${event.title}</h1>
        <h3 class="day">${event.day}</h3>
        <p class="time">...</p>
    `;
    container.appendChild(div);
    startCountdown(event.date, div);
});
