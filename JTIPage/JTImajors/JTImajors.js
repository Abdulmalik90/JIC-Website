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


const maintenance = new Majors("Industrial machinery maintenance skill", "مهارة صيانة الآلات الصناعية", "build", "الدبلوم المتوسط", 2, "./JTIimages/maintenanceSkill.png", "بنين", [])
const metalTurning = new Majors("metal turning and shaping skill", "مهارة خراطة وتشكيل المعادن", "dermatology", "الدبلوم المتوسط", 2, "./JTIimages/metalShaping.png", "بنين", [])
const welding = new Majors("Industrial welding skill", "مهارة اللحام الصناعي", "destruction", "الدبلوم متوسط", 2, "./JTIimages/welding.png", "بنين", [])
const operatingCranes = new Majors("Operating cranes and heavy equipment skill", "مهارة تشغيل الرافعات والمعدات الثقيلة", "precision_manufacturing", "الدبلوم المتوسط", 2, "./JTIimages/operatingCranes.png", "بنين",[])
const pipeLaying = new Majors("Pipe laying skill", "مهارة تمديد الأنابيب", "valve", "الدبلوم المتوسط", 2, "./JTIimages/pipeLaying.png", "بنين", [])
const industrialElec = new Majors("Industrial electricity skill", "مهارة الكهرباء الصناعية", "dynamic_form", "الدبلوم المتوسط", 2, "./JTIimages/IndustrialElectric.png", "بنين", [])
const INCT = new Majors("Industrial Instrumentation and Control Skills", "مهارات الآلات الدقيقة والتحكم", "./JTIimages/IndustrialElectric.png", "لدبلوم المتوسط", 2, "", "بنين", [
    {
        semester: 1, 
        courses: [
            ["Electrical Circuits", 3, 1, 5, []],
            ["Electronic Circuits", 3, 1, 5, []],
            ["Instruments Principles & Calibration and Maintenance", 3, 1, 5, []],
            ["Principles of Control", 3, 1, 5, []],
            ["Instrumentation Skills Practice 1", 2, 1, 2, []],
            ["English Communication", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Distributed Control System Operation (DCS)", 3, 1, 5, []],
            ["Electronic Circuits Troubleshooting", 3, 1, 5, []],
            ["Electronic Instrumentation", 3, 1, 5, []],
            ["PLC Programming and Interfacing & Micro-Controller", 3, 1, 5, []],
            ["Piping and Instrumentation Diagrams Reading", 2, 1, 2, []],
            ["Instrumentation Skills Practice 2", 2, 1, 2, ["Instrumentation Skills Practice 1"]],
            ["Technical Report Writing", 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []]
        ]
    },
    {
        semester: 3,
        courses: [
            ["Cooperative Training Program", 4, "15 Weeks", "600 Hours", []]
        ]
    }
const netWork = new Majors("Computer network management skill", "مهارة إدارة شبكات الحاسب الآلي", "network_check", "الدبلوم المتوسط", 2, "./JTIimages/ComputerNet.png", "بنين", [])
const industrialOp = new Majors("Factory operating skill", "مهارة تشغيل المصانع", "factory", "الدبلوم المتوسط", 2, "./JTIimages/factoryOp.png", "بنين", [])
const computerDrawing = new Majors("Computer drawing and design skills", "مهارة الرسم والتصميم بالحاسب الآلي", "draw", "الدبلوم المتوسط", 2, "./JTIimages/computerDrawing.png", "بنين وبنات", [])
const supportInfo = new Majors("IT Support and Security", "دعم وأمن تقنية المعلومات", "security", "الدبلوم المتوسط", 2, "./JTIimages/ITsupport.png", "بنات", [])

const deplomes = [maintenance, metalTurning, welding, operatingCranes, pipeLaying,
    industrialElec, netWork, industrialOp, computerDrawing, supportInfo
]



// link the buttons from index.html to majorInfo.html page
function goToMajorDetails(majorObj) {
    localStorage.setItem("selectedMajor", JSON.stringify(majorObj));
    window.location.href = "/MajorPage/majorInfo.html";
}

function generateMajorCards() {
    const container = document.getElementById('majors-container');
    
    deplomes.forEach(major => {
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
