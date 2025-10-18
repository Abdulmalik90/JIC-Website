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
const PreparatoryYear = new Majors("Preparatory Year", "السنة التحضيرية", "book_3", "السنة التحضيرية", 1, "", "بنين وبنات", [
    {
        semester: 1,
        courses: [
            ["English I (Reading and writing)", 8, 10, 0, []],
            ["English I (Listening & Speaking)", 0, 6, 0, []],
            ["English I (E-Learning)", 0, 0, 2, []],
            ["English I (ESP)", 0, 3, 0, []],
            ["Preparatory Math I", 4, 4, 0, []],
            ["Introduction to Computer", 1, 1, 0, []]
        ]
    },
    {
        semester: 2,
        courses: [
            ["English II (Reading and writing)", 8, 10, 0, ["English I (Reading and writing)"]],
            ["English II (Listening & Speaking)", 0, 6, 0, ["English I (Listening & Speaking)"]],
            ["English II (E-Learning)", 0, 0, 2, ["English II (E-Learning)"]],
            ["English II (ESP)", 0, 3, 0, ["English II (ESP)"]],
            ["Preparatory Math II", 4, 4, 0, ["Preparatory Math I"]],
            ["Study Skills", 1, 1, 0, []]
        ]
    }
] )

// Modal script
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('majorsButton');
    const closeModalBtn = document.querySelector('#header-modal span');
    const diplomeButton = document.getElementById('deplome-button');
    const bacholarButton = document.getElementById('bacholar-button');
    const preparatoryButton = document.getElementById('prepare-button');
    
    // Function to open modal
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    // Function to close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
    
    // Event listeners
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Example actions for the buttons
    preparatoryButton.addEventListener('click', function(){
        localStorage.setItem("selectedMajor", JSON.stringify(PreparatoryYear));
        window.location.href = "../MajorPage/majorInfo.html";
    })

    diplomeButton.addEventListener('click', function() {
        window.location.href = "./JTImajors/JTImajors.html"
    });
    
    


});

