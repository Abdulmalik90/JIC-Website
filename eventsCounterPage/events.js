function getAllEvents() {
    // Sorts events to show the closest ones first
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

const events = [
    {title: "حساب المواطن", id: 2, date: "2025-11-11T23:30:00", day:"الثلاثاء"},
    {title: "إجازة الخريف", id: 3, date: "2025-11-21T01:00:00", day:"الجمعة"},
    {title:"نهاية إجازة الخريف", id: 4, date: "2025-11-29T23:00:00", day:"السبت"},
    {title: "حساب المواطن", id: 5, date: "2025-12-10T23:30:00", day:"الأربعاء"},
    {title: "نهاية فترة طلبات التخصص وتغييره", id: 6, date: "2025-12-10T23:59:59", day:"الخميس"},
    {title: "بداية الإختبارات النهائية", id: 7, date: "2025-12-21T09:00:00", day:"الأحد"},
    {title: "المكافأة الجامعية", id: 8, date: "2025-12-28T23:30:00", day:"الأحد"},
    {title: "نهاية الإختبارات النهائية", id: 9, date: "2025-12-28T14:30:00", day:"الأحد"},
    {title: "بداية إجازة بين الفصلين", id: 10, date: "2025-12-28T14:30:01", day:"الأحد"}
]

/**
 * UPDATED COUNTDOWN FUNCTION
 */
function startCountdown(targetDateStr, element) {
    const targetDate = new Date(targetDateStr);
    let timer; // <--- 1. Declare 'timer' here to prevent ReferenceError

    const updateTimer = () => {
        const now = new Date();
        const diff = targetDate - now;

        if (!element) {
            if(timer) clearInterval(timer); // Check if timer exists before clearing
            return;
        }

        // Event passed more than a day ago → hide it
        if (diff < -24 * 60 * 60 * 1000) {
            if(timer) clearInterval(timer);
            element.style.display = "none";
            return;
        }

        // --- Check which HTML structure we are using ---
        const newTimerContainer = element.querySelector(".event-timer");
        const oldTimerEl = element.querySelector(".time"); // For events.html

        // --- VISUAL CHECK: Is it today? ---
        if (targetDate.toDateString() === now.toDateString()) {
            element.classList.add("today-event");
            element.classList.add("active-today"); 
        } else {
            element.classList.remove("today-event");
            element.classList.remove("active-today");
        }

        // --- Case 1: Future Event ---
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);

            if (days === 0 && hours === 0 && minutes === 0) {
                if (newTimerContainer) newTimerContainer.innerHTML = "<h1>أقل من دقيقة</h1>";
                if (oldTimerEl) oldTimerEl.innerHTML = "أقل من دقيقة";
                return;
            }

            if (newTimerContainer) {
                const dayNumEl = element.querySelector(".time-day");
                const dayStrEl = element.querySelector(".day-string");
                const hourNumEl = element.querySelector(".time-hour");
                const hourStrEl = element.querySelector(".hour-string");
                const minNumEl = element.querySelector(".time-minute");
                const minStrEl = element.querySelector(".minute-string");

                let dayString = "يوم";
                if (days === 2) dayString = "يومين";
                else if (days > 2 && days <= 10) dayString = "أيام";

                let hourString = "ساعة";
                if (hours === 2) hourString = "ساعتين";
                else if (hours > 2 && hours <= 10) hourString = "ساعات";

                let minString = "دقيقة";
                if (minutes === 2) minString = "دقيقتين";
                else if (minutes > 2 && minutes <= 10) minString = "دقائق";

                if (dayNumEl) {
                    dayNumEl.innerHTML = days > 0 ? days : "00";
                    dayStrEl.innerHTML = dayString;
                    dayNumEl.style.borderLeft = ""; 
                }
                if (hourNumEl) {
                    hourNumEl.innerHTML = hours > 0 ? hours : "00";
                    hourStrEl.innerHTML = hourString;
                }
                if (minNumEl) {
                    minNumEl.innerHTML = minutes > 0 ? minutes : "00";
                    minStrEl.innerHTML = minString;
                }
            } 
            else if (oldTimerEl) {
                let timeString = "";
                if (days > 0) timeString += `${days} أيام`;
                if (days > 0 && (hours > 0 || minutes > 0)) timeString += " : ";
                if (hours > 0) {
                    if (hours == 1) timeString += `ساعة`;
                    else if (hours == 2) timeString += `ساعتين`;
                    else timeString += `${hours} ساعات`;
                } else if (days > 0 && minutes > 0) {
                    timeString += `0 ساعة`;
                }
                if ((days > 0 || hours > 0) && minutes > 0) timeString += " : ";
                if (minutes > 0) {
                    if (minutes == 1) timeString += `دقيقة`;
                    else if (minutes == 2) timeString += `دقيقتين`;
                    else timeString += `${minutes} دقيقة`;
                }
                if(timeString === "") timeString = "أقل من دقيقة";
                timeString += `<br>${targetDate.getFullYear()}/${targetDate.getMonth() + 1}/${targetDate.getDate()}`;
                oldTimerEl.innerHTML = timeString;
            }
        } 
        // --- Case 2: Event has started (or passed) ---
        else if (diff <= 0) {
            if(timer) clearInterval(timer);
            
            if (newTimerContainer) {
                // Set values to 00 instead of removing them
                const dayNumEl = element.querySelector(".time-day");
                const dayStrEl = element.querySelector(".day-string");
                const hourNumEl = element.querySelector(".time-hour");
                const hourStrEl = element.querySelector(".hour-string");
                const minNumEl = element.querySelector(".time-minute");
                const minStrEl = element.querySelector(".minute-string");

                if(dayNumEl) { dayNumEl.innerHTML = "00"; dayStrEl.innerHTML = "يوم"; }
                if(hourNumEl) { hourNumEl.innerHTML = "00"; hourStrEl.innerHTML = "ساعة"; }
                if(minNumEl) { minNumEl.innerHTML = "00"; minStrEl.innerHTML = "دقيقة"; }
                
            } else if (oldTimerEl) {
                oldTimerEl.textContent = "اليوم";
            }

            element.classList.add("today-event");
            element.classList.add("active-today");
            return;
        }
    };

    updateTimer(); 
    timer = setInterval(updateTimer, 60000); // <--- 2. Assign it here
}