class Majors{

    constructor(major, arabicName, icon, degree, years, imgs, genders, courses){
        this.major = major;
        this.arabicName = arabicName;
        this.icon = icon;
        this.degree = degree;
        this.years = years;
        this.imgs = imgs;
        this.genders = genders;
        this.courses = courses;
    }
}

// deplomas
const officeMan = new Majors("Office Management", "إدارة مكاتب", "business_center","دبلوم متوسط", 3, "./deplomesImgs/officeM.png", "بنين وبنات",  [])
const it = new Majors("Information and Computer Technology", "الحاسب وتقنية المعلومات","computer",  "دبلوم متوسط", 3, "./deplomesImgs/it.png", "بنين", [])
const chemTec = new Majors("Chemical engineering technology","تقنية الهندسة الكيميائية","experiment", "دبلوم متوسط", 3, "./deplomesImgs/chemicalTec.png", "بنين", [])
const elecTec = new Majors("Electrical power engineering technology", "تقنية هندسة القوى الكهربائية","bolt", "دبلوم متوسط", 3, "./deplomesImgs/ElectricTec.png", "بنين",[])
const instrumentationTec = new Majors("Instrumentation and Control Engineering Technology", "تقنية هندسة الآلات الدقيقة والتحكم","memory", "دبلوم متوسط", 3, "./deplomesImgs/InstrumentTec.png", "بنين", [])
const manufacturingTec = new Majors("Manufacturing engineering technology", "تقنية هندسة التصنيع","precision_manufacturing", "دبلوم متوسط", 3, "./deplomesImgs/ManufacturingTec.png", "بنين", [])
const polyTec = new Majors("Polymer Engineering Technology", "تقنية هندسة البوليمرات", "polymer", "دبلوم متوسط", 3, "./deplomesImgs/polymer.png", "بنين", [])
const chemIndTec = new Majors("Industrial chemistry technology", "تقنية الكيمياء الصناعية", "science", "دبلوم متوسط", 3, "./deplomesImgs/IndustrialChem.png", "بنين وبنات", [])
const mechanicalTec = new Majors("Mechanical maintenance engineering technology", "تقنية هندسة الصيانة الميكانيكية", "construction", "دبلوم متوسط", 3, "./deplomesImgs/MaintenanceTec.png", "بنين", [
    {
        semester: 0,
        courses: [
            
            ["Principles of Management", 3, 3, 0, []],
            ["Microeconomics", 3, 3, 0, []],
            ["Industrial Chemistry Principles", 3, 2, 3, []],
            ["Inorganic Chemistry I", 3, 2, 3, ["Principles of Chemistry"]],
            ["Polymer Science and Engineering", 3, 2, 3, ["Principles of Chemistry"]],
            ["Soft Skills", 3, 3, 0, []],
            ["Enterprise Resource Planning", 3, 2, 2, []],
            ["Principles of Electrical Machines", 3, 3, 0, []],
            ["Principles of Control", 3, 3, 0, []],
            ["Digital Logic Fundamentals", 3, 3, 0, []],
            ["Renewable Energy Basics", 3, 3, 0, []],
            ["Principles of Management Information System", 3, 3, 0, []],
            ["Metallurgy", 3, 2, 2, ["Principles of Chemistry"]],
            ["Manufacturing Processes and NDT", 3, 2, 3, []]
        ]
    },
    {
        semester: 1,
        courses: [
            ["Computer Applications", 1, 0, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Fundamentals of Physics", 4, 3, 3, []],
            ["Differential Calculus", 4, 4, 0, []],
            ["Engineering Drawing", 1, 0, 2, []],
            ["Workshop Technology", 1, 0, 2, []],
            ["Industrial Safety and Environment", 1, 1, 0, []],
            ["Plant Maintenance", 3, 2, 2, []]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Professional Communication", 3, 3, 0, ["Academic Writing"]],
            ["Principles of Chemistry", 4, 3, 3, []],
            ["Integral Calculus", 4, 4, 0, ["Differential Calculus"]],
            ["Introduction to Engineering Materials", 1, 1, 0, []],
            ["Fluid Mechanics", 3, 2, 2, ["Fundamentals of Physics"]],
            ["Applied Mechanics", 3, 2, 2, ["Fundamentals of Physics"]],
        ]
    },
    {
        semester: 3,
        courses: [
            ["Electrical Circuits I", 3, 2, 3, []],
            ["Technical Writing", 3, 3, 0, ["Professional Communication"]],
            ["Strength of Materials", 3, 2, 3, ["Integral Calculus", "Applied Mechanics"]],
            ["Applied Thermodynamics", 3, 2, 2, ["Fundamentals of Physics"]],
            ["Computer Aided Drafting", 1, 0, 3, ["Engineering Drawing"]],
            ["Metrology and Quality Control", 2, 1, 2, ["Workshop Technology"]],
            ["Pumping Machinery and Installations", 3, 2, 3, ["Fluid Mechanics"]]
        ]
    },
    {
        semester: 4,
        courses: [
            ["Intro to Organizational Behavior and Ethics", 2, 2, 0, ["Academic Writing"]],
            ["Physical Education", 1, 0, 2, []],
            ["Islamic Culture", 2, 2, 0, []],
            ["MMET Project", 2, 0, 4, ["Strength of Materials"]],
            ["Industrial Compressors", 3, 2, 2, ["Applied Thermodynamics"]], 
            ["Hydraulics and Pneumatics", 2, 1, 2, []],
            ["Power Generation Systems", 3, 2, 3, ["Applied Thermodynamics"]],
            ["Cooperative Work Experience", 3, 0, 3, []]
        ]
    }
])

const deplomas = [officeMan, it, chemTec, elecTec, instrumentationTec,
    manufacturingTec, polyTec,chemIndTec, mechanicalTec]

// link the buttons from index.html to majorInfo.html page
function goToMajorDetails(majorObj) {
    localStorage.setItem("selectedMajor", JSON.stringify(majorObj));
    window.location.href = "/MajorPage/majorInfo.html";
}

function generateMajorCards() {
    const container = document.getElementById('majors-container');
    
    deplomas.forEach(major => {
        const a = document.createElement('a');
        a.className = "major-a";
        a.addEventListener("click", () => goToMajorDetails(major));
        container.appendChild(a);
        
        const card = document.createElement('div');
        card.className = 'major-card';
        
        let iconGender = "wc";
        let genderColor = "green";
        if(major.genders == "بنين وبنات"){
            iconGender = "wc"
            genderColor = "green"
        } else if(major.genders == "بنات"){
            iconGender = "woman"
            genderColor = "purple"
        } else if(major.genders == "بنين"){
            iconGender = "man"
            genderColor = "blue"
        }
        card.innerHTML = `
            <img src="${major.imgs}" alt="${major.major}" class="major-image">
            <div class="major-name">${major.arabicName}</div>
            <span class="material-symbols-outlined major-icon fas">${major.icon}</span>
            <span class="material-symbols-outlined major-icon-gender fas" style="color:${genderColor};">${iconGender}</span>
        `;
        
        a.appendChild(card);
    });
}

// Generate the cards when the page loads
window.onload = generateMajorCards;