const http = require('http');
const os = require('os');
const express = require('express');
const fs = require("fs")
const cors = require('cors');
const path = require('path')
const app = express();
const hostname = '0.0.0.0';
const port = 3000;
var currentIP = ""

let scriptUrl = "https://script.google.com/macros/s/AKfycbw8PUmWsUd5_c8JrqouQ2GMJmhMutNXFjBIzEjRfWmXCJ1hbby3HS1KU56g6OAFCgfT/exec"
async function postData(url = "", data = {}) {
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

app.post("/currentIP", (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify({ currentIP: currentIP }))
})
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, '\\index.html'));
});


app.post("/cal", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let allEventsFromCal = readDatabase()
    res.send(JSON.stringify(allEventsFromCal))
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

app.post("/getVisit", (req, res) => {
    const database = readDatabase();
    res.send(database.VisitList.filter(visit =>
        visit.phoneNumber == req.body.phone && visit.dateStart == new Date(req.body.dateStart).toISOString()))
});

app.post("/newVisit", (req, res) => {
    res.send(JSON.stringify({ result: "ok" }))
    console.log(req.body)
    const database = readDatabase();
    database.VisitList.push(req.body);
    writeDatabase(database);
})

app.post("/saveVisit", (req, res) => {
    const database = readDatabase();

    for (var i = 0; i < database.VisitList.length; i++) {
        var visit = database.VisitList[i];
        if (
            visit.phoneNumber == req.body.old.phoneNumber &&
            visit.dateStart == new Date(req.body.old.dateStart).toISOString() &&
            visit.title == req.body.old.title
        ) {
          database.VisitList[i] = req.body.new;
          break;
        }
      }
    writeDatabase(database)
    postData(scriptUrl, { event: "change", old: req.body.old, new: req.body.new })
        .then((data) => {
        });
    res.send(JSON.stringify({ result: "ok" }))

});

app.post("/deleteVisit", (req, res) => {
    res.send(JSON.stringify({ result: "ok" }))
    const database = readDatabase();
    // for (visit of database.VisitList) {
    //     if (visit.phoneNumber == req.body.phoneNumber && visit.dateStart == new Date(req.body.dateStart).toISOString() && visit.title == req.body.title) {
    //         database.VisitList.remove(visit)
    //         break;
    //     }
    // }
    for (let i = 0; i < database.VisitList.length; i++) {
        const visit = database.VisitList[i];
        if (
            visit.phoneNumber == req.body.phoneNumber &&
            visit.dateStart == new Date(req.body.dateStart).toISOString() &&
            visit.title == req.body.title
        ) {
            database.VisitList.splice(i, 1); // Используем метод splice() для удаления элемента
            break;
        }
    }
    writeDatabase(database)
    postData(scriptUrl, { event: "delete", dateStart: req.body.dateStart, title: req.body.title })
        .then((data) => {

            res.send({ result: "ok" })
        });
});



app.post("/newClient", (req, res) => {
    res.send(JSON.stringify({ result: "ok" }))
    const database = readDatabase();
    database.ClientList.push(req.body);
    writeDatabase(database);
})

app.post("/deleteClient", (req, res) => {
    res.send(JSON.stringify({ result: "ok" }))
    const database = readDatabase();

    for (let i = 0; i < database.ClientList.length; i++) {
        const client = database.ClientList[i];
        if (
            client.FIO == req.body.FIO &&
            client.phoneNumber == req.body.phoneNumber &&
            client.petName == req.body.petName
        ) {
            database.ClientList.splice(i, 1); // Используем метод splice() для удаления элемента
            break;
        }
    }

    writeDatabase(database);
})

app.post("/saveClient", (req, res) => {
    const database = readDatabase();
    for (var i = 0; i < database.ClientList.length; i++) {
        var client = database.ClientList[i];
        if (
          client.phoneNumber == req.body.old.phoneNumber &&
          client.FIO == req.body.old.FIO &&
          client.petName == req.body.old.petName
        ) {
          database.ClientList[i] = req.body.new;
          console.log(req.body.new);
          break;
        }
      }
    console.log(database.ClientList)
    writeDatabase(database)
    res.send(JSON.stringify({ result: "ok" }))
});

// Запускаем сервер
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});


// Получение информации о сетевых интерфейсах
const networkInterfaces = os.networkInterfaces();

// Перебор сетевых интерфейсов и вывод информации
for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
            currentIP = iface.address + ":3000"
        }
    }
}

// Обновление данных из календаря раз в 30 секунд
setInterval(() => {
    console.log("interval request")
    postData(scriptUrl, { event: "get" })
        .then((data) => {
            processVisitList(data.split("\n"))
        });
}, 30000);

// Функция для обновления списка посещений из API
function processVisitList(visitList) {
    const database = readDatabase();
    for (client of visitList) {
        const phoneNumberMatch = client.match(/\d{9,}/); // Ищем последовательность из 9 и более цифр (предполагаемый номер телефона)
        const phoneNumber = phoneNumberMatch ? phoneNumberMatch[0].slice(-10) : null;
        if (phoneNumber) {
            const visitInfo = client.split('|');
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




