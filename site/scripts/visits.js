function plainNewVisitDate() {
    let date = document.getElementById("newVisitDateStart").value
    document.getElementById("newVisitDateEnd").value = date
}
function plainNewVisittime() {
    let time = document.getElementById("newVisitTimeStart").value
    document.getElementById("newVisitTimeEnd").value = addHalfHourToTime(time)
}
function addHalfHourToTime(time) {
    var parts = time.split(":");
    var hours = parseInt(parts[0]);
    var minutes = parseInt(parts[1]);

    var date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setMinutes(date.getMinutes() + 30); // Добавляем полчаса

    var newHours = date.getHours().toString().padStart(2, "0");
    var newMinutes = date.getMinutes().toString().padStart(2, "0");

    var newTime = newHours + ":" + newMinutes;
    return newTime;
}


function createNewVisit() {
    let dateStart = document.getElementById("newVisitDateStart").value + " " + document.getElementById("newVisitTimeStart").value
    let dateEnd = document.getElementById("newVisitDateEnd").value + " " + document.getElementById("newVisitTimeEnd").value
    let title = document.getElementById("reasonNewVisit").value + " "
        + currentProfile.petType + " "
        + currentProfile.petName + " "
        + currentProfile.phoneNumber

    let datebase = readDatabase()
    const newVisit = {
        dateStart: new Date(dateStart).toISOString(),
        dateEnd: new Date(dateEnd).toISOString(),
        phoneNumber: currentProfile.phoneNumber,
        vid: document.getElementById("reasonNewVisit"),
        anamnez: "",
        appointment: "",
        status: "",
        title: title
    };
    datebase.VisitList.push(newVisit);
    writeDatabase(datebase)

    postData(`${window.location.href}calCreate`, { event: "create", title: title, datn: dateStart, datk: dateEnd })
        .then((data) => {
            console.log(data)
        });
}