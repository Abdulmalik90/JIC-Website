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
const officeMan = new Majors("Office Management", "إدارة مكاتب", "business_center","دبلوم متوسط", 3, "./deplomesImgs/officeM.png", "بنين وبنات",  [
    {
        semester: 1,
        courses: [
            ["Principles of Management", 3, 0, 0, []],
            ["Arabic Typing Skills", 2, 0, 0, []],
            ["Word Processing I", 1, 0, 0, []],
            ["Academic Writing", 3, 0, 0, []],
            ["Physical Educaton", 1, 0, 0, []],
            ["Applied Finite Mathematics", 3, 0, 0, []],
            ["Princinples of Management Information Systems", 3, 0, 0, []],
        ]
    },
    {
        semester: 2,
        courses: [
            ["Accounting", 3, 0, 0, ["Applied Finite Mathematics"]],
            ["Word Processing II", 1, 0, 0, ["Word Processing I"]],
            ["Office Management I", 3, 0, 0, ["Princinples of Management"]],
            ["Microeconomics", 3, 0, 0, []],
            ["English Typing Skills", 2, 0, 0, []],
            ["Professional Communication", 3, 0, 0, ["Academic Writing"]],
            ["Arabic Language Foundation", 2, 0, 0, []],
        ]
    },
    {
        semester: 3,
        courses: [
            ["Organizational Behavior and Design", 3, 0, 0, ["Princinples of Management"]],
            ["Spreadsheet", 1, 0, 0, []],
            ["Office Management II", 3, 0, 0, ["Office Management I"]],
            ["Principles of Marketing", 3, 0, 0, ["Princinples of Management", "Microeconomics"]],
            ["Soft Skills", 3, 0, 0, []],
            ["Technical Writing", 3, 0, 0, ["Professional Communications"]],
            ["Islamic Culture", 2, 0, 0, []],
        ]
    },
    {
        semester: 4,
        courses: [
            ["Public Relations", 3, 0, 0, []],
            ["Legal Environment in Business", 3, 0, 0, []],
            ["Cooperative Work Experience", 3, 0, 0, []],
            ["Enterprise Resource Planning", 3, 0, 0, ["Principles of Management Information Systems", "Acaemic Writing"]],
            ["Human Resource Management", 3, 0, 0, ["Principles of Management"]],

        ]
    },
    {
        semester: 0,
        courses: [
            ["Introduction to Finance", 3, 0, 0, ["Accounting"]],
            ["Sales Managment", 3, 0, 0, ["Principles of Marketing"]],
            ["Total Quality Management", 3, 0, 0, ["Principles of Management"]],
            ["Business of Plan", 3, 0, 0, []],
            ["Business Process Management", 3, 0, 0, ["Princinples of Management", "Princinples of Management Information Systems"]],
        ]
    }
])
const it = new Majors("Information and Computer Technology", "الحاسب وتقنية المعلومات","computer",  "دبلوم متوسط", 3, "./deplomesImgs/it.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Computer Fundamentals", 3, 2, 3, []],
            ["Introduction to Web Design", 2, 1, 3, []],
            ["Introduction to Virtualization", 2, 1, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []],
            ["Islamic Culture", 2, 2, 0, []],
            ["Math for Information Technology", 3, 3, 0, []],
        ]
    },
    {
        semester: 2,
        courses: [
            ["Computer Network I", 3, 2, 3, ["Computer Fundamentals"]],
            ["PC Hardware Technology", 3, 2, 3, ["Computer Fundamentals"]],
            ["Database Concepts", 3, 2, 3, ["Computer Fundamentals"]], // Fixed typo
            ["Programming Concepts", 3, 2, 3, ["Math for Information Technology"]],
            ["Soft Skills", 3, 3, 0, []],
            ["Professional Communications", 3, 3, 0, ["Academic Writing"]],
        ]
    },
    {
        semester: 3,
        courses: [
            ["Introduction to Organizational Behavior and Ethics", 2, 2, 0, ["Academic Writing"]],
            ["Computer Network II", 3, 2, 3, ["Computer Network I"]], // Fixed typo
            ["PC Configuration and Troubleshooting", 2, 0, 4, ["Introduction to Virtualization", "PC Hardware Technology"]], // Fixed typo
            ["Network Operating Systems", 3, 2, 3, ["Introduction to Virtualization", "Computer Network I"]], // Fixed typo and added missing comma
            ["Enterprise Resource Planning", 3, 2, 2, ["Academic Writing"]],
            ["Computer Ethics", 2, 2, 0, ["Professional Communications"]],
            ["Technical Writing", 3, 3, 0, ["Professional Communications"]],
        ]
    },
    {
        semester: 4,
        courses: [
            ["Disaster Recovery", 3, 2, 3, ["PC Configuration and Troubleshooting"]],
            ["End-User Support", 3, 2, 3, ["PC Configuration and Troubleshooting"]], // Fixed typo
            ["System Administration", 3, 2, 3, ["Network Operating Systems"]], // Fixed typo
            ["Computer and Network Security", 3, 2, 3, ["Computer Network II", "Network Operating Systems"]], // Fixed typo
            ["COIT Project", 2, 0, 4, ["PC Configuration and Troubleshooting", "Network Operating Systems"]], // Fixed typo
        ]
    },
    {
        semester: 5,
        courses: [
            ["Cooperative Work Experience", 3, 0, 3, []], // Fixed typo
        ]
    },
    {
        semester: 0,
        courses: [
            ["Principles of Management", 3, 3, 0, []], // Fixed typo
            ["Microeconomics", 3, 3, 0,[]],
            ["Public Relations", 3, 3, 0, []],
            ["Project Management", 3, 3, 0, []],
            ["Wireless Technology", 3, 2, 3, ["Computer Network I"]],
            ["Cloud Computing", 3, 3, 0, []],
            ["Introduction to Data Science", 3, 3, 0, []],
            ["Introduction to Artificial Intelligence", 3, 3, 0, []], // Fixed typo
            ["Selected Topics in IT", 3, 3, 0, []],
            ["Principles of Management Information Systems", 3, 3, 0, []], // Fixed typo
        ]
    }
])
const chemTec = new Majors("Chemical engineering technology","تقنية الهندسة الكيميائية","experiment", "دبلوم متوسط", 3, "./deplomesImgs/chemicalTec.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Chemical Engineering Princinples", 2, 2, 0, []],
            ["Process Equipment", 2, 1, 2, []], 
            ["Computer Applications", 1, 0, 3, []], 
            ["Academic Writing", 3, 3, 0, []],
            ["Principles of Chemistry", 4, 3, 3, []],
            ["Islamic Culture", 2, 2, 0, []],
            ["Differential Calculus", 4, 4, 0, []],
        ]
    },
    {
        semester: 2,
        courses: [
            ["Organic Chemistry", 4, 3, 3, ["Princinples of Chemistry"]],
            ["Instrumentation and Process Control", 3, 2, 2, ["Process Equipment"]],
            ["Professional Communications", 3, 3, 0, ["Academic Weiting"]],
            ["Fundamental of Physics", 4, 3, 3, []], 
            ["Integral Calculus", 4, 4, 0, ["Differential Calculus"]],
        ]
    },
    {
        semester: 3,
        courses: [
            ["Introduction to Organizational Behavior and Ethics", 2, 2, 0, ["Academic Writing"]],
            ["Computer Applications in CHE", 1, 0, 3, ["Chemical Engineering Principles"]],
            ["Industrial Chemical Process", 2, 2, 0, ["Organic Chemistry"]],
            ["Reaction Kinetic and Reactors", 3, 2, 3, ["Chemical Engineering Princinples", "Integral Calculus"]],
            ["Chemical Engineering Thermodynamics I", 3, 2, 2, ["Chemical engineering Principles"]],
            ["Transport Process", 3, 2, 3, ["Chemical Engineering Principles"]],
            ["Physical Education", 1, 0, 2, []],
        ]
    },
    {
        semester: 4,
        courses: [
            ["Process Plant Safety", 2, 2, 0, []],
            ["Petroleum Refining Technology", 3, 2, 3, ["Organic Chemistry"]],
            ["Process Plant Simulation and Opirating", 2, 1, 3, ["Instrumentation and Process Control"]],
            ["Environmental Control", 2, 1, 2, []],
            ["CHET Project", 2, 0, 4, ["Instrumentation and Process Control"]],
            ["Seperarion Processes I", 3, 2, 3, ["Chemical Engineering Princinples"]],
            ["Cooperative Work Experience", 3, 0, 3, []],
            ["Engineering Drawing", 1, 0, 2, []],
        ]
    },
    {
        semester: 0,
        courses: [
            ["Peincinples of Management", 3, 3, 0, []],
            ["Microeconomics", 3, 3, 0, []],
            ["Industrial Chemistry Principles", 3, 2, 3, []],
            ["Inorganic Chemistry", 3, 2, 3, ["Principles of Chemistry"]],
            ["Polymer Science and Engineering", 3, 2 , 3, ["Principles of Chemistry"]],
            ["Soft Skills", 3, 3, 0, []],
            ["Enterprise Resource Planning", 3, 2, 2, []],
            ["Principles of Electrical Machines", 3, 3, 0, []],
            ["Principles of Control", 3, 3, 0, []],
            ["Digital Logic Fundamentals", 3, 3, 0, []],
            ["Renewable Energy Basics", 3, 3, 0, []],
            ["Principles of Management Information System", 3, 3, 0, []],
            ["Plant Maintanence", 3, 2, 2, []],
            ["Metallurgy", 3, 2, 2, ["Principles of Chemistry"]],
            ["Manufacruting Processes and NDT", 3, 2, 3, []]
        ]
    }
])
const elecTec = new Majors("Electrical power engineering technology", "تقنية هندسة القوى الكهربائية","bolt", "دبلوم متوسط", 3, "./deplomesImgs/ElectricTec.png", "بنين",[
    {
        semester: 1,
        courses: [
            ["Electrical Circuits I", 3, 2, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Fundamental of Physics", 4, 3, 3, []],
            ["Principles of Chemistry", 4, 3, 3, []],
            ["Differential Calculus", 4, 4, 0, []]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Electrical Machines I", 3, 2, 3, ["Electrical Circuits I"]],
            ["Electrical Circuits II", 3, 2, 3, ["Electrical Circuits I"]],
            ["Analogue Electronics", 3, 2, 3, ["Electrical Circuits I"]],
            ["Professional Communications", 3, 3, 0, ["Academic Writing"]],
            ["Islamic Culture", 2, 2, 0, []],
            ["Integral Calculus", 4, 4, 0, ["Differential Calculus"]],
        ]
    },
    {
        semester: 3,
        courses: [
            ["Instrumentation and Measurements I", 3, 2, 3, ["Fundamental of Physics"]],
            ["Digital Electronics", 3, 2, 3, []],
            ["Electrical Machines II", 3, 2, 3, ["Electrical Machine I", "Electrical Circuits II"]],
            ["Electrical Control and Protection I", 3, 2, 3, ["Electrical Machines I"]],
            ["Electrical Wiring", 2, 1, 3, [""]],
            ["Technical Writing", 3, 3, 0, ["Professional Communications"]],
            ["Physical Education", 1, 0, 2, []]
        ]
    },
    {
        semester: 4,
        courses: [
            ["Introduction to Orgnizational Behavior and Ethics", 2, 2, 0, ["Academic Writing"]],
            ["Power Electrics", 3, 2, 3, ["Analogue Electronics"]],
            ["transmission & Distribution of Electrical Energy", 3, 2, 3, ["Electrical Circuits II"]],
            ["EPET Project", 2, 0, 4, ["Electrical Machine II", "Electrical Control and Protection I"]],
            ["Electrical Troubleshooting", 1, 0, 3, ["Electrical Control and Protection I"]],
            ["PLC Applications", 3, 2, 3, ["Digital Electronics"]],
            ["Cooperative Work Experience", 3, 0, 3, []],
            ["Industrial Safety and Environment", 1, 1, 0, []]
        ]
    },
    {
        semester: 0,
        courses: [
            ["Principles of Management", 3, 3, 0, []],
            ["Microeconomics", 3, 3, 0, []],
            ["Industrial Chemistry", 3, 2, 3, ["Principles of Chemistry"]],
            ["Polymer Science and Engineering", 3, 2, 3, ["Principles of Chemistry"]],
            ["Soft skills", 3, 3, 0, []],
            ["Enterprise Resource Planning", 3, 2, 2, []],
            ["Principles of Control", 3, 3, 0, []],
            ["Principles of Management Information Systems", 3, 3, 0, []],
            ["Plant Maintenence", 3, 2, 2, []],
            ["Metallurgy", 3, 2, 2, ["Principles of Chemistry"]],
            ["Manufacturing Processes and NDT", 3, 2, 3, []]
        ]
    }
])
const instrumentationTec = new Majors("Instrumentation and Control Engineering Technology", "تقنية هندسة الآلات الدقيقة والتحكم","memory", "دبلوم متوسط", 3, "./deplomesImgs/InstrumentTec.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Academic Writing", 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []],
            ["Principles of Chemistry", 4, 3, 3, []],
            ["Fundamental of Physics", 4, 3, 3, []],
            ["Differential Calculus", 4, 4, 0, []],
            ["Industrial Safety and Environment", 1, 1, 0, []]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Electrical Circuits I", 3, 2, 3, []],
            ["Instrumentation and measurements I", 3, 2, 3, ["Fundamental of Physics"]],
            ["Digital Electronics", 3, 2, 3, []],
            ["Professional Communications", 3, 3, 0, ["Academic Writing"]],
            ["Islamic Culture", 2, 2, 0, []],
            ["Integral Calculus", 4, 4, 0, ["Differential Calculus"]],
        ]
    },
    {
        semester: 3,
        courses: [
            ["Analogue Electronics", 3, 2, 3, ["Electrical Circuits I"]],
            ["Instrumentation and Measuremens II", 3, 2, 3, ["Instrumentation and Measurements I"]],
            ["Industrial Control", 3, 2, 3, ["Instrumentation and MeasurementsI", "Integral Calculus"]],
            ["Introduction to Microcontrollers", 3, 2, 3, ["Digital Elctronics"]],
            ["PLC Applications", 3, 2, 3, ["Digital Electronics"]],
            ["Technical Writing", 3, 3, 0, ["Professional Communications"]],
        ]
    },
    {
        semester: 4,
        courses: [
            ["Introduction to Organizatoinal Behavior and Ethics", 2, 2, 0, ["Academic Writing"]],
            ["Electrical Machine and Control", 3, 2, 3, ["Electrical Circuits I"]],
            ["Instrumentation Engineering", 3, 2, 3, ["Instrumentation and Measurements II"]],
            ["ICET Project", 2, 0, 4, ["Analogue Elecronics", "Introduction to Microcontrollers"]],
            ["Programming for ICET", 3, 2, 3, ["Digital Electronics"]],
            ["Reading Process and Instrumentation Diagram", 2, 2, 0, ["Instrumentation and Measurements II", "Indusrial Control"]],
            ["Cooperative Work Expeience", 3, 0, 3, []]
        ]
    },
    {
        semester: 0,
        courses: [
            ["Principle of Management", 3, 3, 0, []],
            ["Microeconomics", 3, 3, 0, []],
            ["Industrial Chemistry Principles", 3, 2, 3, ["Principles of Chemistry"]],
            ["Polymer Science and Engineering", 3, 2, 3, ["Principles of Chemistry"]],
            ["Soft Skills", 3, 3, 0, []],
            ["Enerprise Resource Planning", 3, 2, 2, []],
            ["Principles of Electronics Machines", 3, 3, 0, []],
            ["Renewable Energy Basics", 3, 3, 0, []],
            ["Principles of Management Information Systems", 3, 3, 0, []],
            ["Plant Mainenance", 3, 2, 2, []],
            ["Metallurgy", 3, 2, 2, ["Principles of Chemistry"]],
            ["Manufacturing Process and NDT", 3, 2, 3, []]
        ]
    }
])
const manufacturingTec = new Majors("Manufacturing engineering technology", "تقنية هندسة التصنيع","precision_manufacturing", "دبلوم متوسط", 3, "./deplomesImgs/ManufacturingTec.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Academic Writing", 3, 3, 0, []],
            ["Fundamental of Physics", 4, 3, 3, []],
            ["Principle of Chemistry", 4, 3, 3, []],
            ["Differential Calculus", 4, 4, 0, []],
            ["Engineering Drawing", 1, 0, 2, []],
            ["Workshop Technology", 1, 0, 2, []],
            ["Introduction to Engineering Material", 1, 1, 0, []],
        ]
    }, 
    {
        semester: 2,
        courses: [
            ["Professional Communication", 3, 3, 0, ["Academic Writing"]],
            ["Physical Education", 1, 0, 2, []],
            ["Islamic culture", 2, 2, 0, []],
            ["Integral Calculus", 4, 4, 0, ["Differential Calculus"]],
            ["Industrial Safety and Environment", 1, 1, 0, []],
            ["Manufacturing Processes ", 4, 2, 6, ["Introduction to Engineering Material"]],
            ["Applied Mechanics", 3, 2, 2, ["Fundamental of Physics"]],
        ]
    }, 
    {
        semester: 3,
        courses: [
            ["Computer Applicaton", 1, 0, 3, []],
            ["Technical Writing", 3, 3, 0, ["Professional Communication"]],
            ["Strength of Materials", 3, 2, 3, ["Integral Calculus", "Applied Mechanics"]],
            ["Production Technical Drawing", 1, 2, 3, ["Engineering Drawing"]],
            ["Manufacturing Processes II", 4, 2, 4, ["Manufacturing Process I"]],
            ["Metallurgy", 3, 2, 2, ["Principle of Chemistry"]],
            ["Metrology and Quality Control", 2, 1, 2, ["Workshop Technology"]],
        ]
    },
    {
        semester: 4,
        courses: [
            ["Introduction to Organizational Behavior and Ethics", 2, 2, 0, ["Academic Writing"]],
            ["Electrical and Electronic Principle", 2, 1, 2, []],
            ["Mechanical CAD Applications", 1, 0, 3, ["Production Technical Drawing"]],
            ["Advanced Manufacturing Processes", 3, 2, 3, ["Manufacturing Prosses II"]],
            ["Welding and Inspection", 3, 2, 3, ["Manufacturing Prosses I", "Metallurgy"]],
            ["MAET Project", 2, 0, 4, ["Strength of Materials"]],
            ["Production planning and Control", 2, 1, 3, []],
            ["Cooperative Work Experience", 3, 0, 3, []],
        ]
    },
    {
        semester: 0,
        courses: [
            ["Principles of Management", 3, 3, 0, []],
            ["Microeconomics", 3, 3, 0, []],
            ["Industrial Chemistry Principle", 3, 2, 3, []],
            ["Inorganic Chemistry I", 3, 2, 3, ["Principle of Chemistry"]],
            ["Polymers Science and Engineering", 3, 2, 3, ["Principle of Chemistry"]],
            ["Soft Skills", 3, 3, 0, []],
            ["Enterprise Recourse planning", 3, 2, 2, []],
            ["Principle of Electrical Machines", 3, 3, 0, []],
            ["Principle of Control", 3, 3, 0, []],
            ["Digital Logic Fundamentals", 3, 3, 0, []],
            ["Renewable Energy Basics", 3, 3, 0, []],
            ["Principles of Management Information Systems", 3, 3, 0, []],
            ["Plant Maintenance", 3, 2, 2, []],
        ]
    }
])
const polyTec = new Majors("Polymer Engineering Technology", "تقنية هندسة البوليمرات", "polymer", "دبلوم متوسط", 3, "./deplomesImgs/polymer.png", "بنين", [
    {
        semester: 1,
        courses: [
            ["Introductin to Polymer Engineering", 2, 2, 0, []],
            ["Principles of Polymer Engineering", 2, 2, 0, []],
            ["Computer Applications", 1, 0, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Principles of Chemistry", 4, 3, 3, []],
            ["Islamic Culture", 2, 2, 0, []],
            ["Differential Calculus", 4, 4, 0, []],
        ]
    },
    {
        semester: 2,
        courses: [
            ["Polymer Materials", 3, 2, 3, ["Introduction to Polymer Engineering"]],
            ["Polymer Science and Engineering", 3, 2, 3, ["Principles of Polymer Engineering or Principles of Chemistry"]],
            ["Professional Communications", 3, 3, 0, ["Academic Writing"]],
            ["Fundamental of Physics", 4, 3, 3, []],
            ["Integral Calculus", 4, 4, 0, ["Differential Calculus"]],
            ["Industrial Safety and Environment", 1, 1, 0, []],
        ]
    },
    {
        semester: 3,
        courses: [
            ["Inroduction to Organizational Behavior and Ethics", 2, 2, 0, ["Academic Writing"]],
            ["Process Equipment", 2, 1, 2, []],
            ["Organic and Polymer Chemistry", 4, 3, 3, ["Principles of Chemistry"]],
            ["Polymer Processing I", 3, 2, 3, ["Polymer Materials"]],
            ["Plastic Prosuct Design", 3, 2, 3, ["Polymer Science and Engineering"]],
            ["technical Writing", 3, 3, 0, ["Frofessional Communications"]],
            ["Physical Education", 1, 0, 2, []]
        ]
    },
    {
        semester: 4,
        courses: [
            ["Instrumentation and Process Control", 3, 2, 2, ["Process Equipment"]],
            ["Industrial Polymerization", 3, 2, 3, ["Organic and Polymer Chemistry"]],
            ["Polymer Characterization and Testing", 3, 2, 3, ["Organic and Polymer Chemistry"]],
            ["Polymer Processing II", 3, 2, 3, ["Polymer Processing I"]],
            ["POLY Project", 2, 0, 4, ["Polymer Processing I or Plastic Product Design"]],
            ["Cooperative Work Expeience", 3, 0, 3, []],
        ]
    },
    {
        semester: 0,
        courses: [
            ["Principle of Managmenet", 3, 3, 0, []],
            ["Microeconomics", 3, 3, 0, []],
            ["Industrial Chemistry Principles", 3, 2, 3, []],
            ["Inorganic Chemistry I", 3, 2, 3, ["Principles of Chemistry"]],
            ["Soft Skills", 3, 3, 0, []],
            ["Enterprice Resource Planning", 3, 2, 2, []],
            ["Principles of Electrical Machines", 3, 3, 0, []],
            ["Principles of Control", 3, 3, 0, []],
            ["Digital Logic Principles", 3, 3, 0, []],
            ["Renewable Energy Baasics", 3, 3, 0, []],
            ["Principles of Management Information Systems", 3, 3, 0, []],
            ["Plan Maintenance", 3, 2, 2, []],
            ["Metallurgy", 3, 2, 2, ["Principles of Chemistry"]],
            ["Manufacturing Processes and NDT", 3, 2, 3, []]
        ]
    }
])
const chemIndTec = new Majors("Industrial chemistry technology", "تقنية الكيمياء الصناعية", "science", "دبلوم متوسط", 3, "./deplomesImgs/IndustrialChem.png", "بنين وبنات", [
    {
        semester: 1,
        courses: [
            ["Laboratory Safety", 1, 1, 0, []],
            ["Industrial Chemistry principles", 3, 2, 3, []],
            ["Computer Applications", 1, 0, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Physical Education", 1, 0, 2, []],
            ["Principles of Chemistry", 4, 3, 3, []],
            ["Differntial Calculus", 4, 4, 0, []],
        ]
    },
    {
        semester: 2,
        courses: [
            ["Introduction to Organizational Behaviorand Ethics", 2, 2, 0, ["Academic Writing"]],
            ["Oeganic Chemistry I", 4, 3, 3, ["Principles of Chemistry"]],
            ["Analytical Chemistry I", 3, 2, 3, ["Industrial Chemistry"]],
            ["Quality Control", 2, 2, 0, []],
            ["Professional Communications", 3, 3, 0, ["Academic Writing"]],
            ["Fundamental of Physics", 4, 3, 3, []],
        ]
    },
    {
        semester: 3,
        courses: [
            ["Physical Chemistry I", 4, 3, 3, ["Principles of Chemistry"]],
            ["Instrumental Analysis I", 3, 2, 3, ["Industrial Chemistry Principles"]],
            ["Organic Chemistry II", 3, 2, 3, ["Organic Chemistry I"]],
            ["Analytical Chemistry II", 3, 2, 3, ["Analytical Chemistry I"]],
            ["Technical Writing", 3, 3, 0, ["Professional Communications"]],
            ["Islamic Culure", 2, 2, 0, []],
        ]
    },
    {
        semester: 4,
        courses: [
            ["Inorganic Chemistry I", 3, 2, 3, ["Principles of Chemistry"]],
            ["Instrumental Analysis II", 3, 2, 3, ["Instrumental Analysis I"]],
            ["INCT Project", 2, 0, 4, ["Organic Chemisry II"]],
            ["Technicians Responesibility", 1, 1, 0, ["Instrumental Analysis I"]],
            ["Water and Wastewaer Analysis", 3, 2, 3, ["Analytical Chemistry I"]],
            ["Polymer Characterization and Testing", 3, 2, 3, ["Organic Chemistry II"]],
            ["Cooperative Work Experience", 3, 0, 3, []]
        ]
    },
    {
        semester: 0, 
        courses: [
            ["Principles of Management", 3, 3, 0, []],
            ["Microeconomics", 3, 3, 0, []],
            ["Polymer Science and Engineering", 3, 2, 3, ["Principles of Chemistry"]],
            ["Soft Skills", 3, 3, 0, []],
            ["Enterprise Resource Planning", 3, 2, 2, []],
            ["Principles of Electrical Machines", 3, 3, 0, []],
            ["Principles of Control", 3, 3, 0, []],
            ["Digital Logic Principles", 3, 3, 0, []],
            ["Renewable Energy Basics", 3, 3, 0, []],
            ["Principles of Management Information Systems", 3, 3, 0, []],
            ["Plant Maintenance", 3, 2, 2, []],
            ["Metallurgy", 3, 2, 2, ["Principles of Chemistry"]],
            ["Manufacturing Processes and NDT", 3, 2, 3, []]
        ]
    }
])
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
    window.location.href = "/JIC-Website/MajorPage/majorInfo.html";
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