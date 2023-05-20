// alert("hello")
function selectTab(a) {

    let previousMain = document.getElementsByClassName("selectedMain")[0]
    console.log(previousMain)
    previousMain.setAttribute("class", previousMain.getAttribute("class").replace("selectedMain", "unselectedMain"))

    let previousTabBut = document.getElementsByClassName("selectedTab")[0]
    console.log(previousTabBut)
    previousTabBut.setAttribute("class", previousTabBut.getAttribute("class").split(" ")[0] == "" ? previousTabBut.getAttribute("class").split(" ")[1] : previousTabBut.getAttribute("class").split(" ")[0])

    let newMain = document.getElementById(a.getAttribute("class"))
    console.log(newMain)
    console.log(a)
    newMain.setAttribute("class", newMain.getAttribute("class").replace("unselectedMain", "selectedMain"))
    console.log(newMain)
    console.log(a.getAttribute("class"))
    a.setAttribute("class", a.getAttribute("class").split(" ")[0] + " selectedTab")
}