// alert("hello")
function selectTab(a) {

    let previousMain = document.getElementsByClassName("selectedMain")[0]
    previousMain.setAttribute("class", previousMain.getAttribute("class").replace("selectedMain", "unselectedMain"))

    let previousTabBut = document.getElementsByClassName("selectedTab")[0]
    previousTabBut.setAttribute("class", previousTabBut.getAttribute("class").split(" ")[0] == "" ? previousTabBut.getAttribute("class").split(" ")[1] : previousTabBut.getAttribute("class").split(" ")[0])

    let newMain = document.getElementById(a.getAttribute("class"))
    newMain.setAttribute("class", newMain.getAttribute("class").replace("unselectedMain", "selectedMain"))
    a.setAttribute("class", a.getAttribute("class").split(" ")[0] + " selectedTab")
}