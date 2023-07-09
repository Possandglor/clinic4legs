function client(dateStart = "", dateEnd = "", phoneNumber = "", vid = "", anamnez = "", appointment = "", status = "", title = "") {
    return {
        dateStart: new Date(dateStart).toISOString(),
        dateEnd: new Date(dateEnd).toISOString(),
        phoneNumber,
        vid,
        anamnez,
        appointment,
        status,
        title
    };
}

let currentVisit = {}
function plainNewVisitDate() {
    let date = document.getElementById("newVisitDateStart").value
    document.getElementById("newVisitDateEnd").value = date
}
function plainNewVisittime() {
    let time = document.getElementById("newVisitTimeStart").value
    document.getElementById("newVisitTimeEnd").value = addHalfHourToTime(time)
}

function plainWatchVisitDate() {
    let date = document.getElementById("watchVisitDateStart").value
    document.getElementById("watchVisitDateEnd").value = date
}
function plainWatchVisittime() {
    let time = document.getElementById("watchVisitTimeStart").value
    document.getElementById("watchVisitTimeEnd").value = addHalfHourToTime(time)
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


async function createNewVisit() {
    let dateStart = document.getElementById("newVisitDateStart").value + " " + document.getElementById("newVisitTimeStart").value
    let dateEnd = document.getElementById("newVisitDateEnd").value + " " + document.getElementById("newVisitTimeEnd").value
    let title = document.getElementById("reasonNewVisit").value + " "
        + currentClientProfile.petType + " "
        + currentClientProfile.petName + " "
        + currentClientProfile.phoneNumber

    const newVisit = client(dateStart, dateEnd, currentClientProfile.phoneNumber, "", "", "", "", title);

    // {
    //     dateStart: new Date(dateStart).toISOString(),
    //     dateEnd: new Date(dateEnd).toISOString(),
    //     phoneNumber: currentClientProfile.phoneNumber,
    //     vid: document.getElementById("reasonNewVisit").value,
    //     anamnez: "",
    //     appointment: "",
    //     status: "",
    //     title: title
    // };

    await postData(`${window.location.href}newVisit`, newVisit)
        .then((data) => {
            console.log(data)
        });

    await postData(`${window.location.href}calCreate`, { event: "create", title: title, datn: dateStart, datk: dateEnd })
        .then((data) => {
            console.log(data)
        });

    let divParentVisitList = document.getElementById("divParentVisitList")
    divParentVisitList.innerHTML = ""
    let div = document.createElement("div")
    // Обработчик клика на день
    div.addEventListener("click", () => {
        let allVisits = document.querySelectorAll(".divClientList");
        allVisits.forEach((visit) => {
            console.log(visit)
            if (visit.classList.contains("selectedVisit"))
                visit.classList.remove("selectedVisit");
        });

        // Выделяем выбранный день
        div.classList.add("divClientList");
        div.classList.add("selectedVisit");
    })
    div.addEventListener("dblclick", function (event) {
        showSelectedVisit(div.innerText);
    });
    div.innerText = formatDate(new Date(newVisit.dateStart)) + " " + formatedTime(new Date(newVisit.dateStart))
    divParentVisitList.appendChild(div)

    await getDataBase()
    closePopup(document.getElementById("newVisit"))
}


async function saveWatchVisit() {
    let newVisit = client(
        dateStart = document.getElementById("watchVisitDateStart").value + " " + document.getElementById("watchVisitTimeStart").value,
        dateEnd = document.getElementById("watchVisitDateEnd").value + " " + document.getElementById("watchVisitTimeEnd").value,
        phoneNumber = currentClientProfile.phoneNumber,
        vid = document.getElementById("vidWatchVisit").value,
        anamnez = document.getElementById("anamnezWatchVisit").value,
        appointment = document.getElementById("appointmentWatchVisit").value,
        status = document.getElementById("statusWatchVisit").value,
        title = document.getElementById("titleWatchVisit").value,
    )
    await postData(`${window.location.href}saveVisit`, { old: currentVisit, new: newVisit }).then((data) => {
        console.log(data)
    })
    await getDataBase()

    closePopup(document.getElementById("watchVisit"))
}



async function deleteVisit(data) {
    console.log(data)
    currentVisit = (await searchVisit(data, currentClientProfile.phoneNumber))[0]
    await postData(`${window.location.href}deleteVisit`, currentVisit).then((data) => {
        console.log(data)
    })
    await getDataBase()
}

async function showSelectedVisit(data) {


    console.log(currentClientProfile)
    console.log(data)
    currentVisit = (await searchVisit(data, currentClientProfile.phoneNumber))[0]
    console.log(currentVisit)
    await postData(`${window.location.href}getFiles`, { phoneNumber: currentClientProfile.phoneNumber, date: formatDate(new Date(currentVisit.dateStart)) + "T" + formatedTime(new Date(currentVisit.dateStart)) })
    .then((data) => {
        data = JSON.parse(data)
        console.log(data)
        for (let key in data)
            document.getElementById("filesWatchVisit").value += key+"\n"
    })
    document.getElementById("titleWatchVisit").value = currentVisit.title
    document.getElementById("vidWatchVisit").value = currentVisit.vid
    document.getElementById("anamnezWatchVisit").value = currentVisit.anamnez
    document.getElementById("appointmentWatchVisit").value = currentVisit.appointment
    document.getElementById("statusWatchVisit").value = currentVisit.status
    document.getElementById("watchVisitDateStart").value = formatDate(new Date(currentVisit.dateStart))
    document.getElementById("watchVisitTimeStart").value = formatedTime(new Date(currentVisit.dateStart))
    document.getElementById("watchVisitDateEnd").value = formatDate(new Date(currentVisit.dateEnd))
    document.getElementById("watchVisitTimeEnd").value = formatedTime(new Date(currentVisit.dateEnd))
    openPopup(document.getElementById('watchVisit'))
}

async function searchVisit(data, phone) {
    let result = {}
    await postData(`${window.location.href}getVisit`, { phone, dateStart: data }).then((data) => {
        result = data
    })
    return JSON.parse(result)
}

document.getElementById("newVisitDateStart").value = formatDate(new Date())
document.getElementById("newVisitDateEnd").value = formatDate(new Date())
