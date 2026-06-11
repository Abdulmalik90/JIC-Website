// 1. مصفوفة الأحداث (البيانات)
const events = [
    {title: "حساب المواطن", id: 2, date: "2025-11-11T23:30:00", day:"الثلاثاء"},
    {title: "إجازة الخريف", id: 3, date: "2025-11-21T01:00:00", day:"الجمعة"},
    {title: "المكافأة الشهرية", id: 4, date:"2025-11-27T01:00:00", day: "الخميس"},
    {title:"نهاية إجازة الخريف", id: 5, date: "2025-11-29T23:00:00", day:"السبت"},
    {title: "حساب المواطن", id: 6, date: "2025-12-10T23:30:00", day:"الأربعاء"},
    {title: "نهاية فترة طلبات التخصص", id: 7, date: "2025-12-10T12:59:59", day:"الخميس"},
    {title: "تجديد السكن الطلابي", id: 8, date: "2025-12-18T00:00:00", day:"الخميس"},
    {title: "بداية الإختبارات النهائية", id: 9, date: "2025-12-21T09:00:00", day:"الأحد"},
    {title: "ايداع المكافأت", id: 10, date: "2025-12-28T00:00:01", day:"الأحد"},
    {title: "نهاية تجديد السكن", id: 11, date: "2025-12-30T00:00:00", day:"الثلاثـاء"},
    {title: "نهاية الإختبارات النهائية", id: 12, date: "2025-12-31T14:30:01", day:"الاربعاء"},
    {title: "ايداع حساب المواطن", id: 13, date: "2026-01-11T00:00:01", day:"الأحد"},
    {title: "حجز السكن الدراسي", id: 14, date: "2026-01-13T00:00:01", day:"الثلاثـاء"},
    {title: "بداية الفصل الثاني", id: 15, date: "2026-01-18T07:00:01", day:"الأحد"},
    {title: "نهاية الحذف والاضافة", id: 16, date: "2026-01-22T12:30:01", day:"الخميس"},
    {title: "بداية الاعتذار", id: 17, date: "2026-01-25T00:30:01", day:"الأحد"},
    {title: "ايداع المكافأت", id: 18, date: "2026-01-27T00:00:01", day:"الثلاثاء"},
    {title: "بداية فترة طلبات التخصص وتغييره", id: 19, date: "2026-02-01T00:00:00", day:"الأحد"},
    {title: "ايداع حساب المواطن", id: 20, date: "2026-02-10T00:00:00", day:"الثلاثاء"},
    {title: "شهـر رمضان المبارك", id: 21, date: "2026-02-18T00:00:00", day:"الاربعاء"},
    {title: "اجازة يوم التأسيس", id: 22, date: "2026-02-22T00:00:00", day:"الأحد"},
    {title: "إيداع المكافأت", id: 23, date: "2026-02-26T00:00:00", day:"الخميس"},
    {title: "اجازة عيد الفطر المبارك", id: 24, date: "2026-03-06T00:00:00", day:"الجمعة"},
    {title: "حساب المواطن", id: 35, date: "2026-03-10T00:00:00", day:"الثلاثاء"},
    {title: "ايداع المكافأت", id: 36, date: "2026-03-26T00:00:00", day:"الخميس"},
    {title: "بداية الاختبارات النصفية", id: 25, date: "2026-03-29T07:00:00", day:"الأحد"},
    {title: "حساب المواطن", id: 26, date: "2026-04-09T00:00:00", day:"الخميس"},
    {title: "ايداع المكافأت", id: 27, date: "2026-04-27T00:00:00", day:"الاثنين"},
    {title: "حساب المواطن", id: 28, date: "2026-05-10T00:00:00", day:"الاحد"},
    {title: " فترة تجديدالسكن للصيفي", id: 29, date: "2026-06-01T00:00:00", day:"الاثنين"},
    {title: "نهاية فترة التجديد", id: 30, date: "2026-06-14T00:00:00", day:"الاحد"},
    {title: "بداية فترة حجز السكن", id: 31, date: "2026-06-18T00:00:00", day:"الخميس"},
    {title: "ايداع المكافأت", id: 32, date: "2026-05-01T00:00:00", day:"الاحد"},
    {title: "بداية الاختبارات النهائية", id: 33, date: "2026-06-02T07:00:00", day:"الثلاثاء"},
    {title: "نهاية الاختبارات النهائية", id: 34, date: "2026-06-15T03:00:00", day:"الاثنين"},
];

