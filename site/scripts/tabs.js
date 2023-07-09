// alert("hello")
async function selectTab(a) {

    let previousMain = document.getElementsByClassName("selectedMain")[0]
    previousMain.setAttribute("class", previousMain.getAttribute("class").replace("selectedMain", "unselectedMain"))

    let previousTabBut = document.getElementsByClassName("selectedTab")[0]
    previousTabBut.setAttribute("class", previousTabBut.getAttribute("class").split(" ")[0] == "" ? previousTabBut.getAttribute("class").split(" ")[1] : previousTabBut.getAttribute("class").split(" ")[0])

    let newMain = document.getElementById(a.getAttribute("class"))
    newMain.setAttribute("class", newMain.getAttribute("class").replace("unselectedMain", "selectedMain"))
    a.setAttribute("class", a.getAttribute("class").split(" ")[0] + " selectedTab")

    await getEvents(new Date(document.getElementById("date").value))
    await getDataBase()
    searchClient()
    clearProfileData()
}


function clearProfileData(){
    document.getElementById("profileFIO").value = ""
    document.getElementById("profilePhoneNumber").value = ""
    document.getElementById("profilePetName").value = ""
    document.getElementById("profilePetSex").value = ""
    document.getElementById("profilePetType").value = ""
    document.getElementById("profilePetBreed").value = ""
    document.getElementById("profilePetBirthDate").value = ""
    document.getElementById("profileComment").value = ""
    document.getElementById("divParentVisitList").innerHTML = ""
}