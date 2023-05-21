var myip = document.getElementById("myipad").getAttribute("ip")
// console.log(document.getElementById("myipad").getAttribute("ip"))
// if (document.getElementById("myipad").getAttribute("ip") == "" && document.getElementById("myipad").getAttribute("ip") == undefined && 
// document.getElementById("myipad").getAttribute("ip") == null )
//     myip = document.getElementById("myipad").getAttribute("ip")
var currentProfile = {}
console.log(myip)
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
var clientList = []
var visitList = []

function openPopup(elem) {
    elem.style.display = "block";
}

function closePopup(elem) {
    console.log(elem)
    elem.style.display = "none";
    console.log(elem.style.display)
}


function openPopupAnalyse() {
    let selectedAnalyse = document.getElementById("profileAnalyses").selectedIndex
    document.getElementById("dateAnalyse").value = formatDate(new Date(currentProfile.analyses[selectedAnalyse].date))
    document.getElementById("textAnalyse").innerText = currentProfile.analyses[selectedAnalyse].text
    document.getElementById("fileAnalyse").setAttribute("href",currentProfile.analyses[selectedAnalyse].file)
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

function loadProfile(client) {
    currentProfile = client
    document.getElementById("profileFIO").value = client.FIO
    document.getElementById("profilePhoneNumber").value = client.phoneNumber
    document.getElementById("profilePetName").value = client.petName
    document.getElementById("profilePetSex").value = client.petSex
    document.getElementById("profileType").value = client.type
    document.getElementById("profilePetBreed").value = client.petBreed
    document.getElementById("profilePetBirthDate").value = client.petBirthDate
    document.getElementById("profileComment").value = client.comment
    document.getElementById("profileAnalyses").innerHTML = ""
    console.log(client.analyses)
    for (let a of client.analyses) {
        let option = document.createElement("option")
        option.innerText = a.date
        console.log(a)
        document.getElementById("profileAnalyses").appendChild(option)

    }
}