// 2. دالة ترتيب الأحداث
function getAllEvents() {
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

// 3. دالة العد التنازلي (المحرك)
function startCountdown(targetDateStr, element) {
    const targetDate = new Date(targetDateStr);
    let timer;

    const updateTimer = () => {
        const now = new Date();
        const diff = targetDate - now;

        if (!element) {
            if(timer) clearInterval(timer);
            return;
        }

        // إذا الحدث انتهى من يوم كامل نخفيه
        if (diff < -24 * 60 * 60 * 1000) {
            if(timer) clearInterval(timer);
            element.style.display = "none";
            return;
        }

        // تحديد العناصر داخل البطاقة
        const dayNumEl = element.querySelector(".time-day");
        const dayStrEl = element.querySelector(".day-string");
        const hourNumEl = element.querySelector(".time-hour");
        const hourStrEl = element.querySelector(".hour-string");
        const minNumEl = element.querySelector(".time-minute");
        const minStrEl = element.querySelector(".minute-string");

        // إذا الحدث اليوم
        if (targetDate.toDateString() === now.toDateString()) {
            element.classList.add("today-event");
        } else {
            element.classList.remove("today-event");
        }

        // حساب الوقت المتبقي
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);

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
                dayNumEl.innerText = days > 0 ? days : "00";
                dayStrEl.innerText = dayString;
            }
            if (hourNumEl) {
                hourNumEl.innerText = hours > 0 ? hours : "00";
                hourStrEl.innerText = hourString;
            }
            if (minNumEl) {
                minNumEl.innerText = minutes > 0 ? minutes : "00";
                minStrEl.innerText = minString;
            }
        } 
        // إذا انتهى الوقت (الآن)
        else {
            if (dayNumEl) { dayNumEl.innerText = "00"; dayStrEl.innerText = "يوم"; }
            if (hourNumEl) { hourNumEl.innerText = "00"; hourStrEl.innerText = "ساعة"; }
            if (minNumEl) { minNumEl.innerText = "00"; minStrEl.innerText = "دقيقة"; }
            element.classList.add("today-event");
        }
    };

    updateTimer();
    timer = setInterval(updateTimer, 60000); // تحديث كل دقيقة
}

