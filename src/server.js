const http = require('http');
const express = require('express');
const fs = require("fs")
const cors = require('cors');
const path = require('path')
const app = express();
const hostname = '0.0.0.0';
const port = 3000;





function startServer() {
    // Устанавливаем путь к статическим файлам
    app.use(cors())
    app.use(express.static(__dirname + "\\src"));
    console.log(__dirname)
    // Определяем маршрут для обработки запросов к корневому URL
    app.get('/', (req, res) => {
        console.log(req.params)
        console.log(req.body)
        console.log(req.url)
        res.setHeader('Content-Type', 'text/html');
        res.sendFile(path.join(__dirname, '\\src\\index2.html'));
    });
    app.post("/cal", (req, res) => {
        postData("https://script.google.com/macros/s/AKfycbwyDtsQfrPeUCQ6qDqY5jYQNj-RyPGVASff5kExRIJvmRjVdBGDrmU3JDIrbDCIeVZi/exec", { event: "get", age: 25 })
            .then((data) => {
                // console.log(data); // JSON data parsed by `response.json()` call
                res.setHeader('Content-Type', 'application/json');
                let allEventsFromCal = {
                    "array":data.split("\n")
                }
                res.send(JSON.stringify(allEventsFromCal))
            });
    });
    // Запускаем сервер
    app.listen(3000, () => {
        console.log('Сервер запущен на порту 3000');
    });
}