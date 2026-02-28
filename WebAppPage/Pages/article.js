// =========================================
// قراءة تفاصيل الخبر من جهاز المستخدم مباشرة (بدون إنترنت)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
     // دالة لصيد الروابط من النص الخام وتحويلها لروابط قابلة للضغط
function makeLinksClickable(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function(url) {
            // حولنا الرابط لزر، وضفنا أيقونة رابط جنبه
            return `<br><a href="${url}" target="_blank" class="inline-action-btn"><i class="fi fi-rr-link-alt"></i>اضغط لعرض التفاصيل</a><br>`;
        });
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const titleEl = document.getElementById('articleTitle');
    const bodyEl = document.getElementById('articleBody');
    const imageEl = document.getElementById('articleImage');
    const clubEl = document.getElementById('articleClub');
    const dateEl = document.getElementById('articleDate');
    const genderEl = document.getElementById('articleGender');
    const linkBtn = document.getElementById('articleLinkBtn'); 

    if (!articleId) {
        titleEl.textContent = "افاا صار خطأ";
        bodyEl.innerHTML = "<p>معليش الظاهر فيه مشكلة او ان المقالة محذوفة</p>";
        return;
    }

    // 1. نسحب قاعدة البيانات اللي حفظناها بجهاز الطالب
    const DB_KEY = "mdkhal_local_db";
    const localData = localStorage.getItem(DB_KEY);

    if (localData) {
        const db = JSON.parse(localData);
        
        // 2. نبحث عن الخبر بناءً على الـ ID
        const newsItem = db.find(item => item.id == articleId);

        if (newsItem) {
// 1. العنوان والصورة
            titleEl.textContent = newsItem.title;
            imageEl.src = newsItem.image;

            // 2. معالجة النص بدون مسافات دبل (CSS بيتولى المهمة)
            let finalContent = newsItem.excerpt;
            finalContent = makeLinksClickable(finalContent); // إذا عندك دالة الروابط
            bodyEl.innerHTML = `<p>${finalContent}</p>`; 

            // 3. بادج النادي
            clubEl.className = 'unified-badge';
            clubEl.style.color = newsItem.clubColor || "var(--primary-text)";
            // حركة جمالية: نخلي لون خلفية النادي خفيفة من نفس لونه
            clubEl.style.backgroundColor = `${newsItem.clubColor}15`; 
            clubEl.style.borderColor = `${newsItem.clubColor}30`;
            clubEl.innerHTML = `${newsItem.clubName}`;

            // 4. بادج الفئة المستهدفة
            const safeGender = (newsItem.targetGender || "الجميع").trim();
            genderEl.className = 'unified-badge';
            if (safeGender === 'طلاب') {
                genderEl.innerHTML = `<i class="fi fi-rr-user" style="color: #3b82f6;"></i> طلاب`;
            } else if (safeGender === 'طالبات') {
                genderEl.innerHTML = `<i class="fi fi-rr-user" style="color: #ec4899;"></i> طالبات`;
            } else {
                genderEl.innerHTML = `<i class="fi fi-rr-users" style="color: #64748b;"></i> الجميع`;
            }

            // 5. بادج التاريخ
            dateEl.className = 'unified-badge';
            dateEl.innerHTML = `<i class="fi fi-rr-calendar"></i> ${newsItem.date}`;

            // 6. زر الرابط الخارجي
            if (newsItem.externalLink && newsItem.externalLink.trim() !== "") {
                linkBtn.href = newsItem.externalLink; 
                linkBtn.style.display = 'block'; 
            } else {
                linkBtn.style.display = 'none'; 
            }

            // =====================================
            // برمجة زر المشاركة (Web Share API)
            // =====================================
            const shareBtn = document.querySelector('.share-btn');
            
            if (shareBtn) {
                shareBtn.addEventListener('click', async (e) => {
                    e.preventDefault(); // نمنع الزر من تحديث الصفحة
                    
                    // نجهز البيانات اللي بتنرسل بالواتساب أو غيره
                    const shareData = {
                        title: newsItem.title,
                        text: `شيك هذا الخبر من ${newsItem.clubName} على تطبيق مدخل! 🔥\n\n${newsItem.title}\n\n`,
                        url: window.location.href // ياخذ الرابط الحالي حق الخبر بالضبط
                    };

                    try {
                        // إذا جوال الطالب يدعم قائمة المشاركة الأصلية
                        if (navigator.share) {
                            await navigator.share(shareData);
                        } else {
                            // إذا كمبيوتر أو متصفح ما يدعم، ننسخ الرابط للحافظة
                            await navigator.clipboard.writeText(window.location.href);
                            alert('تم نسخ رابط الخبر بنجاح! تقدر تلصقه بأي مكان.'); 
                        }
                    } catch (err) {
                        console.log('تم إلغاء المشاركة أو حدث خطأ', err);
                    }
                });
            }
            // زر الرابط
            if (newsItem.externalLink && newsItem.externalLink.trim() !== "") {
                linkBtn.href = newsItem.externalLink; 
                linkBtn.style.display = 'block'; 
            } else {
                linkBtn.style.display = 'none'; 
            }

        } else {
            titleEl.textContent = "الخبر ماهو موجود";
            bodyEl.innerHTML = "<p>ممكن يكون هذا الخبر محذوف أو ما تمت مزامنته للحين.</p>";
        }
    } else {
        // لو بالغلط دخل الصفحة وجهازه ما فيه بيانات
        titleEl.textContent = "مافيه بيانات";
        bodyEl.innerHTML = "<p>ياليت تفتح صفحة اخبار الاندية أول عشان جهازك يستوعب البيانات.</p>";
    }
});