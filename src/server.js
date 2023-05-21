const http = require('http');
const express = require('express');
const fs = require("fs")
const cors = require('cors');
const path = require('path')
const app = express();
const hostname = '0.0.0.0';
const port = 3000;


let serverDataBase = JSON.parse(fs.readFileSync("src/db.json"))

var isServer = true
let index2 = fs.readFileSync("src/index.html", encoding = "utf8")
console.log(index2)
index2 = index2.replace("changedip", myip)
console.log(index2)
console.log(myip)
fs.writeFileSync("src/index.html", index2)
// Устанавливаем путь к статическим файлам
app.use(cors())
app.use(express.static(__dirname + "\\src"));
app.use(express.json());
// Определяем маршрут для обработки запросов к корневому URL
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '\\src\\index2.html'));
});
app.post("/cal", (req, res) => {
    console.log(req)
    postData("https://script.google.com/macros/s/AKfycbwyDtsQfrPeUCQ6qDqY5jYQNj-RyPGVASff5kExRIJvmRjVdBGDrmU3JDIrbDCIeVZi/exec", { event: "get", age: 25 })
        .then((data) => {
            res.setHeader('Content-Type', 'application/json');
            let allEventsFromCal = {
                "array": data.split("\n")
            }
            res.send(JSON.stringify(allEventsFromCal))
        });
});

app.post("/getDataBase", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(serverDataBase))
});

// Запускаем сервер
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
function startServer() {

}