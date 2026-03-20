/* =========================================
   نظام المفقودات - misscript.js
   ========================================= */

// ⚙️ إعدادات الرابط
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm4RK50J554bcCBsbkRg_P7-KryGy0kgSdjYgoSvlLASdi7pUuOgvif-5vJgdzOZBXVUlhAbPg2Lsh/pub?output=csv";
// صورة افتراضية (لو ما رفع صورة)
const DEFAULT_IMAGE = "Missing.webp"; 
// (تأكد انك تحط صورة بهذا الاسم في مجلد الصور عندك، أو حط أي رابط صورة من النت)

document.addEventListener('DOMContentLoaded', () => {
    // تحديد احنا في أي صفحة؟
    const isHomePage = document.getElementById('home-missing-container');
    const isMissingPage = document.getElementById('missingItemsContainer');

    if (isHomePage) {
        fetchAndRender(true); // وضع الصفحة الرئيسية (آخر 5)
    } else if (isMissingPage) {
        fetchAndRender(false); // وضع الصفحة الكاملة
    }
});

// الدالة الرئيسية لجلب البيانات
async function fetchAndRender(isHomeMode) {
    const container = isHomeMode 
        ? document.getElementById('home-missing-container') 
        : document.getElementById('missingItemsContainer');

    // إذا الحاوية غير موجودة في الصفحة الحالية، نوقف عشان ما يطلع خطأ
    if (!container) return;

    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        
        // تحويل الـ CSV إلى مصفوفة
        const rows = parseCSV(data); 
        
        // حذف صف العناوين (أول صف)
        rows.shift(); 

        // عكس الترتيب (عشان الأحدث يطلع أول)
        const items = rows.reverse();

        // تنظيف الحاوية
        container.innerHTML = '';

        // تحديد العدد للعرض
        const displayItems = isHomeMode ? items.slice(0, 5) : items;

        if (displayItems.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding:20px; width:100%; color:var(--text-sub);">لا توجد بلاغات حالياً</p>';
            return;
        }

        displayItems.forEach(item => {
            // استخراج البيانات حسب ترتيب أعمدة Google Sheet
            // [0]Timestamp, [1]العنوان, [2]التصنيف, [3]التفاصيل, [4]رقم التواصل, [5]المكان, [6]صورة
            
            // التأكد من وجود البيانات قبل المعالجة لتجنب الأخطاء
            const date = item[0] ? item[0].split(' ')[0] : '';
            const title = item[1] || 'بدون عنوان';
            const category = item[2] || '';
            const desc = item[3] || '';
            const phone = item[4] || '';
            const location = item[5] || '';
            
            // ============================================
            // 🛠️ بداية تعديل معالجة الصور (الكود الجديد)
            // ============================================
            // نحاول نلقى الرابط في العمود 6، وإذا ما نفع نجرب اللي قبله أو بعده احتياط
            // (أحياناً الفواصل في ملف CSV تخرب الترتيب)
            let rawImage = item[6] || item[7] || ''; 
            let imageUrl = DEFAULT_IMAGE;

            // تنظيف الرابط من أي مسافات
            rawImage = rawImage.trim();

            if (rawImage.length > 5) {
                // هذا النمط يبحث عن ID الصورة مهما كان مكانه في الرابط
                // يدعم: /d/XXXX/view و id=XXXX و open?id=XXXX
                const idPattern = /[-\w]{25,}/; 
                const match = rawImage.match(idPattern);

                if (match) {
                    const fileId = match[0]; // يمسك الـ ID الطويل
                    imageUrl = `https://lh3.googleusercontent.com/d/${fileId}=s500`; 
                    // 💡 ملاحظة: lh3 أسرع وأفضل للعرض المباشر من drive.google.com
                } else {
                    console.log("لم يتم العثور على ID صالح في الرابط:", rawImage);
                }
            }
            // ============================================
            // 🛑 نهاية تعديل الصور
            // ============================================

            // تحديد لون التاج
           const statusClass = category.includes('فقدان') ? 'status-lost' : 'status-found';
            
            // تحديد الكلاس المناسب للكرت (حسب الصفحة)
            const cardClass = isHomeMode ? 'missing-card-mini' : 'missing-card';
            
            // إنشاء الكرت
            const card = document.createElement('div');
            card.className = cardClass; 
            
            // محتوى الكرت HTML
            card.innerHTML = `
                <div class="item-image">
                    <span class="status-badge ${statusClass}">${category}</span>
                    <img src="${imageUrl}" alt="${title}" onerror="this.src='${DEFAULT_IMAGE}'">
                </div>
                <div class="item-content">
                    <span class="item-date">${date}</span>
                    <h3 class="item-title">${title}</h3>
                    <p class="item-desc">${desc}</p>
                    <div class="contact-info-box">
                        <div class="info-row"><i class="fi fi-rr-marker"></i> ${location}</div>
                        <div class="info-row"><i class="fi fi-rr-phone-call"></i> ${phone}</div>
                    </div>
                </div>
            `;
            
            // إخفاء التفاصيل الزائدة في الصفحة الرئيسية فقط (للتأكيد)
            if(isHomeMode) {
                 // في CSS نحن أخفينا الوصف ومعلومات الاتصال، هذا للتأكيد فقط
            }

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error:', error);
        container.innerHTML = '<p style="text-align:center; color:red;">حدث خطأ في تحميل البيانات</p>';
    }
}

// دالة تحليل الـ CSV (تتعامل مع الفواصل داخل النصوص)
function parseCSV(str) {
    const arr = [];
    let quote = false;
    let row = 0, col = 0, c = 0;
    for (; c < str.length; c++) {
        let cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';
        
        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }
        if (cc == '\r' && !quote) { ++row; col = 0; continue; }
        arr[row][col] += cc;
    }
    return arr;
}

// دالة الفلتر (لصفحة missing.html)
let currentFilter = 'all';

function filterCategory(cat, btn) {
    currentFilter = cat;
    
    // تحديث الأزرار
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    filterItems();
}

function filterItems() {
    const searchVal = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.missing-card');

    cards.forEach(card => {
        const title = card.querySelector('.item-title').innerText.toLowerCase();
        const catText = card.querySelector('.status-badge').innerText;
        
        const matchSearch = title.includes(searchVal);
        const matchCat = currentFilter === 'all' || catText.includes(currentFilter);

        if (matchSearch && matchCat) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

/* =========================================
   دوال التحكم بالنافذة المنبثقة (Popups)
   ========================================= */

// جعل الدوال عامة (Global) عشان زر HTML يقدر يشوفها
window.openAddModal = function() {
    const modal = document.getElementById('add-modal2');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error("خطأ: لم يتم العثور على نافذة id='add-modal2'");
    }
}

window.closeAddModal = function() {
    const modal = document.getElementById('add-modal2');
    if (modal) {
        modal.style.display = 'none';
    }
}

// إغلاق النافذة عند الضغط خارجها
window.onclick = function(event) {
    const modal = document.getElementById('add-modal2');
    if (event.target == modal) {
        modal.style.display = "none";
    }

}
