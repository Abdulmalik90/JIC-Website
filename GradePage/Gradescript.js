function calculateWeight() {
    // 1. سحب القيم من الحقول
    // استخدمنا parseFloat عشان نتعامل مع الأرقام العشرية (الفواصل)
    const studentMark = parseFloat(document.getElementById('studentMark').value);
    const examTotal = parseFloat(document.getElementById('examTotal').value);
    const realWeight = parseFloat(document.getElementById('realWeight').value);

    // 2. التحقق من صحة البيانات (Validation)
    // نتأكد إن الحقول مب فاضية وإن الدرجة الكلية مو صفر
    if (isNaN(studentMark) || isNaN(examTotal) || isNaN(realWeight)) {
        alert("تاكد انك عبيت كل الخانات");
        return;
    }

    if (examTotal === 0) {
        alert("الدرجة الكلية للاختبار مستحيل تكون صفر");
        return;
    }

    // 3. تطبيق المعادلة
    // (درجتك / المجموع الكلي) * الوزن
    let result = (studentMark / examTotal) * realWeight;

    // 4. تقريب النتيجة لمنزلتين عشريتين
    // مثلاً لو طلعت 3.66666 تصير 3.67
    result = result.toFixed(2);

    // 5. إظهار النتيجة في الصفحة
    const resultCard = document.getElementById('resultCard');
    const finalResult = document.getElementById('finalResult');

    finalResult.innerText = result; // تحديث الرقم
    resultCard.style.display = 'block'; // إظهار كرت النتيجة المخفي
}