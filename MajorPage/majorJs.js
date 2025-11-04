window.onload = function () {
    const rawData = JSON.parse(localStorage.getItem("selectedMajor"));
    if (!rawData || !Array.isArray(rawData.courses)) {
        document.body.innerHTML = "<p>No major selected or invalid course data.</p>";
        return;
    }

    const majorData = rawData;

    document.getElementById("portal-greating").textContent = majorData.arabicName;
    document.getElementById("majorDegree").textContent = majorData.degree;

    if (majorData.years === 1){
        document.getElementById("majorYears").textContent = "سنة";
    } else if(majorData.years === 2) {
        document.getElementById("majorYears").textContent = "سنتين";
    } else {
        document.getElementById("majorYears").textContent = majorData.years + " سنوات";
    }

    document.getElementById("majorGender").textContent = majorData.genders;

    const container = document.getElementById("courseTableContainer");
    if(majorData.courses.length !== 0){
        container.innerHTML = '';
    }

    // === متغير لتجميع الساعات الكلية للخطة ===
    let totalPlanHours = 0;

    // Process each semester (excluding semester 0)
    majorData.courses.forEach(sem => {
        if (sem.semester === 0) return; // skip optional courses here

        // Create semester card
        const card = document.createElement("div");
        card.classList.add("semester-card");

        // Create semester header
        const header = document.createElement("div");
        header.classList.add("semester-header");
        header.innerHTML = `<h2>Semester ${sem.semester}</h2>`;
        card.appendChild(header);

        // Create table
        const table = document.createElement("table");
        table.classList.add("course-table");

        // Create table header
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Course Name</th>
                <th>CR</th>
                <th>TH</th>
                <th>LB</th>
                <th>Prerequisites</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement("tbody");
        let semHours = 0; // لحساب مجموع ساعات هذا الفصل
        
        // Add each course as a row
        sem.courses.forEach(course => {
            if (!Array.isArray(course)) {
                console.warn("⚠️ Invalid course data:", course, "in semester", sem.semester);
                return; // skip invalid entries
            }

            const [title, credits, lec, lab, prereqs] = course;
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${title}</td>
                <td>${credits}</td>
                <td>${lec}</td>
                <td>${lab}</td>
                <td>${prereqs.length ? prereqs.join(', ') : 'None'}</td>
            `;
            
            tbody.appendChild(row);
            semHours += credits; // جمع ساعات المادة
        });

        // === إضافة صف لمجموع ساعات الفصل ===
        const totalRow = document.createElement("tr");
        totalRow.classList.add("total-row"); // إضافة كلاس للستايل
        totalRow.innerHTML = `
        <td class="total-title" style="text-align:left;">Total Cridets :${semHours}</td>
        <td class="total-hours"></td>
        <td colspan="3"></td>
        `;
        tbody.appendChild(totalRow);

        totalPlanHours += semHours; // إضافة ساعات الفصل إلى المجموع الكلي

        table.appendChild(tbody);
        card.appendChild(table);
        container.appendChild(card);
    });
    // === عرض مجموع الساعات الكلية في القسم العلوي ===
    const topDiv = document.querySelector(".top-div");
    const totalHoursDiv = document.createElement("div");
    totalHoursDiv.classList.add("total-plan-box");
    totalHoursDiv.innerHTML = `
        <p><span class="material-symbols-outlined">schedule</span> 
        إجمالي الساعات الكلية للخطة: 
        <strong>${totalPlanHours}</strong></p>
    `;
    topDiv.insertAdjacentElement("afterend", totalHoursDiv);

    // Render Optional Courses (Semester 0)
    const optionalSem = majorData.courses.find(s => s.semester === 0);
    if (optionalSem && optionalSem.courses.length > 0) {

        // Create container for optional courses
        const optionalContainer = document.createElement("div");
        optionalContainer.classList.add("optional-container");
        
        // Create title for optional courses
        const optionalTitle = document.createElement("h2");
        optionalTitle.classList.add("optional-title");
        optionalTitle.textContent = "Optional Courses";
        optionalContainer.appendChild(optionalTitle);
        
        // Create wrapper for optional course cards
        const wrapper = document.createElement("div");
        wrapper.id = "optionalCourses";
        wrapper.classList.add("optional-courses-wrapper");
        
        // Add each optional course as a card
        optionalSem.courses.forEach(course => {
            const [title, credits, lec, lab, prereqs] = course;

            const card = document.createElement("div");
            card.classList.add("optional-course-card");

            card.innerHTML = `
                <h4>${title}</h4>
                <p><strong>Credits:</strong> ${credits}</p>
                <p><strong>Theory hours:</strong> ${lec}</p>
                <p><strong>Lab:</strong> ${lab}</p>
                <p><strong>Prerequisites:</strong> ${prereqs.length ? prereqs.join(', ') : 'None'}</p>
            `;
            wrapper.appendChild(card);
        });
        
        optionalContainer.appendChild(wrapper);
        
        // Insert optional courses before the footer
        const footer = document.querySelector("footer");
        document.body.insertBefore(optionalContainer, footer);
    }
};