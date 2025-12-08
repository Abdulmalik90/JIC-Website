// news-data.js
const newsData = [
    {
        id: 1,
        title: "كًتب مقررات اللغة الانجليزية لطلاب السنة التحضيرية",
        content: `
            <p>تم الإعلان عن كتب مقررات الإنجليزي في السنة التحضيرية للمستوى الأول والثاني كما هو موضح في الصورة</p>
            <p>تشمل الكتب المقررة:</p>
            <ul>
                <li>UNLOCK 1 - Reading & Writing</li>
                <li>UNLOCK 2 - Listening & Speaking</li>
                <li>English for Academic Purposes</li>
            </ul>
        `,
        image: "https://i.postimg.cc/rytXqVdM/English-Books471.jpg",
        date: "2025-08-24T14:34:00",
        author: "عبدالملك الخليفة",
        category: "الكتب"
    },
    {
        id: 2,
        title: "مواصفات الزي الموحد المحدثة لكليات ومعاهد الجبيل الصناعية",
        content: `
            <p>- موقع الشعار على الزي الرسمي:</p>
            <p>تتوسط الدائرة موضعها مع الحفاظ على مساحة آمنة تعادل حجم الشعار بداخل الدائرة ويكون إرتفاع الشعار داخل الدائرة يساوي 60% من قطر الدائرة مع الحفاظ على مسافة آمنة بين طرف الدائرة العلوي ونهاية انحناء الكتف كما يتموضع مسمى كلية الجبيل الصناعية ومعهد الجبيل التقني على بعد مسافة ارتفاعه أسفل الدائرة مع مراعاة مسافة آمنة جانبية لاستدارة الكم</p>
            <p>يمكن للطالب طلب الزي من خلال اي مزود بشرط الالتزام بالمواصفات الخاصة بالخامات والتصميم المعتمد</p>
        `,
        image: "https://i.postimg.cc/xC3f59LP/uniform.jpg",
        date: "2025-08-25T17:15:00",
        author: "رائد الزهراني",
        category: "الزي الموحد"
    },
    {
        id: 3,
        title: "خريطة كلية الجبيل الصناعية",
        content: `
            <p>نموذج لخريطة الكلية فيه كل أسماء واختصارات المباني الللي ممكن تحتاجها</p>
            
        `,
        image: "https://i.postimg.cc/bYKPnDXs/jic-Map.png",
        date: "2025-08-26T13:42:00",
        author: "رائد الزهراني",
        category: "خريطة"
    },
    {
        id: 4,
        title: "ثـلاث ايام تفصلنا عن الاعلان الرسمي لمنصة مدخل !",
        content: `
            <p>ماهي الا ايام معدودات ونشوف منصة مدخل واقــع!</p>
            <p>خليـك قــريب لان مابقـى شيء ✨</p>
            <ul style="direction: rtl;">
                <li>الاعلان بيكون ان شاء الله يوم السبت القـادم.</li>
                <li>بتاريــخ الاول من شهــر نوفمبــر.</li>
            </ul>
            <p style="direction: rtl;">قـنـاة الاخبـار:</p>
            <a href="https://t.me/newsjuc">اضغـط هنـا للانضمام لقناة الاخبار</a>
            

        `,
        image: "https://i.postimg.cc/4NpKhbHL/aʿlan-mdkhl.png",
        date: "2025-10-29T20:31:01",
        author: "رائـد الزهـراني",
        category: "مـدخـل"
    },
    {
    id: 5,
    title: "🎓 فيديو : حفل تخرّج طلاب كليات ومعاهد الهيئة الملكية بالجبيل 2025م",
    content: `
        <p style="direction: rtl;">
            يسرّ <strong>منصة مدخل</strong> أن تشارك خريجي كليات ومعاهد الهيئة الملكية بالجبيل فرحتهم في هذا اليوم المميز،
            وتهنئهم على ما حققوه من إنجاز وجهد طوال سنواتهم الدراسية 💫
        </p>

        <p style="direction: rtl;">
            يمكنكم متابعة <strong>تسجيل بث الحفل</strong> من خلال الرابط التالي:
        </p>

        <a href="https://www.youtube.com/live/qk9Bt0jsx70?si=tsKS33U7ktPMdnF6" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: #007bff; color: white; border-radius: 6px; text-decoration: none;">
            🎥 اضغـط هنـا لمشاهدة البث المباشر
        </a>

        <p style="direction: rtl; margin-top: 12px;">
            نبارك لجميع الخريجين ونتمنى لهم مستقبلاً زاهراً مليئاً بالنجاح والإنجاز 🌟
        </p>
    `,
    image: "https://i.postimg.cc/JnDwKtRM/IMG-8336.jpg",
    date: "2025-11-10T00:11:00",
    author: "رائـد الزهـراني",
    category: "مناسبات"
},
    {
    id: 6,
    title: " موجـز: الاصدار الكامل من منصة مدخل 📄",
    content: `
        <p style="direction: rtl;">
            بعد مرور اسبوعين منذ الاطلاق التجريبي لمنصة مدخل قدرنا نوصل لـ 3500+ زيارة للمنصة
            بما يعادل 10 زيارات في الساعة الواحدة , وهالشيء نفتخر فيه كبداية مع هالخدمات المحدودة 🥳
        </p>
        <p style="direction: rtl;">
            وكمـوجز سريع نقدر نقول ان النسخة المكتملة من مدخل قيد التطوير و راح تشتمل مجموعات تغييرات واضافات منها :
            - الوضع الداكن لعشاق الدارك مود
            - تغيير كبير بالصفحة الرئيسية عشان تكون اوضح واشمل
            - اداة انشاء الجدول الدراسي وتحويل الفترات الى اوقات
            - مكتبة الطالب اللي راح تكون مرجعك الاول
            - اضافة خانة توضح نسبة الغياب للمحاضرة الواحدة
            وغيرها الكثير ان شاء الله
        </p>
        <p style="direction: rtl;">
            ياليت تشاركونا <strong>اقتراحاتكم</strong> من خلال الاستبيان :
        </p>

        <a href="https://www.youtube.com/live/qk9Bt0jsx70?si=tsKS33U7ktPMdnF6" target="_blank" style="display: inline-block; padding: 8px 14px; background-color: #007bff; color: white; border-radius: 6px; text-decoration: none;">
            🫡 اضغـط هنـا لمشاركة اقتراحاتك
        </a>

        <p style="direction: rtl; margin-top: 12px;">
            شكـراً لكم على ثقتكم , وان شاء الله حنا قدها 🌟
        </p>
    `,
    image: "https://i.postimg.cc/P528VX3r/iconic-logo-Bluer-full-4x.png",
    date: "2025-11-14T00:19:00",
    author: "رائـد الزهـراني",
    category: "مدخـل"
},
    {
    id: 7,
    title: "الاختبارات: الجداول المبدئية لاختبارات كلية الجبيل الصناعية 📄",
    content: `
        <p style="direction: rtl;">
            أعلنت كلية الجبيل الصناعية عن صدور <strong>الجداول المبدئية للاختبارات</strong> للفصل الدراسي الحالي،
            وذلك لإتاحة الفرصة للطلاب والطالبات للاطلاع المبكر والاستعداد بشكل أفضل للاختبارات النهائية.
        </p>

        <p style="direction: rtl;">
            نرفق لكم روابط تحميل الجداول حسب كل برنامج وفرع، ويمكنكم الإطلاع عليها مباشرة من خلال الأزرار التالية:
        </p>

        <div style="direction: rtl; margin-top: 14px; display: flex; flex-direction: column; gap: 10px; max-width: 280px;">
            <a href="https://t.me/JuPortalsa/151" target="_blank" style="padding: 10px; background-color: #0057b7; color: white; text-align: center; border-radius: 8px; text-decoration: none;">
                جدول اختبارات الطلاب – بكالوريوس
            </a>

            <a href="https://t.me/JuPortalsa/152" target="_blank" style="padding: 10px; background-color: #0057b7; color: white; text-align: center; border-radius: 8px; text-decoration: none;">
                جدول اختبارات الطلاب – دبلوم
            </a>

            <a href="https://t.me/JuPortalsa/155" target="_blank" style="padding: 10px; background-color: #C91A98; color: white; text-align: center; border-radius: 8px; text-decoration: none;">
                جدول اختبارات الطالبات – فرع سدير
            </a>

            <a href="https://t.me/JuPortalsa/154" target="_blank" style="padding: 10px; background-color: #C91A98; color: white; text-align: center; border-radius: 8px; text-decoration: none;">
                جدول اختبارات الطالبات – فرع الفيحاء
            </a>
        </div>

        <p style="direction: rtl; margin-top: 15px;">
            نتمنى لجميع الطلاب والطالبات التوفيق والنجاح في استعداداتهم للاختبارات 🌟
        </p>
    `,
    image: "https://i.postimg.cc/s2tRbPFh/shʿar-alhyyt-twly-4x.png",
    date: "2025-11-20T00:00:00",
    author: "رائـد الزهـراني",
    category: "كلية الجبيل الصناعية"
}
{
    id: 8,
    title: "الاختبارات: جدول اختبارات اللغة الانجليزية لطلاب التحضيري بكلية الجبيل الصناعية 📄",
    content: `
        <p style="direction: rtl;">
            أعلنت كلية الجبيل الصناعية عن صدور <strong>الجداول النهائية للاختبارات</strong> للفصل الدراسي الحالي،
            وذلك لإتاحة الفرصة للطلاب والطالبات في السنة التحضيرية لمعرفة تواريخ واوقات اختباراتهم بشكل افضل.
        </p>

        <p style="direction: rtl;">
            نرفق لكم ادناه رابط تحميل الجدول، ويمكنكم الإطلاع عليها مباشرة من خلال الزر التالي:
        </p>

        <div style="direction: rtl; margin-top: 14px; display: flex; flex-direction: column; gap: 10px; max-width: 280px;">
            <a href="https://t.me/JuPortalsa/187" target="_blank" style="padding: 10px; background-color: #0057b7; color: white; text-align: center; border-radius: 8px; text-decoration: none;">
                جدول اختبارات طلاب السنة التحضيرية
            </a>

        </div>

        <p style="direction: rtl; margin-top: 15px;">
            نتمنى لجميع الطلاب والطالبات التوفيق والنجاح في استعداداتهم للاختبارات 🌟
        </p>
    `,
    image: "https://i.postimg.cc/s2tRbPFh/shʿar-alhyyt-twly-4x.png",
    date: "2025-12-09T00:00:00",
    author: "رائـد الزهـراني",
    category: "كلية الجبيل الصناعية"
}
    
];


// دالة للحصول على خبر بواسطة ID
function getNewsArticleById(articleId) {
    return newsData.find(article => article.id === parseInt(articleId));
}

// دالة للحصول على جميع الأخبار
function getAllNewsArticles() {
    return newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
}

