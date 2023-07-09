
var currentProfile = {}
var clientList = []
var visitList = []
async function postData(url = "", data = {}) {
    console.log(url)
    // Default options are marked with *
    const response = await fetch(url, {
        // mode: 'no-cors',
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.text(); // parses JSON response into native JavaScript objects
}

function openPopup(elem) {
    elem.style.display = "block";
}

function closePopup(elem) {
    elem.style.display = "none";
}


function openPopupAnalyse() {
    const { shell } = require('electron')
    let selectedAnalyse = document.getElementById("profileAnalyses").selectedIndex
    document.getElementById("dateAnalyse").value = formatDate(new Date(currentProfile.analyses[selectedAnalyse].date))
    document.getElementById("textAnalyse").innerText = currentProfile.analyses[selectedAnalyse].text
    document.getElementById("fileAnalyse").setAttribute("onclick", shell.openPath(currentProfile.analyses[selectedAnalyse].file))
    document.getElementById("fileAnalyse").innerText = currentProfile.analyses[selectedAnalyse].file
    document.getElementById("popupAnalyse").style.display = "block";
}

function closePopupAnalyse() {
    document.getElementById("popupAnalyse").style.display = "none";
}


function searchClient() {
    let FIO = document.getElementById("searchFIO").value == null ? "" : document.getElementById("searchFIO").value
    let phoneNumber = document.getElementById("searchPhoneNumber").value == null ? "" : document.getElementById("searchPhoneNumber").value
    let petName = document.getElementById("searchPetName").value == null ? "" : document.getElementById("searchPetName").value
    let select = document.getElementById("foundClients")
    select.innerHTML = ""
    console.log(clientList)
    for (let a of clientList) {
        if (a.FIO.toLowerCase().includes(FIO.toLowerCase())
            && a.phoneNumber.toLowerCase().includes(phoneNumber.toLowerCase())
            && a.petName.toLowerCase().includes(petName.toLowerCase())) {
            let option = document.createElement("option")
            option.value = a.FIO + "; " + a.phoneNumber + "; " + a.petName
            option.innerText = a.FIO + "; " + a.phoneNumber + "; " + a.petName
            select.appendChild(option)
        }
    }

}

function loadClientProfile() {
    const selectElement = document.getElementById("foundClients");
    const selectedOption = selectElement.value;
    for (let a of clientList) {
        if (a.FIO + "; " + a.phoneNumber + "; " + a.petName == selectedOption) {
            loadProfile(a)
            break
        }
    }
}

async function loadProfile(client) {
    currentProfile = client
    console.log(currentProfile)
    document.getElementById("profileFIO").value = currentProfile.FIO
    document.getElementById("profilePhoneNumber").value = currentProfile.phoneNumber
    document.getElementById("profilePetName").value = currentProfile.petName
    document.getElementById("profilePetSex").value = currentProfile.petSex
    document.getElementById("profilePetType").value = currentProfile.petType
    document.getElementById("profilePetBreed").value = currentProfile.petBreed
    document.getElementById("profilePetBirthDate").value = currentProfile.petBirthDate
    document.getElementById("profileComment").value = currentProfile.comment
    // document.getElementById("profileAnalyses").innerHTML = ""
    document.getElementById("profileVisits").innerHTML = ""
    // console.log(client.analyses)
    // for (let a of client.analyses) {
    //     let option = document.createElement("option")
    //     option.innerText = a.date
    //     console.log(a)
    //     document.getElementById("profileAnalyses").appendChild(option)
    // }


    console.log(database)
    for (let a of database.VisitList) {
        if (currentProfile.phoneNumber == a.phoneNumber) {
            let option = document.createElement("option")   
            option.innerText = formatDate(new Date(a.dateStart)) + " " + formatedTime(new Date(a.dateStart))
            document.getElementById("profileVisits").appendChild(option)
        }
    }
}


async function getDataBase() {
    await postData(`${window.location.href}getDataBase`, {}).then((data) => {
        data = JSON.parse(data)
        database = data
        clientList = data.ClientList
        visitList = data.VisitList
    })
}

function getCurrentIP() {
    postData(`${window.location.href}currentIP`, {}).then((data) => {
        data = JSON.parse(data)
        console.log(data)
        document.getElementById("currentIP").innerText = data.currentIP
    })
}

if (window.location.href.includes("localh")) {
    getCurrentIP()
    loadQRCode()
}

function loadQRCode()
{
 document.getElementById("qrcode").setAttribute("src","styles/qrcode.png")
}