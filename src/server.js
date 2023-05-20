const http = require('http');
const express = require('express');
const fs = require("fs")
const cors = require('cors');
const path = require('path')
const app = express();
const hostname = '0.0.0.0';
const port = 3000;


let clientList = JSON.parse(fs.readFileSync("src/db.json")).ClientList
let visitList = JSON.parse(fs.readFileSync("src/db.json")).VisitList


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
    postData("https://script.google.com/macros/s/AKfycbwyDtsQfrPeUCQ6qDqY5jYQNj-RyPGVASff5kExRIJvmRjVdBGDrmU3JDIrbDCIeVZi/exec", { event: "get", age: 25 })
        .then((data) => {
            res.setHeader('Content-Type', 'application/json');
            let allEventsFromCal = {
                "array": data.split("\n")
            }
            res.send(JSON.stringify(allEventsFromCal))
        });
});

app.post("/searchClient", (req, res) => {
    let searchParams = req.body
    let answer = []
    for (let a of clientList) {
        if (a.FIO.includes(searchParams.FIO) && a.phoneNumber.includes(searchParams.phoneNumber) && a.petName.includes(searchParams.petName))
            answer.push(a)
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(answer))
});
function startServer() {

    // Запускаем сервер
    app.listen(3000, () => {
        console.log('Сервер запущен на порту 3000');
    });
}