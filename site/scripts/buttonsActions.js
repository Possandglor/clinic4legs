



document.getElementById("deleteSelectedVisit").addEventListener("click", function (event) {
    var selectElement = document.getElementsByClassName("selectedVisit")[0];
    var selectedValue = selectElement.innerText;
    deleteVisit(selectedValue);

    // Перебор опций и удаление выбранной опции
    for (var i = 0; i < selectElement.options.length; i++) {
        if (selectElement.options[i].value === selectedValue) {
            selectElement.remove(i);
            break;
        }
    }
});

document.getElementById("btnNewClient").addEventListener("click", function (event) {
    newClient()
});

document.getElementById("btnDeleteClient").addEventListener("click", function (event) {
    deleteClient()
});

document.getElementById("btnSaveClient").addEventListener("click", function (event) {
    saveClient()
});



function expandSidenav() {
    var sidenav = document.querySelector('.sidenav');
    sidenav.classList.add('expanded');
}

function collapseSidenav() {
    var sidenav = document.querySelector('.sidenav');
    sidenav.classList.remove('expanded');
}



document.getElementById("sendFile").addEventListener('click', () => {
    const file = document.getElementById("fileInput").files[0];

    let date = document.getElementById("watchVisitDateStart").value + "T" + document.getElementById("watchVisitTimeStart").value
    const formData = new FormData();
    formData.append('file', file,currentClientProfile.phoneNumber+"_"+date+"_"+file.name);
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Ответ сервера после загрузки файла
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
});