

document.getElementById("profileVisits").addEventListener("dblclick", function (event) {
    const selectedValue = event.target.value;
    showSelectedVisit(selectedValue);
});

document.getElementById("deleteSelectedVisit").addEventListener("click", function (event) {
    var selectElement = document.getElementById("profileVisits");
    var selectedValue = selectElement.value;
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


// document.getElementById("profileVisits").addEventListener("onclick", function(event) {
//     const selectedValue = event.target.value;
//     saveWatchVisit(selectedValue);
//   });


