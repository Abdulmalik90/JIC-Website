document.getElementById("result-button").addEventListener("click", () => {
    let classPerWeek = Number(document.getElementById("lectures-count-input").value)
    console.log(classPerWeek)
    if (classPerWeek === NaN || classPerWeek === 0){
        alert("عذراً, يجب ان تضع عدد الكلاسات بشكل صحيح")
        return;
    }
    let totalAbs = classPerWeek * 16 * 0.20;
    let allowedAbs = parseInt(totalAbs)

    if (Math.ceil(totalAbs) == allowedAbs) {
        allowedAbs -= 1
    }

    document.getElementById("allowed-abs-input").value = `${allowedAbs} كلاسات`;
    document.getElementById("notallowed-abs-input").value = `${Math.ceil(totalAbs)} كلاسات`;
})