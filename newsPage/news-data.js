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
            ياليت تشاركونااقتراحاتكم من خلال الاستبيان :
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
    title: "الاختبارات: جدول اختبارات اللغة الانجليزية لطلاب التحضيري بكلية الجبيل الصناعية 📄",
    content: `
        <p style="direction: rtl;">
            أعلنت كلية الجبيل الصناعية عن صدور الجداول النهائية للاختبارات للفصل الدراسي الحالي،
            وذلك لإتاحة الفرصة للطلاب والطالبات في السنة التحضيرية لمعرفة تواريخ واوقات اختباراتهم بشكل افضل.
        </p>

        <p style="direction: rtl;">
            نرفق لكم ادناه رابط تحميل الجدول، ويمكنكم الإطلاع عليها مباشرة من خلال الزر التالي:
        </p>

        <div style="direction: rtl; margin-top: 14px; display: flex; flex-direction: column; gap: 10px; max-width: 280px;">
            <a href="https://t.me/JuPortalsa/187" target="_blank" style="padding: 10px; background-color: #0057b7; color: white; text-align: center; margin: 10px auto; border-radius: 8px; text-decoration: none;">
                جدول اختبارات طلاب السنة التحضيرية
            </a>

        </div>

        <p style="direction: rtl; margin-top: 15px;">
            نتمنى لجميع الطلاب والطالبات التوفيق والنجاح في استعداداتهم للاختبارات 🌟
        </p>
    `,
    image: "https://i.postimg.cc/MKr7xqWQ/Gemini-Generated-Image-mdbpzgmdbpzgmdbp.png",
    date: "2025-12-09T00:00:00",
    author: "رائـد الزهـراني",
    category: "كلية الجبيل الصناعية"
    },
    {
        id: 8,
        title: "الاختبارات: جداول الاختبارات النهائية لطلاب وطالبات كلية الجبيل الصناعية 📄",
        content: `
            <p style="direction: rtl;">
                أعلنت كلية الجبيل الصناعية عن صدور الجداول المعتمدة للاختبارات للفصل الدراسي الحالي،
                وذلك لإتاحة الفرصة للطلاب والطالبات للاطلاع المبكر والاستعداد بشكل أفضل للاختبارات النهائية.
            </p>
            
            <p style="direction: rtl;">
                نرفق لكم روابط تحميل الجداول حسب كل فرع، ويمكنكم الإطلاع عليها مباشرة من خلال الأزرار التالية:
            </p>

                <a href="https://t.me/JuPortalsa/195" target="_blank" style="padding: 10px; background-color: #0057b7; color: white; text-align: center; margin: 10px auto; border-radius: 8px; text-decoration: none;">
                    جدول اختبارات الطلاب
                </a>

                <a href="https://t.me/JuPortalsa/196" target="_blank" style="padding: 10px; background-color: #C91A98; color: white; text-align: center; margin: 10px auto; border-radius: 8px; text-decoration: none;">
                    جدول اختبارات الطالبات – فرع سدير
                </a>

                <a href="https://t.me/JuPortalsa/197" target="_blank" style="padding: 10px; background-color: #C91A98; color: white; text-align: center; margin: 10px auto; border-radius: 8px; text-decoration: none;">
                    جدول اختبارات الطالبات – فرع الفيحاء
                </a>
            

            <p style="direction: rtl; margin-top: 15px;">
                نتمنى لجميع الطلاب والطالبات التوفيق والنجاح في استعداداتهم للاختبارات 🌟
            </p>
        `,
        image: "https://i.postimg.cc/MKr7xqWQ/Gemini-Generated-Image-mdbpzgmdbpzgmdbp.png",
        date: "2025-12-09T12:00:00",
        author: "رائـد الزهـراني",
        category: "كلية الجبيل الصناعية"
    }, 
    {
        id: 9,
        title: "اطـلاق النسخـة الرسميـة لمنصة مدخـل 🥳",
        content: `
            <p style="direction: rtl;">
               وصلنا فوق 6000 زيارة للمنصة، واليوم نعلن عن تحديث جديد وقوي ينقلنا من طور التجريب الى النسخة الرسمية 🚀
هالتحديث ركّزنا فيه على الشكل، السرعة، وتجربة المستخدم… وفعلياً بيغيّر طريقة استخدامك للمنصة بشكل كبير 🔥
            </p>
            <p> ايش الجـديـد ؟ </p>
            <p>✨ عدّ تنازلي لأحداث الفصل الدراسي — تعرف كم باقي على المكافأت والاختبارات </p>
            <p>✨ ترتيب واعادة تصميم للصفحة الرئيسية — أبسط، أشمل، أوضح </p>
            <p>✨ أداة “صمّم جدولك الدراسي” — يحوّل لك الفترات لاوقات وتقدر تحفظه باكثر من صيغة ! </p>
            <p>🌙 الوضع الداكن — أنيق و رهيب لمحبين الدارك مود </p>
            <p>📚 تحديث كامل للأسئلة الشائعة — بحيث تتوافق مع اللوائح الجديدة 2025 </p>
            <p>📊 احسب نسبة غيابك للمحاضرة الوحدة — عشان تكون متأكد اكثر</p>
            <p>📱 إضافة المنصة لشاشة جوالك الرئيسية — تفتحها كتطبيق تماماً 🤩</p>

                <a href="https://juportal.online/404.html" target="_blank" style="padding: 10px; background-color: #004792ff; color: white; text-align: center; margin: 10px auto; border-radius: 8px; text-decoration: none;">
                    جـرب لعبـة مدخل السريـة 👀
                </a>
            
            <p style="direction: rtl; margin-top: 15px;">
              نشـرك للمنصة يساهم في استفادة العديد من الطلاب 🙏🙏
            </p>
        `,
        image: "https://i.postimg.cc/NFBmrYRh/aʿlan-mdkhl-2026.png",
        date: "2025-12-17T21:00:00",
        author: "رائـد الزهـراني",
        category: "منصـة مدخـل"
    },
    {
        id: 10,
        title: "📄 الاعلان عن الخطة الزمنية لاسكان طلاب كلية ومعهد الجبيل التقني ",
        content: `
            <p style="direction: rtl;">
              
📌 الخطة الزمنية لاسكان طلاب الكلية والمعهد التقني للفصل الدراسي 472

⏳يبدا التجديد غداً الخميس 18 ديسمبر .

🗓️ تمت اضافة جميع احداث الخطة الزمنية للتقويم التفاعلي بصفحة منصة مدخل الرئيسية 
            </p>
                <a href="https://juportal.online" target="_blank" style="padding: 10px; background-color: #004792ff; color: white; text-align: center; margin: 10px auto; border-radius: 8px; text-decoration: none;">
                  👀 شيك التقويم التفاعلي
                </a>
                <a href="https://t.me/JuPortalsa/257" target="_blank" style="padding: 10px; background-color: #004792ff; color: white; text-align: center; margin: 10px auto; border-radius: 8px; text-decoration: none;">
                 الاطلاع على ملف خطة التسكين الرسمية
                </a>
        `,
        image: "https://i.postimg.cc/SxqnPTPd/photo-5915583621177740085-y.jpg",
        date: "2025-12-19T21:00:00",
        author: "رائـد الزهـراني",
        category: "السكن الطلابي"
    },
    {
        id: 11,
        title: "📢 تلبيةً لاحتياجات الطلاب: مكتبة كلية الجبيل الصناعية تعلن عن تمديد ساعات العمل ",
        content: `
            <p style="direction: rtl;">
       في إطار سعيها المستمر لتوفير بيئة تعليمية داعمة ومحفزة للبحث والابتكار، أعلنت وكالة البحوث والتنمية الصناعية بالجبيل عن تمديد ساعات العمل في مكتبة كلية الجبيل الصناعية (فرع الطلاب).
            </p>
            
            <p style="direction: rtl;">
       تأتي هذه الخطوة استجابةً لتطلعات الطلاب ورغبتهم في الاستفادة من مرافق المكتبة ومصادرها المعرفية لفترات أطول، بما يخدم مسيرتهم الأكاديمية خلال العام الدراسي.
            </p> 
            <p>
            تفاصيل أوقات العمل الجديدة:

الأيام: من الأحد إلى الخميس.

الفترة الزمنية: ممتدة طوال العام الدراسي.

وقت الإغلاق: تستقبل المكتبة زوارها حتى الساعة 10:00 مساءً.</p>
<p>
وبهذا التمديد، تفتح الكلية أبواب المعرفة على نطاق أوسع، لتمنح طلابها فرصة أكبر للإبداع والتحصيل العلمي في أجواء مهيأة ومثالية.
</p>
        `,
        image: "https://i.postimg.cc/FF7DdrNY/Whats-App-Image-2025-12-08-at-11-36-46-PM.jpg",
        date: "2025-12-22T06:00:00",
        author: "رائـد الزهـراني",
        category: "مكتبة الكلية"
    },
    {
        id: 12,
        title: "🚀 إطلاق النسخة التجريبية لتطبيق الويب الخاص بـ 'مدخل'!",
        content: `
            <p style="direction: rtl;">
           حياكم الله .. يسعدنا أن نعلن لكم عن إطلاق <strong>النسخة التجريبية (Beta)</strong> من تطبيق "مدخل".
            </p>
            
            <p style="direction: rtl;">
            ربطنا تقريباً معظم المنصة في التطبيق المصغر هذا , واللي يعتبر تطبيق ويب يغنيك عن كثير مصادر ويختصر عليك
            </p>

            <p>
            لما تكون بصفحة التطبيق , اضغط علامة المشاركة بالمتصفح , ثم اضفط اضافة للشاشة الرئيسية او Add to screen عشان يصير تطبيق معك وين ما كنت
            </p>

            <p style="direction: rtl;">
           رايكم يصنع فرق , في حالة واجهتكم اي مشاكل او عندكم استفسارات , تقدر تتواصل معنا من خلال علامة الدردشة بالرئيسية
            </p>

            <div style="text-align: center; margin-top: 15px;">
                <p><strong>جرب التطبيق وثبته الآن:</strong></p>
                <a href="https://juportal.online/WebAppPage/index.html" target="_blank" style="display: inline-block; background-color: #0052cc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 15px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,82,204,0.3);">الدخول لنسخة التطبيق 📱</a>
            </div>
        `,
        image: "https://i.postimg.cc/zfGz2DDR/Gemini.png", // 👈 لا تنس تحط رابط الصورة الفخمة هنا
        date: "2025-12-26T09:00:00",
        author: "رائـد الزهـراني",
        category: "تطبيق مدخل"
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

