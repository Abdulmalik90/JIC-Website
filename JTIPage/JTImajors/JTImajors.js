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


const maintenance = new Majors("Industrial Millwright Skills", "مهارة صيانة الآلات الصناعية", "build", "الدبلوم المتوسط", 2, "./JTIimages/maintenanceSkill.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Introduction to Maintenance", 2, 1, 4, []],
            ["Industrial Blueprint Reading", 2, 1, 3, []],
            ["Metal Fabrication", 3, 1, 5, []],
            ["Machine Elements", 3, 2, 3, []],
            ["Mechanical Power Transmissions", 3, 1, 4, []],
            ["Rigging and Hoisting", 3, 1, 4, []],
            ["English Communication" , 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []]
        ]
},
    {
        semester: 2,
        courses: [
            ["Hydraulics and Pneu-matics", 2, 1, 3, []],
            ["Machine Alignment", 2, 1, 3, []],
            ["Stationary Equipment", 3, 1, 5, []],
            ["Rotating Equipment", 4, 1, 7, []],
            ["Prime Movers", 3, 2, 2, []],
            ["Vibration Analysis", 2, 1, 3, []],
            ["Technical Report Writing", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []]
        ]
},
    {
        semester: 3, 
        courses: [
            ["Cooperative Training Program", 4, "15 Weeks", "600 Hours", []]
        ]
}
])
const metalTurning = new Majors("Industrial Machining Skills", "مهارة خراطة وتشكيل المعادن", "dermatology", "الدبلوم المتوسط", 2, "./JTIimages/metalShaping.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Mechanical Drawing", 1, 0, 2, []],
            ["Engineering Materials", 1, 0, 2, []],
            ["Metrology and Gauging", 2, 1, 2, []],
            ["General Machining Practices", 3, 1, 5, []],
            ["Lathe Operations", 5, 1, 9, []],
            ["Milling Operations", 3, 1, 6, []],
            ["English Communication", 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []]
        ]
},
    {
        semester: 2,
        courses: [
            ["Grinding Operations", 2, 1, 4, []],
            ["CNC Milling", 3, 1, 6, []],
            ["CNC Lathe", 3, 1, 4, []],
            ["Heat Treatment", 2, 1, 2, []],
            ["Non-Conventional Machining", 3, 1, 4, []],
            ["Manufacturing Project", 2, 1, 4, []],
            ["Technical Report Writing", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []]
        ]
},
    {
        semester: 3,
        courses: [
            ["Cooperative Training Program", 4, "15 Weeks", "600 Hours", []]
        ]
}
])
const welding = new Majors("Industrial welding skill", "مهارة اللحام الصناعي", "destruction", "الدبلوم متوسط", 2, "./JTIimages/welding.png", "بنين", [
    {
        semseter: 1,
        courses: [
            ["Symbols for Welding and Blueprint Reading", 1, 0, 2, []],
            ["Welding Process Technology", 1, 0, 2, []],
            ["Oxyacetylene Welding and Cutting", 2, 1, 3, []],
            ["Basic Shielded Metal Arc Welding", 4, 1, 7, []],
            ["Gas Metal Arc Welding and Flux Cored Arc Welding", 6, 2, 10, []],
            ["Weldability of Metal", 1, 0, 2, []],
            ["English Communication", 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []]
        ]
},
    {
        semester: 2,
        courses: [
            ["Advanced Shielded Metal Arc Welding", 6, 2, 10, []],
            ["Welding Inspection and Quality Control", 6, 2, 10, []],
            ["Project", 2, 1, 3, []],
            ["Technical Report Writing", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []]
        ]
},
    {
        semester: 3,
        courses: [
            ["Cooperative Training Program", 4, "15 Weeks", "600 Hours", []],
        ]
}
])
const operatingCranes = new Majors("Crane and Forklift Operation Skills", "مهارة تشغيل الرافعات ", "precision_manufacturing", "الدبلوم المتوسط", 2, "./JTIimages/operatingCranes.png", "بنين",[
    {
        semester: 1,
        courses: [
            ["Introduction to Crane Operation", 1, 0, 2, []],
            ["Rigging and Hoisting Practices", 3, 1, 5, []],
            ["Crane Safety", 1, 0, 2, []],
            ["Mobile Crane Operation I", 6, 2, 10, []],
            ["Hoisting Math Fundamentals", 4, 2, 6, []],
            ["English Communication", 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []]
        ]
},
    {
        semester: 2,
        courses: [
            ["Mobile Crane Operations II", 7, 3, 11, ["Mobile Crane Operations I"]],
            ["Forklift Operations", 3, 1, 5, []],
            ["Crane and Forklift Inspections", 2, 1, 3, []],
            ["Basic Maintenance for Crane and Forklift", 3, 1, 5, []],
            ["Technical Report Writing", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []]
        ]
},
    {
        semester: 3,
        courses: [
            ["Cooperative Training Program", 4, "15 Weeks", "600 Hours", []]
        ]
}
])
const pipeLaying = new Majors("Industrial Pipefitting Skills", "مهارة تمديد الأنابيب", "valve", "الدبلوم المتوسط", 2, "./JTIimages/pipeLaying.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Introduction to Pipefitting", 4, 2, 6, []],
            ["Weld Pipe Fabrication", 4, 1, 9, []],
            ["Non-Metallic Pipes", 2, 1, 2, []],
            ["Pipe Bending", 2, 1, 2, []],
            ["Blueprint Reading", 2, 1, 2, []],
            ["Rigging Operations", 2, 1, 2, []],
            ["English Communation", 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []]
        ]
},
    {
        semestre: 2,
        courses: [
            ["Advanced Pipefitting", 5, 2, 7, []],
            ["Pipe Fabrication", 5, 2, 7, []],
            ["Heat Exchangers", 1, 0, 2, []],
            ["Special Piping and Joints", 3, 1, 5, []],
            ["Project", 2, 1, 3, []],
            ["Technical Report Writing", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []]
        ]
},
    {
        semester: 3,
        courses: [
            ["Cooperative Training Program", 4, "15 weeks", "600 Hours", []]
            ]
}
])
const industrialElec = new Majors("Industrial Electrical Skill", "مهارة الكهرباء الصناعية", "dynamic_form", "الدبلوم المتوسط", 2, "./JTIimages/IndustrialElectric.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Electrical Circuits", 3, 1, 5, []],
            ["Electronic Circuits", 3, 1, 5, []],
            ["Electrical Wiring", 3, 1, 5, []],
            ["Electrical Machines", 3, 1, 5, []],
            ["NEC Code and Calculations", 2, 1, 2, []],
            ["Electrical Skills Practice 1", 2, 1, 2, []],
            ["English Communication", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []]
        ]
},
    {
        semester: 2,
        courses: [
            ["Electrical Power Distribution", 3, 1, 5, []],
            ["Electrical Motor Control", 3, 1, 5, []],
            ["Motor Winding", 3, 1, 5, []],
            ["Electrical Installation and Troubleshooting", 3, 1, 5, []],
            ["Electrical Blueprint Reading", 2, 1, 2, []],
            ["Electrical Skills Practice 2", 2, 1, 2, ["Electrical Skills Practice 1"]],
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
])
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
])
const netWork = new Majors("Network Administration Skills", "مهارة إدارة شبكات الحاسب الآلي", "network_check", "الدبلوم المتوسط", 2, "./JTIimages/ComputerNet.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Advanced Computer Applications", 2, 1, 4, []],
            ["Computer Hardware & Operating System", 2, 1, 4, []],
            ["PC Essentials", 3, 2, 3, []],
            ["Network Technology", 3, 2, 3, []],
            ["Nerwork Fundamentals", 4, 3, 4, []],
            ["Network Fundamentals-Integration", 1, 0, 3, []],
            ["English Communication", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []]
        ]
},
    {
        semester: 2,
        courses: [
            ["Routing Protocols and Accessing the WAN", 4, 2, 6, []],
            ["Routing Protocols and Accessing the WAN-Integration", 3, 1, 5, []],
            ["LAN Switching and WAN Technology", 4, 2, 6, []],
            ["LAN Switching and WAN Technology-Integration", 3, 1, 5, []],
            ["Networking Project", 1, 0, 2, []],
            ["Technical Report Writing", 3, 3, 0, []],
            ["Physical Education" , 2, 2, 0, []]
        ]
    },
    {
        semester: 3,
        courses: [
            ["Cooperative Training Program", 4, "15 Weeks", "600 Hours", []]
        ]
}
        
])
const industrialOp = new Majors("Process Operation Skills", "مهارات تشغيل العمليات", "factory", "الدبلوم المتوسط", 2, "./JTIimages/factoryOp.png", "بنين", [
    {
        semester: 1, 
        courses: [
            ["Process Technology I: Equipment", 4, 3, 3, []],
            ["Process Instrumentation", 3, 1, 5, []],
            ["Chemistry for Operators", 3, 1, 5, []],
            ["Applied Physics", 2, 1, 3, []],
            ["Industrial Safety", 2, 1, 3, []],
            ["Industrial Processes", 2, 1, 3 ,[]],
            ["English Communication", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Process Technology II: Systems & Operations", 4, 3, 3, ["Process Technology I: Equipment"]],
            ["Process Control", 3, 1, 5, []],
            ["Process Simulation", 3, 1, 5, []],
            ["Process Diagrams", 2, 1, 3, []],
            ["Process Troubleshooting", 2, 1, 3, []],
            ["Process Quality Control", 2, 1, 3, []],
            ["Technical Report Writing", 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []]
        ]
    },
    {
        semester: 3, 
        courses: [
            ["Cooperative Training Program", 4, "15 Weeks", "600 Hours", []],
            
])
const computerDrawing = new Majors("Computer drawing and design skills", "مهارة الرسم والتصميم بالحاسب الآلي", "draw", "الدبلوم المتوسط", 2, "./JTIimages/computerDrawing.png", "بنين وبنات", [
    {
    semester: 1,
    courses: [
        ["Advanced Computer Applications", 3, 2, 3, []],
        ["Operating System", 3, 2, 3, []],
        ["Cybersecurity Essentials", 2, 1, 2, []],
        ["Introduction to IoT", 2, 1, 2, []],
        ["Hardware Fundamentals", 3, 2, 3, []],
        ["Networking Essentials", 3, 2, 3, []],
        ["English Communication", 3, 3, 0, []],
        ["Islamic Culture", 2, 2, 0, []]
    ]
},
{
    semester: 2,
    courses: [
        ["IoT Applications", 3, 2, 2, []],
        ["Hardware and Soft Troubleshooting", 3, 2, 3, []],
        ["Network Security", 4, 2, 4, []],
        ["Cybersecurity Programming Tools", 4, 3, 3, []],
        ["Cybersecurity Project", 2, 1, 2, []],
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
])
const supportInfo = new Majors("IT Support and Security", "دعم وأمن تقنية المعلومات", "security", "الدبلوم المتوسط", 2, "./JTIimages/ITsupport.png", "بنات", [
    {
    semester: 1,
    courses: [
        ["Advanced Computer Applications", 3, 2, 3, []],
        ["Operating System", 3, 2, 3, []],
        ["Cybersecurity Essentials", 2, 1, 2, []],
        ["Introduction to IoT", 2, 1, 2, []],
        ["Hardware Fundamentals", 3, 2, 3, []],
        ["Networking Essentials", 3, 2, 3, []],
        ["English Communication", 3, 3, 0, []],
        ["Islamic Culture", 2, 2, 0, []]
    ]
},
{
    semester: 2,
    courses: [
        ["IoT Applications", 3, 2, 2, []],
        ["Hardware and Soft Troubleshooting", 3, 2, 3, []],
        ["Network Security", 4, 2, 4, []],
        ["Cybersecurity Programming Tools", 4, 3, 3, []],
        ["Cybersecurity Project", 2, 1, 2, []],
        ["Technical Report Writing", 3, 3, 0, []],
        ["Physical Education", 1, 0, 2, []]
    ]
}
])

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
