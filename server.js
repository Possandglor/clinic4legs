const http = require('http');
const express = require('express');
const fs = require("fs")
const cors = require('cors');
const path = require('path')
const app = express();
const hostname = '0.0.0.0';
const port = 3000;
let scriptUrl = "https://script.google.com/macros/s/AKfycbwHdxighbGpBuXRTClaZVFWh6YZ4JNiYDCwMizV0u6478sQu8EGl3nkJe40K_j5lS_9/exec"
async function postData(url = "", data = {}) {
    console.log(data)
    // Default options are marked with *
    const response = await fetch(url, {
        // mode: 'no-cors',
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.text(); // parses JSON response into native JavaScript objects
}

// Функция для чтения базы данных из JSON-файла
function readDatabase() {
    const data = fs.readFileSync("data/db.json");
    return JSON.parse(data);
}

// Функция для записи базы данных в JSON-файл
function writeDatabase(database) {
    fs.writeFileSync("data/db.json", JSON.stringify(database, null, 4));
}

app.use(cors())
app.use(express.static(__dirname + "\\site"));
app.use(express.json());
// Определяем маршрут для обработки запросов к корневому URL
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '\\index.html'));
});
app.post("/cal", (req, res) => {
    postData(scriptUrl, { event: "get", age: 25 })
        .then((data) => {
            res.setHeader('Content-Type', 'application/json');
            processVisitList(data.split("\n"))
            let allEventsFromCal = readDatabase()

            res.send(JSON.stringify(allEventsFromCal))
        });
});
app.post("/calCreate", (req, res) => {
    postData(scriptUrl, req.body)
        .then((data) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(data)
        });
});

app.post("/getDataBase", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(readDatabase()))
});

// Запускаем сервер
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
function startServer() {

}



// Функция для обработки списка посещений из API
function processVisitList(visitList) {
    const database =  readDatabase();
    for (visit of visitList) {
        const phoneNumberMatch = visit.match(/\d{9,}/); // Ищем последовательность из 9 и более цифр (предполагаемый номер телефона)
        const phoneNumber = phoneNumberMatch ? phoneNumberMatch[0].slice(-10) : null;
        if (phoneNumber) {
            const visitInfo = visit.split('|');
            const visitDateStartTime = new Date(visitInfo[1]);
            const visitDateEndTime = new Date(visitInfo[2]);

            // Проверка наличия клиента в базе данных
            const existingClient = database.ClientList.find(client => client.phoneNumber === phoneNumber);

            if (!existingClient) {
                // Если клиента нет в базе данных, добавляем его
                const newClient = {
                    FIO: "",
                    phoneNumber: phoneNumber,
                    petName: "",
                    petSex: "",
                    petBreed: "",
                    petBirthDate: "",
                    comment: "",
                    analyses: []
                };
                database.ClientList.push(newClient);
            }

            console.log()
            // Проверка наличия информации о посещении клиента в указанное время
            const existingVisit = database.VisitList.find(visit => {
                return new Date(visit.dateStart).toISOString() === visitDateStartTime.toISOString() && visit.phoneNumber === phoneNumber
            });

            if (!existingVisit) {
                // Если информации о посещении нет, добавляем ее
                const newVisit = {
                    dateStart: visitDateStartTime.toISOString(),
                    dateEnd: visitDateEndTime.toISOString(),
                    phoneNumber: phoneNumber,
                    vid: "",
                    anamnez: "",
                    appointment: "",
                    status: "",
                    title: visitInfo[0]
                };
                database.VisitList.push(newVisit);
            }
        }
    };

    // Записываем обновленную базу данных в JSON-файл
    writeDatabase(database);
}
