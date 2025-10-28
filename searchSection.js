let keyWords2 = [
    'كلية الجبيل الصناعية',
    "معهد الجبيل التقني", 
    "حساب الغيابات",
    "حساب المعدل", 
    "الأخبار",
    "خريطة الموقع",
    "المستندات والاسئلة الشائعة",
    "تخصصات بكالوريوس الكلية",
    "تخصصات دبلوم الكلية",
    "تخصصات دبلوم المعهد"
];

const resultBox2 = document.getElementById("result-box");
const inputBox2 = document.getElementById("search-section-input");

inputBox2.onkeyup = () => {
    let result = [];
    let input = inputBox2.value;
    if(input.length) {
        result = keyWords2.filter((keyword) => {
            return keyword.includes(input);
        });
    }
    display2(result)
}

function display2(result){
    const content = result.map((list) => {
        return "<li onclick=selectInput2(this)>" + list + "</li>"
    })

    resultBox2.innerHTML = `<ul>${content.join("")}</ul>`
}

function selectInput2(list){
    inputBox2.value = list.innerHTML
    resultBox2.innerHTML = ""
}

function searchResult2(){
    let searchInput = document.getElementById("search-section-input").value;
    switch(searchInput){
        case "كلية الجبيل الصناعية":
            window.location.href = "JICPage/jic.html";
            break;
        
        case "تخصصات بكالوريوس الكلية":
            window.location.href = "JICPage/bacholarMajors/bMajors.html"
            break;
        
        case "تخصصات دبلوم الكلية":
            window.location.href = "JICPage/deplomeMajors/depMajors.html"
            break;

        case "تخصصات دبلوم المعهد":
            window.location.href = "JTIPage/JTImajors/JTImajors.html"
            break;

        case "معهد الجبيل التقني":
            window.location.href = "JTIPage/JTI.html"
            break;

        case "حساب الغيابات":
            window.location.href = "absCalcPage/abs.html"
            break;

        case "حساب المعدل":
            window.location.href = "gpaPage/gpa.html"
            break;
            
        case "الأخبار" || "الاخبار":
            window.location.href = "newsPage/news.html"
            break;

        case "خريطة الموقع" || "خريطة مدخل":
            window.location.href = "webMapPage/webMap.html"
            break;

        case "المستندات والاسئلة الشائعة":
            window.location.href = "academicRegulationsPage/regulations.html"
            break;
    }
}

document.getElementById("search-section-button").addEventListener("click", () => {
    searchResult2()
    })

let searchInput2 = document.getElementById("search-section-input")
searchInput.addEventListener("keydown", () => {
    if (event.key === 'Enter'){
        searchResult2()
    }
})