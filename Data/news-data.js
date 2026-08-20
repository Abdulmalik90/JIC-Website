// news-data.js
const newsData = [
	
	{
    id: 1,
    title: " تـوزيع الاسابيع الدراسية 2026 🚀",
    content: `
توزيع اسابيع السنة الدراسية الجديدة لكليات ومعاهد الجبيل الصناعية وينبع الصناعية
     
    `,
    image: "https://i.postimg.cc/3NZtmyTr/11111.jpg",
    date: "2026-08-20T12:44:00",
    author: "رائد الزهراني",
    category: "الكليات والمعاهد"
},
{
    id: 2,
    title: " تهنئة الطلاب المستجدين 🫡",
    content: `
توزيع اسابيع السنة الدراسية الجديدة لكليات ومعاهد الجبيل الصناعية وينبع الصناعية
     
    `,
    image: "https://i.postimg.cc/bY0Kqwx6/IMG-5418.jpg",
    date: "2026-08-20T12:44:00",
    author: "رائد الزهراني",
    category: "الكليات والمعاهد"
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