// 4. الدالة الجديدة: رسم البطاقات داخل الصفحة (هذي اللي كانت ناقصتك!)
// ========================================================
// ملف: eventsCounterPage/events.js
// الوظيفة: بطاقات أحداث + إعلانات مطابقة للتصميم 100%
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("calender-events");
    
    if (!container) return;

    // تنظيف
    container.innerHTML = "";

    if (typeof getAllEvents === 'undefined') {
        container.innerHTML = "<p style='text-align:center; color:#999;'>عذراً، لا يمكن تحميل الأحداث.</p>";
        return;
    }

    const allEvents = getAllEvents();
    const now = new Date();

    const activeEvents = allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate > now - (24 * 60 * 60 * 1000);
    });

    if (activeEvents.length === 0) {
        container.innerHTML = "<p style='width:100%; text-align:center; color:#999;'>لا توجد أحداث قادمة</p>";
        return;
    }

    // ---------------------------------------------------------
    // 1. تكرار الأحداث (كودك الأصلي)
    // ---------------------------------------------------------
    activeEvents.forEach((event, index) => {
        const card = document.createElement("div");
        // الكرت هنا بياخذ ستايل الـ CSS الافتراضي للموقع (Shadow, Radius, etc.)
        
        card.innerHTML = `
            <h3>${event.title}</h3>
            
            <div class="event-timer" style="display: flex; gap: 10px; justify-content: center; direction: ltr; margin-top: 15px;">
                <div style="text-align: center;">
                    <span class="time-day" style="font-size: 20px; font-weight: bold; color: #0052cc; display:block;">00</span>
                    <span class="day-string" style="font-size: 11px; color: #888;">يوم</span>
                </div>
                <span style="font-weight: bold; color: #ddd; margin-top: 5px;">:</span>
                
                <div style="text-align: center;">
                    <span class="time-hour" style="font-size: 20px; font-weight: bold; color: #0052cc; display:block;">00</span>
                    <span class="hour-string" style="font-size: 11px; color: #888;">ساعة</span>
                </div>
                <span style="font-weight: bold; color: #ddd; margin-top: 5px;">:</span>

                <div style="text-align: center;">
                    <span class="time-minute" style="font-size: 20px; font-weight: bold; color: #0052cc; display:block;">00</span>
                    <span class="minute-string" style="font-size: 11px; color: #888;">دقيقة</span>
                </div>
            </div>

            <div style="margin-top: 15px; font-size: 12px; color: #aaa; text-align: right; border-top: 1px solid #f0f0f0; padding-top: 8px;">
                📅 ${event.day} | ${event.date.split('T')[0]}
            </div>
        `;

        container.appendChild(card);
        if (typeof startCountdown !== 'undefined') startCountdown(event.date, card);

        // ---------------------------------------------------------
        // 2. حقن الإعلان (مطابق للتصميم الأصلي)
        // ---------------------------------------------------------
        if ((index + 1) % 3 === 0) {
            if (window.AdsManager) {
                const ad = window.AdsManager.getAd('event_feed');
                
                if (ad) {
                    const adCard = document.createElement("div");
                    adCard.className = "dynamic-event-ad"; // للتعرف عليه فقط
                    
                    // 💡 التعديل الجذري:
                    // 1. padding: 0 -> عشان الصورة تعبي الكرت للحواف (تلغي حشوة الـ CSS الافتراضية)
                    // 2. overflow: hidden -> عشان الزوايا تكون دائرية زي اخوياه
                    // 3. min-height -> عشان يكون نفس طول كرت الحدث تقريباً
                    // 4. لا يوجد حدود ولا هوامش خارجية (يأخذ من الـ Grid مباشرة)
                    adCard.style.cssText = "padding: 0 !important; overflow: hidden; position: relative; cursor: pointer; min-height: 200px; display: flex;";

                    adCard.setAttribute('data-href', ad.link);
                    adCard.onclick = function() { window.open(this.getAttribute('data-href'), '_blank'); };

                    adCard.innerHTML = `
                        <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); color: #fff; font-size: 10px; padding: 2px 8px; border-radius: 4px; z-index: 2;">إعلان</span>
                        
                        <img class="event-ad-img" src="${ad.image}" alt="${ad.client}" 
                             style="width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.5s ease;" 
                             alt="إعلان">
                    `;
                    
                    container.appendChild(adCard);
                }
            }
        }
    });

    // ---------------------------------------------------------
    // 3. التحديث التلقائي (7 ثواني)
    // ---------------------------------------------------------
    function updateEventAds() {
        if (!window.AdsManager) return;
        const adUnits = document.querySelectorAll('.dynamic-event-ad');
        adUnits.forEach(unit => {
            const newAd = window.AdsManager.getAd('event_feed');
            if (newAd) {
                const img = unit.querySelector('.event-ad-img');
                img.style.opacity = '0';
                setTimeout(() => {
                    img.src = newAd.image;
                    unit.setAttribute('data-href', newAd.link);
                    img.style.opacity = '1';
                }, 500);
            }
        });
    }

    setInterval(updateEventAds, 7000);
});
