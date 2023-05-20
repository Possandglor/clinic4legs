

async function postData(url = "", data = {}) {
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

function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}


function searchClient() {
    let FIO = document.getElementById("searchFIO").value==null?"":document.getElementById("searchFIO").value
    let phoneNumber = document.getElementById("searchPhoneNumber").value==null?"":document.getElementById("searchPhoneNumber").value
    let petName = document.getElementById("searchPetName").value==null?"":document.getElementById("searchPetName").value
    let select = document.getElementById("foundClients")
    select.innerHTML = ""
    
    postData("http://"+myip+":3000/searchClient", {FIO, phoneNumber, petName }).then((data)=>{
        data = JSON.parse(data)
        for(let a of data)
        {
            let option = document.createElement("option")
            option.value = a.FIO +"; "+a.phoneNumber+"; "+a.petName
            option.innerText = a.FIO +"; "+a.phoneNumber+"; "+a.petName
            select.appendChild(option)
        }
    })
}