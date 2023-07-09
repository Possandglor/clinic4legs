
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
    document.getElementById("dateAnalyse").value = formatDate(new Date(""[selectedAnalyse].date))
    document.getElementById("textAnalyse").innerText = ""[selectedAnalyse].text
    document.getElementById("fileAnalyse").setAttribute("onclick", shell.openPath(""[selectedAnalyse].file))
    document.getElementById("fileAnalyse").innerText = ""[selectedAnalyse].file
    document.getElementById("popupAnalyse").style.display = "block";
}

function closePopupAnalyse() {
    document.getElementById("popupAnalyse").style.display = "none";
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

function loadQRCode() {
    document.getElementById("qrcode").setAttribute("src", "styles/qrcode.png")
}