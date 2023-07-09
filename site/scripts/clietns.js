
var currentClientProfile = {}

function searchClient() {
    // onchange="loadClientProfile()"
    let FIO = document.getElementById("searchFIO").value == null ? "" : document.getElementById("searchFIO").value
    let phoneNumber = document.getElementById("searchPhoneNumber").value == null ? "" : document.getElementById("searchPhoneNumber").value
    let petName = document.getElementById("searchPetName").value == null ? "" : document.getElementById("searchPetName").value

    let clientDataForSearch = document.getElementById("clientDataForSearch")
    clientDataForSearch.innerHTML = ""
    for (let a of clientList) {
        if (a.FIO.toLowerCase().includes(FIO.toLowerCase())
            && a.phoneNumber.toLowerCase().includes(phoneNumber.toLowerCase())
            && a.petName.toLowerCase().includes(petName.toLowerCase())) {


            let div = document.createElement("div")
            // Обработчик клика на день
            div.addEventListener("click", () => {
                let allClients = document.querySelectorAll(".divClientList");
                allClients.forEach((client) => {
                    console.log(client)
                    if (client.classList.contains("selectedClient"))
                        console.log(client)
                    client.classList.remove("selectedClient");
                });
                loadClientProfile(div.innerText)
                // Выделяем выбранный день
                div.classList.add("divClientList");
                div.classList.add("selectedClient");
            })
            div.innerText = a.FIO + "; " + a.phoneNumber + "; " + a.petName
            clientDataForSearch.appendChild(div)
        }
    }

}

function loadClientProfile(selectedOption) {
    for (let a of clientList) {
        if (a.FIO + "; " + a.phoneNumber + "; " + a.petName == selectedOption) {
            loadProfile(a)
            break
        }
    }
}



async function loadProfile(client) {
    currentClientProfile = client
    console.log(currentClientProfile)
    document.getElementById("profileFIO").value = currentClientProfile.FIO
    document.getElementById("profilePhoneNumber").value = currentClientProfile.phoneNumber
    document.getElementById("profilePetName").value = currentClientProfile.petName
    document.getElementById("profilePetSex").value = currentClientProfile.petSex
    document.getElementById("profilePetType").value = currentClientProfile.petType
    document.getElementById("profilePetBreed").value = currentClientProfile.petBreed
    document.getElementById("profilePetBirthDate").value = currentClientProfile.petBirthDate
    document.getElementById("profileComment").value = currentClientProfile.comment
    // document.getElementById("profileAnalyses").innerHTML = ""
    document.getElementById("divParentVisitList").innerHTML = ""
    // console.log(client.analyses)
    // for (let a of client.analyses) {
    //     let option = document.createElement("option")
    //     option.innerText = a.date
    //     console.log(a)
    //     document.getElementById("profileAnalyses").appendChild(option)
    // }


    console.log(database)

    let divParentVisitList = document.getElementById("divParentVisitList")
    divParentVisitList.innerHTML = ""
    for (let a of database.VisitList) {
        if (currentClientProfile.phoneNumber == a.phoneNumber) {
            let div = document.createElement("div")
            // Обработчик клика на день
            div.addEventListener("click", () => {
                let allVisits = document.querySelectorAll(".divClientList");
                allVisits.forEach((visit) => {
                    console.log(visit)
                    if (visit.classList.contains("selectedVisit"))
                        visit.classList.remove("selectedVisit");
                });
                loadClientProfile(div.innerText)
                // Выделяем выбранный день
                div.classList.add("divClientList");
                div.classList.add("selectedVisit");
            })
            div.addEventListener("dblclick", function (event) {
                showSelectedVisit(div.innerText);
            });

            div.innerText = formatDate(new Date(a.dateStart)) + " " + formatedTime(new Date(a.dateStart))
            divParentVisitList.appendChild(div)
        }
    }
}


async function saveClient() {

    let newClientData = {
        "FIO": document.getElementById("profileFIO").value,
        "phoneNumber": document.getElementById("profilePhoneNumber").value,
        "petName": document.getElementById("profilePetName").value,
        "petSex": document.getElementById("profilePetSex").value,
        "petType": document.getElementById("profilePetType").value,
        "petBreed": document.getElementById("profilePetBreed").value,
        "petBirthDate": document.getElementById("profilePetBirthDate").value,
        "comment": document.getElementById("profileComment").value,
        "analyses": []
    }

    await postData(`${window.location.href}saveClient`, { old: currentClientProfile, new: newClientData })
    await loadProfile(newClientData)
    await getDataBase()
    searchClient()
}


async function deleteClient() {
    await postData(`${window.location.href}deleteClient`, currentClientProfile)
    await getDataBase()
    searchClient()
}

async function newClient() {
    let newClientData = {
        "FIO": "Новый клиент",
        "phoneNumber": "0000",
        "petName": "",
        "petSex": "",
        "petType": "",
        "petBreed": "",
        "petBirthDate": "",
        "comment": "",
        "analyses": []
    }
    await postData(`${window.location.href}newClient`, newClientData)
    await getDataBase()
    searchClient()
}