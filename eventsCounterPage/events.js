// 1. مصفوفة الأحداث (البيانات)
const events = [
  {title: "نهاية فترة اضافة المقررات", id: 1, date: "2026-06-25T00:00:00", day:"الخميس"},
  {title: "المكافأة الشهرية", id: 2, date: "2026-06-28T00:00:00", day:"الأحد"},
  {title: "حساب المواطن", id: 3, date: "2026-07-09T00:00:00", day:"الخميس"},
  {title: "بداية الاختبارات النصفية", id: 4, date: "2026-07-12T00:00:00", day:"الأحد"},
  {title: "نهاية الاعتذار بعلامة W", id: 5, date: "2026-07-23T00:00:00", day:"الخميس"},
  {title: "المكافأة الشهرية", id: 6, date: "2026-07-27T00:00:00", day:"الإثنين"},
  {title: "بداية الاختبارات النهائية", id: 7, date: "2026-08-09T00:00:00", day:"الأحد"},
  {title: "نهاية الاختبارات النهائية", id: 8, date: "2026-08-11T00:00:00", day:"الثلاثاء"},
  {title: "بدء فترة حجز السكن", id: 9, date: "2026-06-18T06:00:00", day:"الخميس"},
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
