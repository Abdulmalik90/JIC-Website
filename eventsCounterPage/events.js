function getAllEvents() {
    // Sorts events to show the closest ones first
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

const events = [
    {title: "حساب المواطن", id: 1, date: "2025-11-11T00:30:00", day:"الثلاثاء"},
    {title: "إجازة الخريف", id: 2, date: "2025-11-21T00:00:00", day:"الجمعة"},
    {title:"نهاية إجازة الخريف", id: 3, date: "2025-11-29T00:00:00", day:"السبت"},
    {title: "حساب المواطن", id:4, date: "2025-12-10T00:30:00", day:"الأربعاء"},
    {title: "نهاية فترة طلبات التخصص وتغييره", id:5, date: "2025-12-10T23:59:59", day:"الخميس"},
    {title: "بداية الإختبارات النهائية", id: 6, date: "2025-12-21T09:00:00", day:"الأحد"},
    {title: "المكافأة الجامعية", id: 7, date: "2025-12-28T00:30:00", day:"الأحد"},
    {title: "نهاية الإختبارات النهائية", id: 8, date: "2025-12-28T14:30:00", day:"الأحد"},
    {title: "بداية إجازة بين الفصلين", id: 9, date: "2025-12-28T14:30:01", day:"الأحد"}
]

/**
 * UPDATED COUNTDOWN FUNCTION
 * This function now handles BOTH the homepage layout and the events page layout.
 */
function startCountdown(targetDateStr, element) {
    const targetDate = new Date(targetDateStr);

    const updateTimer = () => {
        const now = new Date();
        const diff = targetDate - now;

        if (!element) {
            clearInterval(timer);
            return;
        }

        // Event passed more than a day ago → hide it
        if (diff < -24 * 60 * 60 * 1000) {
            clearInterval(timer);
            element.style.display = "none";
            return;
        }

        // --- Check which HTML structure we are using ---
        const newTimerContainer = element.querySelector(".event-timer");
        const oldTimerEl = element.querySelector(".time"); // For events.html

        // --- Case 1: Event is Today ---
        if (
            targetDate.getDate() === now.getDate() &&
            targetDate.getMonth() === now.getMonth() &&
            targetDate.getFullYear() === now.getFullYear()
        ) {
            clearInterval(timer);
            if (newTimerContainer) {
                newTimerContainer.innerHTML = "<h1>اليوم</h1>";
            } else if (oldTimerEl) {
                oldTimerEl.textContent = "اليوم";
            }
            element.classList.add("today-event");
            return;
        }

        // --- Case 2: Future Event ---
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

            // --- Handle "Less than an hour" for both layouts ---
            if (days === 0 && hours === 0) {
                if (newTimerContainer) newTimerContainer.innerHTML = "<h1>أقل من ساعة</h1>";
                if (oldTimerEl) oldTimerEl.innerHTML = "أقل من ساعة";
                return;
            }

            // --- Logic for Homepage (new layout) ---
            if (newTimerContainer) {
                const dayNumEl = element.querySelector(".time-day");
                const hourNumEl = element.querySelector(".time-hour");
                const dayStrEl = element.querySelector(".day-string");
                const hourStrEl = element.querySelector(".hour-string");

                let dayString = "يوم";
                if (days === 2) dayString = "يومين";
                else if (days > 2 && days <= 10) dayString = "أيام";

                let hourString = "ساعة";
                if (hours === 2) hourString = "ساعتين";
                else if (hours > 2 && hours <= 10) hourString = "ساعات";

                // Populate Day elements
                if (days > 0) {
                    dayNumEl.innerHTML = days;
                    dayStrEl.innerHTML = dayString;
                } else {
                    dayNumEl.innerHTML = "";
                    dayStrEl.innerHTML = "";
                    // Remove the border from the CSS
                    dayNumEl.style.borderLeft = "none"; 
                }
                
                // Populate Hour elements
                if (hours > 0) {
                    hourNumEl.innerHTML = hours;
                    hourStrEl.innerHTML = hourString;
                } else {
                    hourNumEl.innerHTML = "";
                    hourStrEl.innerHTML = "";
                }
            } 
            // --- Logic for Events Page (old layout) ---
            else if (oldTimerEl) {
                let timeString = "";
                if (days > 0) timeString += `${days} أيام`;
                if (days > 0 && hours > 0) timeString += " : ";
                if (hours > 0) {
                    if (hours == 1) timeString += `ساعة`;
                    else if (hours == 2) timeString += `ساعتين`;
                    else timeString += `${hours} ساعات`;
                }
                timeString += `<br>${targetDate.getFullYear()}/${targetDate.getMonth() +1}/${targetDate.getDate()}`;
                oldTimerEl.innerHTML = timeString;
            }
        } 
        // --- Case 3: Event is Happening Now ---
        else if (diff <= 0) {
            clearInterval(timer);
            if (newTimerContainer) {
                newTimerContainer.innerHTML = "<h1>يحدث الآن</h1>";
            } else if (oldTimerEl) {
                oldTimerEl.textContent = "يحدث الآن";
            }
            element.classList.add("today-event");
        }
    };

    updateTimer(); 
    const timer = setInterval(updateTimer, 60000); // Update every minute
}


// This part ONLY runs on events.html because it looks for "events-container"
const container = document.getElementById("events-container");
if (container) {
    // Create HTML for each event
    events.forEach(event => {
        const div = document.createElement("div");
        div.className = "event";
        // This is the OLD HTML structure for the events.html page
        div.innerHTML = `
            <h2>${event.title}</h2> 
            <h3 class="day">${event.day}</h3>
            <p class="time">...</p>
        `;
        container.appendChild(div);
        startCountdown(event.date, div); // The "smarter" function will handle this
    });
}