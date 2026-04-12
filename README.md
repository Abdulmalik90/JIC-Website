# 🎓 JU Portal (JIC Website)

A comprehensive, responsive, and user-friendly portal simulation designed for Jubail Industrial College (JIC). Built entirely from scratch, this application serves as a centralized hub for students, featuring essential academic tools, interactive campus navigation, and vital institutional resources.

**Live Demo:** [https://juportal.online/](https://juportal.online/)

---

## 📖 Description

The JU Portal was developed as a robust university project to streamline the student experience. Relying on core web technologies rather than heavy frameworks, the portal utilizes vanilla JavaScript and Local Storage to handle data processing directly in the browser. It features customized tools tailored to university life, including academic calculators and an interactive campus map.

---

## ✨ Features

* **Interactive Digital Map:** A custom-built campus map featuring functional pins with hover-based information cards for easy navigation.
* **Academic Calculators:** Integrated tools for students, including a dynamic **GPA Calculator** and an **Absence Calculator** to track academic standing.
* **Data Handling:** Utilizes browser **Local Storage** for persistent data handling without requiring a complex backend database.
* **Progressive Web App (PWA) Ready:** Includes a web manifest and service worker, allowing the portal to be installed on devices for a native-like experience.
* **Comprehensive Resources:** Dedicated sections for Academic Regulations, News, Majors, and detailed JTI/JIC pages.
* **Fully Responsive:** Custom CSS ensures a seamless experience across desktops, tablets, and mobile devices.

---

## 🛠️ Tech Stack

This project was built from the ground up focusing on core web fundamentals:

* **Markup:** HTML5
* **Styling:** CSS3 (Custom responsive layouts, no external UI frameworks)
* **Scripting:** Vanilla JavaScript (ES6+)
* **Storage:** Browser Local Storage
* **Performance:** Service Workers (PWA capabilities)

---

## 🚀 Getting Started

To run this project locally, follow these simple steps. No package managers or build tools are required!

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Abdulmalik90/JIC-Website.git](https://github.com/Abdulmalik90/JIC-Website.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd JIC-Website
    ```

3.  **Run the application:**
    Since this is a vanilla HTML/JS/CSS project, you can simply open the `index.html` file in any modern web browser. 
    
    *Alternatively, for the best experience (especially for testing local storage and the service worker), run it using a local development server like the "Live Server" extension in VS Code.*

---

## 📁 Project Structure

The repository is organized by feature to keep the codebase modular:

```text
📦 JIC-Website
 ┣ 📂 Images                   # Global image assets
 ┣ 📂 fonts                    # Custom web fonts
 ┣ 📂 JICPage                  # Jubail Industrial College specific pages
 ┣ 📂 JTIPage                  # Jubail Technical Institute specific pages
 ┣ 📂 MajorPage                # Information regarding different majors
 ┣ 📂 absCalcPage              # Absence Calculator tool
 ┣ 📂 academicRegulationsPage  # Rules and regulations documentation
 ┣ 📂 gpaPage                  # GPA Calculator tool
 ┣ 📂 newsPage                 # Campus news and updates
 ┣ 📂 webMapPage               # Interactive digital campus map
 ┣ 📜 index.html               # Main landing page
 ┣ 📜 style.css                # Global styles
 ┣ 📜 script.js                # Core JavaScript logic
 ┣ 📜 search.js                # Search functionality
 ┣ 📜 service-worker.js        # PWA offline caching
 ┣ 📜 manifest.json            # Web app manifest
 ┗ 📜 README.md
