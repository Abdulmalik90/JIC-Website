let keyWords = [
    'كلية الجبيل الصناعية',
    "معهد الجبيل التقني", 
    "حساب الغيابات",
    "حساب المعدل", 
    "الأخبار",
    "خريطة الموقع",
    "المستندات والاسئلة الشائعة",
    "تخصصات بكالوريوس الكلية",
    "تخصصات دبلوم الكلية",
    "تخصصات دبلوم المعهد",
    "اصنع جدولك"
];

const resultBox = document.querySelector(".result-search-box");
const inputBox = document.getElementById("search-input");

inputBox.onkeyup = () => {
    let result = [];
    let input = inputBox.value;
    if(input.length) {
        result = keyWords.filter((keyword) => {
            return keyword.includes(input);
        });
    }
    display(result)
}


function display(result){
    const content = result.map((list) => {
        return "<li onclick=selectInput(this)>" + list + "</li>"
    })

    resultBox.innerHTML = `<ul>${content.join("")}</ul>`
}


function selectInput(list){
    inputBox.value = list.innerHTML
    resultBox.innerHTML = ""
}


function searchResult(){
    let searchInput = document.getElementById("search-input").value;
    switch(searchInput){
        case "كلية الجبيل الصناعية":
            window.location.href = "/JICPage/jic.html";
            break;
        
        case "تخصصات بكالوريوس الكلية":
            window.location.href = "/JICPage/bacholarMajors/bMajors.html"
            break;
        
        case "تخصصات دبلوم الكلية":
            window.location.href = "/JICPage/deplomeMajors/depMajors.html"
            break;

        case "تخصصات دبلوم المعهد":
            window.location.href = "/JTIPage/JTImajors/JTImajors.html"
            break;

        case "معهد الجبيل التقني":
            window.location.href = "/JTIPage/JTI.html"
            break;

        case "حساب الغيابات":
            window.location.href = "/absCalcPage/abs.html"
            break;

        case "حساب المعدل":
            window.location.href = "/gpaPage/gpa.html"
            break;
            
        case "الأخبار" || "الاخبار":
            window.location.href = "/newsPage/news.html"
            break;

        case "خريطة الموقع" || "خريطة مدخل":
            window.location.href = "/webMapPage/webMap.html"
            break;

        case "المستندات والاسئلة الشائعة":
            window.location.href = "/academicRegulationsPage/regulations.html"
            break;
        
        case "اصنع جدولك" || "إصنع جدولك":
            window.location.href = "/createSchedulePage/schedule.html"
            break;

    }
}


document.getElementById("search-button").addEventListener("click", () => {
    searchResult()
    })

let searchInput = document.getElementById("search-input")
searchInput.addEventListener("keydown", () => {
    if (event.key === 'Enter'){
        searchResult()
    }
})


// Mobile menu functionality
const menuButton = document.getElementById('menu-button');
const closeMenu = document.getElementById('close-menu');
const mobileNav = document.getElementById('mobileNav');

menuButton.addEventListener('click', () => {
    mobileNav.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
});

closeMenu.addEventListener('click', () => {
    mobileNav.classList.remove('active');
  document.body.style.overflow = 'auto'; // Re-enable scrolling
});

// Close menu when clicking on a link
mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
    mobileNav.classList.remove('active');
    document.body.style.overflow = 'auto';
});
});

// Mobile search functionality (reuse your existing search logic)
const mobileSearchInput = document.getElementById('mobile-search-input');
const mobileSearchButton = document.getElementById('mobile-search-button');
const mobileResultBox = document.getElementById('mobile-result-box');

// Reuse your search functions but target the mobile elements
mobileSearchInput.onkeyup = () => {
    let result = [];
    let input = mobileSearchInput.value;
    if(input.length) {
    result = keyWords.filter((keyword) => {
        return keyword.includes(input);
    });
    }
    displayMobile(result);
}

function displayMobile(result){
    const content = result.map((list) => {
    return "<li onclick=selectMobileInput(this)>" + list + "</li>"
    })

    mobileResultBox.innerHTML = `<ul>${content.join("")}</ul>`
}

function selectMobileInput(list){
    mobileSearchInput.value = list.innerHTML
    mobileResultBox.innerHTML = ""
}

function searchMobileResult(){
    let searchInput = mobileSearchInput.value;
    switch(searchInput){
        case "كلية الجبيل الصناعية":
            window.location.href = "/JICPage/jic.html";
            break;
        
        case "تخصصات بكالوريوس الكلية":
            window.location.href = "/JICPage/bacholarMajors/bMajors.html"
            break;
        
        case "تخصصات دبلوم الكلية":
            window.location.href = "/JICPage/deplomeMajors/depMajors.html"
            break;

        case "تخصصات دبلوم المعهد":
            window.location.href = "/JTIPage/JTImajors/JTImajors.html"
            break;

        case "معهد الجبيل التقني":
            window.location.href = "/JTIPage/JTI.html"
            break;

        case "حساب الغيابات":
            window.location.href = "/absCalcPage/abs.html"
            break;

        case "حساب المعدل":
            window.location.href = "/gpaPage/gpa.html"
            break;
            
        case "الأخبار" || "الاخبار":
            window.location.href = "/newsPage/news.html"
            break;

        case "خريطة الموقع" || "خريطة مدخل":
            window.location.href = "/webMapPage/webMap.html"
            break;

        case "المستندات والاسئلة الشائعة":
            window.location.href = "/academicRegulationsPage/regulations.html"
            break;
        
        case "اصنع جدولك" || "إصنع جدولك":
            window.location.href = "/createSchedulePage/schedule.html"
            break;

    }
}

mobileSearchButton.addEventListener("click", () => {
    searchMobileResult();
});

mobileSearchInput.addEventListener("keydown", (event) => {
    if (event.key === 'Enter'){
    searchMobileResult();
    }
});


// dark/light theme toggle
const themeToggle = document.getElementById("dark-button");
const themeToggleMenu = document.getElementById("dark-button-menu");
const htmlElement = document.documentElement;

(function() {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        return; // We're done
    }

    // If no saved preference, check their system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
        htmlElement.setAttribute('data-theme', 'dark');
    }
    // No 'else' needed, as 'light' is the default
})();

function changeTheme(){
    // Get the current theme
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    // Toggle the theme
    if (currentTheme === 'dark') {
        // Change to light mode
        htmlElement.setAttribute('data-theme', 'light');
        // Save the preference
        localStorage.setItem('theme', 'light');
    } else {
        // Change to dark mode
        htmlElement.setAttribute('data-theme', 'dark');
        // Save the preference
        localStorage.setItem('theme', 'dark');
    }
}

// 7. Add the click event listener
themeToggle.addEventListener('click',changeTheme);
themeToggleMenu.addEventListener('click', changeTheme);
