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
            <a href="https://t.me/newsjuc"</a>
            

        `,
        image: "https://i.postimg.cc/4NpKhbHL/aʿlan-mdkhl.png",
        date: "2025-10-29T20:31:01",
        author: "رائـد الزهـراني",
        category: "مـدخـل"
    },
    
];

// دالة للحصول على خبر بواسطة ID
function getNewsArticleById(articleId) {
    return newsData.find(article => article.id === parseInt(articleId));
}

// دالة للحصول على جميع الأخبار
function getAllNewsArticles() {
    return newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
}

