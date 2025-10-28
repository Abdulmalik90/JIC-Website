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

// Bachelors
const MechanicalEng = new Majors("Mechanical Engineering", "الهنـدسـة الميكـانيكيـة", "car_gear", "بكالوريوس", 5, "./majorsImages/mechanic.png", "البنين", [
    {
        semester: 1,
        courses: [
            ["General Chemistry I", 4, 3, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Arabic Language Foundation", 2, 2, 0, []],
            ["Calculus I", 4, 4, 0, []],
            ["Engineering Drawing and Graphics", 1, 0, 3, []],
            ["General Physics I", 4, 3, 3, ["Calculus I"]]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Statics", 3, 3, 0, ["General Physics I"]],
            ["Islamic Culture", 2, 2, 0, []],
            ["Calculus II", 4, 4, 0, ["Calculus I"]],
            ["Programming for Mechanical Engineers", 2, 1, 3, []],
            ["Machine Drawing", 2, 1, 3, ["Engineering Drawing and Graphics"]],
            ["Physical Education I", 1, 0, 2, []],
            ["General Physics II", 4, 3, 3, ["Calculus II", "General Physics I"]]
        ]
    },
    {
        semester: 3,
        courses: [
            ["Professional Communication", 3, 3, 0, ["Academic Writing"]],
            ["Arabic Communication Skills", 2, 2, 0, ["Arabic Language Foundation"]],
            ["Calculus III", 3, 3, 0, ["Calculus II"]],
            ["Thermodynamics I", 3, 3, 0, ["General Physics II"]],
            ["Materials Science", 3, 3, 0, ["General Chemistry I", "General Physics II"]],
            ["Mechanics of Materials", 3, 3, 0, ["Statics", "Calculus II"]],
            ["Materials Science & Testing Laboratory", 1, 0, 3, ["Materials Science", "Mechanics of Materials"]],
        ]
    },
    {
        semester: 4,
        courses: [
            ["Technical Writing", 3, 3, 0, ["Professional Communication"]],
            ["Professional Ethics in Islam", 2, 2, 0, ["Islamic Culture"]],
            ["Differential Equations and Linear Algebra", 3, 3, 0, ["Calculus III"]],
            ["Dynamics", 3, 3, 0, ["Statics"]],
            ["Manufacturing Processes", 3, 3, 0, ["Machine Drawing", "Materials Science", "Materials Science & Testing Laboratory"]],
            ["Manufacturing Laboratory", 1, 0, 3, ["Manufacturing Processes"]],
            ["Thermodynamics II", 3, 3, 0, ["Thermodynamics I"]]
        ]
    },
    {
        semester: 5,
        courses: [
            ["EE Principles and Applications", 2, 2, 0, ["Calculus II", "General Physics II"]],
            ["EE Principles and Applications Lab", 1, 0, 3, ["EE Principles and Applications"]],
            ["Probability and Statistics", 3, 2, 3, ["Calculus II"]],
            ["Theory of Machines", 3, 3, 0, ["Dynamics"]],
            ["Fluid Mechanics", 3, 3, 0, ["Calculus III", "Thermodynamics I", "Dynamics"]],
            ["Mechanical Engineering Design I", 3, 3, 0, ["Mechanics of Materials"]],
            ["Computational Mechanics", 2, 2, 0, ["Differential Equations and Linear Algebra", "Programming for Mechanical Engineers"]],
            ["Computational Mechanics Laboratory", 1, 0, 2, ["Computational Mechanics"]],
        ]
    },
    {
        semester: 6,
        courses: [
            ["Business Principles and Practices", 3, 3, 0, []],
            ["Introduction to Mechatronics", 3, 3, 0, ["EE Principles and Applications", "Programming for Mechanical Engineers"]],
            ["Heat Transfer", 3, 3, 0, ["Fluid Mechanics", "Thermodynamics II"]],
            ["Thermo-Fluids Laboratory", 1, 0, 3, ["Heat Transfer"]],
            ["Mechanical Engineering Design II", 3, 3, 0, ["Mechanical Engineering Design I"]],
            ["Mechanical Engineering Design II Laboratory", 1, 0, 3, ["Mechanical Engineering Design II"]],
            ["Capstone Design Project I", 1, 1, 0, ["Heat Transfer", "Mechanical Engineering Design II"]]
        ]
    },
    {
        semester: 7,
        courses: [
            ["Engineering Economics", 3, 3, 0, []],
            ["Health, Safety & Environment", 1, 1, 0, []],
            ["Measurements and Control Laboratory", 1, 0, 3, ["System Dynamics & Control"]],
            ["Capstone Design Project II", 2, 0, 6, ["Capstone Design Project I"]],
            ["System Dynamics & Control", 2, 2, 0, ["Introduction to Mechatronics", "Differential Equations and Linear Algebra"]]
        ]
    },
    {
        semester: 8,
        courses: [
            ["Field Training", 3, 0, 3, []]
        ]
    },
    {
        semester: 0, // All elective courses
        courses: [
            ["Finite Element Analysis", 3, 3, 0, ["Heat Transfer", "Mechanical Engineering Design II"]],
            ["Advanced Manufacturing Processes", 3, 3, 0, ["Manufacturing Processes"]],
            ["Turbomachinery", 3, 3, 0, ["Fluid Mechanics", "Thermodynamics II"]],
            ["Pumping Machinery", 3, 3, 0, ["Fluid Mechanics"]],
            ["Fluid Power Systems", 3, 3, 0, ["Fluid Mechanics"]],
            ["Production Engineering", 3, 3, 0, ["Mechanical Engineering Design I"]],
            ["Mechanical Vibrations", 3, 3, 0, ["Theory of Machines"]],
            ["Energy Efficient Buildings", 3, 3, 0, ["Heat Transfer"]],
            ["Energy Systems Engineering", 3, 3, 0, ["Thermodynamics II"]],
            ["Building Energy Informatics", 3, 3, 0, ["Programming for Mechanical Engineers", "Thermodynamics II"]],
            ["Geothermal Energy Engineering", 3, 3, 0, ["Thermodynamics II", "Heat Transfer"]],
            ["Wind Energy Engineering", 3, 3, 0, ["Fluid Mechanics"]],
            ["Design for Environment", 3, 3, 0, ["Thermodynamics II"]],
            ["Energy Efficient Manufacturing", 3, 3, 0, ["Manufacturing Processes"]],
            ["Internal Combustion Engines", 3, 3, 0, ["Thermodynamics II"]],
            ["Compressible Fluid Flow", 3, 3, 0, ["Fluid Mechanics"]],
            ["Heat Exchangers", 3, 3, 0, ["Heat Transfer"]],
            ["Metallurgy", 3, 3, 0, ["Manufacturing Processes"]],
            ["Corrosion Engineering", 3, 3, 0, ["Manufacturing Processes"]],
            ["Computational Fluid Dynamics", 3, 3, 0, ["Heat Transfer"]],
            ["Additive Manufacturing", 3, 3, 0, ["Programming for Mechanical Engineers", "Manufacturing Processes"]],
            ["Air Conditioning and Refrigeration", 3, 3, 0, ["Thermodynamics II", "Heat Transfer"]],
            ["Introduction to Fuel Cells", 3, 3, 0, ["Heat Transfer"]],
            ["Industrial Noise & Control", 3, 3, 0, ["Theory of Machines"]],
            ["Energy Conversion", 3, 3, 0, ["Theory of Machines"]],
            ["Legal Environment in Business", 3, 3, 0, []],
            ["Chemistry of Materials and Environment", 3, 3, 0, ["General Chemistry I"]],
            ["Green Chemistry and Engineering", 3, 3, 0, ["General Chemistry I"]],
            ["Chemistry of Petrochemical Processes", 3, 3, 0, ["General Chemistry I"]],
            ["Water Treatment and Desalination", 3, 3, 0, ["General Chemistry I"]],
            ["Nanomaterials", 3, 3, 0, ["General Chemistry I"]],
            ["Enterprise Resource Planning", 3, 2, 2, ["Academic Writing"]],
            ["Principle of Automation", 3, 2, 3, ["Calculus II"]],
            ["Engineering Mathematics", 3, 3, 0, ["Differential Equations and Linear Algebra"]],
            ["Operations Research", 3, 3, 0, ["Differential Equations and Linear Algebra"]],
            ["Solar Energy Engineering", 3, 3, 0, []],
            ["Energy Conservation", 3, 3, 0, []],
            ["Maintenance Engineering", 3, 3, 0, []],
            ["Renewable Energy Systems", 3, 3, 0, []],
            ["Sustainable Energy Engineering", 3, 3, 0, []],
            ["General Physics 3", 3, 3, 0, ["General Physics II"]],
            ["Modern Physics", 3, 3, 0, ["General Physics II"]],
            ["Nano Science", 3, 3, 0, ["General Physics II"]]
        ]
    }
])
const ManagementInfo = new Majors("Management Information Systems", "نظـم المعلـومـات الإداريـة", "database", "بكالوريوس", 5, "./majorsImages/manegement.png", "البنين والبنات", [
    {
        semester: 1,
        courses: [
            ["Principles of Management", 3, 3, 0, []],
            ["Programming I", 3, 2, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Islamic Culture", 2, 2, 0, []],
            ["Applied Finite Mathematics", 3, 3, 0, []],
            ["Computer Applications", 3, 2, 2, []]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Introduction to Financial Accounting I", 3, 3, 0, ["Applied Finite Mathematics"]],
            ["Microeconomics", 3, 3, 0, []],
            ["Professional Communication", 3, 3, 0, ["Academic Writing"]],
            ["Arabic Language Foundation", 2, 2, 0, []],
            ["Applied Calculus", 3, 3, 0, ["Applied Finite Mathematics"]],
            ["Principles of Management Information Systems", 3, 3, 0, []],
            ["Physical Education I", 1, 0, 2, []]
        ]
    },
    {
        semester: 3,
        courses: [
            ["Introduction to Financial Accounting II", 3, 3, 0, ["Introduction to Financial Accounting I"]],
            ["Macroeconomics", 3, 3, 0, ["Microeconomics"]],
            ["Programming II", 4, 3, 3, ["Programming I"]],
            ["Professional Ethics in Islam", 2, 2, 0, ["Islamic Culture"]],
            ["Business Statistics I", 3, 2, 3, ["Applied Finite Mathematics"]],
            ["Business System Analysis & Design I", 3, 3, 0, ["Computer Applications", "Principles of Management Information Systems"]]
        ]
    },
    {
        semester: 4,
        courses: [
            ["Financial Management", 3, 3, 0, ["Introduction to Financial Accounting II", "Macroeconomics"]],
            ["Principles of Marketing", 3, 3, 0, ["Principles of Management", "Microeconomics"]],
            ["Human Resource Management", 3, 3, 0, ["Principles of Management"]],
            ["Business Statistics II", 3, 2, 3, ["Business Statistics I"]],
            ["Fundamentals of E-Commerce", 3, 2, 2, ["Programming I", "Principles of Management Information Systems"]],
            ["Business System Analysis & Design II", 3, 3, 0, ["Business System Analysis & Design I"]]
        ]
    },
    {
        semester: 5,
        courses: [
            ["Organizational Behavior and Design", 3, 3, 0, ["Principles of Management"]],
            ["Operations Management", 3, 3, 0, ["Business Statistics I"]],
            ["Technical Writing", 3, 3, 0, ["Professional Communication"]],
            ["Business Data Management", 3, 2, 2, ["Computer Applications"]],
            ["Information Systems Security", 3, 3, 0, ["Principles of Management Information Systems"]],
            ["IS Project Management", 3, 3, 0, ["Financial Management", "Business System Analysis & Design I"]]
        ]
    },
    {
        semester: 6,
        courses: [
            ["Legal Environment in Business", 3, 3, 0, []],
            ["Business Research Methods", 3, 3, 0, ["Principles of Management", "Business Statistics II"]],
            ["Computer Communications", 3, 3, 0, []],
            ["Arabic Communication Skills", 2, 2, 0, ["Arabic Language Foundation"]],
            ["Intelligent Support Systems in Business", 3, 2, 2, ["Business Data Management"]],
        ]
    },
    {
        semester: 7,
        courses: [
            ["Strategic Management", 3, 3, 0, ["Financial Management", "Principles of Marketing"]],
            ["Information Resources Management", 3, 3, 0, ["Computer Communications", "Business System Analysis & Design II"]],
            ["Enterprise Resource Planning", 3, 2, 2, ["Business Data Management"]],
            ["Capstone Project", 3, 3, 0, ["Programming II", "Business Data Management", "Fundamentals of E-Commerce", "Business System Analysis & Design II"]],
        ]
    },
    {
        semester: 8,
        courses: [
            ["Field Training", 3, 0, 3, []]
        ]
    },
    {
        semester: 0,
        courses: [
            ["Business Ethics", 3, 3, 0, ["Legal Environment in Business"]],
            ["Human Computer Interaction", 3, 3, 1, ["Programming II"]],
            ["Human Resource Information Systems", 3, 3, 0, ["Human Resource Management", "Principles of Management Information Systems"]],
            ["Knowledge Management", 3, 3, 0, ["Principles of Management", "Principles of Management Information Systems"]],
            ["Web Engineering and Development", 3, 2, 3, ["Programming II"]],
            ["Information Technology in Society", 3, 3, 0, ["Principles of Management", "Principles of Management Information Systems"]],
            ["Selected Topics in MIS", 3, 3, 0, ["IS Project Management"]]
        ]
    }
])
const InstrumentationEng = new Majors("Instrumentation & Control Eng.", "هندسة الآلات الـدقيقـة والتحـكم","memory", "بكالوريوس", 5, "./majorsImages/Instroment.png", "البنين", [
    {
        semester: 1,
        courses: [
            ["General Chemistry I", 4, 3, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Arabic Language Foundation", 2, 2, 0, []],
            ["Calculus I", 4, 4, 0, []],
            ["General Physics I", 4, 3, 3, ["Calculus I"]]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Professional Communication", 3, 3, 0, ["Academic Writing"]],
            ["Islamic Culture", 2, 2, 0, []],
            ["Arabic Communication Skills", 2, 2, 0, ["Arabic Language Foundation"]],
            ["Calculus II", 4, 4, 0, ["Calculus I"]],
            ["Health, Safety & Environment", 1, 1, 0, []],
            ["Physical Education I", 1, 0, 2, []],
            ["General Physics II", 4, 3, 3, ["Calculus II", "General Physics I"]]
        ]
    },
    {
        semester: 3,
        courses: [
            ["Business Principles and Practices", 3, 3, 0, []],
            ["Electrical Circuits Analysis I", 3, 3, 0, ["General Physics II"]],
            ["Electrical Circuits Analysis I Lab", 1, 0, 3, ["Electrical Circuits Analysis I"]],
            ["Digital Electronic Circuits", 2, 2, 0, []],
            ["Process Instrumentation I", 3, 3, 0, ["General Physics II"]],
            ["Calculus III", 3, 3, 0, ["Calculus II"]],
            ["Technical Writing", 3, 3, 0, ["Professional Communication"]]
        ]
    },
    {
        semester: 4,
        courses: [
            ["Analytical Instrumentation", 2, 2, 0, ["General Chemistry I", "Process Instrumentation I"]],
            ["Programming for Electrical Engineers", 3, 2, 3, ["Digital Electronic Circuits"]],
            ["Process Instrumentation II", 2, 2, 0, ["Process Instrumentation I"]],
            ["Industrial Control Applications", 2, 2, 0, ["Process Instrumentation I", "Calculus II"]],
            ["Analogue Electronic Circuits", 2, 2, 0, ["Electrical Circuits Analysis I"]],
            ["Process Instrumentation Lab", 1, 0, 3, ["Process Instrumentation II"]],
            ["Industrial Control Lab", 1, 0, 3, ["Industrial Control Applications"]],
            ["Electronics Lab", 1, 0, 3, ["Digital Electronic Circuits", "Analogue Electronic Circuits"]],
            ["Differential Equations and Linear Algebra", 3, 3, 0, ["Calculus III"]]
        ]
    },
    {
        semester: 5,
        courses: [
            ["Signals and Systems", 3, 3, 0, ["Calculus III"]],
            ["Professional Ethics in Islam", 2, 2, 0, ["Islamic Culture"]],
            ["Programmable Logic Controllers", 3, 2, 3, ["Digital Electronic Circuits"]],
            ["Process and Instrumentation Diagram", 2, 2, 0, ["Process Instrumentation II", "Industrial Control Applications"]],
            ["Instrumentation Engineering Design", 3, 3, 0, ["Process Instrumentation II"]],
            ["Probability and Statistics", 3, 2, 3, ["Calculus II"]],
            ["Fluid Mechanics and Heat Transfer", 2, 2, 0, ["General Physics II"]]
        ]
    },
    {
        semester: 6,
        courses: [
            ["Engineering Economics", 3, 3, 0, []],
            ["Introduction to Artificial Intelligence", 2, 2, 0, ["Programming for Electrical Engineers"]],
            ["Communications Engineering", 3, 3, 0, ["Signals and Systems"]],
            ["Control Engineering", 3, 2, 3, ["Differential Equations and Linear Algebra"]],
            ["Capstone Design Project I", 1, 0, 3, ["Analogue Electronic Circuits", "Instrumentation Engineering Design"]],
            ["Industrial Electronics", 3, 3, 0, ["Analogue Electronic Circuits"]],
            ["Microcontroller Systems", 3, 2, 3, ["Digital Electronic Circuits"]]
        ]
    },
    {
        semester: 7,
        courses: [
            ["Digital System Design", 3, 3, 0, ["Digital Electronic Circuits"]],
            ["Process Control Applications", 3, 2, 3, ["Process and Instrumentation Diagram"]],
            ["Capstone Design Project II", 2, 0, 6, ["Capstone Design Project I"]],
            ["Maintenance Planning and Reliability", 1, 1, 0, []]
        ]
    },
    {
        semester: 8,
        courses: [
            ["Field Training", 3, 0, 3, []]
        ]
    },
    {
        semester: 0, // All elective courses
        courses: [
            ["Legal Environment in Business", 3, 3, 0, []],
            ["Chemistry of Materials and Environment", 3, 3, 0, ["General Chemistry I"]],
            ["Green Chemistry and Engineering", 3, 3, 0, ["General Chemistry I"]],
            ["Chemistry of Petrochemical Processes", 3, 3, 0, ["General Chemistry I"]],
            ["Corrosion Engineering", 3, 3, 0, ["General Chemistry I"]],
            ["Water Treatment and Desalination", 3, 3, 0, ["General Chemistry I"]],
            ["Nanomaterials", 3, 3, 0, ["General Chemistry I"]],
            ["Enterprise Resource Planning", 3, 2, 2, ["Academic Writing"]],
            ["Digital Control Systems", 3, 3, 0, ["Control Engineering"]],
            ["Fundamental of Electrical Machines Control", 3, 2, 3, ["Electrical Circuits Analysis I"]],
            ["Introduction to Renewable Energy System", 3, 3, 0, ["Electrical Circuits Analysis I"]],
            ["Engineering Mathematics", 3, 3, 0, ["Differential Equations and Linear Algebra"]],
            ["Operations Research", 3, 3, 0, ["Differential Equations and Linear Algebra"]],
            ["Solar Energy Engineering", 3, 3, 0, []],
            ["Energy Conservation", 3, 3, 0, []],
            ["Maintenance Engineering", 3, 3, 0, []],
            ["Sustainable Energy Engineering", 3, 3, 0, []],
            ["General Physics 3", 3, 3, 0, ["General Physics II"]],
            ["Modern Physics", 3, 3, 0, ["General Physics II"]],
            ["Nano Science", 3, 3, 0, ["General Physics II"]],
            ["Digital Signal Processing", 3, 3, 0, ["Signals and Systems"]],
            ["Embedded Systems", 3, 3, 0, ["Microcontroller Systems"]],
            ["Machine Learning", 3, 3, 0, ["Introduction to Artificial Intelligence"]],
            ["Advanced PLC", 3, 2, 3, ["Programmable Logic Controllers"]],
            ["Control Valves and Actuators", 3, 3, 0, ["Instrumentation Engineering Design"]]
        ]
    }
])
const ElectricalEng = new Majors("Electrical Engineering", "الهنـدسـة الكهـربائيـة", "electric_bolt", "بكالوريوس", 5, "./majorsImages/Electric.png", "البنين", [
    {
        semester: 1,
        courses: [
            ["General Chemistry I", 4, 3, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Arabic Language Foundation", 2, 2, 0, []],
            ["Calculus I", 4, 4, 0, []],
            ["Physical Education I", 1, 0, 2, []],
            ["General Physics I", 4, 3, 3, ["Calculus I"]]
        ]
    },
    {
        semester: 2,
        courses: [
            ["Professional Communication", 3, 3, 0, ["Academic Writing"]],
            ["Islamic Culture", 2, 2, 0, []],
            ["Digital Electronic Circuits", 2, 2, 0, []],
            ["Calculus II", 4, 4, 0, ["Calculus I"]],
            ["Engineering Drawing and Graphics", 1, 0, 3, []],
            ["Health, Safety & Environment", 1, 1, 0, []],
            ["Maintenance Planning and Reliability", 1, 1, 0, []],
            ["General Physics II", 4, 3, 3, ["Calculus II", "General Physics I"]]
        ]
    },
    {
        semester: 3,
        courses: [
            ["Engineering Economics", 3, 3, 0, []],
            ["Electrical Circuits Analysis I", 3, 3, 0, ["General Physics II"]],
            ["Electrical Circuits Analysis I Lab", 1, 0, 3, ["Electrical Circuits Analysis I"]],
            ["Technical Writing", 3, 3, 0, ["Professional Communication"]],
            ["Engineering Instrumentation and Measurement", 2, 2, 0, ["General Physics II"]],
            ["Programming for Electrical Engineers", 3, 2, 3, ["Digital Electronic Circuits"]],
            ["Calculus III", 3, 3, 0, ["Calculus II"]]
        ]
    },
    {
        semester: 4,
        courses: [
            ["Electromagnetism", 2, 2, 0, ["Calculus III", "General Physics II"]],
            ["Electrical Circuits Analysis II", 2, 2, 0, ["Electrical Circuits Analysis I"]],
            ["Electrical Circuits Analysis II Lab", 1, 0, 3, ["Electrical Circuits Analysis II"]],
            ["Arabic Communication Skills", 2, 2, 0, ["Arabic Language Foundation"]],
            ["Analogue Electronic Circuits", 2, 2, 0, ["Electrical Circuits Analysis I"]],
            ["Electronics Lab", 1, 0, 3, ["Digital Electronic Circuits", "Analogue Electronic Circuits"]],
            ["Microcontroller Systems", 3, 2, 3, ["Digital Electronic Circuits"]],
            ["Differential Equations and Linear Algebra", 3, 3, 0, ["Calculus III"]],
            ["Fluid Mechanics and Heat Transfer", 2, 2, 0, ["General Physics II"]]
        ]
    },
    {
        semester: 5,
        courses: [
            ["Power Electronics Circuits", 3, 3, 0, ["Analogue Electronic Circuits"]],
            ["Signals and Systems", 3, 3, 0, ["Calculus III"]],
            ["Electric Machines", 3, 3, 0, ["Electromagnetism"]],
            ["Electric Machines Lab", 1, 0, 3, ["Electric Machines"]],
            ["Introduction to Artificial Intelligence", 2, 2, 0, ["Programming for Electrical Engineers"]],
            ["Control Engineering", 3, 2, 3, ["Differential Equations and Linear Algebra"]],
            ["Probability and Statistics", 3, 2, 3, ["Calculus II"]]
        ]
    },
    {
        semester: 6,
        courses: [
            ["Capstone Design Project I", 1, 0, 3, ["Electric Machines", "Programming for Electrical Engineers"]],
            ["Communications Engineering", 3, 3, 0, ["Signals and Systems"]],
            ["Renewable Energy Systems", 2, 2, 0, ["Power Electronics Circuits"]],
            ["Electrical Power Engineering", 2, 2, 0, ["Electrical Circuits Analysis II", "Electric Machines"]],
            ["Electric Drive Systems", 3, 3, 0, ["Power Electronics Circuits", "Electric Machines"]],
            ["Electrical Power Engineering Lab", 1, 0, 3, ["Electrical Power Engineering"]],
            ["Power Electronics and Drives Lab", 1, 0, 3, ["Electric Drive Systems"]],
            ["Professional Ethics in Islam", 2, 2, 0, ["Islamic Culture"]],
            ["PLC Applications", 2, 1, 3, ["Digital Electronic Circuits"]]
        ]
    },
    {
        semester: 7,
        courses: [
            ["Business Principles and Practices", 3, 3, 0, []],
            ["Electrical Systems Protection", 2, 2, 0, ["Electrical Power Engineering"]],
            ["Electrical Systems Protection Lab", 1, 0, 3, ["Electrical Systems Protection"]],
            ["Capstone Design Project II", 2, 0, 6, ["Capstone Design Project I"]]
        ]
    },
    {
        semester: 8,
        courses: [
            ["Field Training", 3, 0, 3, []]
        ]
    },
    {
        semester: 0, // Electives and additional courses
        courses: [
            ["Legal Environment in Business", 3, 3, 0, []],
            ["Chemistry of Materials and Environment", 3, 3, 0, ["General Chemistry I"]],
            ["Green Chemistry and Engineering", 3, 3, 0, ["General Chemistry I"]],
            ["Chemistry of Petrochemical Processes", 3, 3, 0, ["General Chemistry I"]],
            ["Corrosion Engineering", 3, 3, 0, ["General Chemistry I"]],
            ["Water Treatment and Desalination", 3, 3, 0, ["General Chemistry I"]],
            ["Nanomaterials", 3, 3, 0, ["General Chemistry I"]],
            ["Enterprise Resource Planning", 3, 2, 2, ["Academic Writing"]],
            ["Digital Signal Processing", 3, 3, 0, ["Signals and Systems"]],
            ["Embedded Systems", 3, 3, 0, ["Microcontroller Systems"]],
            ["Machine Learning", 3, 3, 0, ["Introduction to Artificial Intelligence"]],
            ["Principle of Automation", 3, 2, 3, ["Calculus II"]],
            ["Engineering Mathematics", 3, 3, 0, ["Differential Equations and Linear Algebra"]],
            ["Operations Research", 3, 3, 0, ["Differential Equations and Linear Algebra"]],
            ["Solar Energy Engineering", 3, 3, 0, []],
            ["Energy Conservation", 3, 3, 0, []],
            ["Maintenance Engineering", 3, 3, 0, []],
            ["Sustainable Energy Engineering", 3, 3, 0, []],
            ["General Physics 3", 3, 3, 0, ["General Physics II"]],
            ["Modern Physics", 3, 3, 0, ["General Physics II"]],
            ["Nano Science", 3, 3, 0, ["General Physics II"]],
            ["High Voltage Engineering", 3, 3, 0, ["Power Electronics Circuits"]],
            ["Digital Control Systems", 3, 3, 0, ["Control Engineering"]],
            ["Power System Analysis", 3, 3, 0, ["Electrical Power Engineering"]],
            ["Electrical Machine Design", 3, 3, 0, ["Electric Machines"]],
            ["Smart Grid", 3, 3, 0, ["Electrical Power Engineering"]],
            ["Energy Storage System", 3, 3, 0, ["Electrical Power Engineering"]],
            ["Drive System Lab", 1, 0, 3, ["Electric Drive Systems"]],
            ["Renewable Energy Systems Lab", 1, 0, 3, ["Renewable Energy Systems"]]
        ]
    }
])
const cs = new Majors("Computer Science", "علــوم الحـاسـب", "laptop_chromebook", "بكالوريوس", 5, "./majorsImages/CS.png", "البنين والبنات", [{
    semester: 0,
    courses: [
        ["Cloud Computing", 3, 3, 1, ["Computer Network Systems"]],
        ["Data Warehousing and Data Mining", 3, 3, 1, ["Database Systems"]],
        ["Special Topics", 3, 3, 0, ["Computer Network Systems", "Database Systems"]],
        ["Human Computer Interaction", 3, 3, 1, ["Programming II"]],
        ["Mobile Application Development", 3, 2, 3, ["Data Structures"]],
        ["Systems and Network Administration", 3, 2, 3, ["Web Engineering and Development", "Operating Systems"]],
        ["Advanced Network Security", 3, 3, 1, ["Cybersecurity"]],
        ["Cryptography", 3, 2, 3, ["Cybersecurity"]],
        ["Web Security", 3, 2, 3, ["Web Engineering and Development"]],
        ["Penetration Testing and Ethical Hacking", 3, 3, 0, ["Cybersecurity", "Computer Network Systems"]],
        ["Machine Learning", 3, 3, 0, ["Introduction to Artificial Intelligence", "Probability and Statistics"]]
    ]},
    {
    semester: 1,
    courses: [
        ["Computer Programming", 3, 2, 3, []],
        ["Academic Writing", 3, 3, 0, []],
        ["Arabic Language Foundation", 2, 2, 0, []],
        ["Calculus I", 4, 4, 0, []],
        ["Physical Education I", 1, 0, 2, []],
        ["General Physics I", 4, 3, 3, ["Calculus I"]]
    ]},
    {
    semester: 2,
    courses: [
        ["Programming I", 3, 2, 3, []],
        ["Professional Communication", 3, 3, 0, ["Academic Writing"]],
        ["Islamic Culture", 2, 2, 0, []],
        ["Calculus II", 4, 4, 0, ["Calculus I"]],
        ["General Physics II", 4, 3, 3, ["Calculus II", "Physics I"]]
    ]},
    {
    semester: 3,
    courses: [
        ["Digital Logic Design", 4, 3, 3, ["General Physics I"]],
        ["Programming II", 4, 3, 3, ["Programming I"]],
        ["Discrete Structures I", 3, 3, 0, ["Calculus I"]],
        ["Technical Writing", 3, 3, 0, ["Professional Communication"]],
        ["Calculus III", 3, 3, 0, ["Calculus II"]]
    ]},
    {
    semester: 4,
    courses: [
        ["Discrete Structures II", 3, 3, 0, ["Discrete Structures I"]],
        ["Data Structures", 4, 3, 3, ["Programming II"]],
        ["Computer Architecture and Organization", 4, 3, 3, ["Digital Logic Design"]],
        ["Arabic Communication Skills", 2, 2, 0, ["Arabic Language Foundation"]],
        ["Differential Equations and Linear Algebra", 3, 3, 0, ["Calculus III"]]
    ]},
    {
    semester: 5,
    courses: [
        ["Design and Analysis of Algorithms", 3, 3, 0, ["Data Structures", "Discrete Structures II"]],
        ["Computer Network Systems", 4, 3, 3, ["Computer Architecture and Organization"]],
        ["Software Engineering", 3, 3, 1, ["Data Structures"]],
        ["Database Systems", 3, 2, 3, ["Data Structures"]],
        ["Professional Ethics in Islam", 2, 2, 0, ["Islamic Culture"]],
        ["Probability and Statistics", 3, 2, 3, ["Calculus II"]]
    ]},
    {
    semester: 6,
    courses: [
        ["Operating Systems", 4, 3, 3, ["Data Structures", "Computer Architecture and Organization"]],
        ["Web Engineering and Development", 3, 2, 3, ["Database Systems"]],
        ["Capstone Project I", 1, 0, 3, ["Software Engineering", "Database Systems"]],
        ["Cybersecurity", 3, 3, 0, ["Computer Network Systems"]],
        ["Introduction to Artificial Intelligence", 3, 3, 0, ["Design and Analysis of Algorithms"]]
    ]},
    {
    semester: 7,
    courses: [
        ["Business Principles and Practices", 3, 3, 0, []],
        ["Social and Ethical Issues of Computing", 3, 3, 0, ["Software Engineering"]],
        ["Programming Languages", 3, 3, 0, ["Data Structures"]],
        ["Capstone Project II", 2, 0, 6, ["Capstone Project I"]]
    ]},
    {
    semester: 8,
    courses: [
        ["Field Training", 3, 0, 3, []]
    ]}
    
    
])
const Civil = new Majors("Civil Engineering", "الهنـدسة المـدنيـة", "engineering", "بكالوريوس", 5, "./majorsImages/Civil.png", "البنين", [{
    semester: 0,
    courses: [
        ["Structural Analysis II", 3, 3, 0, ["Structural Analysis I"]],
        ["Pavement Engineering", 3, 3, 0, ["Transportation Engineering"]],
        ["Hydraulic Engineering", 3, 3, 0, ["Engineering Fluid Mechanics"]],
        ["Geotechnical Engineering II", 3, 3, 0, ["Geotechnical Engineering I"]],
        ["Soil Stabilization & Site Improvement", 3, 3, 0, ["Foundation of Earth Structures Design"]],
        ["Water & Wastewater Engineering", 3, 3, 0, ["Environmental Engineering Principles", "Engineering Fluid Mechanics"]],
        ["Steel Design I", 3, 2, 3, ["Structural Analysis I"]],
        ["Reinforced Concrete II", 3, 2, 3, ["Reinforced Concrete I"]],
        ["Design of Pavement", 3, 3, 0, ["Structural Materials"]],
        ["Traffic Engineering and Road Safety", 3, 3, 0, ["Transportation Engineering"]],
        ["Seepage Analysis and its Control", 3, 3, 0, ["Geotechnical Engineering I"]],
        ["Project Surveying", 3, 3, 0, ["Surveying"]]
    ]},
    {
    semester: 1,
    courses: [
        ["General Chemistry I", 4, 3, 3, []],
        ["Academic Writing", 3, 3, 0, []],
        ["Arabic Language Foundation", 2, 2, 0, []],
        ["Calculus I", 4, 4, 0, []],
        ["Physical Education I", 1, 0, 2, []],
        ["General Physics I", 4, 3, 3, ["Calculus I"]]
    ]},
    {
    semester: 2,
    courses: [
        ["Computer Graphics", 3, 2, 3, []],
        ["Statics", 3, 3, 0, ["General Physics I"]],
        ["Geology for Engineers", 2, 2, 0, []],
        ["Islamic Culture", 2, 2, 0, []],
        ["Calculus II", 4, 4, 0, ["Calculus I"]],
        ["General Physics II", 4, 3, 3, ["Calculus II", "General Physics I"]]
    ]},
    {
    semester: 3,
    courses: [
        ["Structural Mechanics I", 3, 3, 0, ["Statics"]],
        ["Engineering Fluid Mechanics", 3, 3, 0, ["Statics", "Calculus II"]],
        ["Surveying", 3, 2, 3, ["Computer Graphics"]],
        ["Computer Programming", 3, 2, 3, []],
        ["Calculus III", 3, 3, 0, ["Calculus II"]],
        ["Dynamics", 3, 3, 0, ["Statics"]]
    ]},
    {
    semester: 4,
    courses: [
        ["Environmental Engineering Principles", 4, 3, 3, ["General Chemistry I"]],
        ["Structural Materials", 4, 3, 3, ["Structural Mechanics I"]],
        ["Structural Analysis I", 3, 3, 0, ["Structural Mechanics I"]],
        ["Geotechnical Engineering I", 4, 3, 3, ["Geology for Engineers", "Structural Machanics I"]],
        ["Professional Communication", 3, 3, 0, ["Academic Writing"]]
    ]},
    {
    semester: 5,
    courses: [
        ["Engineering Hydrology I", 3, 2, 3, ["Engineering Fluid Mechanics"]],
        ["Reinforced Concrete I", 3, 2, 3, ["Structural Materials","Structural Analysis I"]],
        ["Transportation Engineering", 4, 3, 3, ["Surveying", "Environmental Engineering Principles"]],
        ["Foundation of Earth Structures Design", 3, 3, 0, ["Geotechnical Engineering I"]],
        ["Professional Ethics in Islam", 2, 2, 0, ["Islamic Culture"]],
        ["Differential Equations and Linear Algebra", 3, 3, 0, ["Calculus III"]]
    ]},
    {
    semester: 6,
    courses: [
        ["Engineering Economics", 3, 3, 0, []],
        ["Construction Estimating and Costing", 3, 3, 0, ["Surveying", " Reinforced Concrete I"]],
        ["Capstone Design Project I", 1, 0, 3, ["Reinforced Concrete I"]],
        ["Technical Writing", 3, 3, 0, ["Professional Communication"]],
        ["Arabic Communication Skills", 2, 2, 0, ["Arabic Language Foundation"]],
        ["Probability and Statistics", 3, 3, 0, ["Calculus II"]]
    ]},
    {
    semester: 7,
    courses: [
        ["Business Principles and Practices", 3, 3, 0, []],
        ["Capstone Design Project II", 2, 0, 6, ["Capstone Design Project I"]],
        ["Computational Mechanics", 3, 3, 0, ["Differential Equations and Linear Algebra"]],
        ["Construction Methods and Management", 3, 3, 0, ["Reinforced Concrete I"]]
    ]},
    {
    semester: 8,
    courses: [
        ["Field Training", 3, 0, 3, []]
    ]
    }
])
const ChemicalEng = new Majors("Chemical Engineering", "الهنـدسـة الكيميـائيـة", "lab_research", "بكالوريوس", 5, "./majorsImages/Chemical.png", "البنين", [
    {
        semester: 1,
        courses: [
            ["General Chemistry I", 4, 3, 3, []],
            ["Academic Writing", 3, 3, 0, []],
            ["Arabic Language Foundation", 2, 2, 0, []],
            ["Calculus I", 4, 4, 0, []],
            ["Physical Education I", 1, 0, 2, []],
            ["General Physics I", 4, 3, 3, ["Calculus I"]]
        ]
    },
    {
        semester: 2,
        courses: [
            ["General Chemistry II", 4, 3, 3, ["General Chemistry I"]],
            ["Computer Programming", 3, 2, 3, []],
            ["Professional Communication", 3, 3, 0, ["Academic Writing"]],
            ["Calculus II", 4, 4, 0, ["Calculus I"]],
            ["General Physics II", 4, 3, 3, ["Calculus II", "General Physics I"]]
        ]
    },
    {
        semester: 3,
        courses: [
            ["Principles of Chemical Engineering", 4, 3, 3, ["General Chemistry II"]],
            ["Organic Chemistry", 4, 3, 3, ["General Chemistry II"]],
            ["Technical Writing", 3, 3, 0, ["Professional Communication"]],
            ["Arabic Communication Skills", 2, 2, 0, ["Arabic Language Foundation"]],
            ["Calculus III", 3, 3, 0, ["Calculus II"]],
            ["Materials Science for Chemical Engineers", 2, 2, 0, ["General Chemistry II"]]
        ]
    },
    {
        semester: 4,
        courses: [
            ["Physical Chemistry", 4, 3, 3, ["General Chemistry II"]],
            ["Process Fluid Mechanics", 3, 3, 0, ["Principles of Chemical Engineering"]],
            ["Analytical Chemistry", 3, 2, 3, ["Principles of Chemical Engineering"]],
            ["Introduction to Chemical Engineering Comp", 2, 1, 3, ["Principles of Chemical Engineering", "Computer Programming"]],
            ["Chemical Process Safety and Environment", 3, 3, 0, ["General Chemistry II"]],
            ["Differential Equations", 3, 3, 0, ["Calculus III"]],
        ]
    },
    {
        semester: 5,
        courses: [
            ["Chemical Engineering Thermodynamics", 3, 3, 0, ["Physical Chemistry", "Differential Equations"]],
            ["Numerical Methods for Chemical Engineers", 3, 2, 3, ["Principles of Chemical Engineering", "Differential Equations"]],
            ["Heat and Mass Transfer", 4, 4, 0, ["Principles of Chemical Engineering"]],
            ["Islamic Culture", 2, 2, 0, []],
            ["Probability and Statistics", 3, 2, 3, ["Calculus II"]]
        ]
    },
    {
        semester: 6,
        courses: [
            ["Chemical Engineering Laboratory I", 2, 0, 6, ["Process Fluid Mechanics", "Heat and Mass Transfer"]],
            ["Separation Processes", 3, 3, 0, ["Introduction to Chemical Engineering Comp", "Heat and Mass Transfer"]],
            ["Process Plant Design and Economics", 3, 3, 0, ["Process Fluid Mechanics", "Heat and Mass Transfer"]],
            ["Capstone Design Project I", 1, 0, 3, ["Introduction to Chemical Engineering Comp", "Heat and Mass Transfer"]],
            ["Chemical Reaction Engineering", 3, 3, 0, ["Principles of Chemical Engineering", "Differential Equations"]],
            ["Intro. to Data Science and Artificial Intelligent", 3, 2, 3, ["Computer Programming"]],
            ["Professional Ethics in Islam", 2, 2, 0, ["Islamic Culture"]]
        ]
    },
    {
        semester: 7,
        courses: [
            ["Business Principles and Practices", 3, 3, 0, []],
            ["Renewable and Sustainable Energy", 2, 2, 0, ["Process Fluid Mechanics", "Chemical Engineering Thermodynamics"]],
            ["Chemical Engineering Laboratory II", 2, 0, 6, ["Chemical Engineering Laboratory I"]],
            ["Process Dynamics and Control", 3, 3, 0, ["Introduction to Chemical Engineering Comp"]],
            ["Chemical Process Troubleshooting", 2, 2, 0, ["Separation Processes"]],
            ["Capstone Design Project II", 2, 0, 6, ["Capstone Design Project I"]]
        ]
    },
    {
        semester: 8,
        courses: [
            ["Field Training", 3, 0, 3, []]
        ]
    },
    {
        semester: 0, // Electives and additional courses
        courses: [
            ["Legal Environment in Business", 3, 3, 0, []],
            ["Chemistry of Materials and Environment", 3, 3, 0, ["General Chemistry I"]],
            ["Green Chemistry and Engineering", 3, 3, 0, ["General Chemistry I"]],
            ["Chemistry of Petrochemical Processes", 3, 3, 0, ["General Chemistry I"]],
            ["Enterprise Resource Planning", 3, 2, 2, ["Academic Writing"]],
            ["Principle of Automation", 3, 2, 3, ["Calculus II"]],
            ["Engineering Mathematics", 3, 3, 0, ["Differential Equations"]],
            ["Operations Research", 3, 3, 0, ["Differential Equations"]],
            ["General Physics 3", 3, 3, 0, ["General Physics II"]],
            ["Modern Physics", 3, 3, 0, ["General Physics II"]],
            ["Nano Science", 3, 3, 0, ["General Physics II"]],
            ["Corrosion Engineering", 3, 3, 0, ["General Chemistry I"]],
            ["Petrochemicals", 3, 3, 0, ["Organic Chemistry"]],
            ["Water Treatment and Desalination", 3, 3, 0, ["General Chemistry I"]],
            ["Polymer Technology", 3, 3, 0, ["Organic Chemistry"]],
            ["Nanomaterials", 3, 3, 0, ["General Chemistry I"]],
            ["Petroleum Refining", 3, 3, 0, ["Organic Chemistry"]],
            ["Energy Efficiency in Chemical Process Industry", 3, 3, 0, ["Chemical Engineering Thermodynamics"]],
            ["Solar Energy Engineering", 3, 3, 0, []],
            ["Energy Conservation", 3, 3, 0, []],
            ["Maintenance Engineering", 3, 3, 0, []],
            ["Sustainable Energy Engineering", 3, 3, 0, []]
        ]
    }
])
const HR = new Majors("Human Resources Management", "إدارة الموارد البشرية", "diversity_3", "بكالوريوس", 5, "./majorsImages/HR.png", "بنات", [])
const accounting = new Majors("Accounting", "محاسبة", "request_quote", "بكالوريوس", 5, "./majorsImages/accounting.png", "بنين وبنات", [])
const architecture = new Majors("Architecture and Planing", "العمارة والتخطيط", "apartment", "بكالوريوس", 5, "./majorsImages/architecture.png", "بنات", [])
const busniess = new Majors("Business Management", "إدارة الأعمال", "business_center", "بكالوريوس", 5, "./majorsImages/business.png", "بنين وبنات", [])

const bachelors = [MechanicalEng, ManagementInfo, InstrumentationEng,
    ElectricalEng, cs, Civil, ChemicalEng, HR, accounting, architecture, busniess]



// link the buttons from index.html to majorInfo.html page
function goToMajorDetails(majorObj) {
    localStorage.setItem("selectedMajor", JSON.stringify(majorObj));
    window.location.href = "/JIC-Website/MajorPage/majorInfo.html";
}

function generateMajorCards() {
    const container = document.getElementById('majors-container');
    
    bachelors.forEach(major => {
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
        } else if(major.genders == "البنين"){
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